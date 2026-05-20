const resources = {
  iron_ore: { name: "铁矿", color: "#b9d9f2" },
  copper_ore: { name: "铜矿", color: "#f0a24a" },
  coal: { name: "煤矿", color: "#6f7780" },
  sand: { name: "沙矿", color: "#d8c89f" },
  iron_ingot: { name: "铁锭", color: "#d7ecff" },
  copper_ingot: { name: "铜锭", color: "#ffbf66" },
  glass: { name: "玻璃", color: "#aeeeff" },
  steel_ingot: { name: "钢锭", color: "#9fc4e7" },
  iron_plate: { name: "铁板", color: "#d7ecff" },
  iron_rod: { name: "铁棒", color: "#d7ecff" },
  copper_plate: { name: "铜板", color: "#ffbf66" },
  copper_rod: { name: "铜棒", color: "#ffbf66" },
  copper_wire: { name: "铜线", color: "#ffd37a" },
  steel_plate: { name: "钢板", color: "#9fc4e7" },
  steel_rod: { name: "钢棒", color: "#9fc4e7" },
  gear: { name: "齿轮", color: "#c9d6df" },
  industrial_frame: { name: "工业框架", color: "#84c7ff" },
  power_unit: { name: "动力组件", color: "#7ef0b2" },
  cable: { name: "线缆", color: "#ffe45c" },
  miner_device: { name: "采矿机设备", color: "#b9d9f2" },
  furnace_device: { name: "熔炉设备", color: "#d7ecff" },
  kiln_device: { name: "高温熔炼炉设备", color: "#9fc4e7" },
  caster_device: { name: "铸造厂设备", color: "#9fc4e7" },
  assembler_device: { name: "组装工厂设备", color: "#7ef0b2" },
  generator_device: { name: "发电机设备", color: "#ffe45c" },
  pole_device: { name: "电杆设备", color: "#ffe45c" },
  warehouse_device: { name: "仓库设备", color: "#73c8ff" },
  mechanical_core: { name: "机械核心", color: "#ffffff" }
};

const nodeTypes = {
  source: { name: "矿源", inputs: 0, outputs: 3, desc: "固定矿藏总量，可分出 3 路接入采矿机" },
  miner: { name: "采矿机", inputs: 1, outputs: 1, desc: "从矿源开采并输出对应矿物" },
  furnace: { name: "熔炉", inputs: 3, outputs: 1, powerIn: true, demand: 8, desc: "基础冶炼节点，可切换冶炼配方" },
  kiln: { name: "高温熔炼炉", inputs: 3, outputs: 1, powerIn: true, demand: 14, desc: "高级冶炼节点，可生产钢锭" },
  caster: { name: "铸造厂", inputs: 1, maxInputs: 4, outputs: 1, powerIn: true, demand: 10, desc: "锭类加工节点，可切换铸造配方" },
  assembler: { name: "组装工厂", inputs: 4, outputs: 1, powerIn: true, demand: 16, desc: "组件与机械核心节点，当前可接入电网" },
  generator: { name: "发电机", inputs: 1, outputs: 0, powerOut: true, powerOutputs: 1, generation: 80, desc: "消耗煤矿并向电网供电" },
  pole: { name: "电杆", inputs: 0, outputs: 0, powerIn: true, powerOut: true, powerOutputs: 3, demand: 0, desc: "电力中继节点，可分出 3 路电力输出" },
  warehouse: { name: "仓库", inputs: 4, outputs: 4, desc: "物流控制中心：单资源、分流、缓冲、中转" },
  adapter_input: { name: "封装输入", inputs: 3, outputs: 3, adapter: true, desc: "组外输入与组内输出的 1:1 直通接口" },
  adapter_output: { name: "封装输出", inputs: 3, outputs: 3, adapter: true, desc: "组内输入与组外输出的 1:1 直通接口" },
  adapter_power: { name: "封装电力", inputs: 0, outputs: 0, powerIn: true, powerOut: true, powerOutputs: 3, adapter: true, demand: 0, desc: "组外供电进入组内，负载按输出汇总" },
  group: { name: "封装分组", inputs: 0, outputs: 0, powerIn: false, powerOut: false, group: true, desc: "由组内封装节点声明输入、输出和电力接口" }
};

const recipes = {
  furnace: [
    { name: "铁锭", inputs: { iron_ore: 2, coal: 1 }, output: "iron_ingot", amount: 1, time: 2.5 },
    { name: "铜锭", inputs: { copper_ore: 2, coal: 1 }, output: "copper_ingot", amount: 1, time: 2.5 },
    { name: "玻璃", inputs: { sand: 2 }, output: "glass", amount: 1, time: 2.4 }
  ],
  kiln: [
    { name: "钢锭", inputs: { iron_ingot: 2, coal: 1 }, output: "steel_ingot", amount: 1, time: 4 }
  ],
  caster: [
    { name: "铁板", inputs: { iron_ingot: 1 }, output: "iron_plate", amount: 2, time: 2 },
    { name: "铁棒", inputs: { iron_ingot: 1 }, output: "iron_rod", amount: 2, time: 2 },
    { name: "铜板", inputs: { copper_ingot: 1 }, output: "copper_plate", amount: 2, time: 2 },
    { name: "铜棒", inputs: { copper_ingot: 1 }, output: "copper_rod", amount: 2, time: 2 },
    { name: "铜线", inputs: { copper_ingot: 1 }, output: "copper_wire", amount: 3, time: 2.2 },
    { name: "钢板", inputs: { steel_ingot: 1 }, output: "steel_plate", amount: 2, time: 2 },
    { name: "钢棒", inputs: { steel_ingot: 1 }, output: "steel_rod", amount: 2, time: 2 }
  ],
  assembler: [
    { name: "齿轮", inputs: { steel_plate: 2, steel_rod: 1 }, output: "gear", amount: 1, time: 4 },
    { name: "工业框架", inputs: { steel_plate: 2, steel_rod: 2 }, output: "industrial_frame", amount: 1, time: 5 },
    { name: "动力组件", inputs: { gear: 1, copper_wire: 2 }, output: "power_unit", amount: 1, time: 5 },
    { name: "线缆", inputs: { copper_wire: 2, glass: 1 }, output: "cable", amount: 1, time: 4 },
    { name: "采矿机设备", inputs: { iron_plate: 2, gear: 1 }, output: "miner_device", amount: 1, time: 4 },
    { name: "熔炉设备", inputs: { iron_plate: 2, iron_rod: 2 }, output: "furnace_device", amount: 1, time: 4 },
    { name: "高温熔炼炉设备", inputs: { steel_plate: 3, industrial_frame: 1 }, output: "kiln_device", amount: 1, time: 4.5 },
    { name: "铸造厂设备", inputs: { steel_plate: 2, gear: 1, industrial_frame: 1 }, output: "caster_device", amount: 1, time: 4.5 },
    { name: "组装工厂设备", inputs: { industrial_frame: 2, power_unit: 1 }, output: "assembler_device", amount: 1, time: 5 },
    { name: "发电机设备", inputs: { industrial_frame: 2, power_unit: 1, cable: 2 }, output: "generator_device", amount: 1, time: 5 },
    { name: "电杆设备", inputs: { iron_rod: 2, cable: 1 }, output: "pole_device", amount: 1, time: 3 },
    { name: "仓库设备", inputs: { iron_plate: 3, iron_rod: 2 }, output: "warehouse_device", amount: 1, time: 4 },
    { name: "机械核心", inputs: { industrial_frame: 3, power_unit: 2, gear: 2, cable: 3 }, output: "mechanical_core", amount: 1, time: 8, requiresPower: true }
  ]
};

let nodeUpgrades = {
  miner: [
    { level: 2, name: "强化钻头", desc: "采矿速度翻倍，缓存明显提升", costs: { iron_plate: 10, gear: 2 }, effects: { miner_rate_multiplier: 2, capacity_multiplier: 2 } },
    { level: 3, name: "动力采掘", desc: "采矿速度大幅提升到四倍", costs: { steel_plate: 15, power_unit: 2 }, effects: { miner_rate_multiplier: 2, capacity_multiplier: 2 } }
  ],
  furnace: [
    { level: 2, name: "强化炉膛", desc: "生产速度和缓存大幅提升", costs: { iron_plate: 12, iron_rod: 8, coal: 20 }, effects: { speed_multiplier: 1.8, capacity_multiplier: 2, power_demand_multiplier: 1.2 } },
    { level: 3, name: "多口进料", desc: "生产速度提升到约三倍并开放第 4 输入口", costs: { steel_plate: 15, glass: 8, power_unit: 1 }, effects: { speed_multiplier: 1.78, capacity_multiplier: 2, input_ports: 4, power_demand_multiplier: 1.35 } }
  ],
  kiln: [
    { level: 2, name: "耐热内衬", desc: "高温冶炼速度和缓存大幅提升", costs: { steel_plate: 18, steel_rod: 10, glass: 10 }, effects: { speed_multiplier: 1.8, capacity_multiplier: 2, power_demand_multiplier: 1.2 } },
    { level: 3, name: "高压炉控", desc: "高温冶炼速度提升到约三倍并开放第 4 输入口", costs: { industrial_frame: 4, power_unit: 2, cable: 6 }, effects: { speed_multiplier: 1.78, capacity_multiplier: 2, input_ports: 4, power_demand_multiplier: 1.35 } }
  ],
  caster: [
    { level: 2, name: "高速模具", desc: "铸造速度和缓存大幅提升", costs: { steel_plate: 14, gear: 4, copper_wire: 12 }, effects: { speed_multiplier: 1.8, capacity_multiplier: 2, power_demand_multiplier: 1.2 } },
    { level: 3, name: "自动换模", desc: "铸造速度提升到三倍", costs: { industrial_frame: 3, power_unit: 2, cable: 6 }, effects: { speed_multiplier: 1.67, capacity_multiplier: 2, power_demand_multiplier: 1.35 } }
  ],
  assembler: [
    { level: 2, name: "机械臂阵列", desc: "组装速度和缓存明显提升", costs: { industrial_frame: 3, gear: 6, copper_wire: 16 }, effects: { speed_multiplier: 1.6, capacity_multiplier: 2, power_demand_multiplier: 1.2 } },
    { level: 3, name: "同步控制台", desc: "组装速度提升到约三倍", costs: { industrial_frame: 5, power_unit: 3, cable: 10 }, effects: { speed_multiplier: 1.75, capacity_multiplier: 2, power_demand_multiplier: 1.35 } }
  ],
  warehouse: [
    { level: 2, name: "扩建货架", desc: "仓库容量提升到三倍", costs: { iron_plate: 15, iron_rod: 10 }, effects: { capacity_multiplier: 3 } },
    { level: 3, name: "钢制仓储区", desc: "仓库容量提升到八倍", costs: { steel_plate: 20, industrial_frame: 2 }, effects: { capacity_multiplier: 2.67 } }
  ],
  generator: [
    { level: 2, name: "强化线圈", desc: "发电量和燃料缓存大幅提升", costs: { copper_wire: 20, steel_plate: 15, cable: 5 }, effects: { generation_multiplier: 1.8, capacity_multiplier: 2 } },
    { level: 3, name: "高效涡轮", desc: "发电量提升到三倍", costs: { power_unit: 3, industrial_frame: 3, cable: 10 }, effects: { generation_multiplier: 1.67, capacity_multiplier: 2 } }
  ],
  pole: [
    { level: 2, name: "加粗导线", desc: "电杆输出口提升到 4 路", costs: { iron_rod: 8, copper_wire: 12 }, effects: { power_outputs: 4 } },
    { level: 3, name: "分配母线", desc: "电杆输出口提升到 5 路", costs: { steel_rod: 8, cable: 6 }, effects: { power_outputs: 5 } }
  ],
  adapter_input: [
    { level: 2, name: "接口加固", desc: "封装接口缓存翻倍", costs: { industrial_frame: 1, copper_wire: 8 }, effects: { capacity_multiplier: 2 } },
    { level: 3, name: "高速接口", desc: "封装接口缓存提升到四倍", costs: { industrial_frame: 2, cable: 6 }, effects: { capacity_multiplier: 2 } }
  ],
  adapter_output: [
    { level: 2, name: "接口加固", desc: "封装接口缓存翻倍", costs: { industrial_frame: 1, copper_wire: 8 }, effects: { capacity_multiplier: 2 } },
    { level: 3, name: "高速接口", desc: "封装接口缓存提升到四倍", costs: { industrial_frame: 2, cable: 6 }, effects: { capacity_multiplier: 2 } }
  ],
  adapter_power: [
    { level: 2, name: "电力接口加固", desc: "封装电力输出口提升到 4 路", costs: { industrial_frame: 1, copper_wire: 8, cable: 2 }, effects: { power_outputs: 4 } },
    { level: 3, name: "电力接口母线", desc: "封装电力输出口提升到 5 路", costs: { industrial_frame: 2, power_unit: 1, cable: 6 }, effects: { power_outputs: 5 } }
  ]
};

const LOGISTICS_LINE_LEVELS = {
  1: { name: "基础物流线", color: "#3ee37b", rate: 5, speed: 130, packetLimit: 12, width: 2.2, packetRadius: 4.4, costs: {} },
  2: { name: "强化物流线", color: "#4aa8ff", rate: 8, speed: 170, packetLimit: 18, width: 3.1, packetRadius: 4.9, costs: { iron_rod: 10, copper_wire: 12 } },
  3: { name: "高速物流线", color: "#b46cff", rate: 12, speed: 220, packetLimit: 26, width: 3.8, packetRadius: 5.3, costs: { steel_rod: 12, cable: 8, gear: 4 } },
  4: { name: "重载物流线", color: "#ff4f64", rate: 18, speed: 280, packetLimit: 36, width: 4.6, packetRadius: 5.8, costs: { steel_plate: 20, power_unit: 2, cable: 12 } }
};

const DEFAULT_OUTPUT_PORT_RATE = 5;

let RECIPE_INPUT_BUFFER_BATCHES = 18;
let SOURCE_RESERVE_MAX = 50000;
let MINER_OUTPUT_PER_SECOND = 1 / 1.2;
let DEVICE_CAPACITY = 180;
let WAREHOUSE_CAPACITY = 1000;
let POWER_WARN_LOAD = 60;
let POWER_DANGER_LOAD = 80;
let POWER_OVERLOAD_LOAD = 100;
let LOGISTICS_PACKET_LIMIT = 10;
let LOGISTICS_WARN_PACKETS = 7;
let LOGISTICS_WARN_EFFICIENCY = 80;
let LOGISTICS_DANGER_EFFICIENCY = 50;
let LOGISTICS_PACKET_SPACING = 18;
let ADAPTER_PORT_CAPACITY = 1;
const SAVE_INDEX_KEY = "factory-save-slots-v1";
const LEGACY_SAVE_KEY = "factory-save-v1";

const state = {
  nodes: [],
  links: [],
  powerLinks: [],
  selectedId: null,
  selectedIds: [],
  selectedLinkId: null,
  selectedLinkType: null,
  dragLink: null,
  selectionBox: null,
  connectMode: "logistics",
  showLogistics: true,
  showPower: true,
  lineView: "all",
  alertFilter: "all",
  goalHighlight: { kind: null, until: 0 },
  lastMonitorRender: 0,
  lastInspectorRender: 0,
  lastGroupClick: { id: null, at: 0 },
  pointer: { x: 0, y: 0 },
  viewport: { x: 0, y: 0, scale: 1 },
  activeGroupId: null,
  lastTime: performance.now(),
  totalThroughput: 0,
  logisticsHistory: [],
  logisticsPeak: 0,
  power: { generation: 0, demand: 0, load: 0, overload: false },
  cableStock: 12,
  completed: false,
  claimedGoalRewards: {},
  completedGoalSteps: {},
  productionStats: {},
  inventory: {
    miner: 5,
    furnace: 5,
    kiln: 5,
    caster: 5,
    assembler: 5,
    generator: 1,
    pole: 4,
    warehouse: 5,
    adapter_input: 3,
    adapter_output: 3,
    adapter_power: 2
  }
};

let nextId = 1;

const canvas = document.querySelector("#canvas");
const nodesLayer = document.querySelector("#nodes");
const linksLayer = document.querySelector("#links");
const inspector = document.querySelector("#inspector-content");
const resourceOverview = document.querySelector("#resource-overview");
const powerOverview = document.querySelector("#power-overview");
const logisticsOverview = document.querySelector("#logistics-overview");
const alertsPanel = document.querySelector("#alerts");
const goalPanel = document.querySelector("#goal-panel");
const missionStrip = document.querySelector("#mission-strip");
const statusLine = document.querySelector("#status");
const deleteSelectedLinkButton = document.querySelector("#delete-selected-link");
const warehouseDialog = document.querySelector("#warehouse-dialog");
const saveDialog = document.querySelector("#save-dialog");
const saveDialogTitle = document.querySelector("#save-dialog-title");
const saveDialogSubtitle = document.querySelector("#save-dialog-subtitle");
const saveSlotList = document.querySelector("#save-slot-list");
const saveNameInput = document.querySelector("#save-name-input");
const recipeDialog = document.querySelector("#recipe-dialog");
const recipeDialogContent = document.querySelector("#recipe-dialog-content");
const recipeDialogSubtitle = document.querySelector("#recipe-dialog-subtitle");
const goalRewardDialog = document.querySelector("#goal-reward-dialog");
const goalRewardTitle = document.querySelector("#goal-reward-title");
const goalRewardBody = document.querySelector("#goal-reward-body");
const closeGoalRewardButton = document.querySelector("#close-goal-reward");
const upgradeDialog = document.querySelector("#upgrade-dialog");
const upgradeDialogTitle = document.querySelector("#upgrade-dialog-title");
const upgradeDialogSubtitle = document.querySelector("#upgrade-dialog-subtitle");
const upgradeDialogBody = document.querySelector("#upgrade-dialog-body");
const upgradeDialogConfirm = document.querySelector("#confirm-upgrade-dialog");
const upgradeDialogCancel = document.querySelector("#cancel-upgrade-dialog");
const gmDialog = document.querySelector("#gm-dialog");
const gmCategorySelect = document.querySelector("#gm-category");
const gmResourceSelect = document.querySelector("#gm-resource");
const gmAmountInput = document.querySelector("#gm-amount");
const gmLog = document.querySelector("#gm-log");
const gmResourcePreview = document.querySelector("#gm-resource-preview");
const appShell = document.querySelector(".app");
const loginScreen = document.querySelector("#login-screen");
const mainMenuScreen = document.querySelector("#main-menu-screen");
const rulesScreen = document.querySelector("#rules-screen");
const loginForm = document.querySelector(".login-card");
const loginUser = document.querySelector("#login-user");
const loginPassword = document.querySelector("#login-password");
const loginError = document.querySelector("#login-error");
const menuCanvases = [...document.querySelectorAll("[data-menu-canvas]")];

let saveDialogMode = "save";

function defaultInventory() {
  return {
    miner: 5,
    furnace: 5,
    kiln: 5,
    caster: 5,
    assembler: 5,
    generator: 1,
    pole: 4,
    warehouse: 5,
    adapter_input: 3,
    adapter_output: 3,
    adapter_power: 2
  };
}

function showScreen(screenName) {
  loginScreen?.classList.toggle("hidden", screenName !== "login");
  mainMenuScreen?.classList.toggle("hidden", screenName !== "menu");
  rulesScreen?.classList.toggle("hidden", screenName !== "rules");
  appShell?.classList.toggle("is-hidden", screenName !== "game");
  document.body.dataset.screen = screenName;
}

function closeOpenDialogs() {
  [saveDialog, recipeDialog, goalRewardDialog, upgradeDialog, warehouseDialog, gmDialog].forEach((dialog) => {
    if (dialog?.open) dialog.close();
  });
}

function resetGameState() {
  closeOpenDialogs();
  state.nodes = [];
  state.links = [];
  state.powerLinks = [];
  state.selectedId = null;
  state.selectedIds = [];
  state.selectedLinkId = null;
  state.selectedLinkType = null;
  state.dragLink = null;
  state.selectionBox = null;
  state.connectMode = "logistics";
  state.showLogistics = true;
  state.showPower = true;
  state.lineView = "all";
  state.alertFilter = "all";
  state.lastMonitorRender = 0;
  state.lastInspectorRender = 0;
  state.lastGroupClick = { id: null, at: 0 };
  state.pointer = { x: 0, y: 0 };
  state.viewport = { x: 0, y: 0, scale: 1 };
  state.activeGroupId = null;
  state.lastTime = performance.now();
  state.totalThroughput = 0;
  state.logisticsHistory = [];
  state.logisticsPeak = 0;
  state.power = { generation: 0, demand: 0, load: 0, overload: false };
  state.cableStock = 12;
  state.completed = false;
  state.claimedGoalRewards = {};
  state.completedGoalSteps = {};
  state.productionStats = {};
  state.inventory = defaultInventory();
  nextId = 1;
  document.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("active", item.dataset.mode === "logistics"));
  document.querySelector("#show-all-lines")?.classList.add("active");
  const firstDeviceTab = document.querySelector("[data-device-tab]");
  if (firstDeviceTab) setDeviceTab(firstDeviceTab.dataset.deviceTab);
}

function enterGame() {
  showScreen("game");
  render();
}

function startNewGame() {
  resetGameState();
  enterGame();
  setStatus("新游戏开始：从底部菜单创建矿源、采矿机和仓库，搭建第一条产线。", "ok");
}

const menuFactoryZones = [
  { title: "RAW MATERIALS", x: 50, y: 58, w: 440, h: 642 },
  { title: "SMELTING HALL", x: 560, y: 58, w: 430, h: 642 },
  { title: "FABRICATION", x: 1060, y: 58, w: 430, h: 642 },
  { title: "ASSEMBLY / STORAGE", x: 1560, y: 58, w: 430, h: 642 },
  { title: "POWER BUS", x: 50, y: 735, w: 1940, h: 130 }
];

const menuFactoryNodes = [
  { id: "ironSourceA", label: "铁矿源 A", sub: "50K", x: 80, y: 110, w: 120, h: 50, color: "#b9d9f2" },
  { id: "ironSourceB", label: "铁矿源 B", sub: "50K", x: 80, y: 210, w: 120, h: 50, color: "#b9d9f2" },
  { id: "copperSource", label: "铜矿源", sub: "50K", x: 80, y: 340, w: 120, h: 50, color: "#f0a24a" },
  { id: "coalSource", label: "煤矿源", sub: "50K", x: 80, y: 470, w: 120, h: 50, color: "#6f7780" },
  { id: "sandSource", label: "砂矿源", sub: "50K", x: 80, y: 600, w: 120, h: 50, color: "#d8c89f" },
  { id: "ironMinerA", label: "采矿机", sub: "铁矿", x: 285, y: 100, w: 116, h: 54, color: "#73c8ff" },
  { id: "ironMinerB", label: "采矿机", sub: "铁矿", x: 285, y: 200, w: 116, h: 54, color: "#73c8ff" },
  { id: "copperMiner", label: "采矿机", sub: "铜矿", x: 285, y: 330, w: 116, h: 54, color: "#73c8ff" },
  { id: "coalMiner", label: "采矿机", sub: "煤矿", x: 285, y: 460, w: 116, h: 54, color: "#73c8ff" },
  { id: "sandMiner", label: "采矿机", sub: "砂矿", x: 285, y: 590, w: 116, h: 54, color: "#73c8ff" },
  { id: "ironBuffer", label: "原矿仓", sub: "铁矿汇流", x: 590, y: 145, w: 126, h: 56, color: "#58b7ff" },
  { id: "coalBuffer", label: "燃料仓", sub: "煤炭汇流", x: 590, y: 450, w: 126, h: 56, color: "#58b7ff" },
  { id: "copperBuffer", label: "原矿仓", sub: "铜矿缓存", x: 590, y: 330, w: 126, h: 56, color: "#58b7ff" },
  { id: "sandBuffer", label: "原料仓", sub: "砂矿缓存", x: 590, y: 590, w: 126, h: 56, color: "#58b7ff" },
  { id: "furnaceIronA", label: "熔炉 A", sub: "铁锭", x: 805, y: 105, w: 122, h: 60, color: "#7ef0b2" },
  { id: "furnaceIronB", label: "熔炉 B", sub: "铁锭", x: 805, y: 205, w: 122, h: 60, color: "#7ef0b2" },
  { id: "furnaceCopper", label: "熔炉 C", sub: "铜锭", x: 805, y: 335, w: 122, h: 60, color: "#7ef0b2" },
  { id: "furnaceGlass", label: "熔炉 D", sub: "玻璃", x: 805, y: 585, w: 122, h: 60, color: "#7ef0b2" },
  { id: "ingotBuffer", label: "锭仓", sub: "铁/铜/玻璃", x: 1085, y: 180, w: 126, h: 58, color: "#58b7ff" },
  { id: "kilnA", label: "高温熔炉", sub: "钢锭 A", x: 1085, y: 305, w: 132, h: 62, color: "#9fc4e7" },
  { id: "kilnB", label: "高温熔炉", sub: "钢锭 B", x: 1085, y: 420, w: 132, h: 62, color: "#9fc4e7" },
  { id: "steelBuffer", label: "钢锭仓", sub: "中间品", x: 1085, y: 550, w: 126, h: 58, color: "#58b7ff" },
  { id: "casterIron", label: "铸造厂", sub: "铁板/铁棒", x: 1305, y: 120, w: 132, h: 62, color: "#ffbf66" },
  { id: "casterCopper", label: "铸造厂", sub: "铜板/铜线", x: 1305, y: 250, w: 132, h: 62, color: "#ffbf66" },
  { id: "casterSteel", label: "铸造厂", sub: "钢板/钢棒", x: 1305, y: 420, w: 132, h: 62, color: "#ffbf66" },
  { id: "partsBufferA", label: "零件仓 A", sub: "板材", x: 1585, y: 150, w: 126, h: 58, color: "#58b7ff" },
  { id: "partsBufferB", label: "零件仓 B", sub: "杆件/线缆", x: 1585, y: 315, w: 126, h: 58, color: "#58b7ff" },
  { id: "assemblerA", label: "组装厂 A", sub: "齿轮/框架", x: 1780, y: 160, w: 138, h: 66, color: "#7ef0b2" },
  { id: "assemblerB", label: "组装厂 B", sub: "动力组件", x: 1780, y: 300, w: 138, h: 66, color: "#7ef0b2" },
  { id: "assemblerCore", label: "核心组装", sub: "机械核心", x: 1780, y: 455, w: 138, h: 66, color: "#ffffff" },
  { id: "finalStore", label: "成品仓库", sub: "阶段产物", x: 1780, y: 590, w: 138, h: 58, color: "#ffffff" },
  { id: "generatorA", label: "发电厂 A", sub: "80 MW", x: 310, y: 775, w: 126, h: 56, color: "#ffe45c" },
  { id: "generatorB", label: "发电厂 B", sub: "80 MW", x: 520, y: 775, w: 126, h: 56, color: "#ffe45c" },
  { id: "poleA", label: "电杆 A", sub: "母线", x: 780, y: 775, w: 110, h: 54, color: "#ffe45c" },
  { id: "poleB", label: "电杆 B", sub: "冶炼区", x: 1040, y: 775, w: 110, h: 54, color: "#ffe45c" },
  { id: "poleC", label: "电杆 C", sub: "制造区", x: 1300, y: 775, w: 110, h: 54, color: "#ffe45c" },
  { id: "poleD", label: "电杆 D", sub: "装配区", x: 1560, y: 775, w: 110, h: 54, color: "#ffe45c" }
];

const menuFactoryLinks = [
  { type: "logistics", color: "#b9d9f2", points: [[200, 135], [250, 135], [250, 127], [285, 127]] },
  { type: "logistics", color: "#b9d9f2", points: [[200, 235], [250, 235], [250, 227], [285, 227]] },
  { type: "logistics", color: "#f0a24a", points: [[200, 365], [285, 365]] },
  { type: "logistics", color: "#6f7780", points: [[200, 495], [285, 495]] },
  { type: "logistics", color: "#d8c89f", points: [[200, 625], [285, 625]] },
  { type: "logistics", color: "#b9d9f2", points: [[401, 127], [490, 127], [490, 173], [590, 173]] },
  { type: "logistics", color: "#b9d9f2", points: [[401, 227], [490, 227], [490, 173], [590, 173]] },
  { type: "logistics", color: "#f0a24a", points: [[401, 357], [590, 357]] },
  { type: "logistics", color: "#6f7780", points: [[401, 487], [590, 487]] },
  { type: "logistics", color: "#d8c89f", points: [[401, 617], [590, 617]] },
  { type: "logistics", color: "#b9d9f2", points: [[716, 173], [760, 173], [760, 135], [805, 135]] },
  { type: "logistics", color: "#b9d9f2", points: [[716, 173], [760, 173], [760, 235], [805, 235]] },
  { type: "logistics", color: "#6f7780", points: [[716, 487], [760, 487], [760, 155], [805, 155]] },
  { type: "logistics", color: "#6f7780", points: [[716, 487], [760, 487], [760, 255], [805, 255]] },
  { type: "logistics", color: "#f0a24a", points: [[716, 357], [805, 365]] },
  { type: "logistics", color: "#6f7780", points: [[716, 487], [760, 487], [760, 385], [805, 385]] },
  { type: "logistics", color: "#d8c89f", points: [[716, 617], [805, 615]] },
  { type: "logistics", color: "#d7ecff", points: [[927, 135], [1010, 135], [1010, 209], [1085, 209]] },
  { type: "logistics", color: "#d7ecff", points: [[927, 235], [1010, 235], [1010, 209], [1085, 209]] },
  { type: "logistics", color: "#ffbf66", points: [[927, 365], [1010, 365], [1010, 225], [1085, 225]] },
  { type: "logistics", color: "#aeeeff", points: [[927, 615], [1010, 615], [1010, 225], [1085, 225]] },
  { type: "logistics", color: "#d7ecff", points: [[1211, 209], [1255, 209], [1255, 337], [1085, 337]] },
  { type: "logistics", color: "#6f7780", points: [[716, 487], [1025, 487], [1025, 337], [1085, 337]] },
  { type: "logistics", color: "#d7ecff", points: [[1211, 209], [1255, 209], [1255, 452], [1085, 452]] },
  { type: "logistics", color: "#6f7780", points: [[716, 487], [1040, 487], [1040, 452], [1085, 452]] },
  { type: "logistics", color: "#9fc4e7", points: [[1217, 337], [1255, 337], [1255, 579], [1085, 579]] },
  { type: "logistics", color: "#9fc4e7", points: [[1217, 452], [1255, 452], [1255, 579], [1085, 579]] },
  { type: "logistics", color: "#d7ecff", points: [[1211, 209], [1260, 209], [1260, 151], [1305, 151]] },
  { type: "logistics", color: "#ffbf66", points: [[1211, 225], [1260, 225], [1260, 281], [1305, 281]] },
  { type: "logistics", color: "#9fc4e7", points: [[1211, 579], [1260, 579], [1260, 451], [1305, 451]] },
  { type: "logistics", color: "#d7ecff", points: [[1437, 151], [1510, 151], [1510, 179], [1585, 179]] },
  { type: "logistics", color: "#ffd37a", points: [[1437, 281], [1510, 281], [1510, 344], [1585, 344]] },
  { type: "logistics", color: "#9fc4e7", points: [[1437, 451], [1510, 451], [1510, 344], [1585, 344]] },
  { type: "logistics", color: "#c9d6df", points: [[1711, 179], [1745, 179], [1745, 193], [1780, 193]] },
  { type: "logistics", color: "#ffd37a", points: [[1711, 344], [1745, 344], [1745, 333], [1780, 333]] },
  { type: "logistics", color: "#c9d6df", points: [[1918, 193], [1955, 193], [1955, 488], [1780, 488]] },
  { type: "logistics", color: "#7ef0b2", points: [[1918, 333], [1955, 333], [1955, 488], [1780, 488]] },
  { type: "logistics", color: "#ffffff", points: [[1918, 488], [1960, 488], [1960, 619], [1918, 619]] },
  { type: "logistics", color: "#6f7780", points: [[401, 487], [455, 487], [455, 803], [310, 803]] },
  { type: "logistics", color: "#6f7780", points: [[590, 487], [560, 487], [560, 803], [520, 803]] },
  { type: "power", color: "#ffe45c", points: [[436, 803], [520, 803]] },
  { type: "power", color: "#ffe45c", points: [[646, 803], [780, 803]] },
  { type: "power", color: "#ffe45c", points: [[890, 803], [1040, 803]] },
  { type: "power", color: "#ffe45c", points: [[1150, 803], [1300, 803]] },
  { type: "power", color: "#ffe45c", points: [[1410, 803], [1560, 803]] },
  { type: "power", color: "#ffe45c", points: [[835, 775], [835, 680], [866, 680], [866, 165]] },
  { type: "power", color: "#ffe45c", points: [[1095, 775], [1095, 665], [1151, 665], [1151, 482]] },
  { type: "power", color: "#ffe45c", points: [[1355, 775], [1355, 660], [1371, 660], [1371, 482]] },
  { type: "power", color: "#ffe45c", points: [[1615, 775], [1615, 690], [1849, 690], [1849, 521]] },
  { type: "power", color: "#ffe45c", points: [[1615, 775], [1615, 690], [1849, 690], [1849, 366]] },
  { type: "power", color: "#ffe45c", points: [[1615, 775], [1615, 690], [1849, 690], [1849, 226]] }
];

