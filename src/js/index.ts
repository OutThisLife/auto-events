import { handleClick, handlePage, handleSubmit } from './events'
import { withDevLog } from './log'

const init = () => {
  const analytics = (window as any).analytics as SegmentAnalytics.AnalyticsJS

  window.addEventListener('click', handleClick.bind(null, analytics))
  window.addEventListener('submit', handleSubmit.bind(null, analytics))

  let href = location.href
  const mut = new MutationObserver(() => {
    if (href !== location.href) {
      href = location.href
      window.requestAnimationFrame(handlePage.bind(null, analytics))
    }
  })

  mut.observe(document.body, {
    childList: true,
    subtree: true
  })

  withDevLog()
}

window.addEventListener('load', () => 'analytics' in window && init(), {
  once: true
})
