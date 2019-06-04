import { serializeAtts } from '.'

export default (analytics: SegmentAnalytics.AnalyticsJS, e: MouseEvent) => {
  const el = e.toElement

  if (el instanceof HTMLAnchorElement) {
    analytics.track(`Click: ${el.innerText}`, serializeAtts(el))
  }
}
