import matter from 'gray-matter';
import { getOssClient } from '../../modules/oss/oss.service.js';

// GET获取 markdown 文件内容
export async function getOssMdFiles(prefix) {
    try {
        const client = await getOssClient();
        // Omit delimiter to include Markdown in nested category directories.
        const objects = [];
        let marker;
        do {
            const result = await client.list({ prefix, marker, 'max-keys': 1000 });
            objects.push(...(result.objects || []).filter(obj => /\.md$/i.test(obj.name)));
            marker = result.isTruncated ? result.nextMarker : undefined;
        } while (marker);

        const files = [];
        // Bound parallel downloads to avoid overwhelming OSS for large categories.
        for (let offset = 0; offset < objects.length; offset += 6) {
            const batch = await Promise.all(objects.slice(offset, offset + 6).map(async obj => {
                const res = await client.get(obj.name);

                const fullFileName = obj.name.split('/').pop();

                const fileContent = res.content.toString('utf-8');
                const { data: frontmatter } = matter(fileContent);

                const dataInfo = {
                    key: obj.name,
                    path: obj.name,
                    fileName: fullFileName.replace(/\.md$/i, ''),
                    category: frontmatter?.tags?.[0] || 'Uncategorized',
                    titleEn: frontmatter?.titleEn,
                    titleCh: frontmatter?.titleCh,
                    tags: frontmatter?.tags
                };

                return { dataInfo, content: fileContent };
            }));
            files.push(...batch);
        }

        return files.filter(f => f.dataInfo.fileName !== '' && f.content !== '');
    } catch (error) {
        throw new Error(`Cannot get Markdown files from OSS: ${prefix}`, { cause: error });
    }
}
