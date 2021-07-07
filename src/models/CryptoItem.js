module.exports = class CryptoItem {
    constructor(name, symbol, svg, price) {
        this.name = name;
        this.symbol = symbol;
        this.svg = svg;
        this.price = price;
    }

    json() { return JSON.stringify(this) }

    duplicate() { return new CryptoItem(this.name, this.symbol, this.svg, this.price) }
}