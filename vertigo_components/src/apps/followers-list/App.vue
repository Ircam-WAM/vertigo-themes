<template>
  <List
    :username="username"
    type="followers"
  />
</template>

<script>
import List from '~/components/follow/List'

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
