import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerStatsComponent } from './computer-stats.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { BackendService } from '../Services/backend.service';

describe('ComputerStatsComponent', () => {
  let component: ComputerStatsComponent;
  let fixture: ComponentFixture<ComputerStatsComponent>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockBackendService: any;

  beforeEach(async () => {
    mockBackendService = jasmine.createSpyObj('BackendService', ['computerData$', 'setIsServiceDown']);
    mockBackendService['computerData$'] = new Subject();

    await TestBed.configureTestingModule({
      providers: [
        {provide: BackendService, useValue: mockBackendService},
      ],
      declarations: [ComputerStatsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComputerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should set static data text to undefined', () => {
      expect(component.cpuCountText).toEqual (undefined);
      expect(component.cpuTypeText).toEqual(undefined);
      expect(component.systemText).toEqual(undefined);
      expect(component.totalRamText).toEqual(undefined);
    });

    it('should subscribe to computerData$', () => {
      spyOn(component, 'handleIncomingServiceData');
      mockBackendService['computerData$'].next(of({}));
      expect(component.handleIncomingServiceData).toHaveBeenCalled();
      expect(mockBackendService.setIsServiceDown).toHaveBeenCalled();
    });
  });

  describe('handleIncomingServiceData', () => {
    it('should update static data and call add table with dynamic values', () => {
      spyOn(component, 'addTableData');
      const data = {
        'cpu_count': 10,
        'system': 'Windows',
        'cpu': 'ARM',
        'ram_total': 500,
        'cpu_percent': 5,
        'gpu_percent': 6,
        'ram_percent': 7,
      };
      component.handleIncomingServiceData(data);

      expect(component.cpuCountText).toEqual('10');
      expect(component.systemText).toEqual('Windows');
      expect(component.cpuTypeText).toEqual('ARM');
      expect(component.totalRamText).toEqual('500 GB');

      expect(component.addTableData).toHaveBeenCalledWith(5, 6, 7);
    });

    it('should update static data and call add table with dynamic values when ram is 0', () => {
      spyOn(component, 'addTableData');
      const data = {
        'cpu_count': 10,
        'system': 'Windows',
        'cpu': 'ARM',
        'ram_total': 0,
        'cpu_percent': 5,
        'gpu_percent': 6,
        'ram_percent': 7,
      };
      component.handleIncomingServiceData(data);

      expect(component.cpuCountText).toEqual('10');
      expect(component.systemText).toEqual('Windows');
      expect(component.cpuTypeText).toEqual('ARM');

      expect(component.totalRamText).toEqual('0 GB');

      expect(component.addTableData).toHaveBeenCalledWith(5, 6, 7);
    });

    it('should update static data and not call the table when no data is found', () => {
      spyOn(component, 'addTableData');
      component.handleIncomingServiceData(null);

      expect(component.cpuCountText).toEqual(null);
      expect(component.systemText).toEqual(null);
      expect(component.cpuTypeText).toEqual(null);
      expect(component.totalRamText).toEqual(null);

      expect(component.addTableData).not.toHaveBeenCalled();
    });
  });

  describe('updateTableObservable', () => {
    it('should subscribe again after being called', () => {
      component.updateTimeInSeconds = 3;
      component.currentSubscription.unsubscribe();
      component.updateTableObservable();
      expect(component.currentSubscription.closed).toEqual(false);
    });

    it('should subscribe to computerData$ after being called', () => {
      spyOn(component, 'handleIncomingServiceData');
      component.updateTableObservable();
      mockBackendService['computerData$'].next(of(undefined));
      expect(component.handleIncomingServiceData).toHaveBeenCalled();
      expect(mockBackendService.setIsServiceDown).toHaveBeenCalled();
    });
  });

  describe('shiftListOneIndexToLeft', () => {
    it('should shift nothing for empty', () => {
      const list: number[] = [];
      const actual: number[] = component.shiftListOneIndexToLeft(list);
      expect(actual).toEqual(list);
    });

    it('should return empty array for one element', () => {
      const list: number[] = [500];
      const actual: number[] = component.shiftListOneIndexToLeft(list);
      expect(actual).toEqual([]);
    });

    it('should shift for multiple elements', () => {
      const list: number[] = [1, 2, 3, 4, 5];
      const actual: number[] = component.shiftListOneIndexToLeft(list);
      expect(actual).toEqual([2, 3, 4, 5]);
    });
  });

  describe('addTableData', () => {
    it('should return when the cpu, gpu, or ram value is negative', () => {
      component.addTableData(0, -1, -2);
      expect(component.currentDataPoints).toEqual(0);
    });
    
    it('should update and not shift when number of data points is less than the max data points', () => {
      component.addTableData(1, 2, 3);
      expect(component.currentDataPoints).toEqual(1);
      expect(component.tableData.datasets[0].data[0]).toEqual(1);
      expect(component.tableData.datasets[1].data[0]).toEqual(2);
      expect(component.tableData.datasets[2].data[0]).toEqual(3);
    });

    it('should update and shift when the number of data points is greater than the max data points', () => {
      component.currentDataPoints = component.MAX_GRAPH_DATA_POINTS;
      component.tableData.datasets[0].data[0] = 1;
      component.tableData.datasets[1].data[0] = 1;
      component.tableData.datasets[2].data[0] = 1;

      component.addTableData(1, 2, 3);

      expect(component.currentDataPoints).toEqual(component.MAX_GRAPH_DATA_POINTS);
      expect(component.tableData.datasets[0].data[component.MAX_GRAPH_DATA_POINTS - 1]).toEqual(1);
      expect(component.tableData.datasets[1].data[component.MAX_GRAPH_DATA_POINTS - 1]).toEqual(2);
      expect(component.tableData.datasets[2].data[component.MAX_GRAPH_DATA_POINTS - 1]).toEqual(3);

      expect(component.tableData.datasets[0].data[0]).toEqual(0);
      expect(component.tableData.datasets[1].data[0]).toEqual(0);
      expect(component.tableData.datasets[2].data[0]).toEqual(0);
    });
  });
});
