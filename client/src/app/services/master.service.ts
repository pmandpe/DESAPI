import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subjects } from 'app/models/subjects';
import { environment } from 'environments/environment';




@Injectable({ providedIn: 'root' })
export class MasterService {


    constructor(private http: HttpClient) {

    }



    getSubjects() {
        return this.http.post<any>(environment.apiURL + `/api/v1/master/subject/get`, {})
            .pipe(map((res: Response) => {

                console.log(JSON.stringify(res));
                return res ; 
            }))



    }


}