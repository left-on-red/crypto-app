<template>
    <tr v-if="data">
        <td :style="`width: 20px;${padding}`"><p style="margin-left: 20px;"><img width="20" height="20" :src="`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/${$vuetify.theme.dark ? 'white' : 'black'}/${symbol.toLowerCase()}.svg`" /></p></td>
        <td :style="padding"><p>{{data.name}}</p></td>
        <td :style="padding"><p>{{symbol}}</p></td>
        <td :style="padding"><p>${{price}}</p></td>
        <td :style="padding" class="d-none d-md-table-cell"><p>{{coins_text}}</p></td>
        <td :style="padding" class="d-none d-md-table-cell"><p>${{totals_text}}</p></td>
        <td :style="padding" class="d-none d-md-table-cell"><p>${{average_text}}</p></td>
        <td class="d-none d-md-table-cell" :style="`${padding}${profit_style}`"><p>{{data ? profit_symbol : ''}}${{pretty_dollar}} ({{pretty_percent}}%)</p></td>
        <td :style="padding" class="d-none d-md-table-cell">
            <v-menu close-on-click nudge-bottom="50">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon color="inactive" large v-bind="attrs" v-on="on" style="float: right; margin: 5px;">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>

                <v-list tile dense transition="scroll-x-reverse-transition">
                    <v-list-item v-for="(option, o) in options" :key="o" dense>
                        <v-divider v-if="o == options.length - 1" />
                        <v-btn text small depressed block height="40" :color="option.color" :disabled="option.disabled" @click="selected_option(o)">{{option.label}}</v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
        </td>
        <td :style="padding" class="d-table-cell d-md-none">
            <v-btn icon class="constant" style="position: absolute; top: 10px; right: 10px;" @click="expanded = !expanded">
                <v-icon v-if="expanded">mdi-chevron-up</v-icon>
                <v-icon v-else>mdi-chevron-down</v-icon>
            </v-btn>
        </td>

        <v-fade-transition>
            <v-row class="d-md-none" v-show="expanded" style="position: absolute; left: 0; top: 48px; width: 100%;">
                <v-col />
                <v-col cols="8">
                    <v-row class="mobile-expanded">
                        <v-col cols="6" style="padding: 0; margin-top: 20px;">
                            <p>Coins</p>
                            <p>Total</p>
                            <p>Average</p>
                            <p>Profit</p>
                        </v-col>
                        <v-col cols="6" style="padding: 0; margin-top: 20px;">
                            <p>{{coins_text}}</p>
                            <p>${{totals_text}}</p>
                            <p>${{average_text}}</p>
                            <p :style="profit_style">{{data ? profit_symbol : ''}}${{pretty_dollar}} ({{pretty_percent}}%)</p>
                        </v-col>
                        <v-col cols="12" style="text-align: center; margin-top: -10px;">
                            <v-btn v-for="(option, o) in options" :key="o" text small depressed height="40" :color="option.color" :disabled="option.disabled" @click="selected_option(o)">{{option.label}}</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col />
            </v-row>
        </v-fade-transition>
    </tr>

    <tr v-else>
        <td></td>
        <td><p><v-skeleton-loader type="text" width="100" /></p></td>
        <td><p><v-skeleton-loader type="text" width="50" /></p></td>
        <td><p><v-skeleton-loader type="text" width="90" /></p></td>
        <td class="d-none d-md-table-cell"><p><v-skeleton-loader type="text" width="50" /></p></td>
        <td class="d-none d-md-table-cell"><p><v-skeleton-loader type="text" width="75" /></p></td>
        <td class="d-none d-md-table-cell"><p><v-skeleton-loader type="text" width="60" /></p></td>
        <td class="d-none d-md-table-cell"><p><v-skeleton-loader type="text" width="160" /></p></td>
        <td></td>
    </tr>
</template>

<script>

import BigDecimal from 'js-big-decimal';

import CryptoList from '@/models/CryptoList.js';
import BankList from '@/models/BankList.js';

