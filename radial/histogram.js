import component from '../component'
import {
  linearFromExtents,
  quant
} from '../math'
import {
  rad2xy,
  xy2px
} from './shared'

export default component({
  name: 'radial-histogram',
  module,
  render: (h, { props, state, hub }) => {
    const radius = props.radius
    const values = props.values
    const bar_width_total = 2 * Math.PI / values.length
    const bar_portion = props.bar_portion || 0.9
    const bar_width = bar_width_total * bar_portion
    const bar_offset = bar_width / 2
    const max = props.range ? props.range[1] : Math.max.apply(null, values)
    const y = linearFromExtents([0, quant(10).ceil(max)], [radius[0], radius[1]])
    return h('g', [
      ...values.map((d, i) => {
        if (d == null) return null
        const rad = bar_width_total * i
        const pos1 = rad2xy(rad - bar_offset)
        const pos2 = rad2xy(rad + bar_offset)
        const radius_d = y(d)
        return h('path.histogram', { attrs: { d: `
          M ${xy2px(pos1, radius_d)}
          A ${radius_d} ${radius_d}
            0 0 1
            ${xy2px(pos2, radius_d)}
          L ${xy2px(pos2, radius[0])}
          A ${radius[0]} ${radius[0]}
            0 0 0
            ${xy2px(pos1, radius[0])}
          Z
        ` } })
      })
    ])
  }
})
