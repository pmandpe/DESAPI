import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subjects } from '../models/subjects';
import { environment } from 'environments/environment';




@Injectable({ providedIn: 'root' })
export class LookupService {


    constructor(private http: HttpClient) {

    }



    getAssignees(userType: string) {
        return this.http.post<any>(environment.apiURL + `/api/v1/lookup/users`, {"usertype" : userType})
            .pipe(map((res: Response) => {

                console.log(JSON.stringify(res));
                return res ; 
            }))

    }
 

    

}