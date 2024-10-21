import {
  IconBuildingBank,
  IconReceiptRefund,
  IconReceipt,
  IconReceiptTax,
  IconReport,
  IconTestPipe,
  IconSettings,
} from "@tabler/icons-react";
import { AdminPaths, PathsDashboard } from "../App/Routing";

export const links = [
  {
    title: "Тестирования",
    icon: IconTestPipe,
    color: "blue",
    url: PathsDashboard.Tests,
  },
  {
    title: "Личный кабинет",
    icon: IconBuildingBank,
    color: "teal",
    // indigo
    url: PathsDashboard.Account,
  },
  {
    title: "Настройки",
    icon: IconSettings,
    color: "orange",
    url: PathsDashboard.Settings,
  },
  {
    title: "Пользователи",
    icon: IconReceiptRefund,
    color: "green",
    url: AdminPaths.Users,
    adminOnly: true,
  },
  {
    title: "Отделы",
    icon: IconReceipt,
    color: "teal",
    url: AdminPaths.Positions,
    adminOnly: true,
  },
  {
    title: "Список отделов",
    icon: IconReceiptTax,
    color: "cyan",
    url: AdminPaths.ManagePosition,
    adminOnly: true,
  },
  {
    title: "Создать отдел",
    icon: IconReport,
    color: "pink",
    url: AdminPaths.CreatePosition,
    adminOnly: true,
  },
//   {
//     title: "Payments",
//     icon: IconCoin,
//     color: "red",
//     url: PathsDashboard.Tests,
//   },
//   {
//     title: "Cashback",
//     icon: IconCashBanknote,
//     color: "orange",
//     url: PathsDashboard.Tests,
//   },
];
