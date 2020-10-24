import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import { environment } from '../../environments/environment';
import { SpinnerService } from '../services';
import { tap } from 'rxjs/operators';



@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private spinnerService: SpinnerService) { 
        
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        this.spinnerService.show();

        
        request = this.authenticationService.interceptToken(request) ;
        return next.handle(request)
        .pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.spinnerService.hide();
                }
            }, (error) => {
                this.spinnerService.hide();
            })
        );
    }
}