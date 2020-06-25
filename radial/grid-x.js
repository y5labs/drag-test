import component from '../component'
import { range } from '../math'
import {
  rad2xy,
  xy2px
} from './shared'

export default component({
  name: 'radial-grid-x',
  module,
  render: (h, { props, state, hub }) => {
    const quant_incr = props.quant_incr || (2 * Math.PI) / 8
    const radius = props.radius
    const r = [0, 2 * Math.PI]
    const ticks = props.ticks || range(r[0], r[1], quant_incr)

    const bar_portion = props.bar_portion || 0.05
    const bar_width = quant_incr * bar_portion
    const bar_offset = bar_width / 2

    return h('g', ticks.map(rad => {
      const pos1 = rad2xy(rad - bar_offset)
      const pos2 = rad2xy(rad + bar_offset)
      return h('path.grid.x', { attrs: { d: `
        M ${xy2px(pos1, radius[1])}
        A ${radius[1]} ${radius[1]}
          0 0 1
          ${xy2px(pos2, radius[1])}
        L ${xy2px(pos2, radius[0])}
        A ${radius[0]} ${radius[0]}
          0 0 0
          ${xy2px(pos1, radius[0])}
        Z
      ` } })
    }))
  }
})
