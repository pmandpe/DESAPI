import { Component, OnInit } from '@angular/core';
import { User } from '../models';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services';
import { Role } from '../models/Role';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User;

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }


  get isAdmin() {
    return this.currentUser && this.currentUser[0].role === Role.Admin;
  }


  ngOnInit() {
  }

}
