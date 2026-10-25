import asyncHandler from 'express-async-handler';
import { getOssMdFiles } from '../../utils/oss/oss.md.js';

// @desc     GET repository files
// @route1   GET /api/data/md/computer-related
// @oss1     /articles/computer-catalogue-repository/
// @route2   GET /api/data/md/eightpart
// @oss2     /articles/eightpart-essay-catalogue-repository/
// @route3   GET /api/data/md/chemistry-related
// @oss3     /articles/chemistry-catalogue-repository/
// @route4   GET /api/data/md/language-related
// @oss4     /articles/language-catalogue-repository/
// @access   Public
export const mdFilesController = asyncHandler(async (req, res) => {
    const { routeId, secondRouteId } = req.params;

    const directories = {
        'computer-related': 'computer-catalogue-repository',
        eightpart: 'eightpart-essay-catalogue-repository',
        'chemistry-related': 'chemistry-catalogue-repository',
        'language-related': 'language-catalogue-repository'
    };
    const first = Object.hasOwn(directories, routeId) && directories[routeId];
    if (!first) {
        return res.status(404).json({ message: 'Unknown repository category.' });
    }
    let second = secondRouteId;
    if (routeId === 'eightpart' && second) second = second.toLowerCase();
    if (routeId === 'computer-related' && second === 'js') second = 'javascript';
    if (second && !/^[a-zA-Z0-9_-]+$/.test(second)) {
        return res.status(400).json({ message: 'Invalid repository subcategory.' });
    }
    const url = `articles/${first}/${second ? `${second}/` : ''}`;

    try {
        const info = await getOssMdFiles(url);
        res.status(200).json(info);
    } catch (error) {
        // SDK error messages can contain signed URLs; log diagnostic fields only.
        const causes = [];
        for (let cause = error; cause; cause = cause.cause) {
            causes.push({ name: cause.name, code: cause.code, status: cause.status, requestId: cause.requestId });
        }
        console.error('Failed to fetch Markdown from OSS', { prefix: url, causes });
        res.status(502).json({ message: 'Failed to fetch Markdown files from OSS.' });
    }
});
