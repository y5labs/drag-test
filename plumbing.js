import Vue from 'vue'
import Hub from 'seacreature/lib/hub'
import app from './app.vue'

Vue.config.devtools = false
Vue.config.productionTip = false

// Setup event bus hub
const hub = Hub()
Vue.use({
  install: (Vue, options) => {
    Vue.mixin({
      beforeCreate: function () {
        const options = this.$options
        if (options.hub)
          this.$hub = options.hub
        else if (options.parent && options.parent.$hub)
          this.$hub = options.parent.$hub
      }
    })
  }
})

import Vuex from 'vuex'
Vue.use(Vuex)
import store from './store'

// launch Vue
const props = {}
const scene = new Vue({
  hub,
  store: new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules: {
      [store.name]: store
    }
  }),
  render: h => h(app, { props: props })
})

// Unidirectional data flow
hub.on('update', (p) => {
  Object.assign(props, p)
  return scene.$forceUpdate()
})

scene.$mount('#root')