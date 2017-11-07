<template>
    <div class="container">
        <div class="lucky-wheel">
            <div class="lucky-title"></div>
            <div class="wheel-main">
                <div class="wheel-pointer-box">
                     <div class="wheel-pointer" @click="rotate_handle()" :style="{transform:rotate_angle_pointer,transition:rotate_transition_pointer}"></div>
                </div>               
                <div class="wheel-bg" :style="{transform:rotate_angle,transition:rotate_transition}">                   
                    <div class="prize-list">
                        <div class="prize-item" v-for="(item,index) in prize_list" :key="index">
                            <div class="prize-pic">
                                <img :src="item.picture">
                            </div>
                            <div class="prize-count">
                                {{item.change}}
                            </div>
                            <div class="prize-type">
                                {{item.zh_name}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main">
            <div class="main-bg"></div>
            <div class="bg-p"></div>
            <div class="content">
                <div class="beans">您的金豆： {{ easejoy_bean}}豆</div>
                <div class="lottery_ticket">今日免费抽奖次数： {{ lottery_ticket}}</div>
            </div>
            <div class="tip">
                <div class="tip-title">活动规则</div>
                <div class="tip-content">
                    <p> 1.每日签到后，即可获得一次幸运大转盘的机会，仅限当天有效，过期作废。 2.金币抽奖，每10个金豆可兑换一次大转盘机会。</p>
                    <p> 2.金币抽奖，每10个金豆可以兑换一次大转盘抽奖机会</p>
                    <p> 3.所中金豆或积分到【我的账户】中查询。累计达到100金豆及以上，可以兑换相应奖品</p>
                </div>
            </div>
        </div>
        <div class="toast" v-show="toast_control">
            <div class="toast-container">
                <img :src="toast_pictrue" class="toast-picture" v-show="toast_back">
                <img src="../assets/img/wheel_toast_1.png" class="toast-pictrue-change" v-show="!toast_back">
                <div class="close" v-show="!toast_back" @click="close_toast()"></div>
                <div class="toast-title">
                    {{toast_title}}
                </div>
                <div class="toast-btn">
                    <div class="toast-confirm" v-if="!toast_back" @click="confirm_exchange()">确认</div>
                    <div class="toast-cancel" v-else @click="close_toast">关闭</div>
                </div>
            </div>
        </div>
        <div class="toast-mask" v-show="toast_control"></div>
    </div>
</template>
<script>
import { prize_list_json } from "../assets/js/database.js" //此奖品数组为服务器请求得到的json数据,进过处理，赋值给prize_list
export default {
  data() {
    return {
      easejoy_bean: 0, //金豆
      lottery_ticket: 0, //抽奖次数
      prize_list: [], //奖品列表
      toast_control: false, //抽奖结果弹出框控制器
      toast_pictrue: require("../assets/img/congratulation.png"), //抽奖结果标题图片src
      toast_title: "恭喜你，获得10积分", //抽奖结果文本反馈
      toast_back: false, //抽奖结果toast中是否为确认按钮
      start_rotating_degree: 0, //初始旋转角度
      rotate_angle: 0, //将要旋转的角度
      start_rotating_degree_pointer: 0, //指针初始旋转角度
      rotate_angle_pointer: 0, //指针将要旋转的度数
      rotate_transition: "transform 6s ease-in-out", //初始化选中的过度属性控制
      rotate_transition_pointer: "transform 12s ease-in-out", //初始化指针过度属性控制
      click_flag: true, //是否可以旋转抽奖
      i: 0 //测试使用
    };
  },  
  created(){
      this.init_prize_list(prize_list_json.prizes)
  },
  methods: {
      //此方法为处理奖品数据
    init_prize_list(list){
        for(var i=0;i<list.length;i++){
            var tmp = list[i];
            if(tmp.name=='point'){
                list[i].zh_name = '积分'
            }else if(tmp.name == 'easejoy_bean'){
                list[i].zh_name = '金豆'
            }else{
                list[i].zh_name = " "
            }
            list[i].picture = require("../assets/img/"+this.init_prize_icon(list[i].type));            
        }
        this.prize_list = list;
        console.log(list);
    },
    //此方法为初始化奖品图标
    init_prize_icon(type){
        switch (type) {
            case 'nothing':return 'give_up.png'
                
                break;
            case '10-beans':return 'bean_ten.png'
                
                break;
            case '5-point':return 'point_five.png'
                
                break;
            case '5-beans':return 'bean_five.png'
                
                break;
            case '10-point':return 'point_ten.png'
                
                break;
            case '2-beans':return 'bean_two.png'
                
                break;
            case 'most-beans':return 'bean_500.png'
                
                break;
            case '1-bean':return 'bean_one.png'
                
                break;
            
        }
    },
    rotate_handle() {
      this.rotating();
      this.i = this.i + 2;     
    },
    rotating(index) {
      if (!this.click_flag) return;
      var type = 0; // 默认为 0  转盘转动 1 箭头和转盘都转动(暂且遗留)
      var during_time = 5; // 默认为1s
      var random = Math.floor(Math.random()*7)
      var result_index = index || random; // 最终要旋转到哪一块，对应prize_list的下标
      var result_angle = [337.5, 292.5, 247.5, 202.5, 157.5, 112.5, 67.5, 22.5]; //最终会旋转到下标的位置所需要的度数
      var rand_circle = 6; // 附加多转几圈，2-3
      this.click_flag = false; // 旋转结束前，不允许再次触发
      if (type == 0) {
        // 转动盘子
        var rotate_angle =
          this.start_rotating_degree +
          rand_circle * 360 +
          result_angle[result_index] -
          this.start_rotating_degree % 360;
        this.start_rotating_degree = rotate_angle;
        this.rotate_angle = "rotate(" + rotate_angle + "deg)";
        // // //转动指针
        // this.rotate_angle_pointer = "rotate("+this.start_rotating_degree_pointer + 360*rand_circle+"deg)";
        // this.start_rotating_degree_pointer =360*rand_circle;
        var that = this;
        // 旋转结束后，允许再次触发
        setTimeout(function() {
          that.click_flag = true;
           that.winning()
        }, during_time * 1000);
      } else {
        //
      }
    },
    //中奖函数，需传入中奖结果 string 
    winning(result){
        this.toast_control = true;
        this.toast_title = result?result:this.toast_title;
        this.toast_back = true;
    },
    //没有中奖函数，无需传入
    fail(){
        this.toast_control = true;
        this.toast_pictrue =require('../assets/img/sorry.png');
        this.toast_title = '不要灰心';
        this.toast_back = true;
    },
    //我要金豆，-10换取抽奖机会,参数count number类型，使用count个金豆换取一次抽奖机会
    exchange(count){
       this.toast_control = true;     
       this.toast_title = '-'+count+"金豆换取一次抽奖机会";
       this.toast_back = false;
    },
    //金豆不足函数
    quantity(){
        this.toast_control = true;     
       this.toast_title = "金豆数量不够";
       this.toast_back = false;
    },
    //关闭抽奖结果
    close_toast(){
        this.toast_control = false;
    },
    //确认兑换函数
    confirm_exchange(){
        this.toast_control = false;
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
  height: 31.5625rem;
  background: rgb(252, 207, 133) url("../assets/img/color_pillar.png") no-repeat
    center bottom;
  background-size: 100%;
  padding-top: 1.5625rem;
}
.lucky-title {
  width: 100%;
  height: 8.125rem;
  background: url("../assets/img/lucky_title.png") no-repeat center top;
  background-size: 100%;
}
.wheel-main {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.wheel-bg {
  width: 18.4375rem;
  height: 18.4375rem;
  background: url("../assets/img/draw_wheel.png") no-repeat center top;
  background-size: 100%;
  color: #fff;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  transition: transform 3s ease;
}
.wheel-pointer-box {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 100;
  transform: translate(-50%, -60%);
  width: 5.3125rem;
  height: 5.3125rem;
}
.wheel-pointer {
  width: 5.3125rem;
  height: 5.3125rem;
  background: url("../assets/img/draw_btn.png") no-repeat center top;
  background-size: 100%;
  transform-origin: center 60%;
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
  top: 0;
  left: 0;
  z-index: 2;
}
.prize-list .prize-item:first-child {
  top: 0;
  left: 8.3125rem;
  transform: rotate(20deg);
}
.prize-list .prize-item:nth-child(2) {
  top: 2.8rem;
  left: 10.8rem;
  transform: rotate(67deg);
}
.prize-list .prize-item:nth-child(3) {
  top: 6.4rem;
  left: 10.6rem;
  transform: rotate(-250deg);
}
.prize-list .prize-item:nth-child(4) {
  top: 9rem;
  left: 8.2125rem;
  transform: rotate(-210deg);
}
.prize-list .prize-item:nth-child(5) {
  top: 9.2125rem;
  left: 4.4rem;
  transform: rotate(-160deg);
}
.prize-list .prize-item:nth-child(6) {
  top: 6.3875rem;
  left: 1.9rem;
  transform: rotate(-111deg);
}
.prize-list .prize-item:nth-child(7) {
  top: 2.8rem;
  left: 1.8125rem;
  transform: rotate(-69deg);
}
.prize-list .prize-item:nth-child(8) {
  top: 0;
  left: 4.5rem;
  transform: rotate(-20deg);
}
.prize-item {
  width: 5.875rem;
  height: 9rem;
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
.toast-pictrue-change{
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
.toast-btn{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: .9375rem;
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
.close{
    position: absolute;
    top: -.9375rem;
    right: -.9375rem;
    width: 2rem;
    height: 2rem;
    background: url('../assets/img/close_store.png') no-repeat center top;
    background-size: 100%;
}
</style>

