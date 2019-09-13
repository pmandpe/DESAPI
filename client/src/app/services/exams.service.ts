import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subjects } from '../models/subjects';
import { environment } from '../../environments/environment';



@Injectable({ providedIn: 'root' })
export class ExamService {


    constructor(private http: HttpClient) {

    }



    getExams() {
        return this.http.post<any>(environment.apiURL + `/api/v1/exams/get`, {})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }
    getExamDetails(examcode) {
        return this.http.post<any>(environment.apiURL + `/api/v1/exams/details`, {"examcode" : examcode})
            .pipe(map((res: Response) => {

                
                return res ; 
            }))

    }
    saveExam(formData) {
        return this.http.post<any>(environment.apiURL + `/api/v1/exams/save`, formData)
            .pipe(map((res: Response) => {

                return res ; 
            }))

    }
    saveScanningAssignment(scanningData) {
        return this.http.post<any>(environment.apiURL + `/api/v1/exams/scanningassignment/save`, scanningData)
            .pipe(map((res: Response) => {

                return res ; 
            }))

    }

    saveEvaluationAssignment(evaluationData) {
        return this.http.post<any>(environment.apiURL + `/api/v1/exams/evaluationassignment/save`, evaluationData)
            .pipe(map((res: Response) => {

                return res ; 
            }))

    }


}