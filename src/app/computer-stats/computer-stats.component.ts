/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { catchError, of, repeat, Subscription } from 'rxjs';
import { BackendService } from '../Services/backend.service';

enum TableCategory {
  CPU = 'CPU',
  GPU = 'GPU',
  RAM = 'RAM',
}

@Component({
  selector: 'app-computer-stats',
  templateUrl: './computer-stats.component.html',
  styleUrl: './computer-stats.component.scss'
})
export class ComputerStatsComponent {
  MIN_UPDATE_TIME: number = .5;
  MAX_UPDATE_TIME: number = 5;
  TIME_UPDATE_INCREMENT: number = .5;

  MAX_GRAPH_DATA_POINTS: number = 50;

  NUM_DECIMALS: number = 2;

  currentSubscription: Subscription;
  currentDataPoints: number = 0;

  // https://primeng.org/chart
  // TODO: Table slows down application when closed pause it when tab closes??
  cpuCountText: string | null | undefined;
  cpuTypeText: string | null | undefined;
  systemText: string | null | undefined;
  totalRamText: string | null | undefined;

  latestCpuUsage: number = 0;
  lastestGpuUsage: number = 0;
  latestRamUsage: number = 0;

  updateTimeInSeconds: number = 1;

  backendService: BackendService;

  tableData = {
    labels: Array.from(Array<string>(this.MAX_GRAPH_DATA_POINTS).keys()),
    datasets: [
      {
        label: TableCategory.CPU,
        data: Array<number>(this.MAX_GRAPH_DATA_POINTS).fill(0),
        fill: true,
        tension: .4,
        pointRadius: 0,
      },
      {
        label: TableCategory.GPU,
        data: Array<number>(this.MAX_GRAPH_DATA_POINTS).fill(0),
        fill: true,
        tension: .4,
        pointRadius: 0,
      },
      {
        label: TableCategory.RAM,
        data: Array<number>(this.MAX_GRAPH_DATA_POINTS).fill(0),
        fill: true,
        tension: .4,
        pointRadius: 0,
      }
    ],
  };

  tableOptions = {
    responsive: true,
    animation: {
      duration: 0,
    },
    scales: {
      y: {
        display: true,
        min: 0,
        max: 100,
      },
      x: {
        display: false
      }
    }
  };

  constructor(backendService: BackendService) {
    // Assign Static Values Using Backend Service
    this.cpuCountText = undefined;
    this.cpuTypeText = undefined;
    this.systemText = undefined;
    this.totalRamText = undefined;

    this.backendService = backendService;
      // Listen for new computer stats data
      this.currentSubscription = backendService.computerData$.pipe(
        repeat({delay: this.updateTimeInSeconds * 1000}),
      catchError(() => of(null)))
      .subscribe((data: any) => {
        this.backendService.setIsServiceDown(data === null);
        this.handleIncomingServiceData(data);
      });
  }

  /**
   * Handles when new incoming data is got
   * @param {any | null} data The incoming data 
   */
  handleIncomingServiceData(data?: any | null) {
    if (!data) {
      this.cpuCountText = null;
      this.systemText = null;
      this.cpuTypeText = null;
      this.totalRamText = null;
      return;
    }
    this.cpuCountText = data['cpu_count'].toString();
    this.systemText = data['system'].toString();
    this.cpuTypeText = data['cpu'].toString();

    const tempRamStrSplit: string[] = (data['ram_total']/Math.pow(10, 9)).toString().split('.');
    let decimals: string = tempRamStrSplit[1] ? tempRamStrSplit[1] : '00';
    if (decimals.length > this.NUM_DECIMALS) {
      decimals = decimals.substring(0, this.NUM_DECIMALS);
    } 
    this.totalRamText = tempRamStrSplit[0] + '.' + decimals + ' GB';

    this.addTableData(data['cpu_percent'], data['gpu_percent'], data['ram_percent']);
  }

  /**
   * Called when the table update time value is changed to re subscribe to the update with the new time
   */
  updateTableObservable() {
    this.currentSubscription.unsubscribe();
    // Listen for new computer stats data
    this.currentSubscription = this.backendService.computerData$.pipe(
      repeat({delay: this.updateTimeInSeconds * 1000}),
      catchError(() => of(null))).subscribe((data: any) => {
        this.backendService.setIsServiceDown(data === null);
        this.handleIncomingServiceData(data);
    });
  }

  /**
   * Shifts the list one to the left
   * @param {number[]} list The list to shift this parameter is also modified
   * @return {number[]} The shifted list
   */
  shiftListOneIndexToLeft(list: number[]): number[] {
    list.forEach((value: number, i: number) => {
      if (i === 0) {
        return;
      }
      list[i - 1] = value;
    });
    // Remove Last Element
    list = list.slice(0, list.length - 1);
    return list;
  }

  /**
   * Adds table data given new incoming data
   * @param {number} cpuValue The new CPU value
   * @param {number} gpuValue The new GPU value
   * @param {number} ramValue The new RAM value
   */
  addTableData(cpuValue: number, gpuValue: number, ramValue: number): void {
    if (cpuValue < 0 || gpuValue < 0 || ramValue < 0) {
      return;
    }

    if (this.currentDataPoints < this.MAX_GRAPH_DATA_POINTS) {
      this.currentDataPoints += 1;
    }

    this.tableData.datasets.forEach((categoryOptions) => {
      let data: number[] = categoryOptions.data;
      switch (categoryOptions.label) {
        case TableCategory.CPU:
          data[this.currentDataPoints - 1] = cpuValue;
          this.latestCpuUsage = cpuValue;
          break;
        case TableCategory.GPU:
          data[this.currentDataPoints - 1] = gpuValue;
          this.lastestGpuUsage = gpuValue;
          break;
        case TableCategory.RAM:
          data[this.currentDataPoints - 1] = ramValue;
          this.latestRamUsage = ramValue;
          break;
      }
      if (this.currentDataPoints >= this.MAX_GRAPH_DATA_POINTS) {
        data = this.shiftListOneIndexToLeft(data); 
      }
    });

    // Update Table Data to re render
    this.tableData = {...this.tableData};
  }
}
