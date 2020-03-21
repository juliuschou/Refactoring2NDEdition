// ./node_modules/.bin/babel src --out-dir dist
//  node ./dist/af/ch1SplitPhase/StartingPoint.js

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
    return renderPlainText(invoice, plays);
}

function renderPlainText(invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;

    for (let perf of invoice['performances']) {
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf, playFor(perf)) / 100)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(totalAmount() / 100)}\n`;
    result += `You earned ${totalVolumeCredits()} credits\n`;
    return result;

    function totalAmount(){
        let result = 0;
        for (let perf of invoice['performances']) {
            result += amountFor(perf, playFor(perf));
        }    
        return result;
    }

    function totalVolumeCredits(){
        let result = 0;
        for (let perf of invoice['performances']) {
            result += volumeCreditsFor(perf);
        }
        return result;
    }
    
    function usd(aNumber){
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(aNumber);
    }

    function volumeCreditsFor(aPerformance){
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ('comedy' === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }            

    function amountFor(aPerformance){
        let result = 0;
        
        switch (playFor(aPerformance).type) {
            case 'tragedy':
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case 'comedy':
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`unknown type: ${playFor(aPerformance).type}`);
        }
       return result;
    }

}