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
      <brush-radial v-bind="brushRadialProps" />
    </svg>
    <brush-linear v-bind="brushLinearProps" />
    <histogram-linear />
    <histogram-radial />
    <chop-lines />
  </div>
</template>

<script>
import brushRadial from './brush-radial'
import brushLinear from './brush-linear'
import histogramLinear from './histogram-linear'
import histogramRadial from './histogram-radial'
import chopLines from './chop-lines'

export default {
  components: {
    brushRadial,
    brushLinear,
    histogramLinear,
    histogramRadial,
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
    brushRadialProps() {
      return {
        offset: [50, 50],
        select_radius: [0, 50],
        display_radius: [35, 45],
        ...this.$store.state.params.radial,
        hub: this.$hub.child({
          update: p => this.$hub.emit('update', { radial: p })
        })
      }
    },
    brushLinearProps() {
      return {
        offset: [0, 0],
        ...this.$store.state.params.linear,
        hub: this.$hub.child({
          update: p => this.$hub.emit('update', { linear: p })
        })
      }
    }
  }
};
</script>