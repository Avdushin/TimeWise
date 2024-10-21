import { AdminPaths, PathsDashboard } from "@/Components/App/Routing";
import {
  IconHome2,
  IconUser,
  IconSettings,
  IconTestPipe,
  IconChessKing,
} from "@tabler/icons-react";

export const BarItems = [
  { icon: IconHome2, label: "Главная", href: PathsDashboard.Main },
  {
    icon: IconChessKing,
    label: "Панель администратора",
    href: AdminPaths.Panel,
    adminOnly: true,
  },
  { icon: IconTestPipe, label: "Тестирование", href: PathsDashboard.Tests },
  { icon: IconUser, label: "Аккаунт", href: PathsDashboard.Account },
  { icon: IconSettings, label: "Настройки", href: PathsDashboard.Settings },
];
