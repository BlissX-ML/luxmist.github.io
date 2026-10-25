import asyncHandler from 'express-async-handler';
import { getOssPdfFiles } from '../../utils/oss/oss.pdf.js';

// @desc     GET resume file and DOWNLOAD it
// @route   GET /api/data/pdf/resume
// @oss     /resume
// @access   Public
export const pdfController = asyncHandler(async (req, res) => {
    const url = 'resume/';

    try {
        const { fileName, content } = await getOssPdfFiles(url);

        res.setHeader('Content-Type', 'application/pdf');

        // ⚡ 中文 / 空格文件名处理
        const encodedFileName = encodeURIComponent(fileName);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="resume.pdf"; filename*=UTF-8''${encodedFileName}`
        );

        res.setHeader('Cache-Control', 'no-store');

        res.send(content); // 直接发送二进制
    } catch (err) {
        console.error('Failed to download resume', {
            code: err.cause?.code || err.code,
            name: err.cause?.name || err.name,
            requestId: err.cause?.requestId || err.requestId
        });
        res.status(500).send('Failed to download PDF');
    }
});
