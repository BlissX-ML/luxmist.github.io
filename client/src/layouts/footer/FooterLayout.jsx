import classes from "./FooterLayout.module.scss";

export default function FooterLayout() {
	return (
		<footer className={classes.footer}>
			<p>
				<span>备案号：辽ICP备2025065720号-3</span>
			</p>
			<p className={classes.para}>
				<span>公安备案号：苏公网安备32110102321818号</span>
			</p>
		</footer>
	);
}
