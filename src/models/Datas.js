//let CryptoItem = require('./CryptoItem.js');

module.exports = class Datas {
    constructor() {
        this._buy = null;
        this._sell = null;
        this._view = null;
        this._remove = null;
    }

    /**
     * 
     * @param {*} data 
     * @returns {CryptoItem}
     */
    buy(data) {
        if (data != undefined) { this._buy = data }
        return this._buy;
    }

    sell(data) {
        if (data != undefined) { this._sell = data }
        return this._sell
    }

    view(data) {
        if (data != undefined) { this._view = data }
        return this._view;
    }

    remove(data) {
        if (data != undefined) { this._remove = data }
        return this._remove;
    }
}