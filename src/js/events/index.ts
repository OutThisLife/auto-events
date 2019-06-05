import { events } from '../../events.json'

export { default as handleClick } from './click'
export { default as handlePage } from './page'
export { default as handleSubmit } from './submit'
export { default as handleVideo } from './video'
export { default as handleMessage } from './message'

export const serializeForm = (el: HTMLFormElement) => {
  const obj = {}
  const data = new FormData(el)

  for (const [k, v] of data.entries()) {
    obj[k] = v
  }

  return {
    ...obj,
    fields: Object.values(obj).length
  }
}

export const serializeAtts = (el: HTMLElement) =>
  Object.entries(el.attributes).reduce(
    (acc, [, { name, value }]) => ((acc[name] = value), acc),
    {}
  )

export const getMeta = (group = 'click', el: HTMLElement) =>
  events
    .filter(e => e['@type'] === group && el.matches(e['@selector']))
    .map(e => e['@meta'])
    .reduce((acc, o) => ((acc = { ...acc, ...o }), acc), {})
