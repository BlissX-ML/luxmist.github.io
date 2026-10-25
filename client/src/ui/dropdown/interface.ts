export interface DropdownItem {
	to: string;
	title: string;
}

export interface DropdownProps {
	className?: string;
	items: DropdownItem[];
	onSelect?: (item: DropdownItem) => void;
}
