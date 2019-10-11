<template>
  <textarea
    ref="field"
    :value="value"
  />
</template>

<script>
import 'simplemde/dist/simplemde.min.css'
import SimpleMDE from 'simplemde'

export default {
  name: 'MarkdownField',
  props: {
    value: {
      type: String,
      required: false,
      default: ''
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    value (val) {
      if (val !== this.simplemde.value()) {
        this.simplemde.value(val)
      }
    }
  },
  mounted () {
    this.simplemde = new SimpleMDE({
      element: this.$refs.field,
      toolbar: [
        'bold',
        'italic',
        'strikethrough',
        'heading',
        'quote',
        'unordered-list',
        'ordered-list',
        'link',
        'image'
      ],
      spellChecker: false,
      styleSelectedText: false
    })

    if (this.required) {
      const cmInput = this.simplemde.codemirror.getInputField()
      cmInput.setAttribute('required', true)
    }

    this.simplemde.codemirror.on('change', this.onChange)
    this.simplemde.codemirror.on('focus', this.onFocus)
    this.simplemde.codemirror.on('blur', this.onBlur)
  },
  beforeDestroy () {
    this.simplemde.codemirror.off('change', this.onChange)
    this.simplemde.codemirror.off('focus', this.onFocus)
    this.simplemde.codemirror.off('blur', this.onBlur)
  },
  methods: {
    // https://codemirror.net/doc/manual.html#events
    onChange (instance, ev) {
      this.$emit('input', this.simplemde.value())
    },
    onFocus (instance, ev) {
      this.$emit('focus', ev)
    },
    onBlur (instance, ev) {
      this.$emit('blur', ev)
    }
  }
}
</script>

<style>
.CodeMirror {
  min-height: auto;
}

.CodeMirror-scroll {
  min-height: 150px;
}
</style>
