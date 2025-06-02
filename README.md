# 01. 解决 CRLF 换行报错

- 创建新项目时，会报错 `Delete ␍ eslintprettier/prettier`

```js
// 在 .prettierrc 文件中加入如下代码
"endOfLine": "auto"

// 在 eslint.config.mjs 文件中加入如下代码
rules: {
	'prettier/prettier': ['error', { endOfLine: 'auto' }],
}
```

# 02. 多环境配置

## 2.1 [dotenv 库](https://www.npmjs.com/package/dotenv)

- **理解**：`dotenv` 库是一个非常流行的用于在 Node.js 环境中加载环境变量的工具。通过将敏感的配置信息（如数据库连接字符串、API 密钥等）保存在 `.env` 文件中，可以方便地在不同的开发环境和生产环境中进行配置管理。
- **核心功能**：将 `.env` 文件中的变量加载到 `process.env` 中，以便可以在代码中访问这些变量。

## 2.2 [config 库](https://www.npmjs.com/package/config)

- **理解**：`config` 库核心思想是将应用的配置信息从代码中分离出来，允许不同的配置根据运行的环境（如开发、生产、测试等）进行管理和加载。
- **特点**：`config` 库支持配置项的**层级结构**，可以将多个配置项组织成一个嵌套对象。
- **使用场景**：它通常用于中大型项目，尤其是当应用有多个配置项并且需要在不同环境中灵活配置时。

```ts
// 配置文件结构
project/
├── config/
│   ├── default.json        // 默认配置
│   ├── production.json     // 生产环境配置
│   ├── development.json    // 开发环境配置
│   └── test.json           // 测试环境配置
├── app.js
└── package.json

// 配置嵌套对象
{
  "db": { "credentials": { "user": "admin", }  }
}

// 使用 config 库来加载和访问这些配置项
const config = require('config'); 
const dbUser = config.get('db.credentials.user');
console.log(dbUser); // 输出：admin
```

## 2.3 @nestjs/config 模块

