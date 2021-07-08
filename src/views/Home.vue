<template>
    <v-container>
        <v-app-bar color="background" flat dense>
            <v-spacer />
            <router-link to="/history/settings">
            <v-btn icon>
                <v-icon color="dimmer">mdi-cog</v-icon>
            </v-btn>
            </router-link>
        </v-app-bar>
        <CryptoTable
            :crypto="crypto"
            :bank="bank"
            :initialized="initialized"
            @buy_crypto="buy_crypto"
            @sell_crypto="sell_crypto"
            @view_crypto="view_crypto"
            @add_row="add_row"
            @remove_row="remove_row"
        />
    </v-container>
</template>

<script>
import CryptoTable from '@/components/CryptoTable.vue';

import Config from '@/models/Config.js';
import Dialogs from '@/models/Dialogs.js';
import Datas from '@/models/Datas.js';

import CryptoList from '@/models/CryptoList.js';
import BankList from '@/models/BankList.js';

export default {
    name: 'Home',
    components: {
        CryptoTable
    },

    props: {
        config: {
            required: true,
            type: Config
        },

        dialogs: {
            required: true,
            type: Dialogs
        },

        datas: {
            required: true,
            type: Datas
        },

        crypto: {
            required: true,
            type: CryptoList
        },

        bank: {
            required: true,
            type: BankList
        },

        initialized: {
            required: true,
            type: Boolean
        }
    },

    methods: {
        buy_crypto(symbol) {
            this.datas.buy(JSON.parse(this.crypto.get(symbol).json()));
            this.dialogs.buy_crypto = true;
        },

        sell_crypto(symbol) {
            this.datas.sell(JSON.parse(this.crypto.get(symbol).json()))
            this.dialogs.sell_crypto = true;
        },

        view_crypto(symbol) {
            console.log(`view_crypto: ${symbol}!`);
        },

        add_row() {
            this.dialogs.add_row = true;
        },

        remove_row(symbol) {
            this.datas.remove(this.crypto.get(symbol).duplicate());
            this.dialogs.remove_row = true;
        }
    }
}
</script>
