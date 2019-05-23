import { Component, OnInit } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';
import { InputService } from '../../services/input.service';
import { Subscription } from 'rxjs-compat/Subscription';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {

  problems: Problem[] = [];
  subscriptionProblems: Subscription;
  subscriptionInput: Subscription;
  searchTerm: string = '';
  isAdmin: Boolean = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private inputService: InputService
  ) { }

  ngOnInit() {
    this.getProblems();
    this.getSearchTerm();
    this.checkAdmin();
  }

  getProblems(): void {
    this.subscriptionProblems = this.dataService.getProblems()
                                                  .subscribe(problems => this.problems = problems);
  }

  getSearchTerm(): void {
    this.subscriptionInput = this.inputService.getInput()
                                  .subscribe(
                                    inputTerm => this.searchTerm = inputTerm
                                  );
  }

  checkAdmin(): void {
    this.authService.isAdmin(isAdmin=>{
      console.log(isAdmin)
      this.isAdmin=isAdmin;
    });
  }

}
