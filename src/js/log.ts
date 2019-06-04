import faker from 'faker'

export const log = (msg: string) => {
  console.info('[AUTOTRACK]', msg)
  return true
}

export const withDevLog = () => {
  log('init')

  const $log = document.querySelector('pre')

  const append = (msg: string) =>
    log(msg) &&
    ($log.innerHTML = `<time>${new Date().valueOf()}</time> - ${msg}<br />${
      $log.innerHTML
    }`)

  'track page trackForm trackLink'
    .split(' ')
    .map(evt =>
      (window as any).analytics.on(evt, (e: null | string, args: object) =>
        append(
          e ? `${e}: ${JSON.stringify(args)}` : `Page: ${location.pathname}`
        )
      )
    )

  const pushRoute = (href: string) =>
    window.history.pushState({}, `${document.title} / ${href}`, href)

  const dynamicForm = () => {
    const $aside = document.querySelector('aside')
    const el = document.querySelector('form').cloneNode(true)

    if (el instanceof HTMLFormElement) {
      const $name = el.querySelector('[name=name]') as HTMLInputElement
      const $email = el.querySelector('[name=email]') as HTMLInputElement

      $name.defaultValue = faker.name.findName()
      $email.defaultValue = faker.internet.email()

      $aside.appendChild(el)
    }
  }

  const dynamicLink = () => {
    const $nav = document.querySelector('nav')
    const el = document.createElement('a')
    const uri = faker.lorem.slug()

    el.innerText = `Route: /${uri}`
    el.href = 'javascript:;'
    el.onclick = () => pushRoute(`/${uri}`)

    $nav.appendChild(el)
  }

  append(`Page: ${location.pathname}`)
  ;(window as any).dev = { pushRoute, dynamicForm, dynamicLink }
}

export const randStr = (len: number = 36) =>
  Math.random()
    .toString(len)
    .slice(-5)
