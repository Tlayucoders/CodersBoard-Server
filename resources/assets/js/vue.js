/**
 * Initialize Vue with necessary dependencies
 */
import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';

// Centralized State Management for Vue.js.
Vue.use(Vuex);

// Material Component Framework for Vue.js
Vue.use(Vuetify);

// router for Vue.js
Vue.use(VueRouter);

// Export Vue Class ready to use
export default Vue;
