import fetchDrf from '~/utils/fetchDrf'

export default {
  namespaced: true,

  state () {
    return {
      residencies: []
    }
  },

  mutations: {
    setResidencies (state, residencies) {
      state.residencies = residencies

      const invalid = residencies.filter(r => !r.artist || !r.artist.username)
      if (invalid.length > 0) {
        console.warn(`residencies has ${invalid.length} invalid artists (null artist or null username)`,
          JSON.parse(JSON.stringify(invalid)))
      }
    }
  },

  actions: {
    async getResidencies ({ commit }) {
      const resp = await fetchDrf('/api/residency')

      if (resp.status >= 400) {
        commit('setResidencies', [])
        throw new Error(`${resp.status}: ${JSON.stringify(await resp.json())}`)
      }

      commit('setResidencies', await resp.json())
    }
  },

  getters: {
    userResidencies (state, getters, rootState) {
      if (!rootState.user) {
        return state.residencies
      }
      return state.residencies.filter(r => r.artist && r.artist.username === rootState.user.user.username)
    }
  }
}
