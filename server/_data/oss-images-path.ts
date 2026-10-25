type ImageAlbum = {
	path: string;
	category?: string;
	title?: string;
};
// All paths are relative to images/.
export const IMAGES_PATHS: Record<string, Record<string, ImageAlbum>> = {
	certificates: {
		typescript: {
			path: "certificates/coursera/typescript/",
			category: "线上网课证书",
			title: "learnTypescript",
		},
		"meta-frontend": {
			path: "certificates/coursera/meta-frontend/",
			category: "线上网课证书",
			title: "meta-frontend",
		},
		english: {
			path: "certificates/languages/english/",
			category: "语言证书",
			title: "english",
		},
		japanese: {
			path: "certificates/languages/japanese/",
			category: "语言证书",
			title: "japanese",
		},
	},
	profiles: {
		logo: { path: "profiles/logo/" },
		home: { path: "profiles/home/" },
		avatar: { path: "profiles/avatar/" },
		personal: { path: "profiles/personal/" },
	},
	backgrounds: { home: { path: "backgrounds/home/" } },
};

export function resolveImageAlbum(group: string, album: string) {
	const albums = Object.hasOwn(IMAGES_PATHS, group) ? IMAGES_PATHS[group] : undefined;
	return albums && Object.hasOwn(albums, album) ? albums[album] : undefined;
}

export function getImagePrefix(album: ImageAlbum) {
	return `images/${album.path}`;
}
