import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { AlertService } from '../../services/alert.service';

import { FormGroup, FormBuilder } from '@angular/forms';
import { EvaluatorService} from '../../services/evaluator.service';
import { UtilService } from '../../services/utilities.service';
import { UploadService } from '../../services/upload.service';
import { first } from 'rxjs/internal/operators/first';


@Component({
  selector: 'app-paper-setting',
  templateUrl: './paper-setting.component.html',
  styleUrls: ['./paper-setting.component.css']
})

export class PaperSettingComponent implements OnInit {
  @ViewChild('uploadPaper', { static: false }) uploadPaper;
  private Exams: any ; 
  constructor(private evaluatorService: EvaluatorService, private uploadService: UploadService,  private utilService: UtilService, private formBuilder: FormBuilder, private alertService:AlertService) { }
  PaperUploadForm: FormGroup;
  public files: Set<File> = new Set();
examName : string ; 
  //public uploader: FileUploader = new FileUploader({ url: 'http://localhost:4000/api/upload', itemAlias: 'photo' });
  // this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
  // this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
  //   console.log('ImageUpload:uploaded:', item, status, response);
  //   alert('File uploaded successfully');
  // };
  ngOnInit() {
    
    this.evaluatorService.getPaperAllocation()
      .subscribe(
      data => {
        this.Exams = data;
      },
      error => {
        this.alertService.error(error);
      });

      this.createPaperForm();

  }
 
  createPaperForm(){
    this.PaperUploadForm = this.formBuilder.group({
      uploadpaper: [''],
      uploadpapercomments:[''],
      examcode:['']
    });


  }

  uploadDocument(event, controlName) {
    this.PaperUploadForm.controls[controlName].setValue(event.currentTarget.files[0].name);
  }

  getFormattedDate(dateValue){
    return this.utilService.getFormattedDate(dateValue) ;
  }

  uploadForm(){
    var fileObject = this.uploadPaper.nativeElement.files;
    if (fileObject && fileObject.length > 0) {
      this.files.add(fileObject[0]);
    }

    this.uploadService.uploadMultipleFiles(this.files, "/evaluator/paperupload", this.PaperUploadForm.value).pipe(first())
    .subscribe(
    (response: any) => {
      this.alertService.success("Paper Uploaded Successfully") ;
    },
    error => {
    });
  }


  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }


  viewPaper(examCode, examname){
    this.examName = examname ; 
    this.PaperUploadForm.controls["examcode"].setValue(examCode);
    this.nextStep() ; 
  }

}
