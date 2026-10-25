import classes from "./SidebarNavigation.module.scss";
import { useAppSelector } from "../../store/reducer/hooks.ts";

import SidebarCatalogs from "../../components/sidebar/SidebarCatalogs.jsx";
import SidebarNavList from "./SidebarNavList.jsx";
import SidebarToggleBtns from "./SidebarToggleBtns.jsx";

// 侧边栏导航
export default function SidebarNavigation({ catalogs, startURL }) {
    // 选中知识库页面的state
    const { sidebarActive } = useAppSelector((state) => state.dropdownSidebar);

    return (
        <aside
            className={`${classes["sidebar"]} ${sidebarActive ? "" : classes["close"]}`}
        >
            {/* 目录 */}
            <SidebarCatalogs />

            {/* 控制侧边栏二级分类是否打开 */}
            <SidebarNavList categories={catalogs} startURL={startURL} />

            {/* 放是否显示的按钮的 */}
            <SidebarToggleBtns />
        </aside>
    );
}
