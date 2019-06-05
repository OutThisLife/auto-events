export { default as handleClick } from './click'
export { default as handlePage } from './page'
export { default as handleSubmit } from './submit'
export { default as handleVideo } from './video'

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

export const loadJS = async (
  validate: () => boolean = () => false,
  src: string,
  id: string
) =>
  new Promise((resolve, reject) => {
    const el = document.createElement('script')

    el.id = id
    el.async = true
    el.onload = () => {
      let i = 0

      const int = setInterval(() => {
        console.log(i)
        i++

        if (validate()) {
          clearInterval(int)
          resolve()
        } else if (i >= 256) {
          reject()
        }
      }, 150)
    }

    el.src = src
    document.head.appendChild(el)
  })
