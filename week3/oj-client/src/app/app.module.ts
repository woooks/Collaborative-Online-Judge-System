import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import { NewProblemComponent } from './components/new-problem/new-problem.component';
import { CallbackComponent } from './components/callback/callback.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from "./services/auth.service";
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    ProblemListComponent,
    ProblemDetailComponent,
    NewProblemComponent,
    NavbarComponent,
    CallbackComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    // RouterModule.forRoot(AppRoutingModule)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/http';
// import { RouterModule } from '@angular/router';
//
// import { AppComponent } from './app.component';
// import { HomeComponent } from './home/home.component';
//
// import { AppRoutingModule } from './app-routing.module';
//
//
// import { AuthService } from './services/auth.service';
// import { CallbackComponent } from './callback/callback.component';
//
// @NgModule({
//   declarations: [
//     AppComponent,
//     HomeComponent,
//     CallbackComponent
//   ],
//   imports: [
//     BrowserModule,
//     FormsModule,
//     HttpModule,
//     RouterModule.forRoot(AppRoutingModule)
//   ],
//   providers: [AuthService],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }
