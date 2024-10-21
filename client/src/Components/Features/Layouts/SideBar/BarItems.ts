import { AdminPaths, PathsDashboard } from "@/Components/App/Routing";
import {
  IconHome2,
  IconUser,
  IconSettings,
  IconChessKing,
  IconList,
  IconCalendarPin
} from "@tabler/icons-react";

export const BarItems = [
  { icon: IconHome2, label: "Главная", href: PathsDashboard.Main },
  {
    icon: IconChessKing,
    label: "Панель администратора",
    href: AdminPaths.Panel,
    adminOnly: true,
  },
  { icon: IconCalendarPin, label: "Календарь", href: PathsDashboard.Calendar },
  { icon: IconList, label: "Список дел", href: PathsDashboard.Tasks },
  { icon: IconUser, label: "Аккаунт", href: PathsDashboard.Account },
  { icon: IconSettings, label: "Настройки", href: PathsDashboard.Settings },
];
