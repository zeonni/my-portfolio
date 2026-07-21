import mixpanel from 'mixpanel-browser'
import * as amplitude from '@amplitude/analytics-browser'

const mixpanelToken = import.meta.env.VITE_MIXPANEL_TOKEN
const mixpanelEnabled = Boolean(mixpanelToken)

if (mixpanelEnabled) {
  mixpanel.init(mixpanelToken, {
    persistence: 'localStorage',
    // 실제 URL 라우팅이 없는 SPA라 자동 pageview 대신 화면 전환을 직접 추적합니다.
    track_pageview: false,
  })
} else if (import.meta.env.DEV) {
  console.warn('[analytics] VITE_MIXPANEL_TOKEN이 설정되지 않아 Mixpanel 이벤트를 전송하지 않습니다.')
}

const amplitudeApiKey = import.meta.env.VITE_AMPLITUDE_API_KEY
const amplitudeEnabled = Boolean(amplitudeApiKey)

if (amplitudeEnabled) {
  amplitude.init(amplitudeApiKey, {
    autocapture: { pageViews: false },
  })
} else if (import.meta.env.DEV) {
  console.warn('[analytics] VITE_AMPLITUDE_API_KEY가 설정되지 않아 Amplitude 이벤트를 전송하지 않습니다.')
}

export function trackPageView(screenName, props) {
  if (mixpanelEnabled) mixpanel.track('Page View', { screen: screenName, ...props })
  if (amplitudeEnabled) amplitude.track('Page View', { screen: screenName, ...props })
}

export function trackEvent(eventName, props) {
  if (mixpanelEnabled) mixpanel.track(eventName, props)
  if (amplitudeEnabled) amplitude.track(eventName, props)
}
