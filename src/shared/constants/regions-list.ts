export interface RegionInfo {
  regionSoato: number;
  name: string;
  /** Shu viloyat uchun generatsiya qilingan login */
  login: string;
  /** Shu viloyat uchun generatsiya qilingan parol (regionSoato ichida) */
  password: string;
}

export const REGIONS: RegionInfo[] = [
  {
    regionSoato: 1735,
    name: "Қорақалпоғистон Респ.",
    login: "qoraqalpogiston",
    password: "QrP#1735LmXa!",
  },
  {
    regionSoato: 1703,
    name: "Андижон вилояти",
    login: "andijon",
    password: "An#1703XpKv!",
  },
  {
    regionSoato: 1706,
    name: "Бухоро вилояти",
    login: "buxoro",
    password: "Bx!1706QmLt@",
  },
  {
    regionSoato: 1708,
    name: "Жиззах вилояти",
    login: "jizzax",
    password: "Jz@1708NrWp#",
  },
  {
    regionSoato: 1710,
    name: "Қашқадарё вилояти",
    login: "qashqadaryo",
    password: "Qs#1710VkHm!",
  },
  {
    regionSoato: 1712,
    name: "Навоий вилояти",
    login: "navoiy",
    password: "Nv@1712PxKr!",
  },
  {
    regionSoato: 1714,
    name: "Наманган вилояти",
    login: "namangan",
    password: "Nm!1714LtQx#",
  },
  {
    regionSoato: 1718,
    name: "Самарқанд вилояти",
    login: "samarqand",
    password: "Sm#1718HvPa!",
  },
  {
    regionSoato: 1722,
    name: "Сурхондарё вилояти",
    login: "surxondaryo",
    password: "Sr@1722KdLm!",
  },
  {
    regionSoato: 1724,
    name: "Сирдарё вилояти",
    login: "sirdaryo",
    password: "Sd!1724QxRt#",
  },
  {
    regionSoato: 1727,
    name: "Тошкент вилояти",
    login: "toshkent_v",
    password: "Tv#1727MnLp@",
  },
  {
    regionSoato: 1730,
    name: "Фарғона вилояти",
    login: "fargona",
    password: "Fg@1730WrKs!",
  },
  {
    regionSoato: 1733,
    name: "Хоразм вилояти",
    login: "xorazm",
    password: "Xz!1733PtHv#",
  },
  {
    regionSoato: 1726,
    name: "Тошкент шаҳар",
    login: "toshkent_sh",
    password: "Ts#1726QvNm!",
  },
];