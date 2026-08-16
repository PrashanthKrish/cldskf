// Synthetic CRM account registry used by the Entity Resolution Agent.
// Mirrors the `prospect` / `customer` entities named in the source spec.
export interface Account {
  id: string;
  name: string;
  nameCn: string;
  tier: 1 | 2 | 3;
  province: string;
  segmentIds: string[];
  aliases: string[]; // alternate spellings/abbreviations used for fuzzy matching
}

export const ACCOUNTS: Account[] = [
  {
    id: "ACC-2201",
    name: "Zhejiang Hengli Machinery",
    nameCn: "浙江恒力机械",
    tier: 2,
    province: "Zhejiang",
    segmentIds: ["renewal", "general"],
    aliases: ["hengli machinery", "恒力机械", "hengli"],
  },
  {
    id: "ACC-2202",
    name: "China Longyuan Power",
    nameCn: "中国龙源电力",
    tier: 1,
    province: "Jiangsu",
    segmentIds: ["wind"],
    aliases: ["longyuan", "龙源电力", "龙源"],
  },
  {
    id: "ACC-2203",
    name: "Guangdong Fulin Auto Parts",
    nameCn: "广东富林汽车零部件",
    tier: 3,
    province: "Guangdong",
    segmentIds: ["ev"],
    aliases: ["fulin auto", "富林汽车", "fulin"],
  },
  {
    id: "ACC-2204",
    name: "Suzhou Jinfeng Precision",
    nameCn: "苏州金峰精密",
    tier: 2,
    province: "Jiangsu",
    segmentIds: ["renewal", "general"],
    aliases: ["jinfeng precision", "金峰精密", "jinfeng"],
  },
  {
    id: "ACC-2205",
    name: "Anhui Textile Machinery Corp",
    nameCn: "安徽纺织机械集团",
    tier: 3,
    province: "Anhui",
    segmentIds: ["general"],
    aliases: ["anhui textile", "安徽纺织", "atmc"],
  },
  {
    id: "ACC-2206",
    name: "Shandong Ocean Wind Equipment",
    nameCn: "山东海洋风电装备",
    tier: 2,
    province: "Shandong",
    segmentIds: ["wind"],
    aliases: ["ocean wind", "海洋风电", "shandong wind"],
  },
];
