import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { Problems } from '../mock-data';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError, flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private problemSource = new BehaviorSubject<Problem[]>([]);

  constructor(private http: HttpClient) { }


  // getProblems(): Observable<Problem[]> {
  //   this.http.get("api/v1/problems")
  //     .toPromise()
  //     .then((res) => {
  //       this.problemSource.next(res as Problem[]);
  //     })
  //     .catch(this.handleError);
  //   return this.problemSource.asObservable();
  // }
    getProblems(): Observable<Problem[]> {
      this.http.get<Problem[]>(`api/v1/problems`)
              .subscribe({
                next: res => this.problemSource.next(res as Problem[]),
                error: err => this.handleError(err)
              });
      return this.problemSource.asObservable();
    }

  // getProblem(id: number): Promise<Problem> {
  //   return this.http.get(`api/v1/problems/${id}`)
  //             .toPromise()
  //             .then((res) => res)
  //             .catch(this.handleError);
  // }
    getProblem(id: number): Observable<Problem> {
      return this.http.get(`api/v1/problems/${id}`)
              .pipe(
                catchError(this.handleError)
              )
    }

  addProblem(problem: Problem): Promise<Problem> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('/api/v1/problems', problem, httpOptions)
      .toPromise()
      .then((res) => {
        this.getProblems().subscribe();
        return res;
      })
      .catch(this.handleError);
  }
    // addProblem(problem: Problem): Observable<Problem> {
    //     let httpOptions = {
    //       headers: new HttpHeaders({
    //         'Content-Type': 'application/json'
    //       })
    //     };
    //     return this.http.post('/api/v1/problems', problem, httpOptions)
    //             .pipe(
    //                 flatMap(result => this.getProblems().subscribe()),
    //                 catchError(err => this.handleError(err)),
    //             );
    // }

  buildAndRun(data): Promise<Object> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('/api/v1/build_and_run', data, httpOptions)
                    .toPromise()
                    .then((res) => {
                      console.log(res);
                      return res;
                    })
                    .catch(this.handleError);

  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.body || error);
  }

}
