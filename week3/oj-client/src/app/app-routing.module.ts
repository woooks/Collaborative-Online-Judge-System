import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import { CallbackComponent } from './components/callback/callback.component';
import { ProfileComponent } from './components/profile/profile.component';

// What does angular router mean?
const routes: Routes = [
  { path: '', redirectTo: "problems", pathMatch: "full" },
  { path: 'callback', component: CallbackComponent },
  { path: 'problems', component: ProblemListComponent },
  { path: 'problems/:id', component: ProblemDetailComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: 'problems'}
  // Why auth0 doesn't work when redirectTo "Problem"
];

// const routes: Routes = [
//   { path: '', component: ProblemListComponent },
//   { path: 'callback', component: CallbackComponent },
//   { path: 'problems/:id', component: ProblemDetailComponent },
//   { path: '**', redirectTo: ""}
//   // Why auth0 doesn't work when redirectTo "Problem"
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// export const AppRoutingModule: Routes = [
//   { path: '', redirectTo: "problems", pathMatch: "full" },
//   { path: 'problems', component: ProblemListComponent },
//   { path: 'problems/:id', component: ProblemDetailComponent },
//   { path: '**', redirectTo: ""}
// ];


// export const AppRoutingModule: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'callback', component: CallbackComponent },
//   { path: '**', redirectTo: '' }
// ];
//
// can also be written as below
// export const AppRoutingModule = RouterModule.forRoot(routes);
