<template>
  <div class="container">
    <div class="lucky-wheel">
      <div class="lucky-title"></div>
      <div class="wheel-main">
        <div class="wheel-pointer" @click="beginRotate()"></div>
        <div class="wheel-bg" :style="rotateStyle">
          <div class="prize-list">
            <div
              class="prize-item"
              v-for="(item,index) in prizeList"
              :key="index"
              :style="item.style"
            >
              <div class="prize-pic">
                <img :src="item.icon" />
              </div>
              <div class="prize-type">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main-bg"></div>
      <div class="bg-p"></div>
      <div class="content">
        <div class="count">今日免费抽奖次数： {{ count}}</div>
      </div>
      <div class="tip">
        <div class="tip-title">活动规则</div>
        <div class="tip-content">
          <p>1.每日签到后，即可获得一次幸运大转盘的机会，仅限当天有效，过期作废。 2.金币抽奖，每10个金豆可兑换一次大转盘机会。</p>
          <p>2.金币抽奖，每10个金豆可以兑换一次大转盘抽奖机会</p>
          <p>3.所中金豆或积分到【我的账户】中查询。累计达到100金豆及以上，可以兑换相应奖品</p>
        </div>
      </div>
    </div>
    <div class="toast" v-show="prize">
      <div class="toast-container">
        <img :src="toastIcon" class="toast-picture" />
        <div class="close" @click="closeToast()"></div>
        <div class="toast-title">{{toastTitle}}</div>
        <div class="toast-btn">
          <div class="toast-cancel" @click="closeToast">关闭</div>
        </div>
      </div>
    </div>
    <div class="toast-mask" v-show="prize"></div>
  </div>
</template>
<script>
import { prizeList } from './config'
const CIRCLE_ANGLE = 360

const config = {
  // 总旋转时间
  duration: 4000,
  // 旋转圈数
  circle: 8,
  mode: 'ease-in-out'
}

export default {
  data() {
    return {
      count: 10, // 剩余抽奖次数
      duration: 3000, // 转盘旋转时间
      prizeList: [], // 奖品列表
      rotateAngle: 0, // 旋转角度
      index: 0,
      prize: null
    };
  },
  created() {
    // 初始化一些值
    this.angleList = []
    // 是否正在旋转
    this.isRotating = false
    // 基本配置
    this.config = config

    // 获取奖品列表
    this.initPrizeList();
  },
  computed: {
    rotateStyle () {
      return `
        -webkit-transition: transform ${this.config.duration}ms ${this.config.mode};
        transition: transform ${this.config.duration}ms ${this.config.mode};
        -webkit-transform: rotate(${this.rotateAngle}deg);
            transform: rotate(${this.rotateAngle}deg);`
    },
    toastTitle () {
      return this.prize && this.prize.isPrize === 1
        ? "恭喜您，获得" +
            this.prize.name
        : "未中奖";
    },
    toastIcon() {
      return this.prize && this.prize.isPrize === 1
        ? require("../assets/img/congratulation.png")
        : require("../assets/img/sorry.png");
    }
  },
  methods: {
    initPrizeList() {
      // 这里可以发起请求，从服务端获取奖品列表
      // 这里使用模拟数据

      this.prizeList = this.formatPrizeList(prizeList)
    },
    // 格式化奖品列表，计算每个奖品的位置
    formatPrizeList (list) {
      // 记录每个奖的位置
      const angleList = []

      const l = list.length
      // 计算单个奖项所占的角度
      const average = CIRCLE_ANGLE / l

      const half = average / 2

      // 循环计算给每个奖项添加style属性
      list.forEach((item, i) => {

        // 每个奖项旋转的位置为 当前 i * 平均值 + 平均值 / 2
        const angle = -((i * average) + half)
        // 增加 style
        item.style = `-webkit-transform: rotate(${angle}deg);
                      transform: rotate(${angle}deg);`

        // 记录每个奖项的角度范围
        angleList.push((i * average) + half )
      })

      this.angleList = angleList

      return list
    },
    beginRotate() {
      // 添加次数校验
      
      if(this.count === 0) return

      // 开始抽奖
      // 这里这里向服务端发起请求，得到要获得的奖
      // 可以返回下标，也可以返回奖品 id，通过查询 奖品列表，最终得到下标

      // 随机获取下标
      this.index = this.random(this.prizeList.length - 1);

      // 减少剩余抽奖次数
      this.count--
  
      // 开始旋转
      this.rotating()
    },
    random (max, min = 0) {
      return parseInt(Math.random() * (max - min + 1) + min)
    },
    rotating() {
      const { isRotating, angleList, config, rotateAngle, index } = this

      if (isRotating) return

      this.isRotating = true
    
      // 计算角度
      const angle =
          // 初始角度
          rotateAngle +
          // 多旋转的圈数
          config.circle * CIRCLE_ANGLE +
          // 奖项的角度
          angleList[index] -
          (rotateAngle % CIRCLE_ANGLE)

          
        this.rotateAngle = angle

        // 旋转结束后，允许再次触发
        setTimeout(() => {
          
          this.rotateOver()
        }, config.duration + 1000)
    },
    rotateOver () {
      this.isRotating = false

      this.prize = prizeList[this.index]

      console.log(this.prize, this.index)
    },
    //关闭弹窗
    closeToast() {
      this.prize = null;
    }
  }
};
</script>
<style scoped>
.container {
  width: 100%;
}
.lucky-wheel {
  width: 100%;
  background: rgb(252, 207, 133) url("../assets/img/color_pillar.png") no-repeat
    center bottom;
  background-size: 100%;
  padding-top: 20px;
}
.lucky-title {
  width: 100%;
  height: 8.125rem;
  background: url("../assets/img/lucky_title.png") no-repeat center top;
  background-size: 100%;
}
.wheel-main {
  margin: 0 auto;
  position: relative;
  width: 295px;
  height: 295px;
}
.wheel-bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: url("../assets/img/draw_wheel.png") no-repeat center top;
  background-size: 100%;
  color: #fff;
}
.wheel-pointer {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  width: 85px;
  height: 85px;
  background: url("../assets/img/draw_btn.png") no-repeat center top;
  background-size: 100%;
  transform: translate3d(-50%, -50%, 0);
}
.wheel-bg div {
  text-align: center;
}
.prize-list {
  width: 100%;
  height: 100%;
  position: relative;
}
.prize-list .prize-item {
  position: absolute;
  width: 95px;
  height: 150px;
  top: 0;
  left: 50%;
  margin-left: -47.5px;
  transform-origin: 50% 100%;
}

