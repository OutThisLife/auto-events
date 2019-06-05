export const loadJS = async (
  validate: () => boolean = () => false,
  src: string,
  id: string,
  head: boolean = true,
  async: boolean = true
) =>
  new Promise((resolve, reject) => {
    const el = document.createElement('script')

    el.id = id
    el.async = async
    el.onload = () => {
      let i = 0

      const int = setInterval(() => {
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

    document[head ? 'head' : 'body'].appendChild(el)
  })

export const isTrackable = async (cb = () => null) => {
  try {
    if (!('analytics' in window)) {
      throw new Error('Segment not loaded')
    }

    await fetch(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      {
        method: 'HEAD',
        mode: 'no-cors'
      }
    )

    cb()
  } catch (err) {
    //
  }
}
