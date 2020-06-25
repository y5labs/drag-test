<template>
  <div class="wrapper" v-if="is_loaded">
    <h1>Wind speed <small> direction, duration & timeseries</small></h1>
    <svg width="400px" height="340px" style="overflow: visible;">
      <g transform="translate(75 95)">
        <radial-grid-y
          :radius="[35, 60]"
          :quant_incr="20"
          :range="wd_range"
          :values="wd"
        />
        <radial-grid-x
          :radius="[35, 60]"
        />
        <g class="radial">
          <radial-axis-x
            :radius="[35, 60]"
            :values="['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']"
            :display_fn="x => x"
          />
        </g>
        <g class="radial" transform="rotate(-45)">
          <g class="background">
            <radial-axis-y
              :radius="[35, 60]"
              :quant_incr="20"
              :display_fn="x => `${x.toFixed(0)}hrs`"
              :range="wd_range"
              :ticks="[20, 40]"
              :values="wd"
            />
          </g>
          <radial-axis-y
            :radius="[35, 60]"
            :quant_incr="20"
            :display_fn="x => `${x.toFixed(0)}hrs`"
            :range="wd_range"
            :ticks="[20, 40]"
            :values="wd"
          />
        </g>
        <g class="axis_major">
          <radial-grid-y
            :radius="[35, 60]"
            :quant_incr="100"
            :range="wd_range"
            :values="wd"
          />
        </g>
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
      <g transform="translate(200 0)">
        <linear-grid-y
          :width="200"
          :height="150"
          :quant_incr="10"
          :range="wsp_freq_range"
          :values="wsp_freq"
        />
        <g class="axis_major">
          <linear-grid-y
            :width="200"
            :height="150"
            :quant_incr="50"
            :range="wsp_freq_range"
            :values="wsp_freq"
          />
        </g>
        <g v-if="wsp_axis_visible" transform="translate(0 155)">
          <linear-histogram-axis-x
            :width="200"
            :quant_incr="2"
            :display_fn="x => `${x.toFixed(0)}kts`"
            :values="wsp_freq_axis"
          />
        </g>
        <g transform="translate(-5 0)">
          <linear-axis-y
            :height="150"
            :display_fn="x => `${x.toFixed(0)}hrs`"
            :range="wsp_freq_range"
            :values="wsp_freq"
          />
        </g>
        <linear-histogram
          :width="200"
          :height="150"
          :range="wsp_freq_range"
          :values="wsp_freq"
        />
        <linear-selection-x
          :domain="wsp_freq_domain"
          :range="wsp_freq_domain"
          :range_quant_incr="0"
          :width="200"
          :height="150"
          :display_quant="true"
          :display_fn="x => `${x.toFixed(0)}kts`"
          :quant_incr="wsp_freq_quant_incr"
          v-bind="wsp_selection"
        />
        <linear-brush-x
          :domain="wsp_freq_domain"
          :range="wsp_freq_domain"
          :range_quant_incr="1"
          :width="200"
          :height="190"
          :display_quant="true"
          :quant_incr="wsp_freq_quant_incr"
          v-bind="wsp_selection"
        />
      </g>
      <g transform="translate(40 200)">
        <g v-if="wsp_axis_visible" transform="translate(-5 0)">
          <linear-axis-y
            :height="100"
            :display_fn="x => `${x.toFixed(0)}kts`"
            :range="wsp_by_time_range"
            :values="wsp_by_time_inv"
          />
        </g>
        <g transform="translate(-40 0)">
          <linear-selection-y
            :domain="wsp_freq_domain"
            :range="wsp_by_time_range"
            :range_quant_incr="5"
            :width="40"
            :height="100"
            :display_fn="x => `${x.toFixed(0)}kts`"
            :quant_incr="wsp_freq_quant_incr"
            v-bind="wsp_selection"
          />
          <linear-brush-y
            :domain="wsp_freq_domain"
            :range="wsp_by_time_range"
            :range_quant_incr="5"
            :width="40"
            :height="100"
            :quant_incr="wsp_freq_quant_incr"
            v-bind="wsp_selection"
          />
        </g>
        <g v-if="time_axis_visible" transform="translate(0 105)">
          <linear-axis-x
            :width="360"
            :values="time_axis"
            :ticks="time_axis_ticks"
            :display_fn="x => simpleday(x)"
          />
        </g>
        <linear-grid-y
          :width="360"
          :height="100"
          :range="wsp_by_time_range"
          :values="wsp_by_time_inv"
        />
        <g class="axis_major">
          <linear-grid-y
            :width="360"
            :height="100"
            :quant_incr="50"
            :range="wsp_by_time_range"
            :values="wsp_by_time_inv"
          />
        </g>
        <linear-line
          :width="360"
          :height="100"
          :range="wsp_by_time_range"
          :scaleBreak="wsp_by_time_breaks"
          :quant_incr="5"
          :values="wsp_by_time_inv"
        />
        <linear-area
          :width="360"
          :height="100"
          :range="wsp_by_time_range"
          :scaleBreak="wsp_by_time_breaks"
          :quant_incr="5"
          :values="wsp_by_time"
        />
        <g class="grid_inv">
          <linear-grid-x
            :width="360"
            :height="100"
            :values="time_axis"
            :ticks="time_axis_ticks"
          />
        </g>
        <linear-selection-x
          :domain="time_domain"
          :range="time_domain"
          :width="360"
          :height="100"
          :quant_incr="time_quant_incr"
          :display_fn="x => new Date(x * 1000).toISOString().substring(0, 13)"
          v-bind="time_selection"
        />
        <linear-brush-x
          :domain="time_domain"
          :range="time_domain"
          :range_quant_incr="1"
          :width="360"
          :height="140"
          :quant_incr="time_quant_incr"
          v-bind="time_selection"
        />
      </g>
    </svg>
    <h1>Wave height <small>direction, duration & timeseries</small></h1>
    <svg width="400px" height="340px" style="overflow: visible;">
      <g transform="translate(75 95)">
        <radial-grid-y
          :radius="[35, 60]"
          :quant_incr="100"
          :ticks="[100, 200]"
          :range="dpm_range"
          :values="dpm"
        />
        <radial-grid-x
          :radius="[35, 60]"
        />
        <g class="radial">
          <radial-axis-x
            :radius="[35, 60]"
            :values="['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']"
            :display_fn="x => x"
          />
        </g>
        <g class="axis_major">
          <radial-grid-y
            :radius="[35, 60]"
            :quant_incr="1000"
            :range="dpm_range"
            :values="dpm"
          />
        </g>
        <g class="radial" transform="rotate(-45)">
          <g class="background">
            <radial-axis-y
              :radius="[35, 60]"
              :quant_incr="100"
              :display_fn="x => `${x.toFixed(0)}hrs`"
              :range="dpm_range"
              :ticks="[100, 200]"
              :values="dpm"
            />
          </g>
          <radial-axis-y
            :radius="[35, 60]"
            :quant_incr="100"
            :display_fn="x => `${x.toFixed(0)}hrs`"
            :range="dpm_range"
            :ticks="[100, 200]"
            :values="dpm"
          />
        </g>
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
      <g transform="translate(200 0)">
        <linear-grid-y
          :width="200"
          :height="150"
          :range="hs_freq_range"
          :values="hs_freq"
        />
        <g class="axis_major">
          <linear-grid-y
            :width="200"
            :height="150"
            :quant_incr="50"
            :range="hs_freq_range"
            :values="hs_freq"
          />
        </g>
        <g v-if="hs_axis_visible" transform="translate(0 155)">
          <linear-histogram-axis-x
            :width="200"
            :quant_incr="2"
            :display_fn="x => `${x.toFixed(1)}m`"
            :values="hs_freq_axis"
          />
        </g>
        <g transform="translate(-5 0)">
          <linear-axis-y
            :height="150"
            :display_fn="x => `${x.toFixed(0)}hrs`"
            :range="hs_freq_range"
            :values="hs_freq"
          />
        </g>
        <linear-histogram
          :width="200"
          :height="150"
          :range="hs_freq_range"
          :values="hs_freq"
        />
        <linear-selection-x
          :domain="hs_freq_domain"
          :range="hs_freq_domain"
          :range_quant_incr="0.2"
          :width="200"
          :height="150"
          :display_quant="true"
          :quant_incr="hs_freq_quant_incr"
          :display_fn="x => `${x.toFixed(1)}m`"
          v-bind="hs_selection"
        />
        <linear-brush-x
          :domain="hs_freq_domain"
          :range="hs_freq_domain"
          :range_quant_incr="0.2"
          :width="200"
          :height="180"
          :display_quant="true"
          :quant_incr="hs_freq_quant_incr"
          v-bind="hs_selection"
        />
      </g>
      <g transform="translate(40 200)">
        <g v-if="hs_axis_visible" transform="translate(-5 0)">
          <linear-axis-y
            :height="100"
            :quant_incr="1"
            :display_fn="x => `${x.toFixed(0)}m`"
            :range="hs_by_time_range"
            :values="hs_by_time_inv"
          />
        </g>
        <g transform="translate(-40 0)">
          <linear-selection-y
            :domain="hs_freq_domain"
            :range="hs_freq_domain"
            :range_quant_incr="2"
            :width="40"
            :height="100"
            :display_fn="x => `${x.toFixed(1)}m`"
            :quant_incr="hs_freq_quant_incr"
            v-bind="hs_selection"
          />
          <linear-brush-y
            :domain="hs_freq_domain"
            :range="hs_freq_domain"
            :range_quant_incr="2"
            :width="40"
            :height="100"
            :quant_incr="hs_freq_quant_incr"
            v-bind="hs_selection"
          />
        </g>
        <g v-if="time_axis_visible" transform="translate(0 105)">
          <linear-axis-x
            :width="360"
            :quant_incr="1"
            :values="time_axis"
            :ticks="time_axis_ticks"
            :display_fn="x => simpleday(x)"
          />
        </g>
        <linear-grid-y
          :width="360"
          :height="100"
          :quant_incr="1"
          :range="hs_by_time_range"
          :values="hs_by_time_inv"
        />
        <g class="axis_major">
          <linear-grid-y
            :width="360"
            :height="100"
            :quant_incr="10"
            :range="hs_by_time_range"
            :values="hs_by_time_inv"
          />
        </g>
        <linear-line
          :width="360"
          :height="100"
          :range="hs_by_time_range"
          :scaleBreak="hs_by_time_breaks"
          :quant_incr="2"
          :values="hs_by_time_inv"
        />
        <linear-area
          :width="360"
          :height="100"
          :range="hs_by_time_range"
          :scaleBreak="hs_by_time_breaks"
          :quant_incr="2"
          :values="hs_by_time"
        />
        <g class="grid_inv">
          <linear-grid-x
            :width="360"
            :height="100"
            :values="time_axis"
            :ticks="time_axis_ticks"
          />
        </g>
        <linear-selection-x
          :domain="time_domain"
          :range="time_domain"
          :width="360"
          :height="100"
          :range_quant_incr="1"
          :quant_incr="time_quant_incr"
          :display_fn="x => new Date(x * 1000).toISOString().substring(0, 13)"
          v-bind="time_selection"
        />
        <linear-brush-x
          :domain="time_domain"
          :range="time_domain"
          :width="360"
          :height="140"
          :range_quant_incr="1"
          :quant_incr="time_quant_incr"
          v-bind="time_selection"
        />
      </g>
    </svg>
    <h1>Wave height vs Wind speed</h1>
    <svg width="400px" height="420px" style="overflow: visible;">
      <g transform="translate(40, 0)">
        <linear-grid-y
          :width="360"
          :height="360"
          :quant_incr="5"
          :range="wsp_freq_domain"
        />
        <g class="axis_major">
          <linear-grid-y
            :width="360"
            :height="360"
            :quant_incr="50"
            :range="wsp_freq_domain"
          />
        </g>
        <g v-if="wsp_axis_visible" transform="translate(-5, 0)">
          <linear-axis-y
            :height="360"
            :quant_incr="5"
            :range="wsp_freq_domain"
            :display_fn="x => `${x}kts`"
          />
        </g>
        <linear-grid-x
          :width="360"
          :height="360"
          :quant_incr="1"
          :range="hs_freq_domain"
        />
        <g class="axis_major">
          <linear-grid-x
            :width="360"
            :height="360"
            :quant_incr="50"
            :range="hs_freq_domain"
          />
        </g>
        <g transform="translate(0, 365)">
          <linear-axis-x
            :width="360"
            :quant_incr="1"
            :range="hs_freq_domain"
            :display_fn="x => `${x}m`"
          />
        </g>
        <linear-scatter
          :width="360"
          :height="360"
          :range_x="hs_freq_domain"
          :quant_incr_x="1"
          :values_x="hs_by_time"
          :range_y="wsp_freq_domain"
          :quant_incr_y="5"
          :values_y="wsp_by_time"
        />
        <g transform="translate(-40 0)">
          <linear-selection-y
            :domain="wsp_freq_domain"
            :range="wsp_freq_domain"
            :range_quant_incr="5"
            :width="40"
            :height="360"
            :display_quant="true"
            :display_fn="x => `${x.toFixed(0)}kts`"
            :quant_incr="wsp_freq_quant_incr"
            v-bind="wsp_selection"
          />
          <linear-brush-y
            :domain="wsp_freq_domain"
            :range="wsp_freq_domain"
            :range_quant_incr="5"
            :width="40"
            :height="360"
            :display_quant="true"
            :quant_incr="wsp_freq_quant_incr"
            v-bind="wsp_selection"
          />
        </g>
        <g transform="translate(0 360)">
          <linear-selection-x
            :domain="hs_freq_domain"
            :range="hs_freq_domain"
            :range_quant_incr="1"
            :width="360"
            :height="40"
            :display_quant="true"
            :display_fn="x => `${x.toFixed(1)}m`"
            :quant_incr="hs_freq_quant_incr"
            v-bind="hs_selection"
          />
          <linear-brush-x
            :domain="hs_freq_domain"
            :range="hs_freq_domain"
            :range_quant_incr="1"
            :width="360"
            :height="40"
            :display_quant="true"
            :quant_incr="hs_freq_quant_incr"
            v-bind="hs_selection"
          />
        </g>
        <linear-selection-x-y
          :width="360"
          :height="360"
          :domain_x="hs_freq_domain"
          :range_x="hs_freq_domain"
          :range_quant_incr_x="1"
          :display_quant_x="true"
          :quant_incr_x="hs_freq_quant_incr"
          :domain_y="wsp_freq_domain"
          :range_y="wsp_freq_domain"
          :range_quant_incr_y="5"
          :display_quant_y="true"
          :quant_incr_y="wsp_freq_quant_incr"
          v-bind="hs_wsp_selection"
        />
        <!-- <linear-brush-xy
          :domain="hs_freq_domain"
          :range="hs_freq_domain"
          :range_quant_incr="1"
          :width="360"
          :height="40"
          :display_quant="true"
          :quant_incr="hs_freq_quant_incr"
          v-bind="hs_selection"
        /> -->
      </g>
    </svg>
  </div>
