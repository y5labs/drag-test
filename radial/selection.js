import component from '../component'
import { epsilon } from '../math'
import {
  apply_operation,
  xy2rad,
  rad2xy,
  rad2degmod,
  xy2px
} from './shared'

export default component({
  name: 'radial-selection',
  module,
  render: (h, { props, state, hub }) => {
    const quant_incr = props.quant_incr || Math.PI / 8
    const radius = props.radius
    const display_quant = props.display_quant != null
      ? props.display_quant
      : false
    const display_fn = props.display_fn || (deg => `${deg}°`)

    const selection = apply_operation({
      anchor: props.selection_anchor,
      range: props.selection_range
    }, props.operation, quant_incr)

    return h('g', selection.anchor != null ? (() => {
      const bump = display_quant
        ? (selection.range > 0 ? -quant_incr : quant_incr) / (2.1)
        : 0
      const quant_selection = {
        anchor: selection.anchor + bump,
        range: selection.range - 2 * bump
      }
      const from = rad2xy(quant_selection.anchor)
      const from_deg = Number(rad2degmod(selection.anchor).toFixed(0))
      const until = rad2xy(quant_selection.anchor + quant_selection.range)
      const until_deg = Number(rad2degmod(selection.anchor + selection.range).toFixed(0))
      const islarge = quant_selection.range >= Math.PI
        || quant_selection.range <= -Math.PI
      const issweep = quant_selection.range > 0
      const isafter =
        (quant_selection.range > 0 && (quant_selection.range < 1.5 * Math.PI - epsilon))
        || (quant_selection.range < 0 && (quant_selection.range < -1.5 * Math.PI + epsilon))
      return [
        from_deg > 180
        ? h('text.label', { attrs: {
            dx: -radius[0] + 4,
            'alignment-baseline': isafter ? 'baseline' : 'alphabetic',
            'text-anchor': 'start',
            transform: `rotate(${from_deg + 90})`
          }}, `${from_deg}°`)
        : h('text.label', { attrs: {
            dx: radius[0] - 4,
            'alignment-baseline': isafter ? 'alphabetic' : 'baseline',
            'text-anchor': 'end',
            transform: `rotate(${from_deg - 90})`
          }}, `${from_deg}°`),
        Math.abs(selection.range) < quant_incr * 1
        ? null
        : until_deg > 180
        ? h('text.label', { attrs: {
            dx: -radius[0] + 4,
            'alignment-baseline': isafter ? 'alphabetic' : 'baseline',
            'text-anchor': 'start',
            transform: `rotate(${until_deg + 90})`
          }}, display_fn(until_deg))
        : h('text.label', { attrs: {
            dx: radius[0] - 4,
            'alignment-baseline': isafter ? 'baseline' : 'alphabetic',
            'text-anchor': 'end',
            transform: `rotate(${until_deg - 90})`
          }}, display_fn(until_deg)),
        h('path.selection', { attrs: { d: `
          M ${xy2px(from, radius[1])}
          A ${radius[1]} ${radius[1]}
            0 ${islarge ? '1' : '0'}
            ${issweep ? '1' : '0'}
            ${xy2px(until, radius[1])}
          L ${xy2px(until, radius[0])}
          A ${radius[0]} ${radius[0]}
            0 ${islarge ? '1' : '0'}
            ${issweep ? '0' : '1'}
            ${xy2px(from, radius[0])}
          Z
        ` } })
      ]
    })() : [])
  }
})
