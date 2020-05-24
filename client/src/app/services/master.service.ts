import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subjects } from '../models/subjects';
import { environment } from '../../environments/environment';




@Injectable({ providedIn: 'root' })
export class MasterService {


    constructor(private http: HttpClient) {

    }

    getSubjects() {
        return this.http.post<any>(environment.apiURL + `/api/v1/master/subject/get`, {})
            .pipe(map((res: Response) => {

                return res ; 
            }))

    }
    getSubjectDetails(subjectcode) {
        return this.http.post<any>(environment.apiURL + `/api/v1/master/subject/getdetails`, {"subjectcode" : subjectcode})
            .pipe(map((res: Response) => {

                
                return res ; 
            }))

    }
    saveSubject(formData) {
        return this.http.post<any>(environment.apiURL + `/api/v1/master/subject/save`, formData)
            .pipe(map((res: Response) => {

                return res ; 
            }))

    }

    getUsers(){
        return this.http.post<any>(environment.apiURL + `/api/v1/master/users/get`,{})
            .pipe(map((res: Response) => {
                return res ; 
            }))
    }
    getEvaluators(){
        return this.http.post<any>(environment.apiURL + `/api/v1/master/users/getevaluators`,{})
            .pipe(map((res: Response) => {
                return res ; 
            }))
    }

    getPendingEvaluators(){
        return this.http.post<any>(environment.apiURL + `/api/v1/master/users/pendingevaluators`,{})
            .pipe(map((res: Response) => {
                return res ; 
            }))
    }

    saveUser(formData) {
        return this.http.post<any>(environment.apiURL + `/api/v1/master/users/save`, formData)
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }

    saveAdmin(formData) {
        return this.http.post<any>(environment.apiURL + `/api/v1/master/users/save/admin`, formData)
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }
    approveUsers(formData) {
        return this.http.post<any>(environment.apiURL + `/api/v1/master/users/approveusers`, formData)
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }

    getUserDetails(userName) {
        return this.http.post<any>(environment.apiURL + `/api/v1/master/users/getdetails`, {"username" : userName})
            .pipe(map((res: Response) => {

                return res ; 
            }))

    }
    
    getAdminUsers(){
        return this.http.post<any>(environment.apiURL + `/api/v1/master/users/getadmins`,{})
            .pipe(map((res: Response) => {
                return res ; 
            }))
    }
    getPaper() {
        return this.http.post(environment.apiURL + `/api/v1/sa/paper/download`, {},{responseType: 'blob' as 'json'})
            .pipe(map((res: Response) => {
                return res ; 
            }))

    }
}