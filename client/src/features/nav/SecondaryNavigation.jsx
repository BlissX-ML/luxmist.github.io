import { useNavigate } from "react-router-dom";
import classes from "./SecondaryNavigation.module.scss";

import NavMenuBtns from "../../components/buttons/NavMenuBtns.jsx";

export default function SecondaryNavigation() {
	const navigate = useNavigate();

	return (
		<div className={classes["seco-nav"]}>
			{/* <NavMenuBtns handleClick={() => navigate("/")}>
                返回介绍页
            </NavMenuBtns> */}
		</div>
	);
}
