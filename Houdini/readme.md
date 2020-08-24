# Houdini

Houdini是浏览器API集合的总称，旨在对Web开发流程和总体上CSS标准的开发进行重大改进。

前端开发人员将能够使用JavaScript扩展具有新功能的CSS，加入CSS渲染引擎，并告诉浏览器如何在渲染过程中应用CSS。

Houdini对浏览器的支持正在改善，并且今天可以使用某些API，因此现在是熟悉它们并进行实验的好时机。
我们将研究Houdini的每个部分，其当前对浏览器的支持，并了解如何通过渐进增强功能将它们今天使用

一个新的CSS功能或改进需要很长时间才能从初始草案发展到开发人员可以使用的完全受支持的稳定CSS功能。

基于JavaScript的polyfill可以代替缺乏浏览器支持的功能，以便在新CSS功能正式实施之前使用它们。但是它们在大多数情况下都是有缺陷的。例如 `scrollsnap-polyfill` 是可用于修复CSS Scroll Snap规范的浏览器支持不一致问题的几种polyfill之一。

但是，即使该解决方案也存在一些局限性，错误和不一致之处。

使用polyfill的潜在弊端是它们可能会对性能产生负面影响，并且难以正确实施。这个缺点与浏览器的DOM和CSSOM有关。

浏览器从HTML标记创建DOM（文档对象模型），类似地，它也从CSS标记创建CSSOM（CSS对象模型）。这两个对象树彼此独立。JavaScript可在DOM上运行，并且对CSSOM的访问非常有限。

JavaScript Polyfill解决方案仅在初始渲染周期完成后运行，即在同时创建DOM和CSSOM并且文档已完成加载时运行。

在Polyfill对DOM中的样式进行更改（通过内联）之后，它将导致渲染过程再次运行，并且整个页面都将重新呈现。

如果它们依赖于requestAnimationFrame方法或依赖于诸如滚动事件之类的用户交互，则对性能的负面影响会更加明显。

Web开发的另一个障碍是CSS标准施加的各种约束。例如，只有有限数量的CSS属性可以进行本地动画处理。CSS知道如何对颜色进行自然动画处理，但不知道如何对渐变进行动画处理。尽管存在技术限制，但始终都需要通过突破界限来创新和创造令人印象深刻的Web体验。因此，开发人员通常倾向于使用不理想的解决方法或JavaScript来实现CSS目前不支持的更高级的样式和效果，例如Masonry Layout（https://masonry.desandro.com/），高级3D效果，高级动画，流体字体，动画渐变，样式选择元素等。

CSS规范似乎无法跟上行业的各种功能需求，例如对动画的更多控制，改进的文本截断，更好的输入和选择元素样式选项，更多的显示选项，更多的过滤器选项等。

那么解决方案是什么？为开发人员提供一种使用各种AP​​I扩展CSS的本地方法。在本文中，我们将研究前端开发人员如何使用Houdini API，JavaScript和CSS做到这一点。在每个部分中，我们将分别检查每个API，检查其浏览器支持和当前规范状态，以及如何使用渐进增强的方式实现它们。

## 什么是Houdini

Houdini是浏览器API集合的总称，旨在对Web开发流程和总体上CSS标准的开发进行重大改进。
开发人员将能够使用JavaScript扩展具有新功能的CSS，加入CSS渲染引擎，并告诉浏览器如何在渲染过程中应用CSS。与使用常规polyfill相比，这将显着提高性能和稳定性。

Houdini规范由高级 API 和低级 API组成：

高级API和浏览器的渲染过程有很大的关系。包括：

**浏览器的渲染过程：style -> layout -> paint ->  composite**

* Paint API：浏览器绘制阶段的扩展，用于控制视觉相关的属性（颜色，背景，边框等）。
* Layout API：浏览器layout阶段的扩展，用于确定元素的尺寸，位置和对齐方式。
* Animation API：浏览器合成渲染阶段（composite）的扩展，其中布局已经绘制到屏幕上。（翻译？）

低级API是高级API的基础。包括：

* 类型对象模型API
* 自定义属性 & 值 API
* 字体物料API
* Worklets

某些浏览器已经提供了Houdini API，将它们与其他API结合使用，可以在发布时可以适配。

## CSS的未来

与到目前为止已引入的常规CSS功能规范不同，Houdini突出之处在于允许开发人员以更原生的方式扩展CSS。这是否意味着CSS规范将停止发展，并且不会发布CSS功能的新官方实现？

好吧，事实并非如此。

