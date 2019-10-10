import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../services/utilities.service';

@Component({
  selector: 'app-exam-menu',
  templateUrl: './exam-menu.component.html',
  styleUrls: ['./exam-menu.component.css']
})
export class ExamMenuComponent implements OnInit {
  menus : any ; 
  constructor(private utilService: UtilService) { }

  ngOnInit() {
    this.menus = this.utilService.getTopMenus("EXAMS") ;
  }

}
