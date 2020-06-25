import component from '../component'
import { range } from '../math'
import { rad2deg } from './shared'

export default component({
  name: 'radial-axis-x',
  module,
  render: (h, { props, state, hub }) => {
    const quant_incr = props.quant_incr || (2 * Math.PI) / 8
    const radius = props.radius
    const r = [0, 2 * Math.PI]
    const ticks = props.ticks || range(r[0], r[1], quant_incr)
    const values = props.values || props.ticks
    const display_fn = props.display_fn || (deg => `${deg}°`)

    return h('g', ticks.map((rad, i) =>
      h('g', { attrs: { transform: `rotate(${rad2deg(rad).toFixed(0)})` } }, [
        h('text.axis.x', { attrs: { dy: -radius[1] } }, display_fn(values[i]))
      ])
    ))
  }
})
