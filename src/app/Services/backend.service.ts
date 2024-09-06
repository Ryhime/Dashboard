import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  http: HttpClient;
  
  networkData$ = new Observable();
  computerData$ = new Observable();
  tasksData$ = new Observable();

  private isServiceDown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(http: HttpClient) {
    this.http = http;
    this.networkData$ = http.get(`http://www.localhost:5000/network-stats`);
    this.computerData$ = http.get('http://www.localhost:5000/computer-stats');
    this.tasksData$ = http.get('http://www.localhost:5000/tasks');
  }

  /**
   * Called when the user updates the number of packets to request changes the url to request from
   * @param {number} numPackets The number of packets to request
   */
  updateNetworkDataUrl(numPackets: number) {
    this.networkData$ = this.http.get(`http://www.localhost:5000/network-stats?numPackets=${numPackets}`)
  }

  // Observables
  /**
   * The observable if the service is down
   * @return {Observable<boolean>}
   */
  public getIsServiceDown(): Observable<boolean> {
    return this.isServiceDown$.asObservable();
  }

  /**
   * The value to set if the service is down or not
   * @param {boolean} value 
   */
  public setIsServiceDown(value: boolean) {
    this.isServiceDown$.next(value);
  }
}
