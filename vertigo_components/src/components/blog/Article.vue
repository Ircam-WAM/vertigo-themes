<template>
  <div class="blog-article">
    <template v-if="blog.article">
      <div class="head">
        <div
          v-if="blog.article.user.profile_image"
          class="profile-image"
        >
          <img :src="blog.article.user.profile_image">
        </div>
        <div>
          <h2 class="title">
            {{ blog.article.title }}
          </h2>
          <div class="infos">
            <p>{{ blog.article.user.first_name }} {{ blog.article.user.last_name }}</p>
            <p v-if="getResidencyById(blog.residency)">
              About the {{ getResidencyById(blog.residency).title }} Residency
            </p>
          </div>
        </div>
      </div>
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="content"
        v-html="md.render(blog.article.content)"
      />
      <!-- eslint-enable vue/no-v-html -->
      <img
        v-if="blog.image && blog.image.thumbnail"
        class="post-image"
        :src="blog.image.thumbnail"
      >
    </template>
    <template v-else>
      <p class="empty-article">
        Empty article
      </p>
    </template>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

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
  computed: {
    md () {
      return md
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
/* Have to use a specific selector to avoid using !important */
body #container .blog-article {
  color: black;
  border: 1px solid #c9c9c9;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 5px;
  background: white;

  & .head {
    display: flex;

    & h3 {
      font-size: 40px;
    }

    & .profile-image {
      margin-right: 20px;
      max-width: 40%;
      max-height: 200px;
    }

    & .infos {
      & p {
        margin-bottom: 0;
      }
    }
  }

  & h2.title {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 2rem;
    font-family: "Oswald", sans-serif;
    color: black;
  }

  & .content {
    color: black;

    & /deep/ {
      & h1,
      & h2,
      & h3,
      & h4,
      & h5,
      & h6 {
        color: inherit;
      }

      /* _typography.scss define really high priority selector for links */
      & a:any-link {
        color: inherit !important;
      }
    }
  }

  & .post-image {
    max-width: 100%;
    display: block;
    margin: 0 auto;
    max-height: 200px;
  }
}
</style>
