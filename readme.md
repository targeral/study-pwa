# Study-PWA

## 如何启动

### Notification

可以安装http-server来本地启动服务：

```
npm install http-server -g
```

然后在Notification目录下执行 `http-server`

### PushServer

一个express简陋的服务，PushServer目录下执行 `node src/app.js`启动项目。

## 目前效果

如果你成功运行，那么每过10s，会在屏幕出现提示信息， 22333。

## pwa feature

### 生命周期

https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle

### 缓存策略（离线cookbook）

https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook

### 添加到屏幕上

https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen

**注意webmanifest配置里的图片格式一定是png，否则就不会被浏览器识别**

``` json
{
  "background_color": "purple",
  "description": "Shows random fox pictures. Hey, at least it isn't cats.",
  "display": "fullscreen",
  "icons": [
    {
      "src": "./icon.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "name": "Awesome fox pictures",
  "short_name": "Foxes",
  "start_url": "index.html"
}

```

### notification and web pusher

https://developers.google.com/web/fundamentals/push-notifications 

* [Notification上的展示](https://developers.google.com/web/fundamentals/push-notifications/display-a-notification)
* [Notification上的行为](https://developers.google.com/web/fundamentals/push-notifications/notification-behaviour)

### workbox

https://developers.google.com/web/tools/workbox/
http://csbun.github.io/blog/2018/02/workbox/

### debug

https://www.chromium.org/blink/serviceworker/service-worker-faq

### video and article

https://www.youtube.com/watch?v=Di7RvMlk9io&feature=emb_rel_pause
https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installable_PWAs

## css houdini

https://developers.google.com/web/updates/2016/05/houdini
https://www.smashingmagazine.com/2020/03/practical-overview-css-houdini/

## worker

https://github.com/GoogleChromeLabs/comlink
