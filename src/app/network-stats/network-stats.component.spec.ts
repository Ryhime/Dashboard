import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkStatsComponent } from './network-stats.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NetworkStatsComponent', () => {
  let component: NetworkStatsComponent;
  let fixture: ComponentFixture<NetworkStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkStatsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetworkStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getTableData', () => {
    it('should return empty array on empty array', () => {
      const actual = component.getTableData([]);
      expect(actual).toEqual([]);
    });

    it('should filter out everything if no entries have enough packets', () => {
      component.NUM_PACKETS_NEEDED_TO_DISPLAY = 200;
      const ips = [
        {ip: '1', numPackets: 100},
        {ip: '3', numPackets: 80},
        {ip: '4', numPackets: 70},
        {ip: '5', numPackets: 60},
        {ip: '2', numPackets: 90},
      ];

      const actual = component.getTableData(ips);

      expect(actual).toEqual([]);
    });

    it('should filter properly and sort for entries that have enough packets', () => {
      component.NUM_PACKETS_NEEDED_TO_DISPLAY = 70;
      const ips = [
        {ip: '1', numPackets: 100},
        {ip: '3', numPackets: 80},
        {ip: '4', numPackets: 70},
        {ip: '5', numPackets: 60},
        {ip: '2', numPackets: 90},
      ];

      const expected = [
        {ip: '1', numPackets: 100},
        {ip: '2', numPackets: 90},
        {ip: '3', numPackets: 80},
        {ip: '4', numPackets: 70},
      ];
      const actual = component.getTableData(ips);

      expect(actual).toEqual(expected);
    });
  });
});
