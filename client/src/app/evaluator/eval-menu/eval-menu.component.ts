import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eval-menu',
  templateUrl: './eval-menu.component.html',
  styleUrls: ['./eval-menu.component.css']
})
export class EvalMenuComponent implements OnInit {
  menuItems: any;
  selectedMenu: any;
  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }


  isMobileMenu() {
    //  if ($(window).width() > 991) {
    return false;
    //}
    //return true;
  };


  listClick(event, newValue) {
    this.selectedMenu = newValue;  // don't forget to update the model here
    // ... do other stuff here ...
  }

}



declare interface EvalRouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: EvalRouteInfo[] = [
  { path: '/evaluator/dashboard', title: 'My Evaluations', icon: 'fa-area-chart', class: '' },
  { path: '/evaluator/papersetting', title: 'Paper Allocations', icon: 'fa-newspaper-o', class: '' },
  { path: '/evaluator/changepassword', title: 'Change Password', icon: 'fa-key', class: '' }

];

