<template>
  <div class="blog-article">
    <template v-if="blog.article">
      <div
        v-if="editable"
        class="action-buttons"
      >
        <!--
        <button
          title="Update"
          @click="updateArticle"
        >
          Edit
          <FontAwesomeIcon :icon="[ 'fas', 'edit' ]" />
        </button>
        -->
        <button
          title="Delete"
          :disabled="isDeleting"
          @click="deleteArticle"
        >
          <FontAwesomeIcon
            :icon="[ 'fas', 'trash-alt' ]"
            size="lg"
          />
        </button>
      </div>
      <div class="head">
        <a
          v-if="blog.article.user.profile_image"
          :href="blog.article.user.url"
          class="profile-image"
        >
          <img :src="blog.article.user.profile_image">
        </a>
        <div>
          <h2 class="title">
            {{ blog.article.title }}
          </h2>
          <div class="infos">
            <a :href="blog.article.user.url">
              {{ blog.article.user.first_name }} {{ blog.article.user.last_name }}
            </a>
            <p v-if="getResidencyById(blog.residency)">
              About the {{ getResidencyById(blog.residency).title }} Residency
            </p>
            <p v-if="articleDate">
              {{ articleDate }}
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
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
// import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// See https://github.com/markdown-it/markdown-it
const md = new MarkdownIt({
  breaks: true,
  linkify: true
})

library.add(faTrashAlt)
// library.add(faEdit)

export default {
  name: 'ResidencyArticle',
  components: {
    FontAwesomeIcon
  },

  props: {
    blog: {
      type: Object,
      required: true
    },

    residencies: {
      type: Array,
      required: false,
      default: null
    },

    editable: {
      type: Boolean,
      default: true,
      required: false
    }

  },

  data () {
    return {
      // isUpdating: false,
      isDeleting: false
    }
  },

  computed: {
    md () {
      return md
    },

    articleDate () {
      const raw = this.blog.article.publish_date
      if (!raw) {
        return undefined
      }
      const date = new Date(raw)
      return date.toLocaleDateString()
    }
  },

  methods: {
    getResidencyById (id) {
      if (!this.residencies) {
        return null
      }
      return this.residencies.find(i => i.id === id)
    },

    async deleteArticle () {
      const confirmed = window.confirm(`Do you want to delete the article "${this.blog.article.title}" ?`)
      if (!confirmed) {
        return
      }

      this.isDeleting = true
      await this.$store.dispatch('blog/deletePost', this.blog.id)
      this.isDeleting = false
    },

    // Not implemented: For testing purposes
    async updateArticle () {
      // this.isUpdating = true
      // Static data
      await this.$store.dispatch('blog/updatePost', {
        id: this.blog.id,
        residency: undefined,
        article: {
          title: 'New title 3',
          content: 'New content 3'
        }
      })
      // this.isUpdating = false
    }
  }
}
</script>

<style scoped>
/* Have to use a specific selector to avoid using !important */
body #container .blog-article {
  /* For buttons position */
  position: relative;

  color: black;
  border: 1px solid #c9c9c9;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 5px;
  background: white;

  & .head {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    @media (width <= 600px) {
      flex-direction: column;
    }

    & h3 {
      font-size: 40px;
    }

    & .profile-image {
      margin-right: 20px;

      & img {
        width: 150px;
        height: 150px;
        max-width: none; /* defined by global layout */
        object-fit: cover;
        border-radius: 50%;
      }

      @media (width <= 600px) {
        margin-right: 0;
        margin-bottom: 10px;
      }
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
  }

  & .action-buttons {
    position: absolute;
    top: 10px;
    right: 10px;

    & button {
      background: none;
      border: none;
      padding: 10px;
    }
  }
}
</style>
