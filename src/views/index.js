import '@/common/base.less'
import './index.less'
$('.main').text('jquery')
import {getStr} from '@/common/utils'
let a = getStr('我是common')
console.log(a)
const t1 = require('@/common/test');
t1('1')
// const ax = require('axios')
// import axios from 'axios'
let data = [
    {
        city:'sz',
        data:{
            date: '20180101',
            num: 1,
            total: 20
        }
    },
    {
        city:'sz',
        data:{
            date: '20180102',
            num: 3,
            total: 22
        }
    },
    {
        city:'sz',
        data:{
            date: '20180101',
            num: 4,
            total: 11
        }
    },
    {
        city:'bj',
        data:{
            date: '20180101',
            num: 5,
            total: 22
        }
    },
    {
        city:'sh',
        data:{
            date: '20180101',
            num: 1,
            total: 23
        }
    }
]
// 数组重新分组
function groupArr(arr,key,cb){
    let obj = {}
    let newArr = []
    arr.forEach((item,index) => {
        if(!obj[item[key]]){
            obj[item[key]] = []
        }
        obj[item[key]].push(item)
    })
    return obj
}
console.log(groupArr(data,'city'))

