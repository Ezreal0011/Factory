# 配置表说明

第一阶段配置已经从代码中拆出到 Excel：

- `config/excel/game_config.xlsx`：策划配置源文件
- `config/generated/game_config.json`：转表生成的 JSON
- `config/generated/game_config.js`：浏览器直接加载的配置文件

修改 Excel 后运行：

```bash
npm run build-config
```

转表工具会校验资源、节点、配方、配方输入和全局数值。如果配方引用了不存在的资源，或者数值字段不是数字，会直接报错并停止生成。

当前第一阶段包含这些 Sheet：

- `resources`：资源表
- `node_types`：节点类型表
- `recipes`：配方主表
- `recipe_inputs`：配方输入材料表
- `balance`：全局数值表

游戏启动时会先加载 `config/generated/game_config.js`，再加载 `app.js`。如果生成配置存在，它会覆盖代码内置默认配置；如果配置缺失，游戏仍会使用代码里的兜底默认值。
