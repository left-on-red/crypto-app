<template>
    <v-dialog v-model="dialog.sell_crypto" width="500" @click:outside="cancel">
        <v-card v-if="data != null">
            <v-form @submit.prevent="submit" ref="form" v-model="valid">
                <v-card-title>
                    Sell {{data.name}} ({{data.symbol}})
                </v-card-title>

                <v-card-text>
                    <v-row dense>
                        <v-col cols="12">
                            <p>from</p>
                            <v-radio-group :column="false" mandatory v-model="mode" @change="update()">
                                <v-row>
                                    <v-col cols="4">
                                        <v-radio value="0">
                                            <template v-slot:label>
                                                <p style="margin: 0; padding: 0;">coin price</p>
                                            </template>
                                        </v-radio>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-radio value="1">
                                            <template v-slot:label>
                                                <p style="margin: 0; padding: 0;">total value</p>
                                            </template>
                                        </v-radio>
                                    </v-col>
                                </v-row>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field :rules="quantity_rules" placeholder="1" v-model="quantity" @input="update()">
                                <template v-slot:label>
                                    <p>quantity</p>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="8">
                            <v-text-field :disabled="mode == '1'" :rules="rules" prefix="$" :placeholder="parse_number(data.price, 0).getPrettyValue()" v-model="coin" @input="update()">
                                <template v-slot:label>
                                    <p>coin price</p>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field :disabled="mode == '0'" :rules="rules" prefix="$" v-model="total" @input="update()">
                                <template v-slot:label>
                                    <p>total value</p>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-btn color="grey darken-2" text @click="cancel">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text type="submit" :disabled="!valid">Sell</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import BigDecimal from 'js-big-decimal';

import Dialogs from './../models/Dialogs.js';
import CryptoItem from './../models/CryptoItem.js';
import BankList from './../models/BankList.js';

export default {
    name: 'SellCryptoDialog',

    data() {
        return {
            quantity: '',
            coin: '',
            total: '',
            mode: '0',
            valid: false
        }
    },

    props: {
        dialog: {
            type: Dialogs,
            required: true
        },

        data: {
            type: CryptoItem
        },

        bank: {
            type: BankList,
            required: true
        }
    },

    computed: {
        coins() {
            let coins = this.decimal('0');
            let records = this.bank.get(this.data.symbol).records();

            for (let r = 0; r < records.length; r++) {
                if (records[r].type == 'BUY') { coins = coins.add(this.decimal(records[r].quantity)) }
                else if (records[r].type == 'SELL') { coins = coins.subtract(this.decimal(records[r].quantity)) }
            }

            return coins;
        },
        
        rules() {
            return [
                v => {
                    if (v != null) {
                        if (v != '') {
                            let number = v.split(',').join('');
                            if (number.startsWith('.')) { number = `0${number}` }
                            if (isNaN(number)) { return 'needs to a number' }
                            if (BigDecimal.compareTo(number, 0) <= 0) { return `needs to be greater than zero` }
                        }
                    }

                    return true;
                }
            ]
        },

        quantity_rules() {
            return [
                ...this.rules,
                v => {
                    if (v != null) {
                        if (v != '') {
                            let number = v.split(',').join('');
                            if (number.startsWith('.')) { number = `0${number}` }
                            if (!isNaN(number)) { if (this.decimal(number).compareTo(this.coins) > 0) { return `too high` } }
                        }
                    }

                    return true;
                }
            ]
        }
    },

    methods: {
        parse_number(val, def) {
            if (val == null) { return this.decimal('1') }
            val = val.split(',').join('');
            if (val == '' || isNaN(val.split('.').join(''))) { return this.decimal(`${def}`) }
            if (val.startsWith('.')) { val = `0${val}` }
            return this.decimal(val);
        },

        populate() {
            this.coin = this.decimal(this.data.price).getPrettyValue();
            this.update();
        },

        update() {
            let quantity = this.parse_number(this.quantity, 1);

            // from coin price
            if (this.mode == '0') {
                let coin = this.parse_number(this.coin, this.data.price);
                this.total = coin.multiply(quantity).getPrettyValue();
            }

            // from total value
            else if (this.mode == '1') {
                let total = this.parse_number(this.total, 0);
                this.coin = total.divide(quantity).getPrettyValue();
            }
        },

        /*updated_quantity() {
            let quantity = this.parse_number(this.quantity, 1);
            let coin = this.parse_number(this.coin, 0);

            this.total = coin.multiply(quantity).getPrettyValue();
        },

        updated_total() {
            let total = this.parse_number(this.total, 0);
            let quantity = this.parse_number(this.quantity, 1);

            this.coin = total.divide(quantity).getPrettyValue();
        },
        
        updated_coin() {
            let coin = this.parse_number(this.coin, 0);
            let quantity = this.parse_number(this.quantity, 1);

            this.total = coin.multiply(quantity).getPrettyValue();
        },*/

        submit() {
            let coin = this.parse_number(this.coin, 0).getValue();
            let quantity = this.parse_number(this.quantity, 1).getValue();

            this.bank.get(this.data.symbol).sell(coin, quantity);

            this.dialog.sell_crypto = false;
            this.$refs.form.reset();
        },

        cancel() {
            this.dialog.sell_crypto = false;
            this.$refs.form.reset();
        }
    },

    watch: {
        'dialog.sell_crypto'(val) { if (val == true) { this.populate() } },
    }
}
</script>

<style scoped lang="scss">
</style>