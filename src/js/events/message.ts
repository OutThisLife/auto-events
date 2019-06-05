import { getMeta, serializeForm } from '.'

export default (analytics: SegmentAnalytics.AnalyticsJS, e: IHubspotEvent) => {
  if ('data' in e && /submitted/i.test(e.data.eventName)) {
    const el = document.querySelector(`form[action*="${e.data.id}"]`)

    if (el instanceof HTMLFormElement) {
      analytics.track('Web - Form - Submit Form', {
        ...e,
        ...serializeForm(el),
        ...getMeta('submit', el)
      })
    } else {
      analytics.track('Web - Form - Submit Form', e)
    }
  }
}

interface IHubspotEvent {
  type?: string
  eventName?: string
  id?: string
  data?: {
    [key: string]: any
  }
}
