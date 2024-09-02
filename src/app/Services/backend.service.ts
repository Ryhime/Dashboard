import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  http: HttpClient;
  networkData$ = new Observable();
  computerData$ = new Observable();

  constructor(http: HttpClient) {
    this.http = http;
    this.networkData$ = http.get(`http://www.localhost:5000/network-stats`);
    this.computerData$ = http.get('http://www.localhost:5000/computer-stats');
  }

  updateNetworkDataUrl(numPackets: number) {
    this.networkData$ = this.http.get(`http://www.localhost:5000/network-stats?numPackets=${numPackets}`)
  }
}
