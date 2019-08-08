<template>
  <div class="residency-blog-list">
    <h4>Residencies blog</h4>
    <div class="selector">
      <button
        :class="[ {'active': filter === 'all'} ]"
        @click="filter = 'all'"
      >
        All activity
      </button>
      <button
        :class="[ {'active': filter === 'followed'} ]"
        @click="filter = 'followed'"
      >
        People I Follow
      </button>
    </div>
    <Loading v-if="loading === true" />
    <div v-else-if="articles.length === 0">
      There is no articles available
    </div>
    <template v-else>
      <ResidencyBlogArticle
        v-for="blog of articles"
        :key="blog.id"
        :blog="blog"
        :residencies="residencies"
      />
    </template>
  </div>
</template>

<script>
import Loading from '~/components/Loading'
import ResidencyBlogArticle from '~/components/ResidencyBlogArticle'
import fetchDrf from '~/utils/fetchDrf'

export default {
  name: 'ResidencyBlogList',
  components: {
    Loading,
    ResidencyBlogArticle
  },
  data () {
    return {
      loading: false,
      articles: [],
      residencies: [],
      filter: 'all'
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

      let resp
      if (this.filter === 'all') {
        resp = await fetchDrf('/api/residency-blog/')
      } else if (this.filter === 'followed') {
        resp = await fetchDrf('/api/residency-blog/followed')
      }

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

h4 {
  font-size: 20px;
  text-align: center;
  text-transform: uppercase;
  text-decoration: underline;
}

.selector {
  text-align: center;

  & button {
    border: none;
    color: grey;
    background: none;
    font-size: 18px;
    padding: 20px;

    &.active {
      color: black;
      outline: none;
      text-decoration: underline;
    }
  }
}
</style>
