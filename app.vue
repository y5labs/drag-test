<template>
  <div v-if="is_loaded">
    <svg width="500px" height="700px">
      <g transform="translate(75 75)">
        <radial-histogram
          :radius="[35, 60]"
          :range="wd_range"
          :values="wd"
        />
        <radial-selection
          :radius="[35, 60]"
          :display_quant="true"
          :quant_incr="Math.PI / 8"
          v-bind="wd_selection"
        />
        <radial-brush
          :radius="[0, 75]"
          :quant_incr="Math.PI / 8"
          v-bind="wd_selection"
        />
      </g>
      <g transform="translate(150 0)">
        <linear-histogram
          :width="250"
          :height="150"
          :range="wsp_freq_range"
          :values="wsp_freq"
        />
        <linear-selection
          :domain="wsp_freq_domain"
          :width="250"
          :height="150"
          :display_quant="true"
          :quant_incr="2"
          v-bind="wsp_selection"
        />
        <linear-brush
          :domain="wsp_freq_domain"
          :width="250"
          :height="150"
          :display_quant="true"
          :quant_incr="2"
          v-bind="wsp_selection"
        />
      </g>
      <g transform="translate(75 225)">
        <radial-histogram
          :radius="[35, 60]"
          :range="dpm_range"
          :values="dpm"
        />
        <radial-selection
          :radius="[35, 60]"
          :display_quant="true"
          :quant_incr="Math.PI / 8"
          v-bind="dpm_selection"
        />
        <radial-brush
          :radius="[0, 75]"
          :quant_incr="Math.PI / 8"
          v-bind="dpm_selection"
        />
      </g>
      <g transform="translate(150 150)">
        <linear-histogram
          :width="250"
          :height="150"
          :range="hs_freq_range"
          :values="hs_freq"
        />
        <linear-selection
          :domain="hs_freq_domain"
          :width="250"
          :height="150"
          :display_quant="true"
          :quant_incr="0.2"
          :display_fn="x => x.toFixed(1)"
          v-bind="hs_selection"
        />
        <linear-brush
          :domain="hs_freq_domain"
          :width="250"
          :height="150"
          :display_quant="true"
          :quant_incr="0.2"
          v-bind="hs_selection"
        />
      </g>
      <g transform="translate(0 300)">
        <chop-lines
          :width="400"
          :height="100"
          :range="hs_by_time_range"
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
            :range="wsp_by_time_range"
            :scaleBreak="[
              [15, { level: 0, class: 'normal'}],
              [Infinity, { level: 1, class: 'outside'}]
            ]"
            :quant_incr="5"
            :values="wsp_by_time"
          />
        </g>
        <linear-selection
          :domain="time_domain"
          :width="400"
          :height="200"
          :quant_incr="3600"
          :display_fn="x => new Date(x * 1000).toISOString().substring(0, 13)"
          v-bind="time_selection"
        />
        <linear-brush
          :domain="time_domain"
          :width="400"
          :height="200"
          :quant_incr="3600"
          v-bind="time_selection"
        />
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
import { apply_operation as apply_linear } from './linear/shared'

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
    async filter() {
      // await this.$store.dispatch('analytics/products_count_greaterthan', 5)
    },
    // async unfilter() {
    //   await this.$store.dispatch('analytics/products_count_clear')
    // }
  },
  computed: {
    metocean() {
      return this.$store.state.analytics.metocean
    },
    by_time() {
      return Array.from(this.metocean.by_time.all(Infinity))
    },
    hs_by_time_range() {
      return [0, Math.max.apply(null, this.by_time.map(x => x[1].d.hs))]
    },
    hs_by_time() {
      return this.by_time.map(x => x[1].isfiltered ? x[1].d.hs : null)
    },
    time_domain() {
      return [
        Array.from(this.metocean.by_time.unfiltered(1),
          x => x[1].time)[0],
        Array.from(this.metocean.by_time.unfiltered(-1),
          x => x[1].time)[0]
      ]
    },
    hs_freq_range() {
      return this.metocean.hs.range
    },
    hs_freq_domain() {
      return [
        this.metocean.hs.domain[0],
        this.metocean.hs.domain[1]
          + this.metocean.hs.quant_incr
      ]
    },
    hs_freq() {
      return this.metocean.hs.index.map(f =>
        this.metocean.hs.groups[f.r] || 0)
    },
    wsp_by_time_range() {
      return [0, Math.max.apply(null, this.by_time.map(x => x[1].d.wsp))]
    },
    wsp_by_time() {
      return this.by_time.map(x => x[1].isfiltered ? x[1].d.wsp : null)
    },
    wsp_freq_range() {
      return this.metocean.wsp.range
    },
    wsp_freq_domain() {
      return [
        this.metocean.wsp.domain[0],
        this.metocean.wsp.domain[1]
          + this.metocean.wsp.quant_incr
      ]
    },
    wsp_freq() {
      return this.metocean.wsp.index.map(f =>
        this.metocean.wsp.groups[f.r] || 0)
    },
    wd() {
      return Array(2 * Math.PI / this.metocean.wd.quant_incr)
        .fill(0).map((d, i) => (i * this.metocean.wd.quant_incr)
          .toFixed(3)).map(x => this.metocean.wd.groups[x] || 0)
    },
    wd_range() {
      return this.metocean.wd.range
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
    dpm() {
      return Array(2 * Math.PI / this.metocean.dpm.quant_incr)
        .fill(0).map((d, i) => (i * this.metocean.dpm.quant_incr)
          .toFixed(3)).map(x => this.metocean.dpm.groups[x] || 0)
    },
    dpm_range() {
      return this.metocean.dpm.range
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
          update: async hs_selection => {
            const values = Object.assign(
              {},
              this.$store.state.params.hs_selection,
              hs_selection)
            const selection = apply_linear(
              values.selection,
              values.operation,
              3600,
              this.hs_freq_domain)
            if (selection)
              await this.metocean.by_hs(selection[0], selection[1])
            else
              await this.metocean.by_hs(null)
            this.$store.commit('analytics/metocean_changed')
            this.$hub.emit('update', { hs_selection })
          }
        })
      }
    },
    time_selection() {
      return {
        ...this.$store.state.params.time_selection,
        hub: this.$hub.child({
          update: async time_selection => {
            const values = Object.assign(
              {},
              this.$store.state.params.time_selection,
              time_selection)
            const selection = apply_linear(
              values.selection,
              values.operation,
              3600,
              this.time_domain)
            if (selection)
              await this.metocean.by_time(selection[0], selection[1])
            else
              await this.metocean.by_time(null)
            this.$store.commit('analytics/metocean_changed')
            await this.$hub.emit('update', { time_selection })
          }
        })
      }
    }
  }
};
</script>