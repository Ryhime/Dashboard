import { Component } from '@angular/core';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrl: './apps.component.scss'
})
export class AppsComponent {
  onClickButtonUrl(url: string) {
    window.open(url, '_blank');
  }
}
