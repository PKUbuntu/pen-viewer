# shadcn/ui 组件映射

本文档记录 `pencil-new.pen` 中的组件与 shadcn/ui 组件的对应关系。

## shadcn/ui 组件列表

共 **58+** 个组件：

| 组件 | .pen 文件对应 | 说明 |
|------|---------------|------|
| **Accordion** | `Accordion/Open`, `Accordion Trigger`, `Accordion Content` | 手风琴折叠面板 |
| **Alert** | `Alert/Default`, `Alert Title`, `Alert Description` | 警告提示 |
| **Alert Dialog** | - | 确认对话框 |
| **Aspect Ratio** | - | 固定宽高比容器 |
| **Avatar** | `Avatar/Image`, `Avatar/Text`, `Avatar Title` | 用户头像 |
| **Badge** | `Badge`, `Badge/Default`, `Badge/Destructive`, `Badge/Outline`, `Badge/Secondary` | 标签徽章 |
| **Breadcrumb** | `Breadcrumb Item`, `Breadcrumb Item/Current`, `Breadcrumb Item/Default`, `Breadcrumb Item/Ellipsis`, `Breadcrumb Item/Separator` | 面包屑导航 |
| **Button** | `Button`, `Button/Default`, `Button/Destructive`, `Button/Ghost`, `Button/Outline`, `Button/Secondary` | 按钮 |
| **Button Group** | - | 按钮组 |
| **Calendar** | - | 日历 |
| **Card** | `Card`, `Card Action`, `Card Actions`, `Card Content`, `Card Header`, `Card Image`, `Card Plain` | 卡片 |
| **Carousel** | - | 轮播图 |
| **Chart** | - | 图表 |
| **Checkbox** | `Checkbox`, `Checkbox/Checked` | 复选框 |
| **Collapsible** | - | 可折叠容器 |
| **Combobox** | `Combobox/Default` | 组合框 |
| **Command** | - | 命令面板 |
| **Context Menu** | - | 右键菜单 |
| **Data Table** | `Data Table`, `Data Table Content`, `Data Table Footer`, `Data Table Header` | 数据表格 |
| **Date Picker** | - | 日期选择器 |
| **Dialog** | `Dialog`, `Dialog Description`, `Dialog Title` | 对话框 |
| **Direction** | - | 方向控制 |
| **Drawer** | - | 抽屉 |
| **Dropdown Menu** | `Dropdown` | 下拉菜单 |
| **Empty** | - | 空状态 |
| **Field** | - | 表单字段 |
| **Hover Card** | - | 悬停卡片 |
| **Input** | `Input`, `Input/Default`, `Input/Filled` | 输入框 |
| **Input Group** | `Input Group/Default`, `Input Group/Filled` | 输入框组 |
| **Input OTP** | `Input OTP`, `Input OTP Container`, `Input OTP Divider`, `Input OTP Group/Default`, `Input OTP Group/Filled` | OTP 输入框 |
| **Item** | `Item Content Left`, `Item Content Right` | 列表项 |
| **Kbd** | - | 键盘按键 |
| **Label** | `Label`, `Label Selected`, `Label Text` | 标签 |
| **Menubar** | - | 菜单栏 |
| **Native Select** | - | 原生选择框 |
| **Navigation Menu** | - | 导航菜单 |
| **Pagination** | `Pagination`, `Pagination Item/Active`, `Pagination Item/Default`, `Pagination Item/Ellipsis` | 分页 |
| **Popover** | - | 弹出框 |
| **Progress** | `Progress` | 进度条 |
| **Radio Group** | `Radio`, `Radio/Selected`, `Radio/Unselected` | 单选框组 |
| **Resizable** | - | 可调整大小 |
| **Scroll Area** | - | 滚动区域 |
| **Select** | `Select Group/Default`, `Select Group/Filled`, `Select option`, `Select Trigger` | 选择框 |
| **Separator** | - | 分隔线 |
| **Sheet** | - | 侧边抽屉 |
| **Sidebar** | `Sidebar`, `Sidebar Content`, `Sidebar Footer`, `Sidebar Header`, `Sidebar Item/Active`, `Sidebar Item/Default`, `Sidebar Section Title` | 侧边栏 |
| **Skeleton** | - | 骨架屏 |
| **Slider** | - | 滑块 |
| **Sonner** | - | Toast 通知 |
| **Spinner** | - | 加载动画 |
| **Switch** | `Switch`, `Switch/Checked`, `Switch/Unchecked`, `Switch Label` | 开关 |
| **Table** | `Table`, `Table Cell`, `Table Column Header`, `Table Row` | 表格 |
| **Tabs** | `Tabs`, `Tab Item/Active`, `Tab Item/Inactive` | 标签页 |
| **Textarea** | `Textarea`, `Textarea Group/Default`, `Textarea Group/Filled` | 文本域 |
| **Toast** | - | 轻提示 |
| **Toggle** | - | 切换按钮 |
| **Toggle Group** | - | 切换按钮组 |
| **Tooltip** | `Tooltip`, `Tooltip Text` | 工具提示 |
| **Typography** | - | 排版 |

## 特殊组件

### 设计变体命名规则

`.pen` 文件中的组件命名遵循 shadcn 的变体规则：

```
ComponentName/Variant

例如：
- Button/Default      → 默认按钮
- Button/Destructive  → 危险按钮
- Button/Ghost        → 幽灵按钮
- Button/Outline      → 描边按钮
- Button/Secondary    → 次要按钮
```

### 尺寸变体

```
Button/Large/Default      → 大号默认按钮
Button/Large/Destructive  → 大号危险按钮
```

### 状态变体

```
Checkbox/Checked    → 选中状态
Checkbox/Unchecked  → 未选中状态
Switch/Checked      → 开启状态
Switch/Unchecked    → 关闭状态
```

## 主题变量映射

shadcn 的 CSS 变量与 `.pen` 变量对应：

| CSS 变量 | .pen 变量 | Light 模式 | Dark 模式 |
|----------|-----------|------------|-----------|
| `--background` | `$--background` | `#fafafa` | `#0a0a0a` |
| `--foreground` | `$--foreground` | `#0a0a0a` | `#fafafa` |
| `--card` | `$--card` | `#fafafa` | `#0a0a0a` |
| `--sidebar` | `$--sidebar` | `#fafafa` | `#18181b` |
| `--sidebar-foreground` | `$--sidebar-foreground` | `#09090b` | `#fafafa` |
| `--border` | `$--border` | `#e4e4e7` | `#27272a` |
| `--primary` | `$--primary` | `#18181b` | `#fafafa` |
| `--secondary` | `$--secondary` | `#f4f4f5` | `#27272a` |
| `--muted` | `$--muted` | `#f4f4f5` | `#27272a` |
| `--accent` | `$--accent` | `#f4f4f4` | `#27272a` |

## 参考

- [shadcn/ui 官方文档](https://ui.shadcn.com/docs/components)
- [shadcn/ui GitHub](https://github.com/shadcn-ui/ui)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)