import { putty } from 'vue-putty'
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
  name: 'radial-brush',
  module,
  render: (h, { props, state, hub }) => {
    // shared
    const quant_incr = props.quant_incr || Math.PI / 8

    // display
    const radius = props.radius
    const display_quant = props.display_quant != null
      ? props.display_quant
      : false

    let operation = props.operation
    const selected = apply_operation({
      anchor: props.selected_anchor,
      range: props.selected_range
    }, operation, quant_incr)

    return h('g', selected.anchor != null ? (() => {
      const bump = display_quant
        ? (selected.range > 0 ? -quant_incr / 2 : quant_incr / 2)
        : 0
      const quant_selected = {
        anchor: selected.anchor + bump,
        range: selected.range - 2 * bump
      }
      const from = rad2xy(quant_selected.anchor)
      const from_deg = Number(rad2degmod(selected.anchor).toFixed(0))
      const until = rad2xy(quant_selected.anchor + quant_selected.range)
      const until_deg = Number(rad2degmod(selected.anchor + selected.range).toFixed(0))
      const islarge = quant_selected.range >= Math.PI || quant_selected.range <= -Math.PI
      const issweep = quant_selected.range > 0
      const isafter =
        (quant_selected.range > 0 && (quant_selected.range < 1.5 * Math.PI - epsilon))
        || (quant_selected.range < 0 && (quant_selected.range < -1.5 * Math.PI + epsilon))
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
        Math.abs(selected.range) < quant_incr * 1
        ? null
        : until_deg > 180
        ? h('text.label', { attrs: {
            dx: -radius[0] + 4,
            'alignment-baseline': isafter ? 'alphabetic' : 'baseline',
            'text-anchor': 'start',
            transform: `rotate(${until_deg + 90})`
          }}, `${until_deg}°`)
        : h('text.label', { attrs: {
            dx: radius[0] - 4,
            'alignment-baseline': isafter ? 'baseline' : 'alphabetic',
            'text-anchor': 'end',
            transform: `rotate(${until_deg - 90})`
          }}, `${until_deg}°`),
        h('path.segment', { attrs: { d: `
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
