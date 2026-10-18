import asyncHandler from "express-async-handler";
import {
  getOssCertChartStats,
  getOssWebpFiles,
  getOssImage,
  isImageFilename,
} from "../../utils/oss/oss.webp.js";
import {
  getImagePrefix,
  resolveImageAlbum,
} from "../../_data/oss-images-path.js";

const normalize = (value: unknown): string =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

// GET /api/data/images?group=profiles&album=avatar
export const imagesController = asyncHandler(async (req, res) => {
  const group = normalize(req.query.group);
  const album = normalize(req.query.album);

  if (!group || !album) {
    res.status(400).json({ message: "Provide group and album." });
    return;
  }
  const config = resolveImageAlbum(group, album);

  if (!config) {
    res.status(404).json({ message: "Unknown image album." });
    return;
  }
  try {
    const prefix = getImagePrefix(config);
    const images = await getOssWebpFiles(prefix);
    res.set("Cache-Control", "no-store");
    res.json(
      images.map((image) => ({
        title: image.title,
        src: `/api/data/images/file?${new URLSearchParams({ group, album, file: image.file })}`,
      })),
    );
  } catch (error) {
    console.error("Failed to fetch images:", error);
    res.status(502).json({ message: "Failed to fetch images from OSS." });
  }
});

// GET /api/data/images/file?group=backgrounds&album=home&file=home.jpg
export const imageFileController = asyncHandler(async (req, res) => {
  const group = normalize(req.query.group);
  const album = normalize(req.query.album);
  const file = typeof req.query.file === "string" ? req.query.file : "";
  if (!group || !album || !isImageFilename(file)) {
    res
      .status(400)
      .json({ message: "Provide group, album and a valid image filename." });
    return;
  }
  const config = resolveImageAlbum(group, album);
  if (!config) {
    res.status(404).json({ message: "Unknown image album." });
    return;
  }
  try {
    const content = await getOssImage(`${getImagePrefix(config)}${file}`);
    res.set("Cache-Control", "public, max-age=3600");
    res.type("image/webp").send(content);
  } catch (error) {
    const code = error instanceof Error ? error.name : "UnknownError";
    console.error("Failed to read OSS image:", code);
    if (code === "NoSuchKeyError") {
      res.status(404).json({ message: "Image not found." });
      return;
    }
    res.status(502).json({ message: "Failed to load image from OSS." });
  }
});

export const imagesCertsChartController = asyncHandler(async (_req, res) => {
  try {
    res.json(await getOssCertChartStats());
  } catch (error) {
    console.error("Failed to fetch certificate statistics:", error);
    res.status(502).json({
      message: "Failed to fetch certificate statistics from OSS.",
    });
  }
});
