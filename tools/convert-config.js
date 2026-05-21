const fs = require("node:fs");
const path = require("node:path");
const XLSX = require("xlsx");

const rootDir = path.resolve(__dirname, "..");
const excelPath = path.join(rootDir, "config", "excel", "game_config.xlsx");
const outputDir = path.join(rootDir, "config", "generated");
const outputJsonPath = path.join(outputDir, "game_config.json");
const outputJsPath = path.join(outputDir, "game_config.js");

const defaultRows = {
  resources: [
    { key: "iron_ore", name: "铁矿", color: "#b9d9f2", category: "ore", desc: "基础铁矿" },
    { key: "copper_ore", name: "铜矿", color: "#f0a24a", category: "ore", desc: "基础铜矿" },
    { key: "coal", name: "煤矿", color: "#6f7780", category: "ore", desc: "燃料资源" },
    { key: "sand", name: "砂矿", color: "#d8c89f", category: "ore", desc: "玻璃原料" },
    { key: "iron_ingot", name: "铁锭", color: "#d7ecff", category: "ingot", desc: "基础金属锭" },
    { key: "copper_ingot", name: "铜锭", color: "#ffbf66", category: "ingot", desc: "导电金属锭" },
    { key: "glass", name: "玻璃", color: "#aeeeff", category: "material", desc: "电子和线缆材料" },
    { key: "steel_ingot", name: "钢锭", color: "#9fc4e7", category: "ingot", desc: "进阶金属锭" },
    { key: "iron_plate", name: "铁板", color: "#d7ecff", category: "part", desc: "基础板材" },
    { key: "iron_rod", name: "铁棒", color: "#d7ecff", category: "part", desc: "基础杆件" },
    { key: "copper_plate", name: "铜板", color: "#ffbf66", category: "part", desc: "铜制板材" },
    { key: "copper_rod", name: "铜棒", color: "#ffbf66", category: "part", desc: "铜制杆件" },
    { key: "copper_wire", name: "铜线", color: "#ffd37a", category: "part", desc: "线缆基础材料" },
    { key: "steel_plate", name: "钢板", color: "#9fc4e7", category: "part", desc: "进阶板材" },
    { key: "steel_rod", name: "钢棒", color: "#9fc4e7", category: "part", desc: "进阶杆件" },
    { key: "gear", name: "齿轮", color: "#c9d6df", category: "component", desc: "机械传动组件" },
    { key: "industrial_frame", name: "工业框架", color: "#84c7ff", category: "component", desc: "设备结构件" },
    { key: "power_unit", name: "动力组件", color: "#7ef0b2", category: "component", desc: "供能组件" },
    { key: "cable", name: "线缆", color: "#ffe45c", category: "component", desc: "电力连接材料" },
    { key: "miner_device", name: "采矿机设备", color: "#b9d9f2", category: "device", desc: "可部署采矿机" },
    { key: "furnace_device", name: "熔炉设备", color: "#d7ecff", category: "device", desc: "可部署熔炉" },
    { key: "kiln_device", name: "高温熔炉设备", color: "#9fc4e7", category: "device", desc: "可部署高温熔炉" },
    { key: "caster_device", name: "铸造厂设备", color: "#9fc4e7", category: "device", desc: "可部署铸造厂" },
    { key: "assembler_device", name: "组装厂设备", color: "#7ef0b2", category: "device", desc: "可部署组装厂" },
    { key: "generator_device", name: "发电厂设备", color: "#ffe45c", category: "device", desc: "可部署发电厂" },
    { key: "pole_device", name: "电杆设备", color: "#ffe45c", category: "device", desc: "可部署电杆" },
    { key: "warehouse_device", name: "仓库设备", color: "#73c8ff", category: "device", desc: "可部署仓库" },
    { key: "adapter_input_device", name: "封装输入设备", color: "#9bdcff", category: "device", desc: "可部署封装输入" },
    { key: "adapter_output_device", name: "封装输出设备", color: "#ffe45c", category: "device", desc: "可部署封装输出" },
    { key: "adapter_power_device", name: "封装电力设备", color: "#fff176", category: "device", desc: "可部署封装电力" },
    { key: "mechanical_core", name: "机械核心", color: "#ffffff", category: "goal", desc: "一阶段核心目标产物" }
  ],
  node_types: [
    { kind: "source", name: "矿源", inputs: 0, outputs: 3, max_inputs: "", power_in: false, power_out: false, power_outputs: 0, demand: 0, generation: 0, capacity: 0, adapter: false, group: false, desc: "固定矿藏总量，可分出 3 路接入采矿机" },
    { kind: "miner", name: "采矿机", inputs: 1, outputs: 1, max_inputs: "", power_in: false, power_out: false, power_outputs: 0, demand: 0, generation: 0, capacity: 180, adapter: false, group: false, desc: "从矿源开采并输出对应矿物" },
    { kind: "furnace", name: "熔炉", inputs: 3, outputs: 1, max_inputs: "", power_in: true, power_out: false, power_outputs: 0, demand: 8, generation: 0, capacity: 180, adapter: false, group: false, desc: "基础冶炼节点，可切换冶炼配方" },
    { kind: "kiln", name: "高温熔炉", inputs: 3, outputs: 1, max_inputs: "", power_in: true, power_out: false, power_outputs: 0, demand: 14, generation: 0, capacity: 180, adapter: false, group: false, desc: "高级冶炼节点，可生产钢锭" },
    { kind: "caster", name: "铸造厂", inputs: 1, outputs: 1, max_inputs: 4, power_in: true, power_out: false, power_outputs: 0, demand: 10, generation: 0, capacity: 180, adapter: false, group: false, desc: "锭类加工节点，可切换铸造配方" },
    { kind: "assembler", name: "组装厂", inputs: 4, outputs: 1, max_inputs: "", power_in: true, power_out: false, power_outputs: 0, demand: 16, generation: 0, capacity: 180, adapter: false, group: false, desc: "组件与机械核心生产节点" },
    { kind: "generator", name: "发电厂", inputs: 1, outputs: 0, max_inputs: "", power_in: false, power_out: true, power_outputs: 1, demand: 0, generation: 80, capacity: 180, adapter: false, group: false, desc: "消耗煤矿并向电网供电" },
    { kind: "pole", name: "电杆", inputs: 0, outputs: 0, max_inputs: "", power_in: true, power_out: true, power_outputs: 3, demand: 0, generation: 0, capacity: 180, adapter: false, group: false, desc: "电力中继节点，可分出 3 路电力输出" },
    { kind: "warehouse", name: "仓库", inputs: 4, outputs: 4, max_inputs: "", power_in: false, power_out: false, power_outputs: 0, demand: 0, generation: 0, capacity: 1000, adapter: false, group: false, desc: "物流控制中心：单资源、分流、缓存、中转" },
    { kind: "adapter_input", name: "封装输入", inputs: 3, outputs: 3, max_inputs: "", power_in: false, power_out: false, power_outputs: 0, demand: 0, generation: 0, capacity: 180, adapter: true, group: false, desc: "组外输入与组内输出的 1:1 直通接口" },
    { kind: "adapter_output", name: "封装输出", inputs: 3, outputs: 3, max_inputs: "", power_in: false, power_out: false, power_outputs: 0, demand: 0, generation: 0, capacity: 180, adapter: true, group: false, desc: "组内输入与组外输出的 1:1 直通接口" },
    { kind: "adapter_power", name: "封装电力", inputs: 0, outputs: 0, max_inputs: "", power_in: true, power_out: true, power_outputs: 3, demand: 0, generation: 0, capacity: 180, adapter: true, group: false, desc: "组外供电进入组内，负载按输出汇总" },
    { kind: "group", name: "封装分组", inputs: 0, outputs: 0, max_inputs: "", power_in: false, power_out: false, power_outputs: 0, demand: 0, generation: 0, capacity: 180, adapter: false, group: true, desc: "由组内封装节点声明输入、输出和电力接口" }
  ],
  recipes: [
    { id: "furnace_iron_ingot", node_kind: "furnace", name: "铁锭", output: "iron_ingot", amount: 1, time: 3, requires_power: false, desc: "铁矿加煤熔炼铁锭" },
    { id: "furnace_copper_ingot", node_kind: "furnace", name: "铜锭", output: "copper_ingot", amount: 1, time: 3, requires_power: false, desc: "铜矿加煤熔炼铜锭" },
    { id: "furnace_glass", node_kind: "furnace", name: "玻璃", output: "glass", amount: 1, time: 2.8, requires_power: false, desc: "砂矿熔炼玻璃" },
    { id: "kiln_steel_ingot", node_kind: "kiln", name: "钢锭", output: "steel_ingot", amount: 1, time: 5, requires_power: false, desc: "铁锭加煤炼钢" },
    { id: "caster_iron_plate", node_kind: "caster", name: "铁板", output: "iron_plate", amount: 2, time: 2.5, requires_power: false, desc: "铁锭压制铁板" },
    { id: "caster_iron_rod", node_kind: "caster", name: "铁棒", output: "iron_rod", amount: 2, time: 2.5, requires_power: false, desc: "铁锭拉制铁棒" },
    { id: "caster_copper_plate", node_kind: "caster", name: "铜板", output: "copper_plate", amount: 2, time: 2.5, requires_power: false, desc: "铜锭压制铜板" },
    { id: "caster_copper_rod", node_kind: "caster", name: "铜棒", output: "copper_rod", amount: 2, time: 2.5, requires_power: false, desc: "铜锭拉制铜棒" },
    { id: "caster_copper_wire", node_kind: "caster", name: "铜线", output: "copper_wire", amount: 3, time: 2.6, requires_power: false, desc: "铜锭拉制铜线" },
    { id: "caster_steel_plate", node_kind: "caster", name: "钢板", output: "steel_plate", amount: 2, time: 2.5, requires_power: false, desc: "钢锭压制钢板" },
    { id: "caster_steel_rod", node_kind: "caster", name: "钢棒", output: "steel_rod", amount: 2, time: 2.5, requires_power: false, desc: "钢锭拉制钢棒" },
    { id: "assembler_gear", node_kind: "assembler", name: "齿轮", output: "gear", amount: 1, time: 4, requires_power: false, desc: "基础机械传动件" },
    { id: "assembler_industrial_frame", node_kind: "assembler", name: "工业框架", output: "industrial_frame", amount: 1, time: 5, requires_power: false, desc: "设备结构核心件" },
    { id: "assembler_power_unit", node_kind: "assembler", name: "动力组件", output: "power_unit", amount: 1, time: 5, requires_power: false, desc: "设备动力核心件" },
    { id: "assembler_cable", node_kind: "assembler", name: "线缆", output: "cable", amount: 1, time: 4, requires_power: false, desc: "电力连接材料" },
    { id: "assembler_miner_device", node_kind: "assembler", name: "采矿机设备", output: "miner_device", amount: 1, time: 4, requires_power: false, desc: "制造采矿机" },
    { id: "assembler_furnace_device", node_kind: "assembler", name: "熔炉设备", output: "furnace_device", amount: 1, time: 4, requires_power: false, desc: "制造熔炉" },
    { id: "assembler_kiln_device", node_kind: "assembler", name: "高温熔炉设备", output: "kiln_device", amount: 1, time: 4.5, requires_power: false, desc: "制造高温熔炉" },
    { id: "assembler_caster_device", node_kind: "assembler", name: "铸造厂设备", output: "caster_device", amount: 1, time: 4.5, requires_power: false, desc: "制造铸造厂" },
    { id: "assembler_assembler_device", node_kind: "assembler", name: "组装厂设备", output: "assembler_device", amount: 1, time: 5, requires_power: false, desc: "制造组装厂" },
    { id: "assembler_generator_device", node_kind: "assembler", name: "发电厂设备", output: "generator_device", amount: 1, time: 5, requires_power: false, desc: "制造发电厂" },
    { id: "assembler_pole_device", node_kind: "assembler", name: "电杆设备", output: "pole_device", amount: 1, time: 3, requires_power: false, desc: "制造电杆" },
    { id: "assembler_warehouse_device", node_kind: "assembler", name: "仓库设备", output: "warehouse_device", amount: 1, time: 4, requires_power: false, desc: "制造仓库" },
    { id: "assembler_adapter_input_device", node_kind: "assembler", name: "封装输入设备", output: "adapter_input_device", amount: 1, time: 4, requires_power: false, desc: "制造封装输入节点" },
    { id: "assembler_adapter_output_device", node_kind: "assembler", name: "封装输出设备", output: "adapter_output_device", amount: 1, time: 4, requires_power: false, desc: "制造封装输出节点" },
    { id: "assembler_adapter_power_device", node_kind: "assembler", name: "封装电力设备", output: "adapter_power_device", amount: 1, time: 4.5, requires_power: false, desc: "制造封装电力节点" },
    { id: "assembler_mechanical_core", node_kind: "assembler", name: "机械核心", output: "mechanical_core", amount: 1, time: 11, requires_power: true, desc: "一阶段最终目标产物" }
  ],
  recipe_inputs: [
    { recipe_id: "furnace_iron_ingot", resource: "iron_ore", amount: 2 },
    { recipe_id: "furnace_iron_ingot", resource: "coal", amount: 1 },
    { recipe_id: "furnace_copper_ingot", resource: "copper_ore", amount: 2 },
    { recipe_id: "furnace_copper_ingot", resource: "coal", amount: 1 },
    { recipe_id: "furnace_glass", resource: "sand", amount: 2 },
    { recipe_id: "kiln_steel_ingot", resource: "iron_ingot", amount: 2 },
    { recipe_id: "kiln_steel_ingot", resource: "coal", amount: 1 },
    { recipe_id: "caster_iron_plate", resource: "iron_ingot", amount: 1 },
    { recipe_id: "caster_iron_rod", resource: "iron_ingot", amount: 1 },
    { recipe_id: "caster_copper_plate", resource: "copper_ingot", amount: 1 },
    { recipe_id: "caster_copper_rod", resource: "copper_ingot", amount: 1 },
    { recipe_id: "caster_copper_wire", resource: "copper_ingot", amount: 1 },
    { recipe_id: "caster_steel_plate", resource: "steel_ingot", amount: 1 },
    { recipe_id: "caster_steel_rod", resource: "steel_ingot", amount: 1 },
    { recipe_id: "assembler_gear", resource: "steel_plate", amount: 2 },
    { recipe_id: "assembler_gear", resource: "steel_rod", amount: 1 },
    { recipe_id: "assembler_industrial_frame", resource: "steel_plate", amount: 2 },
    { recipe_id: "assembler_industrial_frame", resource: "steel_rod", amount: 2 },
    { recipe_id: "assembler_power_unit", resource: "gear", amount: 1 },
    { recipe_id: "assembler_power_unit", resource: "copper_wire", amount: 2 },
    { recipe_id: "assembler_cable", resource: "copper_wire", amount: 2 },
    { recipe_id: "assembler_cable", resource: "glass", amount: 1 },
    { recipe_id: "assembler_miner_device", resource: "iron_plate", amount: 2 },
    { recipe_id: "assembler_miner_device", resource: "gear", amount: 1 },
    { recipe_id: "assembler_furnace_device", resource: "iron_plate", amount: 2 },
    { recipe_id: "assembler_furnace_device", resource: "iron_rod", amount: 2 },
    { recipe_id: "assembler_kiln_device", resource: "steel_plate", amount: 3 },
    { recipe_id: "assembler_kiln_device", resource: "industrial_frame", amount: 1 },
    { recipe_id: "assembler_caster_device", resource: "steel_plate", amount: 2 },
    { recipe_id: "assembler_caster_device", resource: "gear", amount: 1 },
    { recipe_id: "assembler_caster_device", resource: "industrial_frame", amount: 1 },
    { recipe_id: "assembler_assembler_device", resource: "industrial_frame", amount: 2 },
    { recipe_id: "assembler_assembler_device", resource: "power_unit", amount: 1 },
    { recipe_id: "assembler_generator_device", resource: "industrial_frame", amount: 2 },
    { recipe_id: "assembler_generator_device", resource: "power_unit", amount: 1 },
    { recipe_id: "assembler_generator_device", resource: "cable", amount: 2 },
    { recipe_id: "assembler_pole_device", resource: "iron_rod", amount: 2 },
    { recipe_id: "assembler_pole_device", resource: "cable", amount: 1 },
    { recipe_id: "assembler_warehouse_device", resource: "iron_plate", amount: 3 },
    { recipe_id: "assembler_warehouse_device", resource: "iron_rod", amount: 2 },
    { recipe_id: "assembler_adapter_input_device", resource: "iron_plate", amount: 2 },
    { recipe_id: "assembler_adapter_input_device", resource: "copper_wire", amount: 1 },
    { recipe_id: "assembler_adapter_output_device", resource: "iron_plate", amount: 2 },
    { recipe_id: "assembler_adapter_output_device", resource: "copper_wire", amount: 1 },
    { recipe_id: "assembler_adapter_power_device", resource: "iron_rod", amount: 1 },
    { recipe_id: "assembler_adapter_power_device", resource: "copper_wire", amount: 2 },
    { recipe_id: "assembler_adapter_power_device", resource: "cable", amount: 1 },
    { recipe_id: "assembler_mechanical_core", resource: "industrial_frame", amount: 3 },
    { recipe_id: "assembler_mechanical_core", resource: "power_unit", amount: 2 },
    { recipe_id: "assembler_mechanical_core", resource: "gear", amount: 2 },
    { recipe_id: "assembler_mechanical_core", resource: "cable", amount: 3 }
  ],
  balance: [
    { key: "RECIPE_INPUT_BUFFER_BATCHES", value: 18, type: "number", desc: "生产设备按配方材料预留的批次数" },
    { key: "SOURCE_RESERVE_MAX", value: 50000, type: "number", desc: "矿源储量上限" },
    { key: "MINER_OUTPUT_PER_SECOND", value: 0.8333333333, type: "number", desc: "采矿机基础输出速度" },
    { key: "DEVICE_CAPACITY", value: 180, type: "number", desc: "普通设备缓存上限" },
    { key: "WAREHOUSE_CAPACITY", value: 1000, type: "number", desc: "仓库容量" },
    { key: "POWER_WARN_LOAD", value: 60, type: "number", desc: "电网高负载阈值" },
    { key: "POWER_DANGER_LOAD", value: 80, type: "number", desc: "电网过载预警阈值" },
    { key: "POWER_OVERLOAD_LOAD", value: 100, type: "number", desc: "电网已超载阈值" },
    { key: "LOGISTICS_PACKET_LIMIT", value: 10, type: "number", desc: "单条物流线最大可见包数量" },
    { key: "LOGISTICS_WARN_PACKETS", value: 7, type: "number", desc: "物流线预警包数量" },
    { key: "LOGISTICS_WARN_EFFICIENCY", value: 80, type: "number", desc: "物流效率预警阈值" },
    { key: "LOGISTICS_DANGER_EFFICIENCY", value: 50, type: "number", desc: "物流效率危险阈值" },
    { key: "LOGISTICS_PACKET_SPACING", value: 18, type: "number", desc: "同线光球最小间距" },
    { key: "ADAPTER_PORT_CAPACITY", value: 1, type: "number", desc: "封装端口缓存容量" }
  ]
};