function pathLength(points) {
  return points.slice(1).reduce((sum, point, index) => {
    const prev = points[index];
    return sum + Math.hypot(point[0] - prev[0], point[1] - prev[1]);
  }, 0);
}

function pointAtPath(points, distance) {
  let remaining = distance;
  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    if (remaining <= length) {
      const ratio = length ? remaining / length : 0;
      return [start[0] + (end[0] - start[0]) * ratio, start[1] + (end[1] - start[1]) * ratio];
    }
    remaining -= length;
  }
  return points[points.length - 1];
}

function drawMenuFactoryBackground(canvas, now) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return;
  const dpr = window.devicePixelRatio || 1;
  const width = Math.floor(rect.width * dpr);
  const height = Math.floor(rect.height * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  const baseWidth = 2060;
  const baseHeight = 920;
  const scale = Math.max(rect.width / baseWidth, rect.height / baseHeight);
  const offsetX = (rect.width - baseWidth * scale) * 0.5;
  const offsetY = (rect.height - baseHeight * scale) * 0.5;
  const tx = (x) => offsetX + x * scale;
  const ty = (y) => offsetY + y * scale;

  ctx.fillStyle = "#04101a";
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.strokeStyle = "rgba(106, 172, 214, 0.12)";
  ctx.lineWidth = 1;
  const grid = 42 * scale;
  for (let x = offsetX % grid; x < rect.width; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, rect.height);
    ctx.stroke();
  }
  for (let y = offsetY % grid; y < rect.height; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(rect.width, y);
    ctx.stroke();
  }

  for (const zone of menuFactoryZones) {
    const x = tx(zone.x);
    const y = ty(zone.y);
    const w = zone.w * scale;
    const h = zone.h * scale;
    ctx.fillStyle = "rgba(9, 28, 42, 0.26)";
    ctx.strokeStyle = "rgba(132, 199, 255, 0.16)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, Math.min(10, 10 * scale));
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(157, 215, 255, 0.2)";
    ctx.font = `${Math.max(8, 10 * scale)}px Segoe UI, Arial, sans-serif`;
    ctx.fillText(zone.title, x + 12 * scale, y + 18 * scale);
  }

  for (const link of menuFactoryLinks) {
    const points = link.points.map(([x, y]) => [tx(x), ty(y)]);
    ctx.lineWidth = link.type === "power" ? 2.4 : 1.8;
    ctx.strokeStyle = link.type === "power" ? "rgba(255, 228, 92, 0.38)" : "rgba(88, 183, 255, 0.32)";
    ctx.beginPath();
    points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.stroke();
    ctx.strokeStyle = link.color;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = link.type === "power" ? 5 : 4;
    ctx.stroke();
    ctx.globalAlpha = 1;

    const length = pathLength(points);
    const count = Math.max(2, Math.floor(length / (link.type === "power" ? 150 : 105)));
    const speed = link.type === "power" ? 100 : 72;
    for (let i = 0; i < count; i += 1) {
      const distance = (now * speed / 1000 + i * (length / count)) % length;
      const [x, y] = pointAtPath(points, distance);
      const radius = link.type === "power" ? 2.8 : 3.2;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
      glow.addColorStop(0, link.color);
      glow.addColorStop(0.34, `${link.color}aa`);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (const node of menuFactoryNodes) {
    const x = tx(node.x);
    const y = ty(node.y);
    const w = node.w * scale;
    const h = node.h * scale;
    ctx.fillStyle = "rgba(7, 24, 37, 0.96)";
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 1;
    ctx.shadowColor = `${node.color}66`;
    ctx.shadowBlur = 7;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, Math.min(8, 8 * scale));
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = `${node.color}33`;
    ctx.fillRect(x + 1, y + h - 8 * scale, w - 2, 6 * scale);
    ctx.fillStyle = "#eaf8ff";
    ctx.font = `${Math.max(9, 13 * scale)}px Microsoft YaHei, Segoe UI, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, x + 13 * scale, y + h * 0.42);
    ctx.fillStyle = "#9fc4d6";
    ctx.font = `${Math.max(8, 9.5 * scale)}px Microsoft YaHei, Segoe UI, sans-serif`;
    ctx.fillText(node.sub, x + 13 * scale, y + h * 0.72);
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(x - 2 * scale, y + h * 0.5, 3 * scale, 0, Math.PI * 2);
    ctx.arc(x + w + 2 * scale, y + h * 0.5, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
}

function animateMenuBackground(now) {
  for (const canvas of menuCanvases) drawMenuFactoryBackground(canvas, now);
  requestAnimationFrame(animateMenuBackground);
}

requestAnimationFrame(animateMenuBackground);

Object.assign(resources, {
  adapter_input_device: { name: "封装输入设备", color: "#9bdcff" },
  adapter_output_device: { name: "封装输出设备", color: "#ffe45c" },
  adapter_power_device: { name: "封装电力设备", color: "#fff176" }
});

recipes.assembler.push(
  { name: "封装输入设备", inputs: { iron_plate: 2, copper_wire: 1 }, output: "adapter_input_device", amount: 1, time: 4 },
  { name: "封装输出设备", inputs: { iron_plate: 2, copper_wire: 1 }, output: "adapter_output_device", amount: 1, time: 4 },
  { name: "封装电力设备", inputs: { iron_rod: 1, copper_wire: 2, cable: 1 }, output: "adapter_power_device", amount: 1, time: 4.5 }
);

for (const recipe of [...recipes.furnace, ...recipes.kiln, ...recipes.caster, ...recipes.assembler]) {
  if (recipe.output === "iron_ingot" || recipe.output === "copper_ingot") recipe.time = 3;
  if (recipe.output === "glass") recipe.time = 2.8;
  if (recipe.output === "steel_ingot") recipe.time = 5;
  if (["iron_plate", "iron_rod", "copper_plate", "copper_rod", "steel_plate", "steel_rod"].includes(recipe.output)) recipe.time = 2.5;
  if (recipe.output === "copper_wire") recipe.time = 2.6;
  if (recipe.output === "mechanical_core") recipe.time = 11;
}

function cloneConfigValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function replaceConfigObject(target, source) {
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, cloneConfigValue(source || {}));
}

function applyGeneratedGameConfig(config) {
  if (!config) return;
  replaceConfigObject(resources, config.resources);
  replaceConfigObject(nodeTypes, config.nodeTypes);
  replaceConfigObject(recipes, config.recipes);
  if (config.upgrades) {
    nodeUpgrades = cloneConfigValue(config.upgrades);
  }
  const balance = config.balance || {};
  if (balance.RECIPE_INPUT_BUFFER_BATCHES !== undefined) RECIPE_INPUT_BUFFER_BATCHES = Number(balance.RECIPE_INPUT_BUFFER_BATCHES);
  if (balance.SOURCE_RESERVE_MAX !== undefined) SOURCE_RESERVE_MAX = Number(balance.SOURCE_RESERVE_MAX);
  if (balance.MINER_OUTPUT_PER_SECOND !== undefined) MINER_OUTPUT_PER_SECOND = Number(balance.MINER_OUTPUT_PER_SECOND);
  if (balance.DEVICE_CAPACITY !== undefined) DEVICE_CAPACITY = Number(balance.DEVICE_CAPACITY);
  if (balance.WAREHOUSE_CAPACITY !== undefined) WAREHOUSE_CAPACITY = Number(balance.WAREHOUSE_CAPACITY);
  if (balance.POWER_WARN_LOAD !== undefined) POWER_WARN_LOAD = Number(balance.POWER_WARN_LOAD);
  if (balance.POWER_DANGER_LOAD !== undefined) POWER_DANGER_LOAD = Number(balance.POWER_DANGER_LOAD);
  if (balance.POWER_OVERLOAD_LOAD !== undefined) POWER_OVERLOAD_LOAD = Number(balance.POWER_OVERLOAD_LOAD);
  if (balance.LOGISTICS_PACKET_LIMIT !== undefined) LOGISTICS_PACKET_LIMIT = Number(balance.LOGISTICS_PACKET_LIMIT);
  if (balance.LOGISTICS_WARN_PACKETS !== undefined) LOGISTICS_WARN_PACKETS = Number(balance.LOGISTICS_WARN_PACKETS);
  if (balance.LOGISTICS_WARN_EFFICIENCY !== undefined) LOGISTICS_WARN_EFFICIENCY = Number(balance.LOGISTICS_WARN_EFFICIENCY);
  if (balance.LOGISTICS_DANGER_EFFICIENCY !== undefined) LOGISTICS_DANGER_EFFICIENCY = Number(balance.LOGISTICS_DANGER_EFFICIENCY);
  if (balance.LOGISTICS_PACKET_SPACING !== undefined) LOGISTICS_PACKET_SPACING = Number(balance.LOGISTICS_PACKET_SPACING);
  if (balance.ADAPTER_PORT_CAPACITY !== undefined) ADAPTER_PORT_CAPACITY = Number(balance.ADAPTER_PORT_CAPACITY);
}

applyGeneratedGameConfig(window.GAME_CONFIG);

function setStatus(text, type = "") {
  statusLine.textContent = text;
  statusLine.className = `status ${type}`;
}

function resourceName(key) {
  if (key?.endsWith("_deposit")) return `${resources[key.replace("_deposit", "")]?.name || key}矿藏`;
  return resources[key]?.name || key || "空";
}

function resourceColor(key) {
  return resources[key]?.color || "#73c8ff";
}

function addStore(store, resource, amount) {
  if (!resource || amount === 0) return;
  store[resource] = Math.max(0, (store[resource] || 0) + amount);
  if (store[resource] <= 0.001) delete store[resource];
}

function storeTotal(store) {
  return Object.values(store).reduce((total, value) => total + value, 0);
}

function storeText(store) {
  const entries = Object.entries(store).filter(([, value]) => value > 0.05);
  if (!entries.length) return "空";
  return entries.map(([key, value]) => `${resourceName(key)} ${Math.floor(value)}`).join(" / ");
}

function storeBadgesHtml(store) {
  const entries = Object.entries(store).filter(([, value]) => value > 0.05).slice(0, 4);
  if (!entries.length) return `<span class="resource-empty">空</span>`;
  return entries.map(([key, value]) => `
    <span class="resource-badge" title="${resourceName(key)} ${Math.floor(value)}">
      <i style="background:${resourceColor(key)}"></i>
      <b>${resourceName(key)}</b>
      <em>${Math.floor(value)}</em>
    </span>
  `).join("");
}

function recipeSlotBadgesHtml(node) {
  const recipe = activeRecipe(node);
  if (!recipe) return storeBadgesHtml(node.inputStore);
  return Object.entries(recipe.inputs).map(([key, required]) => {
    const value = node.inputStore[key] || 0;
    const limit = recipeInputLimit(recipe, key);
    const ratio = limit ? value / limit : 0;
    const stateClass = value < required ? "missing" : ratio >= 0.96 ? "full" : ratio >= 0.78 ? "warn" : "";
    return `
      <span class="resource-badge recipe-slot ${stateClass}" title="${resourceName(key)} ${Math.floor(value)} / ${limit}">
        <i style="background:${resourceColor(key)}"></i>
        <b>${resourceName(key)}</b>
        <em>${Math.floor(value)}/${limit}</em>
      </span>
    `;
  }).join("");
}

function activeRecipe(node) {
  const list = recipes[node.kind];
  return list ? list[node.recipeIndex] : null;
}

function recipePowerMode(node, recipe = activeRecipe(node)) {
  if (!recipe || !nodeTypes[node.kind]?.powerIn) return "none";
  if (recipe.powerMode) return recipe.powerMode;
  return recipe.requiresPower ? "required" : "optional";
}

function recipeRequiresPower(node, recipe = activeRecipe(node)) {
  return recipePowerMode(node, recipe) === "required";
}

function hasInputs(store, inputs) {
  return Object.entries(inputs).every(([key, amount]) => (store[key] || 0) >= amount);
}

function takeInputs(store, inputs) {
  Object.entries(inputs).forEach(([key, amount]) => addStore(store, key, -amount));
}

function deviceFromResource(resource) {
  return {
    miner_device: "miner",
    furnace_device: "furnace",
    kiln_device: "kiln",
    caster_device: "caster",
    assembler_device: "assembler",
    generator_device: "generator",
    pole_device: "pole",
    warehouse_device: "warehouse"
  }[resource] || null;
}

function createEmptyGroupData() {
  return {
    children: [],
    inputs: [],
    outputs: [],
    powerInput: null
  };
}

function createAdapterResources(kind) {
  if (!nodeTypes[kind]?.adapter) return null;
  return {
    inputs: [null, null, null],
    outputs: [null, null, null]
  };
}

function createAdapterPortStores(kind) {
  if (!nodeTypes[kind]?.adapter) return null;
  return {
    inputs: [{}, {}, {}],
    outputs: [{}, {}, {}]
  };
}

function ensureAdapterPortStores(node) {
  if (!nodeTypes[node?.kind]?.adapter) return null;
  node.adapterPortStores ||= createAdapterPortStores(node.kind);
  for (const side of ["inputs", "outputs"]) {
    if (!Array.isArray(node.adapterPortStores[side])) node.adapterPortStores[side] = [{}, {}, {}];
    for (let port = 0; port < 3; port += 1) {
      node.adapterPortStores[side][port] ||= {};
    }
  }
  return node.adapterPortStores;
}

function adapterPortStore(node, side, port) {
  const stores = ensureAdapterPortStores(node);
  return stores?.[side]?.[port] || {};
}

function adapterHasBlockedOutput(node) {
  if (!nodeTypes[node?.kind]?.adapter) return false;
  ensureAdapterPortStores(node);
  return node.adapterPortStores.outputs.some((store) => storeTotal(store) >= ADAPTER_PORT_CAPACITY);
}

function firstStoreResource(store) {
  return Object.keys(store || {}).find((key) => key !== "undefined" && (store[key] || 0) > 0.001) || null;
}

function subtractStore(target, source) {
  for (const [resource, amount] of Object.entries(source || {})) {
    addStore(target, resource, -amount);
  }
}

function clearAdapterPort(node, port, options = {}) {
  if (!nodeTypes[node?.kind]?.adapter) return;
  const { keepResource = null, clearPackets = true } = options;
  ensureAdapterPortStores(node);
  subtractStore(node.inputStore, node.adapterPortStores.inputs[port]);
  subtractStore(node.outputStore, node.adapterPortStores.outputs[port]);
  node.adapterPortStores.inputs[port] = {};
  node.adapterPortStores.outputs[port] = {};
  node.adapterResources ||= createAdapterResources(node.kind);
  node.adapterResources.inputs[port] = keepResource;
  node.adapterResources.outputs[port] = keepResource;
  if (clearPackets) {
    for (const link of state.links) {
      if ((link.toNode === node.id && link.toPort === port) || (link.fromNode === node.id && link.fromPort === port)) {
        link.packets = [];
        link.resource = keepResource;
        link.emitBuffer = 0;
      }
    }
  }
}

function clearGroupPortPackets(group, side, port, resource = null) {
  if (!group || group.kind !== "group") return;
  for (const link of state.links) {
    const matches = side === "input"
      ? link.toNode === group.id && link.toPort === port
      : link.fromNode === group.id && link.fromPort === port;
    if (!matches) continue;
    link.packets = [];
    link.resource = resource;
    link.emitBuffer = 0;
  }
}

function rebindAdapterPort(node, port, resource) {
  if (!nodeTypes[node?.kind]?.adapter || !resource) return;
  node.adapterResources ||= createAdapterResources(node.kind);
  const current = node.adapterResources.inputs[port] || node.adapterResources.outputs[port];
  if (current && current !== resource) {
    clearAdapterPort(node, port, { keepResource: resource });
  } else {
    node.adapterResources.inputs[port] = resource;
    node.adapterResources.outputs[port] = resource;
  }
}

function adapterParentGroup(node) {
  return node?.groupId ? nodeById(node.groupId) : null;
}

function pruneAdapterPortBindings() {
  for (const node of state.nodes) {
    if (!nodeTypes[node.kind]?.adapter) continue;
    const group = adapterParentGroup(node);
    for (let port = 0; port < 3; port += 1) {
      let hasInputSide = state.links.some((link) => link.toNode === node.id && link.toPort === port);
      let hasOutputSide = state.links.some((link) => link.fromNode === node.id && link.fromPort === port);
      if (group && node.kind === "adapter_input") {
        hasInputSide ||= state.links.some((link) => link.toNode === group.id && link.toPort === port);
      }
      if (group && node.kind === "adapter_output") {
        hasOutputSide ||= state.links.some((link) => link.fromNode === group.id && link.fromPort === port);
      }
      if (!hasInputSide && !hasOutputSide) clearAdapterPort(node, port, { clearPackets: false });
    }
  }
  for (const group of state.nodes.filter((node) => node.kind === "group")) rebuildGroupInterfaces(group);
}

function newNodePosition(kind) {
  const rect = canvas.getBoundingClientRect();
  const scale = state.viewport.scale || 1;
  const centerX = (rect.width / 2 - state.viewport.x) / scale;
  const centerY = (rect.height / 2 - state.viewport.y) / scale;
  const siblings = state.nodes.filter((node) => node.groupId === state.activeGroupId).length;
  const offsets = [[0, 0], [34, 28], [-34, 28], [34, -28], [-34, -28], [68, 0], [-68, 0], [0, 56], [0, -56]];
  const [offsetX, offsetY] = offsets[siblings % offsets.length];
  const width = kind === "group" ? 236 : 166;
  const height = kind === "group" ? 176 : 250;
  const visibleLeft = -state.viewport.x / scale;
  const visibleTop = -state.viewport.y / scale;
  const visibleRight = (rect.width - state.viewport.x) / scale;
  const visibleBottom = (rect.height - state.viewport.y) / scale;
  return {
    x: clamp(Math.round(centerX - width / 2 + offsetX), visibleLeft + 16, visibleRight - width - 16),
    y: clamp(Math.round(centerY - height / 2 + offsetY), visibleTop + 16, visibleBottom - height - 16)
  };
}

function nodeDefaultCapacity(kind) {
  return nodeTypes[kind]?.capacity || (kind === "warehouse" ? WAREHOUSE_CAPACITY : DEVICE_CAPACITY);
}

function nodeLevel(node) {
  return Math.max(1, Number(node?.level) || 1);
}

function upgradesForKind(kind) {
  return [...(nodeUpgrades[kind] || [])].sort((a, b) => a.level - b.level);
}

function appliedUpgrades(node) {
  const level = nodeLevel(node);
  return upgradesForKind(node.kind).filter((upgrade) => upgrade.level <= level);
}

function nextUpgrade(node) {
  const level = nodeLevel(node);
  return upgradesForKind(node.kind).find((upgrade) => upgrade.level === level + 1) || null;
}

function upgradeMultiplier(node, effectName) {
  return appliedUpgrades(node).reduce((value, upgrade) => value * Number(upgrade.effects?.[effectName] || 1), 1);
}

function upgradeAbsolute(node, effectName, fallback) {
  return appliedUpgrades(node).reduce((value, upgrade) => {
    const effect = upgrade.effects?.[effectName];
    return effect === undefined || effect === "" ? value : Math.max(value, Number(effect));
  }, fallback);
}

function nodeEffectiveCapacity(node) {
  return Math.max(1, Math.round(nodeDefaultCapacity(node.kind) * upgradeMultiplier(node, "capacity_multiplier")));
}

function refreshNodeCapacity(node) {
  node.capacity = Math.max(
    nodeEffectiveCapacity(node),
    Math.ceil(storeTotal(node.inputStore || {})),
    Math.ceil(storeTotal(outputStoreFor(node) || {}))
  );
}

function nodeProductionSpeedMultiplier(node) {
  return upgradeMultiplier(node, "speed_multiplier");
}

function nodeMinerRate(node) {
  return MINER_OUTPUT_PER_SECOND * upgradeMultiplier(node, "miner_rate_multiplier");
}

function nodePowerDemand(node) {
  return Math.ceil((nodeTypes[node.kind]?.demand || 0) * upgradeMultiplier(node, "power_demand_multiplier"));
}

function nodeGeneration(node) {
  return Math.ceil((nodeTypes[node.kind]?.generation || 0) * upgradeMultiplier(node, "generation_multiplier"));
}

function ensureNodePortArrays(node) {
  const inputCount = activeInputs(node);
  const outputCount = activeOutputs(node);
  while (node.inputOpen.length < inputCount) node.inputOpen.push(true);
  while (node.outputOpen.length < outputCount) node.outputOpen.push(true);
  while (node.outputLimits.length < outputCount) node.outputLimits.push(1);
  while (node.outputLimitBuffers.length < outputCount) node.outputLimitBuffers.push(0);
}

function warehouseResourceTotals() {
  const totals = {};
  for (const warehouse of state.nodes.filter((node) => node.kind === "warehouse")) {
    for (const store of [warehouse.inputStore, warehouse.outputStore]) {
      for (const [resource, amount] of Object.entries(store || {})) {
        if (amount > 0) totals[resource] = (totals[resource] || 0) + amount;
      }
    }
  }
  return totals;
}

function upgradeCostStatus(costs = {}) {
  const totals = warehouseResourceTotals();
  return Object.entries(costs).map(([resource, required]) => ({
    resource,
    required,
    available: Math.floor(totals[resource] || 0),
    enough: (totals[resource] || 0) >= required
  }));
}

function nodeCanUpgrade(node) {
  const upgrade = nextUpgrade(node);
  return Boolean(upgrade && upgradeCostStatus(upgrade.costs).every((item) => item.enough));
}

function upgradeDeductionPlan(costs = {}) {
  const lines = [];
  const missing = [];
  for (const [resource, required] of Object.entries(costs)) {
    let remaining = required;
    for (const warehouse of state.nodes.filter((node) => node.kind === "warehouse")) {
      for (const storeName of ["inputStore", "outputStore"]) {
        const available = warehouse[storeName]?.[resource] || 0;
        if (available <= 0 || remaining <= 0) continue;
        const amount = Math.min(available, remaining);
        lines.push({ nodeId: warehouse.id, storeName, resource, amount });
        remaining -= amount;
      }
      if (remaining <= 0) break;
    }
    if (remaining > 0.001) missing.push({ resource, amount: remaining });
  }
  return { ok: !missing.length, lines, missing };
}

function applyUpgradeCostPlan(plan) {
  for (const line of plan.lines) {
    const warehouse = nodeById(line.nodeId);
    if (!warehouse) continue;
    addStore(warehouse[line.storeName], line.resource, -line.amount);
    updateWarehouseLock(warehouse);
  }
}

function formatUpgradeEffect(effect, value) {
  const percent = Math.round((Number(value) - 1) * 100);
  const labels = {
    speed_multiplier: `生产速度 +${percent}%`,
    miner_rate_multiplier: `采矿速度 +${percent}%`,
    capacity_multiplier: `缓存容量 +${percent}%`,
    power_demand_multiplier: `电力消耗 +${percent}%`,
    generation_multiplier: `发电量 +${percent}%`,
    input_ports: `输入口提升到 ${value}`,
    output_ports: `输出口提升到 ${value}`,
    power_outputs: `电力输出提升到 ${value}`
  };
  return labels[effect] || `${effect}: ${value}`;
}

function projectedUpgradeValue(node, effect, upgrade) {
  const previousLevel = node.level;
  const before = {
    speed_multiplier: `${nodeProductionSpeedMultiplier(node).toFixed(2)}x`,
    miner_rate_multiplier: `${nodeMinerRate(node).toFixed(2)}/秒`,
    capacity_multiplier: `${nodeEffectiveCapacity(node)}`,
    power_demand_multiplier: `${nodePowerDemand(node)}`,
    generation_multiplier: `${nodeGeneration(node)}`,
    input_ports: `${activeInputs(node)}`,
    output_ports: `${activeOutputs(node)}`,
    power_outputs: `${activePowerOutputs(node)}`
  }[effect];
  node.level = upgrade.level;
  const after = {
    speed_multiplier: `${nodeProductionSpeedMultiplier(node).toFixed(2)}x`,
    miner_rate_multiplier: `${nodeMinerRate(node).toFixed(2)}/秒`,
    capacity_multiplier: `${nodeEffectiveCapacity(node)}`,
    power_demand_multiplier: `${nodePowerDemand(node)}`,
    generation_multiplier: `${nodeGeneration(node)}`,
    input_ports: `${activeInputs(node)}`,
    output_ports: `${activeOutputs(node)}`,
    power_outputs: `${activePowerOutputs(node)}`
  }[effect];
  node.level = previousLevel;
  return before && after ? `${before} -> ${after}` : "";
}

function upgradeCompareHtml(node, upgrade) {
  const labels = {
    speed_multiplier: "生产速度",
    miner_rate_multiplier: "采矿速度",
    capacity_multiplier: "缓存容量",
    power_demand_multiplier: "电力消耗",
    generation_multiplier: "发电量",
    input_ports: "输入口",
    output_ports: "输出口",
    power_outputs: "电力输出"
  };
  const rows = Object.keys(upgrade.effects || {})
    .map((effect) => {
      const value = projectedUpgradeValue(node, effect, upgrade);
      return { effect, value };
    })
    .filter((item) => item.value)
    .slice(0, 4);
  if (!rows.length) return "";
  return `
    <div class="upgrade-compare">
      ${rows.map((row) => `<div><span>${labels[row.effect] || row.effect}</span><b>${row.value}</b></div>`).join("")}
    </div>
  `;
}

function costListHtml(costs = []) {
  return costs.length
    ? costs.map((item) => `
      <div class="upgrade-cost ${item.enough ? "enough" : "missing"}">
        <span><i style="background:${resourceColor(item.resource)}"></i>${resourceName(item.resource)}</span>
        <b>${item.available}/${item.required}</b>
      </div>
    `).join("")
    : `<div class="upgrade-empty-cost">无需材料</div>`;
}

function openUpgradeDialog({ title, subtitle, costs, effects, compare = "", onConfirm }) {
  if (!upgradeDialog || !upgradeDialogTitle || !upgradeDialogBody || !upgradeDialogConfirm) {
    onConfirm?.();
    return;
  }
  upgradeDialogTitle.textContent = title;
  upgradeDialogSubtitle.textContent = subtitle || "";
  upgradeDialogBody.innerHTML = `
    <div class="upgrade-dialog-grid">
      <section>
        <strong>消耗材料</strong>
        <div class="upgrade-cost-list">${costListHtml(costs)}</div>
      </section>
      <section>
        <strong>升级效果</strong>
        <ul class="upgrade-effects">${effects.map((line) => `<li>${line}</li>`).join("")}</ul>
        ${compare}
      </section>
    </div>
  `;
  upgradeDialogConfirm.textContent = "确认升级";
  upgradeDialogConfirm.style.display = "";
  upgradeDialogConfirm.onclick = () => onConfirm?.();
  upgradeDialogCancel.textContent = "取消";
  upgradeDialogCancel.style.display = "";
  if (!upgradeDialog.open) upgradeDialog.showModal();
}

function showUpgradeComplete({ title, subtitle, lines = [] }) {
  if (!upgradeDialog || !upgradeDialogTitle || !upgradeDialogBody) return;
  upgradeDialogTitle.textContent = title;
  upgradeDialogSubtitle.textContent = subtitle || "";
  upgradeDialogBody.innerHTML = `
    <div class="upgrade-complete-burst">
      <div class="upgrade-complete-ring"></div>
      <b>升级完成</b>
      <span>${subtitle || ""}</span>
    </div>
    <div class="upgrade-complete-list">
      ${lines.map((line) => `<div>${line}</div>`).join("")}
    </div>
  `;
  if (upgradeDialogConfirm) upgradeDialogConfirm.style.display = "none";
  if (upgradeDialogCancel) {
    upgradeDialogCancel.textContent = "关闭";
    upgradeDialogCancel.style.display = "";
  }
  if (!upgradeDialog.open) upgradeDialog.showModal();
}

function upgradePanelHtml(node) {
  const upgrades = upgradesForKind(node.kind);
  if (!upgrades.length) return "";
  const upgrade = nextUpgrade(node);
  if (!upgrade) {
    return `
      <div class="inspector-section upgrade-panel maxed">
        <div class="inspector-section-title"><span>升级</span><small>Lv.${nodeLevel(node)}</small></div>
        <div class="upgrade-maxed">已满级</div>
      </div>
    `;
  }
  const costs = upgradeCostStatus(upgrade.costs);
  const canUpgrade = costs.every((item) => item.enough);
  const effects = Object.entries(upgrade.effects || {}).map(([key, value]) => `<li>${formatUpgradeEffect(key, value)}</li>`).join("");
  return `
    <div class="inspector-section upgrade-panel ${canUpgrade ? "ready" : "blocked"}">
      <div class="inspector-section-title"><span>升级</span><small>Lv.${nodeLevel(node)} -> Lv.${upgrade.level}</small></div>
      <div class="upgrade-title">
        <b>${upgrade.name}</b>
        <span>${upgrade.desc || ""}</span>
      </div>
      <div class="upgrade-cost-list">
        ${costs.map((item) => `
          <div class="upgrade-cost ${item.enough ? "enough" : "missing"}">
            <span><i style="background:${resourceColor(item.resource)}"></i>${resourceName(item.resource)}</span>
            <b>${item.available}/${item.required}</b>
          </div>
        `).join("")}
      </div>
      <ul class="upgrade-effects">${effects}</ul>
      ${upgradeCompareHtml(node, upgrade)}
      <small class="upgrade-source">材料来源：全局仓库库存</small>
      <button id="upgrade-node" class="inspector-action primary" type="button" ${canUpgrade ? "" : "disabled"}>${canUpgrade ? "升级" : "材料不足"}</button>
    </div>
  `;
}

function upgradeNode(node) {
  const upgrade = nextUpgrade(node);
  if (!upgrade) return;
  const plan = upgradeDeductionPlan(upgrade.costs);
  if (!plan.ok) {
    setStatus("升级材料不足", "error");
    render();
    return;
  }
  const costs = upgradeCostStatus(upgrade.costs);
  const effects = Object.entries(upgrade.effects || {}).map(([key, value]) => formatUpgradeEffect(key, value));
  openUpgradeDialog({
    title: `升级 ${nodeTitle(node)}`,
    subtitle: `Lv.${nodeLevel(node)} -> Lv.${upgrade.level} · ${upgrade.name}`,
    costs,
    effects,
    compare: upgradeCompareHtml(node, upgrade),
    onConfirm: () => {
      applyUpgradeCostPlan(plan);
      node.level = upgrade.level;
      node.upgradeFlashUntil = performance.now() + 1600;
      refreshNodeCapacity(node);
      ensureNodePortArrays(node);
      setStatus(`${nodeTitle(node)} 已升级到 Lv.${node.level}：${upgrade.name}`, "ok");
      showUpgradeComplete({
        title: `${nodeTitle(node)} Lv.${node.level}`,
        subtitle: upgrade.name,
        lines: effects
      });
      render();
    }
  });
}

function logisticsLineLevel(link) {
  return clamp(Math.floor(Number(link?.level) || 1), 1, Math.max(...Object.keys(LOGISTICS_LINE_LEVELS).map(Number)));
}

function logisticsLineConfig(linkOrLevel) {
  const level = typeof linkOrLevel === "number" ? linkOrLevel : logisticsLineLevel(linkOrLevel);
  return LOGISTICS_LINE_LEVELS[level] || LOGISTICS_LINE_LEVELS[1];
}

function applyLogisticsLineStats(link) {
  if (!link) return link;
  link.level = logisticsLineLevel(link);
  const config = logisticsLineConfig(link);
  link.rate = config.rate;
  link.speed = config.speed;
  link.packetLimit = config.packetLimit;
  return link;
}

function logisticsPacketLimit(link) {
  return applyLogisticsLineStats(link).packetLimit || LOGISTICS_PACKET_LIMIT;
}

function logisticsWarnPacketLimit(link) {
  return Math.max(1, Math.ceil(logisticsPacketLimit(link) * 0.7));
}

function logisticsLinkColor(link) {
  return logisticsLineConfig(link).color;
}

function outputPortRate(node, port = 0) {
  if (!node) return 0;
  if (node.kind === "warehouse") return Math.max(0, node.outputLimits?.[port] || 0);
  if (node.kind === "group") {
    const map = groupOutputMap(node, port);
    const adapter = map ? nodeById(map.adapterNodeId) : null;
    return outputPortRate(adapter, map?.adapterPort || 0);
  }
  return DEFAULT_OUTPUT_PORT_RATE;
}

function logisticsEmitRate(link) {
  const from = nodeById(link.fromNode);
  return Math.min(outputPortRate(from, link.fromPort), applyLogisticsLineStats(link).rate || LOGISTICS_LINE_LEVELS[1].rate);
}

function nextLogisticsUpgrade(link) {
  const nextLevel = logisticsLineLevel(link) + 1;
  return LOGISTICS_LINE_LEVELS[nextLevel] ? { level: nextLevel, ...LOGISTICS_LINE_LEVELS[nextLevel] } : null;
}

function logisticsLineUpgradePanelHtml(link) {
  const current = logisticsLineConfig(link);
  const next = nextLogisticsUpgrade(link);
  if (!next) {
    return `
      <div class="inspector-section upgrade-panel maxed">
        <div class="inspector-section-title"><span>物流线升级</span><small>Lv.${logisticsLineLevel(link)}</small></div>
        <div class="upgrade-maxed">已满级</div>
      </div>
    `;
  }
  const costs = upgradeCostStatus(next.costs);
  const canUpgrade = costs.every((item) => item.enough);
  return `
    <div class="inspector-section upgrade-panel ${canUpgrade ? "ready" : "blocked"}">
      <div class="inspector-section-title"><span>物流线升级</span><small>Lv.${logisticsLineLevel(link)} -> Lv.${next.level}</small></div>
      <div class="upgrade-title">
        <b>${next.name}</b>
        <span>提升发包上限、光球速度和线路在途容量</span>
      </div>
      <div class="upgrade-cost-list">
        ${costs.map((item) => `
          <div class="upgrade-cost ${item.enough ? "enough" : "missing"}">
            <span><i style="background:${resourceColor(item.resource)}"></i>${resourceName(item.resource)}</span>
            <b>${item.available}/${item.required}</b>
          </div>
        `).join("")}
      </div>
      <ul class="upgrade-effects">
        <li>发包上限 ${current.rate}/秒 -> ${next.rate}/秒</li>
        <li>移动速度 ${current.speed}px/s -> ${next.speed}px/s</li>
        <li>在途容量 ${current.packetLimit} -> ${next.packetLimit}</li>
      </ul>
      <small class="upgrade-source">材料来源：全局仓库库存</small>
      <button id="upgrade-logistics-link" class="inspector-action primary" type="button" ${canUpgrade ? "" : "disabled"}>${canUpgrade ? "升级物流线" : "材料不足"}</button>
    </div>
  `;
}

function upgradeLogisticsLink(link) {
  const next = nextLogisticsUpgrade(link);
  if (!next) return;
  const plan = upgradeDeductionPlan(next.costs);
  if (!plan.ok) {
    setStatus("物流线升级材料不足", "error");
    render();
    return;
  }
  const from = nodeById(link.fromNode);
  const to = nodeById(link.toNode);
  const current = logisticsLineConfig(link);
  const costs = upgradeCostStatus(next.costs);
  const effects = [
    `发包上限 ${current.rate}/秒 -> ${next.rate}/秒`,
    `移动速度 ${current.speed}px/s -> ${next.speed}px/s`,
    `在途容量 ${current.packetLimit} -> ${next.packetLimit}`
  ];
  const compare = `
    <div class="upgrade-compare">
      <div><span>线路等级</span><b>Lv.${logisticsLineLevel(link)} -> Lv.${next.level}</b></div>
      <div><span>线宽表现</span><b>${current.width} -> ${next.width}</b></div>
      <div><span>光球表现</span><b>${current.packetRadius} -> ${next.packetRadius}</b></div>
    </div>
  `;
  openUpgradeDialog({
    title: "升级物流线",
    subtitle: `${from ? nodeTitle(from) : "来源"} -> ${to ? nodeTitle(to) : "目标"} · Lv.${logisticsLineLevel(link)} -> Lv.${next.level}`,
    costs,
    effects,
    compare,
    onConfirm: () => {
      applyUpgradeCostPlan(plan);
      link.level = next.level;
      link.rate = next.rate;
      link.speed = next.speed;
      link.packetLimit = next.packetLimit;
      link.upgradeFlashUntil = performance.now() + 1600;
      setStatus(`物流线已升级到 Lv.${link.level}：${next.name}`, "ok");
      showUpgradeComplete({
        title: `物流线 Lv.${link.level}`,
        subtitle: next.name,
        lines: effects
      });
      render();
    }
  });
}

function addNode(kind, resource = null) {
  if (kind !== "source" && state.inventory[kind] !== undefined && (state.inventory[kind] || 0) <= 0) {
    setStatus(`${nodeTypes[kind].name} 库存不足`, "error");
    return;
  }
  const position = newNodePosition(kind);
  const node = {
    id: `node-${nextId++}`,
    kind,
    resource,
    x: position.x,
    y: position.y,
    inputStore: {},
    outputStore: {},
    reserve: kind === "source" ? SOURCE_RESERVE_MAX : 0,
    initialReserve: kind === "source" ? SOURCE_RESERVE_MAX : 0,
    miningResource: null,
    warehouseResource: null,
    inputOpen: [true, true, true, true],
    outputOpen: [true, true, true, true],
    warehouseInBuffer: 0,
    warehouseOutBuffer: 0,
    outputLimits: [1, 1, 1, 1],
    outputLimitBuffers: [0, 0, 0, 0],
    recipeIndex: 0,
    level: 1,
    progress: 0,
    status: "待机",
    powered: false,
    generating: false,
    groupId: state.activeGroupId,
    groupData: kind === "group" ? createEmptyGroupData() : null,
    adapterResources: createAdapterResources(kind),
    adapterPortStores: createAdapterPortStores(kind),
    capacity: nodeDefaultCapacity(kind)
  };
  refreshNodeCapacity(node);
  ensureNodePortArrays(node);
  state.nodes.push(node);
  if (kind !== "source" && state.inventory[kind] !== undefined) state.inventory[kind] -= 1;
  setSingleSelection(node.id);
  setStatus(`已创建 ${nodeTitle(node)}`, "ok");
  render();
}

function createNodeRaw(kind, resource, x, y) {
  const node = {
    id: `node-${nextId++}`,
    kind,
    resource,
    x,
    y,
    inputStore: {},
    outputStore: {},
    reserve: kind === "source" ? SOURCE_RESERVE_MAX : 0,
    initialReserve: kind === "source" ? SOURCE_RESERVE_MAX : 0,
    miningResource: null,
    warehouseResource: null,
    inputOpen: [true, true, true, true],
    outputOpen: [true, true, true, true],
    warehouseInBuffer: 0,
    warehouseOutBuffer: 0,
    outputLimits: [1, 1, 1, 1],
    outputLimitBuffers: [0, 0, 0, 0],
    recipeIndex: 0,
    level: 1,
    progress: 0,
    status: "待机",
    powered: false,
    generating: false,
    groupId: null,
    groupData: kind === "group" ? createEmptyGroupData() : null,
    adapterResources: createAdapterResources(kind),
    adapterPortStores: createAdapterPortStores(kind),
    capacity: nodeDefaultCapacity(kind)
  };
  refreshNodeCapacity(node);
  ensureNodePortArrays(node);
  state.nodes.push(node);
  return node;
}

function nodeTitle(node) {
  return node.kind === "source" ? `${resourceName(node.resource)}源` : nodeTypes[node.kind].name;
}

function sourceReserveRatio(node) {
  const total = node.initialReserve || node.reserve || SOURCE_RESERVE_MAX;
  return clamp(node.reserve / total, 0, 1);
}

function sourceReserveColor(node) {
  const ratio = sourceReserveRatio(node);
  return `hsl(${Math.round(120 * ratio)}, 82%, 55%)`;
}

function nodeDisplayTitle(node) {
  return nodeTitle(node);
}

function nodeStatusTags(node, runState = nodeRunState(node)) {
  const tags = [];
  if (runState.key === "paused") tags.push({ text: "暂停", type: "paused", priority: "core" });
  if (runState.key === "running") tags.push({ text: "运行", type: "running", priority: "core" });
  const reason = pauseReason(node);
  if (reason) tags.push({ text: reason, type: "reason", priority: "detail" });
  if (nodeTypes[node.kind]?.powerIn) {
    tags.push({ text: node.powered ? "已供电" : "未供电", type: node.powered ? "power-on" : "power-off", priority: "detail" });
  }
  if (node.kind === "source" && node.reserve <= 0) tags.push({ text: "消耗殆尽", type: "danger", priority: "detail" });
  return tags;
}

function statusTagsHtml(node, runState) {
  const tags = nodeStatusTags(node, runState);
  if (!tags.length) return "";
  const visible = tags.slice(0, 3);
  const overflow = tags.length - visible.length;
  return `
    <div class="node-tags" title="${tags.map((tag) => tag.text).join(" / ")}">
      ${visible.map((tag) => `<span class="node-tag ${tag.type}" data-priority="${tag.priority}">${tag.text}</span>`).join("")}
      ${overflow > 0 ? `<span class="node-tag overflow" data-priority="detail">+${overflow}</span>` : ""}
    </div>
  `;
}

function nodeById(id) {
  return state.nodes.find((node) => node.id === id);
}

function pauseReason(node) {
  const runState = nodeRunState(node);
  if (runState.key !== "paused") return "";
  if (node.kind === "group") {
    const paused = groupChildren(node).find((child) => nodeRunState(child).key === "paused");
    return paused ? `组内${nodeTitle(paused)}${pauseReason(paused) ? `-${pauseReason(paused)}` : ""}` : "组内暂停";
  }
  if (nodeTypes[node.kind]?.adapter) {
    if (adapterHasBlockedOutput(node)) return "接口堵塞";
    return "等待连接";
  }
  if (node.kind === "source") return node.reserve <= 0 ? "矿源耗尽" : "未接输出";
  if (node.kind === "warehouse") {
    if (storeTotal(node.inputStore) >= node.capacity) return "仓库已满";
    if (!state.links.some((link) => link.fromNode === node.id || link.toNode === node.id)) return "未接线路";
    return "等待资源";
  }
  if (node.kind === "generator") return (node.inputStore.coal || 0) > 0 ? "未接电网" : "缺少煤矿";
  if (node.kind === "miner") {
    if (storeTotal(node.outputStore) >= node.capacity) return "输出堵塞";
    if (!state.links.some((link) => link.toNode === node.id)) return "未接矿源";
    return "缺少矿源";
  }
  if (activeRecipe(node)) {
    const recipe = activeRecipe(node);
    if (storeTotal(node.outputStore) >= node.capacity) return "输出堵塞";
    if (recipeRequiresPower(node, recipe) && !node.powered) return "等待电力";
    const missing = Object.entries(recipe.inputs)
      .filter(([key, amount]) => (node.inputStore[key] || 0) < amount)
      .map(([key]) => resourceName(key));
    if (missing.length) return `缺少${missing.join("、")}`;
    if (!state.links.some((link) => link.toNode === node.id)) return "未接输入";
    return "等待材料";
  }
  if ((nodeTypes[node.kind].powerIn || nodeTypes[node.kind].powerOut) && !node.powered) return "未接电力";
  return "暂停";
}

function nodeVisualState(node, runState = nodeRunState(node)) {
  if (node.kind === "warehouse" && storeTotal(node.inputStore) >= node.capacity) {
    return { key: "warehouse-full", label: "仓库满" };
  }
  if (node.kind === "miner" && storeTotal(node.outputStore) >= node.capacity) {
    return { key: "output-blocked", label: "输出堵塞" };
  }
  const recipe = activeRecipe(node);
  if (recipe) {
    if (storeTotal(node.outputStore) >= node.capacity) return { key: "output-blocked", label: "输出堵塞" };
    if (recipeRequiresPower(node, recipe) && !node.powered) return { key: "power-wait", label: "等待电力" };
    if (!hasInputs(node.inputStore, recipe.inputs)) return { key: "input-missing", label: "输入不足" };
  }
  if (runState.key === "running") return { key: "running", label: "正常生产" };
  if (runState.key === "paused") return { key: "input-missing", label: pauseReason(node) || "暂停" };
  return { key: "idle", label: "未启动" };
}

function nodeRunState(node) {
  if (node.kind === "group") {
    const children = groupChildren(node);
    if (!children.length) return { key: "idle", label: "未启动" };
    if (children.some((child) => nodeRunState(child).key === "paused")) return { key: "paused", label: "暂停" };
    if (children.some((child) => nodeRunState(child).key === "running")) return { key: "running", label: "启动" };
    return { key: "idle", label: "未启动" };
  }
  if (nodeTypes[node.kind]?.adapter) {
    if (adapterHasBlockedOutput(node)) return { key: "paused", label: "暂停" };
    return state.links.some((link) => link.fromNode === node.id || link.toNode === node.id) || state.powerLinks.some((link) => link.fromNode === node.id || link.toNode === node.id)
      ? { key: "running", label: "启动" }
      : { key: "idle", label: "未启动" };
  }
  if (node.kind === "source") {
    if (node.reserve <= 0) return { key: "paused", label: "暂停" };
    return state.links.some((link) => link.fromNode === node.id)
      ? { key: "running", label: "启动" }
      : { key: "idle", label: "未启动" };
  }
  if (node.kind === "warehouse") {
    if (storeTotal(node.inputStore) >= node.capacity) return { key: "paused", label: "暂停" };
    return state.links.some((link) => link.fromNode === node.id || link.toNode === node.id)
      ? { key: "running", label: "启动" }
      : { key: "idle", label: "未启动" };
  }
  if (node.kind === "generator") {
    if (node.generating) return { key: "running", label: "启动" };
    if (state.powerLinks.some((link) => link.fromNode === node.id) || (node.inputStore.coal || 0) > 0) return { key: "paused", label: "暂停" };
    return { key: "idle", label: "未启动" };
  }
  if (node.kind === "miner") {
    const hasInputLine = state.links.some((link) => link.toNode === node.id);
    const hasDeposit = Object.keys(node.inputStore).some((key) => key.endsWith("_deposit") && node.inputStore[key] > 0.05);
    if (storeTotal(node.outputStore) >= node.capacity || (hasInputLine && !hasDeposit && storeTotal(node.outputStore) <= 0.05)) return { key: "paused", label: "暂停" };
    if (node.miningResource || storeTotal(node.outputStore) > 0.05) return { key: "running", label: "启动" };
    return { key: "idle", label: "未启动" };
  }
  if (activeRecipe(node)) {
    const recipe = activeRecipe(node);
    if (storeTotal(node.outputStore) >= node.capacity || (recipeRequiresPower(node, recipe) && !node.powered) || !hasInputs(node.inputStore, recipe.inputs)) {
      return { key: "paused", label: "暂停" };
    }
    if (node.progress > 0 || node.status.includes("生产") || node.status.includes("产出") || node.status.includes("入库")) return { key: "running", label: "启动" };
    return state.links.some((link) => link.toNode === node.id || link.fromNode === node.id)
      ? { key: "paused", label: "暂停" }
      : { key: "idle", label: "未启动" };
  }
  if (nodeTypes[node.kind].powerIn || nodeTypes[node.kind].powerOut) {
    return node.powered || state.powerLinks.some((link) => link.fromNode === node.id || link.toNode === node.id)
      ? { key: "running", label: "启动" }
      : { key: "idle", label: "未启动" };
  }
  return { key: "idle", label: "未启动" };
}

function groupChildren(group) {
  return state.nodes.filter((node) => node.groupId === group.id);
}

function adapterNodeInGroup(group, kind) {
  return groupChildren(group).find((node) => node.kind === kind) || null;
}

function inferLinkResource(link) {
  if (!link) return null;
  if (link?.resource) return link.resource;
  const from = nodeById(link?.fromNode);
  const to = nodeById(link?.toNode);
  if (from?.kind === "source") return `${from.resource}_deposit`;
  if (from?.kind === "miner") return from.miningResource;
  if (from && activeRecipe(from)) return activeRecipe(from).output;
  if (to?.kind === "miner") {
    const store = nodeTypes[from?.kind]?.adapter ? adapterPortStore(from, "outputs", link.fromPort) : from?.outputStore;
    return Object.keys(store || {}).find((key) => key.endsWith("_deposit")) || null;
  }
  const recipe = to ? activeRecipe(to) : null;
  if (recipe && Object.keys(recipe.inputs).length === 1) return Object.keys(recipe.inputs).find((key) => canReceiveResourceType(to, key, link.toPort)) || null;
  return from ? firstStoreResource(outputStoreForLink(from, link.fromPort || 0)) : null;
}

function rebuildGroupInterfaces(group) {
  if (!group || group.kind !== "group") return createEmptyGroupData();
  const data = group.groupData || createEmptyGroupData();
  data.children = groupChildren(group).map((node) => node.id);
  data.inputs = [];
  data.outputs = [];
  const inputAdapter = adapterNodeInGroup(group, "adapter_input");
  const outputAdapter = adapterNodeInGroup(group, "adapter_output");
  const powerAdapter = adapterNodeInGroup(group, "adapter_power");
  if (inputAdapter) {
    for (let port = 0; port < 3; port += 1) {
      const internal = state.links.find((link) => link.fromNode === inputAdapter.id && link.fromPort === port);
      const external = state.links.find((link) => link.toNode === group.id && link.toPort === port);
      const storedInput = firstStoreResource(adapterPortStore(inputAdapter, "inputs", port));
      const storedOutput = firstStoreResource(adapterPortStore(inputAdapter, "outputs", port));
      const resource = external?.resource || storedInput || storedOutput || inputAdapter.adapterResources?.outputs?.[port] || inferLinkResource(internal);
      if (internal || resource) {
        if (resource) {
          const current = inputAdapter.adapterResources?.inputs?.[port] || inputAdapter.adapterResources?.outputs?.[port];
          if (current && current !== resource) clearGroupPortPackets(group, "input", port, resource);
          rebindAdapterPort(inputAdapter, port, resource);
        }
        data.inputs.push({ groupPort: port, adapterNodeId: inputAdapter.id, adapterPort: port, resource: resource || null });
      }
    }
  }
  if (outputAdapter) {
    for (let port = 0; port < 3; port += 1) {
      const internal = state.links.find((link) => link.toNode === outputAdapter.id && link.toPort === port);
      const storedInput = firstStoreResource(adapterPortStore(outputAdapter, "inputs", port));
      const storedOutput = firstStoreResource(adapterPortStore(outputAdapter, "outputs", port));
      const resource = internal?.resource || storedInput || storedOutput || inferLinkResource(internal) || outputAdapter.adapterResources?.inputs?.[port];
      if (internal || resource) {
        if (resource) {
          const current = outputAdapter.adapterResources?.inputs?.[port] || outputAdapter.adapterResources?.outputs?.[port];
          if (current && current !== resource) clearGroupPortPackets(group, "output", port, resource);
          rebindAdapterPort(outputAdapter, port, resource);
        }
        data.outputs.push({ groupPort: port, adapterNodeId: outputAdapter.id, adapterPort: port, resource: resource || null });
      }
    }
  }
  data.powerInput = powerAdapter ? { adapterNodeId: powerAdapter.id } : null;
  group.groupData = data;
  return data;
}

function groupInputMap(group, port) {
  return rebuildGroupInterfaces(group).inputs.find((item) => item.groupPort === port) || null;
}

function groupOutputMap(group, port) {
  return rebuildGroupInterfaces(group).outputs.find((item) => item.groupPort === port) || null;
}

function groupInterfaceRows(items, side) {
  return [0, 1, 2].map((port) => {
    const item = items.find((entry) => entry.groupPort === port);
    const resource = item?.resource || null;
    const name = resource ? resourceName(resource) : "待绑定";
    const color = resource ? resourceColor(resource) : "#5e778a";
    return `
      <div class="group-interface-row ${resource ? "bound" : "empty"}" title="${side} ${port + 1}: ${name}">
        <b>${side} ${port + 1}</b>
        <i style="background:${color}"></i>
        <span>${name}</span>
      </div>
    `;
  }).join("");
}

function groupInterfacePanelHtml(data) {
  const inputCount = data.inputs.length;
  const outputCount = data.outputs.length;
  const powerText = data.powerInput ? "PWR 接入" : "PWR 未接入";
  return `
    <div class="group-interface-summary mid-layer">
      <span>IN ${inputCount}</span>
      <span>OUT ${outputCount}</span>
      <span>${data.powerInput ? "PWR" : "NO PWR"}</span>
    </div>
    <div class="group-interface-panel">
      <div class="group-interface-column input">
        <strong>输入接口</strong>
        ${groupInterfaceRows(data.inputs, "IN")}
      </div>
      <div class="group-interface-column output">
        <strong>输出接口</strong>
        ${groupInterfaceRows(data.outputs, "OUT")}
      </div>
    </div>
    <div class="group-power-chip ${data.powerInput ? "on" : "off"}">${powerText}</div>
  `;
}

function activeInputs(node) {
  if (node.kind === "group") return rebuildGroupInterfaces(node).inputs.length ? 3 : 0;
  return upgradeAbsolute(node, "input_ports", nodeTypes[node.kind].inputs);
}

function activeOutputs(node) {
  if (node.kind === "group") return rebuildGroupInterfaces(node).outputs.length ? 3 : 0;
  return upgradeAbsolute(node, "output_ports", nodeTypes[node.kind].outputs);
}

function activePowerOutputs(node) {
  return upgradeAbsolute(node, "power_outputs", nodeTypes[node.kind].powerOutputs || (nodeTypes[node.kind].powerOut ? 1 : 0));
}

function nodeVisualWidth(node) {
  return node?.kind === "group" ? 236 : 166;
}

function portMetrics() {
  if (state.viewport.scale < 0.65) return { portSize: 10, portOffset: 6, powerPortSize: 12 };
  if (state.viewport.scale < 0.95) return { portSize: 10, portOffset: 6, powerPortSize: 13 };
  return { portSize: 14, portOffset: 8, powerPortSize: 16 };
}

function portPosition(node, side, index) {
  const width = nodeVisualWidth(node);
  const metrics = portMetrics();
  if (side === "power-in") {
    const right = state.viewport.scale < 0.95 ? 14 : 16;
    const top = state.viewport.scale < 0.65 ? -7 : state.viewport.scale < 0.95 ? -8 : metrics.powerPortSize * -0.55;
    return {
      x: node.x + width - right - metrics.powerPortSize / 2,
      y: node.y + top + metrics.powerPortSize / 2
    };
  }
  if (side === "power-out") {
    const top = powerOutputPortTop(node, index);
    return {
      x: node.x + width + metrics.portOffset + metrics.portSize / 2,
      y: node.y + top + metrics.portSize / 2
    };
  }
  const top = logisticsPortTop(index);
  return {
    x: node.x + (side === "in" ? -metrics.portOffset + metrics.portSize / 2 : width + metrics.portOffset + metrics.portSize / 2),
    y: node.y + top + metrics.portSize / 2
  };
}

function pathPoints(a, b) {
  const midX = Math.round((a.x + b.x) / 2);
  return [a, { x: midX, y: a.y }, { x: midX, y: b.y }, b];
}

function offsetForIndex(index) {
  if (index <= 0) return 0;
  const step = Math.ceil(index / 2) * 14;
  return index % 2 ? -step : step;
}

function logisticsLaneOffset(link) {
  const from = nodeById(link.fromNode);
  const to = nodeById(link.toNode);
  if (!from || !to) return 0;
  const group = state.links
    .filter((item) => {
      const itemFrom = nodeById(item.fromNode);
      const itemTo = nodeById(item.toNode);
      if (!itemFrom || !itemTo) return false;
      const sameDirection = Math.sign(itemTo.x - itemFrom.x) === Math.sign(to.x - from.x);
      const closeVertical = Math.abs(((itemFrom.y + itemTo.y) / 2) - ((from.y + to.y) / 2)) < 90;
      const closeHorizontal = Math.abs(((itemFrom.x + itemTo.x) / 2) - ((from.x + to.x) / 2)) < 220;
      return sameDirection && closeVertical && closeHorizontal;
    })
    .sort((a, b) => a.id.localeCompare(b.id));
  return offsetForIndex(group.findIndex((item) => item.id === link.id));
}

function logisticsPathPoints(link) {
  const from = nodeById(link.fromNode);
  const to = nodeById(link.toNode);
  const a = portPosition(from, "out", link.fromPort);
  const b = portPosition(to, "in", link.toPort);
  const midX = Math.round((a.x + b.x) / 2) + logisticsLaneOffset(link);
  return [a, { x: midX, y: a.y }, { x: midX, y: b.y }, b];
}

function powerPathPoints(a, b) {
  const routeX = b.x >= a.x
    ? Math.max(a.x + 44, b.x + 34)
    : Math.min(a.x - 44, b.x - 174);
  const approachY = b.y - 30;
  return [
    a,
    { x: routeX, y: a.y },
    { x: routeX, y: approachY },
    { x: b.x, y: approachY },
    b
  ];
}

function pathFor(points) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function pointOnPolyline(points, progress) {
  return pointOnPolylineDistance(points, progress * polylineLength(points));
}

function pointOnPolylineDistance(points, distance) {
  const segments = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    segments.push({ a, b, length });
    total += length;
  }
  let remainingDistance = Math.min(distance, total);
  for (const segment of segments) {
    if (remainingDistance <= segment.length) {
      const t = segment.length ? remainingDistance / segment.length : 0;
      return {
        x: segment.a.x + (segment.b.x - segment.a.x) * t,
        y: segment.a.y + (segment.b.y - segment.a.y) * t
      };
    }
    remainingDistance -= segment.length;
  }
  return points[points.length - 1];
}

function polylineLength(points) {
  let total = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    total += Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
  }
  return Math.max(1, total);
}

function render(options = {}) {
  applyViewportTransform();
  renderNodes();
  renderSelectionBox();
  renderLinks();
  if (!options.skipInspector) {
    renderInspector();
  }
  if (!options.skipMonitoring || performance.now() - state.lastMonitorRender > 350) {
    renderMonitoring();
    state.lastMonitorRender = performance.now();
  }
  renderInventory();
  deleteSelectedLinkButton.disabled = !state.selectedLinkId;
}

function applyViewportTransform() {
  const transform = `translate(${state.viewport.x}px, ${state.viewport.y}px) scale(${state.viewport.scale})`;
  nodesLayer.style.transform = transform;
  linksLayer.style.transform = transform;
  const gridSize = 28 * state.viewport.scale;
  canvas.style.backgroundSize = `${gridSize}px ${gridSize}px`;
  canvas.style.backgroundPosition = `${state.viewport.x}px ${state.viewport.y}px`;
  canvas.classList.toggle("zoom-far", state.viewport.scale < 0.65);
  canvas.classList.toggle("zoom-mid", state.viewport.scale >= 0.65 && state.viewport.scale < 0.95);
  canvas.classList.toggle("zoom-near", state.viewport.scale >= 0.95);
}

function selectedNodeIds() {
  if (state.selectedIds.length) return [...state.selectedIds];
  return state.selectedId ? [state.selectedId] : [];
}

function isNodeSelected(nodeId) {
  return selectedNodeIds().includes(nodeId);
}

function setSingleSelection(nodeId) {
  state.selectedId = nodeId;
  state.selectedIds = [];
  state.selectedLinkId = null;
  state.selectedLinkType = null;
}

function setMultiSelection(ids) {
  const unique = [...new Set(ids)].filter((id) => nodeById(id));
  state.selectedIds = unique;
  state.selectedId = unique.length === 1 ? unique[0] : null;
  state.selectedLinkId = null;
  state.selectedLinkType = null;
}

function startCanvasPan(event) {
  const start = {
    x: event.clientX,
    y: event.clientY,
    viewX: state.viewport.x,
    viewY: state.viewport.y
  };
  let moved = false;
  canvas.classList.add("panning");
  const move = (moveEvent) => {
    moved = true;
    state.viewport.x = start.viewX + moveEvent.clientX - start.x;
    state.viewport.y = start.viewY + moveEvent.clientY - start.y;
    applyViewportTransform();
  };
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    canvas.classList.remove("panning");
    if (!moved) clearSelection();
    render();
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

function zoomCanvasAt(event) {
  event.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const screenX = event.clientX - rect.left;
  const screenY = event.clientY - rect.top;
  const before = screenToWorld(screenX, screenY);
  const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
  const nextScale = clamp(state.viewport.scale * factor, 0.45, 2.4);
  state.viewport.scale = nextScale;
  state.viewport.x = screenX - before.x * nextScale;
  state.viewport.y = screenY - before.y * nextScale;
  applyViewportTransform();
}

function screenToWorld(screenX, screenY) {
  return {
    x: (screenX - state.viewport.x) / state.viewport.scale,
    y: (screenY - state.viewport.y) / state.viewport.scale
  };
}

function toggleNodeSelection(nodeId) {
  const ids = selectedNodeIds();
  if (ids.includes(nodeId)) setMultiSelection(ids.filter((id) => id !== nodeId));
  else setMultiSelection([...ids, nodeId]);
}

function clearSelection() {
  state.selectedId = null;
  state.selectedIds = [];
  state.selectedLinkId = null;
  state.selectedLinkType = null;
}

function focusContext() {
  const selected = selectedNodeIds();
  if (!selected.length) return null;
  const selectedSet = new Set(selected);
  const nodeIds = new Set(selected);
  const logisticsLinkIds = new Set();
  const powerLinkIds = new Set();
  for (const link of state.links) {
    if (selectedSet.has(link.fromNode) || selectedSet.has(link.toNode)) {
      nodeIds.add(link.fromNode);
      nodeIds.add(link.toNode);
      logisticsLinkIds.add(link.id);
    }
  }
  for (const link of state.powerLinks) {
    if (selectedSet.has(link.fromNode) || selectedSet.has(link.toNode)) {
      nodeIds.add(link.fromNode);
      nodeIds.add(link.toNode);
      powerLinkIds.add(link.id);
    }
  }
  return { selectedSet, nodeIds, logisticsLinkIds, powerLinkIds };
}

function visibleNode(node) {
  if (state.activeGroupId) return node.groupId === state.activeGroupId;
  if (node.kind === "group") return true;
  return !node.groupId;
}

function visibleLink(link) {
  const from = nodeById(link.fromNode);
  const to = nodeById(link.toNode);
  return Boolean(from && to && visibleNode(from) && visibleNode(to));
}

function focusRole(nodeId, focus) {
  if (!focus || !focus.nodeIds.has(nodeId)) return "";
  if (focus.selectedSet.has(nodeId)) return "聚焦";
  const selected = [...focus.selectedSet];
  const isInput = state.links.some((link) => link.fromNode === nodeId && selected.includes(link.toNode))
    || state.powerLinks.some((link) => link.fromNode === nodeId && selected.includes(link.toNode));
  const isOutput = state.links.some((link) => selected.includes(link.fromNode) && link.toNode === nodeId)
    || state.powerLinks.some((link) => selected.includes(link.fromNode) && link.toNode === nodeId);
  if (isInput && isOutput) return "上下级";
  if (isInput) return "输入来源";
  if (isOutput) return "输出目标";
  return "";
}

function renderInventory() {
  const recommended = recommendedBuildKinds();
  const highlightedKind = state.goalHighlight.until > performance.now() ? state.goalHighlight.kind : null;
  document.querySelectorAll(".device-items button[data-kind]").forEach((button) => {
    const kind = button.dataset.kind;
    const value = kind === "source" ? "∞" : state.inventory[kind] || 0;
    const badge = button.querySelector("b");
    if (badge) badge.textContent = value;
    button.disabled = kind !== "source" && value <= 0;
    button.classList.toggle("recommended", recommended.has(kind));
    button.classList.toggle("goal-highlight", highlightedKind === kind);
  });
  const cableBadge = document.querySelector("#cable-stock");
  if (cableBadge) cableBadge.textContent = state.cableStock;
}

function recommendedBuildKinds() {
  const step = currentGoal(collectResourceTotals()).activeStep;
  const map = {
    "mining.source": ["source"],
    "mining.miner": ["miner"],
    "mining.warehouse": ["warehouse"],
    "smelting.furnace": ["furnace"],
    "smelting.coal_line": ["source", "miner"],
    "steel.kiln": ["kiln"],
    "group.create": ["adapter_input", "adapter_output"],
    "group.input_adapter": ["adapter_input"],
    "group.output_adapter": ["adapter_output"],
    "group_power.adapter": ["adapter_power"],
    "group_power.generator": ["generator", "miner", "source"],
    "casting.caster": ["caster"],
    "assembly.assembler": ["assembler"]
  };
  return new Set(map[step?.id] || []);
}

function locateCurrentGoal() {
  const totals = collectResourceTotals();
  const step = currentGoal(totals).activeStep;
  const recommended = [...recommendedBuildKinds()];
  const findByKind = (kinds) => state.nodes.find((node) => kinds.includes(node.kind) && visibleNode(node));
  const target = findByKind(recommended) || null;
  if (target) {
    centerViewportOn(target);
    setSingleSelection(target.id);
    setStatus(`已定位：${step?.title || nodeTitle(target)}`, "ok");
  } else if (recommended.length) {
    state.goalHighlight = { kind: recommended[0], until: performance.now() + 1800 };
    setStatus(`当前建议建造：${recommended.map((kind) => nodeTypes[kind]?.name || kind).join(" / ")}`, "ok");
  } else {
    setStatus("当前任务需要检查已有产线连接和产出进度", "ok");
  }
  render();
}

function centerViewportOn(node) {
  const rect = canvas.getBoundingClientRect();
  state.viewport.x = rect.width / 2 - (node.x + 83) * state.viewport.scale;
  state.viewport.y = rect.height / 2 - (node.y + 56) * state.viewport.scale;
}

function nodeRecipeSwitchHtml(node) {
  const list = recipes[node.kind];
  const recipe = activeRecipe(node);
  if (!list || !recipe) return "";
  return `
    <div class="node-recipe-switch detail-layer" data-node-recipe="${node.id}">
      <button data-recipe-step="-1" type="button" title="上一个配方">‹</button>
      <span data-open-node-recipe="true" title="打开配方选择">${recipe.name}</span>
      <button data-recipe-step="1" type="button" title="下一个配方">›</button>
    </div>
  `;
}

function setNodeRecipe(node, recipeIndex) {
  const list = recipes[node.kind];
  if (!list || !list.length) return false;
  const nextIndex = (recipeIndex + list.length) % list.length;
  if (nextIndex === node.recipeIndex) return false;
  node.recipeIndex = nextIndex;
  node.progress = 0;
  cleanInputForRecipe(node);
  refreshIncomingRecipeLinks(node);
  setStatus(`${nodeTitle(node)} 已切换配方：${activeRecipe(node).name}`, "ok");
  render();
  return true;
}

function stepNodeRecipe(nodeId, direction) {
  const node = nodeById(nodeId);
  if (!node || !recipes[node.kind]) return;
  setNodeRecipe(node, node.recipeIndex + direction);
}

function setDeviceTab(group) {
  document.querySelectorAll("[data-device-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.deviceTab === group);
  });
  document.querySelectorAll(".device-items button").forEach((button) => {
    button.classList.toggle("hidden", button.dataset.group !== group);
  });
}

function renderNodes() {
  nodesLayer.innerHTML = "";
  const focus = focusContext();
  const visibleNodes = state.nodes.filter(visibleNode);
  for (const node of visibleNodes) {
    if (node.kind === "group") {
      renderGroupNode(node, focus);
      continue;
    }
    const type = nodeTypes[node.kind];
    const runState = nodeRunState(node);
    const visualState = nodeVisualState(node, runState);
    const powerClass = powerVisualClass(node);
    const dimClass = focus && !focus.nodeIds.has(node.id) ? "dimmed-node" : "";
    const relationRole = focusRole(node.id, focus);
    const element = document.createElement("article");
    const canUpgrade = nodeCanUpgrade(node);
    const recentUpgrade = node.upgradeFlashUntil && performance.now() < node.upgradeFlashUntil;
    element.className = `node kind-${node.kind} state-${runState.key} visual-${visualState.key} ${powerClass} ${dimClass} ${canUpgrade ? "can-upgrade" : ""} ${recentUpgrade ? "upgrade-flash" : ""} ${isNodeSelected(node.id) ? "selected" : ""} ${state.selectedIds.length > 1 && isNodeSelected(node.id) ? "multi-selected" : ""}`;
    element.dataset.id = node.id;
    element.style.left = `${node.x}px`;
    element.style.top = `${node.y}px`;
    element.innerHTML = `
      <div class="node-header">
        <span>${nodeDisplayTitle(node)}</span>
        <b class="node-level-badge" title="${canUpgrade ? `可升级到 Lv.${nodeLevel(node) + 1}` : `Lv.${nodeLevel(node)}`}">Lv.${nodeLevel(node)}${canUpgrade ? " ↑" : ""}</b>
        <i style="background:${node.kind === "source" ? resourceColor(node.resource) : ""}"></i>
      </div>
      <div class="node-body">
        ${visualState.key === "warehouse-full" ? `<div class="warehouse-full-icon" title="仓库满">仓满</div>` : ""}
        ${relationRole ? `<div class="relation-badge">${relationRole}</div>` : ""}
        ${statusTagsHtml(node, runState)}
        <div class="node-desc detail-layer">${type.desc}</div>
        <div class="run-state ${runState.key}">运行状态 ${runState.label}</div>
        ${activeRecipe(node) ? `
          <div class="node-recipe mid-layer">配方 ${activeRecipe(node).name}</div>
          ${nodeRecipeSwitchHtml(node)}
          <div class="node-progress mid-layer"><span style="width:${Math.floor(node.progress * 100)}%"></span></div>
        ` : ""}
        ${node.kind === "miner" ? `
          <div class="node-recipe mid-layer">采矿进度</div>
          <div class="node-progress mid-layer"><span style="width:${Math.floor(node.progress * 100)}%"></span></div>
        ` : ""}
        ${nodeTypes[node.kind].powerIn ? `<div class="power-state ${node.powered ? "on" : "off"}">${node.powered ? "已供电" : "未供电"}</div>` : ""}
        ${node.kind === "generator" ? `<div class="mid-layer">发电 ${node.generating ? `${nodeGeneration(node)}` : "0"}</div>` : ""}
        ${node.kind === "source" ? `
          <div class="mid-layer">${node.reserve <= 0 ? "消耗殆尽" : "矿源余量"}</div>
          <div class="reserve-progress mid-layer"><span style="width:${Math.floor(sourceReserveRatio(node) * 100)}%; background:${sourceReserveColor(node)}"></span></div>
        ` : ""}
        <div class="node-store detail-layer"><span>${activeRecipe(node) ? "配方缓存" : "输入"}</span><div>${activeRecipe(node) ? recipeSlotBadgesHtml(node) : storeBadgesHtml(node.inputStore)}</div></div>
        <div class="node-store detail-layer"><span>输出</span><div>${storeBadgesHtml(outputStoreFor(node))}</div></div>
      </div>
      ${portsHtml(node)}
    `;
    element.addEventListener("pointerdown", startNodeDrag);
    nodesLayer.appendChild(element);
  }
  if (!nodesLayer.children.length && state.nodes.some((node) => node.kind === "group")) {
    state.activeGroupId = null;
    for (const group of state.nodes.filter((node) => node.kind === "group")) {
      renderGroupNode(group, focus);
    }
  }
}

function renderGroupNodeLegacyUnused(node, focus) {
  document.body.dataset.groupRenderAttempt = node.id;
  document.body.dataset.groupRenderError = "";
  try {
    document.body.dataset.groupRenderStep = "data";
    const data = rebuildGroupInterfaces(node);
    document.body.dataset.groupRenderStep = "element";
    const element = document.createElement("article");
    element.className = `node group-node state-idle ${isNodeSelected(node.id) ? "selected" : ""}`;
    element.dataset.id = node.id;
    element.style.left = `${node.x}px`;
    element.style.top = `${node.y}px`;
    document.body.dataset.groupRenderStep = "html";
    element.innerHTML = `
      <div class="node-header"><span>${nodeTitle(node)}</span><i></i></div>
      <div class="node-body">
        <div class="run-state idle">运行状态 未启动</div>
        <div class="node-recipe mid-layer">组内 ${data.children.length} 节点</div>
        <div class="node-store detail-layer"><span>接口</span><div>${data.inputs.length} input / ${data.outputs.length} output / ${data.powerInput ? "power" : "no power"}</div></div>
      </div>
    `;
    document.body.dataset.groupRenderStep = "append";
    element.addEventListener("pointerdown", startNodeDrag);
    nodesLayer.appendChild(element);
    document.body.dataset.groupRenderStep = "done";
    document.body.dataset.groupRenderDone = String(nodesLayer.children.length);
  } catch (error) {
    document.body.dataset.groupRenderError = error?.message || String(error);
  }
  return;
  element.innerHTML = `
    <div class="node-header">
      <span>${nodeDisplayTitle(node)}</span>
      <i></i>
    </div>
    <div class="node-body">
      ${statusTagsHtml(node, runState)}
      <div class="node-desc detail-layer">${nodeTypes.group.desc}</div>
      <div class="run-state ${runState.key}">运行状态 ${runState.label}</div>
      <div class="node-recipe mid-layer">组内 ${data.children.length} 节点</div>
      <div class="node-store detail-layer"><span>输入接口</span><div>${data.inputs.length ? data.inputs.map((item) => `<span class="resource-badge"><i style="background:${resourceColor(item.resource)}"></i><b>${item.resource ? resourceName(item.resource) : "待锁定"}</b><em>${item.groupPort + 1}</em></span>`).join("") : `<span class="resource-empty">无</span>`}</div></div>
      <div class="node-store detail-layer"><span>输出接口</span><div>${data.outputs.length ? data.outputs.map((item) => `<span class="resource-badge"><i style="background:${resourceColor(item.resource)}"></i><b>${item.resource ? resourceName(item.resource) : "待锁定"}</b><em>${item.groupPort + 1}</em></span>`).join("") : `<span class="resource-empty">无</span>`}</div></div>
    </div>
    ${portsHtml(node)}
  `;
  element.addEventListener("pointerdown", startNodeDrag);
  nodesLayer.appendChild(element);
}

function renderGroupNode(node, focus) {
  const runState = nodeRunState(node);
  const dimClass = focus && !focus.nodeIds.has(node.id) ? "dimmed-node" : "";
  const data = rebuildGroupInterfaces(node);
  const inputText = data.inputs.length ? `${data.inputs.length} 输入` : "无输入";
  const outputText = data.outputs.length ? `${data.outputs.length} 输出` : "无输出";
  const powerText = data.powerInput ? "电力" : "无电力";
  const element = document.createElement("article");
  element.className = `node group-node state-${runState.key} ${dimClass} ${isNodeSelected(node.id) ? "selected" : ""}`;
  element.dataset.id = node.id;
  element.style.left = `${node.x}px`;
  element.style.top = `${node.y}px`;
  element.innerHTML = `
    <div class="node-header">
      <span>${nodeDisplayTitle(node)}</span>
      <i></i>
    </div>
    <div class="node-body">
      <div class="node-desc detail-layer">${nodeTypes.group.desc}</div>
      <div class="run-state ${runState.key}">运行状态 ${runState.label}</div>
      <div class="node-recipe mid-layer">组内 ${data.children.length} 节点</div>
      <div class="node-store detail-layer"><span>接口</span><div>${inputText} / ${outputText} / ${powerText}</div></div>
    </div>
    ${portsHtml(node)}
  `;
  element.addEventListener("pointerdown", (event) => {
    const now = performance.now();
    const repeatedClick = state.lastGroupClick.id === node.id && now - state.lastGroupClick.at < 900;
    state.lastGroupClick = { id: node.id, at: now };
    if (event.detail >= 2 || repeatedClick) {
      state.lastGroupClick = { id: null, at: 0 };
      event.preventDefault();
      event.stopPropagation();
      enterGroup(node.id);
      return;
    }
    startNodeDrag(event);
  });
  element.addEventListener("dblclick", (event) => {
    event.stopPropagation();
    enterGroup(node.id);
  });
  nodesLayer.appendChild(element);
}

function renderGroupNode(node, focus) {
  const runState = nodeRunState(node);
  const dimClass = focus && !focus.nodeIds.has(node.id) ? "dimmed-node" : "";
  const data = rebuildGroupInterfaces(node);
  const element = document.createElement("article");
  element.className = `node group-node state-${runState.key} ${dimClass} ${isNodeSelected(node.id) ? "selected" : ""}`;
  element.dataset.id = node.id;
  element.style.left = `${node.x}px`;
  element.style.top = `${node.y}px`;
  element.innerHTML = `
    <div class="node-header">
      <span>${nodeDisplayTitle(node)}</span>
      <i></i>
    </div>
    <div class="node-body">
      ${statusTagsHtml(node, runState)}
      <div class="group-node-meta">
        <span>组内 ${data.children.length} 节点</span>
        <span>${runState.label}</span>
      </div>
      ${groupInterfacePanelHtml(data)}
    </div>
    ${portsHtml(node)}
  `;
  element.addEventListener("pointerdown", (event) => {
    const now = performance.now();
    const repeatedClick = state.lastGroupClick.id === node.id && now - state.lastGroupClick.at < 900;
    state.lastGroupClick = { id: node.id, at: now };
    if (event.detail >= 2 || repeatedClick) {
      state.lastGroupClick = { id: null, at: 0 };
      event.preventDefault();
      event.stopPropagation();
      enterGroup(node.id);
      return;
    }
    startNodeDrag(event);
  });
  element.addEventListener("dblclick", (event) => {
    event.stopPropagation();
    enterGroup(node.id);
  });
  nodesLayer.appendChild(element);
}

function powerVisualClass(node) {
  const type = nodeTypes[node.kind];
  if (node.kind === "generator" && node.generating) return "power-generator-active";
  if (type.powerIn && node.powered) return "power-node-on";
  if (type.powerIn && isPowerInputUsed(node.id) && !node.powered && recipeRequiresPower(node)) return "power-node-starved";
  return "";
}

function portsHtml(node) {
  let html = "";
  const inputPorts = node.kind === "group" ? rebuildGroupInterfaces(node).inputs.map((item) => item.groupPort) : [...Array(activeInputs(node)).keys()];
  const outputPorts = node.kind === "group" ? rebuildGroupInterfaces(node).outputs.map((item) => item.groupPort) : [...Array(activeOutputs(node)).keys()];
  for (const i of inputPorts) {
    html += `<button class="port in ${isInputUsed(node.id, i) ? "used" : ""} ${node.kind === "warehouse" && !node.inputOpen[i] ? "closed" : ""}" data-node="${node.id}" data-side="in" data-index="${i}" style="top:${logisticsPortTop(i)}px" title="${portTitle(node, "in", i)}"></button>`;
  }
  for (const i of outputPorts) {
    html += `<button class="port out ${isOutputUsed(node.id, i) ? "used" : ""} ${node.kind === "warehouse" && !node.outputOpen[i] ? "closed" : ""}" data-node="${node.id}" data-side="out" data-index="${i}" style="top:${logisticsPortTop(i)}px" title="${portTitle(node, "out", i)}"></button>`;
  }
  if (nodeTypes[node.kind].powerIn || (node.kind === "group" && rebuildGroupInterfaces(node).powerInput)) {
    html += `<button class="port power-in ${isPowerInputUsed(node.id) ? "used" : ""}" data-node="${node.id}" data-side="power-in" data-index="0" title="${portTitle(node, "power-in", 0)}"></button>`;
  }
  for (let i = 0; i < activePowerOutputs(node); i += 1) {
    const top = powerOutputPortTop(node, i);
    html += `<button class="port power-out ${isPowerOutputUsed(node.id, i) ? "used" : ""}" data-node="${node.id}" data-side="power-out" data-index="${i}" style="top:${top}px" title="${portTitle(node, "power-out", i)}"></button>`;
  }
  return html;
}

function logisticsPortTop(index) {
  if (state.viewport.scale < 0.95) return 42 + index * 14;
  return 48 + index * 22;
}

function powerOutputPortTop(node, index) {
  const count = activePowerOutputs(node);
  if (count <= 1) return state.viewport.scale < 0.95 ? 78 : 95;
  if (state.viewport.scale < 0.65) return 42 + index * 18;
  if (state.viewport.scale < 0.95) return 44 + index * 20;
  return 51 + index * 24;
}

function portTitle(node, side, index) {
  if (node.kind === "group" && side === "in") {
    const map = groupInputMap(node, index);
    return map ? `分组输入 ${index + 1}：${map.resource ? resourceName(map.resource) : "待锁定资源"}` : `分组输入 ${index + 1}：未定义`;
  }
  if (node.kind === "group" && side === "out") {
    const map = groupOutputMap(node, index);
    return map ? `分组输出 ${index + 1}：${map.resource ? resourceName(map.resource) : "待锁定资源"}` : `分组输出 ${index + 1}：未定义`;
  }
  if (node.kind === "group" && side === "power-in") {
    return "分组电力输入：连接到组内封装电力节点";
  }
  if (side === "power-in") {
    const link = state.powerLinks.find((item) => item.toNode === node.id);
    return link ? `电力输入：${link.load || 0}/${link.capacity}` : "电力输入：未连接";
  }
  if (side === "power-out") {
    const link = state.powerLinks.find((item) => item.fromNode === node.id && (item.fromPort || 0) === index);
    return link ? `电力输出 ${index + 1}：${link.load || 0}/${link.capacity}` : `电力输出 ${index + 1}：未连接`;
  }
  if (side === "in") {
    const link = state.links.find((item) => item.toNode === node.id && item.toPort === index);
    return link ? `输入口 ${index + 1}：${resourceName(link.resource)}` : `输入口 ${index + 1}：未连接`;
  }
  const link = state.links.find((item) => item.fromNode === node.id && item.fromPort === index);
  return link ? `输出口 ${index + 1}：${resourceName(link.resource)}` : `输出口 ${index + 1}：未连接`;
}

function renderLinks() {
  linksLayer.innerHTML = "";
  renderLinkMarkers();
  const fadeLogistics = state.lineView === "power";
  const fadePower = state.lineView === "logistics";
  const focus = focusContext();
  const logistics = state.links
    .filter(visibleLink)
    .map((link) => ({ link, priority: isPriorityLogisticsLink(link, focus) ? 1 : 0 }))
    .sort((a, b) => a.priority - b.priority);
  const power = state.powerLinks
    .filter(visibleLink)
    .map((link) => ({ link, priority: isPriorityPowerLink(link, focus) ? 1 : 0 }))
    .sort((a, b) => a.priority - b.priority);
  for (const item of logistics) {
    const link = item.link;
    const from = nodeById(link.fromNode);
    const to = nodeById(link.toNode);
    if (!from || !to) continue;
    const points = logisticsPathPoints(link);
    const d = pathFor(points);
    const selectedIds = selectedNodeIds();
    const related = selectedIds.length && (selectedIds.includes(link.fromNode) || selectedIds.includes(link.toNode));
    const unrelatedSelected = selectedIds.length && !related;
    const focusDimmed = focus && !focus.logisticsLinkIds.has(link.id);
    const health = logisticsLinkHealth(link);
    appendPath(d, "link-hit", link.id);
    const upgrading = link.upgradeFlashUntil && performance.now() < link.upgradeFlashUntil;
    appendPath(d, `link link-level-${logisticsLineLevel(link)} ${health} ${upgrading ? "upgrade-flash-line" : ""} ${fadeLogistics || unrelatedSelected || focusDimmed ? "muted-line" : ""} ${focusDimmed ? "focus-dimmed-line" : ""} ${link.id === state.selectedLinkId ? "selected" : ""} ${related ? "related" : ""}`, link.id, link.resource);
    renderPackets(link, points, fadeLogistics || unrelatedSelected || focusDimmed, focusDimmed);
  }
  for (const item of power) {
    const link = item.link;
    const from = nodeById(link.fromNode);
    const to = nodeById(link.toNode);
    if (!from || !to) continue;
    const points = powerPathPoints(portPosition(from, "power-out", link.fromPort || 0), portPosition(to, "power-in", 0));
    const d = pathFor(points);
    const selectedIds = selectedNodeIds();
    const related = selectedIds.length && (selectedIds.includes(link.fromNode) || selectedIds.includes(link.toNode));
    const focusDimmed = focus && !focus.powerLinkIds.has(link.id);
    appendPath(d, `link power-glow ${fadePower || focusDimmed ? "muted-line" : ""} ${focusDimmed ? "focus-dimmed-line" : ""} ${link.overloaded ? "overloaded" : ""}`);
    appendPath(d, "link-hit", link.id, null, "power");
    appendPath(d, `link power ${fadePower || focusDimmed ? "muted-line" : ""} ${focusDimmed ? "focus-dimmed-line" : ""} ${link.overloaded ? "overloaded" : ""} ${link.id === state.selectedLinkId && state.selectedLinkType === "power" ? "selected" : ""} ${related ? "related" : ""}`, link.id, null, "power");
    renderPowerPackets(link, points, fadePower || focusDimmed, focusDimmed);
  }
  if (state.dragLink) {
    const from = nodeById(state.dragLink.fromNode);
    if (from) {
      const side = state.dragLink.type === "power" ? "power-out" : "out";
      const start = portPosition(from, side, state.dragLink.fromPort);
      const points = state.dragLink.type === "power" ? powerPathPoints(start, state.pointer) : pathPoints(start, state.pointer);
      appendPath(pathFor(points), `link preview ${state.dragLink.type === "power" ? "power" : ""}`);
    }
  }
}

function isPriorityLogisticsLink(link, focus) {
  return link.id === state.selectedLinkId || Boolean(focus?.logisticsLinkIds.has(link.id));
}

function isPriorityPowerLink(link, focus) {
  return link.id === state.selectedLinkId || Boolean(focus?.powerLinkIds.has(link.id));
}

function logisticsLinkHealth(link) {
  if (link.packets.length >= logisticsPacketLimit(link)) return "logistics-danger";
  if (link.packets.length >= logisticsWarnPacketLimit(link)) return "logistics-warn";
  return "";
}

function renderLinkMarkers() {
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <marker id="logistics-arrow" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#8bc7ec"></path>
    </marker>
    <marker id="logistics-arrow-muted" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#4d6f85"></path>
    </marker>
  `;
  linksLayer.appendChild(defs);
}

function renderSelectionBox() {
  document.querySelector(".selection-box")?.remove();
  if (!state.selectionBox) return;
  const rect = selectionRect(state.selectionBox.start, state.selectionBox.current);
  const box = document.createElement("div");
  box.className = "selection-box";
  box.style.left = `${rect.x * state.viewport.scale + state.viewport.x}px`;
  box.style.top = `${rect.y * state.viewport.scale + state.viewport.y}px`;
  box.style.width = `${rect.width * state.viewport.scale}px`;
  box.style.height = `${rect.height * state.viewport.scale}px`;
  canvas.appendChild(box);
}

function selectionRect(a, b) {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return {
    x,
    y,
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y)
  };
}

