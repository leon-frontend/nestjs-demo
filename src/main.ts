import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1'); //  添加全局前缀
  await app.listen(process.env.PORT ?? 3000);

  // 使用 webpack 实现热重载
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => void app.close());
  }
}
bootstrap().catch(console.error);
