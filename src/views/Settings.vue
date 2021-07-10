<template>
    <v-container style="height: 100%;">
        <v-row style="height: 100%;">
            <v-col cols="4" style="padding: 0px; border-right: solid 3px var(--v-row_hover-base);" class="d-none d-md-block">
                <v-app-bar color="transparent" flat dense>
                    <p style="margin: auto; width: 100%; position: absolute; left: 0; text-align: center;">settings</p>
                    <router-link to="/">
                        <v-btn icon>
                            <v-icon color="dimmer">mdi-chevron-left</v-icon>
                        </v-btn>
                    </router-link>
                </v-app-bar>
                <div id="settings-nav">
                    <v-btn v-for="(view, v) in views" :key="v" :class="selected == v ? 'active' : ''" @click="selected = v">
                        <p>{{view}}</p>
                    </v-btn>
                </div>
            </v-col>
            <v-col class="d-block d-md-none" cols="12">
                <router-link to="/">
                    <v-btn icon>
                        <v-icon color="dimmer">mdi-chevron-left</v-icon>
                    </v-btn>
                </router-link>
                <div v-for="(view, v) in views" :key="v" style="margin-bottom: 20px;">
                    <p style="border-bottom: solid 3px var(--v-row_hover-base); padding: 5px;">{{view}}</p>
                    <component :config="config" :is="view" />
                </div>
            </v-col>
            <v-col class="d-none d-md-block" cols="8" style="padding: 20px;">
                <component :config="config" :is="views[selected]" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Config from '@/models/Config.js';

import Personalization from '@/components/settings/Personalization.vue';
import Table from '@/components/settings/Table.vue';

export default {
    name: 'Settings',

    components: { Personalization, Table },

    props: {
        config: {
            required: true,
            type: Config
        }
    },

    data: () => ({
        views: [ 'Personalization', 'Table' ],
        selected: 0
    })
}
</script>

<style lang="scss" scoped>
    #settings-nav {
        .v-btn {
            background-color: var(--v-background-base);
            box-shadow: none;
            border-radius: 0;
            width: 100%;

            &:hover {
                background-color: var(--v-row_hover-base);
            }

            &:active, &:focus {
                background-color: var(--v-background-base);
            }

            &.active {
                background-color: var(--v-row_hover-base);
            }

            p {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                color: var(--v-dimmer-base);
            }
        }
    }
</style>