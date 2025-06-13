import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch(HttpException) // 指定这个过滤器只捕获 HttpException 类型的异常
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {} // 异常处理结合日志，会在控制台输出异常

  /*
    实现 ExceptionFilter 接口中的 catch 方法。
    ArgumentsHost: 提供对当前执行上下文的访问，可以获取 Request、Response 对象。
  */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取上下文对象
    const request = ctx.getRequest<Request>(); // 获取请求对象
    const response = ctx.getResponse<Response>(); // 获取响应对象
    const status = exception.getStatus(); // 获取状态码
    this.logger.error(exception.message, exception.stack); // 错误日志

    // 定义响应数据
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      // NotFoundException('用户不存在') 中的参数会作为 message 的值
      message: exception.message || HttpException.name,
    });

    // throw new Error('Method not implemented.');
  }
}
