import Dropdown from "@/ui/dropdown";
import { useAppDispatch } from "../../store/reducer/hooks.ts";
import {
  openSecondaryItems,
  setSidebarActiveOpen,
  setCurItem,
} from "../../store/reducer/dropdownSidebar.js";
import scrollToItem from "../../_utils/browser/scroll-into-view.js";

export default function DropdowmMenu({
  style = "",
  className = "",
  catalogs,
  startUrl,
}) {
  const dispatch = useAppDispatch();
  const items = catalogs.map((item) => ({
    to: `${startUrl}/${item.key.toLowerCase()}`,
    title: item.title,
  }));

  function handleSelect(selected) {
    const item = catalogs.find(
      (item) => `${startUrl}/${item.key.toLowerCase()}` === selected.to,
    );
    if (!item) return;
    dispatch(setCurItem(item.key));
    dispatch(openSecondaryItems());
    dispatch(setSidebarActiveOpen());
    scrollToItem(item?.detail?.data?.[0]?.fileName);
  }

  return (
    <Dropdown
      items={items}
      onSelect={handleSelect}
      className={`${style} ${className}`}
    />
  );
}
