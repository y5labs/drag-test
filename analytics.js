import * as products from './products'
import data from './product-data'

const copyAndFreeze = obj => Object.freeze(Object.assign({}, obj))

export default {
  name: 'analytics',
  namespaced: true,
  state: {
    products: copyAndFreeze(products)
  },
  mutations: {
    products_changed: state => {
      state.products = copyAndFreeze(products)
    }
  },
  actions: {
    async products_load({ commit }) {
      const diff = await products.cube.batch({ put: data })
      await products.cube.batch_calculate_link_change(diff.link_change)
      await products.cube.batch_calculate_selection_change(diff.selection_change)
      commit('products_changed')
    },
    async products_count_greaterthan({ commit }, count) {
      await products.by_count(5, null)
      commit('products_changed')
    },
    async products_count_clear({ commit }) {
      await products.by_count(null)
      commit('products_changed')
    }
  }
}
