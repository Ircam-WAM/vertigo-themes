<template>
  <div class="blog-list">
    <List :filter="{ type: 'user', params: { username } }" />
  </div>
</template>

<script>
import List from '~/components/residency-blog/List'

export default {
  name: 'App',
  components: {
    List
  },
  computed: {
    username () {
      if (!window.globalVars) {
        return null
      }
      return window.globalVars.username
    }
  }
}
</script>
