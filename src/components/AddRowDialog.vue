<template>
    <v-dialog v-model="dialog.add_row" width="500" @click:outside="cancel">
        <v-card>
            <v-form @submit.prevent="submit" v-model="valid" ref="form">
                <v-card-title>Add Cryptocurrency</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="2" />
                        <v-col cols="8">
                            <v-text-field ref="input_el" v-if="dialog.add_row" :rules="rules" v-model="input" @input="updated_box()">
                                <template v-slot:label>
                                    <p>symbol</p>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="2" />
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-btn color="dimmer" text @click="cancel">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text type="submit" :disabled="!valid">Add</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import cryptocurrencies from 'cryptocurrencies';
import Dialogs from '@/models/Dialogs.js';
import BankList from '@/models/BankList.js';

export default {
    name: 'AddRowDialog',

    props: {
        dialog: {
            type: Dialogs,
            required: true
        },

        bank: {
            type: BankList,
            required: true
        },

        ids: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        input: '',
        valid: false
    }),

    computed: {
        rules() {
            return [
                v => !!v || 'required',
                v => v ? cryptocurrencies.symbols().includes(v.toUpperCase()) ? true : `that's an invalid cryptocurrency` : true,
                v => v ? !this.bank.get(v.toUpperCase()) ? true : 'that cryptocurrency is already in your table' : true
            ]
        }
    },

    methods: {
        updated_box() { if (this.input) { this.input = this.input.toUpperCase() } },

        submit() {
            let input = this.input.toUpperCase();
            this.bank.add(input);

            this.api(`assets?search=${input}`).then((data) => { this.ids[input] = data.data[0].id; });

            this.$refs.input_el.blur();
            this.dialog.add_row = false;
            this.clear();
        },

        cancel() {
            this.$refs.input_el.blur();
            this.dialog.add_row = false;
            this.clear();
        },

        clear() {
            this.$refs.form.reset();
            this.$refs.form.resetValidation();
        },
        //focus() { this.$refs.input_el.focus() }
    },

    watch: {
        //'dialog.add_crypto'(val) { if (val == true) { this.focus() } },
    }
}
</script>

<style scoped lang="scss">
</style>