function nodeIntersectsRect(node, rect) {
  const nodeRect = { x: node.x, y: node.y, width: 166, height: 112 };
  return nodeRect.x < rect.x + rect.width
    && nodeRect.x + nodeRect.width > rect.x
    && nodeRect.y < rect.y + rect.height
    && nodeRect.y + nodeRect.height > rect.y;
}

function linkPoints(link) {
  return logisticsPathPoints(link);
}

function appendPath(d, className, linkId = null, resource = null, linkType = "logistics") {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  path.setAttribute("class", className);
  if (linkType === "logistics" && linkId && !className.includes("hit") && !className.includes("preview")) {
    const link = state.links.find((item) => item.id === linkId);
    const config = logisticsLineConfig(link);
    path.style.stroke = logisticsLinkColor(link);
    path.style.strokeWidth = config.width;
  } else if (resource && !className.includes("hit")) {
    path.style.stroke = resourceColor(resource);
  }
  if (linkType === "logistics" && !className.includes("hit") && !className.includes("preview")) {
    path.setAttribute("marker-end", className.includes("muted-line") ? "url(#logistics-arrow-muted)" : "url(#logistics-arrow)");
  }
  if (linkId) {
    path.dataset.linkId = linkId;
    path.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      state.selectedLinkId = linkId;
      state.selectedLinkType = linkType;
      state.selectedId = null;
      state.selectedIds = [];
      setStatus("已选中连线，可按 Delete 删除", "ok");
      render();
    });
  }
  linksLayer.appendChild(path);
}

