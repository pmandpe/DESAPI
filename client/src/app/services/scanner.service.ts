import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subjects } from '../models/subjects';
import { environment } from '../../environments/environment';



@Injectable({ providedIn: 'root' })
export class ScannerService {


    constructor(private http: HttpClient) {

    }



    getDashboard() {
        return this.http.post<any>(environment.apiURL + `/api/v1/scanner/dashboard`, {})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }
    
    getScannerSummary(examcode) {
        return this.http.post<any>(environment.apiURL + `/api/v1/scanner/summary`, {"examcode" : examcode})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }

}