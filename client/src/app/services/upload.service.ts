import { Injectable } from '@angular/core'
import {
    HttpClient,
    HttpRequest,
    HttpEventType,
    HttpResponse,
} from '@angular/common/http'
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';



@Injectable()
export class UploadService {
    constructor(private http: HttpClient) { }
    private dataStatus: any;
    public upload(files: Set<File>, uploadURL: string, additionalData: {}): { [key: string]: { progress: Observable<number> } } {

        // this will be the our resulting map
        const status: { [key: string]: { progress: Observable<number> } } = {};

        files.forEach(file => {
            // create a new multipart-form for every file
            const formData: FormData = new FormData();
            formData.append('file', file, file.name);
            formData.append('formParams', JSON.stringify(additionalData));

            // create a http-post request and pass the form
            // tell it to report the upload progress
            const req = new HttpRequest('POST', uploadURL, formData, {
                reportProgress: true
            });

            // create a new progress-subject for every file
            const progress = new Subject<number>();
            const dataStatus = new Subject<number>();

            // send the http-request and subscribe for progress-updates
            this.http.request(req).subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {

                    // calculate the progress percentage
                    const percentDone = Math.round(100 * event.loaded / event.total);

                    // pass the percentage into the progress-stream
                    progress.next(percentDone);
                } else if (event instanceof HttpResponse) {

                    this.dataStatus = event.body;

                    // Close the progress-stream if we get an answer form the API
                    // The upload is complete
                    progress.complete();

                }
            });

            // Save every progress-observable in a map of all observables
            status[file.name] = {
                progress: progress.asObservable()
            };
        });

        // return the map of progress.observables
        return status;
    }

    getDataUploadStatus() {
        return this.dataStatus;
    }



    public uploadMultipleFiles(files: Set<File>, uploadURL: string, additionalData: {}) {
        uploadURL = environment.apiURL + '/api/v1' + uploadURL ;
        console.log("UPload URL "+ uploadURL) ;
        const formData: FormData = new FormData();
        files.forEach(file => {
            // create a new multipart-form for every file
            formData.append('files', file, file.name);
        }) ;
        formData.append('formParams', JSON.stringify(additionalData));
        return this.http.post<any>(uploadURL, formData)
        .pipe(map(response => {
            return response;
        }));
    }



}