const sheetHeaders = {
  resources: ["key", "name", "color", "category", "desc"],
  node_types: ["kind", "name", "inputs", "outputs", "max_inputs", "power_in", "power_out", "power_outputs", "demand", "generation", "capacity", "adapter", "group", "desc"],
  recipes: ["id", "node_kind", "name", "output", "amount", "time", "requires_power", "desc"],
  recipe_inputs: ["recipe_id", "resource", "amount"],
  balance: ["key", "value", "type", "desc"]
};

function ensureTemplateWorkbook() {
  if (fs.existsSync(excelPath)) return false;
  fs.mkdirSync(path.dirname(excelPath), { recursive: true });
  const workbook = XLSX.utils.book_new();
  for (const [sheetName, rows] of Object.entries(defaultRows)) {
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: sheetHeaders[sheetName] });
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }
  XLSX.writeFile(workbook, excelPath);
  return true;
}

function readSheet(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error(`缺少 Sheet：${sheetName}`);
  return XLSX.utils.sheet_to_json(sheet, { defval: "" }).filter((row) => {
    return Object.values(row).some((value) => String(value).trim() !== "");
  });
}

function cleanString(value) {
  return String(value ?? "").trim();
}

function parseNumber(value, fieldName, rowName) {
  if (value === "" || value === null || value === undefined) return undefined;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) throw new Error(`${rowName} 的 ${fieldName} 必须是数字`);
  return numberValue;
}