export default {
    name: 'CryptoRow',

    props: {
        symbol: {
            type: String,
            required: true
        },

        crypto: {
            type: CryptoList,
            required: true
        },

        bank: {
            type: BankList,
            required: true
        }
    },

    data: () => ({
        expanded: false
    }),

    computed: {
        options() {
            return [
                { label: 'buy', color: 'dimmer', disabled: false },
                { label: 'sell', color: 'dimmer', disabled: this.coins.compareTo(this.decimal('0.00')) == 0 },
                { label: 'view', color: 'dimmer', disabled: false },
                { label: 'remove', color: 'error', disabled: false }
            ]
        },

        padding() {
            if (this.expanded && ['xs', 'sm'].includes(this.$mq)) { return 'height: 270px;' }
            else { return '' }
        },

        data() { return this.crypto._data[this.crypto._data.findIndex(value => value.symbol == this.symbol)] },

        price() {
            return this.data ? this.decimal(this.data.price).round(5, BigDecimal.RoundingModes.FLOOR).getPrettyValue() : '-.--';
        },

        coins() {
            let coins = this.decimal('0');
            let records = this.bank.get(this.symbol).records();
            for (let r = 0; r < records.length; r++) {
                if (records[r].type == 'BUY') { coins = coins.add(this.decimal(records[r].quantity)) }
                else if (records[r].type == 'SELL') { coins = coins.subtract(this.decimal(records[r].quantity)) }
            }

            return coins;
        },

        coins_text() { return this.coins.getPrettyValue() },

        totals() {
            return this.coins.multiply(this.decimal(this.data.price)).round(2);
            //return this.data ? this.coins.multiply(this.decimal(this.data.price)).round(2) : this.decimal('0.00')
        },

        value() {
            let records = this.bank.get(this.symbol).records();
            let value = this.decimal('0.00');

            for (let r = 0; r < records.length; r++) {
                if (records[r].type == 'BUY') { value = value.add(this.decimal(records[r].value).multiply(this.decimal(records[r].quantity))) }
                else if (records[r].type == 'SELL') { value = value.subtract(this.decimal(records[r].value).multiply(this.decimal(records[r].quantity))) }
            }

            return value;
        },

        totals_text() { return this.totals.getPrettyValue() },

        average() {
            if (this.coins.compareTo(this.decimal('0.00')) == 0) { return this.decimal('0.00') } 
            return this.value.divide(this.coins);
        },

        average_text() { return this.average.round(3, BigDecimal.RoundingModes.FLOORz).getPrettyValue() },

        profit_difference() {
            if (this.coins.compareTo(this.decimal('0.00')) == 0) { return this.decimal('0.00') }
            else { return this.decimal(this.data.price).subtract(this.average) }
        },

        profit_percent() {
            if (this.coins.compareTo(this.decimal('0.00')) == 0) { return this.decimal('0.00') }
            else { return this.decimal(this.data.price).subtract(this.average).divide(this.average) }
        },

        profit_symbol() {
            if (this.profit_difference.compareTo(this.decimal('0.00')) > -1) { return '+' }
            return '-';
        },

        profit_style() { return this.profit_difference.compareTo(this.decimal('0')) == 0 ? 'color: var(--v-dimmer-base);' : this.profit_difference.compareTo(this.decimal('0')) > 0 ? 'color: var(--v-success-base);' : 'color: var(--v-error-base);' },

        pretty_dollar() { return this.abs(this.profit_difference).multiply(this.coins).round(2, BigDecimal.RoundingModes.FLOOR).getPrettyValue(); },

        pretty_percent() { return this.abs(this.profit_percent).multiply(this.decimal('100.00')).round(2, BigDecimal.RoundingModes.FLOOR).getPrettyValue() },
    },

    methods: {
        send_buy_crypto() { this.$emit('buy_crypto', this.symbol) },
        send_sell_crypto() { this.$emit('sell_crypto', this.symbol) },
        send_view_crypto() { this.$emit('view_crypto', this.symbol) },
        send_remove_row() { this.$emit('remove_row', this.symbol) },

    
        abs(val) { return val.compareTo(this.decimal('0')) < 0 ? val.negate() : val },

        selected_option(opt) { [ this.send_buy_crypto, this.send_sell_crypto, this.send_view_crypto, this.send_remove_row ][opt]() }
    },

    mounted() {
        
    }
}
</script>

<style lang="scss" scoped>

    tr {
        width: 100%;
        height: 56px !important;
        overflow: hidden;
        position: relative;
        transition: all 0.1s;

        td {
            position: relative;
            transition: all 0.5s;
            padding: 0 16px !important;


            p {
                position: absolute;
                top: 20px;
                //position: absolute;
                //top: 15px;
            }

            .v-btn {
                transition: all 0.1s;
                opacity: 0;
            }

            .v-btn.constant {
                opacity: 1;
            }
        }

        &:hover {
            background-color: var(--v-row_hover-base) !important;

            td {
                .v-btn {
                    opacity: 1;
                }
            }
        }
    }

    .v-list {
        margin: 0;
        padding: 0;

        .v-list-item {
            margin: 0;
            padding: 0;

            .v-btn {
                border-radius: 0px;
                font-size: 10px;
                letter-spacing: 3px;
                color: var(--v-dimmer-base);
            }
        }
    }

    .mobile-expanded {

        p {
            border-bottom: solid 1px var(--v-dimmer-darken4);
            margin-top: 5px;
            padding: 2px;
        }
    }

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>