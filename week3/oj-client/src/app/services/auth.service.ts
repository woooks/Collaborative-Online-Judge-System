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
    scope: 'openid profile'
  });

  constructor(public router: Router) {
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

  // public handleAuthentication(): void {
  //   this.auth0.parseHash((err, authResult) => {
  //     // localStorage.setItem('authResult', JSON.stringify(authResult));
  //     if (authResult && authResult.accessToken && authResult.idToken) {
  //       this.localLogin(authResult);
  //       this.router.navigate(['/problems']);
  //     } else if (err) {
  //       this.router.navigate(['/problems']);
  //       console.log(err);
  //       alert(`Error: ${err.error}. Check the console for further details.`);
  //     }
  //   });
  // }

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
    this.auth0.logout({
      // returnTo: window.location.origin
      returnTo: 'http://localhost:3000/problems'
    });
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

  // public saveToken(hash): void {
  //   localStorage.setItem('hash', JSON.stringify(hash));
  // }

}

// import { Injectable } from '@angular/core';
// import {tokenNotExpired} from 'angular2-jwt';
//
// declare var Auth0Lock: any;
//
// @Injectable()
// export class AuthService {
//   clientID = 'YJKK5QrLh3Ghgb77UFI2T_O7YZkZpdgS';
//   domain = 'dev-y8qvye3u.auth0.com';
//   lock = new Auth0Lock(this.clientID, this.domain, {});
//
//   constructor() {
//
//   }
//
//   public login() {
//     this.lock.show((error: string, profile: Object, id_token:string)=> {
//       if(error) {
//         console.log(error);
//       } else {
//         localStorage.setItem('profile', JSON.stringify(profile));
//         localStorage.setItem('id_token', id_token);
//       }
//     });
//   }
//
//   public authenticated() {
//     return tokenNotExpired();
//   }
//
//   public logout() {
//     localStorage.removeItem('id_token');
//     localStorage.removeItem('profile');
//   }
//
// }
