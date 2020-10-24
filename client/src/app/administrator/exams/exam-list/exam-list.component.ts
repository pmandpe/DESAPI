import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from '../../../services/master.service';
import { AlertService } from '../../../services';
import { ExamService } from '../../../services/exams.service';
import { ExamDetailsComponent } from '../exam-details/exam-details.component'

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit {

  constructor(private router: Router, private examService: ExamService, private alertService: AlertService) { }
  Exams: any;
  examCode : any ; 
  selectedIndex : number ; 
  @ViewChild(ExamDetailsComponent,  {static: false}) examDetails : ExamDetailsComponent ; 
  
  ngOnInit() {
    this.selectedIndex = 0 ; 
    this.examService.getExams()
      .subscribe(
        data => {
          this.Exams = data;
        },
        error => {
          this.alertService.error(error);
        });
  }
  onTabChanged(event){
    this.selectedIndex = event.index ; 
    if (this.selectedIndex == 1){
      this.examDetails.disableScanning() ; 
      this.examDetails.disableEvaluation() ; 
    }

  }

  setExamCode(exCode, exMode){
    this.examDetails.setExamCode(exCode, exMode) ;
    this.selectedIndex = 1 ; 
  }
}


