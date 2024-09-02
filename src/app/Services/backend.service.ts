import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  networkData$ = new Observable();
  constructor(http: HttpClient) { 
    this.networkData$ = http.get('http://www.localhost:5000/network-stats');
  }
}
