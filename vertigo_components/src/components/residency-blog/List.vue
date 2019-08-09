<template>
  <div class="residency-blog-list">
    <Loading v-if="loading === true" />
    <div v-else-if="articles.length === 0">
      There is no articles available
    </div>
    <template v-else>
      <Article
        v-for="blog of articles"
        :key="blog.id"
        :blog="blog"
        :residencies="residencies"
      />
    </template>
  </div>
</template>

<script>
import Loading from '~/components/common/Loading'
import fetchDrf from '~/utils/fetchDrf'

import Article from './Article'

export default {
  name: 'ResidencyBlogList',
  components: {
    Loading,
    Article
  },
  props: {
    filter: {
      type: Object,
      required: false,
      default: () => ({ type: 'all' }),
      validator: (val) => {
        return ['all', 'followed', 'myposts', 'user'].indexOf(val.type) !== -1
      }
    }
  },
  data () {
    return {
      loading: false,
      articles: [],
      residencies: []
    }
  },
  computed: {
    queryParams () {
      const params = new URLSearchParams()

      params.append('filter', this.filter.type)
      for (const p in this.filter.params) {
        params.append(`filter.${p}`, this.filter.params[p])
      }

      return params.toString()
    }
  },
  watch: {
    async filter () {
      await this.getPosts()
    }
  },
  mounted () {
    this.getResidencies()
    this.getPosts()
  },
  methods: {
    async getResidencies () {
      try {
        const resp = await fetchDrf('/api/residency')

        if (resp.status >= 400) {
          alert(JSON.stringify(await resp.json()))
          return
        }

        this.residencies = await resp.json()
      } catch (e) {
        console.error(e)
        alert('fetch failed (check console)')
      }
    },
    async getPosts () {
      this.loading = true

      const resp = await fetchDrf(`/api/residency-blog/?${this.queryParams}`)

      if (resp.status >= 400) {
        alert(JSON.stringify(await resp.json()))
        return
      }

      this.articles = await resp.json()
      this.loading = false
    }
  }
}
</script>

<style scoped>
.residency-blog-list {
  background: white;
  color: black;
  padding: 20px;
}
</style>
