import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';
import type { Response } from 'express';

// todo 统一处理 TypeORM 错误，在 Controller 中使用
@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  // ArgumentsHost: 提供对当前执行上下文的访问，可以获取 Request、Response 对象。
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取上下文对象
    const response = ctx.getResponse<Response>(); // 获取响应对象
    let errorCode = 500; // 默认为服务器错误，和 HTTP 响应码不是一个概念

    // 检查异常是否为查询失败错误
    if (exception instanceof QueryFailedError) {
      // QueryFailedError 包含一个 driverError 属性，它包含了数据库驱动返回的原始错误
      errorCode = (exception.driverError as { errno: number }).errno;
    }

    // 定义响应数据，status 中的值是 HTTP 响应码
    response.status(500).json({
      errorCode, // 这个 code 是自定义设置的，和 HTTP 响应码不是一个概念
      timestamp: new Date().toISOString(),
      errorMsg: exception.message,
    });
  }
}
