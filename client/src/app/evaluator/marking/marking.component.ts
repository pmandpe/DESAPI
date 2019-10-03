import { Component, OnInit } from '@angular/core';
import { EvaluatorService } from '../../services/evaluator.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService, } from '../../services';

@Component({
  selector: 'app-marking',
  templateUrl: './marking.component.html',
  styleUrls: ['./marking.component.css']
})
export class MarkingComponent implements OnInit {

  private examCode: string;
  private evaluationData: any;
  private mypdf: string;
  private assignment : any ; 
  private hideAnswerCode : any ; 
  private totalExamMarks : any ; 

  constructor(private evaluatorService: EvaluatorService, private _Activatedroute: ActivatedRoute, private alertService: AlertService) {


  }

  ngOnInit() {
    this.examCode = this._Activatedroute.snapshot.paramMap.get("examcode");
    //Get the exam data
    this.evaluatorService.getEvaluationData(this.examCode)
    .subscribe(
      data => {
        this.assignment = data ; 
        this.hideAnswerCode = true ; 
        this.totalExamMarks = this.assignment.totalExamMarks ; 
        
                // this.scanningAssignment = this.getScanningAssignment(data);
      },
      error => {
        this.alertService.error(error);
        //this.loading = false;

      });
  }

  getAnswerDetails() {
    this.evaluatorService.getMarkingDetails(this.examCode)
      .subscribe(
      data => {
        this.evaluationData = data;
        this.getPdf() ;
        this.hideAnswerCode = false ; 

      },
      error => {
        this.alertService.error(error);
        //this.loading = false;

      }
      );
  }

  getPdf() {
    this.evaluatorService.getPdf(this.examCode, this.evaluationData.answerdata[0].answercode)
      .subscribe(
      data => {
        this.mypdf = URL.createObjectURL(data);
      },
      error => {
        this.alertService.error(error);
        //this.loading = false;

      });
  }

}
