import type { ReactNode } from "react";

export interface NavigateLinkProps {
	toLink: string;
	content: string;
	hasDropdown?: boolean;
	extraContent?: ReactNode;
}

export interface NavigationProps {
	NavigationLinks: NavigateLinkProps[];
	renderDropdown?: (link: NavigateLinkProps, className: string) => ReactNode;
}
