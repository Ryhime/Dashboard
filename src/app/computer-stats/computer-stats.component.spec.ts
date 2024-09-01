import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerStatsComponent } from './computer-stats.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ComputerStatsComponent', () => {
  let component: ComputerStatsComponent;
  let fixture: ComponentFixture<ComputerStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
    it('should set static data text', () => {
      expect(component.cpuCountText.length).toBeGreaterThan(0);
      expect(component.cpuTypeText.length).toBeGreaterThan(0);
      expect(component.systemText.length).toBeGreaterThan(0);
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