function renderPackets(link, points, muted = false, focusDimmed = false) {
  const config = logisticsLineConfig(link);
  const length = polylineLength(points);
  const packets = link.packets
    .map((packet) => ({ packet, distance: clamp(packet.distance || packet.progress * length || 0, 0, length * 0.985) }))
    .sort((a, b) => a.distance - b.distance);
  let previousDistance = -LOGISTICS_PACKET_SPACING;
  for (const item of packets) {
    const visualDistance = Math.max(item.distance, previousDistance + LOGISTICS_PACKET_SPACING);
    previousDistance = Math.min(visualDistance, length * 0.985);
    const point = pointOnPolylineDistance(points, previousDistance);
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", point.x);
    circle.setAttribute("cy", point.y);
    circle.setAttribute("r", config.packetRadius || 5);
    circle.setAttribute("class", `packet packet-level-${logisticsLineLevel(link)} ${muted ? "muted-line" : ""} ${focusDimmed ? "focus-dimmed-packet" : ""}`);
    circle.setAttribute("fill", resourceColor(item.packet.resource));
    linksLayer.appendChild(circle);
  }
}

function renderPowerPackets(link, points, muted = false, focusDimmed = false) {
  const from = nodeById(link.fromNode);
  if (!from?.generating && !from?.powered) return;
  const length = polylineLength(points);
  const base = ((performance.now() / 1000) * 180) % length;
  for (let i = 0; i < 3; i += 1) {
    const distance = (base + i * (length / 3)) % length;
    const point = pointOnPolylineDistance(points, distance);
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", point.x);
    circle.setAttribute("cy", point.y);
    circle.setAttribute("r", 3.5);
    circle.setAttribute("class", `power-packet ${muted ? "muted-line" : ""} ${focusDimmed ? "focus-dimmed-packet" : ""}`);
    linksLayer.appendChild(circle);
  }
}

function renderInspector() {
  if (!state.selectedId && state.selectedIds.length === 1) {
    state.selectedId = state.selectedIds[0];
  }
  if (state.selectedIds.length > 1) {
    renderMultiSelectionInspector();
    return;
  }
  const node = nodeById(state.selectedId);
  if (!node) {
    renderLinkInspector();
    return;
  }
  const type = nodeTypes[node.kind];
  const runState = nodeRunState(node);
  const inputCount = state.links.filter((link) => link.toNode === node.id).length;
  const outputCount = state.links.filter((link) => link.fromNode === node.id).length;
  const groupActions = node.kind === "group" ? `
    <div class="cache-actions">
      <button id="enter-group" type="button">进入分组</button>
      <button id="ungroup-node" class="danger" type="button">取消分组</button>
    </div>
  ` : "";
  const exitGroupAction = state.activeGroupId ? `<button class="inspector-action" id="exit-group" type="button">返回上级画布</button>` : "";
  inspector.innerHTML = `
    <div class="info-row"><span>名称</span><b>${nodeTitle(node)}</b></div>
    <div class="info-row"><span>定位</span><b>${Math.round(node.x)}, ${Math.round(node.y)}</b></div>
    <div class="info-row"><span>输入连接</span><b>${inputCount}/${activeInputs(node)}${type.maxInputs ? `（可扩展 ${type.maxInputs}）` : ""}</b></div>
    <div class="info-row"><span>输出连接</span><b>${outputCount}/${activeOutputs(node)}</b></div>
    ${nodeTypes[node.kind].powerIn ? `<div class="info-row"><span>电力状态</span><b>${node.powered ? "已供电" : "未供电"}</b></div>` : ""}
    ${node.kind === "generator" ? `<div class="info-row"><span>发电状态</span><b>${node.generating ? `${nodeGeneration(node)} 电力` : "缺少煤矿"}</b></div>` : ""}
    ${node.kind === "source" ? `<div class="info-row"><span>矿源总量</span><b>${Math.floor(node.reserve)}</b></div>` : ""}
    ${recipeControlHtml(node)}
    ${warehouseControlHtml(node)}
    <div class="info-row"><span>输入缓存</span><b>${storeText(node.inputStore)}</b></div>
    <div class="info-row"><span>输出缓存</span><b>${storeText(outputStoreFor(node))}</b></div>
    ${activeRecipe(node) ? `<div class="info-row"><span>生产状态</span><b>${node.status} ${Math.floor(node.progress * 100)}%</b></div>` : ""}
    ${activeRecipe(node) ? `<div class="info-row"><span>效率</span><b>${node.powered && recipePowerMode(node) === "optional" ? "150%" : "100%"}</b></div>` : ""}
    ${node.kind === "assembler" ? `<div class="info-row"><span>机械核心</span><b>${mechanicalCoreTotal()}/10</b></div>` : ""}
    <div class="info-row"><span>容量</span><b>${Math.floor(storeTotal(node.inputStore))}/${node.capacity}</b></div>
    <div class="info-row"><span>5秒均值</span><b>${logisticsAverageThroughput().toFixed(1)} / 秒</b></div>
    <div class="info-row"><span>电网</span><b>${state.power.demand}/${state.power.generation}（${state.power.load}%）${powerLoadStatus(state.power.load, state.power.overload, state.power.generation).text}</b></div>
    <div class="cache-actions">
      <button data-cache-action="input" type="button">清空输入</button>
      <button data-cache-action="output" type="button">清空输出</button>
    </div>
    ${node.kind === "group" ? groupSummaryHtml(node) : ""}
    ${groupActions}
    ${exitGroupAction}
    <button class="inspector-action danger" id="delete-selected-node" type="button">删除选中节点</button>
  `;
  document.querySelector("#delete-selected-node").addEventListener("click", deleteSelectedNode);
  document.querySelector("#enter-group")?.addEventListener("click", () => enterGroup(node.id));
  document.querySelector("#ungroup-node")?.addEventListener("click", () => ungroupNode(node.id));
  document.querySelector("#exit-group")?.addEventListener("click", exitGroup);
  const recipeButton = document.querySelector("#open-recipe-dialog");
  if (recipeButton) recipeButton.addEventListener("click", () => openRecipeDialog(node.id));
  document.querySelectorAll("[data-warehouse-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const [side, rawIndex] = button.dataset.warehouseToggle.split(":");
      const index = Number(rawIndex);
      const list = side === "in" ? node.inputOpen : node.outputOpen;
      list[index] = !list[index];
      setStatus(`仓库${side === "in" ? "输入" : "输出"}口 ${index + 1} 已${list[index] ? "开启" : "关闭"}`, "ok");
      render();
    });
  });
  document.querySelectorAll("[data-output-limit]").forEach((input) => {
    bindWarehouseLimitSlider(node, input);
    input.addEventListener("change", () => {
      const index = Number(input.dataset.outputLimit);
      node.outputLimits[index] = Math.max(0, Number(input.value) || 0);
      setStatus(`仓库输出口 ${index + 1} 限流已更新`, "ok");
    });
  });
  document.querySelectorAll("[data-cache-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.cacheAction === "input") {
        node.inputStore = {};
        if (node.kind === "warehouse") node.warehouseResource = null;
      } else {
        node.outputStore = {};
      }
      node.progress = 0;
      setStatus(`${nodeTitle(node)} 缓存已清空`, "ok");
      render();
    });
  });
}

function renderMultiSelectionInspector() {
  const nodes = state.selectedIds.map(nodeById).filter(Boolean);
  const powerNodes = nodes.filter((node) => nodeTypes[node.kind].powerIn || nodeTypes[node.kind].powerOut).length;
  const logisticsLinks = state.links.filter((link) => state.selectedIds.includes(link.fromNode) || state.selectedIds.includes(link.toNode)).length;
  const powerLinks = state.powerLinks.filter((link) => state.selectedIds.includes(link.fromNode) || state.selectedIds.includes(link.toNode)).length;
  inspector.innerHTML = `
    <button class="inspector-action primary" id="create-group" type="button">创建封装分组</button>
    <div class="info-row"><span>已选节点</span><b>${nodes.length}</b></div>
    <div class="info-row"><span>电力节点</span><b>${powerNodes}</b></div>
    <div class="info-row"><span>相关物流线</span><b>${logisticsLinks}</b></div>
    <div class="info-row"><span>相关电力线</span><b>${powerLinks}</b></div>
    <div class="info-row"><span>批量操作</span><b>拖动任一选中节点可整体移动</b></div>
    ${state.activeGroupId ? `<button class="inspector-action" id="exit-group" type="button">返回上级画布</button>` : ""}
    <button class="inspector-action danger" id="delete-selected-node" type="button">删除选中节点</button>
  `;
  document.querySelector("#delete-selected-node").addEventListener("click", deleteSelectedNode);
  document.querySelector("#create-group")?.addEventListener("click", createGroupFromSelection);
  document.querySelector("#exit-group")?.addEventListener("click", exitGroup);
}

function groupSummaryHtml(group) {
  const data = rebuildGroupInterfaces(group);
  const inputs = data.inputs.map((item) => `${item.groupPort + 1}:${item.resource ? resourceName(item.resource) : "待锁定"}`).join(" / ") || "无";
  const outputs = data.outputs.map((item) => `${item.groupPort + 1}:${item.resource ? resourceName(item.resource) : "待锁定"}`).join(" / ") || "无";
  return `
    <div class="info-row"><span>组内节点</span><b>${data.children.length}</b></div>
    <div class="info-row"><span>分组输入</span><b>${inputs}</b></div>
    <div class="info-row"><span>分组输出</span><b>${outputs}</b></div>
    <div class="info-row"><span>分组电力</span><b>${data.powerInput ? "已声明" : "无"}</b></div>
  `;
}

function statusLabelForInspector(key) {
  return {
    idle: "未启动",
    running: "启动",
    paused: "暂停",
    warn: "异常",
    danger: "异常",
    off: "离线"
  }[key] || "未启动";
}

