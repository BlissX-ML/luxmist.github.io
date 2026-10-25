import RPCClient from '@alicloud/pop-core';

// 模块内维护全局状态
let stsCredentials = null;
let stsExpireAt = 0;

async function getValidSTSToken() {
    // 从环境变量读取配置 + 容错默认值（避免没配环境变量直接挂）
    const config = {
        ramAccessKeyId: process.env.OSS_RAM_ACCESSKEY_ID || '',
        ramAccessKeySecret: process.env.OSS_RAM_ACCESSKEY_SECRET || '',
        stsRoleArn: process.env.OSS_STS_ROLE_ARN || '',
        stsExpireTime: Number(process.env.OSS_STS_EXPIRE_TIME) || 3600, // 默认1小时
        refreshBeforeExpire:
            Number(process.env.OSS_REFRESH_BEFORE_EXPIRE) || 300 // 默认5分钟提前刷新
    };

    // 1. 校验基础配置（必传项）
    if (
        !config.ramAccessKeyId ||
        !config.ramAccessKeySecret ||
        !config.stsRoleArn
    ) {
        throw new Error('STS配置缺失');
    }

    // 2. 判断是否需要刷新（实时获取当前时间）
    const now = Date.now();
    const needRefresh = !stsCredentials || now >= stsExpireAt;
    if (!needRefresh) {
        return stsCredentials;
    }

    // 3. 初始化RPCClient调用阿里云STS API
    const client = new RPCClient({
        accessKeyId: config.ramAccessKeyId,
        accessKeySecret: config.ramAccessKeySecret,
        endpoint: 'https://sts.aliyuncs.com',
        apiVersion: '2015-04-01'
    });

    const params = {
        RoleArn: config.stsRoleArn,
        RoleSessionName: `nodejs-sts-${Date.now()}`, // 会话名加时间戳，避免重复
        DurationSeconds: config.stsExpireTime // 已转数字
    };

    try {
        const response = await client.request('AssumeRole', params);
        const credentials = response.Credentials;

        if (!credentials) {
            throw new Error('获取STS凭证失败，返回结果无Credentials');
        }

        const expireTimeStamp = new Date(credentials.Expiration).getTime(); // Expiration 转成时间戳

        stsCredentials = credentials;
        stsExpireAt = expireTimeStamp - config.refreshBeforeExpire * 1000;

        return credentials;
    } catch (err) {
        stsCredentials = null; // 失败后重置状态，避免下次用错误状态
        stsExpireAt = 0;
        throw new Error('获取 STS 凭证失败', { cause: err });
    }
}

/**
 * 手动强制刷新STS凭证
 */
async function refreshSTSToken() {
    stsCredentials = null;
    stsExpireAt = 0;
    return getValidSTSToken();
}

/**
 * 暴露当前实时状态（每次调用都重新计算，不是固定值）
 */
function getStatus() {
    const now = Date.now();
    return {
        stsExpireAt,
        hasValidToken: !!stsCredentials && now < stsExpireAt
    };
}

export { getValidSTSToken, refreshSTSToken, getStatus };
