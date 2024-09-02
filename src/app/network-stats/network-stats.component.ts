import { Component } from '@angular/core';

export class IpData {
  ip: string = '';
  numPackets: number = 0;
}
@Component({
  selector: 'app-network-stats',
  templateUrl: './network-stats.component.html',
  styleUrl: './network-stats.component.scss'
})
export class NetworkStatsComponent {
  NUM_PACKETS_NEEDED_TO_DISPLAY = 5;
  topIps: IpData[] = [];

  constructor() {
    const allIps = [
      {ip: '1', numPackets: 100},
      {ip: '3', numPackets: 80},
      {ip: '4', numPackets: 70},
      {ip: '5', numPackets: 60},
      {ip: '2', numPackets: 90},
    ];
    this.topIps = this.getTableData(allIps);
  }

  /**
   * Gets the table data ready to display from all the ips
   * @param {IpData[]} allIps All the ips to filter through
   * @return {IpData[]} The ip data ready to be displayed on the table
   */
  getTableData(allIps: IpData[]): IpData[] {
    return allIps.sort((ip1: IpData, ip2: IpData) => {
      return ip2.numPackets - ip1.numPackets;
    }).filter((ip: IpData) => {
      return ip.numPackets >= this.NUM_PACKETS_NEEDED_TO_DISPLAY;
    });
  }
}
