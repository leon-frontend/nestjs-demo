import { Controller, Get, Query } from '@nestjs/common';
import { RangeService } from './range.service';
import type { ResType } from './range.service';

@Controller('range')
export class RangeController {
  constructor(private rangeService: RangeService) {}

  @Get() // 获取查询参数中的 num 参数
  getRange(@Query('num') numStr: string): ResType {
    return this.rangeService.getRange(+numStr);
  }
}
