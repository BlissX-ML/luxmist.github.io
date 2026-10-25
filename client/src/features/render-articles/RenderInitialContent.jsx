import classes from './RenderInitialContent.module.scss';

import { useAppSelector } from '../../store/reducer/hooks.ts';
import NoContent from '../../components/icons/NoContent';

// 这里的 files 是要能够返回文件数量的数据
export default function RenderInitialContent() {
    const { sidebarActive } = useAppSelector(state => state.dropdownSidebar);

    return (
        <>
            <section
                className={`${classes.container} ${sidebarActive ? '' : classes.close}`}
            >
                <div className={classes.content}>
                    <NoContent />
                    <p>请选择左侧目录</p>
                </div>
            </section>
        </>
    );
}
