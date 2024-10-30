import { NetworkModule } from './network/network.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [NetworkModule],
})
export class AppModule {}
