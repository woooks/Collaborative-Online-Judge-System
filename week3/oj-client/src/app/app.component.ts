import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'COJS';
  constructor(public authService: AuthService) {
    // if (localStorage.getItem("hash") !== null) {
    //   window.location.hash = JSON.parse(localStorage.getItem('hash'));
    // }
    this.authService.handleAuthentication();
  }

  ngOnInit() {
    this.authService.getLoginInfoFromLocalStorage()
    if (this.authService.isAuthenticated()) {
      this.authService.renewTokens();
    }
  }
}
