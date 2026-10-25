import classes from "./NavigationLayout.module.scss";

import Navigation from "@/ui/navigation/index.js";
import { NavigationLinks } from "../constant.js";
import DropdowmMenu from "@/features/shared-dropdown-sidebar/DropdowmMenu.jsx";
import { REPOSITORY_SIDEBAR } from "@/_data/repository/repository.js";

export default function NavigationLayout() {
  return (
    <header className="header">
      <nav className={classes.nav}>
        <img
          alt="BlissXML 个人网站"
          className={classes.logo}
          src="/api/data/images/file?group=profiles&album=logo&file=logo.png"
          decoding="async"
        />

        <Navigation
          NavigationLinks={NavigationLinks}
          renderDropdown={(link, className) => (
            <DropdowmMenu
              className={className}
              catalogs={REPOSITORY_SIDEBAR}
              startUrl={link.toLink}
            />
          )}
        />
        <div className={classes.rNav}></div>
      </nav>
    </header>
  );
}
