let BankItem = require('./BankItem.js');

module.exports = class BankList {
    constructor(arr) {
        this._data = [];

        if (arr != undefined && arr != null) { return BankList.deserialize(arr) }
    }

    /**
     * @param {string} symbol the symbol of the crypto coin 
     */
    add(symbol) { this.data().push(new BankItem(symbol)) }

    /**
     * 
     * @param {string} symbol the symbol of the crypto coin
     */
    remove(symbol) { this.data().splice(this._index_of(symbol), 1) }

    _index_of(symbol) { return this.data().findIndex(value => value.symbol == symbol) }

    /**
     * 
     * @param {string} symbol the symbol of the crypto coin
     * @param {string} price the price of the crypto coin
     */
    update(symbol, price) { this.data()[this._index_of(symbol)].price = price }

    /**
     * 
     * @param {string} symbol the symbol of the crypto coin
     * @returns {BankItem}
     */
    get(symbol) { return this.data()[this._index_of(symbol)] }

    /**
     * 
     * @returns {BankItem[]}
     */
    data() { return this._data }

    json() {
        let bank = [];
        for (let d = 0; d < this.data().length; d++) {
            let symbol = this.data()[d].symbol;
            let records = this.data()[d].records();
            bank.push({ symbol, records });
        }

        return JSON.stringify(bank);
    }

    /**
     * 
     * @param {any[]} arr 
     * @returns {BankList}
     */
    static deserialize(arr) {
        if (typeof arr == 'string') { arr = JSON.parse(arr) }

        let bank = new BankList();
        
        for (let a = 0; a < arr.length; a++) {
            bank.add(arr[a].symbol);

            for (let r = 0; r < arr[a].records.length; r++) {
                let method;
                if (arr[a].records[r].type == 'BUY') { method = 'buy' }
                else if (arr[a].records[r].type == 'SELL') { method = 'sell' }

                bank.get(arr[a].symbol)[method](arr[a].records[r].value, arr[a].records[r].quantity, arr[a].records[r].timestamp)
            }
        }

        return bank;
    }
}