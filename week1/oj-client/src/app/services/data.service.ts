import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { Problems } from '../mock-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  getProblems(): Problem[] {
    return Problems;
  }

  getProblem(id: number): Problem {
    return Problems.find( (problem) => problem.id===id);
  }
}
