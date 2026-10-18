# 图片为什么改成由后端转发

是的：之前由浏览器请求 OSS 图片；现在由后端请求 OSS，再把图片内容返回给浏览器。

但“浏览器拿到 key”需要区分：之前浏览器拿到的是带临时签名的图片地址，不是长期的 AccessKeySecret。现在连图片地址里的临时签名也不再返回给浏览器。

## 1. 前后两种方式有什么不同

之前，后端先生成 OSS 图片地址，交给浏览器：

```text
浏览器 → 后端：我要首页背景的图片地址
后端 → 浏览器：这是带临时签名的 OSS 地址
浏览器 → OSS：根据这个地址下载图片
OSS → 浏览器：返回图片内容
```

所以浏览器的 Network 面板能看到 OSS 域名、文件路径和签名参数。

现在，后端返回的是本站图片接口地址：

```text
浏览器 → 后端：我要首页背景的图片地址
后端 → 浏览器：这是本站的图片接口地址
浏览器 → 后端：访问这个接口，获取图片
后端 → OSS：使用后端保存的凭证读取图片
OSS → 后端：返回图片内容
后端 → 浏览器：把图片内容发回去
```

浏览器仍然发起图片请求，但请求目标变成了后端。这就是“后端转发”。

## 2. 按现在的代码走一遍

### 第一次请求：获取图片列表，返回 JSON

以下用 `backgrounds/home` 相册举例说明通用接口。当前 Home 页保留 Canvas 背景，已不再请求这张 OSS 背景图；其他页面有需要时仍可使用此能力。

页面调用：

```js
webpImagesApi("backgrounds", "home");
```

浏览器实际请求：

```text
GET /api/data/images?group=backgrounds&album=home
```

[imagesControllers.ts](../controllers/images/imagesControllers.ts) 中的 `imagesController` 负责处理：

1. 读取 `group` 和 `album`。
2. 根据 [oss-images-path.ts](./oss-images-path.ts) 找到 `images/backgrounds/home/`。
3. 通过 `getOssWebpFiles()` 查询文件列表；其中的 `client.list()` 只查询文件信息，不下载图片。
4. 将每个文件转换成本站图片接口地址。

例如返回：

```json
[
  {
    "title": "home",
    "src": "/api/data/images/file?group=backgrounds&album=home&file=home.jpg"
  }
]
```

这里的 `src` 只是地址，不是图片内容，也没有 OSS 签名。

### 第二次请求：获取图片本身，返回图片数据

页面把 `src` 放进 CSS 的 `backgroundImage` 或图片的 `src`，浏览器就会请求：

```text
GET /api/data/images/file?group=backgrounds&album=home&file=home.jpg
```

这个请求由 `imageFileController` 处理。它检查相册和文件名，再拼接出后端使用的 OSS 路径：

```text
images/backgrounds/home/home.jpg
```

然后执行：

```ts
const content = await getOssImage(`${getImagePrefix(config)}${file}`);
res.set("Cache-Control", "public, max-age=3600");
res.type("image/webp").send(content);
```

`getOssImage()` 取回图片数据，`.send(content)` 把这些数据发给浏览器。浏览器收到后显示图片，不需要再访问 OSS。

### getOssImage() 内部做了什么

它位于 [oss.webp.ts](../utils/oss/oss.webp.ts)。关键代码如下：

```ts
const oss = client ?? (await getOssClient());
const options: { timeout: number; process?: string } = { timeout: 20000 };

if (!/\.webp$/i.test(key)) {
  options.process = "image/format,webp";
}

const image = await oss.get(key, options);
return image.content;
```

| 代码 | 作用 |
| --- | --- |
| `getOssClient()` | 获取已配置后端认证信息的 OSS 客户端 |
| `key` | 图片在 OSS 中的完整文件路径 |
| `options.process` | 告诉 OSS 将图片转换成 WebP；已有 WebP 不设置此参数 |
| `oss.get(key, options)` | 后端向 OSS 发出请求，读取图片内容 |
| `image.content` | OSS 返回的图片二进制数据，在 Node.js 中用 `Buffer` 表示 |

`Buffer` 可以理解成“图片文件的内容已经读进了后端内存”。这里没有把图片保存到后端硬盘。

## 3. 不是只改了 Content-Type

这两处代码负责不同的事情：

```ts
options.process = "image/format,webp";
```

这是转换指令，由 OSS 实际执行。OSS 将转换后的图片交给后端，OSS 原文件保持不变。

```ts
res.type("image/webp").send(content);
```

其中 `.type("image/webp")` 设置响应头 `Content-Type`，告诉浏览器收到的是什么格式；`.send(content)` 才是发送图片内容。

只改响应头不会把 JPG 转成 WebP。当前代码同时做了“请求 OSS 转换”和“返回转换后的内容”。

## 4. key 和凭证不是同一个东西

| 名称 | 含义 | 当前浏览器是否会收到 |
| --- | --- | --- |
| 对象 key | 如 `images/backgrounds/home/home.jpg`，是文件路径，不是密码 | 不直接返回完整路径；分类、相册和文件名仍可见 |
| AccessKeySecret | 用于认证和签名的密钥 | 不返回，只保留在后端 |
| 临时签名参数 | 之前图片 URL 中的 `Signature`、`security-token` 等 | 现在不返回，SDK 在后端完成认证请求 |

以前也不是让浏览器拿着长期密钥自己签名，而是让浏览器使用后端生成的签名 URL。现在由后端直接读取图片，所以前端不再需要这个签名 URL。

## 5. 这次改动带来的影响

- 浏览器只访问本站接口，不直接访问 OSS，所以不再将浏览器的 localhost Referer 发送给 OSS。后端使用 SDK 的认证请求读取图片。
- 图片读取失败时，本站接口会返回错误；不存在的图片返回 404，其他读取错误返回 502。
- 图片内容经过后端，会占用后端带宽和内存；目前实现会先把一张图片读入内存，再发送给浏览器。
- 图片响应允许缓存 1 小时。缓存有效时浏览器可以复用图片，不必每次向后端重新下载；更新图片推荐更换文件名。
- 隐藏凭证不代表隐藏图片本身。当前接口公开，访客仍可查看或保存这些图片；敏感图片需要另加用户鉴权。

目录命名、接口示例和部署要求见 [OSS 图片约定](./oss-images.md)。
