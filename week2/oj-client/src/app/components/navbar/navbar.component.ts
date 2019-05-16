import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title = 'LabCode';

  username = "Ryan";


  constructor(private router: Router) { }

  ngOnInit() {

  }

  searchProblem(): void {
    this.router.navigate(['/problems']);
  }
}
