<template>
  <div class="residency-blog-profile">
    <p class="title">
      Write a blog post
    </p>
    <Form class="form" />
    <p class="title">
      Your published posts
    </p>
    <List
      :filter="{ type: 'myposts' }"
      :editable="true"
    />
  </div>
</template>

<script>
import Form from '~/components/blog/Form'
import List from '~/components/blog/List'

export default {
  name: 'App',
  components: {
    Form,
    List
  }
}
</script>

<style scoped>
.title {
  font-family: "Oswald", sans-serif;
  font-weight: 700;
  font-size: 1.3rem;
  text-transform: uppercase;
}

.form {
  margin-bottom: 20px;
}
</style>
