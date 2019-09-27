import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  @Input() public menus;
  constructor(private router: Router) { }
  selectedMenu : any ; 
  ngOnInit() {
  }
  listClick(event, menu) {
    this.selectedMenu = menu; 
    this.router.navigate([menu.link]);
     // don't forget to update the model here
    // ... do other stuff here ...
}
}
