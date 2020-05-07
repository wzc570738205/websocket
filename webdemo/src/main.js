import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'


import * as fundebug from "fundebug-javascript";
import fundebugVue from "fundebug-vue";
fundebug.apikey = "85ea994b378ec6f004fb10f71f188461d42ef56179a8b16e0755045400a099f6"
fundebugVue(fundebug, Vue);


Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')


