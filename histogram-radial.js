import component from './component'
import {
  linearFromExtents,
  quant
} from './math'

export default component({
  name: 'app',
  module,
  render: (h, { props, state, hub }) => {
    const values = [
      3, 1, 2, 3, 1, 7, 3, 2, null, 1, 6, 3, null, 9, 3, 2
    ]
    const bar_width_total = 2 * Math.PI / values.length
    const bar_width = bar_width_total * 0.9
    const bar_offset = bar_width / 2
    const center = 50
    const radius = 50
    const innerRadius = 30
    const rad2xy = rad => [Math.sin(rad), -Math.cos(rad)]
    const xy2px = (pos, n) => {
      const scale = linearFromExtents(
        [-1, 1], [center - n, center + n])
      return `${scale(pos[0]).toFixed(3)} ${scale(pos[1]).toFixed(3)}`
    }
    const y = linearFromExtents([0, quant(10).ceil(Math.max.apply(null, values))], [innerRadius, radius])
    return h('svg', { style: { width: '100px', height: '100px' } }, [
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
          L ${xy2px(pos2, innerRadius)}
          A ${innerRadius} ${innerRadius}
            0 0 0
            ${xy2px(pos1, innerRadius)}
          Z
        ` } })
      })
    ])
  }
})
