import { Component, OnInit } from '@angular/core';
import { EvaluatorService } from '../../services/evaluator.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService,  } from '../../services';

@Component({
  selector: 'app-marking',
  templateUrl: './marking.component.html',
  styleUrls: ['./marking.component.css']
})
export class MarkingComponent implements OnInit {

  private examCode: string ; 
  private examData : {} ; 
  private mypdf : string ; 

  constructor(private evaluatorService: EvaluatorService, private _Activatedroute: ActivatedRoute, private alertService: AlertService) { 

    
  }

  ngOnInit() {
    this.examCode = this._Activatedroute.snapshot.paramMap.get("examcode");
    this.evaluatorService.getMarkingDetails(this.examCode)
    .subscribe(
      data => {
        this.examData = data;
        

      },
      error => {
        this.alertService.error(error);
        //this.loading = false;

      });


      this.evaluatorService.getPdf()
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
