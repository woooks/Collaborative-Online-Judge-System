import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = 'LabCode';
  profile : any;
  username = "UserInfo";

  constructor(
    private router: Router,
    public authService: AuthService) { }

  ngOnInit() {

    if (this.authService.isAuthenticated()) {
      this.getProfile();
    }
  }

  test(): void {
    console.log(this.authService.isAuthenticated());
    this.getProfile();
    console.log(this.profile);
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }

  getProfile(): void {
    if (this.authService.userProfile) {
      this.profile = this.authService.userProfile;
    } else {
      this.authService.getProfile((err, profile) => {
        this.profile = profile;
      });
    }
  }

}
