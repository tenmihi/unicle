import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueLineClamp from 'vue-line-clamp'
Vue.use(VueLineClamp, { importCss: true })

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
Vue.use(Buefy)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
