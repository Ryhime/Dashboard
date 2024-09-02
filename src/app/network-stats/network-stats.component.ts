import { Component } from '@angular/core';
import { BackendService } from '../Services/backend.service';

export class IpData {
  ip: string;
  numPackets: number;
  constructor(ip: string, numPackets: number) {
    this.ip = ip;
    this.numPackets = numPackets;
  }
}
@Component({
  selector: 'app-network-stats',
  templateUrl: './network-stats.component.html',
  styleUrl: './network-stats.component.scss'
})
export class NetworkStatsComponent {
  MAX_NUM_PACKETS_REQUEST: number = 200;
  MIN_NUM_PACKETS_REQUEST: number = 10;
  STEP_NUM_PACKETS_REQUEST: number = 10;

  MAX_REQUEST_TIME_MINUTES: number = 10;
  MIN_REQUEST_TIME_MINUTES: number = 1;
  STEP_REQUEST_TIME_MINUTES: number = 1;

  MAX_PACKETS_NEEDED: number = 20;
  MIN_PACKETS_NEEDED: number = 0;
  STEP_PACKETS_NEEDED: number = 2;




  topIps: IpData[] = [];
  allIps: IpData[] = [];

  updateTimeInMinutes: number = 2;
  numberOfPacketsPerUpdate: number = 100;
  numPacketsNeededToDisplay: number = 6;

  constructor(backendService: BackendService) {
    this.allIps = [
      {ip: '1', numPackets: 10},
      {ip: '3', numPackets: 20},
      {ip: '4', numPackets: 5},
      {ip: '5', numPackets: 2},
      {ip: '2', numPackets: 8},
    ];
    this.topIps = this.getTableData(this.allIps);

    backendService.networkData$.subscribe((data) => {
      console.log(data);
    });
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
      return ip.numPackets >= this.numPacketsNeededToDisplay;
    });
  }
}
