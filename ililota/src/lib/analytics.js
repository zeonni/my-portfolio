import mixpanel from 'mixpanel-browser'

const token = import.meta.env.VITE_MIXPANEL_TOKEN
const enabled = Boolean(token)

if (enabled) {
  mixpanel.init(token, {
    persistence: 'localStorage',
    // 실제 URL 라우팅이 없는 SPA라 자동 pageview 대신 화면 전환을 직접 추적합니다.
    track_pageview: false,
  })
} else if (import.meta.env.DEV) {
  console.warn('[analytics] VITE_MIXPANEL_TOKEN이 설정되지 않아 이벤트를 전송하지 않습니다.')
}

export function trackPageView(screenName, props) {
  if (!enabled) return
  mixpanel.track('Page View', { screen: screenName, ...props })
}

export function trackEvent(eventName, props) {
  if (!enabled) return
  mixpanel.track(eventName, props)
}
