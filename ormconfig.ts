// import * as fs from 'fs';
// import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { configEnum } from 'src/enum/config.enum';
// import { Logs } from 'src/logs/logs.entity';
// import { Roles } from 'src/roles/roles.entity';
// import { Profile } from 'src/user/profile.entity';
// import { User } from 'src/user/user.entity';

// todo: ---------------- 手动合并默认配置和环境特定配置 ------------------
// 通过环境变量读取不同的 .env 文件，返回一个对象
// const readEnvFile = (env: string): Record<string, unknown> => {
//   if (fs.existsSync(env)) {
//     return dotenv.parse(fs.readFileSync(env));
//   }
//   return {};
// };

// 通过 dotENV 库解析不同的配置文件
// const buildConnectionOptions = () => {
//   const defaultConfig = readEnvFile('.env'); // 默认配置
//   const envConfig = readEnvFile(
//     `.env.${process.env.NODE_ENV || 'development'}`,
//   ); // 读取不同环境配置
//   const config = { ...defaultConfig, ...envConfig }; // 合并配置

//   return {
//     type: config[configEnum.DB_HOST],
//     host: config[configEnum.DB_HOST],
//     port: config[configEnum.DB_PORT],
//     username: config[configEnum.DB_USERNAME],
//     password: config[configEnum.DB_PASSWORD],
//     database: config[configEnum.DB_DATABASE], // 默认数据库名称
//     entities: [User, Profile, Logs, Roles], // 实体类，对应数据库表
//     synchronize: process.env.NODE_ENV === 'development', // 同步本地实体与数据库中的表结构，一般会在初始化时使用。注意，仅在开发环境使用。
//     logging: false, // 关闭 TypeORM 的日志
//     // logging: process.env.NODE_ENV === 'development', // 打印所有的 SQL 语句，一般只在开发环境下使用
//   };
// };

// todo: ---------------- 使用 NestJs 中的 configService 进行配置 ------------------
// 连接 MySQL 数据库的配置
export const createDatabaseConfig = (
  configService: ConfigService,
): DataSourceOptions => {
  // 一定要输出这个路径看看具体路径是什么
  const entitiesDir = __dirname.includes('dist')
    ? [__dirname + '/**/*.entity.js'] // nest start 情况：查找编译后的 .js 文件
    : ['src/**/*.entity.{js,ts}']; // 其他情况：查找源文件

  // 输出： E:\FrontEnd\Project\nestjs-demo\dist/**/*.entity.ts
  // console.log(`${__dirname + '/**/*.entity.ts'}`);

  return {
    type: 'mysql',
    host: configService.get<string>(configEnum.DB_HOST),
    port: configService.get<number>(configEnum.DB_PORT),
    username: configService.get<string>(configEnum.DB_USERNAME),
    password: configService.get<string>(configEnum.DB_PASSWORD),
    database: configService.get<string>(configEnum.DB_DATABASE), // 指定要连接的数据库名称，mysql 中必须需要有这个数据库
    entities: entitiesDir, // 实体类，对应数据库表
    synchronize: process.env.NODE_ENV === 'development', // 同步本地实体与数据库中的表结构，一般会在初始化时使用。注意，仅在开发环境使用。
    logging: false, // 关闭 TypeORM 的日志
    // logging: process.env.NODE_ENV === 'development', // 打印所有的 SQL 语句，一般只在开发环境下使用
  };
};

// 创建数据源实例（用于 TypeORM CLI 工具）
const configService = new ConfigService();
export default new DataSource(createDatabaseConfig(configService));
