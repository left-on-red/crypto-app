import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: { customProperties: true },
        themes: {
            light: {
                background: '#FFFFFF', // white
                row_hover: '#F1F1F1',
                primary: '#3F51B5', // indigo
                inactive: '#BDBDBD', // grey lighten-1
                dimmer: '#525252',
                error: '#F44336', // red
                success: '#4CAF50' // green
            },

            dark: {
                background: '#1E1E1E', // grey darken-4
                row_hover: '#272727',
                primary: '#FF4081', // pink accent-2
                inactive: '#616161', // grey darken-2
                dimmer: '#969696',
                error: '#FF7043', // deep-orange lighten-1
                success: '#009688' // teal
            }
        }
    }
});
