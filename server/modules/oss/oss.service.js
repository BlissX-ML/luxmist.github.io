import OSS from 'ali-oss';
import { getValidSTSToken, getStatus, refreshSTSToken } from './sts.service.js';

// 全局维护 OSS客户端实例
let ossClient = null;

async function getOssClient() {
    const { hasValidToken } = getStatus();

    const config = {
        ossRegion: process.env.OSS_REGION || '',
        ossBucket: process.env.OSS_BUCKET || ''
    };

    if (!config.ossRegion || !config.ossBucket) {
        throw new Error('OSS配置缺失, 请配置OSS_REGION/OSS_BUCKET');
    }

    if (ossClient && hasValidToken) {
        return ossClient;
    }

    try {
        const stsToken = await getValidSTSToken();
        ossClient = new OSS({
            secure: true,
            region: config.ossRegion,
            bucket: config.ossBucket,
            accessKeyId: stsToken.AccessKeyId,
            accessKeySecret: stsToken.AccessKeySecret,
            stsToken: stsToken.SecurityToken,
            refreshSTSToken: async () => {
                const newToken = await refreshSTSToken();
                return {
                    accessKeyId: newToken.AccessKeyId,
                    accessKeySecret: newToken.AccessKeySecret,
                    stsToken: newToken.SecurityToken
                };
            },
            refreshSTSTokenInterval: 300 * 1000
        });

        return ossClient;
    } catch (err) {
        throw new Error('连接 OSS 失败，请检查内部错误信息', { cause: err });
    }
}

export { getOssClient };
