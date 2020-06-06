<template>
  <div v-if="productsbyname">
    <ul id="example-1">
      <li v-for="p of productsbyname" :key="p.id">
        {{ p.name }} ({{ p.count }})
      </li>
    </ul>
    <button @click="filter">filter</button>
    <button @click="unfilter">unfilter</button>
    <svg width="300px" height="200px">
      <g transform="translate(75 75)">
        <radial-histogram
          :radius="[35, 60]"
          :values="[
            3, 1, 2, 3, 1, 7, 3, 2, null, 1, 6, 3, null, 9, 3, 2
          ]"
        />
        <radial-selection
          :radius="[35, 60]"
          :display_quant="true"
          :quant_incr="Math.PI / 8"
          v-bind="radialProps"
        />
        <radial-brush
          :radius="[0, 76]"
          :quant_incr="Math.PI / 8"
          v-bind="radialProps"
        />
      </g>
      <g transform="translate(100 0)">
        <linear-histogram
          :width="200"
          :height="200"
          :values="[
            null, null, 5, 6, 5, null, 3, null, 2, 0, 3, 4, 4, 5, null, 5, 6, 6, 7, 8, null
          ]"
        />
      </g>
    </svg>
    <linear-brush
      v-bind="linearProps"
    />
    <chop-lines />
  </div>
</template>

<script>
import radialBrush from './radial/brush'
import radialSelection from './radial/selection'
import radialHistogram from './radial/histogram'
import linearBrush from './linear/brush'
import linearHistogram from './linear/histogram'
import chopLines from './chop-lines'

export default {
  components: {
    radialBrush,
    radialSelection,
    radialHistogram,
    linearBrush,
    linearHistogram,
    chopLines
  },
  mounted() {
    this.$store.dispatch('analytics/products_load')
    // or await...
  },
  data() {
    return { }
  },
  methods: {
    async filter() {
      await this.$store.dispatch('analytics/products_count_greaterthan', 5)
    },
    async unfilter() {
      await this.$store.dispatch('analytics/products_count_clear')
    }
  },
  computed: {
    productsbyname() {
      return Array.from(
        this.$store.state.analytics.products.by_name.filtered(Infinity),
        x => x[1])
    },
    radialProps() {
      return {
        ...this.$store.state.params.radial,
        hub: this.$hub.child({
          update: p => this.$hub.emit('update', { radial: p })
        })
      }
    },
    linearProps() {
      return {
        ...this.$store.state.params.linear,
        hub: this.$hub.child({
          update: p => this.$hub.emit('update', { linear: p })
        })
      }
    }
  }
};
</script>