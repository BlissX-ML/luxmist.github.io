import type { MouseEvent } from "react";

export interface SidebarItem {
	key: string;
	title: string;
	fileName?: string;
}

export interface SidebarCategory extends SidebarItem {
	detail?: { data: SidebarItem[] };
}

export interface SidebarProps {
	categories: SidebarCategory[];
	startURL: string;
	handleFirstLevelState: (item: SidebarCategory) => string;
	handleSecondaryLevelState: (item: SidebarCategory) => string;
	handleFirstLevelClick: (item: SidebarCategory) => void;
	handleSecondaryLevelClick: (event: MouseEvent<HTMLAnchorElement>, item: SidebarItem) => void;
}
