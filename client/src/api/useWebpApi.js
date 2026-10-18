import { useGetCertificateChartDataQuery } from '../store/reducer/data.webpApiSlice.js';

export async function webpImagesApi(group, album) {
    try {
        const query = new URLSearchParams({ group, album });
        const url = `/api/data/images?${query}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) throw new Error('读取文件失败');
        const content = await res.json();

        // 必须 return，外部才能 await 拿到结果
        return content;
    } catch (err) {
        console.error(err);
        return null; // 出错时返回 null
    }
}

export function useWebpChartApi() {
    const { data, isLoading } = useGetCertificateChartDataQuery();

    return { data, isLoad: isLoading };
}
