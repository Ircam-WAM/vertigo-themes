<template>
  <div class="article">
    <template v-if="blog.article">
      <div class="head">
        <div v-if="blog.article.user.profile_image">
          <img :src="blog.article.user.profile_image">
        </div>
        <div>
          <h3>{{ blog.article.title }}</h3>
          <div class="infos">
            <p>{{ blog.article.user.first_name }} {{ blog.article.user.last_name }}</p>
            <p v-if="getResidencyById(blog.residency)">
              About the {{ getResidencyById(blog.residency).title }} Residency
            </p>
          </div>
        </div>
      </div>
      <div class="content">
        <p>{{ blog.article.content }}</p>
      </div>
    </template>
    <template v-else>
      <p class="empty-article">
        Empty article
      </p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ResidencyArticle',
  props: {
    blog: {
      type: Object,
      required: true
    },
    residencies: {
      type: Array,
      required: false,
      default: null
    }
  },
  methods: {
    getResidencyById (id) {
      if (!this.residencies) {
        return null
      }
      return this.residencies.find(i => i.id === id)
    }
  }
}
</script>

<style scoped>
.article {
  border: 1px solid grey;
  margin-bottom: 20px;
  padding: 20px;

  & .head {
    display: flex;

    & h3 {
      font-size: 40px;
    }

    & .infos {
      & p {
        margin-bottom: 0;
      }
    }
  }

  & .title {
    font-size: 30px;
    color: red;
  }

  & .text {
    font-size: var(--my-font-size);
    color: blue;
  }
}
</style>
