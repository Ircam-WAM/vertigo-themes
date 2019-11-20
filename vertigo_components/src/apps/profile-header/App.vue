<template>
  <div class="profile-header">
    <div class="img-container">
      <img
        :class="[ 'profile-image', { 'can-follow': canFollow } ]"
        :src="profileImage"
      >
      <!-- Hidden to be used with ID in CSS -->
      <!--
        The SVG path was generated with Inkscape.
        The original source file is located at src/assets/profile-square-source.svg
      -->
      <svg
        class="empty-svg-hide"
        height="320"
        width="320"
      >
        <defs>
          <!--
            clipPathUnits and transform="scale()" to handle responsiveness
            See https://stackoverflow.com/a/54090749/4680909
            original SVG is 320 x 320
            >>> 1.0 / 320
            0.003125 (scale value)
          -->
          <clipPath
            id="picto-path"
            clipPathUnits="objectBoundingBox"
            transform="scale(0.003125, 0.003125)"
          >
            <path
              d="M 160 0 A 160 160 0 0 0 0 160 A 160 160 0 0 0 160 320 A 160 160 0 0 0 320 160 A 160 160 0 0 0 292.19141 70.134766 A 30 30 0 0 1 290.90039 71.521484 A 30 30 0 0 1 288.64844 73.5 A 30 30 0 0 1 286.20898 75.244141 A 30 30 0 0 1 283.60742 76.736328 A 30 30 0 0 1 280.87109 77.960938 A 30 30 0 0 1 278.02539 78.90625 A 30 30 0 0 1 275.09961 79.564453 A 30 30 0 0 1 272.12305 79.925781 A 30 30 0 0 1 270 80 A 30 30 0 0 1 267.00586 79.849609 A 30 30 0 0 1 264.03906 79.402344 A 30 30 0 0 1 261.13477 78.660156 A 30 30 0 0 1 258.31836 77.630859 A 30 30 0 0 1 255.61719 76.328125 A 30 30 0 0 1 253.06055 74.759766 A 30 30 0 0 1 250.67383 72.945312 A 30 30 0 0 1 248.47852 70.900391 A 30 30 0 0 1 246.5 68.648438 A 30 30 0 0 1 244.75586 66.208984 A 30 30 0 0 1 243.26367 63.607422 A 30 30 0 0 1 242.03906 60.871094 A 30 30 0 0 1 241.09375 58.025391 A 30 30 0 0 1 240.43555 55.099609 A 30 30 0 0 1 240.07422 52.123047 A 30 30 0 0 1 240 50 A 30 30 0 0 1 240.15039 47.005859 A 30 30 0 0 1 240.59766 44.039062 A 30 30 0 0 1 241.33984 41.134766 A 30 30 0 0 1 242.36719 38.318359 A 30 30 0 0 1 243.67188 35.617188 A 30 30 0 0 1 245.24023 33.060547 A 30 30 0 0 1 247.05469 30.673828 A 30 30 0 0 1 249.09961 28.478516 A 30 30 0 0 1 249.9668 27.716797 A 160 160 0 0 0 160 0 z "
            />
          </clipPath>
        </defs>
      </svg>
      <template v-if="canFollow">
        <button
          class="follow"
          :title="isFollowed ? 'Unfollow' : 'Follow'"
          :disabled="processing"
          @click="isFollowed ? unfollow() : follow()"
        >
          <img
            :src="isFollowed ? require('~/assets/unfollow.png') : require('~/assets/follow.png')"
            alt=""
          >
        </button>
      </template>
    </div>
    <button
      v-if="canFollow"
      class="action-button"
      :title="isFollowed ? 'Unfollow' : 'Follow'"
      :disabled="processing"
      @click="isFollowed ? unfollow() : follow()"
    >
      <span v-if="processing" class="loading">
        …
      </span>
      <span v-else>
        {{ isFollowed ? 'Unfollow' : 'Follow' }}
      </span>
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import djangoErrors from '~/utils/django-errors'
import fetchDrf from '~/utils/fetchDrf'
import EventBus from '~/utils/EventBus'

