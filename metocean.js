import Cube from 'seacreature/analytics/cube'
import { quant } from './math'
import pathie from 'seacreature/lib/pathie'


const cube = Cube(x => x.time)
const by_time = cube.range_single(x => x.time)
const by_wsp = cube.range_single(x => x.wsp)
const by_wd1 = cube.range_single(x => x.wd)
const by_wd2 = cube.range_single(x => x.wd)
const by_hs = cube.range_single(x => x.hs)
const by_dpm1 = cube.range_single(x => x.dpm)
const by_dpm2 = cube.range_single(x => x.dpm)

const wsp_freq_q_incr = 2
const wsp_freq_q = quant(wsp_freq_q_incr).floor
const wsp_freq = {}
const wsp_freq_iter = [0]
cube.on('selection changed', ({ put, del }) => {
  del.forEach(x => {
    pathie.assign(wsp_freq, [wsp_freq_q(x.wsp)], c => (c || 0) - 1)
  })
  put.forEach(x => {
    const v = wsp_freq_q(x.wsp)
    while (wsp_freq_iter[wsp_freq_iter.length - 1] < v)
      wsp_freq_iter.push(
        wsp_freq_iter[wsp_freq_iter.length - 1]
          + wsp_freq_q_incr)
    pathie.assign(wsp_freq, [v], c => (c || 0) + 1)
  })
})

const hs_freq_q_incr = 0.2
const hs_freq_q = quant(hs_freq_q_incr).floor
const hs_freq = {}
const hs_freq_iter = [0]
cube.on('selection changed', ({ put, del }) => {
  del.forEach(x => {
    pathie.assign(hs_freq, [hs_freq_q(x.hs)], c => (c || 0) - 1)
  })
  put.forEach(x => {
    const v = hs_freq_q(x.hs)
    while (hs_freq_iter[hs_freq_iter.length - 1] < v)
      hs_freq_iter.push(
        hs_freq_iter[hs_freq_iter.length - 1]
          + hs_freq_q_incr)
    pathie.assign(hs_freq, [v.toFixed(1)], c => (c || 0) + 1)
  })
})

export {
  cube,
  by_time,
  by_wsp,
  wsp_freq_iter,
  wsp_freq,
  by_wd1,
  by_wd2,
  by_hs,
  hs_freq_iter,
  hs_freq,
  by_dpm1,
  by_dpm2
}