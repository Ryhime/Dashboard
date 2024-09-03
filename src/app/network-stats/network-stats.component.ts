/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { BackendService } from '../Services/backend.service';
import { catchError, of, repeat, Subscription } from 'rxjs';

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

  updateTimeInMinutes: number = 2;
  numPacketsNeededToDisplay: number = 6;
  numberOfPacketsPerUpdate: number = 100;

  backendService: BackendService;
  currentSubscription: Subscription;

  topIps: IpData[] | null | undefined = undefined;
  allIps: IpData[] = [];

  constructor(backendService: BackendService) {
    this.backendService = backendService;
    // Start Network Subscription
    this.currentSubscription = backendService.networkData$.pipe(
      repeat({delay: this.updateTimeInMinutes * 1000 * 60}), catchError(() => of(null)),
    ).subscribe((data: unknown) => {
      this.processIncomingNetworkData(data);
    });
  }

  /**
   * Processes the data from the backend to the frontend
   * @param {any | null} data The incoming network data 
   */
  processIncomingNetworkData(data?: any | null) {
    if (!data) {
      this.topIps = null;
      return;
    }
    this.allIps = [];
    data['ips'].forEach((ip: string, i: number) => {
      this.allIps.push(new IpData(ip, data['packets_per_ip'][i]))
    });

    this.topIps = this.getTableData(this.allIps);
  }

  /**
   * Called when setting knobs are updated
   * @param {number} numPacketsChange The change in packets to request
   * @param {number} requestTimeChange The change in request time
   */
  onRequestSettingsChange(numPacketsChange: number, requestTimeChange: number) {
    // Update component values
    this.numberOfPacketsPerUpdate += numPacketsChange;
    this.updateTimeInMinutes += requestTimeChange;
    // Update the service
    this.backendService.updateNetworkDataUrl(this.numberOfPacketsPerUpdate);
    this.currentSubscription.unsubscribe();
    // Update Subscription
    this.currentSubscription = this.backendService.networkData$.pipe(
      repeat({delay: this.updateTimeInMinutes * 1000 * 60}), catchError(() => of(null)),
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
