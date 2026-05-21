window.GAME_CONFIG = {
  "meta": {
    "generatedAt": "2026-05-19T14:26:37.079Z",
    "source": "config/excel/game_config.xlsx"
  },
  "resources": {
    "iron_ore": {
      "name": "铁矿",
      "color": "#b9d9f2",
      "category": "ore",
      "desc": "基础铁矿"
    },
    "copper_ore": {
      "name": "铜矿",
      "color": "#f0a24a",
      "category": "ore",
      "desc": "基础铜矿"
    },
    "coal": {
      "name": "煤矿",
      "color": "#6f7780",
      "category": "ore",
      "desc": "燃料资源"
    },
    "sand": {
      "name": "砂矿",
      "color": "#d8c89f",
      "category": "ore",
      "desc": "玻璃原料"
    },
    "iron_ingot": {
      "name": "铁锭",
      "color": "#d7ecff",
      "category": "ingot",
      "desc": "基础金属锭"
    },
    "copper_ingot": {
      "name": "铜锭",
      "color": "#ffbf66",
      "category": "ingot",
      "desc": "导电金属锭"
    },
    "glass": {
      "name": "玻璃",
      "color": "#aeeeff",
      "category": "material",
      "desc": "电子和线缆材料"
    },
    "steel_ingot": {
      "name": "钢锭",
      "color": "#9fc4e7",
      "category": "ingot",
      "desc": "进阶金属锭"
    },
    "iron_plate": {
      "name": "铁板",
      "color": "#d7ecff",
      "category": "part",
      "desc": "基础板材"
    },
    "iron_rod": {
      "name": "铁棒",
      "color": "#d7ecff",
      "category": "part",
      "desc": "基础杆件"
    },
    "copper_plate": {
      "name": "铜板",
      "color": "#ffbf66",
      "category": "part",
      "desc": "铜制板材"
    },
    "copper_rod": {
      "name": "铜棒",
      "color": "#ffbf66",
      "category": "part",
      "desc": "铜制杆件"
    },
    "copper_wire": {
      "name": "铜线",
      "color": "#ffd37a",
      "category": "part",
      "desc": "线缆基础材料"
    },
    "steel_plate": {
      "name": "钢板",
      "color": "#9fc4e7",
      "category": "part",
      "desc": "进阶板材"
    },
    "steel_rod": {
      "name": "钢棒",
      "color": "#9fc4e7",
      "category": "part",
      "desc": "进阶杆件"
    },
    "gear": {
      "name": "齿轮",
      "color": "#c9d6df",
      "category": "component",
      "desc": "机械传动组件"
    },
    "industrial_frame": {
      "name": "工业框架",
      "color": "#84c7ff",
      "category": "component",
      "desc": "设备结构件"
    },
    "power_unit": {
      "name": "动力组件",
      "color": "#7ef0b2",
      "category": "component",
      "desc": "供能组件"
    },
    "cable": {
      "name": "线缆",
      "color": "#ffe45c",
      "category": "component",
      "desc": "电力连接材料"
    },
    "miner_device": {
      "name": "采矿机设备",
      "color": "#b9d9f2",
      "category": "device",
      "desc": "可部署采矿机"
    },
    "furnace_device": {
      "name": "熔炉设备",
      "color": "#d7ecff",
      "category": "device",
      "desc": "可部署熔炉"
    },
    "kiln_device": {
      "name": "高温熔炉设备",
      "color": "#9fc4e7",
      "category": "device",
      "desc": "可部署高温熔炉"
    },
    "caster_device": {
      "name": "铸造厂设备",
      "color": "#9fc4e7",
      "category": "device",
      "desc": "可部署铸造厂"
    },
    "assembler_device": {
      "name": "组装厂设备",
      "color": "#7ef0b2",
      "category": "device",
      "desc": "可部署组装厂"
    },
    "generator_device": {
      "name": "发电厂设备",
      "color": "#ffe45c",
      "category": "device",
      "desc": "可部署发电厂"
    },
    "pole_device": {
      "name": "电杆设备",
      "color": "#ffe45c",
      "category": "device",
      "desc": "可部署电杆"
    },
    "warehouse_device": {
      "name": "仓库设备",
      "color": "#73c8ff",
      "category": "device",
      "desc": "可部署仓库"
    },
    "adapter_input_device": {
      "name": "封装输入设备",
      "color": "#9bdcff",
      "category": "device",
      "desc": "可部署封装输入"
    },
    "adapter_output_device": {
      "name": "封装输出设备",
      "color": "#ffe45c",
      "category": "device",
      "desc": "可部署封装输出"
    },
    "adapter_power_device": {
      "name": "封装电力设备",
      "color": "#fff176",
      "category": "device",
      "desc": "可部署封装电力"
    },
    "mechanical_core": {
      "name": "机械核心",
      "color": "#ffffff",
      "category": "goal",
      "desc": "一阶段核心目标产物"
    }
  },
  "nodeTypes": {
    "source": {
      "name": "矿源",
      "inputs": 0,
      "outputs": 3,
      "desc": "固定矿藏总量，可分出 3 路接入采矿机",
      "powerOutputs": 0,
      "demand": 0,
      "generation": 0
    },
    "miner": {
      "name": "采矿机",
      "inputs": 1,
      "outputs": 1,
      "desc": "从矿源开采并输出对应矿物",
      "powerOutputs": 0,
      "demand": 0,
      "generation": 0,
      "capacity": 180
    },
    "furnace": {
      "name": "熔炉",
      "inputs": 3,
      "outputs": 1,
      "desc": "基础冶炼节点，可切换冶炼配方",
      "powerOutputs": 0,
      "demand": 8,
      "generation": 0,
      "capacity": 180,
      "powerIn": true
    },
    "kiln": {
      "name": "高温熔炉",
      "inputs": 3,
      "outputs": 1,
      "desc": "高级冶炼节点，可生产钢锭",
      "powerOutputs": 0,
      "demand": 14,
      "generation": 0,
      "capacity": 180,
      "powerIn": true
    },
    "caster": {
      "name": "铸造厂",
      "inputs": 1,
      "outputs": 1,
      "desc": "锭类加工节点，可切换铸造配方",
      "maxInputs": 4,
      "powerOutputs": 0,
      "demand": 10,
      "generation": 0,
      "capacity": 180,
      "powerIn": true
    },
    "assembler": {
      "name": "组装厂",
      "inputs": 4,
      "outputs": 1,
      "desc": "组件与机械核心生产节点",
      "powerOutputs": 0,
      "demand": 16,
      "generation": 0,
      "capacity": 180,
      "powerIn": true
    },
    "generator": {
      "name": "发电厂",
      "inputs": 1,
      "outputs": 0,
      "desc": "消耗煤矿并向电网供电",
      "powerOutputs": 1,
      "demand": 0,
      "generation": 80,
      "capacity": 180,
      "powerOut": true
    },
    "pole": {
      "name": "电杆",
      "inputs": 0,
      "outputs": 0,
      "desc": "电力中继节点，可分出 3 路电力输出",
      "powerOutputs": 3,
      "demand": 0,
      "generation": 0,
      "capacity": 180,
      "powerIn": true,
      "powerOut": true
    },
    "warehouse": {
      "name": "仓库",
      "inputs": 4,
      "outputs": 4,
      "desc": "物流控制中心：单资源、分流、缓存、中转",
      "powerOutputs": 0,
      "demand": 0,
      "generation": 0,
      "capacity": 1000
    },
    "adapter_input": {
      "name": "封装输入",
      "inputs": 3,
      "outputs": 3,
      "desc": "组外输入与组内输出的 1:1 直通接口",
      "powerOutputs": 0,
      "demand": 0,
      "generation": 0,
      "capacity": 180,
      "adapter": true
    },
    "adapter_output": {
      "name": "封装输出",
      "inputs": 3,
      "outputs": 3,
      "desc": "组内输入与组外输出的 1:1 直通接口",
      "powerOutputs": 0,
      "demand": 0,
      "generation": 0,
      "capacity": 180,
      "adapter": true
    },
    "adapter_power": {
      "name": "封装电力",
      "inputs": 0,
      "outputs": 0,
      "desc": "组外供电进入组内，负载按输出汇总",
      "powerOutputs": 3,
      "demand": 0,
      "generation": 0,
      "capacity": 180,
      "powerIn": true,
      "powerOut": true,
      "adapter": true
    },
    "group": {
      "name": "封装分组",
      "inputs": 0,
      "outputs": 0,
      "desc": "由组内封装节点声明输入、输出和电力接口",
      "powerOutputs": 0,
      "demand": 0,
      "generation": 0,
      "capacity": 180,
      "group": true
    }
  },
  "recipes": {
    "furnace": [
      {
        "id": "furnace_iron_ingot",
        "name": "铁锭",
        "inputs": {
          "iron_ore": 2,
          "coal": 1
        },
        "output": "iron_ingot",
        "amount": 1,
        "time": 3,
        "desc": "铁矿加煤熔炼铁锭"
      },
      {
        "id": "furnace_copper_ingot",
        "name": "铜锭",
        "inputs": {
          "copper_ore": 2,
          "coal": 1
        },
        "output": "copper_ingot",
        "amount": 1,
        "time": 3,
        "desc": "铜矿加煤熔炼铜锭"
      },
      {
        "id": "furnace_glass",
        "name": "玻璃",
        "inputs": {
          "sand": 2
        },
        "output": "glass",
        "amount": 1,
        "time": 2.8,
        "desc": "砂矿熔炼玻璃"
      }
    ],
    "kiln": [
      {
        "id": "kiln_steel_ingot",
        "name": "钢锭",
        "inputs": {
          "iron_ingot": 2,
          "coal": 1
        },
        "output": "steel_ingot",
        "amount": 1,
        "time": 5,
        "desc": "铁锭加煤炼钢"
      }
    ],
    "caster": [
      {
        "id": "caster_iron_plate",
        "name": "铁板",
        "inputs": {
          "iron_ingot": 1
        },
        "output": "iron_plate",
        "amount": 2,
        "time": 2.5,
        "desc": "铁锭压制铁板"
      },
      {
        "id": "caster_iron_rod",
        "name": "铁棒",
        "inputs": {
          "iron_ingot": 1
        },
        "output": "iron_rod",
        "amount": 2,
        "time": 2.5,
        "desc": "铁锭拉制铁棒"
      },
      {
        "id": "caster_copper_plate",
        "name": "铜板",
        "inputs": {
          "copper_ingot": 1
        },
        "output": "copper_plate",
        "amount": 2,
        "time": 2.5,
        "desc": "铜锭压制铜板"
      },
      {
        "id": "caster_copper_rod",
        "name": "铜棒",
        "inputs": {
          "copper_ingot": 1
        },
        "output": "copper_rod",
        "amount": 2,
        "time": 2.5,
        "desc": "铜锭拉制铜棒"
      },
      {
        "id": "caster_copper_wire",
        "name": "铜线",
        "inputs": {
          "copper_ingot": 1
        },
        "output": "copper_wire",
        "amount": 3,
        "time": 2.6,
        "desc": "铜锭拉制铜线"
      },
      {
        "id": "caster_steel_plate",
        "name": "钢板",
        "inputs": {
          "steel_ingot": 1
        },
        "output": "steel_plate",
        "amount": 2,
        "time": 2.5,
        "desc": "钢锭压制钢板"
      },
      {
        "id": "caster_steel_rod",
        "name": "钢棒",
        "inputs": {
          "steel_ingot": 1
        },
        "output": "steel_rod",
        "amount": 2,
        "time": 2.5,
        "desc": "钢锭拉制钢棒"
      }
    ],
    "assembler": [
      {
        "id": "assembler_gear",
        "name": "齿轮",
        "inputs": {
          "steel_plate": 2,
          "steel_rod": 1
        },
        "output": "gear",
        "amount": 1,
        "time": 4,
        "desc": "基础机械传动件"
      },
      {
        "id": "assembler_industrial_frame",
        "name": "工业框架",
        "inputs": {
          "steel_plate": 2,
          "steel_rod": 2
        },
        "output": "industrial_frame",
        "amount": 1,
        "time": 5,
        "desc": "设备结构核心件"
      },
      {
        "id": "assembler_power_unit",
        "name": "动力组件",
        "inputs": {
          "gear": 1,
          "copper_wire": 2
        },
        "output": "power_unit",
        "amount": 1,
        "time": 5,
        "desc": "设备动力核心件"
      },
      {
        "id": "assembler_cable",
        "name": "线缆",
        "inputs": {
          "copper_wire": 2,
          "glass": 1
        },
        "output": "cable",
        "amount": 1,
        "time": 4,
        "desc": "电力连接材料"
      },
      {
        "id": "assembler_miner_device",
        "name": "采矿机设备",
        "inputs": {
          "iron_plate": 2,
          "gear": 1
        },
        "output": "miner_device",
        "amount": 1,
        "time": 4,
        "desc": "制造采矿机"
      },
      {
        "id": "assembler_furnace_device",
        "name": "熔炉设备",
        "inputs": {
          "iron_plate": 2,
          "iron_rod": 2
        },
        "output": "furnace_device",
        "amount": 1,
        "time": 4,
        "desc": "制造熔炉"
      },
      {
        "id": "assembler_kiln_device",
        "name": "高温熔炉设备",
        "inputs": {
          "steel_plate": 3,
          "industrial_frame": 1
        },
        "output": "kiln_device",
        "amount": 1,
        "time": 4.5,
        "desc": "制造高温熔炉"
      },
      {
        "id": "assembler_caster_device",
        "name": "铸造厂设备",
        "inputs": {
          "steel_plate": 2,
          "gear": 1,
          "industrial_frame": 1
        },
        "output": "caster_device",
        "amount": 1,
        "time": 4.5,
        "desc": "制造铸造厂"
      },
      {
        "id": "assembler_assembler_device",
        "name": "组装厂设备",
        "inputs": {
          "industrial_frame": 2,
          "power_unit": 1
        },
        "output": "assembler_device",
        "amount": 1,
        "time": 5,
        "desc": "制造组装厂"
      },
      {
        "id": "assembler_generator_device",
        "name": "发电厂设备",
        "inputs": {
          "industrial_frame": 2,
          "power_unit": 1,
          "cable": 2
        },
        "output": "generator_device",
        "amount": 1,
        "time": 5,
        "desc": "制造发电厂"
      },
      {
        "id": "assembler_pole_device",
        "name": "电杆设备",
        "inputs": {
          "iron_rod": 2,
          "cable": 1
        },
        "output": "pole_device",
        "amount": 1,
        "time": 3,
        "desc": "制造电杆"
      },
      {
        "id": "assembler_warehouse_device",
        "name": "仓库设备",
        "inputs": {
          "iron_plate": 3,
          "iron_rod": 2
        },
        "output": "warehouse_device",
        "amount": 1,
        "time": 4,
        "desc": "制造仓库"
      },
      {
        "id": "assembler_adapter_input_device",
        "name": "封装输入设备",
        "inputs": {
          "iron_plate": 2,
          "copper_wire": 1
        },
        "output": "adapter_input_device",
        "amount": 1,
        "time": 4,
        "desc": "制造封装输入节点"
      },
      {
        "id": "assembler_adapter_output_device",
        "name": "封装输出设备",
        "inputs": {
          "iron_plate": 2,
          "copper_wire": 1
        },
        "output": "adapter_output_device",
        "amount": 1,
        "time": 4,
        "desc": "制造封装输出节点"
      },
      {
        "id": "assembler_adapter_power_device",
        "name": "封装电力设备",
        "inputs": {
          "iron_rod": 1,
          "copper_wire": 2,
          "cable": 1
        },
        "output": "adapter_power_device",
        "amount": 1,
        "time": 4.5,
        "desc": "制造封装电力节点"
      },
      {
        "id": "assembler_mechanical_core",
        "name": "机械核心",
        "inputs": {
          "industrial_frame": 3,
          "power_unit": 2,
          "gear": 2,
          "cable": 3
        },
        "output": "mechanical_core",
        "amount": 1,
        "time": 11,
        "desc": "一阶段最终目标产物",
        "requiresPower": true
      }
    ]
  },
  "balance": {
    "RECIPE_INPUT_BUFFER_BATCHES": 18,
    "SOURCE_RESERVE_MAX": 50000,
    "MINER_OUTPUT_PER_SECOND": 0.8333333333,
    "DEVICE_CAPACITY": 180,
    "WAREHOUSE_CAPACITY": 1000,
    "POWER_WARN_LOAD": 60,
    "POWER_DANGER_LOAD": 80,
    "POWER_OVERLOAD_LOAD": 100,
    "LOGISTICS_PACKET_LIMIT": 10,
    "LOGISTICS_WARN_PACKETS": 7,
    "LOGISTICS_WARN_EFFICIENCY": 80,
    "LOGISTICS_DANGER_EFFICIENCY": 50,
    "LOGISTICS_PACKET_SPACING": 18,
    "ADAPTER_PORT_CAPACITY": 1
  }
};
