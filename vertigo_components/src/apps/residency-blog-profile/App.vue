<template>
  <div class="residency-blog-profile">
    <Form />
    <List :filter="{ type: 'myposts' }" />
  </div>
</template>

<script>
import Form from '~/components/residency-blog/Form'
import List from '~/components/residency-blog/List'

export default {
  name: 'App',
  components: {
    Form,
    List
  }
}
</script>
