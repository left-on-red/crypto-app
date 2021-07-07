module.exports = class BankItem {
    constructor(symbol) {
        this.symbol = symbol;
        this._records = [];
    }

    records() { return this._records }

    /**
     * 
     * @param {string} value the value the crypto coin is being bought at
     * @param {string} quantity the quantity of the crypto coin that is being bought
     */
    buy(value, quantity, timestamp) {
        this.records().push({
            type: 'BUY',
            timestamp: timestamp ? timestamp : Date.now(),
            value: value,
            quantity: quantity
        });
    }

    /**
     * 
     * @param {string} value the value the crypto coin is being sold at
     * @param {*} quantity the quantity of the crypto coin that is being sold
     */
    sell(value, quantity, timestamp) {
        this.records().push({
            type: 'SELL',
            timestamp: timestamp ? timestamp : Date.now(),
            value: value,
            quantity: quantity
        });
    }
}