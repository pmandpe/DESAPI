import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {
  menus: any ;
  constructor() { }
  selectedMenu : any ;  

  ngOnInit() {
    this.menus = [] ;
    this.menus.push({"label": "Dashboard", "link": "./dashboard"}) ;
    this.menus.push({"label": "Manage Subject", "link": "./subject"}) ;
    this.menus.push({"label": "Manage Exams", "link": "./exams"}) ;
    
    this.selectedMenu = this.menus[0]  ;
  }

  listClick(event, newValue) {
    this.selectedMenu = newValue;  // don't forget to update the model here
    // ... do other stuff here ...
}

}
