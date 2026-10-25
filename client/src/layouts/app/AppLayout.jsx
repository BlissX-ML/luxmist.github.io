import { Outlet } from "react-router-dom";

import NavigationLayout from "./nav/NavigationLayout.jsx";
import FooterLayout from "./footer/FooterLayout.jsx";

export default function AppLayout() {
	return (
		<>
			<NavigationLayout />
			<Outlet />
			<FooterLayout />
		</>
	);
}
