import component from '../component'
import {
  linearFromExtents,
  quant,
  range
} from '../math'

export default component({
  name: 'linear-grid-x',
  module,
  render: (h, { props, hub }) => {
    const height = props.height
    const width = props.width
    const values = props.values
    const quant_incr = props.quant_incr || 10
    const gap = width / values.length / 2
    const display_fn = props.display_fn || (x => x.toFixed(0))
    const r = [0, values.length]
    const x = linearFromExtents(r, [gap, width + gap])
    const ticks = props.ticks || range(r[0], r[1], quant_incr)
    return h('g', ticks.map(d =>
      h('g', { attrs: { transform: `translate(${x(d).toFixed(1)} 0)` } }, [
        h('line.grid.x', { attrs: { x1: 0, y1: 0, x2: 0, y2: height } })
      ])
    ))
  }
})