</template>

<script>
import radialBrush from './radial/brush'
import radialSelection from './radial/selection'
import radialHistogram from './radial/histogram'
import radialAxisX from './radial/axis-x'
import radialAxisY from './radial/axis-y'
import radialGridX from './radial/grid-x'
import radialGridY from './radial/grid-y'
import linearBrushX from './linear/brush-x'
import linearBrushY from './linear/brush-y'
import linearSelectionX from './linear/selection-x'
import linearSelectionY from './linear/selection-y'
import linearSelectionXY from './linear/selection-xy'
import linearHistogram from './linear/histogram'
import linearHistogramAxisX from './linear/histogram-axis-x'
import linearAxisX from './linear/axis-x'
import linearAxisY from './linear/axis-y'
import linearGridX from './linear/grid-x'
import linearGridY from './linear/grid-y'
import linearArea from './linear/area'
import linearLine from './linear/line'
import linearScatter from './linear/scatter'
import { apply_operation as apply_linear } from './linear/shared'
import {
  apply_operation as apply_radial,
  splitselection,
  quantdeg
} from './radial/shared'
import { epsilon } from './math'
import { startOfDay, isEqual, format } from 'date-fns'

export default {
  components: {
    radialBrush,
    radialSelection,
    radialHistogram,
    radialAxisX,
    radialAxisY,
    radialGridX,
    radialGridY,
    linearBrushX,
    linearBrushY,
    linearSelectionX,
    linearSelectionY,
    linearSelectionXY,
    linearHistogram,
    linearHistogramAxisX,
    linearAxisX,
    linearAxisY,
    linearGridX,
    linearGridY,
    linearArea,
    linearLine,
    linearScatter
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
    simpleday(d) {
      return format(d, "d'/'M")
    }
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
    time_axis_visible() {
      return this.$store.state.params.time_selection == null
        || (this.$store.state.params.time_selection.selection == null
          && this.$store.state.params.time_selection.operation == null)
    },
    time_axis() {
      return this.by_time.map(x => new Date(x[0] * 1000))
    },
    time_axis_ticks() {
      return this.time_axis
        .map((d, i) => ({ d, i }))
        .filter(({ d }) => isEqual(d,startOfDay(d)))
        .map(({ d }) => d)
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
    hs_freq_axis() {
      return this.metocean.hs.index.map(f => f.v)
    },
    hs_freq() {
      return this.metocean.hs.index.map(f =>
        this.metocean.hs.groups[f.r] || 0)
    },
    hs_axis_visible() {
      return this.$store.state.params.hs_selection == null
        || (this.$store.state.params.hs_selection.selection == null
          && this.$store.state.params.hs_selection.operation == null)
    },
    hs_wsp_selection() {
      return {
        ...(() => {
          if (!this.$store.state.params.hs_selection) return {}
          return {
            selection_x: this.$store.state.params.hs_selection.selection,
            operation_x: this.$store.state.params.hs_selection.operation
          }
        })(),
        ...(() => {
          if (!this.$store.state.params.wsp_selection) return {}
          return {
            selection_y: this.$store.state.params.wsp_selection.selection,
            operation_y: this.$store.state.params.wsp_selection.operation
          }
        })(),
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
              await this.metocean.hs_freq(selection[0] - epsilon, selection[1] + epsilon)
            else
              await this.metocean.hs_freq(null)
            this.$store.commit('analytics/metocean_changed')
            await this.$hub.emit('update', { hs_selection })
          }
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
              this.hs_freq_quant_incr,
              this.hs_freq_domain)
            if (selection)
              await this.metocean.hs_freq(selection[0] - epsilon, selection[1] + epsilon)
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
    wsp_freq_axis() {
      return this.metocean.wsp.index.map(f => f.v)
    },
    wsp_axis_visible() {
      return this.$store.state.params.wsp_selection == null
        || (this.$store.state.params.wsp_selection.selection == null
          && this.$store.state.params.wsp_selection.operation == null)
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
              await this.metocean.wsp_freq(selection[0] - epsilon, selection[1] + epsilon)
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
          update: async wd_selection => {
            const values = Object.assign(
              {},
              this.$store.state.params.wd_selection,
              wd_selection)
            const selection = apply_radial({
                anchor: values.selection_anchor,
                range: values.selection_range
              },
              values.operation,
              this.wd_freq_quant_incr)
            if (selection && selection.anchor != null) {
              const selections = splitselection(selection)
                .map(([start, end]) =>
                  [quantdeg(start - epsilon), quantdeg(end + epsilon)])
              if (selections.length == 2) {
                await this.metocean.wd_freq1(selections[0][0] - epsilon, selections[0][1] + epsilon)
                await this.metocean.wd_freq2(selections[1][0] - epsilon, selections[1][1] + epsilon)
              }
              else {
                await this.metocean.wd_freq1(selections[0][0] - epsilon, selections[0][1])
                await this.metocean.wd_freq2(-1)
              }
            }
            else {
              await this.metocean.wd_freq1(null)
              await this.metocean.wd_freq2(null)
            }
            this.$store.commit('analytics/metocean_changed')
            await this.$hub.emit('update', { wd_selection })
          }
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
              if (selections.length == 2) {
                await this.metocean.dpm_freq1(selections[0][0] - epsilon, selections[0][1] + epsilon)
                await this.metocean.dpm_freq2(selections[1][0] - epsilon, selections[1][1] + epsilon)
              }
              else {
                await this.metocean.dpm_freq1(selections[0][0] - epsilon, selections[0][1] + epsilon)
                await this.metocean.dpm_freq2(-1)
              }
            }
            else {
              await this.metocean.dpm_freq1(null)
              await this.metocean.dpm_freq2(null)
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