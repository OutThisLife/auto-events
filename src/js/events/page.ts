export default (analytics: SegmentAnalytics.AnalyticsJS) =>
  analytics.page(`Page: ${location.pathname}`)
