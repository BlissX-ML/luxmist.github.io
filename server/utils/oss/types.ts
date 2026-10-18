//
export type ImageObject = { name: string; size: number };

export type ImageListResult = {
  objects?: ImageObject[];
  isTruncated?: boolean;
  nextMarker?: string;
};

// 这里只声明查询图片时用到的 OSS 参数和返回字段。
export type ImageClient = {
  list(options: {
    prefix: string;
    delimiter: string;
    "max-keys": number;
    marker: string;
  }): Promise<ImageListResult>;
  get(
    key: string,
    options: { timeout: number; process?: string },
  ): Promise<{ content: Buffer }>;
};

export type ChartDetail = { title: string; number: number };

export type ChartGroup = {
  title: string;
  number: number;
  details: ChartDetail[];
};
