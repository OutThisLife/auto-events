import { serializeForm } from '.'

export default (analytics: SegmentAnalytics.AnalyticsJS, e: KeyboardEvent) => {
  const el = e.srcElement

  if (el instanceof HTMLFormElement) {
    analytics.track('Web - Form - Submit Form', serializeForm(el))
  }
}
