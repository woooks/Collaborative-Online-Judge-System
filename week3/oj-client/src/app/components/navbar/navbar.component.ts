import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { InputService } from '../../services/input.service';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = 'LabCode';
  profile : any;
  username = "UserInfo";
  searchBox: FormControl = new FormControl();
  subscription: Subscription;

  constructor(
    private router: Router,
    public authService: AuthService,
    private inputService: InputService) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.getProfile();
    }

    this.subscription = this.searchBox
                            .valueChanges
                            .debounceTime(200)
                            .subscribe(
                              term => {this.inputService.changeInput(term);}
                            )
  }

  ngOnDestory() {
    this.subscription.unsubscribe();
  }

  searchProblem(): void{
    console.log('navigate to /problems');
    this.router.navigate(['/problems']);
  }

  test(): void {
    let authResult = JSON.parse(localStorage.getItem('authResult'));
    console.log(authResult);
    // console.log(this.authService.isAuthenticated());
    // this.authService.renewTokens();
    this.getProfile();
    console.log(this.profile);
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    // window.location.href='http://external-url';
    // window.location.assign('https://dev-y8qvye3u.auth0.com/v2/logout');
    // window.open('https://stackoverflow.com')
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
