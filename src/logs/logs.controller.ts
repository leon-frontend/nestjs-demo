import { Controller, Get } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(
    // 声明 logsService，可以使用 logs.service.ts 文件中的方法
    private readonly logsService: LogsService,
  ) {}

  @Get('/logsByGroup')
  getLogsByGroup() {
    // 调用 logsService 中的 findLogsByGoup 方法，并返回结果
    return this.logsService.findLogsByGoup(2);
  }
}
