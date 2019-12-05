import fetchDrf from '~/utils/fetchDrf'

export default {
  namespaced: true,

  state () {
    return {
      posts: [],
      lastPromise: null
    }
  },

  mutations: {
    setPosts (state, posts) {
      state.posts = posts
    },
    addPosts (state, ...post) {
      state.posts.unshift(...post)
    },
    setLastPromise (state, promise) {
      state.lastPromise = promise
    }
  },

  actions: {
    async getPosts ({ state, commit }, filter) {
      const queryParams = ((filter) => {
        if (!filter) {
          return null
        }

        const params = new URLSearchParams()

        params.append('filter', filter.type)
        for (const p in filter.params) {
          params.append(`filter.${p}`, filter.params[p])
        }

        return params.toString()
      })(filter)

      const promise = fetchDrf(`/api/residency-blog/${queryParams ? `?${queryParams}` : ''}`)
      commit('setLastPromise', promise)

      const resp = await promise

      // Another request is currently loading
      if (promise !== state.lastPromise) {
        return
      }

      if (resp.status >= 400) {
        commit('setPosts', [])
        commit('setLastPromise', null)
        throw new Error(`${resp.status}: ${JSON.stringify(await resp.json())}`)
      }

      commit('setPosts', await resp.json())
      commit('setLastPromise', null)
    },

    async addPost ({ commit }, body) {
      const resp = await fetchDrf('/api/residency-blog/', {
        method: 'POST',
        body: JSON.stringify(body)
      })

      const jsonResp = await resp.json()

      if (resp.status >= 400) {
        throw new Error(`${resp.status}: ${JSON.stringify(jsonResp)}`)
      }

      commit('addPosts', jsonResp)

      return jsonResp
    }
  },

  getters: {
  }
}