function pauseReasonForInspector(node) {
  const runState = nodeRunState(node);
  if (runState.key !== "paused") return "";
  if (node.kind === "group") return "组内有暂停节点";
  if (nodeTypes[node.kind]?.adapter) return adapterHasBlockedOutput(node) ? "接口堵塞" : "等待连接";
  if (node.kind === "source") return node.reserve <= 0 ? "矿源耗尽" : "未接输出";
  if (node.kind === "warehouse") {
    if (storeTotal(node.inputStore) >= node.capacity) return "仓库已满";
    if (!state.links.some((link) => link.fromNode === node.id || link.toNode === node.id)) return "未接线路";
    return "等待资源";
  }
  if (node.kind === "generator") return (node.inputStore.coal || 0) > 0 ? "未接电网" : "缺少煤矿";
  if (node.kind === "miner") {
    if (storeTotal(node.outputStore) >= node.capacity) return "输出堵塞";
    if (!state.links.some((link) => link.toNode === node.id)) return "未接矿源";
    return "缺少矿源";
  }
  const recipe = activeRecipe(node);
  if (recipe) {
    if (storeTotal(node.outputStore) >= node.capacity) return "输出堵塞";
    if (recipeRequiresPower(node, recipe) && !node.powered) return "等待电力";
    const missing = Object.entries(recipe.inputs)
      .filter(([key, amount]) => (node.inputStore[key] || 0) < amount)
      .map(([key]) => resourceName(key));
    if (missing.length) return `缺少${missing.join("、")}`;
    if (!state.links.some((link) => link.toNode === node.id)) return "未接输入";
    return "等待材料";
  }
  if ((nodeTypes[node.kind].powerIn || nodeTypes[node.kind].powerOut) && !node.powered) return "未接电力";
  return "暂停";
}

function inspectorTagsHtml(node, runState) {
  const tags = [{ text: statusLabelForInspector(runState.key), type: runState.key }];
  const reason = pauseReasonForInspector(node);
  if (reason) tags.push({ text: reason, type: "reason" });
  if (nodeTypes[node.kind]?.powerIn) tags.push({ text: node.powered ? "已供电" : "未供电", type: node.powered ? "running" : "danger" });
  if (node.kind === "source" && node.reserve <= 0) tags.push({ text: "消耗殆尽", type: "danger" });
  return `<div class="inspector-tags">${tags.map((tag) => `<span class="inspector-tag ${tag.type}">${tag.text}</span>`).join("")}</div>`;
}

function storeVisualRows(store, capacity = DEVICE_CAPACITY) {
  const entries = Object.entries(store || {}).filter(([, amount]) => amount > 0.001);
  if (!entries.length) return `<div class="resource-empty-row">空</div>`;
  const max = Math.max(capacity || DEVICE_CAPACITY, ...entries.map(([, amount]) => amount), 1);
  return entries.map(([resource, amount]) => {
    const width = Math.min(100, Math.max(2, Math.round((amount / max) * 100)));
    const amountText = Number.isInteger(amount) ? amount : amount.toFixed(1);
    return `
      <div class="resource-visual-row">
        <div class="resource-visual-top">
          <i style="background:${resourceColor(resource)}"></i>
          <span>${resourceName(resource)}</span>
          <b>${amountText}</b>
        </div>
        <div class="resource-visual-bar" style="color:${resourceColor(resource)}"><i style="width:${width}%"></i></div>
      </div>
    `;
  }).join("");
}

function inspectorResourceSection(title, store, capacity) {
  return `
    <div class="inspector-section">
      <div class="inspector-section-title">
        <span>${title}</span>
        <small>${Math.floor(storeTotal(store || {}))}/${capacity || DEVICE_CAPACITY}</small>
      </div>
      <div class="resource-visual-list">${storeVisualRows(store, capacity)}</div>
    </div>
  `;
}

function recipeInputSlotsSection(node) {
  const recipe = activeRecipe(node);
  if (!recipe) return inspectorResourceSection("输入缓存", node.inputStore, node.capacity);
  const rows = Object.entries(recipe.inputs).map(([resource, required]) => {
    const amount = node.inputStore[resource] || 0;
    const limit = recipeInputLimit(recipe, resource);
    const width = Math.min(100, Math.round((amount / Math.max(1, limit)) * 100));
    const stateText = amount < required ? "缺料" : amount >= limit ? "已满" : `${Math.floor(amount)} / ${limit}`;
    return `
      <div class="resource-visual-row">
        <div class="resource-visual-top">
          <i style="background:${resourceColor(resource)}"></i>
          <span>${resourceName(resource)}</span>
          <b>${stateText}</b>
        </div>
        <div class="resource-visual-bar" style="color:${resourceColor(resource)}"><i style="width:${width}%"></i></div>
      </div>
    `;
  }).join("");
  return `
    <div class="inspector-section">
      <div class="inspector-section-title">
        <span>配方缓存</span>
        <small>${RECIPE_INPUT_BUFFER_BATCHES} 批材料槽</small>
      </div>
      <div class="resource-visual-list">${rows}</div>
    </div>
  `;
}

function productionVisualHtml(node) {
  if (node.kind === "source") {
    const ratio = sourceReserveRatio(node);
    return `
      <div class="inspector-section">
        <div class="inspector-section-title"><span>矿源余量</span><small>${Math.floor(node.reserve)}/${node.initialReserve || SOURCE_RESERVE_MAX}</small></div>
        <div class="inspector-progress"><i style="width:${Math.round(ratio * 100)}%; background:${sourceReserveColor(node)}"></i></div>
      </div>
    `;
  }
  const recipe = activeRecipe(node);
  if (recipe) {
    const powerSpeed = node.powered && recipePowerMode(node, recipe) === "optional" ? 1.5 : 1;
    const speedPercent = Math.round(powerSpeed * nodeProductionSpeedMultiplier(node) * 100);
    return `
      <div class="inspector-section">
        <div class="inspector-section-title"><span>生产进度</span><small>${recipe.name}</small></div>
        <div class="inspector-progress"><i style="width:${Math.round((node.progress || 0) * 100)}%"></i></div>
        <div class="connection-pills">
          <div class="connection-pill"><span>产物</span><b>${resourceName(recipe.output)}</b></div>
          <div class="connection-pill"><span>效率</span><b>${speedPercent}%</b></div>
        </div>
      </div>
    `;
  }
  if (node.kind === "miner") {
    const rate = nodeMinerRate(node);
    const speedPercent = Math.round((rate / Math.max(MINER_OUTPUT_PER_SECOND, 0.001)) * 100);
    return `
      <div class="inspector-section">
        <div class="inspector-section-title"><span>采矿进度</span><small>${node.miningResource ? resourceName(node.miningResource) : "等待矿源"}</small></div>
        <div class="inspector-progress"><i style="width:${Math.round((node.progress || 0) * 100)}%"></i></div>
        <div class="connection-pills">
          <div class="connection-pill"><span>采矿速度</span><b>${rate.toFixed(2)}/秒</b></div>
          <div class="connection-pill"><span>效率</span><b>${speedPercent}%</b></div>
        </div>
      </div>
    `;
  }
  if (node.kind === "generator") {
    return `
      <div class="inspector-section">
        <div class="inspector-section-title"><span>发电状态</span><small>${node.generating ? "正在供电" : "等待燃料"}</small></div>
        <div class="connection-pills">
          <div class="connection-pill"><span>输出</span><b>${nodeGeneration(node)}</b></div>
          <div class="connection-pill"><span>煤矿</span><b>${Math.floor(node.inputStore.coal || 0)}</b></div>
        </div>
      </div>
    `;
  }
  return "";
}

function powerVisualHtml(node) {
  if (!nodeTypes[node.kind].powerIn && !nodeTypes[node.kind].powerOut && node.kind !== "group") return "";
  const incoming = state.powerLinks.find((link) => link.toNode === node.id);
  const outgoing = state.powerLinks.filter((link) => link.fromNode === node.id);
  const outLoad = outgoing.reduce((sum, link) => sum + (link.load || 0), 0);
  return `
    <div class="inspector-section">
      <div class="inspector-section-title"><span>电力</span><small>${node.powered || node.generating ? "在线" : "离线"}</small></div>
      <div class="connection-pills">
        <div class="connection-pill"><span>输入负载</span><b>${incoming ? `${incoming.load || 0}/${incoming.capacity}` : "无"}</b></div>
        <div class="connection-pill"><span>输出负载</span><b>${outLoad}</b></div>
      </div>
    </div>
  `;
}

function connectionsVisualHtml(node, inputCount, outputCount) {
  return `
    <div class="inspector-section">
      <div class="inspector-section-title"><span>连接</span><small>${Math.round(node.x)}, ${Math.round(node.y)}</small></div>
      <div class="connection-pills">
        <div class="connection-pill"><span>输入</span><b>${inputCount}/${activeInputs(node)}</b></div>
        <div class="connection-pill"><span>输出</span><b>${outputCount}/${activeOutputs(node)}</b></div>
      </div>
    </div>
  `;
}

function bindInspectorControls(node) {
  document.querySelector("#delete-selected-node")?.addEventListener("click", deleteSelectedNode);
  document.querySelector("#enter-group")?.addEventListener("click", () => enterGroup(node.id));
  document.querySelector("#ungroup-node")?.addEventListener("click", () => ungroupNode(node.id));
  document.querySelector("#exit-group")?.addEventListener("click", exitGroup);
  document.querySelector("#open-recipe-dialog")?.addEventListener("click", () => openRecipeDialog(node.id));
  document.querySelector("#upgrade-node")?.addEventListener("click", () => upgradeNode(node));
  document.querySelectorAll("[data-warehouse-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const [side, rawIndex] = button.dataset.warehouseToggle.split(":");
      const index = Number(rawIndex);
      const list = side === "in" ? node.inputOpen : node.outputOpen;
      list[index] = !list[index];
      setStatus(`仓库${side === "in" ? "输入" : "输出"}口 ${index + 1} 已${list[index] ? "开启" : "关闭"}`, "ok");
      render();
    });
  });
  document.querySelectorAll("[data-output-limit]").forEach((input) => {
    bindWarehouseLimitSlider(node, input);
    input.addEventListener("change", () => {
      const index = Number(input.dataset.outputLimit);
      node.outputLimits[index] = Math.max(0, Number(input.value) || 0);
      setStatus(`仓库输出口 ${index + 1} 限流已更新`, "ok");
    });
  });
  document.querySelectorAll("[data-cache-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.cacheAction === "input") {
        node.inputStore = {};
        if (node.kind === "warehouse") node.warehouseResource = null;
      } else {
        node.outputStore = {};
      }
      node.progress = 0;
      setStatus(`${nodeTitle(node)} 缓存已清空`, "ok");
      render();
    });
  });
}

function renderInspector() {
  if (!state.selectedId && state.selectedIds.length === 1) {
    state.selectedId = state.selectedIds[0];
  }
  if (state.selectedIds.length > 1) {
    renderMultiSelectionInspector();
    return;
  }
  const node = nodeById(state.selectedId);
  if (!node) {
    renderLinkInspector();
    return;
  }
  const type = nodeTypes[node.kind];
  const runState = nodeRunState(node);
  const inputCount = state.links.filter((link) => link.toNode === node.id).length;
  const outputCount = state.links.filter((link) => link.fromNode === node.id).length;
  const groupActions = node.kind === "group" ? `
    <div class="cache-actions">
      <button id="enter-group" type="button">进入分组</button>
      <button id="ungroup-node" class="danger" type="button">取消分组</button>
    </div>
  ` : "";
  const exitGroupAction = state.activeGroupId ? `<button class="inspector-action" id="exit-group" type="button">返回上级画布</button>` : "";
  const groupPanel = node.kind === "group" ? `
    <div class="inspector-section">
      <div class="inspector-section-title"><span>封装端口</span><small>由组内接口节点决定</small></div>
      ${groupInterfacePanelHtml(rebuildGroupInterfaces(node))}
    </div>
  ` : "";
  inspector.innerHTML = `
    <div class="node-inspector-card">
      <div class="node-inspector-head">
        <div>
          <span class="inspector-kicker">${type.name}</span>
          <h3>${nodeTitle(node)}</h3>
        </div>
        <b class="inspector-state ${runState.key}">${statusLabelForInspector(runState.key)}</b>
      </div>
      ${inspectorTagsHtml(node, runState)}
      ${productionVisualHtml(node)}
      ${upgradePanelHtml(node)}
      ${groupPanel}
      ${recipeInputSlotsSection(node)}
      ${inspectorResourceSection("输出缓存", outputStoreFor(node), node.capacity)}
      ${powerVisualHtml(node)}
      ${connectionsVisualHtml(node, inputCount, outputCount)}
      <div class="inspector-detail-actions">
        ${recipeControlHtml(node)}
        ${warehouseControlHtml(node)}
        <div class="cache-actions">
          <button data-cache-action="input" type="button">清空输入</button>
          <button data-cache-action="output" type="button">清空输出</button>
        </div>
        ${groupActions}
        ${exitGroupAction}
        <button class="inspector-action danger" id="delete-selected-node" type="button">删除选中节点</button>
      </div>
    </div>
  `;
  bindInspectorControls(node);
}

function refreshInspectorSafely() {
  try {
    renderInspector();
  } catch (error) {
    console.error(error);
    inspector.innerHTML = `<div class="muted">当前节点信息刷新失败：${error?.message || error}</div>`;
  }
}

function createGroupFromSelection() {
  if (state.activeGroupId) {
    setStatus("第一版暂不支持在分组内部继续创建分组", "error");
    return;
  }
  const ids = selectedNodeIds();
  const selected = ids.map(nodeById).filter(Boolean);
  if (selected.length < 2) {
    setStatus("至少选择 2 个节点才能创建封装分组", "error");
    return;
  }
  if (selected.some((node) => node.kind === "group")) {
    setStatus("第一版暂不支持嵌套分组", "error");
    return;
  }
  const adapterKinds = ["adapter_input", "adapter_output", "adapter_power"];
  for (const kind of adapterKinds) {
    if (selected.filter((node) => node.kind === kind).length > 1) {
      setStatus("每个分组内同类封装节点最多只能有 1 个", "error");
      return;
    }
  }
  const minX = Math.min(...selected.map((node) => node.x));
  const minY = Math.min(...selected.map((node) => node.y));
  const maxX = Math.max(...selected.map((node) => node.x));
  const maxY = Math.max(...selected.map((node) => node.y));
  const group = createNodeRaw("group", null, Math.round((minX + maxX) / 2), Math.max(54, minY - 80));
  group.groupId = null;
  group.capacity = DEVICE_CAPACITY;
  group.groupData = createEmptyGroupData();
  for (const node of selected) {
    node.groupId = group.id;
    node.localX = node.x - group.x;
    node.localY = node.y - group.y;
  }
  const selectedSet = new Set(selected.map((node) => node.id));
  let disconnected = 0;
  for (const link of state.links) {
    const fromInside = selectedSet.has(link.fromNode);
    const toInside = selectedSet.has(link.toNode);
    if (fromInside === toInside) continue;
    const from = nodeById(link.fromNode);
    const to = nodeById(link.toNode);
    if (!fromInside && to?.kind === "adapter_input") {
      link.toNode = group.id;
    } else if (!toInside && from?.kind === "adapter_output") {
      link.fromNode = group.id;
    } else {
      link.broken = true;
      disconnected += 1;
    }
  }
  let removedPower = 0;
  for (const link of state.powerLinks) {
    const fromInside = selectedSet.has(link.fromNode);
    const toInside = selectedSet.has(link.toNode);
    if (fromInside === toInside) continue;
    const to = nodeById(link.toNode);
    if (!fromInside && to?.kind === "adapter_power") {
      link.toNode = group.id;
    } else {
      link.broken = true;
      disconnected += 1;
      removedPower += 1;
    }
  }
  state.links = state.links.filter((link) => !link.broken);
  state.powerLinks = state.powerLinks.filter((link) => !link.broken);
  state.cableStock += removedPower;
  rebuildGroupInterfaces(group);
  setSingleSelection(group.id);
  setStatus(`已创建封装分组：外部端口由组内封装节点控制${disconnected ? `，断开 ${disconnected} 条非封装跨界线` : ""}`, disconnected ? "error" : "ok");
  render();
}

function enterGroup(groupId) {
  const group = nodeById(groupId);
  if (!group || group.kind !== "group") return;
  state.activeGroupId = group.id;
  clearSelection();
  setStatus(`已进入 ${nodeTitle(group)}，封装节点决定外部接口`, "ok");
  render();
}

function exitGroup() {
  state.activeGroupId = null;
  clearSelection();
  setStatus("已返回主画布", "ok");
  render();
}

function ungroupNode(groupId) {
  const group = nodeById(groupId);
  if (!group || group.kind !== "group") return false;
  const data = rebuildGroupInterfaces(group);
  let restored = 0;
  let broken = 0;
  for (const node of groupChildren(group)) {
    node.x = group.x + (node.localX ?? node.x - group.x);
    node.y = group.y + (node.localY ?? node.y - group.y);
    node.groupId = group.groupId || null;
    delete node.localX;
    delete node.localY;
  }
  for (const link of state.links) {
    if (link.toNode === group.id) {
      const map = data.inputs.find((item) => item.groupPort === link.toPort);
      if (map && nodeById(map.adapterNodeId)) {
        link.toNode = map.adapterNodeId;
        link.toPort = map.adapterPort;
        restored += 1;
      } else {
        link.broken = true;
        broken += 1;
      }
    }
    if (link.fromNode === group.id) {
      const map = data.outputs.find((item) => item.groupPort === link.fromPort);
      if (map && nodeById(map.adapterNodeId)) {
        link.fromNode = map.adapterNodeId;
        link.fromPort = map.adapterPort;
        restored += 1;
      } else {
        link.broken = true;
        broken += 1;
      }
    }
  }
  for (const link of state.powerLinks) {
    if (link.toNode === group.id) {
      if (data.powerInput?.adapterNodeId && nodeById(data.powerInput.adapterNodeId)) {
        link.toNode = data.powerInput.adapterNodeId;
        restored += 1;
      } else {
        link.broken = true;
        broken += 1;
      }
    }
  }
  state.links = state.links.filter((link) => !link.broken);
  const removedPower = state.powerLinks.filter((link) => link.broken).length;
  state.powerLinks = state.powerLinks.filter((link) => !link.broken);
  state.cableStock += removedPower;
  state.nodes = state.nodes.filter((node) => node.id !== group.id);
  state.activeGroupId = group.groupId || null;
  clearSelection();
  setStatus(`已取消分组：恢复 ${restored} 条外部线${broken ? `，断开 ${broken} 条缺失接口线` : ""}`, broken ? "error" : "ok");
  render();
  return true;
}

function recipeControlHtml(node) {
  const list = recipes[node.kind];
  if (!list) return "";
  const inputText = storeText(list[node.recipeIndex].inputs);
  return `
    <div class="field-label">当前配方</div>
    <button id="open-recipe-dialog" class="recipe-open-button" type="button">
      <span>${list[node.recipeIndex].name}</span>
      <b>选择</b>
    </button>
    <div class="info-row"><span>配方输入</span><b>${inputText}</b></div>
  `;
}

function recipeGroupName(nodeKind, recipe) {
  if (nodeKind === "furnace" || nodeKind === "kiln") return "冶炼";
  if (nodeKind === "caster") {
    if (recipe.output.includes("plate")) return "板材";
    if (recipe.output.includes("rod")) return "棒材";
    if (recipe.output.includes("wire")) return "线材";
    return "铸造";
  }
  if (nodeKind === "assembler") {
    if (recipe.output.endsWith("_device")) return "设备制造";
    if (recipe.output === "mechanical_core") return "阶段目标";
    if (["gear", "industrial_frame", "power_unit", "cable"].includes(recipe.output)) return "工业零件";
    return "组装";
  }
  return "配方";
}

function recipeInputText(recipe) {
  return Object.entries(recipe.inputs)
    .map(([key, amount]) => `${resourceName(key)} x${amount}`)
    .join(" / ");
}

function recipeOutputText(recipe) {
  return `${resourceName(recipe.output)} x${recipe.amount}`;
}

function recipeMaterialChipsHtml(recipe) {
  return Object.entries(recipe.inputs)
    .map(([key, amount]) => `
      <span class="recipe-chip" style="--chip-color:${resourceColor(key)}">
        <i></i>
        <b>${resourceName(key)}</b>
        <em>x${amount}</em>
      </span>
    `)
    .join("");
}

function recipeOutputBadgeHtml(recipe) {
  return `
    <span class="recipe-output-badge" style="--chip-color:${resourceColor(recipe.output)}">
      <i></i>
      <b>${resourceName(recipe.output)}</b>
      <em>x${recipe.amount}</em>
    </span>
  `;
}

function resourceRoleText(resource) {
  return {
    iron_ore: "基础冶炼原矿",
    copper_ore: "导电材料原矿",
    coal: "燃料和高温还原材料",
    sand: "玻璃原料",
    iron_ingot: "基础金属锭",
    copper_ingot: "导电金属锭",
    steel_ingot: "高强度金属锭",
    glass: "绝缘和封装材料",
    iron_plate: "设备外壳和基础结构件",
    iron_rod: "支架、轴杆和连接件",
    copper_plate: "导电板材",
    copper_rod: "导电杆件",
    copper_wire: "电力与控制线路材料",
    steel_plate: "承重结构和工业外壳",
    steel_rod: "高强度轴杆和传动件",
    gear: "传动机构核心零件",
    industrial_frame: "高级设备骨架",
    power_unit: "供电设备和高级机械组件",
    cable: "电力连接与设备布线",
    mechanical_core: "第一阶段核心目标资源"
  }[resource] || "后续工业链资源";
}

function recipeMaterialDetailText(recipe) {
  return Object.keys(recipe.inputs)
    .map((key) => `${resourceName(key)}：${resourceRoleText(key)}`)
    .join("；");
}

function recipeUsageText(recipe) {
  const deviceKind = deviceFromResource(recipe.output);
  if (deviceKind) return `生产完成后直接进入“${nodeTypes[deviceKind].name}”建筑库存，用于继续扩建产线。`;
  const usages = [];
  for (const [kind, list] of Object.entries(recipes)) {
    for (const item of list) {
      if (item.inputs[recipe.output]) usages.push(`${nodeTypes[kind].name}：${item.name}`);
    }
  }
  if (recipe.output === "mechanical_core") return "第一阶段核心目标资源，累计达到 10 个后完成当前阶段。";
  if (!usages.length) return "当前主要作为阶段储备资源，后续阶段可继续扩展用途。";
  return `可用于 ${usages.slice(0, 4).join("、")}${usages.length > 4 ? " 等配方" : ""}。`;
}

function openRecipeDialog(nodeId) {
  const node = nodeById(nodeId);
  if (!node || !recipes[node.kind]) return;
  setSingleSelection(nodeId);
  renderRecipeDialog(node);
  recipeDialog.showModal();
}

function renderRecipeDialog(node) {
  const list = recipes[node.kind];
  recipeDialogSubtitle.textContent = `${nodeTitle(node)} 当前配方：${activeRecipe(node).name}`;
  const grouped = new Map();
  list.forEach((recipe, index) => {
    const group = recipeGroupName(node.kind, recipe);
    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group).push({ recipe, index });
  });
  recipeDialogContent.innerHTML = [...grouped.entries()].map(([group, items]) => `
    <section class="recipe-group">
      <div class="recipe-group-title">
        <span>${group}</span>
        <b>${items.length} 项蓝图</b>
      </div>
      <div class="recipe-card-grid">
        ${items.map(({ recipe, index }) => `
          <button class="recipe-card ${index === node.recipeIndex ? "active" : ""}" data-recipe-index="${index}" type="button">
            <span class="recipe-card-frame"></span>
            <span class="recipe-card-head">
              <strong>${recipe.name}</strong>
              <em>${index === node.recipeIndex ? "已装配" : "可切换"}</em>
            </span>
            <span class="recipe-flow">
              <span class="recipe-flow-col">
                <b>投入材料</b>
                <span class="recipe-chip-row">${recipeMaterialChipsHtml(recipe)}</span>
              </span>
              <span class="recipe-flow-arrow">→</span>
              <span class="recipe-flow-col output">
                <b>产出</b>
                ${recipeOutputBadgeHtml(recipe)}
              </span>
            </span>
            <span class="recipe-lore">
              <small><b>材料说明</b>${recipeMaterialDetailText(recipe)}</small>
              <small><b>产品作用</b>${recipeUsageText(recipe)}</small>
            </span>
          </button>
        `).join("")}
      </div>
    </section>
  `).join("");
  recipeDialogContent.querySelectorAll("[data-recipe-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = nodeById(state.selectedId);
      if (!selected) return;
      selected.recipeIndex = Number(button.dataset.recipeIndex);
      selected.progress = 0;
      cleanInputForRecipe(selected);
      refreshIncomingRecipeLinks(selected);
      recipeDialog.close();
      setStatus(`${nodeTitle(selected)} 已切换配方：${activeRecipe(selected).name}`, "ok");
      render();
    });
  });
}

function cleanInputForRecipe(node) {
  const recipe = activeRecipe(node);
  if (!recipe) return;
  for (const key of Object.keys(node.inputStore)) {
    if (!recipe.inputs[key]) delete node.inputStore[key];
  }
  clampRecipeInputStore(node);
}

function recipeInputLimit(recipe, resource) {
  const required = recipe?.inputs?.[resource] || 0;
  return required * RECIPE_INPUT_BUFFER_BATCHES;
}

function clampRecipeInputStore(node) {
  const recipe = activeRecipe(node);
  if (!recipe) return;
  for (const key of Object.keys(node.inputStore)) {
    const limit = recipeInputLimit(recipe, key);
    if (!limit) {
      delete node.inputStore[key];
    } else if (node.inputStore[key] > limit) {
      node.inputStore[key] = limit;
    }
  }
}

function compatibleRecipeIndexForResource(node, resource) {
  const list = recipes[node.kind];
  if (!list || !resource) return -1;
  const current = activeRecipe(node);
  if (current?.inputs?.[resource]) return node.recipeIndex;
  if (node.progress > 0.001) return -1;
  const stored = Object.keys(node.inputStore).filter((key) => node.inputStore[key] > 0.05);
  return list.findIndex((recipe) => recipe.inputs[resource] && stored.every((key) => recipe.inputs[key]));
}

function canUseResourceForRecipe(node, resource) {
  return compatibleRecipeIndexForResource(node, resource) >= 0;
}

function ensureRecipeForResource(node, resource) {
  const index = compatibleRecipeIndexForResource(node, resource);
  if (index >= 0 && index !== node.recipeIndex) {
    node.recipeIndex = index;
    node.progress = 0;
    cleanInputForRecipe(node);
    refreshIncomingRecipeLinks(node);
  }
}

function canReceiveResourceType(node, resource, port = 0) {
  if (!node || !resource) return false;
  if (node.kind === "group") {
    const map = groupInputMap(node, port);
    return Boolean(map && (!map.resource || map.resource === resource));
  }
  if (nodeTypes[node.kind]?.adapter) {
    const locked = node.adapterResources?.inputs?.[port] || node.adapterResources?.outputs?.[port];
    return !locked || locked === resource;
  }
  if (node.kind === "miner") return resource.endsWith("_deposit");
  if (node.kind === "warehouse") {
    if (!node.inputOpen[port]) return false;
    const existing = node.warehouseResource || Object.keys(node.inputStore)[0];
    return !existing || existing === resource;
  }
  if (node.kind === "generator") return resource === "coal";
  const recipe = activeRecipe(node);
  if (recipe) return canUseResourceForRecipe(node, resource);
  return true;
}

function refreshIncomingRecipeLinks(node) {
  const recipe = activeRecipe(node);
  if (!recipe) return;
  for (const link of state.links.filter((item) => item.toNode === node.id)) {
    if (link.resource && !recipe.inputs[link.resource]) {
      link.resource = null;
      link.packets = link.packets.filter((packet) => recipe.inputs[packet.resource]);
    }
  }
}

function mechanicalCoreTotal() {
  return Math.floor(state.nodes.reduce((count, node) => count + (node.outputStore.mechanical_core || 0) + (node.inputStore.mechanical_core || 0), 0));
}

function warehouseControlHtml(node) {
  if (node.kind !== "warehouse") return "";
  const inputButtons = node.inputOpen.map((open, index) => `<button class="${open ? "" : "off"}" data-warehouse-toggle="in:${index}" type="button">入${index + 1}</button>`).join("");
  const outputButtons = node.outputOpen.map((open, index) => `<button class="${open ? "" : "off"}" data-warehouse-toggle="out:${index}" type="button">出${index + 1}</button>`).join("");
  const limitInputs = node.outputLimits.map((value, index) => `<label>出${index + 1}<input data-output-limit="${index}" min="0" max="18" step="0.5" type="number" value="${value}"></label>`).join("");
  return `
    <div class="info-row"><span>锁定资源</span><b>${resourceName(node.warehouseResource)}</b></div>
    <div class="warehouse-switches">${inputButtons}${outputButtons}</div>
    <div class="warehouse-limits">${limitInputs}</div>
  `;
}

function warehouseControlHtml(node) {
  if (node.kind !== "warehouse") return "";
  const inputButtons = node.inputOpen.map((open, index) => `<button class="${open ? "" : "off"}" data-warehouse-toggle="in:${index}" type="button">入${index + 1}</button>`).join("");
  const outputButtons = node.outputOpen.map((open, index) => `<button class="${open ? "" : "off"}" data-warehouse-toggle="out:${index}" type="button">出${index + 1}</button>`).join("");
  const limitInputs = node.outputLimits.map((value, index) => {
    const disabled = node.outputOpen[index] ? "" : "disabled";
    const stateText = !node.outputOpen[index] ? "关闭" : value <= 0 ? "暂停" : `${Number(value).toFixed(1)}/秒`;
    return `
      <label class="warehouse-limit-row ${node.outputOpen[index] ? "" : "off"}">
        <span>出${index + 1}</span>
        <input data-output-limit="${index}" min="0" max="18" step="0.5" type="range" value="${value}" ${disabled}>
        <b data-output-limit-value="${index}">${stateText}</b>
      </label>
    `;
  }).join("");
  return `
    <div class="info-row"><span>锁定资源</span><b>${resourceName(node.warehouseResource)}</b></div>
    <div class="warehouse-switches">${inputButtons}${outputButtons}</div>
    <div class="warehouse-limits">${limitInputs}</div>
  `;
}

function outputLimitText(node, index, value = node.outputLimits[index]) {
  if (!node.outputOpen[index]) return "关闭";
  return Number(value) <= 0 ? "暂停" : `${Number(value).toFixed(1)}/秒`;
}

function bindWarehouseLimitSlider(node, input) {
  const index = Number(input.dataset.outputLimit);
  const valueLabel = document.querySelector(`[data-output-limit-value="${index}"]`);
  const sync = () => {
    const value = Math.max(0, Number(input.value) || 0);
    node.outputLimits[index] = value;
    if (valueLabel) valueLabel.textContent = outputLimitText(node, index, value);
  };
  input.addEventListener("input", sync);
  input.addEventListener("change", (event) => {
    sync();
    setStatus(`仓库输出口 ${index + 1} 限流已更新：${outputLimitText(node, index)}`, "ok");
    event.stopImmediatePropagation();
  });
}

function renderLinkInspector() {
  if (!state.selectedLinkId) {
    inspector.innerHTML = state.activeGroupId
      ? `<button class="inspector-action" id="exit-group" type="button">返回上级画布</button>`
      : "当前未选择节点";
    document.querySelector("#exit-group")?.addEventListener("click", exitGroup);
    return;
  }
  const link = state.selectedLinkType === "power"
    ? state.powerLinks.find((item) => item.id === state.selectedLinkId)
    : state.links.find((item) => item.id === state.selectedLinkId);
  const from = link ? nodeById(link.fromNode) : null;
  const to = link ? nodeById(link.toNode) : null;
  if (state.selectedLinkType === "power") {
    inspector.innerHTML = link && from && to
      ? `
        <div class="info-row"><span>类型</span><b>电力线</b></div>
        <div class="info-row"><span>来源</span><b>${nodeTitle(from)}</b></div>
      <div class="info-row"><span>目标</span><b>${nodeTitle(to)}</b></div>
        <div class="info-row"><span>线缆负载</span><b>${link.load || 0}/${link.capacity}</b></div>
        <div class="info-row"><span>电网负载</span><b>${state.power.demand}/${state.power.generation}</b></div>
      `
      : "当前未选择节点";
    return;
  }
  if (link) applyLogisticsLineStats(link);
  const lineConfig = link ? logisticsLineConfig(link) : null;
  const actualEmitRate = link ? logisticsEmitRate(link) : 0;
  const sourceRate = link ? outputPortRate(from, link.fromPort) : 0;
  const lineLoadText = link && link.packets.length >= logisticsPacketLimit(link) ? "堵塞" : link && link.packets.length >= logisticsWarnPacketLimit(link) ? "高负载" : "顺畅";
  inspector.innerHTML = link && from && to
    ? `
      <div class="info-row"><span>类型</span><b>物流连线</b></div>
      <div class="info-row"><span>等级</span><b><i class="line-grade-swatch" style="background:${lineConfig.color}"></i>Lv.${logisticsLineLevel(link)} ${lineConfig.name}</b></div>
        <div class="info-row"><span>来源</span><b>${nodeTitle(from)} 输出 ${(link.fromPort || 0) + 1}</b></div>
      <div class="info-row"><span>目标</span><b>${nodeTitle(to)} 输入 ${link.toPort + 1}</b></div>
      <div class="info-row"><span>锁定资源</span><b>${resourceName(link.resource)}</b></div>
      <div class="info-row"><span>在途容量</span><b>${link.packets.length}/${logisticsPacketLimit(link)}</b></div>
      <div class="info-row"><span>拥堵状态</span><b>${lineLoadText}</b></div>
      <div class="info-row"><span>输出端能力</span><b>${sourceRate} / 秒</b></div>
      <div class="info-row"><span>线路发包</span><b>${link.rate} / 秒</b></div>
      <div class="info-row"><span>实际发包</span><b>${actualEmitRate} / 秒</b></div>
      <div class="info-row"><span>流动速度</span><b>${link.speed} px / 秒</b></div>
      <div class="info-row"><span>已运输</span><b>${Math.floor(link.totalMoved)}</b></div>
      ${logisticsLineUpgradePanelHtml(link)}
    `
    : "当前未选择节点";
  document.querySelector("#upgrade-logistics-link")?.addEventListener("click", () => upgradeLogisticsLink(link));
}

