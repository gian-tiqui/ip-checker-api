import { Injectable } from '@nestjs/common';

import * as ping from 'ping';

@Injectable()
export class NetworkService {
  async checkIPStatus(ip: string): Promise<{ ip: string; alive: boolean }> {
    const res = await ping.promise.probe(ip);
    return {
      ip: ip,
      alive: res.alive,
    };
  }

  async scanNetwork(
    _ips: string[],
    status?: string,
  ): Promise<{ ips: { ip: string; alive: boolean }[]; count: number }> {
    const results = await Promise.all(_ips.map((ip) => this.checkIPStatus(ip)));

    if (status === 'alive') {
      const filtered = results.filter((ip) => ip.alive === true);

      return {
        ips: filtered,
        count: filtered.length,
      };
    }

    if (status === 'dead') {
      const filtered = results.filter((ip) => ip.alive === false);

      return {
        ips: filtered,
        count: filtered.length,
      };
    }

    if (status === 'all') {
      return {
        ips: results,
        count: results.length,
      };
    }

    return {
      ips: results,
      count: results.length,
    };
  }
}
