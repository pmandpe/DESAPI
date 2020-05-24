import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sa-menu',
  templateUrl: './sa-menu.component.html',
  styleUrls: ['./sa-menu.component.css']
})
export class SaMenuComponent implements OnInit {
  menuItems: any;
  selectedMenu: any;
  constructor() { }

  ngOnInit() {
    /*this.menus = [] ;
    this.menus.push({"label": "Dashboard", "link": "./dashboard"}) ;
    this.menus.push({"label": "Manage Subject", "link": "./subject"}) ;
    this.menus.push({"label": "Manage Exams", "link": "./exams"}) ;
    
    this.selectedMenu = this.menus[0]  ;
    */
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



declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/sa/dashboard', title: 'Dashboard', icon: 'fa-area-chart', class: '' },
  { path: '/sa/paperallocation', title: 'Paper Allocation', icon: 'fa-newspaper-o', class: '' },
  { path: '/sa/manage-users', title: 'Manage Users', icon: 'fa-pencil-square-o', class: '' },

];

