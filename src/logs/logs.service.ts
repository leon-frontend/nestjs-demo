import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from './logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogsService {
  constructor(
    // 注入 LogsRepository 依赖，它是一个操作 Logs 表的工具
    @InjectRepository(Logs)
    private readonly logsRepository: Repository<Logs>,
  ) {}

  // todo: 使用 Query Builder 查询
  findLogsByGoup(userId: number) {
    // SQL: SELECT logs.result as result, COUNT(logs.result) as count from logs LEFT JOIN user ON user.id = logs.userId WHERE user.id = 2 GROUP BY logs.result
    return (
      this.logsRepository
        .createQueryBuilder('logs') // 'logs' 是为主表(Logs 表)设置的别名
        .select('logs.result', 'result') // 选择 logs 表的 result 字段
        .addSelect('COUNT(logs.result)', 'count') // 第二参数是字段别名
        // 左连接 user 表，并选择 user 表的所有字段。'user' 是连接表的别名。注意，AndSelect 后缀会选择 user 表的所有字段
        .leftJoinAndSelect('logs.user', 'user')
        .where('user.id = :id', { id: userId })
        .groupBy('logs.result')
        .orderBy('result', 'DESC')
        .getRawMany()
    );
  }
}
