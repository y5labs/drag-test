<template>
  <div v-if="is_loaded">
    <svg width="400px" height="570px" style="overflow: visible;">
      <g transform="translate(0 0)">
        <linear-histogram
          :width="400"
          :height="150"
          :quant_incr="1"
          :values="diff"
        />
      </g>
      <g transform="translate(0 200)">
        <linear-histogram
          :width="400"
          :height="150"
          :quant_incr="1"
          :values="acf"
        />
      </g>
      <g transform="translate(0 400)">
        <linear-histogram
          :width="400"
          :height="150"
          :quant_incr="1"
          :values="pacf"
        />
      </g>
      <g transform="translate(0 600)">
        <linear-line
          :width="400"
          :height="100"
          :scaleBreak="[
            [Infinity, { level: 0, class: 'outside'}]
          ]"
          :range="wsp_range"
          :quant_incr="5"
          :values="predicted"
        />
        <linear-line
          :width="400"
          :height="100"
          :scaleBreak="[
            [Infinity, { level: 0, class: 'normal'}]
          ]"
          :range="wsp_range"
          :quant_incr="5"
          :values="wsp"
        />
      </g>
    </svg>
  </div>
</template>

<script>
import linearHistogram from './linear/histogram'
import linearLine from './linear/line'
import metoceanData from './metocean-data'
import ctsa from 'ctsa'
import { epsilon } from './math'

export default {
  components: {
    linearHistogram,
    linearLine
  },
  async mounted() {
    await ctsa.ready
    this.is_loaded = true
  },
  data() {
    return {
      is_loaded: false
    }
  },
  methods: {
  },
  computed: {
    diff() {
      return ctsa.diff(metoceanData.map(x => x.wsp))
    },
    acf() {
      return ctsa.acf(this.diff)
    },
    pacf() {
      return ctsa.pacf(this.diff)
    },
    wsp_range() {
      return [
        Math.min.apply(null, this.wsp),
        Math.max.apply(null, this.wsp)
      ]
    },
    wsp() {
      return metoceanData.map(x => x.wsp)
    },
    predicted() {
      const half = metoceanData.length / 2
      const training = this.wsp.slice(0, half)
      const [predicted] = ctsa.arima(training, half, { p: 1, d: 0, q: 1, verbose: false })
      return training.concat(predicted)
    }
  }
};
</script>