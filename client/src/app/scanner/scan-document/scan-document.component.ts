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
    this.OnHttpUploadSuccess = this.OnHttpUploadSuccess.bind(this);
  }
  title = 'Scan Document';
  DWObject: WebTwain;
  examcode: any;
  message: string;
  scannerSummaryData: any;
  disableAllButtons: any;
  isScanning: boolean;
  numberofsupplimentaries: any;
  rollnumber: any;
  selectSources: HTMLSelectElement;



  ngOnInit() {
    this.disableAllButtons = false;
    this.message = "Please place your documents in the scanner and click the 'Scan Document' button";
    this.examcode = this._Activatedroute.snapshot.paramMap.get("examcode");

    Dynamsoft.WebTwainEnv.AutoLoad = false;
    Dynamsoft.WebTwainEnv.Containers = [{ ContainerId: 'dwtcontrolContainer', Width: '100%', Height: '100%' }];
    Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', () => { this.Dynamsoft_OnReady(); });
    /**
     * In order to use the full version, do the following
     * 1. Change Dynamsoft.WebTwainEnv.Trial to false
     * 2. Replace A-Valid-Product-Key with a full version key
     * 3. Change Dynamsoft.WebTwainEnv.ResourcesPath to point to the full version 
     *    resource files that you obtain after purchasing a key
     */
    Dynamsoft.WebTwainEnv.Trial = true;
    //Dynamsoft.WebTwainEnv.ProductKey = "t0068UwAAAFuGVxYuHUpzk5J3Tt3zblNQMsn1OpOFqQodE+HXMWzTuhW6NBnIypP8un+KenPrO6Eqw3DcSnZ9il7hstL/sYY=";
    //Dynamsoft.WebTwainEnv.ProductKey = "t0138cQMAAJcMDa31CdoMBwZI7nOl/5Bcfvgh+tsAjk9LgmtHGYod3rMm6Ag84U8D3vSyz5JGbDufWmtag0gEpttIAP2LxrGb2brQ1kyYzBwNDL231m7sj9n051/qzFkKLhQbJozFRsI8hPf3ijjzbZgwFhsJ8yQyn03XaMIwYSw2gndjKAUm/AK/TqoE";
    Dynamsoft.WebTwainEnv.ProductKey = "t0140lQMAAB/eePgtZRMeSx4xqk37kLkhHgl1vP+mCtiybjAKuK7cJKPTAzZbrWCL0UKKtSSVH3Mll94bUt6mvqa9NIBsdV2fzD6EvpsJk5mjgaH3VxvG/phdf/ZSZ8624kaxYcJYbCTMQ3i7V8SZP4YJY7GRME8i89V0jSYME8ZiI4iNOqahlFqVLxB7sfo=" ;
    //Dynamsoft.WebTwainEnv.ResourcesPath = "https://tst.dynamsoft.com/libs/dwt/15.0";

    Dynamsoft.WebTwainEnv.Load();

    this.scannerService.getScannerSummary(this.examcode)
      .subscribe(
      data => {
        this.scannerSummaryData = data;
        //-- disable buttons if nothing to scan
        if (this.scannerSummaryData.assignedcopies == 0) {
          this.disableAllButtons = true;
        }
      },
      error => {
        this.alertService.error("Unable to retrieve data from Server. Please contact System Administrator");
        this.disableAllButtons = true;

      });
  }

  Dynamsoft_OnReady(): void {
    this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');
    let count = this.DWObject.SourceCount;
    this.selectSources = <HTMLSelectElement>document.getElementById("sources");
    this.selectSources.options.length = 0;
    for (let i = 0; i < count; i++) {
      this.selectSources.options.add(new Option(this.DWObject.GetSourceNameItems(i), i.toString()));
    }
  }

  acquireImage(): void {

    if (!this.rollnumber || this.rollnumber == "") {
      this.alertService.error("Roll number cannot be blank");
      return;
    }

    try {
      this.isScanning = true;
      this.disableAllButtons = true; // disable all buttons while scanning is going on so that user doesnt click other buttons accidentally.
      //this.DWObject.ProductKey = 't0126vQIAAAsYy4ECUsO3V3m3sstataymDEQsQ8Nt8n1QqYhELQ6YOOwYQoS/Gwr1cR7p5JMYdkS2fLtk0c97U62rS+odm1jJp5D6OGBG+ohjtPdXOo39mCyfuaTTJ2y4kW90wJhv6OZR9GaP8DM/RgeM+YZunnbmYKSVwQ68x4jT';
      /*
      if (this.DWObject.SelectSource()) {
        const onAcquireImageSuccess = () => { this.DWObject.CloseSource(); };
        const onAcquireImageFailure = onAcquireImageSuccess;
        this.DWObject.OpenSource();

        this.DWObject.AcquireImage({}, onAcquireImageSuccess, onAcquireImageFailure);
      }
      */

      //this.DWObject.SelectSourceByIndex(3);
      //this.DWObject.OpenSource()
      //this.DWObject.IfShowUI = true;
      /*
      this.DWObject.RegisterEvent('OnPostAllTransfers', function () {
        this.uploadDocument();
      }.bind(this));
      */
      /*
      this.DWObject.XferCount = -1;
      this.DWObject.AcquireImage(); //using ADF  for scanning
      */
      this.DWObject.IfAutoFeed = true;
      this.DWObject.IfFeederEnabled = true;

      if (this.DWObject.SourceCount > 0 && this.DWObject.SelectSourceByIndex(this.selectSources.selectedIndex)) {
        const onAcquireImageSuccess = () => { this.DWObject.CloseSource(); };
        const onAcquireImageFailure = onAcquireImageSuccess;
        this.DWObject.OpenSource();
        this.DWObject.AcquireImage({}, onAcquireImageSuccess, onAcquireImageFailure);
      } else {
        alert("No Source Available!");
      }
      this.disableAllButtons=false ; 
    }
    catch (ex) {
      console.log("-----------------------------------" + ex);
    }

  }



  uploadDocument() {

    var strHTTPServer = environment.apiURL;//location.hostname; //The name of the HTTP server. 
    //var CurrentPathName = '/api/v1/scanner';
    //var CurrentPath = CurrentPathName.substring(0, CurrentPathName.lastIndexOf("/") + 1);
    //var strActionPage = '/api/v1/scanner/uploadscan';
    this.DWObject.IfSSL = false; // Set whether SSL is used
    this.DWObject.HTTPPort = location.port == "" ? 80 : 4000;
    var authToken = this.authenctationService.getHeaderToken();
    this.DWObject.SetHTTPHeader("Authorization", authToken.Authorization);
    this.DWObject.SetHTTPFormField("examcode", this.examcode);
    this.DWObject.SetHTTPFormField("rollnumber", this.rollnumber);
    this.DWObject.SetHTTPFormField("numberofsupplimentaries", this.numberofsupplimentaries);
    //this.DWObject.SetHTTPFormField("DocumentType", "Invoice");

    // Upload all the images in Dynamic Web TWAIN viewer to the HTTP server as a PDF file asynchronously
    try {
      this.DWObject.HTTPUploadAllThroughPostAsPDF(
        'localhost',
        '/api/v1/scanner/uploadscan',
        "imageData.pdf",
        this.OnHttpUploadSuccess,
        this.OnHttpUploadFailure
      );
    }
    catch (ex) {
      console.log("error occurred --------------------------------------" + ex);
    }
  }

  setScannedCount(){
    if (this.scannerSummaryData.scannedcopies == "" ){
      this.scannerSummaryData.scannedcopies = 0 ;
    }
    this.scannerSummaryData.scannedcopies = this.scannerSummaryData.scannedcopies + 1
  }

  OnHttpUploadSuccess() {

    //this.DWObject.ClearAllHTTPFormField(); // Clear all fields first
    //this.alertService.success("Document uploaded successfully, Ready for Next Scanning ; ") ;
    this.alertService.success("Document uploaded successfully, Ready for Next Scanning. ");
    this.numberofsupplimentaries = 0;
    this.rollnumber = "";
    this.DWObject.RemoveAllImages();
    /*setTimeout(function(){
      location.reload();  
    },2000);
    */
    this.setScannedCount() ; 
    this.isScanning = false;
    this.disableAllButtons = false;


  }
  OnHttpUploadFailure(errorCode, errorString, sHttpResponse) {
    this.alertService.error(errorString);
    //alert(errorString + sHttpResponse);
    this.isScanning = false;
    this.disableAllButtons = false;
  }


}