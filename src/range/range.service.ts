import { BadRequestException, Injectable } from '@nestjs/common';

export type ResType = {
  code: number;
  msg: string;
  data: Array<string>;
};

@Injectable()
export class RangeService {
  getRange(num: number): ResType {
    // 校验 num
    if (!num || isNaN(num)) {
      throw new BadRequestException('num 必须是有效的数字');
    }

    const res: Array<string> = []; // 返回的结果数组

    for (let i = 1; i <= num; i++) {
      res.push(i.toString());
    }

    return {
      code: 0,
      msg: '请求成功!',
      data: res,
    };
  }
}
