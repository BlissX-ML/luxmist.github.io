import classes from "./Homepage.module.scss";
import Home from "../../layouts/home/Home";
import { useLayoutEffect } from "react";

export default function Homepage() {
	useLayoutEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: "instant" });
	}, []);

	return (
		<main
			id="main-content"
			className={classes.homepage}
		>
			<Home />
		</main>
	);
}
