import fetchDrf from '~/utils/fetchDrf'

export default {
  namespaced: true,

  state () {
    return {
      user: null,
      isLogged: false
    }
  },

  mutations: {
    setUser (state, user) {
      state.user = user
      state.isLogged = true
    }
  },

  actions: {
    async getUser ({ commit }) {
      const resp = await fetchDrf(`/api/user/`)

      if (resp.status >= 400) {
        commit('user', null)
        throw new Error(`${resp.status}: ${JSON.stringify(await resp.json())}`)
      }

      commit('setUser', await resp.json())
    }
  },

  getters: {
  }
}
