# OSS 图片约定

图片获取与后端转发的代码讲解见 [图片为什么改成由后端转发](./oss-image-proxy.md)。

所有图片存放在 `images/` 下，目录和文件名使用小写英文、数字和连字符。
每张图片只上传一份原图（例如 JPG、PNG、WebP），接口按文件逐张返回，不做尺寸副本合并。
同一相册内文件主名应唯一，推荐 `主题-日期或版本.扩展名`，例如 `avatar-20261018.jpg`。

| 用途     | 新目录示例                                 |
| -------- | ------------------------------------------ |
| 网课证书 | `images/certificates/coursera/typescript/` |
| 语言证书 | `images/certificates/languages/english/`   |
| 头像     | `images/profiles/avatar/`                  |
| 个人照片 | `images/profiles/personal/`                |
| 首页背景 | `images/backgrounds/home/`                 |

增加用途时，在 `oss-images-path.ts` 注册分类和相册即可，不需要新增 controller。
接口只读取注册的相册直属文件，不递归列出子目录；无图片返回 `[]`。

## 接口

`GET /api/data/images?group=profiles&album=avatar`

`GET /api/data/images?group=backgrounds&album=home`

`GET /api/data/images?group=certificates&album=meta-frontend`

返回 `[{ "title": "home", "src": "/api/data/images/file?group=backgrounds&album=home&file=home.jpg" }]`。
不传尺寸参数，统一保持原图尺寸输出 WebP。
接口返回本站图片地址，浏览器访问该地址后，后端通过 SDK 从 OSS 读取图片内容并返回 `image/webp`。`.webp` 文件不转换；其他支持的格式由 OSS 转成 WebP 后交给后端。原文件保持不变，浏览器看不到 OSS 域名、完整对象路径和签名凭证。
图片响应缓存 1 小时，替换图片时推荐使用新文件名。后端会承担图片传输流量，每次未命中浏览器缓存时会读取 OSS。
直接将原图上传到配置的 OSS 目录即可，无需本地手动转换。此流程仅处理通过该接口读取的 OSS 图片；前端 `public` 下的本地图片不经过此接口。
图片统一使用 `group` 和 `album` 请求，不再提供旧的 `/dash-certs` 接口或名称别名转换。
`/certs-chart` 只负责证书统计，直接计算配置中相册的图片文件数。
前端使用 `webpImagesApi('profiles', 'avatar')` 或 `webpImagesApi('certificates', 'typescript')` 获取对应图片。

## 迁移与部署

1. 直接按配置中的 `path` 读取图片，完整目录为 `images/` + `path`。将 OSS 原图整理到上表目录即可；整理完成前，对应相册可能返回空列表。
2. 后端使用 `OSS_BUCKET` 和 `OSS_REGION` 对应的 OSS HTTPS 域名，通过 SDK 请求读取私有图片；浏览器只访问本站接口。STS 角色需要相应图片的列举、读取权限。
3. 本地使用 `npm run server`；生产直接启动时使用 `npx tsx server/server.js`（目前 JS 路由引用 TS controller，需要 TS 运行器）。

当前图片接口可公开调用，只应在配置中注册可公开展示的图片。包含敏感信息的图片还需要业务鉴权；后端转发不替代用户鉴权。文件接口只允许访问已注册相册的直属图片文件。
尚未增加上传接口，本次不修改 OSS 上的文件。
