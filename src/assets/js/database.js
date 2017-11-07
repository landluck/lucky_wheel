//此js文件为全局固定数据配置，后期修改页面部分数据，从本js文件修改

// 此数组为易趣豆充值页面商品列表，后期如果需要添加商品，从此数组修改
// 此数组为对象数组，对象属性有
// id number 商品id
// beans number 易趣豆数量
// cost number 所需金额
export const commodity_list = [
    {
        id: 1,
        beans: 50,
        cost: 5
    },
    {
        id: 2,
        beans: 100,
        cost: 10
    },
    {
        id: 3,
        beans: 200,
        cost: 20
    },
    {
        id: 4,
        beans: 300,
        cost: 30
    },
    {
        id: 5,
        beans: 400,
        cost: 40
    },
    {
        id: 6,
        beans: 500,
        cost: 50
    },
]
// 此数组为幸运大转盘抽奖页面奖品列表,为json对象数组，对象包含奖品名 类型 key 和 数量     

export const prize_list_json = {
    "prizes": [
        {
            "name": "",
            "change": "",
            "type": "nothing"
        },
        {
            "name": "easejoy_bean",
            "change": 10,
            "type": "10-beans"
        },
        {
            "name": "point",
            "change": 5,
            "type": "5-point"
        },
        {
            "name": "easejoy_bean",
            "change": 5,
            "type": "5-beans"
        },
        {
            "name": "point",
            "change": 10,
            "type": "10-point"
        },
        {
            "name": "easejoy_bean",
            "change": 2,
            "type": "2-beans"
        },
        {
            "name": "easejoy_bean",
            "change": 500,
            "type": "most-beans"
        },
        {
            "name": "easejoy_bean",
            "change": 1,
            "type": "1-bean"
        }
    ]
}
//此数组为游戏记录页面游戏记录数组
export const game_record = [
    {
        game_id: 1,
        datetime: "2017-11-11",
        game: "水水的趣味抢答0821502630水水的趣味抢答0821502630水水的趣味抢答0821502630"
    },
    {
        game_id: 2,
        datetime: "2017-11-10",
        game: "火火的趣味抢答0821502630"
    },
    {
        game_id: 3,
        datetime: "2017-11-9",
        game: "土土的趣味抢答0821502630"
    },
    {
        game_id: 4,
        datetime: "2017-11-8",
        game: "金金的趣味抢答0821502630"
    }
]
//此数组为游戏详情中成员记录
export const person_record = [
    {
        username: '刘德华',
        score: 20,
        easejoy_bean: 200
    },
    {
        username: '刘德华',
        score: 20,
        easejoy_bean: 200
    },
    {
        username: '刘德华',
        score: 20,
        easejoy_bean: 200
    },
    {
        username: '刘德华',
        score: 20,
        easejoy_bean: 200
    },
    {
        username: '刘德华',
        score: 20,
        easejoy_bean: 200
    },
    {
        username: '刘德华',
        score: 20,
        easejoy_bean: 200
    },

    {
        username: '刘德华',
        score: 20,
        easejoy_bean: 200
    },
]