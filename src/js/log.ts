import faker from 'faker'

export const log = (msg: string) => {
  console.info('[AUTOTRACK]', msg)
  return true
}

export const withDevLog = (analytics: SegmentAnalytics.AnalyticsJS) => {
  const $clone = document.querySelector('main').innerHTML
  const $log = document.querySelector('pre')

  const append = (
    msg: string = `Web - Browsing - Visit Page: ${JSON.stringify({
      path: location.pathname
    })}`
  ) =>
    log(msg) &&
    ($log.innerHTML = `<time>${new Date().valueOf()} ::</time> ${msg}<br />${
      $log.innerHTML
    }`)

  'track page trackForm trackLink'
    .split(' ')
    .map(evt =>
      analytics.on(evt, (e: null | string, args: object) =>
        append(
          typeof e === 'string' ? `${e}: ${JSON.stringify(args)}` : undefined
        )
      )
    )

  const pushRoute = (href: string, rebuild: boolean = false) => {
    window.history.pushState({}, `${document.title} / ${href}`, href)

    if (rebuild) {
      document.querySelector('main').innerHTML = $clone
    }
  }

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

    $nav.insertBefore(el, $nav.querySelector('hr'))
  }

  log('init')
  ;(window as any).dev = { pushRoute, dynamicForm, dynamicLink }
}