function renderMonitoring() {
  renderGoals();
  renderResourceOverview();
  renderPowerOverview();
  renderLogisticsOverview();
  renderAlerts();
}

function collectResourceTotals() {
  const totals = {};
  for (const node of state.nodes) {
    for (const [key, value] of Object.entries(node.inputStore)) addStore(totals, key, value);
    for (const [key, value] of Object.entries(node.outputStore)) addStore(totals, key, value);
  }
  for (const link of state.links) {
    for (const packet of link.packets) addStore(totals, packet.resource, packet.amount);
  }
  return totals;
}

function resourceTotal(key, totals = collectResourceTotals()) {
  return Math.floor(totals[key] || 0);
}

function addProduction(resource, amount) {
  if (!resource || amount <= 0) return;
  state.productionStats[resource] = (state.productionStats[resource] || 0) + amount;
}

function productionTotal(key, totals = collectResourceTotals()) {
  return Math.floor(Math.max(state.productionStats[key] || 0, totals[key] || 0));
}

function countNodes(kind) {
  return state.nodes.filter((node) => node.kind === kind).length;
}

function hasLogisticsLink(fromKind, toKind, resource = null) {
  return state.links.some((link) => {
    const from = nodeById(link.fromNode);
    const to = nodeById(link.toNode);
    return from?.kind === fromKind && to?.kind === toKind && (!resource || link.resource === resource || from.resource === resource);
  });
}

function goalDefinitions(totals = collectResourceTotals()) {
  return [
    {
      id: "iron_mining",
      title: "建立铁矿采集线",
      detail: "铁矿源 → 采矿机 → 任意接收节点，并累计产出 50 个铁矿。",
      progress: Math.min(50, productionTotal("iron_ore", totals)),
      target: 50,
      done: productionTotal("iron_ore", totals) >= 50,
      reward: { warehouse: 1 }
    },
    {
      id: "iron_ingot",
      title: "稳定生产铁锭",
      detail: "把铁矿和煤矿送入熔炉，累计生产 30 个铁锭。",
      progress: Math.min(30, productionTotal("iron_ingot", totals)),
      target: 30,
      done: productionTotal("iron_ingot", totals) >= 30,
      reward: { furnace: 1 }
    },
    {
      id: "power_grid",
      title: "接入稳定电网",
      detail: "让发电机开始发电，并至少给 1 台设备供电。",
      progress: state.power.generation > 0 && state.power.demand > 0 && !state.power.overload ? 1 : 0,
      target: 1,
      done: state.power.generation > 0 && state.power.demand > 0 && !state.power.overload,
      reward: { cableStock: 6, pole: 2 }
    },
    {
      id: "steel",
      title: "进入钢铁生产",
      detail: "用高温熔炉生产钢锭，并把部分钢锭加工成钢板，累计 20 个钢系材料。",
      progress: Math.min(20, productionTotal("steel_ingot", totals) + productionTotal("steel_plate", totals)),
      target: 20,
      done: productionTotal("steel_ingot", totals) + productionTotal("steel_plate", totals) >= 20,
      reward: { assembler: 1 }
    },
    {
      id: "components",
      title: "准备核心零件",
      detail: "生产齿轮、工业框架和动力组件，为机械核心做准备。",
      progress: ["gear", "industrial_frame", "power_unit"].filter((key) => productionTotal(key, totals) > 0).length,
      target: 3,
      done: productionTotal("gear", totals) > 0 && productionTotal("industrial_frame", totals) > 0 && productionTotal("power_unit", totals) > 0,
      reward: { cableStock: 4 }
    },
    {
      id: "mechanical_core",
      title: "完成第一阶段",
      detail: "累计拥有 10 个机械核心。",
      progress: Math.min(10, productionTotal("mechanical_core", totals)),
      target: 10,
      done: productionTotal("mechanical_core", totals) >= 10,
      reward: {}
    }
  ];
}

function currentGoal(totals = collectResourceTotals()) {
  const goals = goalDefinitions(totals);
  return goals.find((goal) => !goal.done && !state.claimedGoalRewards[goal.id]) || goals[goals.length - 1];
}

function rewardText(reward) {
  const parts = [];
  for (const [key, value] of Object.entries(reward || {})) {
    if (!value) continue;
    if (key === "cableStock") parts.push(`线缆 +${value}`);
    else parts.push(`${nodeTypes[key]?.name || key} +${value}`);
  }
  return parts.join(" / ") || "解锁下一目标";
}

function applyGoalRewards() {
  const totals = collectResourceTotals();
  for (const goal of goalDefinitions(totals)) {
    if (!goal.done || state.claimedGoalRewards[goal.id]) continue;
    for (const [key, value] of Object.entries(goal.reward || {})) {
      if (key === "cableStock") state.cableStock += value;
      else if (state.inventory[key] !== undefined) state.inventory[key] += value;
    }
    state.claimedGoalRewards[goal.id] = true;
    if (goal.id === "mechanical_core") state.completed = true;
    setStatus(`目标完成：${goal.title}，奖励 ${rewardText(goal.reward)}`, "ok");
  }
}

function goalHints(totals = collectResourceTotals()) {
  const hints = [];
  if (!state.nodes.length) hints.push("先放置铁矿源、煤矿源和采矿机。");
  if (countNodes("miner") > 0 && !state.links.some((link) => nodeById(link.fromNode)?.kind === "source" && nodeById(link.toNode)?.kind === "miner")) {
    hints.push("采矿机需要从矿源输入，输出才会产生对应矿物。");
  }
  if (countNodes("furnace") > 0 && productionTotal("iron_ingot", totals) < 30) {
    hints.push("熔炉生产铁锭需要铁矿和煤矿两个输入。");
  }
  if (countNodes("generator") > 0 && state.powerLinks.length > 0 && state.power.generation <= 0) {
    hints.push("发电机需要煤矿输入后才会发电。");
  }
  if (state.power.overload) hints.push("电网超载了，增加发电机或减少接入设备。");
  if (state.cableStock <= 0) hints.push("线缆不足，删除不用的电力线会返还线缆。");
  if (countNodes("warehouse") > 0 && state.nodes.some((node) => node.kind === "warehouse" && node.warehouseResource && storeTotal(node.inputStore) <= 0.01)) {
    hints.push("仓库清空后会自动解除资源锁定，可接收新资源。");
  }
  if (!hints.length) hints.push("当前线路可以运行，继续扩大产能并切换配方推进目标。");
  return hints.slice(0, 3);
}

function renderGoals() {
  const totals = collectResourceTotals();
  const goals = goalDefinitions(totals);
  const goal = currentGoal(totals);
  const index = goals.findIndex((item) => item.id === goal.id);
  const progress = goal.target ? Math.min(100, Math.floor((goal.progress / goal.target) * 100)) : 100;
  if (missionStrip) {
    const nextStep = (goal.steps || []).find((step) => !step.done);
    missionStrip.innerHTML = `
      <div>
        <b>${goal.title}</b>
        <span>${nextStep ? nextStep.text : goal.detail}</span>
      </div>
      <strong>${Math.floor(goal.progress)} / ${goal.target}</strong>
    `;
  }
  goalPanel.innerHTML = `
    <div class="goal-stage">阶段 ${index + 1} / ${goals.length}</div>
    <div class="goal-title">${goal.title}</div>
    <div class="goal-detail">${goal.detail}</div>
    <div class="goal-progress"><span style="width:${progress}%"></span></div>
    <div class="info-row"><span>进度</span><b>${Math.floor(goal.progress)} / ${goal.target}</b></div>
    <div class="info-row"><span>完成奖励</span><b>${rewardText(goal.reward)}</b></div>
    <div class="goal-hints">
      ${goalHints(totals).map((hint) => `<div>${hint}</div>`).join("")}
    </div>
  `;
}

function deviceFromResource(resource) {
  return {
    miner_device: "miner",
    furnace_device: "furnace",
    kiln_device: "kiln",
    caster_device: "caster",
    assembler_device: "assembler",
    generator_device: "generator",
    pole_device: "pole",
    warehouse_device: "warehouse",
    adapter_input_device: "adapter_input",
    adapter_output_device: "adapter_output",
    adapter_power_device: "adapter_power"
  }[resource] || null;
}

const GM_PASSWORD = "111222";

function gmResourceCategory(key) {
  if (key === "cableStock") return "special";
  if (deviceFromResource(key)) return "device";
  if (["iron_ore", "copper_ore", "coal", "sand"].includes(key)) return "ore";
  if (key.includes("ingot") || key.includes("plate") || key.includes("rod") || key === "glass") return "metal";
  return "part";
}

function gmCategoryLabel(category) {
  return {
    all: "全部",
    ore: "矿物",
    metal: "金属",
    part: "中间件",
    device: "设备",
    special: "特殊库存"
  }[category] || category;
}

function gmResourceOptions() {
  return [
    ...Object.keys(resources).map((key) => ({
      key,
      name: resourceName(key),
      color: resourceColor(key),
      category: gmResourceCategory(key)
    })),
    {
      key: "cableStock",
      name: "电力线缆库存",
      color: "#ffe45c",
      category: "special"
    }
  ].sort((a, b) => {
    const order = { ore: 1, metal: 2, part: 3, device: 4, special: 5 };
    return (order[a.category] || 9) - (order[b.category] || 9) || a.name.localeCompare(b.name, "zh-Hans-CN");
  });
}

function renderGmResourceOptions() {
  if (!gmCategorySelect || !gmResourceSelect) return;
  const currentCategory = gmCategorySelect.value || "all";
  const categories = ["all", "ore", "metal", "part", "device", "special"];
  gmCategorySelect.innerHTML = categories.map((category) => `<option value="${category}">${gmCategoryLabel(category)}</option>`).join("");
  gmCategorySelect.value = currentCategory;
  const currentResource = gmResourceSelect.value;
  const options = gmResourceOptions().filter((item) => currentCategory === "all" || item.category === currentCategory);
  gmResourceSelect.innerHTML = options.map((item) => `<option value="${item.key}">${gmCategoryLabel(item.category)} - ${item.name}</option>`).join("");
  if (options.some((item) => item.key === currentResource)) gmResourceSelect.value = currentResource;
  renderGmPreview();
}

function renderGmPreview() {
  if (!gmResourcePreview || !gmResourceSelect) return;
  const item = gmResourceOptions().find((option) => option.key === gmResourceSelect.value);
  if (!item) {
    gmResourcePreview.innerHTML = `<span class="resource-empty">未选择资源</span>`;
    return;
  }
  const target = item.key === "cableStock"
    ? "写入电力线缆库存"
    : deviceFromResource(item.key)
      ? `写入建筑库存：${nodeTypes[deviceFromResource(item.key)]?.name || item.name}`
      : "写入仓库缓存";
  gmResourcePreview.innerHTML = `
    <span class="resource-badge">
      <i style="background:${item.color}"></i>
      <b>${item.name}</b>
      <em>${gmCategoryLabel(item.category)}</em>
    </span>
    <small>${target}</small>
  `;
}

function openGmPasswordGate() {
  const password = window.prompt("请输入 GM 密码");
  if (password === null) return;
  if (password !== GM_PASSWORD) {
    setStatus("GM 密码错误", "error");
    return;
  }
  renderGmResourceOptions();
  gmDialog?.showModal();
}

function warehouseCanAcceptGmResource(node, resource) {
  if (node.kind !== "warehouse") return false;
  const total = storeTotal(node.inputStore) + storeTotal(node.outputStore);
  if (!node.warehouseResource && total <= 0.001) return true;
  return node.warehouseResource === resource;
}

function gmTargetWarehouse(resource) {
  const warehouses = state.nodes.filter((node) => node.kind === "warehouse");
  return warehouses.find((node) => node.warehouseResource === resource)
    || warehouses.find((node) => warehouseCanAcceptGmResource(node, resource))
    || createNodeRaw("warehouse", null, state.viewport.x * -1 / state.viewport.scale + 180, state.viewport.y * -1 / state.viewport.scale + 140);
}

function addGmInventory(resource, amount) {
  const safeAmount = Math.max(1, Math.floor(Number(amount) || 0));
  if (resource === "cableStock") {
    state.cableStock += safeAmount;
    return { target: "电力线缆库存", amount: safeAmount };
  }
  const deviceKind = deviceFromResource(resource);
  if (deviceKind) {
    state.inventory[deviceKind] = (state.inventory[deviceKind] || 0) + safeAmount;
    return { target: `${nodeTypes[deviceKind]?.name || resource}建筑库存`, amount: safeAmount };
  }
  const warehouse = gmTargetWarehouse(resource);
  warehouse.warehouseResource = resource;
  addStore(warehouse.inputStore, resource, safeAmount);
  refreshNodeCapacity(warehouse);
  return { target: nodeTitle(warehouse), amount: safeAmount };
}

function gmAddSelectedResource() {
  const resource = gmResourceSelect?.value;
  if (!resource) return;
  const amount = Math.max(1, Math.floor(Number(gmAmountInput?.value) || 1));
  const result = addGmInventory(resource, amount);
  const text = `已增加 ${resource === "cableStock" ? "电力线缆库存" : resourceName(resource)} x${result.amount} -> ${result.target}`;
  if (gmLog) gmLog.textContent = text;
  setStatus(`GM ${text}`, "ok");
  render();
}

function gmAddBasicSupply() {
  const supply = {
    iron_ore: 300,
    copper_ore: 300,
    coal: 300,
    iron_ingot: 120,
    copper_ingot: 120,
    iron_plate: 80,
    iron_rod: 80,
    copper_wire: 120,
    steel_ingot: 60,
    steel_plate: 40,
    cableStock: 20
  };
  for (const [resource, amount] of Object.entries(supply)) addGmInventory(resource, amount);
  if (gmLog) gmLog.textContent = "已发放基础补给";
  setStatus("GM 已发放基础补给", "ok");
  render();
}

function warehouseHasResource(resource, amount = 1) {
  return state.nodes.some((node) => node.kind === "warehouse" && (node.inputStore[resource] || 0) >= amount);
}

function hasResourceLink(fromKind, toKind, resource = null) {
  return state.links.some((link) => {
    const from = nodeById(link.fromNode);
    const to = nodeById(link.toNode);
    return from?.kind === fromKind && to?.kind === toKind && (!resource || link.resource === resource || from.resource === resource);
  });
}

function hasPoweredIndustryTarget(kind, count = 1) {
  const targets = state.nodes.filter((node) => node.kind === kind && node.powered);
  return targets.length >= count;
}

function groupHasAdapter(kind) {
  return state.nodes.some((group) => group.kind === "group" && adapterNodeInGroup(group, kind));
}

function groupHasDeclaredPorts() {
  return state.nodes.some((group) => {
    if (group.kind !== "group") return false;
    const data = rebuildGroupInterfaces(group);
    return data.inputs.length > 0 && data.outputs.length > 0;
  });
}

function groupHasInputPort() {
  return state.nodes.some((group) => group.kind === "group" && rebuildGroupInterfaces(group).inputs.length > 0);
}

function groupHasOutputPort() {
  return state.nodes.some((group) => group.kind === "group" && rebuildGroupInterfaces(group).outputs.length > 0);
}

function workingGroupSteelLine() {
  return countNodes("group") > 0
    && groupHasDeclaredPorts()
    && productionTotal("steel_ingot") >= 25
    && warehouseHasResource("steel_ingot", 1);
}

function groupPowerConnected() {
  return state.nodes.some((powerAdapter) => {
    if (powerAdapter.kind !== "adapter_power") return false;
    const poweredTargets = state.powerLinks
      .filter((link) => link.fromNode === powerAdapter.id)
      .map((link) => nodeById(link.toNode))
      .filter((node) => node && ["furnace", "kiln"].includes(node.kind));
    return poweredTargets.length >= 3;
  });
}

function castingProgress() {
  const required = ["iron_plate", "iron_rod", "copper_plate", "copper_rod", "copper_wire", "steel_plate", "steel_rod"];
  return {
    required,
    progress: required.reduce((sum, key) => sum + Math.min(50, productionTotal(key)), 0),
    target: required.length * 50,
    done: required.every((key) => productionTotal(key) >= 50)
  };
}

function deviceProductionProgress() {
  const required = ["miner_device", "furnace_device", "warehouse_device", "generator_device"];
  return {
    required,
    progress: required.reduce((sum, key) => sum + Math.min(10, productionTotal(key)), 0),
    target: required.length * 10,
    done: required.every((key) => productionTotal(key) >= 10)
  };
}

function goalStep(id, liveDone, title, why, next, complete, progress = null) {
  return {
    id,
    liveDone: Boolean(liveDone),
    done: Boolean(state.completedGoalSteps[id]) || Boolean(liveDone),
    title,
    text: title,
    why,
    next,
    complete,
    progress
  };
}

function goalProgress(label, value, target) {
  return {
    label,
    value: Math.max(0, Math.floor(value || 0)),
    target: Math.max(1, Math.floor(target || 1))
  };
}

function goalStepProgressHtml(step) {
  const progress = step?.progress;
  if (!progress) {
    return `
      <div class="goal-step-progress ${step?.done ? "done" : ""}">
        <div class="goal-step-progress-top"><span>当前进度</span><b>${step?.done ? "已完成" : "等待完成"}</b></div>
        <div class="goal-step-progress-bar"><i style="width:${step?.done ? 100 : 0}%"></i></div>
      </div>
    `;
  }
  const value = step.done ? progress.target : Math.min(progress.target, progress.value);
  const width = Math.min(100, Math.round((value / progress.target) * 100));
  return `
    <div class="goal-step-progress ${step.done ? "done" : ""}">
      <div class="goal-step-progress-top"><span>当前进度</span><b>${progress.label} ${value} / ${progress.target}</b></div>
      <div class="goal-step-progress-bar"><i style="width:${width}%"></i></div>
    </div>
  `;
}

function goalChapter({ id, title, detail, reward = {}, steps }) {
  const progress = steps.filter((step) => step.done).length;
  return {
    id,
    title,
    detail,
    reward,
    steps,
    progress,
    target: steps.length,
    done: steps.length > 0 && steps.every((step) => step.done),
    activeStep: steps.find((step) => !step.done) || steps[steps.length - 1]
  };
}

function syncGoalStepCompletion(goals) {
  let changed = false;
  for (const goal of goals) {
    for (const step of goal.steps || []) {
      if (step.liveDone && !state.completedGoalSteps[step.id]) {
        state.completedGoalSteps[step.id] = true;
        changed = true;
      }
    }
  }
  return changed;
}

function goalDefinitions(totals = collectResourceTotals()) {
  const cast = castingProgress();
  const devices = deviceProductionProgress();
  const hasIronSource = state.nodes.some((node) => node.kind === "source" && node.resource === "iron_ore");
  const hasCoalSource = state.nodes.some((node) => node.kind === "source" && node.resource === "coal");
  const hasIronFurnaceInput = state.nodes.some((node) => node.kind === "furnace" && (node.inputStore.iron_ore || 0) >= 1);
  const hasCoalFurnaceInput = state.nodes.some((node) => node.kind === "furnace" && (node.inputStore.coal || 0) >= 1);
  const hasKilnIronInput = state.nodes.some((node) => node.kind === "kiln" && (node.inputStore.iron_ingot || 0) >= 1);
  const hasKilnCoalInput = state.nodes.some((node) => node.kind === "kiln" && (node.inputStore.coal || 0) >= 1);
  const hasGroup = countNodes("group") > 0;
  const hasAdapterInput = countNodes("adapter_input") > 0 || groupHasAdapter("adapter_input");
  const hasAdapterOutput = countNodes("adapter_output") > 0 || groupHasAdapter("adapter_output");
  const hasAdapterPower = countNodes("adapter_power") > 0 || groupHasAdapter("adapter_power");
  const castKeys = ["iron_plate", "iron_rod", "copper_wire"];
  const deviceKeys = ["miner_device", "furnace_device", "warehouse_device", "generator_device"];

  return [
    goalChapter({
      id: "chapter_mining",
      title: "章节 1：基础采矿",
      detail: "学会把矿源通过采矿机变成可运输矿物，并用仓库存储。",
      reward: { warehouse: 1, furnace: 1 },
      steps: [
        goalStep("mining.source", hasIronSource, "放置铁矿源", "矿源是原始储量，不会直接变成可加工矿物。", "从底部资源菜单选择铁矿源，放到画布上。", "画布上存在铁矿源。"),
        goalStep("mining.miner", countNodes("miner") > 0, "放置采矿机", "采矿机负责把矿源转成铁矿。", "从生产菜单放置采矿机，放在铁矿源右侧。", "画布上存在采矿机。"),
        goalStep("mining.source_to_miner", hasResourceLink("source", "miner", "iron_ore"), "连接矿源到采矿机", "没有输入矿源时，采矿机不会开采。", "从铁矿源输出口拖线到采矿机输入口。", "铁矿源和采矿机之间存在物流线。"),
        goalStep("mining.warehouse", countNodes("warehouse") > 0, "放置仓库", "仓库用于稳定存储单一资源，避免产物无处可去。", "放置仓库，准备接收采矿机输出。", "画布上存在仓库。"),
        goalStep("mining.store_iron", hasResourceLink("miner", "warehouse", "iron_ore") && productionTotal("iron_ore", totals) >= 30, "把铁矿送入仓库", "最小采矿线是矿源 -> 采矿机 -> 仓库。", "从采矿机输出口连接到仓库输入口，等待铁矿累计到 30。", "累计产出铁矿 30。", goalProgress("铁矿产出", productionTotal("iron_ore", totals), 30))
      ]
    }),
    goalChapter({
      id: "chapter_smelting",
      title: "章节 2：基础熔炼",
      detail: "学会多材料输入：铁矿和煤矿一起进入熔炉，产出铁锭。",
      reward: { miner: 1, furnace: 1, cableStock: 4 },
      steps: [
        goalStep("smelting.furnace", countNodes("furnace") > 0, "放置熔炉", "熔炉把铁矿加工成铁锭。", "从生产菜单放置熔炉，选择铁锭配方。", "画布上存在熔炉。"),
        goalStep("smelting.coal_line", hasCoalSource && productionTotal("coal", totals) >= 10, "建立煤矿线", "铁锭配方需要铁矿和煤，缺煤时熔炉会暂停。", "放置煤矿源和采矿机，让煤进入仓库或熔炉。", "累计产出煤矿 10。", goalProgress("煤矿产出", productionTotal("coal", totals), 10)),
        goalStep("smelting.feed_furnace", hasIronFurnaceInput && hasCoalFurnaceInput, "给熔炉输入铁矿和煤", "多输入设备必须同时满足配方材料。", "把铁矿线和煤矿线都接入熔炉输入口。", "熔炉缓存中同时出现铁矿和煤。"),
        goalStep("smelting.first_ingot", productionTotal("iron_ingot", totals) >= 1, "产出第一块铁锭", "生产结果会从设备输出口进入物流线。", "等待熔炉进度条完成一次。", "累计产出铁锭 1。", goalProgress("铁锭产出", productionTotal("iron_ingot", totals), 1)),
        goalStep("smelting.store_ingot", warehouseHasResource("iron_ingot", 1) && productionTotal("iron_ingot", totals) >= 20, "把铁锭送入仓库", "产物要输出，否则设备会因为输出堵塞停住。", "把熔炉输出接到空仓库，累计铁锭 20。", "仓库收到铁锭，累计产出铁锭 20。", goalProgress("铁锭产出", productionTotal("iron_ingot", totals), 20))
      ]
    }),
    goalChapter({
      id: "chapter_steel",
      title: "章节 3：进阶冶炼",
      detail: "学会前置产物会成为后续产线原料：铁锭 + 煤 -> 钢锭。",
      reward: { kiln: 1, warehouse: 1 },
      steps: [
        goalStep("steel.kiln", countNodes("kiln") > 0, "放置高温熔炉", "高温熔炉用于生产进阶金属。", "从生产菜单放置高温熔炉。", "画布上存在高温熔炉。"),
        goalStep("steel.feed_kiln", hasKilnIronInput && hasKilnCoalInput, "输入铁锭和煤", "钢锭需要铁锭和煤，铁锭不足会拖慢后续产线。", "把铁锭仓库和煤矿线接入高温熔炉。", "高温熔炉缓存中同时出现铁锭和煤。"),
        goalStep("steel.first_steel", productionTotal("steel_ingot", totals) >= 1, "产出第一块钢锭", "钢是后续铸造和组装的重要材料。", "等待高温熔炉完成一次生产。", "累计产出钢锭 1。", goalProgress("钢锭产出", productionTotal("steel_ingot", totals), 1)),
        goalStep("steel.store_steel", warehouseHasResource("steel_ingot", 1) && productionTotal("steel_ingot", totals) >= 15, "把钢锭送入仓库", "稳定存储钢锭，后面才能持续加工。", "把高温熔炉输出接到仓库，累计钢锭 15。", "仓库收到钢锭，累计产出钢锭 15。", goalProgress("钢锭产出", productionTotal("steel_ingot", totals), 15))
      ]
    }),
    goalChapter({
      id: "chapter_group",
      title: "章节 4：封装物流",
      detail: "理解封装输入和封装输出：资源如何进组、产物如何出组。",
      reward: { adapter_input: 1, adapter_output: 1, adapter_power: 1 },
      steps: [
        goalStep("group.create", hasGroup, "创建封装组", "封装组可以把一段产线收进一个大节点里。", "多选一段产线，点击创建分组，然后双击进入组内。", "画布上存在封装组。"),
        goalStep("group.input_adapter", hasAdapterInput, "放置封装输入", "封装输入负责把组外资源送进组内。", "进入组内，放置封装输入节点。", "组内或分组中存在封装输入。"),
        goalStep("group.input_mapping", groupHasInputPort(), "看到输入端口映射", "组外输入 1 会对应组内封装输入的输出 1。", "从组外连接资源到封装组输入口，并观察组内封装输入端口。", "封装组声明出至少一个输入端口。"),
        goalStep("group.output_adapter", hasAdapterOutput && groupHasOutputPort(), "放置并连接封装输出", "封装输出负责把组内产物送回组外。", "在组内放置封装输出，并把组内设备输出接进去。", "封装组声明出至少一个输出端口。"),
        goalStep("group.working", workingGroupSteelLine(), "封装后继续生产", "当组外只需要连接封装组时，这条产线就变成了可复用黑盒。", "让封装组继续输出钢锭到仓库。", "封装后钢锭产量继续增长并进入仓库。", goalProgress("钢锭产出", productionTotal("steel_ingot", totals), 25))
      ]
    }),
    goalChapter({
      id: "chapter_group_power",
      title: "章节 5：封装电力",
      detail: "理解封装电力：组外供电如何进入组内设备。",
      reward: { generator: 1, pole: 2, cableStock: 8 },
      steps: [
        goalStep("group_power.adapter", hasAdapterPower, "放置封装电力", "封装电力负责把组外电力送到组内设备。", "进入组内，放置封装电力节点。", "组内或分组中存在封装电力。"),
        goalStep("group_power.internal_links", groupPowerConnected(), "连接组内设备电力", "封装电力像组内电杆，负责向设备分配电力。", "从封装电力输出连接到组内熔炉或高温熔炉。", "封装电力至少连接到多个组内生产设备。"),
        goalStep("group_power.generator", countNodes("generator") > 0 && productionTotal("coal", totals) > 0, "建立煤电链路", "发电机需要煤矿输入才会发电。", "组外建立煤矿 -> 采矿机 -> 发电机链路。", "画布上有发电机，并且煤矿已经产出。"),
        goalStep("group_power.stable", state.power.generation > 0 && state.power.demand > 0 && !state.power.overload, "给封装组稳定供电", "组外电力输入会进入组内封装电力节点。", "把发电机或电杆连接到封装组电力输入口。", "电网有发电和耗电，并且没有过载。")
      ]
    }),
    goalChapter({
      id: "chapter_casting",
      title: "章节 6：铸造加工",
      detail: "把金属锭加工成板、棒、线，准备进入设备制造。",
      reward: { caster: 2, assembler: 1 },
      steps: [
        goalStep("casting.caster", countNodes("caster") > 0, "放置铸造厂", "铸造厂把金属锭加工成部件材料。", "放置铸造厂，并打开配方选择。", "画布上存在铸造厂。"),
        ...castKeys.map((key) => goalStep(`casting.${key}`, productionTotal(key, totals) >= 50, `累计生产 ${resourceName(key)} 50`, `${resourceName(key)} 是后续设备和核心材料的基础。`, `切换铸造厂配方，建立 ${resourceName(key)} 产线。`, `${resourceName(key)} 累计产出 50。`, goalProgress(`${resourceName(key)}产出`, productionTotal(key, totals), 50)))
      ]
    }),
    goalChapter({
      id: "chapter_assembly",
      title: "章节 7：组装制造",
      detail: "学会设备不是无限免费，需要通过组装厂制造。",
      reward: { assembler: 1, cableStock: 10 },
      steps: [
        goalStep("assembly.assembler", countNodes("assembler") > 0, "放置组装厂", "组装厂用于制造设备和机械核心。", "从生产菜单放置组装厂。", "画布上存在组装厂。"),
        ...deviceKeys.map((key) => goalStep(`assembly.${key}`, productionTotal(key, totals) >= 10, `制造 ${resourceName(key)} 10`, `${resourceName(key)} 会进入建筑库存，用来继续扩建产线。`, `切换组装厂配方，制造 ${resourceName(key)}。`, `${resourceName(key)} 累计产出 10。`, goalProgress(`${resourceName(key)}产出`, productionTotal(key, totals), 10)))
      ]
    }),
    goalChapter({
      id: "chapter_core",
      title: "章节 8：机械核心",
      detail: "整合采矿、熔炼、封装、电力、铸造和组装，完成第一阶段目标。",
      reward: {},
      steps: [
        goalStep("core.materials", ["industrial_frame", "power_unit", "gear", "cable"].every((key) => productionTotal(key, totals) > 0), "准备核心材料", "机械核心需要多条前置产线稳定供应。", "让工业框架、动力组件、齿轮和线缆都开始产出。", "核心材料都有累计产出。"),
        goalStep("core.power", state.power.generation > 0 && !state.power.overload, "保持稳定供电", "机械核心配方需要电力，过载会导致生产停摆。", "扩大发电链路，保持电网不过载。", "电网有发电且没有过载。"),
        goalStep("core.first", productionTotal("mechanical_core", totals) >= 10, "生产第一批机械核心", "第一批核心证明整条工业链已经打通。", "在组装厂选择机械核心配方，累计生产 10。", "机械核心累计产出 10。", goalProgress("机械核心产出", productionTotal("mechanical_core", totals), 10)),
        goalStep("core.scale", productionTotal("mechanical_core", totals) >= 50 && warehouseHasResource("mechanical_core", 1), "扩产到 50 个机械核心", "单产线产能不足时，需要复制多条前置产线。", "扩建矿线、熔炼线、铸造线和组装线，累计机械核心 50。", "机械核心累计产出 50 并进入仓库。", goalProgress("机械核心产出", productionTotal("mechanical_core", totals), 50))
      ]
    })
  ];
}

function currentGoal(totals = collectResourceTotals()) {
  const goals = goalDefinitions(totals);
  return goals.find((goal) => !goal.done && !state.claimedGoalRewards[goal.id]) || goals[goals.length - 1];
}

function rewardText(reward) {
  const parts = [];
  for (const [key, value] of Object.entries(reward || {})) {
    if (!value) continue;
    if (key === "cableStock") parts.push(`线缆 +${value}`);
    else parts.push(`${nodeTypes[key]?.name || key} +${value}`);
  }
  return parts.join(" / ") || "阶段推进";
}

function showGoalReward(goal, nextGoal) {
  if (!goalRewardDialog || !goalRewardTitle || !goalRewardBody) return;
  goalRewardTitle.textContent = goal.title;
  goalRewardBody.innerHTML = `
    <p>${goal.detail}</p>
    <div class="reward-chip-row">
      ${Object.entries(goal.reward || {}).filter(([, value]) => value).map(([key, value]) => `<span class="reward-chip">${key === "cableStock" ? "线缆" : nodeTypes[key]?.name || key} +${value}</span>`).join("") || `<span class="reward-chip">阶段推进</span>`}
    </div>
    ${nextGoal ? `<div class="goal-next-card"><b>下一章节</b><br>${nextGoal.title}<br><span class="muted">${nextGoal.detail}</span></div>` : `<div class="goal-next-card"><b>第一阶段完成</b><br>你已经掌握基础产线、封装、电力、铸造和组装。</div>`}
  `;
  if (!goalRewardDialog.open) goalRewardDialog.showModal();
}

