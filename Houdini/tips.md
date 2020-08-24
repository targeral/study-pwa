# Tips

## 关于`<color>`类型的自定义属性

当使用 `CSS.registerProperty` 的时候，按照文档我们应该可以在 `worklet` 中通过 `prop.cssText` 的方式获取自定义属性的值，像是下面这个例子：

``` js
class CirclePaint {
    static get inputProperties() {
        return ['--circle-color'];
    }

    paint(ctx, size, props) {
        const color = props.get('--circle-color');
        console.log('color', color.toString());

        // ctx.fillStyle = color.toString(); // 正确的方式
        ctx.fillStyle = color.cssText; // 文档中的方式

        const x = size.width / 2;
        const y = size.height / 2;
        const radius = Math.min(x, y);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }    
};
```

然而现实就是很捉弄人o(╥﹏╥)o，捣鼓了半天，发现这种方式根本取不到正确的值，目前已知的只能通过 `toString`的方式获取自定义的值。

**更新：除了这种方式，还可以将color.cssText 变为 color。ctx可以直接解析这类值。**

