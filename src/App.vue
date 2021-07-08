<template>
    <v-app id="app">
        <BuyCryptoDialog :data="datas.buy()" :bank="bank" :dialog="dialogs" />
        <SellCryptoDialog :data="datas.sell()" :bank="bank" :dialog="dialogs" />
        <AddRowDialog :dialog="dialogs" :bank="bank" :ids="ids" />
        <RemoveRowDialog :data="datas.remove()" :crypto="crypto" :bank="bank" :dialog="dialogs" :ids="ids" />
        <v-main style="margin-top: 48px;">
            <v-row>
                <!--<v-col>
                    <v-btn icon id="theme" @click="dark = !dark" x-large style="float: right; margin: 20px;">
                        <v-icon v-if="dark" color="#999999">mdi-brightness-7</v-icon>
                        <v-icon v-else color="#646464">mdi-brightness-5</v-icon>
                    </v-btn>
                </v-col>-->
                <v-col></v-col>
                <v-col cols="12" sm="11" md="10">
                    <router-view
                        :crypto="crypto"
                        :bank="bank"
                        :initialized="initialized"
                        :datas="datas"
                        :dialogs="dialogs"
                        :config="config"
                    />
                </v-col>
                <v-col></v-col>
            </v-row>
        </v-main>
    </v-app>
</template>

<script>

import BuyCryptoDialog from '@/components/BuyCryptoDialog.vue';
import SellCryptoDialog from '@/components/SellCryptoDialog.vue';
import AddRowDialog from '@/components/AddRowDialog.vue';
import RemoveRowDialog from '@/components/RemoveRowDialog.vue';

import Config from '@/models/Config.js';
import Dialogs from '@/models/Dialogs.js';
import Datas from '@/models/Datas.js';

import CryptoList from '@/models/CryptoList.js';
import BankList from '@/models/BankList.js';

//import cryptocurrencies from 'cryptocurrencies';

export default {
    name: 'App',

    components: {
        BuyCryptoDialog,
        SellCryptoDialog,
        AddRowDialog,
        RemoveRowDialog
    },

    data: () => ({
        dialogs: new Dialogs(),
        datas: new Datas(),

        config: new Config(localStorage.getItem('config')),

        crypto: new CryptoList(),

        bank: new BankList(localStorage.getItem('bank')),

        ids: localStorage.getItem('ids') ? JSON.parse(localStorage.getItem('ids')) : {},
        
        initialized: false
    }),

    computed: {
    },

    methods: {
        refresh() {
            if (!this.initialized) {
                let ids = [];
                for (let b = 0; b < this.bank.data().length; b++) { ids.push(this.ids[this.bank.data()[b].symbol]) }


                this.api(`assets?ids=${ids.join(',')}`).then((data) => {
                    data = data.data;

                    if (!this.initialized) {
                        for (let d = 0; d < data.length; d++) {
                            this.crypto.push({
                                name: data[d].name,
                                symbol: data[d].symbol,
                                price: data[d].priceUsd
                            })
                        }
                    }

                    else {
                        for (let d = 0; d < data.length; d++) {
                            if (!this.crypto.update(data[d].symbol, data[d].price)) {
                                this.crypto.push({
                                    name: data[d].name,
                                    symbol: data[d].symbol,
                                    price: data[d].priceUsd
                                });
                            }
                        }
                    }
                });

                this.initialized = true;

                /*this.api(`currencies/ticker?ids=${symbols.join(',')}&convert=USD`).then(data => {

                    else {
                        for (let d = 0; d < data.length; d++) {
                            if (!this.crypto.update(data[d].symbol, data[d].price)) {
                                this.crypto.push({
                                    name: data[d].name,
                                    symbol: data[d].symbol,
                                    svg: data[d].logo_url,
                                    price: data[d].price
                                });
                            }
                        }
                    }
                });*/
            }

            /*let date = new Date();
            date.setMonth(date.getMonth() - 1);
            setTimeout(() => {
                this.api(`currencies/sparkline?ids=${this.symbols.join(',')}&convert=USD&start=${encodeURIComponent(date.toISOString())}`).then(data => {
                    console.log(data.filter(value => value.currency == 'DOGE')[0].prices[0]);
                });
            }, 1100);*/
        },

        buy_crypto(symbol) {
            this.datas.buy(this.crypto.get(symbol).duplicate());
            console.log(this.datas.buy());
            this.dialogs.buy_crypto = true;
        },

        sell_crypto(symbol) {
            this.datas.sell(this.crypto.get(symbol).duplicate());
            this.dialogs.sell_crypto = true;
        },

        view_crypto(symbol) {
            console.log(`view_crypto: ${symbol}!`);
        },

        add_row() { this.dialogs.add_row = true },

        remove_row(symbol) {
            this.datas.remove(this.crypto.get(symbol).duplicate());
            this.dialogs.remove_row = true;
        }
    },

    mounted() {
        this.$vuetify.theme.dark = this.config.dark;

        setInterval(() => { localStorage.setItem('ids', JSON.stringify(this.ids)) }, 100)

        let loop = () => { setTimeout(() => { this.refresh(); loop(); }, 5000) }

        this.refresh();
        loop();
    },

    watch: {
        config: {
            deep: true,
            handler(config) {
                localStorage.setItem('config', JSON.stringify(config));
                this.$vuetify.theme.dark = config.dark;
            }
        },

        bank: {
            deep: true,
            handler(bank) { localStorage.setItem('bank', bank.json()) }
        }
    }
};
</script>

<style lang="scss">
    p {
        //color: var(--v-dimmer-base);
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 12px;
        font-weight: bold;
    }

    #app {
        background-color: var(--v-background-base);
    }

    .v-text-field > .v-input__control > .v-input__slot::before,
    .v-label
    {
        border-color: var(--v-inactive-base) !important;
        color: var(--v-inactive-base) !important;
    }

    .v-card {
        .v-card__title {
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 12px;
            color: var(--v-primary-base);
        }

        .v-card__text {
            letter-spacing: 2px;
            font-size: 12px;
        }

        .v-card__actions {
            .v-btn {
                letter-spacing: 2px;
                font-size: 12px;
            }
        }
    }
</style>
