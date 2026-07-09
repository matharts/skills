# Skill 编写指南

本指南说明如何创建一个符合 MathArts 规范的 Agent Skill。

## 目录结构

最小结构（第一阶段）：

```text
skills/<skill-name>/
  SKILL.md      # 必需：frontmatter + 执行指令
  README.md     # 必需：面向人类的说明
```

完整结构（按需添加）：

```text
skills/<skill-name>/
  SKILL.md
  README.md
  scripts/      # 可执行脚本
  references/   # 按需加载的参考文档
  assets/       # 模板与静态资源
  examples/     # 正反例
  tests/        # 测试 fixtures
```

## SKILL.md 格式

### Frontmatter

```yaml
---
name: <skill-name>          # 必须匹配目录名
description: <描述>           # <= 1024 字符，含触发词
license: MIT
compatibility: <兼容性说明>
metadata:
  version: "0.1.0"
  status: "experimental"
  category: "<分类>"
  tags: "<逗号分隔标签>"
  extends: "<基础 Skill>"     # 可选
  dependencies: "<依赖列表>"   # 可选
  maintainers: "<维护者>"
---
```

### 正文

- 不超过 500 行
- 包含"何时使用"和"执行指令"
- 超出内容拆入 `references/`，正文中指明加载时机

## description 写作指南

description 是 Agent 决定是否激活 Skill 的唯一依据。

- 必须包含"做什么"：具体动作和产物类型
- 必须包含"何时使用"：触发场景关键词
- 禁止模糊表述（如"通用文档助手"）

## 校验

创建完成后运行：

```bash
bun tools/cli.ts validate --check all skills/<skill-name>/
```

确保全部 PASS。
