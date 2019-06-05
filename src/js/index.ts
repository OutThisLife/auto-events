import {
  handleClick,
  handleMessage,
  handlePage,
  handleSubmit,
  handleVideo
} from './events'
import { withDevLog } from './log'
import { isTrackable, loadJS, raf } from './utils'

window.addEventListener(
  'load',
  isTrackable.bind(null, async () => {
    if (!document.querySelector('script[src*="polyfill.io"')) {
      await loadJS(
        () => true,
        'https://polyfill.io/v3/polyfill.min.js?flags=gated',
        'polyfill-js'
      )
    }

    let href = location.href
    const analytics = (window as any).analytics as SegmentAnalytics.AnalyticsJS

    const trackPage = handlePage.bind(null, analytics)
    const trackClick = handleClick.bind(null, analytics)
    const trackSubmit = handleSubmit.bind(null, analytics)
    const trackVideo = handleVideo.bind(null, analytics)
    const trackMessage = handleMessage.bind(null, analytics)

    const mut = new MutationObserver(([e]) => {
      if (href !== location.href) {
        href = location.href

        raf(trackVideo, trackPage)
      } else if (
        e.type === 'childList' &&
        document.querySelector('iframe:not([bound])')
      ) {
        raf(trackVideo)
      }
    })

    mut.observe(document.body, {
      childList: true,
      subtree: true
    })

    raf(withDevLog.bind(null, analytics), trackVideo, trackPage)

    window.addEventListener('click', trackClick)
    window.addEventListener('submit', trackSubmit)
    window.addEventListener('message', trackMessage)
  }),
  {
    once: true
  }
)
