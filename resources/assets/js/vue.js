/**
 * Initialize Vue with necessary dependencies
 */
import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import VueResource from 'vue-resource';

// Centralized State Management for Vue.js.
Vue.use(Vuex);

// Material Component Framework for Vue.js
Vue.use(Vuetify);

// router for Vue.js
Vue.use(VueRouter);

// Provides services for making web requests and handle responses using a XMLHttpRequest or JSONP
Vue.use(VueResource);

// Export Vue Class ready to use
export default Vue;
