import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subjects } from '../models/subjects';
import { environment } from '../../environments/environment';




@Injectable({ providedIn: 'root' })
export class EvaluatorService {


    constructor(private http: HttpClient) {

    }


    getEvaluationData(examcode) {
        return this.http.post<any>(environment.apiURL + `/api/v1/evaluator/evaluationdata`, {"examcode" : examcode})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }
    


    getDashboard() {
        return this.http.post<any>(environment.apiURL + `/api/v1/evaluator/dashboard`, {})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }

    getMarkingDetails(examcode, answercode) {
        return this.http.post<any>(environment.apiURL + `/api/v1/evaluator/marking`, {"examcode" : examcode, "answercode": answercode})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }
    
    saveAnswers(answerData) {
        return this.http.post<any>(environment.apiURL + `/api/v1/evaluator/marking/save`, { "answerData": answerData})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }

    getPdf(examcode, answercode) {
        return this.http.post(environment.apiURL + `/api/v1/evaluator/answerspdf`, {"examcode":examcode, "answercode": answercode},{responseType: 'blob' as 'json'})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }


    getQuestionAnswers(examcode, answercode) {
        return this.http.post<any>(environment.apiURL + `/api/v1/evaluator/questions`, {"examcode": examcode, "answercode": answercode})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }
    getEvaluationSummary(examcode) {
        return this.http.post<any>(environment.apiURL + `/api/v1/evaluator/evaluationsummary`, {"examcode": examcode})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }
    
}