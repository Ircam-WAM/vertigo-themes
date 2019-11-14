import fetchDrf from '~/utils/fetchDrf'

export default {
  namespaced: true,

  state () {
    return {
      residencies: [],
      lastPromise: null
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
    },
    setLastPromise (state, promise) {
      state.promise = promise
    }
  },

  actions: {
    async getResidencies ({ state, commit }) {
      const promise = fetchDrf('/api/residency')
      commit('setLastPromise', promise)

      const resp = await promise

      // Another request is currently loading
      if (promise !== state.lastPromise) {
        return
      }

      if (resp.status >= 400) {
        commit('setResidencies', [])
        commit('setLastPromise', null)
        throw new Error(`${resp.status}: ${JSON.stringify(await resp.json())}`)
      }

      commit('setResidencies', await resp.json())
      commit('setLastPromise', null)
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
