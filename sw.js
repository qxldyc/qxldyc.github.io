importScripts('https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js');
workbox.setConfig({
    debug: true,
    modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.3.0/'
});

// To avoid async issues, we load core before we call it in the callback
workbox.skipWaiting();
workbox.clientsClaim();
workbox.routing.registerRoute(
    new RegExp('/static/'),
    workbox.strategies.cacheFirst({
        cacheName: 'static',
        plugins: [
            //如果要拿到域外的资源，必须配置
            //因为跨域使用fetch配置了
            //mode: 'no-cors',所以status返回值为0，故而需要兼容
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
            new workbox.expiration.Plugin({
                maxEntries: 30,
                maxAgeSeconds: 12 * 60 * 60
            })
        ]
    })
);
workbox.routing.registerRoute(
    function (event) {
        // console.log(event.url.pathname)
        if (["/", '/tb.png', '/manifest.json'].indexOf(event.url.pathname) > -1) return true;
        return false;
    },
    workbox.strategies.staleWhileRevalidate({
        //cache名称
        cacheName: 'html',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 20
            })
        ]
    })
);