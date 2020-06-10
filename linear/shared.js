import { quant } from '../math'

const apply_operation = (selection, operation, quant_incr, domain) => {
  if (!operation) return selection
  selection = selection != null
    ? [ ...selection ]
    : null
  if (operation.type == 'from')
    selection[0] += operation.delta
  else if (operation.type == 'until')
    selection[1] += operation.delta
  else if (operation.type == 'move') {
    selection[0] += operation.delta
    selection[1] += operation.delta
  } else if (operation.type == 'new') {
    selection = [operation.start, operation.current]
  }
  if (selection[0] > selection[1])
    [selection[0], selection[1]] =
      [selection[1], selection[0]]
  selection[0] = quant(quant_incr).round(selection[0])
  selection[1] = quant(quant_incr).round(selection[1])
  if (selection[0] < domain[0])
    selection[0] = domain[0]
  if (selection[1] > domain[1])
    selection[1] = domain[1]
  return selection
}

export {
  apply_operation
}