function applyGoalRewards() {
  const totals = collectResourceTotals();
  let goals = goalDefinitions(totals);
  if (syncGoalStepCompletion(goals)) goals = goalDefinitions(totals);
  for (let index = 0; index < goals.length; index += 1) {
    const goal = goals[index];
    if (!goal.done || state.claimedGoalRewards[goal.id]) continue;
    for (const [key, value] of Object.entries(goal.reward || {})) {
      if (key === "cableStock") state.cableStock += value;
      else if (state.inventory[key] !== undefined) state.inventory[key] += value;
    }
    state.claimedGoalRewards[goal.id] = true;
    if (goal.id === "chapter_core") state.completed = true;
    setStatus(`章节完成：${goal.title}，奖励 ${rewardText(goal.reward)}`, "ok");
    showGoalReward(goal, goals[index + 1] || null);
    break;
  }
}

function goalHints(totals = collectResourceTotals()) {
  const goal = currentGoal(totals);
  const step = goal.activeStep;
  const hints = [];
  if (step?.next) hints.push(`下一步：${step.next}`);
  if (step?.why) hints.push(`目标说明：${step.why}`);
  if (state.power.overload) hints.push("电网已超载，增加发电机或减少接入设备。");
  return hints.slice(0, 3);
}

function renderGoals() {
  const totals = collectResourceTotals();
  let goals = goalDefinitions(totals);
  if (syncGoalStepCompletion(goals)) goals = goalDefinitions(totals);
  const goal = currentGoal(totals);
  const index = goals.findIndex((item) => item.id === goal.id);
  const stepIndex = Math.max(0, goal.steps.findIndex((step) => !step.done));
  const activeStep = goal.activeStep;
  const progress = goal.target ? Math.min(100, Math.floor((goal.progress / goal.target) * 100)) : 100;
  if (missionStrip) {
    missionStrip.innerHTML = `
      <div>
        <b>${goal.title}</b>
        <span>${activeStep ? activeStep.title : goal.detail}</span>
      </div>
      <strong>${goal.progress} / ${goal.target}</strong>
    `;
  }
  goalPanel.innerHTML = `
    <div class="goal-stage">章节 ${index + 1} / ${goals.length} · 小任务 ${Math.min(stepIndex + 1, goal.target)} / ${goal.target}</div>
    <div class="goal-title">${goal.title}</div>
    <div class="goal-detail">${goal.detail}</div>
    <div class="goal-progress"><span style="width:${progress}%"></span></div>
    ${activeStep ? `
      <div class="goal-current-step">
        <b>当前目标：${activeStep.title}</b>
        <p><span>目标说明</span>${activeStep.why}</p>
        <p><span>下一步</span>${activeStep.next}</p>
        <p><span>完成条件</span>${activeStep.complete}</p>
        ${goalStepProgressHtml(activeStep)}
        <button class="goal-locate-button" id="locate-current-goal" type="button">定位当前目标</button>
      </div>
    ` : ""}
    <div class="info-row"><span>章节进度</span><b>${goal.progress} / ${goal.target}</b></div>
    <div class="info-row"><span>完成奖励</span><b>${rewardText(goal.reward)}</b></div>
    <div class="goal-checklist">
      ${(goal.steps || []).map((step) => `<div class="${step.done ? "done" : ""}"><i></i><span>${step.title}</span></div>`).join("")}
    </div>
    <div class="goal-hints">
      ${goalHints(totals).map((hint) => `<div>${hint}</div>`).join("")}
    </div>
  `;
  document.querySelector("#locate-current-goal")?.addEventListener("click", locateCurrentGoal);
}

function renderResourceOverview() {
  const totals = collectResourceTotals();
  const keys = Object.keys(resources)
    .filter((key) => (totals[key] || 0) > 0.05 || ["iron_ingot", "steel_plate", "copper_wire", "mechanical_core"].includes(key))
    .slice(0, 12);
  resourceOverview.innerHTML = keys.length
    ? keys.map((key) => `<div class="metric"><span>${resourceName(key)}</span><b>${Math.floor(totals[key] || 0)}</b></div>`).join("")
    : `<div class="muted">暂无流通资源</div>`;
}

function renderPowerOverview() {
  const generation = state.power.generation;
  const demand = state.power.demand;
  const load = Math.min(160, state.power.load || 0);
  const displayLoad = Math.min(100, load);
  const maxPower = Math.max(generation, demand, 1);
  const generationWidth = Math.min(100, Math.round((generation / maxPower) * 100));
  const demandWidth = Math.min(100, Math.round((demand / maxPower) * 100));
  const powerStatus = powerLoadStatus(load, state.power.overload, generation);
  const statusClass = powerStatus.className;
  const statusText = powerStatus.text;
  const lineSlots = state.powerLinks.length
    ? state.powerLinks.map((link) => {
      const to = nodeById(link.toNode);
      const lineDemand = link.load || 0;
      const ratio = link.capacity ? Math.min(1.4, lineDemand / link.capacity) : 0;
      const lineLoad = ratio * 100;
      const level = link.overloaded || lineLoad >= POWER_DANGER_LOAD ? "danger" : lineLoad >= POWER_WARN_LOAD ? "warn" : "ok";
      return `<span class="power-line-cell ${level}" title="${to ? nodeTitle(to) : "失效线路"} ${lineDemand}/${link.capacity}"></span>`;
    }).join("")
    : `<span class="power-line-empty">暂无电力线</span>`;
  powerOverview.innerHTML = `
    <div class="power-dashboard ${statusClass}">
      <div class="power-core" style="--load:${displayLoad}">
        <div class="power-core-ring"></div>
        <div class="power-core-value">
          <strong>${state.power.load}%</strong>
          <span>${statusText}</span>
        </div>
      </div>
      <div class="power-bars">
        <div class="power-bar">
          <span>发电</span>
          <div><i class="gen" style="width:${generationWidth}%"></i></div>
          <b>${generation}</b>
        </div>
        <div class="power-bar">
          <span>耗电</span>
          <div><i class="use" style="width:${demandWidth}%"></i></div>
          <b>${demand}</b>
        </div>
      </div>
      <div class="power-line-grid">
        <div>
          <span>电力线</span>
          <b>${state.powerLinks.length}</b>
        </div>
        <div class="power-line-cells">${lineSlots}</div>
      </div>
      <div class="power-footer">
        <span>线缆库存</span>
        <b>${state.cableStock}</b>
      </div>
    </div>
  `;
}

function powerLoadStatus(load, overloaded, generation) {
  if (overloaded || load >= POWER_OVERLOAD_LOAD) return { className: "danger", text: "已超载" };
  if (load >= POWER_DANGER_LOAD) return { className: "danger", text: "过载" };
  if (load >= POWER_WARN_LOAD) return { className: "warn", text: "高负载" };
  return { className: "ok", text: generation > 0 ? "稳定" : "离线" };
}

function renderLogisticsOverview() {
  const busiest = state.links
    .map((link) => ({ link, cargo: link.packets.reduce((sum, packet) => sum + packet.amount, 0) }))
    .sort((a, b) => b.cargo - a.cargo)[0];
  const busiestFrom = busiest ? nodeById(busiest.link.fromNode) : null;
  const busiestTo = busiest ? nodeById(busiest.link.toNode) : null;
  const busiestText = busiest && busiest.cargo > 0 && busiestFrom && busiestTo
    ? `${nodeTitle(busiestFrom)} → ${nodeTitle(busiestTo)}`
    : "无";
  const average = logisticsAverageThroughput();
  const peak = Math.max(state.logisticsPeak || 0, average);
  const packetCount = state.links.reduce((count, link) => count + link.packets.length, 0);
  const maxPackets = Math.max(1, state.links.reduce((sum, link) => sum + logisticsPacketLimit(link), 0));
  const warnLines = state.links.filter((link) => link.packets.length >= logisticsWarnPacketLimit(link) && link.packets.length < logisticsPacketLimit(link)).length;
  const blockedLines = state.links.filter((link) => link.packets.length >= logisticsPacketLimit(link)).length;
  const efficiency = state.links.length
    ? Math.max(0, Math.min(100, Math.round(100 - blockedLines * 35 - warnLines * 12 - (packetCount / maxPackets) * 18)))
    : 0;
  const statusClass = blockedLines || efficiency <= LOGISTICS_DANGER_EFFICIENCY ? "danger" : warnLines || efficiency <= LOGISTICS_WARN_EFFICIENCY ? "warn" : "ok";
  const statusText = blockedLines || efficiency <= LOGISTICS_DANGER_EFFICIENCY ? "堵塞" : warnLines || efficiency <= LOGISTICS_WARN_EFFICIENCY ? "高负载" : state.links.length ? "顺畅" : "待机";
  const lineCells = state.links.length
    ? state.links.map((link) => {
      const level = link.packets.length >= logisticsPacketLimit(link) ? "danger" : link.packets.length >= logisticsWarnPacketLimit(link) ? "warn" : "ok";
      const from = nodeById(link.fromNode);
      const to = nodeById(link.toNode);
      return `<span class="logistics-line-cell ${level}" title="${from ? nodeTitle(from) : "失效来源"} → ${to ? nodeTitle(to) : "失效目标"} ${link.packets.length}/${logisticsPacketLimit(link)}"></span>`;
    }).join("")
    : `<span class="logistics-line-empty">暂无物流线</span>`;
  const averageWidth = Math.min(100, Math.round((average / Math.max(peak, 1)) * 100));
  const packetWidth = Math.min(100, Math.round((packetCount / maxPackets) * 100));
  logisticsOverview.innerHTML = `
    <div class="logistics-dashboard ${statusClass}">
      <div class="logistics-core" style="--efficiency:${efficiency}">
        <div class="logistics-core-ring"></div>
        <div class="logistics-core-value">
          <strong>${efficiency}%</strong>
          <span>${statusText}</span>
        </div>
      </div>
      <div class="logistics-bars">
        <div class="logistics-bar">
          <span>5秒均值</span>
          <div><i class="avg" style="width:${averageWidth}%"></i></div>
          <b>${average.toFixed(1)}/秒</b>
        </div>
        <div class="logistics-bar">
          <span>在线包</span>
          <div><i class="packets" style="width:${packetWidth}%"></i></div>
          <b>${packetCount}/${maxPackets}</b>
        </div>
      </div>
      <div class="logistics-line-grid">
        <div>
          <span>线路健康</span>
          <b>${state.links.length} 条</b>
        </div>
        <div class="logistics-line-cells">${lineCells}</div>
      </div>
      <div class="logistics-footer">
        <span>峰值 ${peak.toFixed(1)}/秒</span>
        <b>${busiestText}</b>
      </div>
    </div>
  `;
}

function renderLogisticsOverview() {
  const busiest = state.links
    .map((link) => ({ link, cargo: link.packets.reduce((sum, packet) => sum + packet.amount, 0) }))
    .sort((a, b) => b.cargo - a.cargo)[0];
  const busiestFrom = busiest ? nodeById(busiest.link.fromNode) : null;
  const busiestTo = busiest ? nodeById(busiest.link.toNode) : null;
  const busiestText = busiest && busiest.cargo > 0 && busiestFrom && busiestTo
    ? `${nodeTitle(busiestFrom)} -> ${nodeTitle(busiestTo)}`
    : "无";
  const average = logisticsAverageThroughput();
  const peak = Math.max(state.logisticsPeak || 0, average);
  const packetCount = state.links.reduce((count, link) => count + link.packets.length, 0);
  const maxPackets = Math.max(1, state.links.reduce((sum, link) => sum + logisticsPacketLimit(link), 0));
  const warnLines = state.links.filter((link) => link.packets.length >= logisticsWarnPacketLimit(link) && link.packets.length < logisticsPacketLimit(link)).length;
  const blockedLines = state.links.filter((link) => link.packets.length >= logisticsPacketLimit(link)).length;
  const efficiency = state.links.length
    ? Math.max(0, Math.min(100, Math.round(100 - blockedLines * 35 - warnLines * 12 - (packetCount / maxPackets) * 18)))
    : 0;
  const statusClass = blockedLines || efficiency <= LOGISTICS_DANGER_EFFICIENCY ? "danger" : warnLines || efficiency <= LOGISTICS_WARN_EFFICIENCY ? "warn" : "ok";
  const statusText = blockedLines || efficiency <= LOGISTICS_DANGER_EFFICIENCY ? "堵塞" : warnLines || efficiency <= LOGISTICS_WARN_EFFICIENCY ? "高负载" : state.links.length ? "顺畅" : "待机";
  const lineCells = state.links.length
    ? state.links.map((link) => {
      const level = link.packets.length >= logisticsPacketLimit(link) ? "danger" : link.packets.length >= logisticsWarnPacketLimit(link) ? "warn" : "ok";
      const from = nodeById(link.fromNode);
      const to = nodeById(link.toNode);
      return `<span class="logistics-line-cell ${level}" title="${from ? nodeTitle(from) : "失效来源"} -> ${to ? nodeTitle(to) : "失效目标"} ${link.packets.length}/${logisticsPacketLimit(link)}"></span>`;
    }).join("")
    : `<span class="logistics-line-empty">暂无物流线</span>`;
  const averageWidth = Math.min(100, Math.round((average / Math.max(peak, 1)) * 100));
  const packetWidth = Math.min(100, Math.round((packetCount / maxPackets) * 100));
  logisticsOverview.innerHTML = `
    <div class="logistics-dashboard ${statusClass}">
      <div class="logistics-core" style="--efficiency:${efficiency}">
        <div class="logistics-core-ring"></div>
        <div class="logistics-core-value">
          <strong>${efficiency}%</strong>
          <span>线路健康</span>
        </div>
      </div>
      <div class="logistics-bars">
        <div class="logistics-bar">
          <span>5秒吞吐</span>
          <div><i class="avg" style="width:${averageWidth}%"></i></div>
          <b>${average.toFixed(1)}/秒</b>
        </div>
        <div class="logistics-bar">
          <span>在途包</span>
          <div><i class="packets" style="width:${packetWidth}%"></i></div>
          <b>${packetCount}/${maxPackets}</b>
        </div>
      </div>
      <div class="logistics-line-grid">
        <div>
          <span>${statusText}</span>
          <b>${state.links.length} 条</b>
        </div>
        <div class="logistics-line-cells">${lineCells}</div>
      </div>
      <div class="logistics-footer">
        <span>峰值 ${peak.toFixed(1)}/秒</span>
        <b>${busiestText}</b>
      </div>
    </div>
  `;
}

function recordLogisticsThroughput(now, dt) {
  const rate = dt > 0 ? state.totalThroughput / dt : 0;
  state.logisticsHistory.push({ time: now, rate });
  state.logisticsHistory = state.logisticsHistory.filter((entry) => now - entry.time <= 5000);
  state.logisticsPeak = Math.max(state.logisticsPeak || 0, rate);
}

function logisticsAverageThroughput() {
  if (!state.logisticsHistory.length) return 0;
  const total = state.logisticsHistory.reduce((sum, entry) => sum + entry.rate, 0);
  return total / state.logisticsHistory.length;
}

function collectAlerts() {
  const alerts = [];
  if (state.power.overload || state.power.load >= POWER_OVERLOAD_LOAD) {
    alerts.push({ level: "critical", text: `电网已超载 ${state.power.load}%` });
  } else if (state.power.load >= POWER_DANGER_LOAD) {
    alerts.push({ level: "critical", text: `电网过载 ${state.power.load}%` });
  } else if (state.power.generation > 0 && state.power.load >= POWER_WARN_LOAD) {
    alerts.push({ level: "warn", text: `电网高负载 ${state.power.load}%` });
  }
  for (const link of state.powerLinks) {
    if (link.overloaded) alerts.push({ level: "critical", text: `${nodeTitle(nodeById(link.toNode))} 线缆过载`, nodeId: link.toNode });
  }
  for (const node of state.nodes) {
    const hasInputLink = state.links.some((link) => link.toNode === node.id);
    if (activeRecipe(node) && node.status.startsWith("缺少") && hasInputLink) alerts.push({ level: "warn", text: `${nodeTitle(node)} ${node.status}`, nodeId: node.id });
    if (node.status === "输出堵塞") alerts.push({ level: "critical", text: `${nodeTitle(node)} 输出堵塞`, nodeId: node.id });
    if (node.status === "等待电力") alerts.push({ level: "warn", text: `${nodeTitle(node)} 等待电力`, nodeId: node.id });
    if (node.kind === "warehouse" && storeTotal(node.inputStore) >= node.capacity) alerts.push({ level: "critical", text: `${nodeTitle(node)} 已满`, nodeId: node.id });
    if (node.kind === "generator" && state.powerLinks.some((link) => link.fromNode === node.id) && !node.generating) alerts.push({ level: "warn", text: `${nodeTitle(node)} 缺少煤矿`, nodeId: node.id });
  }
  for (const link of state.links) {
    if (link.packets.length >= logisticsPacketLimit(link)) alerts.push({ level: "warn", text: `${nodeTitle(nodeById(link.fromNode))} 线路堵塞`, nodeId: link.toNode });
  }
  if (state.completed) alerts.push({ level: "ok", text: "第一阶段完成：第二时代已解锁" });
  return alerts.slice(0, 10);
}

function renderAlerts() {
  const alerts = collectAlerts().filter((alert) => state.alertFilter === "all" || alert.level === state.alertFilter);
  alertsPanel.innerHTML = alerts.length
    ? alerts.map((alert) => `
      <div class="alert ${alert.level}">
        <span>${alert.text}</span>
        ${alert.nodeId ? `<button data-locate="${alert.nodeId}" type="button">定位</button>` : ""}
      </div>
    `).join("")
    : `<div class="muted">暂无警报</div>`;
  alertsPanel.querySelectorAll("[data-locate]").forEach((button) => {
    button.addEventListener("click", () => {
      setSingleSelection(button.dataset.locate);
      renderInspector();
      renderNodes();
      setStatus("已定位警报节点", "ok");
    });
  });
}

function outputStoreFor(node) {
  if (node.kind === "source") return {};
  if (node.kind === "warehouse") return node.inputStore;
  if (node.kind === "group") {
    const outputAdapter = adapterNodeInGroup(node, "adapter_output");
    return outputAdapter?.outputStore || {};
  }
  return node.outputStore;
}

function outputStoreForLink(node, port = 0) {
  if (nodeTypes[node?.kind]?.adapter) return adapterPortStore(node, "outputs", port);
  if (node?.kind === "group") {
    const map = groupOutputMap(node, port);
    const adapter = map ? nodeById(map.adapterNodeId) : null;
    return adapter ? adapterPortStore(adapter, "outputs", map.adapterPort) : {};
  }
  return outputStoreFor(node);
}

function incomingAmount(nodeId, resource = null, port = null) {
  return state.links.reduce((total, link) => {
    if (link.toNode !== nodeId) return total;
    if (port !== null && link.toPort !== port) return total;
    return total + link.packets.reduce((sum, packet) => {
      if (resource && packet.resource !== resource) return sum;
      return sum + packet.amount;
    }, 0);
  }, 0);
}

function groupAdapterCanReceive(group, resource, amount, port, includeIncoming = false) {
  const map = groupInputMap(group, port);
  const adapter = map ? nodeById(map.adapterNodeId) : null;
  if (!adapter) return false;
  if (map.resource && map.resource !== resource) return false;
  return canReceive(adapter, resource, amount, map.adapterPort, includeIncoming);
}

function canReceive(node, resource, amount, port = 0, includeIncoming = false) {
  if (!canReceiveResourceType(node, resource, port)) return false;
  if (node.kind === "group") return groupAdapterCanReceive(node, resource, amount, port, includeIncoming);
  const incomingTotal = includeIncoming ? incomingAmount(node.id) : 0;
  const incomingResource = includeIncoming ? incomingAmount(node.id, resource) : 0;
  if (nodeTypes[node.kind]?.adapter) {
    const portIncomingTotal = includeIncoming ? incomingAmount(node.id, null, port) : 0;
    const inputPortStore = adapterPortStore(node, "inputs", port);
    const outputPortStore = adapterPortStore(node, "outputs", port);
    return storeTotal(inputPortStore) + portIncomingTotal + amount <= ADAPTER_PORT_CAPACITY
      && storeTotal(outputPortStore) < ADAPTER_PORT_CAPACITY;
  }
  if (node.kind === "miner") {
    if (storeTotal(node.inputStore) + incomingTotal + amount > node.capacity) return false;
    const existing = Object.keys(node.inputStore)[0];
    return !existing || existing === resource;
  }
  if (node.kind === "warehouse") {
    if (storeTotal(node.inputStore) + incomingTotal + amount > node.capacity) return false;
    return true;
  }
  if (node.kind === "generator") {
    return (node.inputStore.coal || 0) + incomingResource + amount <= 120;
  }
  const compatibleIndex = compatibleRecipeIndexForResource(node, resource);
  const recipe = compatibleIndex >= 0 ? recipes[node.kind][compatibleIndex] : activeRecipe(node);
  if (recipe) {
    const perResourceLimit = recipeInputLimit(recipe, resource);
    return (node.inputStore[resource] || 0) + incomingResource + amount <= perResourceLimit;
  }
  if (storeTotal(node.inputStore) + incomingTotal + amount > node.capacity) return false;
  return true;
}

function receiveResource(node, resource, amount, port = 0) {
  if (node.kind === "group") {
    const map = groupInputMap(node, port);
    const adapter = map ? nodeById(map.adapterNodeId) : null;
    if (adapter) receiveResource(adapter, resource, amount, map.adapterPort);
    return;
  }
  lockAdapterResource(node, "inputs", port, resource);
  ensureRecipeForResource(node, resource);
  if (node.kind === "warehouse" && !node.warehouseResource) {
    node.warehouseResource = resource;
  }
  if (nodeTypes[node.kind]?.adapter) {
    rebindAdapterPort(node, port, resource);
    addStore(adapterPortStore(node, "inputs", port), resource, amount);
  }
  addStore(node.inputStore, resource, amount);
}

function lockAdapterResource(node, side, port, resource) {
  if (!nodeTypes[node?.kind]?.adapter || !resource) return;
  rebindAdapterPort(node, port, resource);
}

function isOutputUsed(nodeId, port) {
  return state.links.some((link) => link.fromNode === nodeId && link.fromPort === port);
}

function isInputUsed(nodeId, port) {
  return state.links.some((link) => link.toNode === nodeId && link.toPort === port);
}

function isPowerInputUsed(nodeId) {
  return state.powerLinks.some((link) => link.toNode === nodeId);
}

function isPowerOutputUsed(nodeId, port) {
  return state.powerLinks.some((link) => link.fromNode === nodeId && (link.fromPort || 0) === port);
}

function startNodeDrag(event) {
  if (event.target.closest(".node-recipe-switch")) return;
  if (event.target.classList.contains("port") || event.button !== 0) return;
  event.stopPropagation();
  const node = nodeById(event.currentTarget.dataset.id);
  if (!node) return;
  if (event.shiftKey || event.ctrlKey || event.metaKey) {
    toggleNodeSelection(node.id);
    refreshInspectorSafely();
    renderNodes();
    window.addEventListener("pointerup", () => setTimeout(render, 0), { once: true });
    return;
  }
  if (!isNodeSelected(node.id)) setSingleSelection(node.id);
  refreshInspectorSafely();
  renderNodes();
  const movingIds = selectedNodeIds();
  const startPositions = movingIds
    .map((id) => nodeById(id))
    .filter(Boolean)
    .map((item) => ({ id: item.id, x: item.x, y: item.y }));
  const start = { x: event.clientX, y: event.clientY };
  const move = (moveEvent) => {
    const rect = canvas.getBoundingClientRect();
    const dx = (moveEvent.clientX - start.x) / state.viewport.scale;
    const dy = (moveEvent.clientY - start.y) / state.viewport.scale;
    for (const item of startPositions) {
      const target = nodeById(item.id);
      if (!target) continue;
      const maxX = (rect.width - state.viewport.x) / state.viewport.scale - 190;
      const maxY = (rect.height - state.viewport.y) / state.viewport.scale - 130;
      target.x = clamp(item.x + dx, -state.viewport.x / state.viewport.scale + 10, maxX);
      target.y = clamp(item.y + dy, -state.viewport.y / state.viewport.scale + 54, maxY);
    }
    render();
  };
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    setTimeout(render, 0);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

nodesLayer.addEventListener("click", (event) => {
  const recipeSwitch = event.target.closest(".node-recipe-switch");
  if (!recipeSwitch) return;
  event.preventDefault();
  event.stopPropagation();
  const nodeId = recipeSwitch.dataset.nodeRecipe;
  const stepButton = event.target.closest("[data-recipe-step]");
  if (stepButton) {
    stepNodeRecipe(nodeId, Number(stepButton.dataset.recipeStep));
    return;
  }
  if (event.target.closest("[data-open-node-recipe]")) {
    setSingleSelection(nodeId);
    openRecipeDialog(nodeId);
    render();
  }
});

nodesLayer.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".node-recipe-switch")) {
    event.stopPropagation();
    return;
  }
  const port = event.target.closest(".port");
  if (!port) return;
  const dragType = port.dataset.side === "power-out" ? "power" : "logistics";
  if (dragType === "logistics" && port.dataset.side !== "out") return;
  if (dragType === "power") {
    state.connectMode = "power";
    document.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("active", item.dataset.mode === "power"));
  }
  event.stopPropagation();
  const fromNode = port.dataset.node;
  const fromPort = Number(port.dataset.index);
  if (dragType === "logistics" && isOutputUsed(fromNode, fromPort)) {
    setStatus("输出口只能连接一条线", "error");
    return;
  }
  if (dragType === "power" && isPowerOutputUsed(fromNode, fromPort)) {
    setStatus("电力输出口只能连接一条线", "error");
    return;
  }
  state.dragLink = { fromNode, fromPort, type: dragType };
  state.selectedLinkId = null;
  state.selectedLinkType = null;
  setStatus(dragType === "power" ? "拖拽到黄色电力输入口释放即可连接" : "拖拽到任意输入口附近释放即可连接");
  updatePointer(event);
  render();
});

window.addEventListener("pointermove", (event) => {
  if (!state.dragLink) return;
  updatePointer(event);
  markHotPort();
  renderLinks();
});

window.addEventListener("pointerup", (event) => {
  if (!state.dragLink) return;
  updatePointer(event);
  const target = nearestInputPort();
  if (!target) {
    state.dragLink = null;
    setStatus("未吸附到输入口，连线已取消", "error");
    render();
    return;
  }
  if (state.dragLink.type === "power") {
    createPowerLink(target.nodeId);
  } else {
    createLink(target.nodeId, target.port);
  }
});

function updatePointer(event) {
  state.pointer = canvasPoint(event);
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left - state.viewport.x) / state.viewport.scale,
    y: (event.clientY - rect.top - state.viewport.y) / state.viewport.scale
  };
}

function nearestInputPort() {
  let best = null;
  for (const node of state.nodes.filter(visibleNode)) {
    const count = state.dragLink?.type === "power" ? ((nodeTypes[node.kind].powerIn || (node.kind === "group" && rebuildGroupInterfaces(node).powerInput)) ? 1 : 0) : activeInputs(node);
    for (let port = 0; port < count; port += 1) {
      if (state.dragLink?.type !== "power" && node.kind === "group" && !groupInputMap(node, port)) continue;
      const side = state.dragLink?.type === "power" ? "power-in" : "in";
      const point = portPosition(node, side, port);
      const distance = Math.hypot(point.x - state.pointer.x, point.y - state.pointer.y);
      if (distance <= 28 && (!best || distance < best.distance)) {
        best = { nodeId: node.id, port, distance };
      }
    }
  }
  return best;
}

function markHotPort() {
  document.querySelectorAll(".port.hot").forEach((port) => port.classList.remove("hot"));
  const target = nearestInputPort();
  if (!target) return;
  const side = state.dragLink?.type === "power" ? "power-in" : "in";
  const port = document.querySelector(`.port[data-node="${target.nodeId}"][data-side="${side}"][data-index="${target.port}"]`);
  if (port) port.classList.add("hot");
}

function createLink(toNode, toPort) {
  const drag = state.dragLink;
  state.dragLink = null;
  if (!drag) return;
  if (drag.fromNode === toNode) {
    setStatus("不能连接到同一个节点", "error");
    render();
    return;
  }
  if (isInputUsed(toNode, toPort)) {
    setStatus("输入口只能接收一个来源", "error");
    render();
    return;
  }
  if (isOutputUsed(drag.fromNode, drag.fromPort)) {
    setStatus("输出口只能连接一条线", "error");
    render();
    return;
  }
  const from = nodeById(drag.fromNode);
  const to = nodeById(toNode);
  if (from?.kind === "warehouse" && !from.outputOpen[drag.fromPort]) {
    setStatus("仓库输出口已关闭", "error");
    render();
    return;
  }
  if (to?.kind === "warehouse" && !to.inputOpen[toPort]) {
    setStatus("仓库输入口已关闭", "error");
    render();
    return;
  }
  if (from?.kind === "source" && !["miner", "adapter_input", "group"].includes(to?.kind)) {
    setStatus("矿源必须先连接采矿机", "error");
    render();
    return;
  }
  if (to?.kind === "miner" && !["source", "adapter_input", "group"].includes(from?.kind)) {
    setStatus("采矿机输入口只能连接矿源", "error");
    render();
    return;
  }
  state.links.push(applyLogisticsLineStats({
    id: `link-${nextId++}`,
    fromNode: drag.fromNode,
    fromPort: drag.fromPort,
    toNode,
    toPort,
    resource: null,
    packets: [],
    level: 1,
    totalMoved: 0,
    emitBuffer: 0
  }));
  pruneAdapterPortBindings();
  state.selectedLinkId = null;
  setStatus("连线成功，M2 物流会自动沿线运输", "ok");
  render();
}

function createPowerLink(toNode) {
  const drag = state.dragLink;
  state.dragLink = null;
  if (!drag) return;
  if (state.cableStock <= 0) {
    setStatus("线缆库存不足，无法建设电力线", "error");
    render();
    return;
  }
  if (drag.fromNode === toNode) {
    setStatus("不能连接到同一个节点", "error");
    render();
    return;
  }
  const from = nodeById(drag.fromNode);
  const to = nodeById(toNode);
  const toCanReceivePower = nodeTypes[to?.kind]?.powerIn || (to?.kind === "group" && rebuildGroupInterfaces(to).powerInput);
  if (!nodeTypes[from?.kind]?.powerOut || !toCanReceivePower) {
    setStatus("电力线只能从电力输出口连接到电力输入口", "error");
    render();
    return;
  }
  if (isPowerOutputUsed(drag.fromNode, drag.fromPort)) {
    setStatus("电力输出口只能连接一条线", "error");
    render();
    return;
  }
  if (isPowerInputUsed(toNode)) {
    setStatus("电力输入口只能接收一个来源", "error");
    render();
    return;
  }
  state.cableStock -= 1;
  state.powerLinks.push({
    id: `link-${nextId++}`,
    fromNode: drag.fromNode,
    fromPort: drag.fromPort,
    toNode,
    capacity: 40,
    load: 0,
    overloaded: false
  });
  state.selectedLinkId = null;
  state.selectedLinkType = null;
  setStatus("电力线连接成功", "ok");
  render();
}

function cancelDragLink() {
  if (!state.dragLink) return false;
  state.dragLink = null;
  setStatus("已取消当前拖拽连线");
  render();
  return true;
}

function deleteSelectedLink() {
  if (!state.selectedLinkId) return false;
  if (state.selectedLinkType === "power") {
    const removed = state.powerLinks.find((link) => link.id === state.selectedLinkId);
    state.powerLinks = state.powerLinks.filter((link) => link.id !== state.selectedLinkId);
    if (removed) state.cableStock += 1;
  } else {
    state.links = state.links.filter((link) => link.id !== state.selectedLinkId);
    pruneAdapterPortBindings();
  }
  state.selectedLinkId = null;
  state.selectedLinkType = null;
  setStatus("已删除选中连线", "ok");
  render();
  return true;
}

function deleteSelectedNode() {
  const ids = selectedNodeIds();
  if (!ids.length) return false;
  const nodes = ids.map(nodeById).filter(Boolean);
  const blockedWarehouse = nodes.find((node) => node.kind === "warehouse" && storeTotal(node.inputStore) > 0);
  if (blockedWarehouse) {
    warehouseDialog.showModal();
    warehouseDialog.addEventListener("close", () => {
      if (warehouseDialog.returnValue === "force") {
        forceDeleteNodes(ids);
      }
    }, { once: true });
    return true;
  }
  forceDeleteNodes(ids);
  return true;
}

function forceDeleteNodes(nodeIds) {
  for (const nodeId of nodeIds) forceDeleteNode(nodeId, false);
  clearSelection();
  setStatus(`已删除 ${nodeIds.length} 个节点，相关连线已清理`, "ok");
  render();
}

