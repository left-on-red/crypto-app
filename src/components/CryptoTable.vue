<template>
    <v-simple-table>
        <template v-slot:default>
            <thead>
                <tr>
                    <th width="100"></th>
                    <th width="150"><p class="header-text">Name</p></th>
                    <th width="100"><p class="header-text">Symbol</p></th>
                    <th width="150"><p class="header-text">Price</p></th>
                    <th width="150" class="d-none d-md-table-cell"><p class="header-text">Coins</p></th>
                    <th width="150" class="d-none d-md-table-cell"><p class="header-text">Total</p></th>
                    <th width="100" class="d-none d-md-table-cell"><p class="header-text">Average</p></th>
                    <th width="200" class="d-none d-md-table-cell"><p class="header-text">Profit</p></th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                <CryptoRow
                    v-for="(item, i) in bank.data()"
                    :key="i"
                    :symbol="item.symbol"
                    :crypto="crypto"
                    :bank="bank"
                    @buy_crypto="forward_buy_crypto"
                    @sell_crypto="forward_sell_crypto"
                    @view_crypto="forward_view_crypto"
                    @remove_row="forward_remove_row"
                />

                <tr v-if="initialized" class="add-row">
                    <td colspan="9">
                        <v-btn icon block color="dimmer" @click="forward_add_row()"><v-icon>mdi-plus</v-icon></v-btn>
                    </td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script>

import CryptoRow from './CryptoRow.vue';

import CryptoList from './../models/CryptoList.js';
import BankList from './../models/BankList.js';

export default {
    name: 'CryptoTable',
    
    components: { CryptoRow },

    props: {
        initialized: {
            type: Boolean,
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
        
    }),

    methods: {
        get_crypto(symbol) { return this.crypto.get(symbol) },

        forward_buy_crypto(symbol) { this.$emit('buy_crypto', symbol) },
        forward_sell_crypto(symbol) { this.$emit('sell_crypto', symbol) },
        forward_view_crypto(symbol) { this.$emit('view_investments', symbol) },
        
        forward_add_row() { this.$emit('add_row') },
        forward_remove_row(symbol) { this.$emit('remove_row', symbol) }
    }
}
</script>

<style scoped lang="scss">
    .header-text {
        margin-bottom: -20px;
        font-size: 10px;
    }

    .add-row {
        &:hover {
            background-color: transparent !important;
        }

        td {
            .v-btn {
                border-radius: 5px;
            }
        }
    }
</style>