import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/store/reducer/hooks.ts";

import classes from "./RenderMainContent.module.scss";

import RenderArticles from "../../components/markdown/RenderArticles.jsx";
import Loading from "../../components/feedback/Loading";
import { useMdDataApi } from "../../api/useMdDataApi.js";
import RenderNoneContent from "./RenderNoneContent";

export default function RenderMainContent() {
  const [visibleCount, setVisibleCount] = useState(10);

  const { routeId, secondRouteId } = useParams();

  const hash = secondRouteId.toLowerCase() || "";

  const { data: fileData, isLoad } = useMdDataApi(routeId, hash);

  const { sidebarActive } = useAppSelector((state) => state.dropdownSidebar);

  // 简化 useMemo
  const fileTitleContent = useMemo(
    () =>
      fileData?.map(({ dataInfo, content }) => ({
        titleCh: dataInfo.titleCh,
        key: dataInfo.key,
        fileName: dataInfo.fileName,
        content,
      })) || [],
    [fileData],
  );

  // 自动加载更多
  useEffect(() => {
    if (!fileTitleContent.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < fileTitleContent.length) {
          setVisibleCount((prev) =>
            Math.min(prev + 10, fileTitleContent.length),
          );
        }
      },
      { root: null, threshold: 1 },
    );

    const sentinel = document.getElementById("load-more-sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [visibleCount, fileTitleContent.length]);

  // 滚动到 hash 对应元素
  useEffect(() => {
    if (!hash) return;

    const scrollToHash = () => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    const tryScroll = () => {
      if (!scrollToHash()) {
        requestAnimationFrame(tryScroll);
      }
    };

    tryScroll();
  }, [hash, visibleCount]);

  return (
    <section
      className={`${classes.container} ${sidebarActive ? "" : classes.close}`}
    >
      {isLoad && <Loading />}

      {!isLoad && fileTitleContent.length === 0 && <RenderNoneContent />}

      {fileTitleContent.length > 0 &&
        fileTitleContent.slice(0, visibleCount).map((file) => (
          <RenderArticles
            key={file.key}
            articles={file}
          />
        ))}

      {/* Intersection Observer 触发点 */}
      <div id="load-more-sentinel" />
    </section>
  );
}
