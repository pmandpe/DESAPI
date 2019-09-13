import { Component, OnInit } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { AlertService } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  Subjects: any ;
  
  constructor(private router : Router, private masterService: MasterService, private alertService: AlertService) {   }
 
  ngOnInit() {
  

    this.masterService.getSubjects()
            
            .subscribe(
                data => {

                    this.Subjects = data ; 
                 
                },
                error => {
                    this.alertService.error(error);
                    
                });
  }


}
