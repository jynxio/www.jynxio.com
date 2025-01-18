import Script from 'next/script';

const id = process.env.GOOGLE_ANALYTICS_TRACKING_ID;
const src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
const html = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${process.env.GOOGLE_ANALYTICS_TRACKING_ID}');`.trim();

/**
 * @link https://analytics.google.com/analytics/web
 */
function GoogleAnalytics() {
    return (
        <>
            <Script strategy="afterInteractive" src={src} />
            <Script
                id="gtag"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </>
    );
}

export { GoogleAnalytics };
export default GoogleAnalytics;
