import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services';
import { User } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit {
  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.isLoggedIn = this.authenticationService.isLoggedIn()
  }
  
  currentUser: User;
  isLoggedIn : boolean ;
  constructor(
      private router: Router,
      private authenticationService: AuthenticationService
  ) {
   
  }

  logout() {
      this.authenticationService.logout("");
      
      this.router.navigate(['/login']);
  }
}