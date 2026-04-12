import Script from 'next/script'

export function CfAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN

  if (!token || process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
      strategy="afterInteractive"
    />
  )
}
