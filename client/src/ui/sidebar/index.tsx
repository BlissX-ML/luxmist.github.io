import { Link } from "react-router-dom";
import type { SidebarProps } from "./interface";
import classes from "./index.module.scss";

export default function SidebarList({
	categories, // 侧边栏数据
	handleFirstLevelState, // 处理一级列表状态
	handleSecondaryLevelState, // 处理二级列表状态
	handleFirstLevelClick, // 处理一级标题点击
	handleSecondaryLevelClick, // 处理二级标题点击
	startURL, // 跳转的起始路由
}: SidebarProps) {
	return (
		<ul className={classes["first-ul"]}>
			{categories.map((firstLevel) => (
				<li
					key={firstLevel.key}
					className={`${classes["first-li"]} ${handleFirstLevelState(firstLevel)}`}
				>
					<Link
						className={classes.link}
						to={`${startURL}/${firstLevel.key.toLowerCase()}`}
						onClick={() => handleFirstLevelClick(firstLevel)}
					>
						<div className={classes["title"]}>{firstLevel.title}</div>
					</Link>

					<ul
						className={`${classes["second-ul"]} ${handleSecondaryLevelState(firstLevel)}`}
					>
						{firstLevel.detail?.data.map((secondaryLevel) => (
							<li
								key={secondaryLevel?.key}
								className={classes["second-li"]}
							>
								<Link
									className={classes.link}
									to={`${startURL}/${firstLevel.key.toLowerCase()}/${secondaryLevel.key}`}
									onClick={(e) => handleSecondaryLevelClick(e, secondaryLevel)}
								>
									{secondaryLevel?.title}
								</Link>
							</li>
						))}
					</ul>
				</li>
			))}
		</ul>
	);
}
