module.exports = class CryptoItem {
    constructor(name, symbol, price) {
        this.name = name;
        this.symbol = symbol;
        this.price = price;
    }

    json() { return JSON.stringify(this) }

    duplicate() { return new CryptoItem(this.name, this.symbol, this.price) }
}