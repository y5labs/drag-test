import component from './component'
import {
  linearFromExtents,
  quant
} from './math'

export default component({
  name: 'app',
  module,
  render: (h, { props, state, hub }) => {
    const display_radius = props.display_radius
    const values = props.values
    const bar_width_total = 2 * Math.PI / values.length
    const bar_portion = props.bar_portion || 0.9
    const bar_width = bar_width_total * bar_portion
    const bar_offset = bar_width / 2
    const rad2xy = rad => [Math.sin(rad), -Math.cos(rad)]
    const xy2px = (pos, n) => `${(n * pos[0]).toFixed(3)} ${(n * pos[1]).toFixed(3)}`
    const y = linearFromExtents([0, quant(10).ceil(Math.max.apply(null, values))], [display_radius[0], display_radius[1]])
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
          L ${xy2px(pos2, display_radius[0])}
          A ${display_radius[0]} ${display_radius[0]}
            0 0 0
            ${xy2px(pos1, display_radius[0])}
          Z
        ` } })
      })
    ])
  }
})
