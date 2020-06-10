<template>
  <div v-if="is_loaded">
    <svg width="400px" height="550px" style="overflow: visible;">
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
          :quant_incr="wsp_freq_quant_incr"
          v-bind="wsp_selection"
        />
        <linear-brush
          :domain="wsp_freq_domain"
          :width="250"
          :height="150"
          :display_quant="true"
          :quant_incr="wsp_freq_quant_incr"
          v-bind="wsp_selection"
        />
      </g>
      <g transform="translate(75 250)">
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
      <g transform="translate(150 175)">
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
          :quant_incr="hs_freq_quant_incr"
          :display_fn="x => x.toFixed(1)"
          v-bind="hs_selection"
        />
        <linear-brush
          :domain="hs_freq_domain"
          :width="250"
          :height="150"
          :display_quant="true"
          :quant_incr="hs_freq_quant_incr"
          v-bind="hs_selection"
        />
      </g>
      <g transform="translate(0 350)">
        <linear-line
          :width="400"
          :height="100"
          :range="hs_by_time_range"
          :scaleBreak="hs_by_time_breaks"
          :quant_incr="2"
          :values="hs_by_time_inv"
        />
        <linear-area
          :width="400"
          :height="100"
          :range="hs_by_time_range"
          :scaleBreak="hs_by_time_breaks"
          :quant_incr="2"
          :values="hs_by_time"
        />
        <g transform="translate(0 100)">
          <linear-line
            :width="400"
            :height="100"
            :range="wsp_by_time_range"
            :scaleBreak="wsp_by_time_breaks"
            :quant_incr="5"
            :values="wsp_by_time_inv"
          />
          <linear-area
            :width="400"
            :height="100"
            :range="wsp_by_time_range"
            :scaleBreak="wsp_by_time_breaks"
            :quant_incr="5"
            :values="wsp_by_time"
          />
        </g>
        <linear-selection
          :domain="time_domain"
          :width="400"
          :height="200"
          :quant_incr="time_quant_incr"
          :display_fn="x => new Date(x * 1000).toISOString().substring(0, 13)"
          v-bind="time_selection"
        />
        <linear-brush
          :domain="time_domain"
          :width="400"
          :height="200"
          :quant_incr="time_quant_incr"
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
import linearArea from './linear/area'
import linearLine from './linear/line'
import { apply_operation as apply_linear } from './linear/shared'
import { apply_operation as apply_radial, splitselection, quantdeg } from './radial/shared'
import { epsilon } from './math'