Houdini的目标是通过允许开发人员创建可以轻松标准化的有效原型来辅助CSS功能开发过程。此外，开发人员将能够更轻松地共享开源CSS Worklet，更少的对于特定于浏览器的错误修正。

## 类型对象模型API

在介绍Houdini之前，JavaScript与CSS交互的唯一方法是解析表示为字符串值的CSS并对其进行修改。由于在分配新值时需要来回更改值类型并且需要手动附加值单位，因此手动解析和覆盖样式可能很困难且容易出错。

``` js
selectedElement.style.fontSize = newFontsize + "px"; // newFontSize = 20
console.log(selectedElement.style.fontSize); // "20px"
```

**类型对象模型（简称Typed OM）**API通过将CSS值显示为类型化的JavaScript对象，从而为CSS值添加更多的语义含义。这大大改善了相关代码，并使其更加高效，稳定和可维护。CSS值由CSSUnitValue接口表示，该接口由一个值和一个unit属性组成。

``` js
{
    value: 20,
    unit: "px",
}
```

这个新接口可以与以下新属性一起使用：

* `computedStyleMap()`: 用于解析 computed style（非内联）。这是选定元素的一种方法，在解析或使用其他方法之前需要调用该方法。
* `attributeStyleMap`: 用于解析和修改内联样式。这是在选定元素上可用的属性。

``` js
// Get computed styles from stylesheet (initial value)
selectedElement.computedStyleMap().get("font-size"); // { value: 20, unit: "px"}

// Set inline styles
selectedElement.attributeStyleMap.set("font-size", CSS.em(2)); // Sets inline style
selectedElement.attributeStyleMap.set("color", "blue"); // Sets inline style

// Computed style remains the same (initial value)
selectedElement.computedStyleMap().get("font-size"); // { value: 20, unit: "px"}

// Get new inline style
selectedElement.attributeStyleMap.get("font-size"); // { value: 2, unit: "em"}
```

请注意，在设置新的数值时如何使用特定的CSS类型。通过使用这种语法，可以避免许多潜在的与类型相关的问题，并且所生成的代码更加可靠且没有错误。

`get` 和 `set`方法只是Typed OM API定义的所有可用方法的一小部分。其中一些包括：

* `clear`: 移除所有偶内联样式。
* `delete`: 从内联样式中移除指定的CSS属性和值。
* `has`: 返回一个布尔值，代表指定的CSS属性是否被设置。
* `append`: 向支持多个值的属性添加一个附加值。
* 等等

### 特征检测

``` js
var selectedElement = document.getElementById("example");

if(selectedElement.attributeStyleMap) {
  /* ... */
}

if(selectedElement.computedStyleMap) {
  /* ... */
}
```

### W3C 规范状态

