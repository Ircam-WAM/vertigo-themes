<template>
  <div class="residency-blog-list">
    <Loading
      v-if="loading === true"
      color="black"
    />
    <div v-else-if="posts.length === 0">
      There is no articles available
    </div>
    <template v-else>
      <Article
        v-for="blog of posts"
        :key="blog.id"
        :blog="blog"
        :residencies="residencies"
        :editable="editable"
      />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loading from '~/components/common/Loading'

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
    },
    editable: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  computed: {
    ...mapState('residencies', [
      'residencies'
    ]),
    ...mapState('blog', [
      'posts'
    ]),
    loading () {
      const state = this.$store.state
      return state.blog.lastPromise !== null ||
        state.residencies.lastPromise !== null
    }
  },
  watch: {
    async filter () {
      await this.$store.dispatch('blog/getPosts', this.filter)
    }
  },
  async mounted () { // init
    await Promise.all([
      this.$store.dispatch('residencies/getResidencies'),
      this.$store.dispatch('blog/getPosts', this.filter)
    ])
  }
}
</script>
