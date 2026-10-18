import { useRef } from 'react';
import classes from './HomeLayout.module.scss';

import CanvasLines from './CanvasLines.jsx';
import HomePageRedirectBtn from '../../features/redirect-page-btns/HomePageRedirectBtn.jsx';
import Table from '../../components/tables/Table.jsx';
import { HOMEPAGE_INTRO } from '../../_data/home/homePage.js';

const redirctHomePageBtns = [
    {
        id: 'schedule-viewing-lookup-btn',
        title: '生活面板查询',
        url: '/dashboard'
    },
    {
        id: 'knowledge-base-lookup-btn',
        title: '知识库查阅',
        url: '/repository'
    },
    {
        id: 'travel-footprints-lookup-btn',
        title: '旅行足迹查阅',
        url: '/footprint'
    },
    {
        id: 'resources-lookup-btn',
        title: '资源共享',
        url: '/resources'
    }
];

export default function HomeLayout() {
    const container = useRef(null);

    return (
        <div className={classes.welcome} ref={container}>
            <CanvasLines containerRef={container} />

            <div className={classes.content}>
                {/* 左侧预留给后续的翻转图片插件。 */}
                <div className={classes.gallery} aria-hidden="true" />

                <section className={classes.intro} aria-labelledby="home-heading">
                    <h1 id="home-heading">欢迎访问我的网站💕</h1>
                    <table className={classes.table}>
                        <tbody>
                            {HOMEPAGE_INTRO.map(el => (
                                <Table th={el.title} td={el.content} key={el.id} />
                            ))}
                        </tbody>
                    </table>
                    <p className={classes.para}>
                        <span>✨不骄不躁戒熬夜，破界跨界闯世界。</span>
                        <span>✨我不相信我无法完成，我知道只是时间的问题。</span>
                    </p>

                    <div className={classes.btns}>
                        {redirctHomePageBtns.map(el => (
                            <HomePageRedirectBtn src={el.url} key={el.id}>
                                {el.title}
                            </HomePageRedirectBtn>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
