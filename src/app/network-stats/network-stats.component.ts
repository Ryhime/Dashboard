import { Component } from '@angular/core';
import { BackendService } from '../Services/backend.service';
import { repeat, Subscription } from 'rxjs';

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

  backendService: BackendService;
  currentSubscription: Subscription;


  topIps: IpData[] = [];
  allIps: IpData[] = [];

  updateTimeInMinutes: number = 2;
  numPacketsNeededToDisplay: number = 6;
  numberOfPacketsPerUpdate: number = 100;

  constructor(backendService: BackendService) {
    this.backendService = backendService;
    this.currentSubscription = backendService.networkData$.pipe(
      repeat({delay: this.updateTimeInMinutes * 100})
    ).subscribe((data: any) => {
      this.processIncomingNetworkData(data);
    });
  }

  /**
   * Processes the data from the backend to the frontend
   * @param {any} data The incoming network data 
   */
  processIncomingNetworkData(data: any) {
    data['ips'].forEach((ip: string, i: number) => {
      this.allIps.push(new IpData(ip, data['packets_per_ip'][i]))
    });
    this.topIps = this.getTableData(this.allIps);
  }

  onRequestSettingsChange(numPacketsChange: number, requestTimeChange: number) {
    this.numberOfPacketsPerUpdate += numPacketsChange;
    this.updateTimeInMinutes += requestTimeChange;
    // Update the service
    this.backendService.updateNetworkDataUrl(this.numberOfPacketsPerUpdate);
    this.currentSubscription.unsubscribe();

    this.currentSubscription = this.backendService.networkData$.pipe(
      repeat({delay: this.updateTimeInMinutes * 100})
    ).subscribe((data: any) => {
      this.processIncomingNetworkData(data);
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
