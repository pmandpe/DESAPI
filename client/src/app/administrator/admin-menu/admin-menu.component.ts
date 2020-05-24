import { Component, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {
  menus: any;
  constructor() { }
  selectedMenu: any;
  menuItems: any[];


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
  { path: '/admin/dashboard', title: 'Dashboard', icon: 'fa-area-chart', class: '' },
  { path: '/admin/subject', title: 'Manage Subject', icon: 'fa-newspaper-o', class: '' },
  { path: '/admin/exams', title: 'Manage Exams', icon: 'fa-pencil-square-o', class: '' },
  { path: '/admin/users', title: 'Manage Users', icon: 'fa-users', class: '' },
  { path: '/admin/changepassword', title: 'Change Password', icon: 'fa-key', class: '' }
];