[Working Draft](https://drafts.css-houdini.org/css-typed-om/)

### 浏览器支持

https://ishoudinireadyyet.com/

## 自定义属性、值 API

CSS属性和值API允许开发人员通过添加类型，初始值和定义继承来扩展CSS变量。开发人员可以使用 `registerProperty`方法注册CSS自定义属性从而达到自定义CSS属性的目的，而 `registerProperty` 方法的作用就是告诉浏览器如何转换它并在发生错误的情况下处理回退。

``` js
CSS.registerProperty({
    name: "--colorPrimary",
    syntax: "<color>",
    inherits: false,
    initialValue: "blue",
});
```

该方法接受一个对象参数，该对象包含下面这些属性：

* name: 自定义属性的名称
* syntax： 告诉浏览器如何解析一个自定义属性。这些是预定义的值，例如 `<color>`，`<integer>`，`<number>`，`<length>`，`<percentage>`等。
* inherit: 告诉浏览器自定义属性是否继承其父级的值。
* initialValue： 初始值，在设置任何其他值之间使用该值，并在发生错误时用作备用。

在下面的示例中，将设置 `<color>` 类型的自定义属性。此自定义属性将在渐变过渡中使用。你可能会认为当前的CSS不支持背景渐变的过渡，你这样想是没有错的。请注意，自定义属性是在 `transition` 中使用的，而不是用`background`。

``` css
.gradientBox { 
  background: linear-gradient(45deg, rgba(255,255,255,1) 0%, var(--colorPrimary) 60%);
  transition: --colorPrimary 0.5s ease;
  /* ... */
}

.gradientBox:hover {
  --colorPrimary: red
  /* ... */
}
```

浏览器不知道如何处理渐变过渡，但知道如何处理颜色过渡，因为自定义属性指定为 `<color>` 类型。在支持Houdini的浏览器上，将鼠标悬停在元素上时会发生渐变过渡。渐变位置百分比也可以用CSS自定义属性替换（注册为 `<percentage>` 类型），并以与示例相同的方式添加到过渡中。

如果移除 `registerProperty` 并在：root选择器中注册了常规CSS自定义属性，则渐变过渡将无法正常工作。要求使用 `registerProperty`，以便浏览器知道应将其视为颜色。

在此API的未来实现中，可以直接在CSS中注册自定义属性。

``` css
@property --colorPrimary { 
  syntax: "<color>"; 
  inherits: false; 
  initial-value: blue;
}
```

这个简单的示例使用注册的CSS自定义属性分别针对颜色和位置展示了悬停事件时的渐变颜色和位置过渡。示例库中提供了完整的[源代码](https://github.com/codeAdrian/houdini-examples/tree/master/custom-properties-api)。

### Feature Detection

``` js
if (CSS.registerProperty) {
    /*...*/
}
```

### W3C SPECIFICATION STATUS

[Working Draft](https://drafts.css-houdini.org/css-properties-values-api/)

### 浏览器支持

https://ishoudinireadyyet.com/

## Font Metrics API

Font Metrics API仍处于开发的早期阶段，因此其规范将来可能会更改。在当前草案中，Font Metrics API将提供一些方法来测量在屏幕上呈现的文本元素的尺寸，以便允许开发人员影响文本元素在屏幕上呈现的方式。使用当前功能很难或无法测量这些值，因此该API将使开发人员可以更轻松地创建与文本和字体相关的CSS功能。多行动态文本截断是这些功能之一的示例。

### W3C SPECIFICATION STATUS

[Collection of Ideas](https://drafts.css-houdini.org/font-metrics-api/)

### 浏览器支持

https://ishoudinireadyyet.com/

## Worklets

在继续了解其他API之前，请先解释Worklets概念。**Worklets** 是在渲染期间运行的脚本，独立于主要的JavaScript环境。它们是渲染引擎的扩展点。它们专为并行（具有2个或更多实例）和线程不可知而设计，减少了对全局范围的访问，并在需要时由呈现引擎调用。Worklets只能在HTTPS（在生产环境上）或localhost（出于开发目的）上运行。

Houdini引入了以下Worklets来扩展浏览器渲染引擎：

* Paint Worklet - Paint API
* Animation Worklet - Animation API
* Layout Worklet - Layout API

## Paint API

Paint API使开发人员可以使用JavaScript函数通过 [2D Rendering Context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)（它是HTML5 Canvas API的子集）直接绘制到元素的背景，边框或内容中。Paint API使用Paint Worklet绘制可动态响应CSS更改（例如CSS变量的更改）的图像。任何熟悉Canvas API的人都会对Houdini的Paint API能够很快上手使用。

定义Paint Worklet需要几个步骤：

1. 使用 `registerPaint` 函数编写和注册Paint Worklet.
2. 使用 `CSS.paintWorklet.addModule` 函数在HTML文件或主JavaScript文件中调用Worklet.
3. 在CSS中将 `paint()` 函数与Worklet名称和可选的输入参数一起使用。

让我们看一下 `registerPaint` 函数，该函数用于注册Paint Worklet并定义其功能。

``` js
registerPaint("paintWorketExample", class {
  static get inputProperties() { return ["--myVariable"]; }
  static get inputArguments() { return ["<color>"]; }
  static get contextOptions() { return {alpha: true}; }

  paint(ctx, size, properties, args) {
    /* ... */
  }
});
```

`registerPaint` 函数由几个部分组成：

* `inputProperties`: Worklet将跟踪的CSS自定义属性的数组。此数组表示绘画工作集的依存关系。
* `inputArguments`: 一个输入参数的数组，能够从 `paint`函数传递进来。
* `contextOptions`: 允许或禁止颜色不透明。如果设置为false，则所有颜色都将显示为完全不透明。
* `paint`: 主函数提供了一下参数：
    * `ctx`: 2D 绘画上下文，几乎与Canvas API的2D绘图环境相同。
    * `size`: 包含元素的宽度和高度的对象。值由布局渲染过程确定。画布大小与元素的实际大小相同
    * `properties`: 在inputProperties中定义的输入变量
    * `args`: 在CSS的paint函数中传递的输入参数数组

在注册Worklet之后，只需通过提供文件的路径即可在HTML文件中调用它。

``` js
CSS.paintWorklet.addModule("path/to/worklet/file.js");
```

也可以从外部URL（例如，从内容交付网络）添加任何Worklet，从而使它们模块化并且可重复使用。

``` js
CSS.paintWorklet.addModule("https://url/to/worklet/file.js");
```

调用Worklet之后，可以使用paint函数在CSS内部使用它。此函数接受Worklet的注册名称作为第一个输入参数，其后的每个输入参数都是可以传递给Worklet的自定义参数（在Worklet的inputArguments中定义）。从那时起，浏览器确定何时调用Worklet以及哪些用户操作和CSS定制属性值更改以响应。

``` css
.exampleElement {
  /* paintWorkletExample - name of the worklet
     blue - argument passed to a Worklet */
  background-image: paint(paintWorketExample, blue);
}
```

### FEATURE DETECTION

``` js
if ("paintWorklet" in CSS) {
  /* ... */
}


@supports(background:paint(paintWorketExample)){
  /* ... */
}
```

### W3C SPECIFICATION STATUS

[Candidate recommendation](https://drafts.css-houdini.org/css-paint-api/)

### BROWSER SUPPORT

https://ishoudinireadyyet.com/

## Animation API

Animation API扩展了Web动画，提供了用于侦听各种事件（滚动，悬停，单击等）的选项，并通过使用Animation Worklet在其专用线程上运行动画来提高性能。它允许用户采取行动来控制以高性能，非阻塞方式运行的动画流。

像任何Worklet一样，Animation Worklet需要首先注册。

``` js
registerAnimator("animationWorkletExample", class {
  constructor(options) {
    /* ... */
  }
  animate(currentTime, effect) {
    /* ... */
  }
});
```

此类包含两个函数：

* `constructor`: 当一个是新的实例被创建的时候调用。用于常规设置。
* `animate`: 包含动画逻辑的主要功能。提供以下输入参数：
    * `currentTime`: 来自定义的时间轴的当前时间值
    * `effect`: 此动画使用的一系列效果。

注册Animation Worklet之后，需要将其包含在主JavaScript文件中，需要定义动画（元素，关键帧，选项），并使用选定的时间线实例化动画。时间轴概念和Web动画基础知识将在下一部分中说明。

``` js
/* Include Animation Worklet */
await CSS.animationWorklet.addModule("path/to/worklet/file.js");;

/* Select element that's going to be animated */
const elementExample = document.getElementById("elementExample");

/* Define animation (effect) */
const effectExample = new KeyframeEffect(
  elementExample,  /* Selected element that's going to be animated */
  [ /* ... */ ],   /* Animation keyframes */
  { /* ... */ },   /* Animation options - duration, delay, iterations, etc. */
);

/* Create new WorkletAnimation instance and run it */
new WorkletAnimation(
  "animationWorkletExample"  /* Worklet name */
  effectExample,             /* Animation (effect) timeline */
  document.timeline,         /* Input timeline */
  {},                        /* Options passed to constructor */
).play();                    /* Play animation */
```

### 时间表映射

网络动画基于时间轴，并将当前时间映射到效果本地时间的时间轴。例如，让我们看一个具有3个关键帧（开始，中间，最后）的重复线性动画，该动画在页面加载（延迟）后1秒钟运行，持续时间为4秒钟。示例中的效果时间轴如下所示（持续时间为4秒，没有延迟）：

|  Effect timeline   | keyframe  |
|  ----  | ----  |
| 0ms     | 第一帧 - 动画开始 |
| 2000ms  | 中间帧 - 动画中 |
| 4000ms  | 最后一帧 - 动画最后或者重新到第一帧

为了更好地理解effect.localTime，通过将其值设置为3000ms（考虑到1000ms延迟），结果动画将被锁定到效果时间轴中的一个中间关键帧（1000ms延迟+ 2000ms用于中间关键帧）。通过将值设置为7000ms和11000ms，将会产生相同的效果，因为动画以4000ms的间隔（动画持续时间）重复。

```js
animate(currentTime, effect) {
  effect.localTime = 3000; // 1000ms delay + 2000ms middle keyframe
}
```

具有恒定的effect.localTime值时，不会发生动画，因为动画被锁定在特定的关键帧中。为了正确设置元素的动画，其effect.localTime必须是动态的。因此该值必须是依赖于currentTime或其他变量。

以下代码显示了时间轴的1：1（线性函数）映射以影响本地时间的函数。

``` js
animate(currentTime, effect) {
  effect.localTime = currentTime; // y = x linear function
}
```

| Timeline (document.timeline) | Mapped effect local time | Keyframe |
| `startTime` + 0ms(经过的时间)  | `startTime` + 0ms | First |
| `startTime` + 1000ms(经过的时间) | `startTime` + 1000ms(delay) + 0ms | First | 
| `startTime` + 3000ms (经过的时间) | `startTime` + 1000ms (delay) + 2000ms | Middle |


时间轴不限于以1：1映射来影响本地时间。动画API允许开发人员通过使用标准JavaScript函数创建复杂的时间线来操纵 `animate` 函数中的时间线映射。动画在每次迭代中也不必表现相同（如果重复动画）。

动画不必依赖于文档的时间轴（document timeline），该时间轴仅从加载之时计算毫秒。诸如滚动事件之类的用户行为可以使用 `ScrollTimeline`对象作为一个动画的 `timeline`。例如，动画可以在用户滚动到200像素时开始，而在用户滚动到屏幕800像素时结束。

``` js
const scrollTimelineExample = new ScrollTimeline({
  scrollSource: scrollElement,  /* DOM element whose scrolling action is being tracked */
  orientation: "vertical",      /* Scroll direction */
  startScrollOffset: "200px",   /* Beginning of the scroll timeline */
  endScrollOffset: "800px",    /* Ending of the scroll timeline */
  timeRange: 1200,              /* Time duration to be mapped to scroll values*/
  fill: "forwards"              /* Animation fill mode */
});
...
```

动画将自动适应用户滚动速度，并保持流畅和响应。由于Animation Worklets不在主线程上运行，并且已连接到浏览器的渲染引擎，因此依赖于用户滚动的动画可以平稳运行并表现出色。

### EXAMPLE

下面的示例展示了非线性时间轴的实现方式。它使用修改后的[高斯函数](https://mathworld.wolfram.com/GaussianFunction.html)，并在同一时间轴上应用平移和旋转动画。示例库中提供了完整的源代码。

[source code](https://github.com/codeAdrian/houdini-examples/tree/master/animation-api-example)

### FEATURE DETECTION

``` js
if (CSS.animationWorklet) {
  /* ... */
}
```

### W3C SPECIFICATION STATUS

[First Public Working Draft](https://drafts.css-houdini.org/css-animation-worklet/): 准备进行社区审核，可能会有稍微的改变。

### BROWSER SUPPORT

略

## Layout API

Layout API允许开发人员通过定义可在 `display` CSS属性中使用的新布局模式来扩展浏览器的布局呈现过程。Layout API引入了新概念，非常复杂，并且提供了许多用于开发自定义布局算法的选项。

与其他Worklet相似，需要首先注册和定义布局Worklet。

``` js
registerLayout('exampleLayout', class {
  static get inputProperties() { return ['--exampleVariable']; }

  static get childrenInputProperties() { return ['--exampleChildVariable']; }

  static get layoutOptions() {
    return {
      childDisplay: 'normal',
      sizing: 'block-like'
    };
  }

  intrinsicSizes(children, edges, styleMap) {
    /* ... */
  }

  layout(children, edges, constraints, styleMap, breakToken) {
    /* ... */
  }
});
```

Worklet 注册包含下面几个方法：

* inputProperties: 一个CSS 自定义属性的数组，Worklet会跟踪数组中这些CSS自定义属性所属的Parent Layout元素，即调用此布局的元素。这个数组表示一个Layout Worklet的依赖。
* childrenInputProperties: Worklet将跟踪的一系列CSS自定义属性属于Parent Layout元素的子元素，即设置此布局的元素的子元素。
* layoutOptions: 定义了下面布局属性：
  * childDisPlay: 可以具有 `block` 或 `normal` 的预定义值。确定这些框是显示为块还是内联。
  * sizing: 有 `block-lick` 或 `manual` 预定义值。它告诉浏览器分别预先计算大小或不预先计算（除非明确设置大小）。
* intrinsicSizes: 定义一个 box 或其内容如何适合布局上下文。
  * children：父布局元素的子元素(s)，即调用此布局的元素的子代。
  * edges：一个box的布局边界
  * styledMap：一个box样式的类型对象模型
* layout： 执行布局的主要功能。
  * children： 父布局元素的子元素，即调用此布局的元素的子元素。
  * edges: 一个盒子的布局边界
  * constraints: 父布局的约束
  * styleMap: 一个box的样式类型对象模型
  * breakToken：break token used to resume a layout in case of pagination or printing。

与Paint API一样，浏览器呈现引擎确定何时调用Paint Worklet。仅需要将其添加到HTML或主JavaScript文件中。

``` js
CSS.layoutWorklet.addModule('path/to/worklet/file.js');
```

最后需要在CSS文件中引用到：

``` css
.exampleElement {
  display: layout(exampleLayout);
}
```

### 布局API如何执行布局

在上一个示例中，已经使用Layout API定义了exampleLayout。

``` css
.exampleElement {
  display: layout(exampleLayout);
}
```

此元素称为 **Parent Layout**，它被 **Layout Edges** 封闭，**Layout Edges** 由填充、边框和滚动条组成。Parent Layout由称为 **Current Layouts** 的子元素组成。Current Layout 是实际的目标元素，可以使用Layout API自定义其布局。例如，当使用 `display：flex;` 时。在元素上，其子元素将重新定位以形成弹性布局。这类似于使用Layout API进行的操作。

每个 **Current Layout** 都由 **Child Layout** 组成，**Child Layout** 是 LayoutChild（元素，`:: before`和`:: after`伪元素）的布局算法，而 **LayoutChild** 是CSS生成的仅包含样式数据（不包含布局数据）的 box。浏览器渲染引擎会在style阶段中自动创建LayoutChild元素。Layout Child可以生成实际执行布局渲染操作的 **Fragment**。

上面这段翻译的原文：

> Each Current Layout consists of Child Layout which is a layout algorithm for the LayoutChild (element, ::before and ::after pseudo-elements) and LayoutChild is a CSS generated box that only contains style data (no layout data). LayoutChild elements are automatically created by browser rendering engine on style step. Layout Child can generate a Fragment which actually performs layout render actions.

### EXAMPLE

与Paint API示例类似，该示例直接从Google Chrome Labs存储库导入 Masonry Layout Worklet，但在此示例中，它与图像内容而不是文本一起使用。示例存储库上提供了完整的源代码。

### FEATURE DETECTION

``` js
if (CSS.layoutWorklet) {
  /* ... */
}
```

### W3C SPECIFICATION STATUS

* [First Public Working Draft](https://drafts.css-houdini.org/css-layout-api/)

## Houdini 和渐进增强

即使 CSS Houdini 尚不提供最佳的浏览器支持，也可以在逐步使用增强功能的情况下使用它。如果您不熟悉渐进式增强功能，那么值得阅读这篇方便的文章，它对它的解释非常好。如果您决定今天在您的项目中实现Houdini，那么请记住以下几点：

* 使用功能检测以防止错误。

每个Houdini API和Worklet提供了一种简单的方法来检查浏览器中是否可用。使用功能检测可将Houdini增强功能仅应用于支持该功能的浏览器，并避免出现错误。

* 仅将其用于演示和视觉增强。

在尚不支持Houdini的浏览器上浏览网站的用户应有权访问该网站的内容和核心功能。用户体验和内容演示不应取决于Houdini的功能，而应具有可靠的后备功能。

首先专注于开发高性能和可靠的网站用户体验，然后将Houdini功能用于装饰目的作为逐步增强。

## 总结

Houdini API最终将使开发人员能够将用于样式操作和装饰的JavaScript代码保持更接近浏览器的render pipeline，从而提高性能和稳定性。通过允许开发人员参与浏览器的渲染过程，他们将能够开发各种CSS polyfill，这些Polyfill可以轻松共享，实现并有可能添加到CSS规范本身中。Houdini还将使开发人员和设计人员在进行样式，布局和动画处理时不受CSS限制的约束，从而带来新的令人愉悦的Web体验。

今天，可以将CSS Houdini功能添加到项目中，但要严格考虑逐步增强的功能。这将使不支持Houdini功能的浏览器能够正确呈现网站并提供最佳的用户体验。

随着Houdini越来越受到人们的关注和更好的浏览器支持，看着开发者社区会提出什么将会令人兴奋。以下是来自社区的Houdini API实验的一些出色示例：

* https://css-houdini.rocks/
* https://github.com/GoogleChromeLabs/houdini-samples
* https://github.com/codeAdrian/houdini-examples
* https://nicedoc.io/CSSHoudini/awesome-css-houdini

## 一些链接

* 能够快速了解和学习Houdini相关的内容：https://houdini.glitch.me/

## （重要）chrome开启实验模式

在chrome://flags中将 `Experimental Web Platform features` 改为开启状态。

