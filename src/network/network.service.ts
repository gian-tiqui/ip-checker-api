import { Injectable } from '@nestjs/common';
import * as ping from 'ping';
import * as dns from 'dns';
import * as net from 'net';

@Injectable()
export class NetworkService {
  private commonPorts = [80, 443, 22, 8080];

  private async checkPortStatus(ip: string, port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1000);

      socket
        .on('connect', () => {
          socket.destroy();
          resolve(true);
        })
        .on('timeout', () => {
          socket.destroy();
          resolve(false);
        })
        .on('error', () => {
          resolve(false);
        })
        .connect(port, ip);
    });
  }

  async checkIPStatus(ip: string): Promise<{
    ip: string;
    alive: boolean;
    hostname?: string;
    openPorts?: number[];
  }> {
    const res = await ping.promise.probe(ip);

    let hostname: string | undefined = ip;
    try {
      const hostnames = await dns.promises.reverse(ip);
      hostname = hostnames[0];
    } catch (err) {
      console.warn(`Could not resolve hostname for IP ${ip}:`, err.message);
    }

    const openPorts: number[] = [];
    for (const port of this.commonPorts) {
      const isOpen = await this.checkPortStatus(ip, port);
      if (isOpen) openPorts.push(port);
    }

    return {
      ip: ip,
      alive: res.alive,
      hostname: hostname,
      openPorts: openPorts.length ? openPorts : undefined,
    };
  }

  async scanNetwork(
    _ips: string[],
    status?: string,
  ): Promise<{
    ips: {
      ip: string;
      alive: boolean;
      hostname?: string;
      openPorts?: number[];
    }[];
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
