<template>
  <div class="residency_blog_form_container">
    <form
      class="form"
      @submit.prevent="submit"
    >
      <div class="field-container">
        <label>Title</label>
        <input
          v-model="form.title"
          type="text"
          required
        >
      </div>
      <div class="field-container">
        <label>Content</label>
        <textarea
          v-model="form.content"
          required
        />
      </div>
      <div class="field-container">
        <select
          v-model="form.selectedResidency"
          autofocus
        >
          <option
            selected
            disabled
            value="default"
          >
            Residency (optional)
          </option>
          <option
            v-for="res of userResidencies"
            :key="res.id"
            :value="res.id"
          >
            {{ res.title }}
          </option>
        </select>
      </div>
      <input
        :disabled="processing"
        value="Envoyer"
        type="submit"
      >
    </form>
    <div
      v-if="success"
      class="success"
    >
      Your article has been published !
    </div>
    <div
      v-if="apiError"
      class="api-error"
    >
      Oops ! Something happened: {{ apiError }}
    </div>
  </div>
</template>

<script>
// import { validationMixin, required } from 'vuelidate'
import { mapGetters } from 'vuex'

export default {
  /*
  mixins: [
    validationMixin
  ],
  validation: {
    form: {
      title: {
        required
      },
      content: {
        required
      },
      selectedResidency: {
        required
      }
    }
  },
  */
  data () {
    return {
      processing: false,
      apiError: null,
      success: false,
      form: {
        title: '',
        content: '',
        selectedResidency: 'default'
      }
    }
  },
  computed: {
    ...mapGetters('residencies', [
      'userResidencies'
    ])
  },
  async mounted () {
    await Promise.all([
      this.$store.dispatch('residencies/getResidencies'),
      this.$store.dispatch('user/getUser')
    ])
  },
  methods: {
    async submit (e) {
      this.processing = true

      const body = {
        article: {
          title: this.form.title,
          content: this.form.content
        }
      }

      if (this.form.selectedResidency !== 'default') {
        body.residency = this.form.selectedResidency
      }

      try {
        // API call
        await this.$store.dispatch('blog/addPost', body)

        // Reset fields
        this.form.title = ''
        this.form.content = ''
        this.form.selectedResidency = 'default'
        // Reset validation
        e.target.reset()

        this.success = true

        // Success message disappear in 5s
        setTimeout(() => (this.success = false), 5000)
      } catch (e) {
        this.processing = false
        this.apiError = e.toString()
      }

      this.processing = false
    }
  }
}
</script>

<style scoped>
.success, .error {
  text-align: center;
  margin: 20px;
}
.error {
  color: red;
}
</style>
