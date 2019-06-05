import { getMeta, serializeAtts } from '.'
import { loadJS } from '../utils'

export default (analytics: SegmentAnalytics.AnalyticsJS) => {
  const trackVideo = (status: boolean | number, el: HTMLElement) =>
    analytics.track(`Web - Browsing - ${status ? 'Play' : 'Pause'} Video`, {
      ...serializeAtts(el),
      ...getMeta('video', el)
    })

  const bindYoutube = async (el: HTMLIFrameElement) => {
    await loadJS(
      () =>
        'YT' in window &&
        'Player' in (window as any).YT &&
        Boolean(YT.Player.prototype.constructor),
      'https://www.youtube.com/iframe_api',
      'yt-api'
    )

    const _ = new YT.Player(el as any, {
      events: {
        onStateChange: ({ data: status }) =>
          Math.max(0, status) <= 2 && trackVideo(status === 2 ? 0 : 1, el)
      }
    })
  }

  const bindVimeo = async (el: HTMLIFrameElement) => {
    await loadJS(
      () => 'Vimeo' in window,
      'https://player.vimeo.com/api/player.js',
      'vimeo-api'
    )

    const player = new (window as any).Vimeo.Player(el)
    player.on('play', trackVideo.bind(null, 1, el))
    player.on('pause', trackVideo.bind(null, 0, el))
  }

  const bindWistia = async (el: HTMLIFrameElement) => {
    await loadJS(
      () => 'Wistia' in window,
      'https://fast.wistia.net/assets/external/E-v1.js',
      'wistia-api'
    )

    if (!('_wq' in window)) {
      ;(window as any)._wq = []
    }

    const [, videoId] = el.src.split('?')[0].match(/iframe\/(.*)$/)
    const $div = document.createElement('div')

    $div.className = `wistia_embed wistia_async_${videoId}`

    window.requestAnimationFrame(() => {
      el.parentNode.replaceChild($div, el)

      window.requestAnimationFrame(() =>
        (window as any)._wq.push({
          id: videoId,
          onReady: vid => {
            vid.bind('play', trackVideo.bind(null, 1, el))
            vid.bind('pause', trackVideo.bind(null, 0, el))
          }
        })
      )
    })
  }

  const $iframes = [].slice
    .call(document.querySelectorAll('iframe:not([bound])') || [])
    .filter(
      (el: HTMLIFrameElement) =>
        /youtube|vimeo|wistia/.test(el.src) && !/shim/.test(el.src)
    ) as HTMLIFrameElement[]

  $iframes.forEach(el => {
    const { src } = el

    try {
      if (/youtube/.test(src)) {
        bindYoutube(el)
      } else if (/vimeo/.test(src)) {
        bindVimeo(el)
      } else if (/wistia/.test(src)) {
        bindWistia(el)
      }

      el.setAttribute('bound', '1')
    } catch (err) {
      console.trace(err)
    }
  })
}
