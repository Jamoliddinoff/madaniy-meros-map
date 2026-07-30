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
    password: "Meros_1735#",
  },
  {
    regionSoato: 1703,
    name: "Андижон вилояти",
    login: "andijon",
    password: "Meros_1703#",
  },
  {
    regionSoato: 1706,
    name: "Бухоро вилояти",
    login: "buxoro",
    password: "Meros_1706#",
  },
  {
    regionSoato: 1708,
    name: "Жиззах вилояти",
    login: "jizzax",
    password: "Meros_1708#",
  },
  {
    regionSoato: 1710,
    name: "Қашқадарё вилояти",
    login: "qashqadaryo",
    password: "Meros_1710#",
  },
  {
    regionSoato: 1712,
    name: "Навоий вилояти",
    login: "navoiy",
    password: "Meros_1712#",
  },
  {
    regionSoato: 1714,
    name: "Наманган вилояти",
    login: "namangan",
    password: "Meros_1714#",
  },
  {
    regionSoato: 1718,
    name: "Самарқанд вилояти",
    login: "samarqand",
    password: "Meros_1718#",
  },
  {
    regionSoato: 1722,
    name: "Сурхондарё вилояти",
    login: "surxondaryo",
    password: "Meros_1722#",
  },
  {
    regionSoato: 1724,
    name: "Сирдарё вилояти",
    login: "sirdaryo",
    password: "Meros_1724#",
  },
  {
    regionSoato: 1727,
    name: "Тошкент вилояти",
    login: "toshkent_v",
    password: "Meros_1727#",
  },
  {
    regionSoato: 1730,
    name: "Фарғона вилояти",
    login: "fargona",
    password: "Meros_1730#",
  },
  {
    regionSoato: 1733,
    name: "Хоразм вилояти",
    login: "xorazm",
    password: "Meros_1733#",
  },
  {
    regionSoato: 1726,
    name: "Тошкент шаҳар",
    login: "toshkent_sh",
    password: "Meros_1726#",
  },
];