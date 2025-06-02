import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RangeModule } from './range/range.module';

@Module({
  imports: [UserModule, RangeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
