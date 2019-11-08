<template>
  <Loading
    v-if="loading === true"
    color="black"
    class="center"
  />
  <div
    v-else-if="items.length === 0"
    class="center"
  >
    <template v-if="type === 'followers'">
      {{ username }} does not have any followers
    </template>
    <template v-else-if="type === 'following'">
      {{ username }} follows no one
    </template>
  </div>
  <div
    v-else
    class="list-container"
  >
    <div
      v-for="item of items"
      :key="item.id"
      class="item-container"
      :style="{ backgroundImage: item.profileImage ? `url('${item.profileImage}')` : null }"
    >
      <component
        :is="item.url ? 'a' : 'div'"
        :href="item.url ? item.url : null"
        class="item"
      >
        <p class="name">
          {{ item.name }}
        </p>
        <p class="occupation">
          {{ item.occupation }}
        </p>
        <p class="location">
          {{ item.location }}
        </p>
      </component>
    </div>
  </div>
</template>

<script>
import fetchDrf from '~/utils/fetchDrf'
import EventBus from '~/utils/EventBus'
import Loading from '~/components/common/Loading'

export default {
  name: 'List',
  components: {
    Loading
  },
  props: {
    username: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator (val) {
        return ['followers', 'following'].indexOf(val) !== -1
      }
    }
  },
  data () {
    return {
      isFollowed: false,
      items: [],
      loading: true
    }
  },
  async mounted  () {
    try {
      await this.getPosts()
    } catch (e) {
      this.loading = false
    }

    if (this.type === 'followers') {
      EventBus.addEventListener('follow', this.onFollow)
      EventBus.addEventListener('unfollow', this.onUnfollow)
    }
  },
  beforeDestroy () {
    if (this.type === 'followers') {
      EventBus.removeEventListener('follow', this.onFollow)
      EventBus.removeEventListener('unfollow', this.onUnfollow)
    }
  },
  methods: {
    async onFollow ({ username }) {
      // We have to reload the follow list because
      // we do not have all the details of the newly follower
      // (first_name, last_name etc...)
      await this.getPosts()
    },
    onUnfollow ({ username }) {
      // Remove username from list
      this.items = this.items.filter((item) => item.username !== username)
    },
    async getPosts () {
      this.loading = true
      const resp = await fetchDrf(`/api/person/${this.username}/`)

      if (resp.status >= 400) {
        throw new Error(`${resp.status}: ${JSON.stringify(await resp.json())}`)
      }

      const person = await resp.json()

      const list = this.type === 'followers' ? person.followers : person.following

      this.items = list.map((item) => ({
        name: item.name ? item.name : `${item['first_name']} ${item['last_name']}`,
        profileImage: item['profile_image'],
        url: item.url,
        location: item.location,
        occupation: item.occupation
      }))
      this.isFollowed = person['is_followed_by_me']

      this.loading = false
    }
  }
}
</script>

<style scoped>
.center {
  text-align: center;
}

/* ID selector to avoid global CSS */
#main-content .list-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;

  text-align: center;

  @media (width <= 800px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (width <= 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /*
  * Making a square
  * https://stackoverflow.com/a/45018255/4680909
  */
  & > .item-container {
    &::before {
      display: table;
      padding-top: 100%;
      content: '';
    }

    position: relative;

    & > * {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }

  & .item {
    display: flex;
    flex-direction: column;
    justify-content: center;

    padding: 10px;
    background: rgba(0, 0, 0, 0.2);

    &:hover {
      background: rgba(0, 0, 0, 0.5);
    }

    & p {
      color: white;
      font-family: "Oswald", sans-serif;
      text-align: center;
      margin-bottom: 0;
    }

    & .name {
      font-weight: normal;
      font-size: 1.5rem;
    }
  }
}
</style>
