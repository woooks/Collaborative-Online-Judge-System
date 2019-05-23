import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {  Observable } from 'rxjs/Rx';


// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class InputService {
  // need an initial status: '' to map all problems, using BehaviorSubject
  private inputSubject$ = new BehaviorSubject<string>('');

  constructor() { }

  changeInput(term) {
    this.inputSubject$.next(term);
  }

  getInput(): Observable<string> {
    return this.inputSubject$.asObservable();
  }

}
