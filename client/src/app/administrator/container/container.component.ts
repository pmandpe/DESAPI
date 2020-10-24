import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  options: FormGroup;
  menus: any;

  selectedMenu: any;
  menuItems: any[];

  constructor(fb: FormBuilder) {
    this.options = fb.group({
      bottom: 0,
      fixed: true,
      top: 0
    });
  }

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
  isMobileMenu() {
    return false;
};


listClick(event, newValue) {
  this.selectedMenu = newValue;  // don't forget to update the model here
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


