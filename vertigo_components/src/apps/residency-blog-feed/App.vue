<template>
  <div class="blog-list">
    <div class="selector">
      <button
        :class="[ {'active': filter === 'all'} ]"
        @click="filter = 'all'"
      >
        <!-- all: cf data
          the 'active' css class appear if filter==all -->
        All activity
      </button>
      <button
        :class="[ {'active': filter === 'followed'} ]"
        @click="filter = 'followed'"
      >
        People I Follow
      </button>
    </div>
    <List :filter="{ type: filter }" />
  </div>
</template>

<script>
import List from '~/components/residency-blog/List'

export default {
  name: 'App',
  components: {
    List
  },
  data () {
    return {
      filter: 'all'
    }
  }
}
</script>

<style scoped>
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
