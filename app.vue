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
        <histogram-radial
          :display_radius="[35, 60]"
          :values="[
            3, 1, 2, 3, 1, 7, 3, 2, null, 1, 6, 3, null, 9, 3, 2
          ]"
        />
        <brush-radial
          :select_radius="[0, 76]"
          :display_radius="[35, 60]"
          :display_quant="true"
          v-bind="brushRadialProps"
        />
      </g>
      <g transform="translate(100 0)">
        <histogram-linear
          :width="200"
          :height="200"
          :values="[
            null, null, 5, 6, 5, null, 3, null, 2, 0, 3, 4, 4, 5, null, 5, 6, 6, 7, 8, null
          ]"
        />
      </g>
    </svg>
    <brush-linear
      v-bind="brushLinearProps"
    />
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
        ...this.$store.state.params.radial,
        hub: this.$hub.child({
          update: p => this.$hub.emit('update', { radial: p })
        })
      }
    },
    brushLinearProps() {
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