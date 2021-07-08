let CryptoItem = require('./CryptoItem.js');

module.exports = class CryptoList {
    constructor(arr) {
        this._data = [];

        if (arr != undefined && arr != null && arr instanceof Array) {
            for (let a = 0; a < arr.length; a++) { this.push(arr[a]) }
        }
    }

    /**
     * @param {CryptoItem} obj 
     */
    push(obj) { this.data().push(new CryptoItem(obj.name, obj.symbol, obj.price)) }

    /**
     * 
     * @param {string} symbol the symbol of the crypto coin
     */
    pop(symbol) { this.data().splice(this._index_of(symbol), 1) }

    _index_of(symbol) { return this.data().findIndex(value => value.symbol == symbol) }

    /**
     * 
     * @param {string} symbol the symbol of the crypto coin
     * @param {string} price the price of the crypto coin
     */
    update(symbol, price) {
        let index = this._index_of(symbol);
        if (index == -1) { return false }

        this.data()[index].price = price;
        return true;
    }

    /**
     * 
     * @param {string} symbol the symbol of the crypto coin
     * @returns {CryptoItem}
     */
    get(symbol) { return this.data()[this._index_of(symbol)] ? this.data()[this._index_of(symbol)] : null }

    /**
     * 
     * @returns {CryptoItem[]}
     */
    data() { return this._data }

    json() { return JSON.stringify(this._data) }

    duplicate() { return new CryptoList(this.data()) }
}