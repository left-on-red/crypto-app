import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './../views/Home.vue';
import History from './../views/History.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    
    {
        path: '/history/:symbol',
        name: 'History',
        component: History
    }
]

const router = new VueRouter({ routes });

export default router;
