import { useRef, useState } from 'react';
import classes from './CertificatesList.module.scss';
import { useCarouselStates } from '../../../../store/zustand/carouselZustand.js';
import { useLineCubicBezier } from '../../../../hooks/useLineCubicBezier.jsx';

import ExtendCloseBtn from '../../../../components/icons/ExtendCloseBtn';
import ExtendBtn from '../../../../components/icons/ExtendBtn';
// import { useLazyGetCertificatesImagesQuery } from '../../../../store/reducer/data.webpApiSlice';
import { webpImagesApi } from '../../../../api/useWebpApi';

export default function CertificatesList({ style, datas }) {
    const containerRef = useRef(null);
    const firstCategoryRef = useRef(null);
    const secondCategoryRef = useRef({});
    const [openedCategory, setOpenedCategory] = useState(null); // 控制要打开的元素列表

    // 状态控制
    const { handleCarouselItem } = useCarouselStates();

    // 弧状线可服用组件
    const { lines } = useLineCubicBezier(
        containerRef,
        firstCategoryRef,
        secondCategoryRef,
        openedCategory
    );

    const handleToggle = key => {
        setOpenedCategory(prev => (prev === key ? null : key)); // 点击同一个就关闭
    };

    const collectSecondList = (el, ind) => {
        if (!openedCategory) return;

        const key = `second-${openedCategory}`;

        if (!secondCategoryRef.current[key]) {
            secondCategoryRef.current[key] = [];
        }
        secondCategoryRef.current[key][ind] = el;
    };

    // 处理二级列表的点击 → 控制 carousel 图片滑动
    const handleSecondListBtnClick = async key => {
        const images = await webpImagesApi('certificates', key);
        if (!images) {
            console.error('Failed to fetch images for key:', key);
            return;
        }
        handleCarouselItem(images);
    };

    return (
        <>
            <div className={`${classes.menu} ${style}`} ref={containerRef}>
                {/* 线段 */}
                <svg className={classes.svg}>
                    {lines.map((line, ind) => (
                        <path
                            key={`line-${ind}`}
                            d={line.d}
                            stroke="#ff7300"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                        />
                    ))}
                </svg>

                {/* 第一层 */}
                <ul className={classes['menu-first']}>
                    {datas.map(cert => (
                        <li
                            key={cert?.key}
                            className={classes['first-li']}
                            ref={
                                openedCategory === cert?.key
                                    ? firstCategoryRef
                                    : null
                            }
                        >
                            {/* 当前项目的标题 */}
                            <span>{cert?.title}</span>

                            {/* 控制开关第二层标题的 */}
                            <button onClick={() => handleToggle(cert?.key)}>
                                {openedCategory === cert?.key ? (
                                    <ExtendCloseBtn />
                                ) : (
                                    <ExtendBtn />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* 第二层 */}
                {openedCategory && (
                    <ul className={classes['menu-second']}>
                        {datas
                            .find(el => el?.key === openedCategory)
                            ?.details.map((cert, index) => {
                                return (
                                    <li
                                        key={cert?.key}
                                        className={classes['second-li']}
                                        ref={el => collectSecondList(el, index)}
                                    >
                                        <button
                                            onClick={() => {
                                                handleSecondListBtnClick(
                                                    cert?.key
                                                );
                                            }}
                                        >
                                            {cert?.title}
                                        </button>
                                    </li>
                                );
                            })}
                    </ul>
                )}
            </div>
        </>
    );
}
