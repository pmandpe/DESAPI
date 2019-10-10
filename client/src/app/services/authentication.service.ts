import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { Role } from '../models/Role';



@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
   

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public getDashboardUrl(){
        var user = localStorage.getItem('currentUser') ;
        var userObject = {"role":""} ;
        var dashboardUrl = "/" ;
        if (user){
            userObject  = JSON.parse(user) ;
            switch (userObject.role){
                case Role.Admin:
                    dashboardUrl = "/admin/dashboard" ;
                    break ; 
                case Role.Scanner:
                    dashboardUrl = "/scanner/dashboard" ;
                    break ; 
                case Role.Evaluator:
                    dashboardUrl = "/evaluator/dashboard" ;
                    break ; 

            }
            
        }
    
        return dashboardUrl ;
    }

    
    login(username: string, password: string) {
        return this.http.post<any>(environment.apiURL + `/users/authenticate`, { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    

                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    interceptToken(request){
        const currentUser = this.currentUserValue;
        const isLoggedIn = currentUser && currentUser.token;
        const isApiUrl = request.url.startsWith(environment.apiURL);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: this.getHeaderToken()
            });
        }
        return request ; 
    }

    getHeaderToken(){
        if (!this.currentUserValue){
            return null ; 
        }
        return {
            Authorization: `Bearer ${this.currentUserValue.token}`
        }
    }

    isLoggedIn(){
        var token = this.getHeaderToken() ; 
        if (token){
            return true ; 
        }
        return false ; 
    }
}
