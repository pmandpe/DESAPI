import { Component, OnInit, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../services';
import { UtilService } from '../../../services/utilities.service';
import { ExamQuestionDetailsComponent } from '../../../administrator/exams/exam-question-details/exam-question-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.css']
})
export class ExamQuestionsComponent implements OnInit {

  @Input() examQuestions;
  @Input() examcode;
  @Input() grandTotal;
  totalExamMarks: number;
  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private alertService: AlertService,
    private utilService: UtilService) { }


  ngOnInit() {
    this.setTotalMarks();
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log("Grand Total " + this.grandTotal);
    if (this.examQuestions && this.examQuestions.length > 0) {

      this.setTotalSubQuestionMarks();
      this.setTotalMarks();
    }

  }

  setExamQuestions(argExamQuestion){
    this.examQuestions = argExamQuestion ;

  }

  setTotalSubQuestionMarks() {

    this.examQuestions.forEach(question => {
      var subSectionTotal = 0;
      question.sections.forEach(section => {
        subSectionTotal += parseFloat(section.subquestionmarks ? section.subquestionmarks : 0);
      });
      question.subsectiontotal = subSectionTotal;
    });
  }

  setTotalMarks() {
    this.totalExamMarks = 0;
    if (this.examQuestions && this.examQuestions.length) {
      this.examQuestions.forEach(function (question) {
        this.totalExamMarks += question.totalmarks + parseFloat(question.subsectiontotal ? question.subsectiontotal : 0);
      }.bind(this));
    }
  }





  openQuestion(questionNo) {

    var question = {};
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

    const modalRef = this.dialog.open(ExamQuestionDetailsComponent, {
      panelClass: 'scannerpopup'
    });

    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.examQuestions = result;
        this.setTotalSubQuestionMarks() 
        this.setTotalMarks();

      }
    });

    modalRef.componentInstance.examQuestion = question;
    modalRef.componentInstance.examQuestions = this.examQuestions;
    modalRef.componentInstance.mode = editMode;
    modalRef.componentInstance.examcode = this.examcode;


  }

}