.prize-pic img {
  width: 4.0625rem;
  height: 2.5rem;
  margin-top: 1.5625rem;
}
.prize-count {
  font-size: 0.875rem;
}
.prize-type {
  font-size: 0.75rem;
}
.main {
  position: relative;
  width: 100%;
  min-height: 14.25rem;
  background: rgb(243, 109, 86);
  padding-bottom: 1.6875rem;
}
.main-bg {
  width: 100%;
  height: 6.5625rem;
  position: absolute;
  top: -3.4375rem;
  left: 0;
  background: url("../assets/img/luck_bg.png") no-repeat center top;
  background-size: 100%;
}
.bg-p {
  width: 100%;
  height: 2.95rem;
  background: rgb(252, 207, 133);
}
.content {
  position: absolute;
  top: 0.175rem;
  left: 0;
  background: rgb(243, 109, 86);
  width: 100%;
  height: 5.1875rem;
  font-size: 1.125rem;
  color: #ffeb39;
  padding-left: 6.75rem;
}
.content div {
  text-align: left;
}
.tip {
  position: relative;
  margin: 2.5rem auto 0;
  width: 17.5rem;
  border: 1px solid #fbc27f;
}
.tip-title {
  position: absolute;
  top: -1rem;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 1rem;
  color: #fccc6e;
  background: rgb(243, 109, 86);
  padding: 0.3125rem 0.625rem;
}
.tip-content {
  padding: 1.5625rem 0.625rem;
  font-size: 0.875rem;
  color: #fff8c5;
  line-height: 1.5;
}
.toast-mask {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  width: 100%;
  height: 100%;
}
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 20000;
  transform: translate(-50%, -50%);
  width: 15.4375rem;
  background: #fff;
  border-radius: 0.3125rem;
  padding: 0.3125rem;
  background-color: rgb(252, 244, 224);
}
.toast-container {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px dotted #fccc6e;
}
.toast-picture {
  position: absolute;
  top: -6.5rem;
  left: -1.5rem;
  width: 18.75rem;
  height: 8.5625rem;
}
.toast-pictrue-change {
  position: absolute;
  top: -1.5rem;
  left: -1.375rem;
  width: 17.5rem;
  height: 3.125rem;
}
.toast-title {
  padding: 2.8125rem 0;
  font-size: 18px;
  color: #fc7939;
  text-align: center;
}
.toast-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.9375rem;
}
.toast-btn div {
  background-image: -moz-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );

  background-image: -ms-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );
  background-image: -webkit-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );
  box-shadow: 0px 4px 0px 0px rgba(174, 34, 5, 0.7);
  width: 4.6875rem;
  height: 1.875rem;
  border-radius: 1.875rem;
  text-align: center;
  line-height: 1.875rem;
  color: #fff;
}
.close {
  position: absolute;
  top: -0.9375rem;
  right: -0.9375rem;
  width: 2rem;
  height: 2rem;
  background: url("../assets/img/close_store.png") no-repeat center top;
  background-size: 100%;
}
</style>

