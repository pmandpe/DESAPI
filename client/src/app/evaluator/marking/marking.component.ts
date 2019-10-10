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
  
  private mypdf: string;
  private assignment : any ; 
  private hideAnswerCode : any ; 
  private totalExamMarks : any ; 
  pendingForEvaluation : any; 
  evaluatedCopies : any ; 

  constructor(private evaluatorService: EvaluatorService, private _Activatedroute: ActivatedRoute, private alertService: AlertService) {


  }

  ngOnInit() {
    this.examCode = this._Activatedroute.snapshot.paramMap.get("examcode");
    //Get the exam data
    this.evaluatorService.getEvaluationSummary(this.examCode)
    .subscribe(
      data => {
        var answerData : any  ; 
        answerData = data ;
        this.pendingForEvaluation =  answerData.pendingcopies ; 
        this.evaluatedCopies =  answerData.evaluatedcopies ; 
        //this.assignment = data ; 
        //this.hideAnswerCode = true ; 
        //this.totalExamMarks = this.assignment.totalExamMarks ; 
        // this.scanningAssignment = this.getScanningAssignment(data);
      },
      error => {
        this.alertService.error(error);
        //this.loading = false;

      });
  }

 
}
