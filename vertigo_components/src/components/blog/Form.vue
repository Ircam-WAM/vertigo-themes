<template>
  <div class="residency_blog_form_container">
    <form
      ref="form"
      class="form"
      @submit.prevent="submit"
      @focusin="formHasFocus = true"
      @focusout="setFocus"
      novalidate
    >
      <div class="field-container">
        <MarkdownField
          id="content"
          v-model.trim="form.content"
          @blur="$v.form.content.$touch"
        />
        <div
          v-if="$v.form.content.$error && !$v.form.content.required"
          class="error"
        >
          Content is required
        </div>
      </div>
      <transition name="fade-height">
        <div v-show="formHasFocus || !isDefaultFormData">
          <div class="field-container">
            <label
              for="title"
              tabindex="0"
            >
              Title
              <span class="mandatory">*</span>
            </label>
            <input
              id="title"
              v-model.trim="form.title"
              type="text"
              @blur="$v.form.title.$touch"
            >
            <div
              v-if="$v.form.title.$error && !$v.form.title.required"
              class="error"
            >
              Title is required
            </div>
          </div>
          <div class="field-container picture-field">
            <label
              for="file"
              tabindex="0"
            >
              Picture
            </label>
            <!-- type="button" avoids submitting -->
            <button
              v-if="imgPreview"
              type="button"
              class="remove-picture"
              @click="removePicture"
            >
              &times;
            </button>
            <label
              for="file"
              tabindex="0"
            >
              <img
                v-if="imgPreview"
                :src="imgPreview"
                class="img-preview"
              >
              <div
                v-else
                class="img-placeholder"
              >
                Browse
              </div>
            </label>
            <input
              id="file"
              ref="file"
              type="file"
              accept="image/gif, image/jpeg, image/png"
              @change="handleFileChange"
            >
          </div>
          <div
            v-if="userResidencies.length > 0"
            class="field-container"
          >
            <label
              for="residency"
              tabindex="0"
            >Residency</label>
            <select
              id="residency"
              v-model.trim="form.selectedResidency"
              autofocus
            >
              <option
                selected
                value="default"
              />
              <option
                v-for="res of userResidencies"
                :key="res.id"
                :value="res.id"
              >
                {{ res.title }}
              </option>
            </select>
          </div>
          <div class="field-container">
            <input
              :disabled="processing"
              value="Submit"
              type="submit"
            >
          </div>
        </div>
      </transition>
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
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import MarkdownField from '~/components/common/MarkdownField'

const defaultForm = {
  title: '',
  content: '',
  selectedResidency: 'default',
  img: null
}

export default {
  components: {
    MarkdownField
  },
  mixins: [
    validationMixin
  ],
  validations: {
    form: {
      title: {
        required
      },
      content: {
        required
      }
    }
  },
  data () {
    return {
      form: {
        ...defaultForm
      },
      imgPreview: null,
      processing: false,
      apiError: null,
      success: false,
      formHasFocus: false
    }
  },
  computed: {
    ...mapGetters('residencies', [
      'userResidencies'
    ]),
    isDefaultFormData () {
      return Object.keys(this.form).every((field) => this.form[field] === defaultForm[field])
    }
  },
  async mounted () {
    await Promise.all([
      this.$store.dispatch('residencies/getResidencies'),
      this.$store.dispatch('user/getUser')
    ])
  },
  methods: {
    setFocus (ev) {
      // Add tabindex="0" attribute to labels in order to make them appear as relatedTarget
      // https://stackoverflow.com/a/42764495/4680909

      // Workaround to avoid closing the form when opening the OS's file picker
      if (ev.target.id === 'file') {
        return
      }

      const newTarget = ev.relatedTarget
      if (!newTarget) {
        this.formHasFocus = false
        return
      }
      let formElements = []
      const inputs = Array.from(this.$refs.form.elements)
      formElements = formElements.concat(inputs)
      for (const input of inputs) {
        formElements = formElements.concat(Array.from(input.labels))
      }
      this.formHasFocus = formElements.some(formEl => formEl === newTarget)

      // Previous workaround (need 200ms delay to handle click on labels)
      // Keeping it in case of browser incompatibility
      /*
      // Delay event to handle update of `docum = trueent.activeElement` to newly focused element
      // Use case: User has focus on field1 and then focus field2
      // If there is no timeout, `document.activeElement` is body
      setTimeout(() => {
        const inputs = Array.from(this.$refs.form.elements)
        const formHasFocus = inputs.some(input => input === document.activeElement)
        this.formHasFocus = formHasFocus
      }, 200)
      */
    },
    removePicture () {
      this.form.img = null
      this.imgPreview = null
      // remove value for the browser
      this.$refs.file.value = ''
    },
    async submit (e) {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }

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

      if (this.form.img) {
        body.image = this.imgPreview
        // Remove the file type
        body.image = body.image.split(',')[1]
      }

      try {
        // API call
        await this.$store.dispatch('blog/addPost', body)

        // Reset fields
        this.form = { ...defaultForm }

        // Reset data
        this.imgPreview = null
        this.formHasFocus = false

        // Reset validation
        e.target.reset()
        this.$v.$reset()
        this.success = true

        // Success message disappear in 5s
        setTimeout(() => (this.success = false), 5000)
      } catch (e) {
        this.processing = false
        this.apiError = e.toString()
      }

      this.processing = false
    },
    async fileToBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    async handleFileChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }

      this.form.img = files[0]
      this.imgPreview = await this.fileToBase64(this.form.img)
    }
  }
}
</script>

<style scoped>
form {
  & input[type="text"],
  & input[type="email"],
  & select,
  & select:focus {
    background: white;
    color: black;
  }
}

label,
.label {
  float: none;
  line-height: 1.5rem;
  font-family: "Oswald", sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.375rem 1.5rem 0.375rem 0;
  width: 100%;
  text-transform: uppercase;
}

.picture-field {
  & input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  & label {
    padding: 0;
    cursor: pointer;
  }

  /* Same as ~/components/blog/Article.vue: .post-image */
  & .img-preview {
    max-width: 100%;
    display: block;
    margin: 0 auto;
    max-height: 200px;
  }

  & .remove-picture {
    border: none;
    margin-left: auto;
    margin-right: 0;
    display: block;
    background-color: rgb(246, 245, 244);
  }

  & .img-placeholder {
    background: white;
    width: 100%;
    height: 100px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.field-container {
  margin-bottom: 20px;
}

.success,
.error {
  text-align: center;
  margin: 20px;
}

.error {
  color: red;
  margin: 0;
  text-align: left;
}

.mandatory {
  color: red;
}

.fade-height-enter-active,
.fade-height-leave-active {
  transition: max-height 0.2s;
  max-height: 350px;
  overflow: hidden;
}

.fade-height-enter,
.fade-height-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
