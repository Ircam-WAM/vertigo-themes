import fetchDrf from '~/utils/fetchDrf'

export default {
  namespaced: true,

  state () {
    return {
      user: null,
      isLogged: false,
      lastPromise: null
    }
  },

  mutations: {
    setUser (state, user) {
      state.user = user
      state.isLogged = true
    },
    setLastPromise (state, promise) {
      state.lastPromise = promise
    }
  },

  actions: {
    async getUser ({ state, commit }) {
      const promise = fetchDrf(`/api/user/`)
      commit('setLastPromise', promise)

      const resp = await promise

      // Another request is currently loading
      if (promise !== state.lastPromise) {
        return
      }

      if (resp.status >= 400) {
        commit('user', null)
        commit('setLastPromise', null)
        throw new Error(`${resp.status}: ${JSON.stringify(await resp.json())}`)
      }

      commit('setUser', await resp.json())
      commit('setLastPromise', null)
    }
  },

  getters: {
  }
}
