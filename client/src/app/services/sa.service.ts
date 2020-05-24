import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subjects } from '../models/subjects';
import { environment } from '../../environments/environment';




@Injectable({ providedIn: 'root' })
export class SaService {

    constructor(private http: HttpClient) {

    }

    getPaper(username, examcode) {
        return this.http.post(environment.apiURL + `/api/v1/sa/paper/download`, {"username":username, "examcode" : examcode},{responseType: 'blob' as 'json'})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }

    approvePaper(username, examcode) {
        return this.http.post(environment.apiURL + `/api/v1/sa/paper/approve`, {"username":username, "examcode" : examcode})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }
}