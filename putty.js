import component from './component'

const istouch = (('ontouchstart' in global)
  || global.DocumentTouch && document instanceof global.DocumentTouch)
  || navigator.msMaxTouchPoints
  || false

export default component({
  name: 'putty',
  module,
  render: (h, { hub, scopedSlots }) => {
    let hasmoved = null
    let start = null
    let delta = null
    const mousemove = e => {
      const rect = e.target.getBoundingClientRect()
      const current = [e.clientX - rect.left, e.clientY - rect.top]
      delta = [current[0] - start[0], current[1] - start[1]]
      if (!hasmoved) {
        hub.emit('start', { start })
        hasmoved = true
      }
      hub.emit('move', { start, current, delta })
    }
    const hover = e => {
      if (hasmoved) return
      const rect = e.target.getBoundingClientRect()
      const current = [e.clientX - rect.left, e.clientY - rect.top]
      hub.emit('hover', { current })
    }
    const mouseleave = e => {
      if (hasmoved) return
      hub.emit('leave')
    }
    const mouseup = e => {
      const rect = e.target.getBoundingClientRect()
      const end = [e.clientX - rect.left, e.clientY - rect.top]
      const delta = [end[0] - start[0], end[1] - start[1]]
      window.removeEventListener('mousemove', mousemove)
      window.removeEventListener('mouseup', mouseup)
      if (!hasmoved) hub.emit('tap', start)
      else hub.emit('end', { start, end, delta })
      hasmoved = false
    }
    const mousedown = e => {
      e.preventDefault()
      let rect = e.target.getBoundingClientRect()
      start = [e.clientX - rect.left, e.clientY - rect.top]
      hasmoved = false
      window.addEventListener('mousemove', mousemove)
      window.addEventListener('mouseup', mouseup)
    }
    const touchmove = e => {
      const rect = e.target.getBoundingClientRect()
      const current = [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top]
      const delta = [current[0] - start[0], current[1] - start[1]]
      if (!hasmoved) {
        hub.emit('start', { start })
        hasmoved = true
      }
      hub.emit('move', { start, current, delta })
    }
    const touchend = e => {
      const rect = e.target.getBoundingClientRect()
      const end = [e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top]
      const delta = [end[0] - start[0], end[1] - start[1]]
      window.removeEventListener('touchmove', touchmove)
      window.removeEventListener('touchend', touchend)
      if (!hasmoved) hub.emit('tap', start)
      else hub.emit('end', { start, end, delta })
    }
    const touchstart = e => {
      e.preventDefault()
      hasmoved = false
      let rect = e.target.getBoundingClientRect()
      start = [
        e.touches[0].clientX - rect.left,
        e.touches[0].clientY - rect.top]
      window.addEventListener('touchmove', touchmove)
      window.addEventListener('touchend', touchend)
    }
    const content = scopedSlots.default ? [scopedSlots.default()] : []
    return istouch
      ? h('.putty', { on: { touchstart }}, content)
      : h('.putty', { on: { mousedown, mousemove: hover, mouseleave }}, content)
  }
})
