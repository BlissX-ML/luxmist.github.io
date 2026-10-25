import { Link } from "react-router-dom";
import classes from "./Home.module.scss";
import HomePageRedirectBtn from "../../features/redirect-page-btns/HomePageRedirectBtn.jsx";
import { redirctHomePageBtns } from "./constant.js";
import type { SVGProps } from "react";

const RightArrowIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		width="1em"
		height="1em"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={1.8}
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
		focusable="false"
		style={{ display: "block" }}
		{...props}
	>
		<path d="M4 12h16M13 5l7 7-7 7" />
	</svg>
);

export default function HomeLayout() {
	return (
		<section className={classes.welcome}>
			<div className={classes.card}>
				<div className={classes.cardIntro}>
					<div className={classes.title}>
						<span>Liu / 个人网站</span>
						<h1>
							写代码，
							<br />也<span>记录生活。</span>
						</h1>
						<p>
							你好，欢迎来到我的网站！我是Liu，一名前端开发者。该网站记录着我的成长历程和生活点滴。
						</p>
						<ul>
							<li>✨ 不骄不躁戒熬夜，破界跨界闯世界。</li>
							<li>✨ 我不相信我无法完成，我知道只是时间的问题。</li>
						</ul>
					</div>

					<div className={classes.link}>
						<Link
							to="/repository"
							className={classes.primary}
						>
							阅读我的笔记{" "}
							<span
								aria-hidden="true"
								style={{ fontSize: "0.6rem" }}
							>
								<RightArrowIcon />
							</span>
						</Link>
						<Link
							to="/about"
							className={classes.secondary}
						>
							关于我{" "}
							<span
								aria-hidden="true"
								style={{ fontSize: "0.6rem" }}
							>
								<RightArrowIcon />
							</span>
						</Link>
					</div>
				</div>
				<div className={classes.image}>
					<img
						src="/api/data/images/file?group=profiles&album=home&file=homeImage.jpg"
						alt="河畔旅行留影"
						width={2304}
						height={3456}
						decoding="async"
					/>
				</div>
			</div>
			<nav
				className={classes.btns}
				aria-label="浏览其他栏目"
			>
				{redirctHomePageBtns.map((el) => (
					<HomePageRedirectBtn
						src={el.url}
						key={el.id}
					>
						{el.title}
					</HomePageRedirectBtn>
				))}
			</nav>
		</section>
	);
}
