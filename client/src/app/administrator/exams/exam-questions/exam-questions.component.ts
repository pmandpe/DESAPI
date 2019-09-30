import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../services';
import { UtilService } from '../../../services/utilities.service';
import { ExamQuestionDetailsComponent } from '../../../administrator/exams/exam-question-details/exam-question-details.component';

@Component({
  selector: 'app-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.css']
})
export class ExamQuestionsComponent implements OnInit {

  @Input() examQuestions;
  @Input() examcode;
  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,

    private alertService: AlertService,
    private utilService: UtilService) { }

  ngOnInit() {
    
  }

  openQuestion(questionNo) {
    var question = {} ;
    var editMode = "EDIT";
    if (questionNo == -1) {
      editMode = "NEW";
    }

    if (editMode == "EDIT") {
      question = this.examQuestions.find(function (x) {
        var returnValue = x.questionno == questionNo;
        return (returnValue ? x : null);
      });
    }




    const modalRef = this.modalService.open(ExamQuestionDetailsComponent, { windowClass: 'scannerpopup' });
    modalRef.componentInstance.examQuestion = question;
    modalRef.componentInstance.examQuestions = this.examQuestions;
    modalRef.componentInstance.mode = editMode;
    modalRef.componentInstance.examcode = this.examcode;


    modalRef.result.then((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

}