import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
  position: 'top-right',
  duration: 3000,
  theme: 'outline'
})

export default {
  name: 'App',
  data () {
    return {
      profileImage: '/static/vertigo_starts_eu/img/profile/placeholder_profile_320x320.png', // Default image
      isFollowed: false,
      processing: false,
      isValidUser: false
    }
  },
  computed: {
    ...mapState('user', [
      'isLogged',
      'user'
    ]),
    canFollow () {
      // In order to follow, you have to:
      // - Be logged
      // - Be on something else's page (not yourself)
      // - API responded a valid request for this user
      return this.isLogged &&
        this.username !== this.user.username &&
        this.isValidUser === true
    },
    // Username of the profile in the current page
    username () {
      if (!window.globalVars) {
        return null
      }
      return window.globalVars.username
    }
  },
  async mounted () {
    // Get logged-in user
    this.$store.dispatch('user/getUser')

    // Get current page's profile
    const resp = await fetchDrf(`/api/person/${this.username}/`)
    if (resp.status >= 400) {
      this.$toasted.error(`Unable to get user ${this.username}`)
      throw new Error(`${resp.status}: ${JSON.stringify(await resp.json())}`)
    }
    const person = await resp.json()

    this.isValidUser = true
    if (person['profile_image']) {
      this.profileImage = person['profile_image']
    }
    this.isFollowed = person['is_followed_by_me']
  },
  methods: {
    async follow () {
      this.processing = true
      const resp = await fetchDrf(`/api/person/${this.username}/follow/`, {
        method: 'POST'
      })

      if (resp.status >= 400) {
        this.processing = false
        const payload = await resp.json()
        if (resp.status === 403 && payload.detail === djangoErrors.invalidCsrf) {
          this.$toasted.error(`You are not logged in. Please login or refresh before following.`)
        } else {
          this.$toasted.error(`Unable to follow ${this.username}`)
        }
        throw new Error(`${resp.status}: ${JSON.stringify(payload)}`)
      }

      this.$toasted.show(`You started following ${this.username}`)
      EventBus.dispatchEvent('follow', { username: this.user.username })
      this.isFollowed = true
      this.processing = false
    },

    async unfollow () {
      this.processing = true
      const resp = await fetchDrf(`/api/person/${this.username}/unfollow/`, {
        method: 'POST'
      })

      if (resp.status >= 400) {
        this.processing = false
        const payload = await resp.json()
        if (resp.status === 403 && payload.detail === djangoErrors.invalidCsrf) {
          this.$toasted.error(`You are not logged in. Please login or before unfollowing.`)
        } else {
          this.$toasted.error(`Unable to unfollow ${this.username}`)
        }
        throw new Error(`${resp.status}: ${JSON.stringify(payload)}`)
      }

      this.$toasted.show(`You unfollowed ${this.username}`)
      EventBus.dispatchEvent('unfollow', { username: this.user.username })
      this.isFollowed = false
      this.processing = false
    }
  }
}
</script>

<style scoped>
.empty-svg-hide {
  width: 0;
  height: 0;

  /* Without this, svg takes height on firefox when resizing */
  position: absolute;
}

.img-container {
  color: white;
  position: relative;
  border-radius: 50%;
  max-width: 320px;
  max-height: 320px;
  margin: 0 auto;
  margin-bottom: 10px;

  & .profile-image.can-follow {
    clip-path: url('#picto-path') !important;
  }

  & .follow {
    border: none;
    background: none;
    padding: 0;
    line-height: 0;

    position: absolute;
    top: 8%;
    right: 8%;

    /*
    * original icon's size is 48x48px
    * parent's original size is 320
    * 48 / 320 = 0.15
    */
    width: 15%;
  }
}

.action-button {
  background: #47dfba;
  border: none;
  margin: 5px;
  margin-top: 10px;
  font-family: "Oswald", sans-serif;
  color: white;
  min-width: 150px;
  padding: 5px 20px;
  text-transform: uppercase;
  font-size: 20px;

  & .loading {
    font-size: 40px;
    line-height: 0;
    vertical-align: top;
  }
}
</style>
