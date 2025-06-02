import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RangeModule } from './range/range.module';
import { ConfigModule } from '@nestjs/config';
import readYamlFile from './configuration';
// import * as dotenv from 'dotenv';

// 根据 NODE_ENV 读取开发环境或生产环境的 .env 文件。其中，NODE_ENV 由 cross-env 库在 package.json 文件中设置。
// const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    // 1. 使用ConfigModule.forRoot() 方法读取 env 文件
    // ConfigModule.forRoot({
    //   isGlobal: true, // ConfigModule 可以在所有模块中使用。注意，在其他模块中使用时需要导入 ConfigService。
    //   envFilePath, // 读取开发环境或生产环境的 .env 文件
    //   // 加载 .env 公共配置文件（与其他两个 .env 文件产生关联），并且使用 dotenv 库解析该文件(返回一个对象)。
    //   load: [() => dotenv.config({ path: '.env' })], // load 方法用于加载自定义的配置文件。
    // }),

    // 2. 使用 ConfigModule.forRoot() 方法读取 yaml 文件
    ConfigModule.forRoot({
      isGlobal: true,
      load: [readYamlFile],
    }),
    UserModule,
    RangeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
