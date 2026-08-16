// Segment taxonomy for demand-signal classification.
// Keyword weights are used by the NLP relevance agent for lightweight
// term-frequency scoring against each priority growth segment.
export interface Segment {
  id: string;
  name: string;
  nameCn: string;
  priority: number; // 1 (highest) - 4
  bearingIntensity: "Very high" | "High" | "Medium" | "Low";
  description: string;
  keywords: { term: string; weight: number }[];
}

export const SEGMENTS: Segment[] = [
  {
    id: "robotics",
    name: "Humanoid & Industrial Robotics",
    nameCn: "人形与工业机器人",
    priority: 1,
    bearingIntensity: "Very high",
    description:
      "Leaderdrive humanoid JV and the broader Chinese robotics installation base — 120+ bearings per humanoid unit.",
    keywords: [
      { term: "robot", weight: 3 },
      { term: "机器人", weight: 3 },
      { term: "humanoid", weight: 4 },
      { term: "人形", weight: 4 },
      { term: "leaderdrive", weight: 5 },
      { term: "乐动", weight: 5 },
      { term: "actuator", weight: 2 },
      { term: "joint module", weight: 2 },
      { term: "关节模组", weight: 2 },
      { term: "automation", weight: 1 },
    ],
  },
  {
    id: "renewal",
    name: "Equipment Renewal Programme",
    nameCn: "设备更新改造",
    priority: 1,
    bearingIntensity: "High",
    description:
      "National / provincial equipment-renewal subsidy programme targeting CNC and metal-forming capacity upgrades.",
    keywords: [
      { term: "equipment renewal", weight: 4 },
      { term: "设备更新", weight: 4 },
      { term: "subsidy", weight: 2 },
      { term: "补贴", weight: 2 },
      { term: "cnc", weight: 2 },
      { term: "数控", weight: 2 },
      { term: "retrofit", weight: 2 },
      { term: "改造", weight: 2 },
      { term: "ndrc", weight: 3 },
      { term: "发改委", weight: 3 },
    ],
  },
  {
    id: "wind",
    name: "Wind Repowering",
    nameCn: "风电改造",
    priority: 2,
    bearingIntensity: "High",
    description:
      "Turbine gearbox and main-shaft bearing refit tenders across wind-repowering programmes.",
    keywords: [
      { term: "wind", weight: 3 },
      { term: "风电", weight: 3 },
      { term: "turbine", weight: 3 },
      { term: "机组", weight: 3 },
      { term: "gearbox", weight: 3 },
      { term: "齿轮箱", weight: 3 },
      { term: "repowering", weight: 4 },
      { term: "改造项目", weight: 2 },
    ],
  },
  {
    id: "ev",
    name: "EV Powertrain",
    nameCn: "新能源汽车动力总成",
    priority: 2,
    bearingIntensity: "Medium",
    description:
      "EV motor and powertrain capacity expansions — fewer bearings per vehicle, higher spec each.",
    keywords: [
      { term: "ev", weight: 2 },
      { term: "新能源", weight: 2 },
      { term: "motor plant", weight: 3 },
      { term: "电机厂", weight: 3 },
      { term: "powertrain", weight: 3 },
      { term: "动力总成", weight: 3 },
      { term: "capacity expansion", weight: 2 },
      { term: "扩产", weight: 2 },
    ],
  },
  {
    id: "general",
    name: "General Industrial",
    nameCn: "通用工业",
    priority: 4,
    bearingIntensity: "Low",
    description: "Standard catalogue-part demand with no named strategic segment match.",
    keywords: [
      { term: "machinery", weight: 1 },
      { term: "机械", weight: 1 },
      { term: "textile", weight: 1 },
      { term: "纺织", weight: 1 },
      { term: "new product", weight: 1 },
      { term: "新产品", weight: 1 },
    ],
  },
];

export const SOURCE_REGISTRY = [
  {
    id: "miit",
    name: "MIIT Smart-Factory Designation Lists",
    nameCn: "工信部智能工厂名录",
    cadence: "Weekly",
    description:
      "National smart-manufacturing designations — leading indicator for automation & robotics demand.",
    enabled: true,
  },
  {
    id: "ndrc",
    name: "NDRC Equipment-Renewal Filings",
    nameCn: "国家发改委设备更新备案",
    cadence: "Weekly",
    description:
      "Provincial capital-expenditure filings under the national equipment-renewal programme.",
    enabled: true,
  },
  {
    id: "tender",
    name: "Provincial Public Tender Platforms",
    nameCn: "省级公共资源交易平台",
    cadence: "Daily",
    description:
      "Open tenders across 12 priority provinces — wind, rail, metals, machinery.",
    enabled: true,
  },
  {
    id: "assoc",
    name: "Industry Association Releases",
    nameCn: "行业协会公告",
    cadence: "Weekly",
    description:
      "Robotics, EV and wind associations — funding rounds, capacity announcements, JV filings.",
    enabled: true,
  },
  {
    id: "press",
    name: "Trade Press & OEM Newsrooms",
    nameCn: "行业媒体与主机厂新闻室",
    cadence: "Daily",
    description: "New product launches and capacity announcements from OEM newsrooms.",
    enabled: false,
  },
];
