import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'

Vue.config.productionTip = false

Vue.use({
  install (Vue) {
    Vue.prototype.$axios = axios.create({
      baseURL: 'http://localhost:3000/'
    })
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
