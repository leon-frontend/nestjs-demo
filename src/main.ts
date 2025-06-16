import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false, // 关闭整个 NestJs 的日志
    // logger: ['error', 'warn'], // 指定需要打印的日志等级
  });

  // 添加全局前缀
  app.setGlobalPrefix('api/v1');

  // 全局注册过滤器，配合错误日志使用
  const logger = new Logger(); // 创建一个日志实例
  app.useGlobalFilters(new HttpExceptionFilter(logger)); // 注意，全局过滤器只能有一个。

  await app.listen(process.env.PORT ?? 3000);

  // 创建日志实例，并输出 warn 等级的日志
  // logger.log(`Application is running on: 3000 --- log level`); // 绿色
  // logger.warn(`Application is running on: 3000 --- warn level`); // 橙色

  // 使用 webpack 实现热重载
  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => void app.close());
  // }
}
bootstrap().catch(console.error);
