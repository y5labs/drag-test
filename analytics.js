import * as metocean from './metocean'
import metoceanData from './metocean-data'

const copyAndFreeze = obj => Object.freeze(Object.assign({}, obj))

export default {
  name: 'analytics',
  namespaced: true,
  state: {
    metocean: copyAndFreeze(metocean)
  },
  mutations: {
    metocean_changed: state => {
      state.metocean = copyAndFreeze(metocean)
    }
  },
  actions: {
    async metocean_load({ commit }) {
      const data = await metoceanData()
      const diff = await metocean.cube.batch({ put: data })
      await metocean.cube.batch_calculate_link_change(diff.link_change)
      await metocean.cube.batch_calculate_selection_change(diff.selection_change)
      commit('metocean_changed')
    }
  }
}
