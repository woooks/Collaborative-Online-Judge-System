import { Component, OnInit, Input } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})

export class ProblemDetailComponent implements OnInit {

  problem: Problem;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    // private location: Location
  ) { }

  ngOnInit() {
    this.getProblem();
  }

  getProblem(): void {
    const id = +this.route.snapshot.paramMap.get('id');  // !!! id is a string.
    this.problem = this.dataService.getProblem(id);
  }

}
