export { default as handleClick } from './click'
export { default as handlePage } from './page'
export { default as handleSubmit } from './submit'

export const serializeForm = (el: HTMLFormElement) => {
  const obj = {}
  const data = new FormData(el)

  for (const [k, v] of data.entries()) {
    obj[k] = v
  }

  return obj
}

export const serializeAtts = (el: HTMLElement) => {
  const blacklist = ['onclick']

  return Object.entries(el.attributes).reduce(
    (acc, [, { name, value }]) =>
      blacklist.includes(name) || ((acc[name] = value), acc),
    {}
  )
}
