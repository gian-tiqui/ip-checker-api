import { Injectable } from '@nestjs/common';
import * as ping from 'ping';
import * as dns from 'dns';

@Injectable()
export class NetworkService {
  async checkIPStatus(
    ip: string,
  ): Promise<{ ip: string; alive: boolean; hostname?: string }> {
    const res = await ping.promise.probe(ip);

    let hostname: string | undefined = ip;
    try {
      const hostnames = await dns.promises.reverse(ip);
      hostname = hostnames[0];
    } catch (err) {
      console.warn(`Could not resolve hostname for IP ${ip}:`, err.message);
    }

    return {
      ip: ip,
      alive: res.alive,
      hostname: hostname,
    };
  }

  async scanNetwork(
    _ips: string[],
    status?: string,
  ): Promise<{
    ips: { ip: string; alive: boolean; hostname?: string }[];
    count: number;
  }> {
    const results = await Promise.all(_ips.map((ip) => this.checkIPStatus(ip)));

    let filtered = results;

    if (status === 'alive') {
      filtered = results.filter((ip) => ip.alive === true);
    } else if (status === 'dead') {
      filtered = results.filter((ip) => ip.alive === false);
    }

    return {
      ips: filtered,
      count: filtered.length,
    };
  }
}
