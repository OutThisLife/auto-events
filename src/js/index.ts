import { handleClick, handlePage, handleSubmit, handleVideo } from './events'
import { withDevLog } from './log'

const init = () => {
  const analytics = (window as any).analytics as SegmentAnalytics.AnalyticsJS
  withDevLog.call(null, analytics)

  const trackPage = handlePage.bind(null, analytics)
  const trackClick = handleClick.bind(null, analytics)
  const trackSubmit = handleSubmit.bind(null, analytics)
  const trackVideo = handleVideo.bind(null, analytics)

  let href = location.href

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
}

window.addEventListener('load', () => 'analytics' in window && init(), {
  once: true
})
