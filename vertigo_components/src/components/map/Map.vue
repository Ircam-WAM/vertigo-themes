<template>
  <LMap
    ref="map"
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
        v-for="m of markers"
        :key="m.slug"
        :lat-lng="[ m.lat, m.lon ]"
        @click="$emit('select', m.slug)"
      />
    </LMarkerCluster>
  </LMap>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { Icon } from 'leaflet'
import { LMap, LTileLayer, LMarker, LControlAttribution } from 'vue2-leaflet'
import LMarkerCluster from 'vue2-leaflet-markercluster'

// Resolves an issue where the markers would not appear
// See https://korigan.github.io/Vue2Leaflet/#/quickstart.md
delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LMarkerCluster,
    LControlAttribution
  },
  props: {
    markers: {
      type: Array,
      required: true
    }
  },
  computed: {
    mapboxURL () {
      const accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
      return `https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${accessToken}`
    },
    mapboxAttribution () {
      return 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery <a href="https://www.mapbox.com/">Mapbox</a>'
    }
  },
  mounted () {
    // Access leaflet instance through mapObject
    // See: https://github.com/KoRiGaN/Vue2Leaflet/blob/master/src/components/LMap.vue
    this.$refs.map.mapObject.on('click', this.deselect)
    this.$refs.map.mapObject.on('zoomstart', this.deselect)
  },
  beforeDestroy () {
    this.$refs.map.mapObject.off('click', this.deselect)
    this.$refs.map.mapObject.off('zoomstart', this.deselect)
  },
  methods: {
    deselect () {
      this.$emit('deselect')
    }
  }
}
</script>
