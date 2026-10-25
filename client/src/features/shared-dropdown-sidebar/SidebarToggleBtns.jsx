import { useDispatch } from 'react-redux';
import classes from './SidebarToggleBtns.module.scss';

import { useAppSelector } from '../../store/reducer/hooks.ts';
import { setSidebarActive } from '../../store/reducer/dropdownSidebar.js';

import SidebarClose from '../../components/icons/SidebarClose';
import SidebarOpen from '../../components/icons/SidebarOpen';

// 侧边栏切换按钮
export default function SidebarToggleBtns() {
    const dispatch = useDispatch();
    const { sidebarActive } = useAppSelector(state => state.dropdownSidebar);

    return (
        <button
            aria-label="切换侧边栏"
            className={`${classes['toggle-btn']} ${sidebarActive ? '' : classes['close']}`}
            onClick={() => dispatch(setSidebarActive())}
        >
            {sidebarActive ? <SidebarClose /> : <SidebarOpen />}
        </button>
    );
}
