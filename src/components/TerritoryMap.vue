<template>
  <!-- <h3 v-if="territory.addresses.length === 0" class="w-100 text-center">
    There are no addresses in this territory.
  </h3> -->
  <div class="territory-map">
    <l-map
      class="map"
      :zoom="zoom"
      :center="center"
      :bounds="bounds">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker
        v-for="(x, i) in territory.addresses"
        :key="i"
        @click="() => centerMarker(x)"
        :lat-lng="getLatLng(x)">
        <l-icon v-if="mapOptions.showSortOrder">
          <div class="sort-order-icon font-weight-bolder text-primary bg-warning">{{i + 1}}</div>
        </l-icon>
        <l-popup>
          <MapLinks :address='x' :simple="mapOptions.simple"></MapLinks>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LPopup,
  LControlZoom,
} from 'vue2-leaflet';
import { latLngBounds } from 'leaflet';
import get from 'lodash/get';
import { mapGetters, mapActions } from 'vuex';
import MapLinks from './MapLinks';

const defaultOptions = {
  showSortOrder: false,
  simple: false,
};

export default {
  name: 'TerritoryMap',
  components: {
    LMap,
    LTileLayer,
    LIcon,
    LMarker,
    LPopup,
    LControlZoom,
    MapLinks,
  },
  props: ['id', 'territory', 'options'],
  data() {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 13,
      showCard: false,
      center: [0, 0],
    };
  },
  computed: {
    ...mapGetters({
      token: 'auth/token',
    }),
    bounds() {
      return latLngBounds(get(this.territory, 'addresses', []).map(terr => [terr.latitude, terr.longitude]));
    },
    mapOptions() {
      return this.options || defaultOptions;
    },
    sortDisplay(sort) {
      return !sort ? '' : sort;
    },
  },
  methods: {
    ...mapActions({
      getTerritory: 'territory/getTerritory',
    }),
    centerMarker(address) {
      this.heading = address.addr1;
      if (address.latitude && address.longitude) {
        this.center = [address.latitude, address.longitude];
      }
    },
    getLatLng(address) {
      if (address.latitude && address.longitude) {
        return [address.latitude, address.longitude];
      }
      return [0, 0];
    },
  },
  async mounted() {
    if (this.token && !this.territory) {
      await this.getTerritory({ id: this.id });
    }
  },
};
</script>

<style lang="scss" scoped>
  .territory-map {
    height: calc(100vh - 107px);

    .map {
      width: 100%;
    }
  }
  .leaflet-popup h2 {
    font-size: 18px;
  }
  .sort-order-icon {
    border: solid 3px;
    border-radius: 50%;
    line-height: 22px;
    min-height: 30px;
    width: 30px;
    font-size: 18px;
  }
</style>
