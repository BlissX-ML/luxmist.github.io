# 导航组件的分工

- `navigation`：导航链接、选中态、下拉菜单显隐，接收 `NavigationLinks` 和 `renderDropdown`。
- `dropdown`：菜单展示，接收 `items`、`onSelect` 和 `className`。
- `sidebar`：侧边栏列表，接收分类数据、展开状态对应的类名和点击回调。

实际页面的组合入口是 `layouts/app/nav/NavigationLayout.jsx`。
`features/shared-dropdown-sidebar/DropdowmMenu.jsx` 将知识库分类转换成菜单数据，
在 `onSelect` 中更新 Redux，打开侧边栏并选中分类。
`SidebarNavList.jsx` 读取同一份 Redux 状态，再通过 props 控制 UI 列表。

因此 UI 不直接访问 Redux、Zustand 或知识库数据。换一个项目时，由那个项目传入自己的数据与回调。

样式直接复制自原导航、下拉菜单和侧边栏，保留原 DOM 结构与 CSS 规则。
目前仍依赖 React Router，以及 Vite 注入的项目 SCSS 变量和 mixin；
真正发布独立 package 时，还需要整理这些样式依赖、构建入口和 peerDependencies。
