<template>
  <div class="interactive-map">
    <h1>STARTS Community Map</h1>
    <p class="introduction">
      Here is THE place to find the STARTS community members disseminated worldwide.<br>
      Discover new people and follow them to see their news, by using the categories' filters or passing over the users' locations. You can also be inspired by the residencies promoted by the initiative. The STARTS community gains weight every day, be part of it!
      <br><br>

      The community in numbers:<br>
      <ul>
        <li>{{ stats.total }} members in total</li>
        <li>{{ stats.residencies }} residencies</li>
        <li>{{ stats.individuals }} individuals - artists & designers, scientists / researchers, technologists and supporters</li>
        <li>{{ stats.organizations }} organisations - artistic and cultural institutions, universities and research centres, industry leaders & start-ups, producers & hubs</li>
      </ul>
    </p>
    <!-- Search disabled because it adds an input and push it to the DOM when user click on it -->
    <Multiselect
      v-model="selectedFilters"
      :multiple="true"
      :searchable="false"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="false"
      :hide-selected="true"
      label="name"
      track-by="name"
      :options="[
        { name: 'Residencies', id: 'residencies' },
        { name: 'Persons', id: 'persons' },
        { name: 'Organizations', id: 'organizations' },
        { name: 'Producers', id: 'producers' }
      ]"
      class="filters"
    />
    <div class="map-container">
      <Card
        v-if="selected !== null"
        v-bind="selected"
        @close="selectedId = null"
      />
      <div
        v-if="loading"
        class="loading"
      >
        <Loading color="white" />
      </div>
      <div v-else>
        <Map
          class="map"
          :markers="filteredMarkers"
          @select="selectedId = $event"
          @deselect="selectedId = null"
        />
        <div class="statistics">
          <div class="total">
            Total number of places: {{ filteredMarkers.length }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '~/components/map/Card'
import Map from '~/components/map/Map'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

import Loading from '~/components/common/Loading.vue'

export default {
  name: 'App',
  components: {
    Multiselect,
    Loading,
    Map,
    Card
  },
  data () {
    return {
      loading: true,
      markers: [],
      selectedId: null,
      selectedFilters: []
    }
  },
  computed: {
    selected () {
      if (this.selectedId === null) {
        return null
      }

      const originalSelected = this.markers.find(it => it.slug === this.selectedId)
      if (!originalSelected) {
        return null
      }

      // Rename 'mappable-location' to mappableLocation
      const { 'mappable-location': mappableLocation, ...others } = originalSelected
      return {
        mappableLocation,
        ...others
      }
    },
    filteredMarkers () {
      if (!this.selectedFilters || this.selectedFilters.length === 0) {
        return this.markers
      }
      const filtersKey = this.selectedFilters.map((f) => f.id)
      // filter markers to only get the ones with the selected categories
      return this.markers.filter((m) => m.categories.some((c) => filtersKey.includes(c)))
    },

    stats () {
      const getMarkersByCatgory = (categoryKey) => {
        return this.markers.filter((m) => m.categories.includes(categoryKey))
      }

      const total = this.markers.length
      const residencies = getMarkersByCatgory('residencies').length
      const organizations = getMarkersByCatgory('organizations').length
      const individuals = getMarkersByCatgory('persons').length
      const producers = getMarkersByCatgory('producers').length

      return {
        total,
        residencies,
        organizations,
        individuals,
        producers
      }
    }
  },
  mounted () {
    this.getMarkers()
  },
  methods: {
    async getMarkers () {
      this.loading = true
      try {
        const resp = await fetch('/public-network-data-new/')
        const data = await resp.json()

        // filter markers to remove the ones without latitute or longitude
        this.markers = data.objects.filter(marker => marker.lat && marker.lon)

        // Warn about markers without slug
        const nullSlug = this.markers.filter((m) => !m.slug)
        if (nullSlug.length > 0) {
          console.warn('some markers have invalid slug', nullSlug.map(m => Object.assign({}, m)))
        }

        this.loading = false
      } catch (e) {
        console.error(e)
        alert('Unable to load map')
      }
    }
  }
}
</script>

<style scoped>
.interactive-map {
  max-width: 80vw;
  margin: 0 auto;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-container {
  position: relative;

  /* for text inside cluster markers color */
  color: white;

  & .map,
  & .loading {
    /* 350px is card's height + padding */
    min-height: 350px;
    height: calc(100vh - 450px);

    @media (width <= 600px) {
      height: calc(100vh - 200px);
    }
  }
}

.filters {
  margin-bottom: 20px;

  /* because Leaflet control buttons has z-index 1000 */
  &.multiselect--active {
    z-index: 1050;
  }
}

.statistics {
  font-family: Oswald, sans-serif;
  color: black;
  text-align: right;

  & .total {
    background: white;
    padding: 0 5px;
    display: inline-block;
  }
}
</style>