function forceDeleteNode(nodeId, shouldRender = true) {
  const node = nodeById(nodeId);
  if (node?.kind === "group") {
    for (const child of groupChildren(node)) {
      forceDeleteNode(child.id, false);
    }
  }
  if (node && node.kind !== "source" && state.inventory[node.kind] !== undefined) {
    state.inventory[node.kind] += 1;
  }
  const removedPowerLinks = state.powerLinks.filter((link) => link.fromNode === nodeId || link.toNode === nodeId).length;
  state.cableStock += removedPowerLinks;
  state.nodes = state.nodes.filter((item) => item.id !== nodeId);
  state.links = state.links.filter((link) => link.fromNode !== nodeId && link.toNode !== nodeId);
  state.powerLinks = state.powerLinks.filter((link) => link.fromNode !== nodeId && link.toNode !== nodeId);
  pruneAdapterPortBindings();
  if (shouldRender) {
    clearSelection();
    setStatus(`已删除 ${node ? nodeTitle(node) : "节点"}，相关连线已清理`, "ok");
    render();
  }
}

function simulate(now) {
  const dt = Math.min(0.08, (now - state.lastTime) / 1000);
  state.lastTime = now;
  state.totalThroughput = 0;

  for (const link of state.links) {
    movePackets(link, dt);
  }

  runPower(dt);

  for (const node of state.nodes) {
    updateWarehouseLock(node);
    if (node.kind === "warehouse") {
      const totalOutputLimit = node.outputLimits.reduce((sum, limit, index) => sum + (node.outputOpen[index] ? Math.max(0, limit || 0) : 0), 0);
      node.warehouseInBuffer = Math.min(12, node.warehouseInBuffer + dt * 4);
      node.warehouseOutBuffer = Math.min(Math.max(12, totalOutputLimit * 2), node.warehouseOutBuffer + dt * Math.max(4, totalOutputLimit));
      node.outputLimitBuffers = node.outputLimitBuffers.map((buffer, index) => {
        const limit = Math.max(0, node.outputLimits[index] || 0);
        if (limit <= 0) return 0;
        const burst = Math.max(1, limit * 2);
        return Math.min(burst, buffer + dt * limit);
      });
    }
    runMiner(node, dt);
    runIndustry(node, dt);
    runAdapter(node, dt);
  }

  for (const link of state.links) {
    emitPackets(link, dt);
  }

  recordLogisticsThroughput(now, dt);
  applyGoalRewards();
  const shouldRefreshInspector = Boolean(state.selectedId || state.selectedLinkId || state.selectedIds.length)
    && now - state.lastInspectorRender > 120;
  if (shouldRefreshInspector) state.lastInspectorRender = now;
  render({ skipInspector: !shouldRefreshInspector });
  requestAnimationFrame(simulate);
}

function runPower(dt) {
  let generation = 0;
  const poweredIds = new Set();
  const activePowerSources = [];

  for (const node of state.nodes) {
    node.powered = false;
    node.generating = false;
    if (node.kind !== "generator") continue;
    if ((node.inputStore.coal || 0) >= dt * 0.4) {
      addStore(node.inputStore, "coal", -dt * 0.4);
      node.generating = true;
      generation += nodeGeneration(node);
      activePowerSources.push(node.id);
    }
  }

  const queue = [...activePowerSources];
  const visited = new Set(queue);
  while (queue.length) {
    const id = queue.shift();
    for (const link of state.powerLinks.filter((item) => item.fromNode === id)) {
      const target = nodeById(effectivePowerTargetId(link));
      if (!target || visited.has(target.id)) continue;
      visited.add(target.id);
      poweredIds.add(target.id);
      if (nodeTypes[target.kind].powerOut) queue.push(target.id);
    }
  }

  let demand = 0;
  for (const id of poweredIds) {
    const node = nodeById(id);
    if (node) demand += nodePowerDemand(node);
  }
  const gridOverload = generation > 0 && demand > generation;
  updatePowerLinkLoads();

  const deliveredIds = new Set();
  if (!gridOverload) {
    const deliverQueue = [...activePowerSources];
    const deliveredVisited = new Set(deliverQueue);
    while (deliverQueue.length) {
    const id = deliverQueue.shift();
      for (const link of state.powerLinks.filter((item) => item.fromNode === id && !item.overloaded)) {
        const target = nodeById(effectivePowerTargetId(link));
        if (!target || deliveredVisited.has(target.id)) continue;
        deliveredVisited.add(target.id);
        deliveredIds.add(target.id);
        if (nodeTypes[target.kind].powerOut) deliverQueue.push(target.id);
      }
    }
  }

  for (const id of poweredIds) {
    const node = nodeById(id);
    if (node) node.powered = deliveredIds.has(id);
  }

  state.power.generation = generation;
  state.power.demand = demand;
  state.power.load = generation ? Math.round((demand / generation) * 100) : 0;
  state.power.overload = gridOverload || state.powerLinks.some((link) => link.overloaded);
}

function updatePowerLinkLoads() {
  for (const link of state.powerLinks) {
    link.load = downstreamPowerDemand(effectivePowerTargetId(link), new Set([link.fromNode]));
    link.overloaded = link.load > link.capacity;
  }
}

function effectivePowerTargetId(link) {
  const target = nodeById(link.toNode);
  if (target?.kind !== "group") return link.toNode;
  return rebuildGroupInterfaces(target).powerInput?.adapterNodeId || link.toNode;
}

function downstreamPowerDemand(nodeId, visited) {
  if (visited.has(nodeId)) return 0;
  const node = nodeById(nodeId);
  if (!node) return 0;
  visited.add(nodeId);
  let total = nodePowerDemand(node);
  if (!nodeTypes[node.kind].powerOut) return total;
  for (const link of state.powerLinks.filter((item) => item.fromNode === nodeId)) {
    total += downstreamPowerDemand(link.toNode, new Set(visited));
  }
  return total;
}

function movePackets(link, dt) {
  applyLogisticsLineStats(link);
  const to = nodeById(link.toNode);
  if (!to) return;
  const length = polylineLength(linkPoints(link));
  for (const packet of link.packets) {
    const currentDistance = packet.distance ?? packet.progress * length ?? 0;
    packet.distance = currentDistance + dt * (link.speed || 130);
    packet.progress = packet.distance / length;
  }
  const remaining = [];
  for (const packet of link.packets) {
    if (packet.progress >= 1) {
      if (canReceive(to, packet.resource, packet.amount, link.toPort)) {
        if (to.kind === "warehouse" && to.warehouseInBuffer < packet.amount) {
          packet.distance = length * 0.985;
          packet.progress = 0.985;
          remaining.push(packet);
          continue;
        }
        if (to.kind === "warehouse") to.warehouseInBuffer -= packet.amount;
        receiveResource(to, packet.resource, packet.amount, link.toPort);
        link.totalMoved += packet.amount;
        state.totalThroughput += packet.amount;
      } else {
        packet.distance = length * 0.985;
        packet.progress = 0.985;
        remaining.push(packet);
      }
    } else {
      remaining.push(packet);
    }
  }
  link.packets = remaining;
}

function emitPackets(link, dt) {
  applyLogisticsLineStats(link);
  const from = nodeById(link.fromNode);
  const to = nodeById(link.toNode);
  const packetLimit = logisticsPacketLimit(link);
  if (!from || !to || link.packets.length >= packetLimit) return;
  if (from.kind === "warehouse" && !from.outputOpen[link.fromPort]) return;
  if (from.kind === "group" && !groupOutputMap(from, link.fromPort)) return;
  const store = outputStoreForLink(from, link.fromPort);
  if (link.resource && !canReceive(to, link.resource, 1, link.toPort, true) && link.packets.length === 0) {
    link.resource = null;
  }
  const groupOutput = from.kind === "group" ? groupOutputMap(from, link.fromPort) : null;
  const lockedOutput = nodeTypes[from.kind]?.adapter ? from.adapterResources?.outputs?.[link.fromPort] : null;
  const storedOutput = firstStoreResource(store);
  const resource = from.kind === "source"
    ? `${from.resource}_deposit`
    : (storedOutput || groupOutput?.resource || lockedOutput || link.resource || Object.keys(store).find((key) => store[key] >= 1 && canReceive(to, key, 1, link.toPort, true)));
  if (!resource) return;
  if (storedOutput && link.resource && link.resource !== storedOutput && link.packets.length === 0) link.resource = null;
  if (!link.resource) link.resource = resource;
  lockAdapterResource(from, "outputs", link.fromPort, link.resource);
  if (resource !== link.resource) return;
  if (!canReceive(to, link.resource, 1, link.toPort, true)) return;

  const emitRate = logisticsEmitRate(link);
  if (emitRate <= 0) return;
  link.emitBuffer = Math.min(Math.max(1, emitRate * 2), link.emitBuffer + dt * emitRate);
  let emittedThisTick = 0;
  while (link.emitBuffer >= 1 && hasAvailableOutput(from, store, link.resource, link.fromPort) && canReceive(to, link.resource, 1, link.toPort, true) && link.packets.length < packetLimit) {
    if (from.kind === "warehouse" && from.warehouseOutBuffer < 1) break;
    if (from.kind === "warehouse" && (from.outputLimitBuffers[link.fromPort] || 0) < 1) break;
    link.emitBuffer -= 1;
    if (from.kind === "warehouse") {
      from.warehouseOutBuffer -= 1;
      from.outputLimitBuffers[link.fromPort] -= 1;
    }
    consumeOutput(from, store, link.resource, link.fromPort);
    const queuedDistance = -emittedThisTick * LOGISTICS_PACKET_SPACING;
    link.packets.push({
      resource: link.resource,
      amount: 1,
      progress: queuedDistance / Math.max(1, polylineLength(linkPoints(link))),
      distance: queuedDistance
    });
    emittedThisTick += 1;
  }
}

function hasAvailableOutput(node, store, resource, port = 0) {
  if (node.kind === "source") return node.reserve >= 1 && `${node.resource}_deposit` === resource;
  if (node.kind === "group") {
    const map = groupOutputMap(node, port);
    const adapter = map ? nodeById(map.adapterNodeId) : null;
    return Boolean(adapter && (adapterPortStore(adapter, "outputs", map.adapterPort)[resource] || 0) >= 1);
  }
  return (store[resource] || 0) >= 1;
}

function consumeOutput(node, store, resource, port = 0) {
  if (node.kind === "source") {
    node.reserve = Math.max(0, node.reserve - 1);
    return;
  }
  if (node.kind === "group") {
    const map = groupOutputMap(node, port);
    const outputAdapter = map ? nodeById(map.adapterNodeId) : null;
    if (outputAdapter) {
      addStore(adapterPortStore(outputAdapter, "outputs", map.adapterPort), resource, -1);
      addStore(outputAdapter.outputStore, resource, -1);
    }
    return;
  }
  if (nodeTypes[node.kind]?.adapter) {
    addStore(adapterPortStore(node, "outputs", port), resource, -1);
    addStore(node.outputStore, resource, -1);
    return;
  }
  addStore(store, resource, -1);
}

function runAdapter(node, dt) {
  if (!nodeTypes[node.kind]?.adapter) return;
  const moveBudget = Math.max(1, dt * 24);
  ensureAdapterPortStores(node);
  for (let port = 0; port < 3; port += 1) {
    const inputPortStore = adapterPortStore(node, "inputs", port);
    const outputPortStore = adapterPortStore(node, "outputs", port);
    for (const resource of Object.keys(inputPortStore)) {
      const amount = Math.min(inputPortStore[resource], moveBudget, ADAPTER_PORT_CAPACITY - storeTotal(outputPortStore));
      if (amount <= 0) continue;
      addStore(inputPortStore, resource, -amount);
      addStore(node.inputStore, resource, -amount);
      addStore(outputPortStore, resource, amount);
      addStore(node.outputStore, resource, amount);
      node.status = "接口转发中";
    }
  }
}

function runMiner(node, dt) {
  if (node.kind !== "miner") return;
  const deposit = Object.keys(node.inputStore).find((key) => key.endsWith("_deposit") && node.inputStore[key] >= 1);
  if (!deposit) {
    node.progress = 0;
    return;
  }
  const mineral = deposit.replace("_deposit", "");
  if (storeTotal(node.outputStore) >= node.capacity) {
    node.progress = 0;
    return;
  }
  const amount = Math.min(node.inputStore[deposit], dt * nodeMinerRate(node), node.capacity - storeTotal(node.outputStore));
  if (amount <= 0) {
    node.progress = 0;
    return;
  }
  addStore(node.inputStore, deposit, -amount);
  addStore(node.outputStore, mineral, amount);
  addProduction(mineral, amount);
  node.miningResource = mineral;
  const visualSpeed = 1.25 * (nodeMinerRate(node) / Math.max(MINER_OUTPUT_PER_SECOND, 0.001));
  node.progress = (node.progress + dt * visualSpeed) % 1;
}

function runIndustry(node, dt) {
  const recipe = activeRecipe(node);
  if (!recipe) return;
  clampRecipeInputStore(node);
  if (recipeRequiresPower(node, recipe) && !node.powered) {
    node.status = "等待电力";
    node.progress = 0;
    return;
  }
  if (storeTotal(node.outputStore) >= node.capacity) {
    node.status = "输出堵塞";
    return;
  }
  if (!hasInputs(node.inputStore, recipe.inputs)) {
    const missing = Object.entries(recipe.inputs)
      .filter(([key, amount]) => (node.inputStore[key] || 0) < amount)
      .map(([key]) => resourceName(key))
      .join("、");
    node.status = `缺少${missing}`;
    node.progress = 0;
    return;
  }
  const speed = node.powered && recipePowerMode(node, recipe) === "optional" ? 1.5 : 1;
  node.status = speed > 1 ? "通电加速生产中" : "生产中";
  node.progress += (dt * speed * nodeProductionSpeedMultiplier(node)) / recipe.time;
  if (node.progress < 1) return;
  node.progress = 0;
  takeInputs(node.inputStore, recipe.inputs);
  const deviceKind = deviceFromResource(recipe.output);
  if (deviceKind) {
    state.inventory[deviceKind] += recipe.amount;
    addProduction(recipe.output, recipe.amount);
    node.status = `设备入库：${nodeTypes[deviceKind].name}`;
  } else {
    addStore(node.outputStore, recipe.output, recipe.amount);
    addProduction(recipe.output, recipe.amount);
    node.status = "产出完成";
    if (recipe.output === "mechanical_core") {
      checkStageCompletion();
    }
  }
}

function checkStageCompletion() {
  const total = state.nodes.reduce((count, node) => count + (node.outputStore.mechanical_core || 0) + (node.inputStore.mechanical_core || 0), 0);
  if (total >= 10 && !state.completed) {
    state.completed = true;
    setStatus("第一阶段完成：机械核心达到 10 个，第二时代已解锁", "ok");
  }
}

function checkStageCompletion() {
  const total = state.nodes.reduce((count, node) => count + (node.outputStore.mechanical_core || 0) + (node.inputStore.mechanical_core || 0), 0);
  if (total >= 50 && !state.completed) state.completed = true;
}

function createSaveData() {
  return {
    nodes: state.nodes,
    links: state.links,
    powerLinks: state.powerLinks,
    inventory: state.inventory,
    cableStock: state.cableStock,
    completed: state.completed,
    claimedGoalRewards: state.claimedGoalRewards,
    completedGoalSteps: state.completedGoalSteps,
    productionStats: state.productionStats,
    logisticsPeak: state.logisticsPeak,
    nextId
  };
}

function readSaveSlots() {
  let slots = [];
  try {
    slots = JSON.parse(localStorage.getItem(SAVE_INDEX_KEY) || "[]");
  } catch {
    slots = [];
  }
  const legacyRaw = localStorage.getItem(LEGACY_SAVE_KEY);
  if (legacyRaw && !slots.some((slot) => slot.id === "legacy")) {
    try {
      slots.unshift({
        id: "legacy",
        name: "旧版自动迁移存档",
        savedAt: Date.now(),
        data: JSON.parse(legacyRaw)
      });
      writeSaveSlots(slots);
      localStorage.removeItem(LEGACY_SAVE_KEY);
    } catch {
      localStorage.removeItem(LEGACY_SAVE_KEY);
    }
  }
  return slots;
}

function writeSaveSlots(slots) {
  localStorage.setItem(SAVE_INDEX_KEY, JSON.stringify(slots));
}

function saveSlotName() {
  return saveNameInput.value.trim() || `存档 ${new Date().toLocaleString("zh-CN", { hour12: false })}`;
}

function escapeHtml(text) {
  return String(text ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);
}

function saveSlotSummary(slot) {
  const data = slot.data || {};
  const nodes = data.nodes?.length || 0;
  const links = (data.links?.length || 0) + (data.powerLinks?.length || 0);
  const cores = Math.floor(data.productionStats?.mechanical_core || 0);
  return `${nodes} 节点 / ${links} 连线 / 机械核心 ${cores}`;
}

function saveToSlot(slotId = null) {
  const slots = readSaveSlots();
  const now = Date.now();
  const data = createSaveData();
  if (slotId) {
    const slot = slots.find((item) => item.id === slotId);
    if (!slot) return;
    slot.name = saveNameInput.value.trim() || slot.name;
    slot.savedAt = now;
    slot.data = data;
    setStatus(`已覆盖存档：${slot.name}`, "ok");
  } else {
    const slot = {
      id: `save-${now}-${Math.floor(Math.random() * 1000)}`,
      name: saveSlotName(),
      savedAt: now,
      data
    };
    slots.unshift(slot);
    setStatus(`已新建存档：${slot.name}`, "ok");
  }
  writeSaveSlots(slots);
  saveNameInput.value = "";
  renderSaveSlots();
}

function deleteSaveSlot(slotId) {
  const slots = readSaveSlots();
  const slot = slots.find((item) => item.id === slotId);
  writeSaveSlots(slots.filter((item) => item.id !== slotId));
  setStatus(`已删除存档：${slot?.name || "未知存档"}`, "ok");
  renderSaveSlots();
}

function loadSaveData(data, name = "本地存档") {
  if (!data) {
    setStatus("存档数据为空", "error");
    return;
  }
  state.nodes = (data.nodes || []).map(hydrateNode);
  state.links = (data.links || []).map((link) => applyLogisticsLineStats({ packets: [], totalMoved: 0, emitBuffer: 0, ...link }));
  state.powerLinks = (data.powerLinks || []).map((link) => ({ capacity: 40, load: 0, overloaded: false, ...link }));
  state.inventory = { ...state.inventory, ...(data.inventory || {}) };
  state.cableStock = data.cableStock ?? state.cableStock;
  state.completed = Boolean(data.completed);
  state.claimedGoalRewards = data.claimedGoalRewards || {};
  state.completedGoalSteps = data.completedGoalSteps || {};
  state.productionStats = { ...(data.productionStats || {}) };
  state.logisticsHistory = [];
  state.logisticsPeak = data.logisticsPeak || 0;
  pruneAdapterPortBindings();
  const currentTotals = collectResourceTotals();
  for (const [key, value] of Object.entries(currentTotals)) {
    state.productionStats[key] = Math.max(state.productionStats[key] || 0, value);
  }
  state.selectedId = null;
  state.selectedIds = [];
  state.selectedLinkId = null;
  state.selectedLinkType = null;
  state.activeGroupId = null;
  nextId = data.nextId || Math.max(1, ...state.nodes.map((node) => Number(node.id.replace("node-", "")) || 1)) + 1;
  saveDialog.close();
  enterGame();
  setStatus(`已读取存档：${name}`, "ok");
  render();
}

function renderSaveSlots() {
  const slots = readSaveSlots().sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
  saveDialogTitle.textContent = saveDialogMode === "save" ? "保存游戏" : "读取游戏";
  saveDialogSubtitle.textContent = saveDialogMode === "save"
    ? "新建一个存档，或点击覆盖已有槽位。"
    : "选择一个槽位读取，或删除不需要的存档。";
  document.querySelector(".save-create-row").style.display = saveDialogMode === "save" ? "grid" : "none";
  if (!slots.length) {
    saveSlotList.innerHTML = `<div class="save-empty">暂无存档槽位</div>`;
    return;
  }
  saveSlotList.innerHTML = slots.map((slot) => `
    <article class="save-slot">
      <div>
        <strong>${escapeHtml(slot.name)}</strong>
        <span>${new Date(slot.savedAt || Date.now()).toLocaleString("zh-CN", { hour12: false })}</span>
        <small>${saveSlotSummary(slot)}</small>
      </div>
      <div class="save-slot-actions">
        ${saveDialogMode === "save"
          ? `<button data-save-overwrite="${slot.id}" type="button">覆盖</button>`
          : `<button data-save-load="${slot.id}" type="button">读取</button>`}
        <button class="danger" data-save-delete="${slot.id}" type="button">删除</button>
      </div>
    </article>
  `).join("");
  saveSlotList.querySelectorAll("[data-save-overwrite]").forEach((button) => {
    button.addEventListener("click", () => saveToSlot(button.dataset.saveOverwrite));
  });
  saveSlotList.querySelectorAll("[data-save-load]").forEach((button) => {
    button.addEventListener("click", () => {
      const slot = readSaveSlots().find((item) => item.id === button.dataset.saveLoad);
      loadSaveData(slot?.data, slot?.name);
    });
  });
  saveSlotList.querySelectorAll("[data-save-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteSaveSlot(button.dataset.saveDelete));
  });
}

function openSaveDialog(mode) {
  saveDialogMode = mode;
  renderSaveSlots();
  saveDialog.showModal();
}

function saveGame() {
  openSaveDialog("save");
}

function loadGame() {
  openSaveDialog("load");
}

function normalizedSourceReserve(node) {
  if (node.kind !== "source") return { reserve: 0, initialReserve: 0 };
  const oldInitial = node.initialReserve || Math.max(node.reserve || 0, SOURCE_RESERVE_MAX);
  if (oldInitial < SOURCE_RESERVE_MAX) {
    const remaining = node.reserve ?? oldInitial;
    const addedReserve = SOURCE_RESERVE_MAX - oldInitial;
    return {
      reserve: Math.min(SOURCE_RESERVE_MAX, remaining + addedReserve),
      initialReserve: SOURCE_RESERVE_MAX
    };
  }
  return {
    reserve: node.reserve ?? SOURCE_RESERVE_MAX,
    initialReserve: Math.max(oldInitial, SOURCE_RESERVE_MAX)
  };
}

function hydrateNode(node) {
  const sourceReserve = normalizedSourceReserve(node);
  const hydrated = {
    inputStore: {},
    outputStore: {},
    reserve: sourceReserve.reserve,
    initialReserve: sourceReserve.initialReserve,
    miningResource: null,
    warehouseResource: null,
    inputOpen: [true, true, true, true],
    outputOpen: [true, true, true, true],
    warehouseInBuffer: 0,
    warehouseOutBuffer: 0,
    outputLimits: [1, 1, 1, 1],
    outputLimitBuffers: [0, 0, 0, 0],
    recipeIndex: 0,
    level: 1,
    progress: 0,
    status: "待机",
    powered: false,
    generating: false,
    groupId: null,
    groupData: node.kind === "group" ? createEmptyGroupData() : null,
    adapterResources: createAdapterResources(node.kind),
    ...node,
    reserve: sourceReserve.reserve,
    initialReserve: sourceReserve.initialReserve
  };
  refreshNodeCapacity(hydrated);
  ensureNodePortArrays(hydrated);
  ensureAdapterPortStores(hydrated);
  return hydrated;
}

function autoLayout() {
  state.nodes.forEach((node, index) => {
    node.x = 60 + (index % 5) * 210;
    node.y = 90 + Math.floor(index / 5) * 155;
  });
  setStatus("已按网格整理布局", "ok");
  render();
}

function buildDemoLine() {
  state.nodes = [];
  state.links = [];
  state.powerLinks = [];
  state.inventory = { miner: 4, furnace: 4, kiln: 5, caster: 5, assembler: 5, generator: 0, pole: 4, warehouse: 4, adapter_input: 3, adapter_output: 3, adapter_power: 2 };
  state.cableStock = 12;
  state.claimedGoalRewards = {};
  state.completedGoalSteps = {};
  state.productionStats = {};
  state.logisticsHistory = [];
  state.logisticsPeak = 0;
  state.completed = false;
  nextId = 1;
  const coalSource = createNodeRaw("source", "coal", 50, 100);
  const coalMiner = createNodeRaw("miner", null, 260, 100);
  const coalWarehouse = createNodeRaw("warehouse", null, 500, 100);
  const generator = createNodeRaw("generator", null, 730, 100);
  const ironSource = createNodeRaw("source", "iron_ore", 50, 280);
  const ironMiner = createNodeRaw("miner", null, 260, 280);
  const furnace = createNodeRaw("furnace", null, 730, 280);
  state.links.push(
    makeLogisticsLink(coalSource.id, 0, coalMiner.id, 0),
    makeLogisticsLink(coalMiner.id, 0, coalWarehouse.id, 0),
    makeLogisticsLink(coalWarehouse.id, 0, generator.id, 0),
    makeLogisticsLink(coalWarehouse.id, 1, furnace.id, 1),
    makeLogisticsLink(ironSource.id, 0, ironMiner.id, 0),
    makeLogisticsLink(ironMiner.id, 0, furnace.id, 0)
  );
  state.powerLinks.push({ id: `link-${nextId++}`, fromNode: generator.id, fromPort: 0, toNode: furnace.id, capacity: 40, load: 0, overloaded: false });
  state.cableStock -= 1;
  setSingleSelection(furnace.id);
  setStatus("已生成测试链路：煤矿供电 + 铁矿熔炉", "ok");
  render();
}

function makeLogisticsLink(fromNode, fromPort, toNode, toPort) {
  return applyLogisticsLineStats({
    id: `link-${nextId++}`,
    fromNode,
    fromPort,
    toNode,
    toPort,
    resource: null,
    packets: [],
    level: 1,
    totalMoved: 0,
    emitBuffer: 0
  });
}

function updateWarehouseLock(node) {
  if (node.kind !== "warehouse") return;
  if (storeTotal(node.inputStore) <= 0.001 && node.warehouseResource) {
    node.warehouseResource = null;
  }
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cancelDragLink()) {
    event.preventDefault();
  }
  if ((event.key === "Delete" || event.key === "Backspace") && (deleteSelectedLink() || deleteSelectedNode())) {
    event.preventDefault();
  }
});

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!loginUser?.value.trim() || !loginPassword?.value.trim()) {
    if (loginError) loginError.textContent = "请输入账号和密码";
    return;
  }
  if (loginError) loginError.textContent = "";
  showScreen("menu");
});

document.querySelector("#start-new-game")?.addEventListener("click", startNewGame);
document.querySelector("#open-load-menu")?.addEventListener("click", () => openSaveDialog("load"));
document.querySelector("#open-rules")?.addEventListener("click", () => showScreen("rules"));
document.querySelector("#back-to-menu-from-rules")?.addEventListener("click", () => showScreen("menu"));
document.querySelector("#back-main-menu")?.addEventListener("click", () => {
  closeOpenDialogs();
  showScreen("menu");
});

document.querySelectorAll(".device-items button[data-kind]").forEach((button) => {
  button.addEventListener("click", () => addNode(button.dataset.kind, button.dataset.resource || null));
});

document.querySelectorAll("[data-device-tab]").forEach((button) => {
  button.addEventListener("click", () => setDeviceTab(button.dataset.deviceTab));
});

document.querySelector("#close-recipe-dialog").addEventListener("click", () => recipeDialog.close());
document.querySelector("#close-save-dialog").addEventListener("click", () => saveDialog.close());
closeGoalRewardButton?.addEventListener("click", () => goalRewardDialog.close());
document.querySelector("#close-upgrade-dialog")?.addEventListener("click", () => upgradeDialog?.close());
upgradeDialogCancel?.addEventListener("click", () => upgradeDialog?.close());
document.querySelector("#create-save-slot").addEventListener("click", () => saveToSlot());
document.querySelector("#open-gm-panel")?.addEventListener("click", openGmPasswordGate);
document.querySelector("#close-gm-dialog")?.addEventListener("click", () => gmDialog?.close());
gmCategorySelect?.addEventListener("change", renderGmResourceOptions);
gmResourceSelect?.addEventListener("change", renderGmPreview);
document.querySelector("#gm-add-resource")?.addEventListener("click", gmAddSelectedResource);
document.querySelector("#gm-basic-supply")?.addEventListener("click", gmAddBasicSupply);

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    state.connectMode = button.dataset.mode;
    state.lineView = button.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelector("#show-all-lines")?.classList.remove("active");
    setStatus(state.connectMode === "power" ? "电力线模式：从发电机黄色输出口连接到建筑黄色输入口" : "物流线模式：从右侧输出口连接到左侧输入口");
    renderLinks();
  });
});

document.querySelectorAll("[data-alert-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.alertFilter = button.dataset.alertFilter;
    document.querySelectorAll("[data-alert-filter]").forEach((item) => item.classList.toggle("active", item === button));
    renderMonitoring();
  });
});

document.querySelector("#toggle-logistics").addEventListener("click", () => {
  state.showLogistics = !state.showLogistics;
  setStatus(`物流线显示已${state.showLogistics ? "开启" : "隐藏"}`, "ok");
  render();
});

document.querySelector("#toggle-power").addEventListener("click", () => {
  state.showPower = !state.showPower;
  setStatus(`电力线显示已${state.showPower ? "开启" : "隐藏"}`, "ok");
  render();
});

document.querySelector("#toggle-logistics").addEventListener("click", () => {
  state.lineView = "logistics";
  state.connectMode = "logistics";
  document.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("active", item.dataset.mode === "logistics"));
  document.querySelector("#show-all-lines")?.classList.remove("active");
  setStatus("物流线高亮，电力线透明显示", "ok");
  renderLinks();
});

document.querySelector("#toggle-power").addEventListener("click", () => {
  state.lineView = "power";
  state.connectMode = "power";
  document.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("active", item.dataset.mode === "power"));
  document.querySelector("#show-all-lines")?.classList.remove("active");
  setStatus("电力线高亮，物流线透明显示", "ok");
  renderLinks();
});

document.querySelector("#show-all-lines").addEventListener("click", () => {
  state.lineView = "all";
  document.querySelectorAll("[data-mode]").forEach((item) => item.classList.remove("active"));
  document.querySelector("#show-all-lines").classList.add("active");
  setStatus("已显示所有线", "ok");
  renderLinks();
});

document.querySelector("#auto-layout").addEventListener("click", autoLayout);
document.querySelector("#create-group-toolbar").addEventListener("click", createGroupFromSelection);
document.querySelector("#demo-line").addEventListener("click", buildDemoLine);
document.querySelector("#save-game").addEventListener("click", saveGame);
document.querySelector("#load-game").addEventListener("click", loadGame);

canvas.addEventListener("pointerdown", (event) => {
  if (event.target !== canvas && event.target !== nodesLayer && event.target !== linksLayer) return;
  if (event.button !== 0) return;
  if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
    startCanvasPan(event);
    return;
  }
  const startPoint = canvasPoint(event);
  const baseSelection = event.shiftKey || event.ctrlKey || event.metaKey ? selectedNodeIds() : [];
  let moved = false;
  state.selectionBox = { start: startPoint, current: startPoint };
  const move = (moveEvent) => {
    moved = true;
    state.selectionBox.current = canvasPoint(moveEvent);
    const rect = selectionRect(state.selectionBox.start, state.selectionBox.current);
    const boxedIds = state.nodes.filter((node) => visibleNode(node) && nodeIntersectsRect(node, rect)).map((node) => node.id);
    setMultiSelection([...baseSelection, ...boxedIds]);
    state.selectionBox = { start: startPoint, current: canvasPoint(moveEvent) };
    render();
  };
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    if (!moved || selectionRect(state.selectionBox.start, state.selectionBox.current).width < 4 && selectionRect(state.selectionBox.start, state.selectionBox.current).height < 4) {
      if (!baseSelection.length) clearSelection();
    }
    state.selectionBox = null;
    render();
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
  render();
});

canvas.addEventListener("wheel", zoomCanvasAt, { passive: false });

document.querySelector("#clear-lines").addEventListener("click", () => {
  state.cableStock += state.powerLinks.length;
  state.links = [];
  state.powerLinks = [];
  pruneAdapterPortBindings();
  state.selectedLinkId = null;
  state.selectedLinkType = null;
  setStatus("已清除全部连线", "ok");
  render();
});

deleteSelectedLinkButton.addEventListener("click", deleteSelectedLink);

document.querySelector("#clear-all").addEventListener("click", () => {
  state.cableStock += state.powerLinks.length;
  for (const node of state.nodes) {
    if (node.kind !== "source" && state.inventory[node.kind] !== undefined) {
      state.inventory[node.kind] += 1;
    }
  }
  state.nodes = [];
  state.links = [];
  state.powerLinks = [];
  state.claimedGoalRewards = {};
  state.completedGoalSteps = {};
  state.productionStats = {};
  state.logisticsHistory = [];
  state.logisticsPeak = 0;
  state.completed = false;
  state.selectedId = null;
  state.selectedIds = [];
  state.selectedLinkId = null;
  state.selectedLinkType = null;
  state.selectedLinkType = null;
  state.activeGroupId = null;
  setStatus("已清空节点");
  render();
});

setDeviceTab("资源");
render();
requestAnimationFrame(simulate);
