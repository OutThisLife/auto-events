import { handleClick, handlePage, handleSubmit, handleVideo } from './events'
import { withDevLog } from './log'
import { isTrackable, loadJS } from './utils'

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

    withDevLog.call(null, analytics)

    const trackPage = handlePage.bind(null, analytics)
    const trackClick = handleClick.bind(null, analytics)
    const trackSubmit = handleSubmit.bind(null, analytics)
    const trackVideo = handleVideo.bind(null, analytics)

    const mut = new MutationObserver(([e]) => {
      if (href !== location.href) {
        href = location.href

        window.requestAnimationFrame(() => {
          trackVideo()
          trackPage()
        })
      } else if (
        e.type === 'childList' &&
        document.querySelector('iframe:not([bound])')
      ) {
        window.requestAnimationFrame(trackVideo)
      }
    })

    mut.observe(document.body, {
      childList: true,
      subtree: true
    })

    window.requestAnimationFrame(() => {
      trackVideo()
      trackPage()
    })

    window.addEventListener('click', trackClick)
    window.addEventListener('submit', trackSubmit)
  }),
  {
    once: true
  }
)
