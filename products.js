import Cube from 'seacreature/analytics/cube'

const cube = Cube(x => x.id)
const by_id = cube.range_single(x => x.id)
const by_name = cube.range_single(x => x.name)
const by_count = cube.range_single(x => x.count)

export {
  cube,
  by_id,
  by_name,
  by_count
}
