<template>
    <v-form>
        <v-switch v-model="config.dark" inset color="success" label="dark theme" />
    </v-form>
</template>

<script>
import Config from '@/models/Config.js';

export default {
    name: 'Personalization',
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