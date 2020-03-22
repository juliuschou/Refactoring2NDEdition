// ./node_modules/.bin/babel src --out-dir dist
//  node ./dist/af/ch1SplitPhase/statement.js

import createStatementData from './createStatementData.js'

let plays = {
    hamlet: { name: 'Hamlet', type: 'tragedy' },
    'as­like': { name: 'As You Like It', type: 'comedy' },
    othello: { name: 'Othello', type: 'tragedy' }
};

let invoices = [{
    customer: 'BigCo',
    performances: [{
            playID: 'hamlet',
            audience: 55
        },
        {
            playID: 'as­like',
            audience: 35
        },
        {
            playID: 'othello',
            audience: 40
        }
    ]
}];

//console.log(invoices);
let rlt = statement(invoices[0], plays);
console.log(rlt);

let htmlRlt = htmlStatement(invoices[0], plays);
console.log(htmlRlt);

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data['performances']) {
        result += ` ${perf.play.name}: ${usd(perf.amount / 100)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(data.totalAmount / 100)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;
}

function usd(aNumber){
    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(aNumber);
}    

function htmlStatement(invoice, plays) {
    return renderHtml(createStatementData(invoice, plays));
}    

function renderHtml(data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += "<table>\n";
    result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
   
    for (let perf of data.performances) {
        result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
        result += `<td>${usd(perf.amount)}</td></tr>\n`;
    }
    result += "</table>\n";
    result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
    return result;
}