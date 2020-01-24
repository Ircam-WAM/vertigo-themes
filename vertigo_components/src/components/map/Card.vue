<template>
  <component
    :is="url ? 'a' : 'div'"
    :href="url ? url : null"
    :target="url ? '_blank' : null"
    class="selected-container"
    :style="{ backgroundImage: card ?
      `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${card}')` :
      `linear-gradient(rgba(0, 15, 36, 1), rgba(0, 15, 36, 1))`
    }"
  >
    <button
      class="close"
      @click.stop.prevent="$emit('close')"
    >
      &times;
    </button>
    <h3
      v-if="title"
      class="title"
    >
      {{ truncate(title, 40) }}
    </h3>
    <div class="categories">
      <div
        v-for="c of categories"
        :key="c"
        class="tag"
      >
        {{ categoryName[c] }}
      </div>
    </div>
    <div
      v-if="keywords && keywords.length > 0"
      class="keywords-container"
    >
      <div
        v-for="keyword of keywords.slice(0, 2)"
        :key="`${slug}-${keyword}`"
        class="keyword"
      >
        {{ keyword }}
      </div>
    </div>
    <h4
      v-if="description"
      class="description"
    >
      {{ truncate(description, 50) }}
    </h4>
    <h4
      v-if="mappableLocation && categories.indexOf('persons') === -1"
      class="location"
    >
      {{ mappableLocation }}
    </h4>
  </component>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: {
      type: String,
      required: false,
      default: null
    },
    description: {
      type: String,
      required: false,
      default: null
    },
    url: {
      type: String,
      required: false,
      default: null
    },
    keywords: {
      type: Array,
      required: false,
      default: null
    },
    slug: {
      type: String,
      required: false,
      default: null
    },
    categories: {
      type: Array,
      required: true
    },
    mappableLocation: {
      type: String,
      required: false,
      default: null
    },
    card: {
      type: String, // URL
      required: false,
      default: null
    }
  },
  computed: {
    categoryName () {
      return {
        persons: 'Individual',
        organizations: 'Organisation',
        residencies: 'Residency',
        producers: 'Producer / Supporter',
        Technologist: 'Technologist',
        Artist: 'Artist',
        'Scientist / Researcher': 'Scientist / Researcher'
      }
    }
  },
  methods: {
    truncate (str, length) {
      if (str.length < length) {
        return str
      }
      return str.substring(0, length) + '...'
    }
  }
}
</script>

<style scoped>
.selected-container {
  /* background-image is overidden by inlined style */
  background-image:
    linear-gradient(
      rgba(0, 0, 0, 0.6),
      rgba(0, 0, 0, 0.6)
    );
  background-size: cover;

  padding: 20px;
  border: 1px solid #50e3c2;

  width: 300px;
  height: 300px;
  position: absolute;
  z-index: 500;
  top: 5%;
  left: 5%;

  color: white;
  text-align: center;

  & .close {
    position: absolute;
    color: white;
    opacity: 1;

    border: none;
    background: transparent;

    top: 2px;
    right: 8px;
    font-size: 30px;
  }

  & > *:not(.close) {
    margin-bottom: 15px;
  }

  & .title {
    font-size: 25px;
    font-family: Oswald, sans-serif;
    margin-top: 0;
    margin-bottom: 10px;
    line-height: 1;
  }

  & .categories {
    margin-bottom: 0px;
    & .tag {
      background-color: white;
      border-radius: 5px;
      color: black;
      font-family: "Oswald", sans-serif;
      padding: 0 10px;
      font-size: 18px;
      line-height: 1.5;
      margin: 3px;
    }
  }

  & .description {
    margin-top: 0;
    font-size: 1rem;
  }

  & .keywords-container .keyword {
    border-radius: 2px;
    border: 2px solid #47dfba;
    color: #47dfba;
    font-size: 15px;
    text-align: center;
    display: inline-block;
    padding: 8px;
    line-height: 1;

    &:not(:last-child) {
      margin-right: 10px;
      margin-bottom: 5px;
    }
  }

  & .location {
    font-size: 1rem;
  }

  @media (width <= 600px) {
    width: 100%;
    height: 100%;

    /* on top of map controls */
    z-index: 1050;
    top: 0;
    left: 0;
  }
}
</style>
