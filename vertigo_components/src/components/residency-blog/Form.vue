<template>
  <div class="residency_blog_form_container">
    <form
      class="form"
      @submit.prevent="submit"
    >
      <div class="field-container">
        <select
          v-model="form.selectedResidency"
          autofocus
          required
        >
          <option
            selected
            disabled
            value="default"
          >
            Residency
          </option>
          <option
            v-for="res of residencies"
            :key="res.id"
            :value="res.id"
          >
            {{ res.title }}
          </option>
        </select>
      </div>
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
import fetchDrf from '~/utils/fetchDrf'

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
      },
      residencies: []
    }
  },
  computed: {
    csrfToken () {
      const el = document.querySelector('input[name="csrfmiddlewaretoken"]')
      if (!el) {
        return null
      }
      return el.value
    }
  },
  mounted () {
    this.getResidencies()
  },
  methods: {
    async getResidencies () {
      try {
        const resp = await fetchDrf('/api/residency')

        if (resp.status >= 400) {
          this.apiError = `${resp.status}: ${JSON.stringify(await resp.json())}`
          return
        }

        this.residencies = await resp.json()
      } catch (e) {
        this.apiError = e.toString()
      }
    },
    async submit (e) {
      this.processing = true
      const body = {
        article: {
          title: this.form.title,
          content: this.form.content
        },
        residency: this.form.selectedResidency
      }

      try {
        const resp = await fetchDrf('/api/residency-blog/', {
          method: 'POST',
          body: JSON.stringify(body)
        })

        if (resp.status >= 400) {
          this.apiError = `${resp.status}: ${JSON.stringify(await resp.json())}`
          this.processing = false
          return
        }

        // Reset fields
        this.form.title = ''
        this.form.content = ''
        this.form.selectedResidency = 'default'
        // Reset validation
        e.target.reset()

        this.success = true
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
