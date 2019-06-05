import { serializeAtts, serializeForm } from '.'

export default (analytics: SegmentAnalytics.AnalyticsJS, e: MouseEvent) => {
  const el = e.toElement as
    | HTMLAnchorElement
    | HTMLButtonElement
    | HTMLInputElement

  if (el instanceof HTMLAnchorElement) {
    analytics.track('Web - Browsing - Click Site CTA', serializeAtts(el))
  } else if (el.type === 'submit' && el.closest('form')) {
    analytics.track(
      'Web - Form - Click Form CTA',
      serializeForm(el.closest('form'))
    )
  }
}
