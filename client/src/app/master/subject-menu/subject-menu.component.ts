import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '../../services/utilities.service';

@Component({
  selector: 'app-subject-menu',
  templateUrl: './subject-menu.component.html',
  styleUrls: ['./subject-menu.component.css']
})
export class SubjectMenuComponent implements OnInit {

  constructor(private router: Router, private utilService: UtilService) { }
  selectedMenu:any ;
  menus : any ;
  ngOnInit() {
    this.menus = this.utilService.getTopMenus("SUBJECTS") ;
  }


}
