import { Component } from '@angular/core';
import { interval } from 'rxjs';

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

  UNDEFINED_TEXT: string = 'Loading...';
  NULL_TEXT: string = 'Data Not Found';
  MAX_GRAPH_DATA_POINTS: number = 50;
  MS_TO_UPDATE: number = 1000;

  currentDataPoints: number = 0;

  // https://primeng.org/chart
  // TODO: Table slows down application when closed pause it when tab closes??
  cpuCountText: string;
  cpuTypeText: string;
  systemText: string;
  totalRamText: string;

  latestCpuUsage: number = 0;
  lastestGpuUsage: number = 0;
  latestRamUsage: number = 0;

  tableData = {
    labels: Array.from(Array<string>(this.MAX_GRAPH_DATA_POINTS).keys()),
    datasets: [
      {
        label: TableCategory.CPU,
        data: Array<number>(this.MAX_GRAPH_DATA_POINTS).fill(0),
        fill: true,
        tension: .4,
      },
      {
        label: TableCategory.GPU,
        data: Array<number>(this.MAX_GRAPH_DATA_POINTS).fill(0),
        fill: true,
        tension: .4,
      },
      {
        label: TableCategory.RAM,
        data: Array<number>(this.MAX_GRAPH_DATA_POINTS).fill(0),
        fill: true,
        tension: .4,
      }
    ],
  };

  tableOptions = {
    animation: {
      duration: 0,
    },
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
          max: 100,
          min: 0,
        }
      }
    }
  };

  constructor() {
    // Assign Static Values Using Backend Service
    this.cpuCountText = this.UNDEFINED_TEXT;
    this.cpuTypeText = this.UNDEFINED_TEXT;
    this.systemText = this.UNDEFINED_TEXT;
    this.totalRamText = this.UNDEFINED_TEXT;

    // Start Table
    interval(this.MS_TO_UPDATE).subscribe(
      () => {
        this.addTableData(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
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
