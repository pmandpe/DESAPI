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


  constructor(private evaluatorService: EvaluatorService, private _Activatedroute: ActivatedRoute, private alertService: AlertService) {


  }

  ngOnInit() {
    this.examCode = this._Activatedroute.snapshot.paramMap.get("examcode");
  }

  getAnswerDetails() {
    this.evaluatorService.getMarkingDetails(this.examCode)
      .subscribe(
      data => {
        this.evaluationData = data;
        this.getPdf() ;

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
