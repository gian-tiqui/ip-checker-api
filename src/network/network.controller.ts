import { Controller, Get, Query } from '@nestjs/common';
import { NetworkService } from './network.service';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Get('check-ips')
  async checkIPs(
    @Query('status') status: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 5,
  ) {
    const ipList = [
      ...Array(Number(limit))
        .fill(0)
        .map((_, index) => `10.10.10.${index + 1}`),
    ];

    const { ips, count } = await this.networkService.scanNetwork(
      ipList,
      status,
    );

    const paginatedIps = ips.slice(offset, offset + limit);

    return {
      ips: paginatedIps,
      total: count,
    };
  }

  @Get('check-ip')
  async checkIP(@Query('ip') ip: string) {
    return this.networkService.checkIPStatus(ip);
  }
}
