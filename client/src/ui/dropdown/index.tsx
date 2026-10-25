import { Link } from "react-router-dom";
import type { DropdownProps } from "./interface";
import classes from "./index.module.scss";

export default function Dropdown({
  items,
  onSelect,
  className = "",
}: DropdownProps) {
  return (
    <div className={`${classes["drop-menu-container"]} ${className}`}>
      <ul className={classes["dropdown-menu"]}>
        {items.map((item) => (
          <Link
            key={item.to}
            className={classes.link}
            to={item.to}
            onClick={() => onSelect?.(item)}
          >
            {item.title}
          </Link>
        ))}
      </ul>
    </div>
  );
}
