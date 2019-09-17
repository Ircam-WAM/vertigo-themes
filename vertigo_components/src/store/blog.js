import fetchDrf from '~/utils/fetchDrf'

export default {
  namespaced: true,

  state () {
    return {
      posts: []
    }
  },

  mutations: {
    setPosts (state, posts) {
      state.posts = posts
    },
    addPosts (state, ...post) {
      state.posts.unshift(...post)
    }
  },

  actions: {
    async getPosts ({ commit }, filter) {
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

      const resp = await fetchDrf(`/api/residency-blog/${queryParams ? `?${queryParams}` : ''}`)

      if (resp.status >= 400) {
        commit('setPosts', [])
        throw new Error(`${resp.status}: ${JSON.stringify(await resp.json())}`)
      }

      commit('setPosts', await resp.json())
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
    }
  },

  getters: {
  }
}
