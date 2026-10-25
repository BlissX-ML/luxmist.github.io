import { useLocation, useNavigate } from 'react-router-dom';
import classes from './SidebarNavList.module.scss';

import { useAppDispatch, useAppSelector } from '../../store/reducer/hooks.ts';
import {
    openSecondaryItems,
    setCurItem,
    toggleOpenSecondaryItems
} from '../../store/reducer/dropdownSidebar.js';

import scrollToItem from '../../_utils/browser/scroll-into-view.js';
import SidebarList from '../../ui/sidebar/index.tsx';

// 侧边栏导航列表（可复用）
export default function SidebarNavList({ categories, startURL }) {
    const dispatch = useAppDispatch(); // 分派函数（动作）以改变这些变量

    const { curFirstItem, secondaryItemsState } = useAppSelector(
        state => state.dropdownSidebar
    );

    // 处理一级列表状态
    function handleFirstLevelState(item) {
        return curFirstItem === item?.key && secondaryItemsState
            ? classes['active-first-li']
            : '';
    }

    // 处理二级列表状态
    function handleSecondaryLevelState(item) {
        return curFirstItem === item?.key && secondaryItemsState
            ? classes['active-second-ul']
            : '';
    }

    // 处理一级标题点击
    const handleFirstLevelClick = item => {
        // 控制二级菜单的展开与关闭
        if (curFirstItem === item?.key) {
            dispatch(toggleOpenSecondaryItems()); // 切换二级菜单展开状态
        } else {
            dispatch(setCurItem(item?.key)); // 设置当前选中项
            dispatch(openSecondaryItems()); // 打开二级菜单
        }

        // 平滑移动，默认返回顶部，itemId 固定为数组第一个元素
        scrollToItem(item?.detail?.data?.[0]?.fileName);
    };

    // 处理二级标题点击
    const handleSecondaryClick = (e, item) => {
        e.stopPropagation(); // 阻止事件冒泡

        scrollToItem(item?.fileName);
    };

    return (
        <SidebarList
            categories={categories}
            handleFirstLevelState={item => handleFirstLevelState(item)}
            handleSecondaryLevelState={item => handleSecondaryLevelState(item)}
            handleFirstLevelClick={handleFirstLevelClick}
            handleSecondaryLevelClick={handleSecondaryClick}
            startURL={startURL}
        />
    );
}
