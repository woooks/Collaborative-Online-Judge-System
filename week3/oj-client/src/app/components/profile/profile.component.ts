import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.authService.getProfile((err, profile) => this.profile=profile);
  }

  resetPassword() {
    this.authService.resetPassword();
  }

}
