import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendServiceService {

  networkData$ = new Observable;

  constructor(http: HttpClient) { 
    this.networkData$ = http.get('localhost:5000/tasks');
  }
}
