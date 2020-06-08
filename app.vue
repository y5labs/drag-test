<template>
  <div v-if="is_loaded">
    <svg width="500px" height="700px">
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
          v-bind="wd_selection"
        />
        <radial-brush
          :radius="[0, 76]"
          :quant_incr="Math.PI / 8"
          v-bind="wd_selection"
        />
      </g>
      <g transform="translate(150 0)">
        <linear-histogram
          :width="250"
          :height="150"
          :values="wsp_freq"
        />
        <linear-selection
          :domain="wsp_freq_domain"
          :width="250"
          :height="150"
          :quant_incr="2"
          v-bind="wsp_selection"
        />
        <linear-brush
          :domain="wsp_freq_domain"
          :width="250"
          :height="150"
          :quant_incr="2"
          v-bind="wsp_selection"
        />
      </g>
      <g transform="translate(75 225)">
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
          v-bind="dpm_selection"
        />
        <radial-brush
          :radius="[0, 76]"
          :quant_incr="Math.PI / 8"
          v-bind="dpm_selection"
        />
      </g>
      <g transform="translate(150 150)">
        <linear-histogram
          :width="250"
          :height="150"
          :values="hs_freq"
        />
        <linear-selection
          :domain="hs_freq_domain"
          :width="250"
          :height="150"
          :quant_incr="0.2"
          :display_fn="x => x.toFixed(1)"
          v-bind="hs_selection"
        />
        <linear-brush
          :domain="hs_freq_domain"
          :width="250"
          :height="150"
          :quant_incr="0.2"
          v-bind="hs_selection"
        />
      </g>
      <g transform="translate(0 300)">
        <chop-lines
          :width="400"
          :height="100"
          :scaleBreak="[
            [1.5, { level: 0, class: 'normal'}],
            [Infinity, { level: 1, class: 'outside'}]
          ]"
          :quant_incr="2"
          :values="hs_by_time"
        />
        <g transform="translate(0 100)">
          <chop-lines
            :width="400"
            :height="100"
            :scaleBreak="[
              [15, { level: 0, class: 'normal'}],
              [Infinity, { level: 1, class: 'outside'}]
            ]"
            :quant_incr="5"
            :values="wsp_by_time"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import radialBrush from './radial/brush'
import radialSelection from './radial/selection'
import radialHistogram from './radial/histogram'
import linearBrush from './linear/brush'
import linearSelection from './linear/selection'
import linearHistogram from './linear/histogram'
import chopLines from './chop-lines'

export default {
  components: {
    radialBrush,
    radialSelection,
    radialHistogram,
    linearBrush,
    linearSelection,
    linearHistogram,
    chopLines
  },
  async mounted() {
    await this.$store.dispatch('analytics/metocean_load')
    this.is_loaded = true
  },
  data() {
    return {
      is_loaded: false
    }
  },
  methods: {
    // async filter() {
    //   await this.$store.dispatch('analytics/products_count_greaterthan', 5)
    // },
    // async unfilter() {
    //   await this.$store.dispatch('analytics/products_count_clear')
    // }
  },
  computed: {
    metocean() {
      return this.$store.state.analytics.metocean
    },
    hs_by_time() {
      return Array.from(this.metocean.by_time.filtered(Infinity), x => x[1].hs)
    },
    hs_freq_domain() {
      return [
        this.metocean.hs_freq_iter[0],
        this.metocean.hs_freq_iter[this.metocean.hs_freq_iter.length - 1] + 0.2
      ]
    },
    hs_freq() {
      return this.metocean.hs_freq_iter.map(f => this.metocean.hs_freq[f.toFixed(1)] || 0)
    },
    wsp_by_time() {
      return Array.from(this.metocean.by_time.filtered(Infinity), x => x[1].wsp)
    },
    wsp_freq_domain() {
      return [
        this.metocean.wsp_freq_iter[0],
        this.metocean.wsp_freq_iter[this.metocean.wsp_freq_iter.length - 1] + 2
      ]
    },
    wsp_freq() {
      return this.metocean.wsp_freq_iter.map(f => this.metocean.wsp_freq[f] || 0)
    },
    wd_selection() {
      return {
        ...this.$store.state.params.wd_selection,
        hub: this.$hub.child({
          update: wd_selection => this.$hub.emit('update', { wd_selection })
        })
      }
    },
    wsp_selection() {
      return {
        ...this.$store.state.params.wsp_selection,
        hub: this.$hub.child({
          update: wsp_selection => this.$hub.emit('update', { wsp_selection })
        })
      }
    },
    dpm_selection() {
      return {
        ...this.$store.state.params.dpm_selection,
        hub: this.$hub.child({
          update: dpm_selection => this.$hub.emit('update', { dpm_selection })
        })
      }
    },
    hs_selection() {
      return {
        ...this.$store.state.params.hs_selection,
        hub: this.$hub.child({
          update: hs_selection => this.$hub.emit('update', { hs_selection })
        })
      }
    }
  }
};
</script>