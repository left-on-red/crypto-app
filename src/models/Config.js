module.exports = class Config {
    constructor(data) {
        this.dark = true;

        this.coin_price_decimal = 5;
        this.coin_count_decimal = 2;
        this.invested_total_decimal = 2;
        this.average_decimal = 2;
        this.profit_dollar_decimal = 2;
        this.profit_percent_decimal = 2;

        if (data != undefined && data != null && typeof data == 'object') {
            let keys = Object.keys(data);
            for (let k = 0; k < keys.length; k++) {
                if (this[keys[k]] != undefined) { this[keys[k]] = data[keys[k]] }
            }
        }
    }
}