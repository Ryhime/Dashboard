import { Component } from '@angular/core';
import { BackendService } from '../Services/backend.service';
@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrl: './title-bar.component.scss'
})
export class TitleBarComponent {
  
  isServiceDown: boolean = false;
  constructor(backendService: BackendService) {
    backendService.getIsServiceDown().subscribe((newValue: boolean) => {
      this.isServiceDown = newValue;
    });
  }
}
