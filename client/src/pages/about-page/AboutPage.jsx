import { useState } from "react";
import { ABOUT_ME_INTRODUCTION } from "../../_data/about-page/introduction.js";
import { ABOUT_PROFILE } from "../../_data/about-page/profile.js";
import { usePdfDataApis } from "../../api/usePdfDataApis";
import classes from "./AboutPage.module.scss";

export default function About() {
  const [introduction, ...sections] = ABOUT_ME_INTRODUCTION;
  const { handleDownload } = usePdfDataApis();
  const [isDownloading, setIsDownloading] = useState(false);

  async function downloadResume() {
    setIsDownloading(true);
    try {
      await handleDownload();
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <main
      id="main-content"
      className={classes.about}
    >
      <div className={classes.layout}>
        <article className={classes.intro}>
          <header className={classes.heading}>
            <h1>{introduction.title}</h1>
            <p className={classes.summary}>{introduction.content}</p>
          </header>

          {sections.map((section) => (
            <section
              key={section.key}
              className={classes.section}
            >
              <h2>{section.title}</h2>
              <p>{section.content}</p>
              {section.interests && (
                <ul className={classes.interests}>
                  {section.interests.map((interest) => (
                    <li key={interest}>{interest}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        <aside
          className={classes.profile}
          aria-labelledby="profile-heading"
        >
          <h2 id="profile-heading">基本信息</h2>
          <dl className={classes.facts}>
            {ABOUT_PROFILE.map((item) => (
              <div key={item.id}>
                <dt>{item.title}</dt>
                <dd>{item.content}</dd>
              </div>
            ))}
          </dl>
          <div className={classes.resume}>
            <button
              type="button"
              onClick={downloadResume}
              disabled={isDownloading}
            >
              {isDownloading ? "正在下载…" : "下载简历"}
              <span aria-hidden="true">↓</span>
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
