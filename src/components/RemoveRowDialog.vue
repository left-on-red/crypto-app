<template>
    <v-dialog v-model="dialog.remove_row" width="400">
        <v-card v-if="data">
            <v-card-title></v-card-title>
            <v-card-text>
                <span style="text-transform: uppercase;">Remove <span style="color: var(--v-primary-base);">{{data.symbol}}</span> from your table?
                <br>Any recorded investments will be lost.</span>
            </v-card-text>

            <v-card-actions>
                <v-btn color="dimmer" text @click="cancel">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="confirm">Remove</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

let Dialogs = require('./../models/Dialogs.js');
let CryptoItem = require('./../models/CryptoItem.js');
let CryptoList = require('./../models/CryptoList.js');
let BankList = require('./../models/BankList.js');

export default {
    name: 'RemoveRowDialog',

    data: () => ({

    }),

    props: {
        dialog: {
            type: Dialogs,
            required: true
        },

        data: {
            type: CryptoItem
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

    methods: {

        confirm() {
            this.crypto.pop(this.data.symbol);
            this.bank.remove(this.data.symbol);

            this.dialog.remove_row = false;
        },

        cancel() {
            this.dialog.remove_row = false;
        }
    },
}
</script>

<style scoped lang="scss">
    
</style>