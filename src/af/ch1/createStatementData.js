
export default function createStatementData (invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);

    return statementData;    

    function enrichPerformance(aPerformance) {
        const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }     
    
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }    
    
    function volumeCreditsFor(aPerformance){
        return new PerformanceCalculator(aPerformance, playFor(aPerformance)).volumeCredits;
    }
    
    /*
        https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
        arr.reduce(callback[accumulator, currentValue, currentIndex, array], initialValue)
     */

    function totalAmount(data) {
        return data.performances
        .reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        return data.performances
        .reduce((total, p) => total + p.volumeCredits, 0);
    }    
}

class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() {
        let result = 0;
        switch (this.play.type) {
            case "tragedy":
                result = 40000;
                if (this.performance.audience > 30) {
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw new Error(`unknown type: ${this.play.type}`);
        }
        return result;
    }

    get volumeCredits(){
        let result = 0;
        result += Math.max(this.performance.audience - 30, 0);
        if ('comedy' === this.performance.play.type) result += Math.floor(this.performance.audience / 5);
    
        return result;
    }


}

/*
https://larry850806.github.io/2016/09/20/shallow-vs-deep-copy/
Object.assign
Object.assign是 ES6 的新函式
可以幫助我們達成跟上面一樣的功能

var obj1 = { a: 10, b: 20, c: 30 };
var obj2 = Object.assign({}, obj1);
obj2.b = 100;

console.log(obj1); // { a: 10, b: 20, c: 30 } <-- 沒被改到
console.log(obj2); // { a: 10, b: 100, c: 30 }
Object.assign({}, obj1)的意思是先建立一個空物件{}
接著把obj1中所有的屬性複製過去
所以obj2會長得跟obj1一樣
這時候再修改obj2.b也不會影響obj1

因為Object.assign跟我們手動複製的效果相同
所以一樣只能處理深度只有一層的物件
沒辦法做到真正的 Deep Copy
不過如果要複製的物件只有一層的話可以考慮使用他

=============================================================
轉成 JSON 再轉回來
用JSON.stringify把物件轉成字串
再用JSON.parse把字串轉成新的物件

var obj1 = { body: { a: 10 } };
var obj2 = JSON.parse(JSON.stringify(obj1));
obj2.body.a = 20;

console.log(obj1); // { body: { a: 10 } } <-- 沒被改到
console.log(obj2); // { body: { a: 20 } }
console.log(obj1 === obj2); // false
console.log(obj1.body === obj2.body); // false
這樣做是真正的 Deep Copy
但只有可以轉成JSON格式的物件才可以這樣用
像function沒辦法轉成JSON

var obj1 = { fun: function(){ console.log(123) } };
var obj2 = JSON.parse(JSON.stringify(obj1));

console.log(typeof obj1.fun); // 'function'
console.log(typeof obj2.fun); // 'undefined' <-- 沒複製
要複製的function會直接消失
所以這個方法只能用在單純只有資料的物件
=================================================================
jquery
相信大家應該都很熟悉 jquery 這個 library
jquery 有提供一個$.extend可以用來做 Deep Copy

var $ = require('jquery');

var obj1 = {
    a: 1,
    b: { f: { g: 1 } },
    c: [1, 2, 3]
};

var obj2 = $.extend(true, {}, obj1);
console.log(obj1.b.f === obj2.b.f); // false
===================================================================
lodash
另外一個很熱門的函式庫 lodash
也有提供_.cloneDeep用來做 Deep Copy

var _ = require('lodash');

var obj1 = {
    a: 1,
    b: { f: { g: 1 } },
    c: [1, 2, 3]
};

var obj2 = _.cloneDeep(obj1);
console.log(obj1.b.f === obj2.b.f); // false
*/