import { Component, OnInit } from '@angular/core';
import * as Dynamsoft from 'dwt';
import { ActivatedRoute } from '@angular/router';
import { ScannerService } from '../../services/scanner.service';
import { AlertService, AuthenticationService } from '../../services';
import { unescape } from 'querystring';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-scan-document',
  templateUrl: './scan-document.component.html',
  styleUrls: ['./scan-document.component.css']
})
export class ScanDocumentComponent implements OnInit {

  constructor(private _Activatedroute: ActivatedRoute, private scannerService: ScannerService, private alertService: AlertService, private authenctationService: AuthenticationService) { 
    this.OnHttpUploadSuccess =  this.OnHttpUploadSuccess.bind(this) ;
  }
  title = 'Scan Document';
  DWObject: WebTwain;
  examcode: any;
  message: string;
  scannerSummaryData: any;
  ngOnInit() {
    this.message = "Please place your documents in the scanner and click the 'Scan Document' button";
    this.examcode = this._Activatedroute.snapshot.paramMap.get("examcode");

    Dynamsoft.WebTwainEnv.AutoLoad = false;
    Dynamsoft.WebTwainEnv.Containers = [{ ContainerId: 'dwtcontrolContainer', Width: '800px', Height: '800px' }];
    Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', () => { this.Dynamsoft_OnReady(); });
    /**
     * In order to use the full version, do the following
     * 1. Change Dynamsoft.WebTwainEnv.Trial to false
     * 2. Replace A-Valid-Product-Key with a full version key
     * 3. Change Dynamsoft.WebTwainEnv.ResourcesPath to point to the full version 
     *    resource files that you obtain after purchasing a key
     */
    Dynamsoft.WebTwainEnv.Trial = true;
    Dynamsoft.WebTwainEnv.ProductKey = "t0068UwAAAFuGVxYuHUpzk5J3Tt3zblNQMsn1OpOFqQodE+HXMWzTuhW6NBnIypP8un+KenPrO6Eqw3DcSnZ9il7hstL/sYY=";
    //Dynamsoft.WebTwainEnv.ResourcesPath = "https://tst.dynamsoft.com/libs/dwt/15.0";

    Dynamsoft.WebTwainEnv.Load();

    this.scannerService.getScannerSummary(this.examcode)
      .subscribe(
      data => {
        this.scannerSummaryData = data;
      },
      error => {
        this.alertService.error(error);
      });
  }

  Dynamsoft_OnReady(): void {
    this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');
  }

  acquireImage(): void {

    //this.DWObject.ProductKey = 't0126vQIAAAsYy4ECUsO3V3m3sstataymDEQsQ8Nt8n1QqYhELQ6YOOwYQoS/Gwr1cR7p5JMYdkS2fLtk0c97U62rS+odm1jJp5D6OGBG+ohjtPdXOo39mCyfuaTTJ2y4kW90wJhv6OZR9GaP8DM/RgeM+YZunnbmYKSVwQ68x4jT';

    if (this.DWObject.SelectSource()) {
      const onAcquireImageSuccess = () => { this.DWObject.CloseSource(); };
      const onAcquireImageFailure = onAcquireImageSuccess;
      this.DWObject.OpenSource();

      this.DWObject.AcquireImage({}, onAcquireImageSuccess, onAcquireImageFailure);
    }
  }



  uploadDocument() {

    var strHTTPServer = environment.apiURL;//location.hostname; //The name of the HTTP server. 
    var CurrentPathName = '/api/v1/scanner';
    var CurrentPath = CurrentPathName.substring(0, CurrentPathName.lastIndexOf("/") + 1);
    var strActionPage = '/api/v1/scanner/' + "uploadscan";
    this.DWObject.IfSSL = false; // Set whether SSL is used
    this.DWObject.HTTPPort = location.port == "" ? 80 : 4000;
    var authToken = this.authenctationService.getHeaderToken() ;

    this.DWObject.SetHTTPHeader("Authorization" , authToken.Authorization) ; 
   
    this.DWObject.SetHTTPFormField("examcode", this.examcode);
    //this.DWObject.SetHTTPFormField("DocumentType", "Invoice");

    // Upload all the images in Dynamic Web TWAIN viewer to the HTTP server as a PDF file asynchronously
    this.DWObject.HTTPUploadAllThroughPostAsPDF(
      'localhost',
      '/api/v1/scanner/uploadscan',
      "imageData.pdf",
      this.OnHttpUploadSuccess,
      this.OnHttpUploadFailure
    );
  }


  OnHttpUploadSuccess() {
 
    //this.DWObject.ClearAllHTTPFormField(); // Clear all fields first
    this.alertService.success("Document uploaded successfully, reloading the scanner...") ;
    setTimeout(function(){
      location.reload();  
    },2000);

    
  }
  OnHttpUploadFailure(errorCode, errorString, sHttpResponse) {
    alert(errorString + sHttpResponse);
  }


}