function parseBool(value, fieldName, rowName) {
  if (value === "" || value === null || value === undefined) return false;
  if (typeof value === "boolean") return value;
  const text = cleanString(value).toLowerCase();
  if (["true", "1", "yes", "y", "是"].includes(text)) return true;
  if (["false", "0", "no", "n", "否"].includes(text)) return false;
  throw new Error(`${rowName} 的 ${fieldName} 必须是 TRUE/FALSE`);
}

function assertUnique(rows, key, sheetName) {
  const seen = new Set();
  for (const row of rows) {
    const value = cleanString(row[key]);
    if (!value) throw new Error(`${sheetName} 存在空 ${key}`);
    if (seen.has(value)) throw new Error(`${sheetName}.${key} 重复：${value}`);
    seen.add(value);
  }
}

function toPlainObject(rows, key, mapper) {
  return rows.reduce((result, row) => {
    result[cleanString(row[key])] = mapper(row);
    return result;
  }, {});
}

function buildConfig(workbook) {
  const resourceRows = readSheet(workbook, "resources");
  const nodeTypeRows = readSheet(workbook, "node_types");
  const recipeRows = readSheet(workbook, "recipes");
  const recipeInputRows = readSheet(workbook, "recipe_inputs");
  const balanceRows = readSheet(workbook, "balance");

  assertUnique(resourceRows, "key", "resources");
  assertUnique(nodeTypeRows, "kind", "node_types");
  assertUnique(recipeRows, "id", "recipes");
  assertUnique(balanceRows, "key", "balance");

  const resources = toPlainObject(resourceRows, "key", (row) => ({
    name: cleanString(row.name),
    color: cleanString(row.color) || "#73c8ff",
    category: cleanString(row.category),
    desc: cleanString(row.desc)
  }));

  const nodeTypes = toPlainObject(nodeTypeRows, "kind", (row) => {
    const kind = cleanString(row.kind);
    const nodeType = {
      name: cleanString(row.name),
      inputs: parseNumber(row.inputs, "inputs", kind) ?? 0,
      outputs: parseNumber(row.outputs, "outputs", kind) ?? 0,
      desc: cleanString(row.desc)
    };
    const optionalNumberFields = ["max_inputs", "power_outputs", "demand", "generation", "capacity"];
    for (const field of optionalNumberFields) {
      const value = parseNumber(row[field], field, kind);
      if (value !== undefined && !(field === "capacity" && value <= 0)) {
        const camelField = field.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
        nodeType[camelField] = value;
      }
    }
    if (parseBool(row.power_in, "power_in", kind)) nodeType.powerIn = true;
    if (parseBool(row.power_out, "power_out", kind)) nodeType.powerOut = true;
    if (parseBool(row.adapter, "adapter", kind)) nodeType.adapter = true;
    if (parseBool(row.group, "group", kind)) nodeType.group = true;
    return nodeType;
  });

  const resourceKeys = new Set(Object.keys(resources));
  const nodeKinds = new Set(Object.keys(nodeTypes));
  const recipeMap = new Map();
  const recipeInputs = new Map();

  for (const row of recipeRows) {
    const id = cleanString(row.id);
    const nodeKind = cleanString(row.node_kind);
    const output = cleanString(row.output);
    if (!nodeKinds.has(nodeKind)) throw new Error(`配方 ${id} 的 node_kind 不存在：${nodeKind}`);
    if (!resourceKeys.has(output)) throw new Error(`配方 ${id} 的 output 不存在：${output}`);
    recipeMap.set(id, {
      id,
      nodeKind,
      recipe: {
        id,
        name: cleanString(row.name),
        inputs: {},
        output,
        amount: parseNumber(row.amount, "amount", id) ?? 1,
        time: parseNumber(row.time, "time", id) ?? 1,
        desc: cleanString(row.desc)
      }
    });
    if (parseBool(row.requires_power, "requires_power", id)) {
      recipeMap.get(id).recipe.requiresPower = true;
    }
    recipeInputs.set(id, 0);
  }

  for (const row of recipeInputRows) {
    const recipeId = cleanString(row.recipe_id);
    const resource = cleanString(row.resource);
    if (!recipeMap.has(recipeId)) throw new Error(`recipe_inputs 引用了不存在的 recipe_id：${recipeId}`);
    if (!resourceKeys.has(resource)) throw new Error(`配方 ${recipeId} 的输入资源不存在：${resource}`);
    const amount = parseNumber(row.amount, "amount", `${recipeId}/${resource}`);
    if (!amount || amount <= 0) throw new Error(`配方 ${recipeId} 的输入 ${resource} 数量必须大于 0`);
    const recipe = recipeMap.get(recipeId).recipe;
    if (recipe.inputs[resource]) throw new Error(`配方 ${recipeId} 重复配置输入资源：${resource}`);
    recipe.inputs[resource] = amount;
    recipeInputs.set(recipeId, recipeInputs.get(recipeId) + 1);
  }

  const recipes = {};
  for (const [id, count] of recipeInputs.entries()) {
    if (count <= 0) throw new Error(`配方 ${id} 至少需要一个输入材料`);
  }
  for (const { nodeKind, recipe } of recipeMap.values()) {
    if (!recipes[nodeKind]) recipes[nodeKind] = [];
    recipes[nodeKind].push(recipe);
  }

  const balance = {};
  for (const row of balanceRows) {
    const key = cleanString(row.key);
    const type = cleanString(row.type).toLowerCase() || "number";
    if (type === "number") {
      balance[key] = parseNumber(row.value, "value", key);
    } else if (type === "boolean") {
      balance[key] = parseBool(row.value, "value", key);
    } else {
      balance[key] = cleanString(row.value);
    }
  }

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      source: "config/excel/game_config.xlsx"
    },
    resources,
    nodeTypes,
    recipes,
    balance
  };
}

function writeGeneratedConfig(config) {
  fs.mkdirSync(outputDir, { recursive: true });
  const json = JSON.stringify(config, null, 2);
  fs.writeFileSync(outputJsonPath, `${json}\n`, "utf8");
  fs.writeFileSync(
    outputJsPath,
    `window.GAME_CONFIG = ${json};\n`,
    "utf8"
  );
}

function main() {
  const created = ensureTemplateWorkbook();
  const workbook = XLSX.readFile(excelPath);
  const config = buildConfig(workbook);
  writeGeneratedConfig(config);
  console.log(`${created ? "已创建 Excel 模板并生成配置" : "已生成配置"}：${path.relative(rootDir, outputJsPath)}`);
}

main();
