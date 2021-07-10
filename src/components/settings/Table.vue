<template>
    <v-form>
        <v-row style="margin-top: 20px;">
            <v-col />
            <v-col cols="8">
                <v-slider
                    v-model="config.coin_count_decimal"
                    :label="`Total Coins Decimal Places (${config.coin_count_decimal})`"
                    max="6"
                    min="0"
                    tick-size="1"
                    color="accent"
                />

                <v-slider
                    v-model="config.coin_price_decimal"
                    :label="`Coin Price Decimal Places (${config.coin_price_decimal})`"
                    max="6"
                    min="0"
                    tick-size="1"
                    color="accent"
                />

                <v-slider
                    v-model="config.invested_total_decimal"
                    :label="`Total Value Decimal Places (${config.invested_total_decimal})`"
                    max="6"
                    min="0"
                    tick-size="1"
                    color="accent"
                />

                <v-slider
                    v-model="config.average_decimal"
                    :label="`Average Decimal Places (${config.average_decimal})`"
                    max="6"
                    min="0"
                    tick-size="1"
                    color="accent"
                />

                <v-slider
                    v-model="config.profit_dollar_decimal"
                    :label="`Dollar Profit Decimal Places (${config.profit_dollar_decimal})`"
                    max="6"
                    min="0"
                    tick-size="1"
                    color="accent"
                />

                <v-slider
                    v-model="config.profit_percent_decimal"
                    :label="`Percent Profit Decimal Places (${config.profit_percent_decimal})`"
                    max="6"
                    min="0"
                    tick-size="1"
                    color="accent"
                />
            </v-col>
            <v-col />
        </v-row>
    </v-form>
</template>

<script>
import Config from '@/models/Config.js';

export default {
    name: 'Table',
    props: {
        config: {
            type: Config,
            required: true
        }
    }
}

/**this.coin_price_decimal = 5;
        this.coin_count_decimal = 2;
        this.invested_total_decimal = 2;
        this.average_decimal = 2;
        this.profit_dollar_decimal = 2;
        this.profit_percent_decimal = 2;*/
</script>

<style lang="scss" scoped>
    div {
        p {
            background-color: red;
        }
    }
</style>