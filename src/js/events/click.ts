import { getMeta, getRootElement, serializeAtts, serializeForm } from '.'

export default (analytics: SegmentAnalytics.AnalyticsJS, e: MouseEvent) => {
  const el = getRootElement(e.toElement, 'input', 'button', 'a')

  if (el instanceof HTMLAnchorElement) {
    analytics.track(
      `Web - Browsing - ${
        el.closest('nav') ? 'Click Nav CTA' : 'Click Site CTA'
      }`,
      {
        ...serializeAtts(el),
        ...getMeta('click', el)
      }
    )
  } else if (
    el instanceof HTMLButtonElement ||
    el instanceof HTMLInputElement
  ) {
    analytics.track('Web - Form - Click Form CTA', {
      ...serializeForm(el.closest('form')),
      ...getMeta('click', el)
    })
  }
}
