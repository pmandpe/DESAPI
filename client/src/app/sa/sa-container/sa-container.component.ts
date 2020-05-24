import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sa-container',
  templateUrl: './sa-container.component.html',
  styleUrls: ['./sa-container.component.css']
})
export class SaContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("Inside Container") ;
  }

}
