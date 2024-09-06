/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpData, NetworkStatsComponent } from './network-stats.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BackendService } from '../Services/backend.service';
import { of, Subject } from 'rxjs';

describe('NetworkStatsComponent', () => {
  let component: NetworkStatsComponent;
  let fixture: ComponentFixture<NetworkStatsComponent>;

  let mockBackendService: any;

  beforeEach(async () => {
    mockBackendService = jasmine.createSpyObj('BackendService' ,['networkData$', 'updateNetworkDataUrl', 'setIsServiceDown']);
    mockBackendService['networkData$'] = new Subject();

    await TestBed.configureTestingModule({
      providers: [
        {provide: BackendService, useValue: mockBackendService},
      ],
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

  describe('IpData Class', () => {
    it('should create with params', () => {
      const data: IpData = new IpData('myIp', 500);
      expect(data.ip).toEqual('myIp');
      expect(data.numPackets).toEqual(500);
    });
  });

  describe('constructor', () => {
    it('should subscribe to networkData$', () => {
      spyOn(component, 'processIncomingNetworkData');
      mockBackendService['networkData$'].next(of({}));
      expect(component.processIncomingNetworkData).toHaveBeenCalled();
      expect(mockBackendService.setIsServiceDown).toHaveBeenCalled();
    });
  });

  describe('processIncomingNetworkData', () => {
    it('should update all Ips and assign table data when there is new data', () => {
      spyOn(component, 'getTableData');
      component.allIps = [];
      component.topIps = [];
      const data = {
        'ips': ['A', 'B'],
        'packets_per_ip': [1, 2],
      };

      component.processIncomingNetworkData(data);

      expect(component.getTableData).toHaveBeenCalled();
      expect(component.allIps[0].ip).toEqual('A');
      expect(component.allIps[1].ip).toEqual('B');
    });
    
    it('should not assign all ips and not reassign new table data when there is no new data', () => {
      spyOn(component, 'getTableData');
      component.allIps.push(new IpData('A', 5));
      component.allIps.push(new IpData('B', 6));

      component.topIps = [];

      component.processIncomingNetworkData(null);

      expect(component.getTableData).not.toHaveBeenCalled();
      expect(component.topIps).toBeNull();
      expect(component.allIps[0].ip).toEqual('A');
      expect(component.allIps[1].ip).toEqual('B');
    });

    it('should update the top ips when there is an empty list', () => {
      spyOn(component, 'getTableData').and.callThrough();
      component.allIps = [new IpData('A', 5), new IpData('B', 6)];
      component.topIps = [new IpData('A', 500)];
      const data = {
        'ips': [],
        'packets_per_ip': [],
      };

      component.processIncomingNetworkData(data);

      expect(component.getTableData).toHaveBeenCalled();
      expect(component.allIps).toEqual([]);
      expect(component.topIps).toEqual([]);
    });
  });

  describe('onRequestSettingsChange', () => {
    it('should subscribe to networkData$', () => {
      spyOn(component, 'processIncomingNetworkData');
      component.onRequestSettingsChange(5, 5);
      mockBackendService['networkData$'].next(of({}));
      expect(component.processIncomingNetworkData).toHaveBeenCalled();
      expect(mockBackendService.setIsServiceDown).toHaveBeenCalled();
    });

    it('should update the number of packets and update time for positive values', () => {
      component.numberOfPacketsPerUpdate = 5;
      component.updateTimeInMinutes = 5;

      component.onRequestSettingsChange(5, 5);

      expect(component.numberOfPacketsPerUpdate).toEqual(10);
      expect(component.updateTimeInMinutes).toEqual(10);
      expect(mockBackendService['updateNetworkDataUrl']).toHaveBeenCalled();
    });

    it('should update for negative values', () => {
      component.numberOfPacketsPerUpdate = 5;
      component.updateTimeInMinutes = 5;

      component.onRequestSettingsChange(-5, -5);

      expect(component.numberOfPacketsPerUpdate).toEqual(0);
      expect(component.updateTimeInMinutes).toEqual(0);
      expect(mockBackendService['updateNetworkDataUrl']).toHaveBeenCalled();
    });
  });

  describe('getTableData', () => {
    it('should return empty array on empty array', () => {
      const actual = component.getTableData([]);
      expect(actual).toEqual([]);
    });

    it('should filter out everything if no entries have enough packets', () => {
      component.numPacketsNeededToDisplay = 200;
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
      component.numPacketsNeededToDisplay = 70;
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
