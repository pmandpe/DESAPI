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



    getDashboard() {
        return this.http.post<any>(environment.apiURL + `/api/v1/evaluator/dashboard`, {})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }
    
}