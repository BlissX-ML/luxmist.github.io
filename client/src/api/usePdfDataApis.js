export function usePdfDataApis() {
    async function handleDownload() {
        const prefix = 'resume'; // 后端真实地址
        let fileName = 'download.pdf';

        try {
            const res = await fetch(`/api/data/pdf/${prefix}`, { cache: 'no-store' });

            if (!res.ok) throw new Error('下载失败');

            // 从 Content-Disposition header 里获取文件名
            const disposition = res.headers.get('Content-Disposition');
            // Accept both standard UTF-8 headers and the older server format.
            const encodedName = disposition?.match(/filename\*=\s*(?:UTF-8'')?([^;]+)/i);
            if (encodedName) {
                fileName = decodeURIComponent(encodedName[1].trim());
            } else {
                const plainName = disposition?.match(/filename="([^"]+)"/i);
                if (plainName) fileName = plainName[1];
            }

            if (!res.headers.get('Content-Type')?.includes('application/pdf')) {
                throw new Error('下载接口未返回 PDF 文件');
            }

            // 返回 blob
            const blob = await res.blob();

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            // Allow the browser to start downloading before releasing the URL.
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
            console.error(error);
            alert('下载失败，请稍后重试');
        }
    }

    return { handleDownload };
}
