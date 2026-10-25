import { NavLink } from "react-router-dom";
import type { NavigationProps } from "./interface";
import classes from "./index.module.scss";

export default function Navigation({
  NavigationLinks,
  renderDropdown,
}: NavigationProps) {
  return (
    <ul className={classes.ul}>
      {NavigationLinks.map((link) => {
        const menu =
          link.hasDropdown && renderDropdown
            ? renderDropdown(link, classes["dropdown-visibility"])
            : link.extraContent;
        return (
          <li
            key={link.toLink}
            className={classes["nav-list"]}
          >
            <NavLink
              to={link.toLink}
              className={({ isActive }) => (isActive ? classes.active : "")}
            >
              <span>{link.content}</span>
              {menu && (
                <span
                  className={classes.arrow}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M2 4L6 8L10 4" />
                  </svg>
                </span>
              )}
            </NavLink>
            {menu}
          </li>
        );
      })}
    </ul>
  );
}

export { Navigation };
