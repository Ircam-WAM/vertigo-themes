<template>
  <div class="blog-list">
    <div class="title-container">
      <h1>Blog Feed</h1>
    </div>
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
import List from '~/components/blog/List'

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

<!-- Style for page container -->
<style>
.page--grey-bg {
  background: #ecebeb;
}
</style>

<style scoped>
.title-container {
  text-align: center;

  & h1 {
    display: inline-block;
    text-align: center;
    text-transform: uppercase;
    color: #000f24;
    padding-bottom: 10px;
    border-bottom: 2px solid #000f24;
    margin-bottom: 20px;
  }
}

.selector {
  text-align: center;

  & button {
    border: none;
    color: grey;
    background: none;
    font-size: 20px;
    padding: 0;
    padding-bottom: 10px;
    margin: 20px;
    font-family: "Oswald", sans-serif;
    text-transform: uppercase;

    &.active {
      color: black;
      outline: none;
      border-bottom: 2px solid #000f24;
    }
  }
}
</style>