export default {
  components: {
    radialBrush,
    radialSelection,
    radialHistogram,
    linearBrush,
    linearSelection,
    linearHistogram,
    linearArea,
    linearLine
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
    hs_by_time_breaks() {
      const hs_selection = this.$store.state.params.hs_selection
      if (hs_selection) {
        const selection = apply_linear(
          hs_selection.selection,
          hs_selection.operation,
          this.hs_freq_quant_incr,
          this.hs_freq_domain)
        if (selection)
          return [
            [selection[0], { level: 0, class: 'outside'}],
            [selection[1] + this.hs_freq_quant_incr - epsilon, { level: 1, class: 'normal'}],
            [Infinity, { level: 2, class: 'outside'}]
          ]
      }
      return [
        [Infinity, { level: 0, class: 'normal'}]
      ]
    },
    hs_by_time() {
      return this.by_time.map(x => x[1].isfiltered ? x[1].d.hs : null)
    },
    hs_by_time_inv() {
      return this.by_time.map(x => x[1].isfiltered ? null : x[1].d.hs)
    },
    time_domain() {
      return [
        Array.from(this.metocean.by_time.unfiltered(1),
          x => x[1].time)[0],
        Array.from(this.metocean.by_time.unfiltered(-1),
          x => x[1].time)[0]
      ]
    },
    time_quant_incr() {
      return 3600
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
              this.time_quant_incr,
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
    },
    hs_freq_quant_incr() {
      return this.metocean.hs.quant_incr
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
              this.hs_freq_quant_incr,
              this.hs_freq_domain)
            if (selection)
              await this.metocean.hs_freq(selection[0], selection[1])
            else
              await this.metocean.hs_freq(null)
            this.$store.commit('analytics/metocean_changed')
            await this.$hub.emit('update', { hs_selection })
          }
        })
      }
    },
    wsp_by_time_range() {
      return [0, Math.max.apply(null, this.by_time.map(x => x[1].d.wsp))]
    },
    wsp_by_time_breaks() {
      const wsp_selection = this.$store.state.params.wsp_selection
      if (wsp_selection) {
        const selection = apply_linear(
          wsp_selection.selection,
          wsp_selection.operation,
          this.wsp_freq_quant_incr,
          this.wsp_freq_domain)
        if (selection)
          return [
            [selection[0], { level: 0, class: 'outside'}],
            [selection[1] + this.wsp_freq_quant_incr - epsilon, { level: 1, class: 'normal'}],
            [Infinity, { level: 2, class: 'outside'}]
          ]
      }
      return [
        [Infinity, { level: 0, class: 'normal'}]
      ]
    },
    wsp_by_time() {
      return this.by_time.map(x => x[1].isfiltered ? x[1].d.wsp : null)
    },
    wsp_by_time_inv() {
      return this.by_time.map(x => x[1].isfiltered ? null : x[1].d.wsp)
    },
    wsp_freq_quant_incr() {
      return this.metocean.wsp.quant_incr
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
    wsp_selection() {
      return {
        ...this.$store.state.params.wsp_selection,
        hub: this.$hub.child({
          update: async wsp_selection => {
            const values = Object.assign(
              {},
              this.$store.state.params.wsp_selection,
              wsp_selection)
            const selection = apply_linear(
              values.selection,
              values.operation,
              this.wsp_freq_quant_incr,
              this.wsp_freq_domain)
            if (selection)
              await this.metocean.wsp_freq(selection[0], selection[1])
            else
              await this.metocean.wsp_freq(null)
            this.$store.commit('analytics/metocean_changed')
            await this.$hub.emit('update', { wsp_selection })
          }
        })
      }
    },
    wd() {
      return Array(2 * Math.PI / this.metocean.wd.quant_incr)
        .fill(0).map((d, i) => (i * this.metocean.wd.quant_incr)
          .toFixed(3)).map(x => this.metocean.wd.groups[x] || 0)
    },
    wd_range() {
      return this.metocean.wd.range
    },
    wd_freq_quant_incr() {
      return this.metocean.wd.quant_incr
    },
    wd_selection() {
      return {
        ...this.$store.state.params.wd_selection,
        hub: this.$hub.child({
          update: wd_selection => this.$hub.emit('update', { wd_selection })
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
    dpm_freq_quant_incr() {
      return this.metocean.dpm.quant_incr
    },
    dpm_selection() {
      return {
        ...this.$store.state.params.dpm_selection,
        hub: this.$hub.child({
          update: async dpm_selection => {
            const values = Object.assign(
              {},
              this.$store.state.params.dpm_selection,
              dpm_selection)
            const selection = apply_radial({
                anchor: values.selection_anchor,
                range: values.selection_range
              },
              values.operation,
              this.dpm_freq_quant_incr)
            if (selection && selection.anchor != null) {
              const selections = splitselection(selection)
                .map(([start, end]) =>
                  [quantdeg(start - epsilon), quantdeg(end + epsilon)])
              // console.log(selections)
              if (selections.length == 2) {
                await this.metocean.dpm_freq1(selections[0][0], selections[0][1])
                // await this.metocean.dpm_freq2(selections[1][0], selections[1][1])
              }
              else {
                await this.metocean.dpm_freq1(selections[0][0], selections[0][1])
                // await this.metocean.dpm_freq2(null)
              }
            }
            else {
              await this.metocean.dpm_freq1(null)
              // await this.metocean.dpm_freq2(null)
            }
            this.$store.commit('analytics/metocean_changed')
            await this.$hub.emit('update', { dpm_selection })
          }
        })
      }
    }
  }
};
</script>