import { Component } from '@angular/core';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrl: './apps.component.scss'
})
export class AppsComponent {
  /**
   * Opens a window in a new tab that visits the url parameter's address
   * @param {string} url The url to visit 
   */
  onClickButtonUrl(url: string) {
    window.open(url, '_blank');
  }
}
