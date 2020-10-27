import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AuthenticationService, AlertService } from '../../services';


@Component({
  selector: 'app-sa-container',
  templateUrl: './sa-container.component.html',
  styleUrls: ['./sa-container.component.scss']
})
export class SaContainerComponent implements OnInit {
  isLoggedIn : any ;
    currUser : any ; 
  ngOnInit(): void {
    this.currUser = localStorage.getItem('currentUser') ;
    if (this.currUser && this.currUser != ''){
        this.currUser = JSON.parse(this.currUser) ;
        //this.router.navigateByUrl('/dashboard') ;
        this.isLoggedIn = true  ;
    }
    else{
        this.isLoggedIn = false ; 
    }

}


constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
) {
}

logout() {
    this.authenticationService.logout("");
    this.router.navigate(['/login']);
}

}
