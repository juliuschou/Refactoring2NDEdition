// node ./node_modules/.bin/babel-node src/xx.js
// ./node_modules/.bin/babel src --out-dir dist

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

function statement(invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;
 
    for (let perf of invoice['performances']) {
        const play = plays[perf.playID];

        // print line for this order    
        result += ` ${play.name}: ${usd(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
    }
 
    let totalAmount = 0;
    for (let perf of invoice['performances']) {
        totalAmount += amountFor(perf);
    }

    let volumeCredits = totalVolumeCredits(invoice);
    
    result += `Amount owed is ${usd(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}


function totalVolumeCredits(invoice){
    let result = 0;
    for (let perf of invoice['performances']) {
        result += volumeCreditsFor(perf);
    }
    return result;
}

function volumeCreditsFor(aPerformance){
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ('comedy' === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);

    return result;
}

function usd(aNumber){
   //const format = new Intl.NumberFormat("en-­US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format;

    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(aNumber);
}

function amountFor(aPerformance) {
    let result = 0;
    const play = playFor(aPerformance);
    switch (play.type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}
