import { getOssClient } from "../../modules/oss/oss.service.js";
import type { ImageClient, ImageObject, ChartGroup } from "./types.js";
import { IMAGES_PATHS, getImagePrefix } from "../../_data/oss-images-path.js";

const IMAGE_EXTENSION = /\.(jpe?g|png|webp|gif|bmp|tiff?)$/i;

const listImageObjects = async (
  client: ImageClient,
  prefix: string,
): Promise<ImageObject[]> => {
  const images: ImageObject[] = [];
  let hasMore = true;
  let marker = "";
  // 每次读取一页，直到 OSS 没有下一页。
  while (hasMore) {
    const result = await client.list({
      prefix,
      delimiter: "/",
      "max-keys": 1000,
      marker,
    });
    const files = result.objects || [];
    for (const file of files) {
      if (file.size > 0 && IMAGE_EXTENSION.test(file.name)) {
        images.push(file);
      }
    }
    hasMore = Boolean(result.isTruncated);
    if (hasMore) {
      const nextMarker = result.nextMarker;
      if (!nextMarker || nextMarker === marker) {
        throw new Error("Invalid OSS pagination marker");
      }
      marker = nextMarker;
    }
  }
  return images;
};

// 文件只能位于配置的相册内，不接受任意路径。
export function isImageFilename(file: string): boolean {
  return !/[\/\\\u0000]/.test(file) && IMAGE_EXTENSION.test(file);
}

export async function getOssWebpFiles(
  prefix: string,
  client?: ImageClient,
): Promise<{ title: string; file: string }[]> {
  const oss: ImageClient = client ?? (await getOssClient());
  const images = await listImageObjects(oss, prefix);
  return images.map((image) => {
    const filename = image.name.substring(image.name.lastIndexOf("/") + 1);
    return {
      title: filename.replace(IMAGE_EXTENSION, ""),
      file: filename,
    };
  });
}

// 由后端通过 SDK 读取图片，OSS 凭证不再传到浏览器。
export async function getOssImage(
  key: string,
  client?: ImageClient,
): Promise<Buffer> {
  const oss: ImageClient = client ?? (await getOssClient());
  const options: { timeout: number; process?: string } = { timeout: 20000 };
  if (!/\.webp$/i.test(key)) {
    options.process = "image/format,webp";
  }
  const image = await oss.get(key, options);
  return image.content;
}

export async function getOssCertChartStats(client?: ImageClient) {
  const oss: ImageClient = client ?? (await getOssClient());
  const groups = new Map<string, ChartGroup>();
  for (const album of Object.values(IMAGES_PATHS.certificates)) {
    const images = await listImageObjects(oss, getImagePrefix(album));
    const category = album.category || "其他";
    let group = groups.get(category);
    if (!group) {
      group = { title: category, number: 0, details: [] };
      groups.set(category, group);
    }
    group.number += images.length;
    group.details.push({
      title: album.title || album.path,
      number: images.length,
    });
  }
  return [...groups.values()]
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((group) => ({
      ...group,
      details: group.details
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((item) => ({
          ...item,
          percent: (group.number
            ? (item.number / group.number) * 100
            : 0
          ).toFixed(1),
        })),
    }));
}
