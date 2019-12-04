import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'

Vue.use(Vuex)

new Vue({
  store: new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules: {
      user: require('~/store/user').default
    }
  }),
  render: h => h(App)
}).$mount('#profile-header')
