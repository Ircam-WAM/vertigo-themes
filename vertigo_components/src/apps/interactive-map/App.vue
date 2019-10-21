<template>
  <div class="interactive-map">
    <h1>STARTS Community Map</h1>
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
      <component
        :is="selected.url ? 'a' : 'div'"
        v-if="selected !== null"
        :href="selected.url ? selected.url : null"
        :target="selected.url ? '_blank' : null"
        class="selected-container"
        :style="{ backgroundImage: selected.card ?
          `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${selected.card}')` :
          `linear-gradient(rgba(0, 15, 36, 1), rgba(0, 15, 36, 1))`
        }"
      >
        <button
          class="close"
          @click.stop.prevent="selectedId = null"
        >
          &times;
        </button>
        <h3
          v-if="selected.title"
          class="title"
        >
          {{ truncate(selected.title, 40) }}
        </h3>
        <div
          v-if="selected.keywords"
          class="keywords-container"
        >
          <div
            v-for="keyword of selected.keywords.slice(0, 2)"
            :key="`${selected.slug}-${keyword}`"
            class="keyword"
          >
            {{ keyword }}
          </div>
        </div>
        <h4
          v-if="selected.description"
          class="description"
        >
          {{ truncate(selected.description, 50) }}
        </h4>
        <h4
          v-if="selected.mappable_location && selected.categories.indexOf('persons') === -1"
          class="location"
        >
          {{ selected.mappable_location }}
        </h4>
      </component>
      <div
        v-if="loading"
        class="loading"
      >
        <Loading
          color="white"
        />
      </div>
      <div
        v-else
      >
        <LMap
          class="map"
          :center="[ 47.91, 6.85 ]"
          :zoom="3.2"
        >
          <!--<LTileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />-->
          <LTileLayer
            :url="mapboxURL"
          />
          <LControlAttribution
            :prefix="mapboxAttribution"
            position="bottomleft"
          />
          <LMarkerCluster>
            <LMarker
              v-for="m of filteredMarkers.filter(it => it.lat && it.lon)"
              :key="m.slug"
              :lat-lng="[ m.lat, m.lon ]"
              @click="selectedId = m.slug"
            />
          </LMarkerCluster>
        </LMap>
      </div>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { Icon } from 'leaflet'
import { LMap, LTileLayer, LMarker, LControlAttribution } from 'vue2-leaflet'
import LMarkerCluster from 'vue2-leaflet-markercluster'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

import Loading from '~/components/common/Loading.vue'

// Resolves an issue where the markers would not appear
// See https://korigan.github.io/Vue2Leaflet/#/quickstart.md
delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: 'App',
  components: {
    Multiselect,
    Loading,
    LMap,
    LTileLayer,
    LMarker,
    LMarkerCluster,
    LControlAttribution
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
      return this.markers.find(it => it.slug === this.selectedId)
    },
    mapboxURL () {
      const accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
      return `https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${accessToken}`
    },
    mapboxAttribution () {
      return 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery <a href="https://www.mapbox.com/">Mapbox</a>'
    },
    filteredMarkers () {
      if (!this.selectedFilters || this.selectedFilters.length === 0) {
        return this.markers
      }
      const filtersKey = this.selectedFilters.map((f) => f.id)
      return this.markers.filter((m) => m.categories.some((c) => filtersKey.indexOf(c) !== -1))
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
        this.markers = data.objects

        // Check markers
        const nullSlug = this.markers.filter((m) => !m.slug)
        if (nullSlug.length > 0) {
          console.warn('some markers have invalid slug', nullSlug.map(m => Object.assign({}, m)))
        }

        this.loading = false
      } catch (e) {
        console.error(e)
        alert('Unable to load map')
      }
    },
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
.interactive-map {
  max-width: 80vw;
  margin: 0 auto;

  @media (width <= 800px) {
    max-width: 95vw;
  }
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
    height: calc(100vh - 450px);
    min-height: 500px;

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
  }

  & .description {
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
