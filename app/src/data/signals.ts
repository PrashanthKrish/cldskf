// Raw, unprocessed synthetic signals — the input feed to the agent pipeline.
// Each mirrors the `external_signal` entity named in the source spec: raw
// bilingual text as it would arrive from a monitored source, before any
// scoring, classification or entity resolution has run.
export interface RawSignal {
  id: string;
  sourceId: string;
  title: string;
  titleCn: string;
  body: string;
  publishedAt: string; // ISO date
  estValueSEK: number;
}

export const RAW_SIGNALS: RawSignal[] = [
  {
    id: "SIG-1042",
    sourceId: "ndrc",
    title: "Zhejiang provincial equipment-renewal subsidy catalogue — Q3 batch",
    titleCn: "浙江省设备更新补贴目录（第三批）",
    body: "Zhejiang Hengli Machinery has been listed in the third-batch equipment renewal subsidy catalogue for CNC and metal-forming line retrofits. 浙江恒力机械被列入第三批设备更新补贴目录，涉及数控机床与金属成型产线改造项目。Subsidy covers up to 15% of qualifying equipment spend.",
    publishedAt: "2026-08-11",
    estValueSEK: 4200000,
  },
  {
    id: "SIG-1041",
    sourceId: "miit",
    title: "Leaderdrive humanoid JV supplier qualification RFI",
    titleCn: "乐动机器人合资供应商资质预审",
    body: "The Leaderdrive humanoid robotics joint venture has opened a supplier qualification RFI ahead of production start. 乐动机器人合资企业发布供应商资质预审公告，涉及人形机器人关节模组与执行器部件。Component count exceeds 120 bearings per unit across joint modules and actuators.",
    publishedAt: "2026-08-10",
    estValueSEK: 9800000,
  },
  {
    id: "SIG-1039",
    sourceId: "tender",
    title: "Jiangsu wind-repowering tender — 48 turbine gearbox refit",
    titleCn: "江苏风电改造招标（48台机组齿轮箱）",
    body: "China Longyuan Power has issued a public tender for gearbox and main-shaft bearing refit across 48 wind turbines under its Jiangsu repowering programme. 中国龙源电力发布江苏风电改造招标公告，涉及48台机组齿轮箱及主轴轴承更换。",
    publishedAt: "2026-08-09",
    estValueSEK: 6100000,
  },
  {
    id: "SIG-1035",
    sourceId: "ndrc",
    title: "Guangdong NDRC capacity-expansion filing — EV motor plant",
    titleCn: "广东新能源电机厂扩产公告",
    body: "Guangdong Fulin Auto Parts filed a capacity-expansion notice with the provincial NDRC for a new EV motor and powertrain plant. 广东富林汽车零部件向省发改委备案新能源电机厂扩产项目，涉及动力总成产线建设。",
    publishedAt: "2026-08-07",
    estValueSEK: 2300000,
  },
  {
    id: "SIG-1030",
    sourceId: "assoc",
    title: "Shandong robotics industry fund announcement",
    titleCn: "山东省机器人产业基金公告",
    body: "The Shandong robotics industry association announced a new provincial fund targeting automation and humanoid component suppliers, early-stage with specification still to be determined. 山东省机器人协会公告设立产业基金，聚焦自动化与人形机器人零部件供应商，规格尚待明确。",
    publishedAt: "2026-08-05",
    estValueSEK: 1500000,
  },
  {
    id: "SIG-1027",
    sourceId: "press",
    title: "Anhui textile-machinery OEM new product launch",
    titleCn: "安徽纺织机械新产品发布",
    body: "Anhui Textile Machinery Corp launched a new standard textile machinery product line using catalogue-standard components. 安徽纺织机械集团发布新产品线，采用标准目录零部件，无特殊规格要求。",
    publishedAt: "2026-08-02",
    estValueSEK: 320000,
  },
  {
    id: "SIG-1051",
    sourceId: "tender",
    title: "Shandong offshore wind main-bearing replacement programme",
    titleCn: "山东海上风电主轴承更换计划",
    body: "Shandong Ocean Wind Equipment issued a tender for main-bearing replacement across its offshore turbine fleet ahead of the next repowering cycle. 山东海洋风电装备发布海上机组主轴承更换招标，为下一轮改造周期做准备。齿轮箱同步升级。",
    publishedAt: "2026-08-13",
    estValueSEK: 5400000,
  },
  {
    id: "SIG-1055",
    sourceId: "miit",
    title: "Suzhou smart-factory designation — CNC retrofit line",
    titleCn: "苏州智能工厂认定——数控改造产线",
    body: "Suzhou Jinfeng Precision received MIIT smart-factory designation for a CNC retrofit and equipment renewal line, eligible for provincial subsidy. 苏州金峰精密获工信部智能工厂认定，涉及数控改造与设备更新产线，符合省级补贴条件。",
    publishedAt: "2026-08-14",
    estValueSEK: 3100000,
  },
];
