import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createDatabaseConfig } from '../ormconfig';
import { UserModule } from './user/user.module';
import { RangeModule } from './range/range.module';
import { LogsModule } from './logs/logs.module';
// import readYamlFile from './configuration';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';

// 根据 NODE_ENV 读取开发环境或生产环境的 .env 文件。其中，NODE_ENV 由 cross-env 库在 package.json 文件中设置。
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    // 1.1 使用ConfigModule.forRoot() 方法读取 env 文件
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule 可以在所有模块中使用。注意，在其他模块中使用时需要导入 ConfigService。
      envFilePath, // 读取开发环境或生产环境的 .env 文件
      // 加载 .env 公共配置文件（与其他两个 .env 文件产生关联），并且使用 dotenv 库解析该文件(返回一个对象)。
      load: [() => dotenv.config({ path: '.env' })], // load 方法用于加载自定义的配置文件，用于加载公共配置文件。
      // 使用 Joi 库校验配置文件，最好配合官方的 @nestjs/config 读取 .env 文件时使用。
      validationSchema: Joi.object({
        // DB_PORT: Joi.number().default(3306), // 设置环境变量的默认值
        DB_PORT: Joi.number().valid(3306, 3307), // 校验环境变量的值，限制端口号的范围
        NODE_ENV: Joi.string().valid('development', 'production', 'test'),
      }),
    }),

    // 1.2 使用 ConfigModule.forRoot() 方法读取 yaml 文件
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [readYamlFile],
    // }),

    // -----------------------------------------------------------------------------------------
    // 2.1 配置 TypeORM - 数据写死
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3307, // 端口号，查看 docker-compose.yml 配置文件
    //   username: 'root',
    //   password: 'example',
    //   database: 'testdb', // 指定要连接的数据库名称，mysql 中必须需要有这个数据库
    //   entities: [],
    //   synchronize: true, // 同步本地实体与数据库中的表结构，一般会在初始化时使用。注意，仅在开发环境使用。
    //   logging: ['error'],
    // }),

    // 2.2 配置 TypeORM - 使用 configService 读取环境变量来配置数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createDatabaseConfig(configService),
    }),
    UserModule,
    RangeModule,
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
