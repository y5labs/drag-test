<template>
  <div>
    <svg :width="width" :height="height">
      <path v-for="c in paths"
        class="segment"
        :class="c.class"
        :d="c.path" />
    </svg>
  </div>
</template>

<script>
import {
  linearFromExtents,
  sliceArea,
  quant
} from './scratch'

export default {
  data() {
    return {
      values: [
        5, 6, 5, 4, 3, 2, 2, 3, 4, 4, 5, 5, 5, 6, 6, 7, 8
      ],
      scaleBreak: [
        [2.3, { level: 0, class: 'red'}],
        [3.7, { level: 1, class: 'blue'}],
        [5.5, { level: 2, class: 'green'}],
        [Infinity, { level: 3, class: 'purple'}]
      ]
    }
  },
  methods: {
    xy2px(x1, y1) {
      return `${this.x(x1).toFixed(1)} ${this.y(y1).toFixed(1)}`
    }
  },
  computed: {
    width() { return 400 },
    height() { return 200 },
    x() {
      return linearFromExtents(
        [0, this.values.length - 1], [0, this.width])
    },
    y() {
      return linearFromExtents(
        [0, quant(10).ceil(Math.max.apply(null, this.values))], [this.height, 0])
    },
    points() {
      return sliceArea(this.scaleBreak, 0, this.values)
    },
    paths() {
      return this.points.map(c => ({
        class: this.scaleBreak[c.level][1].class,
        path: `
          M ${this.xy2px(c.points[0][0], c.points[0][1])}
          ${c.points.slice(1).map(d =>
            `L ${this.xy2px(d[0], d[1])}`)}
          Z
        `
      }))
    }
  }
};
</script>