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

## 2.1 [dotenv 库 ](https://www.npmjs.com/package/dotenv) & @nestjs/config

- **理解**：`dotenv` 库是一个非常流行的用于在 Node.js 环境中加载环境变量的工具。通过将敏感的配置信息（如数据库连接字符串、API 密钥等）保存在 `.env` 文件中，可以方便地在不同的开发环境和生产环境中进行配置管理。
- **核心功能**：将 `.env` 文件中的变量加载到 `process.env` 中，以便可以在代码中访问这些变量。
- **@nestjs/config 模块**：NestJs 官方的 Config 模块采用的是 dotenv 库。

```ts
pnpm i --save @nestjs/config // 安装模块
pnpm i -D cross-env // 用于设置 NODE_ENV 运行环境
pnpm i dotenv // 在 nestjs 中安装这个库，用于解析 .env 公共配置文件

// ----------------------- app.module.ts 文件：读取多个 .env 文件 -------------------------
// 根据 NODE_ENV 读取开发环境或生产环境的 .env 文件。其中，NODE_ENV 由 cross-env 库在 package.json 文件中设置。
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
@Module({
  imports: [     
    ConfigModule.forRoot({ // ConfigModule.forRoot() 方法用于读取 env 文件
      isGlobal: true, // ConfigModule 可以在所有模块中使用。注意，在其他模块中使用时需要导入 ConfigService。
      envFilePath, // 读取开发环境或生产环境的 .env 文件
      // 加载 .env 公共配置文件（与其他两个 .env 文件产生关联），并且使用 dotenv 库解析该文件(返回一个对象)。
      load: [() => dotenv.config({ path: '.env' })], // load 方法用于加载自定义的配置文件。
    }),
    ... ...
  ],
  ... ...
})
```

- `ConfigModule.forRoot({ load：[xxx] })`：load 配置项可以用于加载自定义的配置文件。`.env` 文件在处理多层级的环境变量时会出现**变量名过长**的问题，比如 **`db_mysql_port`**。因此，可以使用 load 配置项读取 `yaml` 自定义文件，该类型文件主要处理**多层嵌套的环境变量**。

```ts
pnpm i js-yaml // 对 yaml 文件进行解析的库，会返回一个对象
pnpm i -D @types/js-yaml // js-yaml 文件的类型声明

// ------------ projectRoot/config/config.yaml 文件 -------------
db:
  mysql1:
    host: 127.0.0.1
    name: mysql-dev1
    port: 3306
  mysql2:
    host: 127.0.0.1
    name: mysql-dev2
    port: 3306

// ------------- src/configuration.ts 文件用于读取 yaml 环境变量配置文件 -------------
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
const YAML_CONFIG_FILENAME = 'config.yaml';
const filePath = join(__dirname, '../config', YAML_CONFIG_FILENAME);
export default () => { // 导出一个函数是为了在 app.module.ts 中的 load 配置项中使用 
  return yaml.load(readFileSync(filePath, 'utf8'));  // 使用 yaml.laod 解析 yaml 文件，并返回一个对象
};

// ----------- 创建 config.development.yaml 文件和 config.production.yaml 文件 --------------
pnpm i lodash // 使用 lodash 中的 merge 方法实现深度合并
pnpm i --save-dev @types/lodash 
// 读取公共环境变量的 yaml 文件
const YAML_COMMON_CONFIG = 'config.yaml';
const commonPath = join(__dirname, '../config', YAML_COMMON_CONFIG);
const commonConfig = yaml.load(readFileSync(commonPath, 'utf8'));

// 根据 NODE_ENV 变量的值决定读取开发环境还是生产环境的 yaml 文件
const YAML_ENV_CONFIG = `config.${process.env.NODE_ENV || 'development'}.yaml`;
const envPath = join(__dirname, '../config', YAML_ENV_CONFIG);
const envConfig = yaml.load(readFileSync(envPath, 'utf8'));

// 导出一个函数是为了在 app.module.ts 中的 load 配置项中使用
export default (): Record<string, any> => {
  // 使用 lodash 的 merge 方法将公共配置和当前环境配置合并成一个新的配置对象(深度合并)
  return _.merge(commonConfig, envConfig) as Record<string, any>;
};
```

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



