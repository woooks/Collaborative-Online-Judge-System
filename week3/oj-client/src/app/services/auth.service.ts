import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';

interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

const AUTH_CONFIG: AuthConfig = {
  clientID: 'YJKK5QrLh3Ghgb77UFI2T_O7YZkZpdgS',
  domain: 'dev-y8qvye3u.auth0.com',
  callbackURL: 'http://localhost:3000/callback'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;
  userProfile: any;

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: 'openid profile roles'
  });

  constructor(
    public router: Router,
  ) {
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  public login(): void {
    this.auth0.authorize();
  }


  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      // localStorage.setItem('authResult', JSON.stringify(authResult));
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult);
        this.router.navigate(['/problems']);
      } else if (err) {
        this.router.navigate(['/problems']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  private localLogin(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = (authResult.expiresIn * 1000) + Date.now();
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    this._expiresAt = expiresAt;

    //store token in localStorage
    localStorage.setItem('authResult', JSON.stringify(authResult));
    localStorage.setItem('expiresAt', expiresAt.toString());

  }

  public renewTokens(): void {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.localLogin(authResult);
       } else if (err) {
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
         this.logout();
       }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time
    this._accessToken = '';
    this._idToken = '';
    this._expiresAt = 0;
    localStorage.removeItem('authResult');
    localStorage.removeItem('expireAt');
    // window.open('https://dev-y8qvye3u.auth0.com/v2/logout');
    this.auth0.logout({
      clientID: AUTH_CONFIG.clientID,
      returnTo: window.location.origin
    });
  }

  public getLoginInfoFromLocalStorage(): void {
    let authResult = localStorage.getItem('authResult');
    let expireAt = localStorage.getItem('expiresAt');
    if (authResult && expireAt) {
      this._expiresAt = parseInt(expireAt);
      this._accessToken = JSON.parse(authResult).accessToken;
    } else {
      this._accessToken = '';
      this._idToken = '';
      this._expiresAt = 0;
    }
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return this._accessToken && Date.now() < this._expiresAt;
  }

  public getProfile(cb): void {
    if (!this._accessToken) {
      throw new Error('Access Token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(this._accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  resetPassword() {

  }

  isAdmin(cb): void {
    if (!this._accessToken) {
      cb(false);
    } else if (!this.userProfile) {
      this.getProfile((err, profile) => {
        if (profile){
          cb(true);
        } else {
          console.log(err);
          cb(false);
        }
      })
    } else {
      if (this.userProfile.nickname == "admin") {
        console.log(this.userProfile.nickname)
        cb(true);
      }
    }
  }


}
