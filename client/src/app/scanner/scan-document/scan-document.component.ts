import { Component, OnInit } from '@angular/core';
import { SUCCESS_CODE, FAILURE_CODE } from '../../helpers/constants'
import { ActivatedRoute } from '@angular/router';
import { ScannerService } from '../../services/scanner.service';
import { AlertService, AuthenticationService } from '../../services';
import { unescape } from 'querystring';
import { environment } from '../../../environments/environment';
import Dynamsoft from 'dwt';
import { WebTwain } from 'dwt/WebTwain';

@Component({
  selector: 'app-scan-document',
  templateUrl: './scan-document.component.html',
  styleUrls: ['./scan-document.component.css']
})
export class ScanDocumentComponent implements OnInit {

  DWObject: WebTwain;
  selectSources: HTMLSelectElement;
  containerId = 'dwtcontrolContainer';
  bWASM = Dynamsoft.Lib.env.bMobile || Dynamsoft.WebTwainEnv.UseLocalService;
  title = 'Scan Document';
  examcode: any;
  message: string;
  scannerSummaryData: any;
  disableAllButtons: any;
  isScanning: boolean;
  numberofsupplimentaries: any;
  rollnumber: any;


  constructor(private _Activatedroute: ActivatedRoute, private scannerService: ScannerService, private alertService: AlertService, private authenctationService: AuthenticationService) {
    this.OnHttpUploadSuccess = this.OnHttpUploadSuccess.bind(this);
  }


  ngOnInit() {
    this.disableAllButtons = false;
    this.message = "Please place your documents in the scanner and click the 'Scan Document' button";
    this.examcode = this._Activatedroute.snapshot.paramMap.get("examcode");

    // Dynamsoft.default.WebTwainEnv.AutoLoad = false;
    // Dynamsoft.default.WebTwainEnv.Containers = [{ WebTwainId:'dwtcontrolContainer' , ContainerId: 'dwtcontrolContainer', Width: '100%', Height: '100%' }];
    // Dynamsoft.default.WebTwainEnv.RegisterEvent('OnWebTwainReady', () => { this.Dynamsoft_OnReady(); });
    /**
     * In order to use the full version, do the following
     * 1. Change Dynamsoft.default.WebTwainEnv.Trial to false
     * 2. Replace A-Valid-Product-Key with a full version key
     * 3. Change Dynamsoft.default.WebTwainEnv.ResourcesPath to point to the full version 
     *    resource files that you obtain after purchasing a key
     */
    //Dynamsoft.default.WebTwainEnv.Trial = true;
    //Dynamsoft.default.WebTwainEnv.ProductKey = "t0068UwAAAFuGVxYuHUpzk5J3Tt3zblNQMsn1OpOFqQodE+HXMWzTuhW6NBnIypP8un+KenPrO6Eqw3DcSnZ9il7hstL/sYY=";
    //Dynamsoft.default.WebTwainEnv.ProductKey = "t0138cQMAAJcMDa31CdoMBwZI7nOl/5Bcfvgh+tsAjk9LgmtHGYod3rMm6Ag84U8D3vSyz5JGbDufWmtag0gEpttIAP2LxrGb2brQ1kyYzBwNDL231m7sj9n051/qzFkKLhQbJozFRsI8hPf3ijjzbZgwFhsJ8yQyn03XaMIwYSw2gndjKAUm/AK/TqoE";
    //Dynamsoft.default.WebTwainEnv.ProductKey = "t0140lQMAAB/eePgtZRMeSx4xqk37kLkhHgl1vP+mCtiybjAKuK7cJKPTAzZbrWCL0UKKtSSVH3Mll94bUt6mvqa9NIBsdV2fzD6EvpsJk5mjgaH3VxvG/phdf/ZSZ8624kaxYcJYbCTMQ3i7V8SZP4YJY7GRME8i89V0jSYME8ZiI4iNOqahlFqVLxB7sfo=" ;

    // Dynamsoft.default.WebTwainEnv.ProductKey = "t0068MgAAAD2O6ttiwad2ydEavAGruJNPqDthsaAPqW45N+523bkhT5XQ5qwpEQxiPRgkuaCjx+M0kExGSvjIvNtC/N6e7sY=" ;
    // Dynamsoft.default.WebTwainEnv.ResourcesPath = environment.Dynamsoft.resourcesPath;
    // Dynamsoft.default.WebTwainEnv.Load();

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

      this.initializeDWT() ;
  }


  initializeDWT() {
    Dynamsoft.WebTwainEnv.Containers = [{ WebTwainId: 'dwtObject', ContainerId: this.containerId, Width: '100%', Height: '100%' }];
    Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', () => { this.Dynamsoft_OnReady(); });
    Dynamsoft.WebTwainEnv.ProductKey = "t0068MgAAAD2O6ttiwad2ydEavAGruJNPqDthsaAPqW45N+523bkhT5XQ5qwpEQxiPRgkuaCjx+M0kExGSvjIvNtC/N6e7sY=" ;
    Dynamsoft.WebTwainEnv.ResourcesPath = '/assets/dwt-resources';
    let checkScript = () => {
      if (Dynamsoft.Lib.detect.scriptLoaded) {
        this.modulizeInstallJS();
        Dynamsoft.WebTwainEnv.Load();
      } else {
        setTimeout(() => checkScript(), 100);
      }
    };
    checkScript();
  }
  Dynamsoft_OnReady(): void {
    // this.DWObject = Dynamsoft.default.WebTwainEnv.GetWebTwain('dwtcontrolContainer');
    // let count = this.DWObject.SourceCount;
    // this.selectSources = <HTMLSelectElement>document.getElementById("sources");
    // this.selectSources.options.length = 0;
    // for (let i = 0; i < count; i++) {
    //   this.selectSources.options.add(new Option(this.DWObject.GetSourceNameItems(i), i.toString()));
    // }

    this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain(this.containerId);
    if (this.bWASM) {
      this.DWObject.MouseShape = true;
      this.createInputForWASM();
    } else {
      let count = this.DWObject.SourceCount;
      this.selectSources = <HTMLSelectElement>document.getElementById("sources");
      this.selectSources.options.length = 0;
      for (let i = 0; i < count; i++) {
        this.selectSources.options.add(new Option(this.DWObject.GetSourceNameItems(i), i.toString()));
      }
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


      /************************************************************* *
      this.DWObject.IfAutoFeed = true;
      this.DWObject.IfFeederEnabled = true;

      this.DWObject.SelectSource();
      this.DWObject.OpenSource();
      this.DWObject.IfShowUI = false;
      this.DWObject.ProductKey = 't0100DQEAAIl7pqCzooFPgPWe94RmD2ljCkixmOZ2vjnXy0PpwO/Sn+5lv0zO5+2Cbm5BeU8HpOknPoel2UAsZ1wQg8KMHU4pMD02g928efjnjhYgL0s6Y1PlMd+Zu4i23NoB0o83Lw==';
      //Dynamsoft.default.WebTwainEnv.ProductKey = "t0100DQEAAIl7pqCzooFPgPWe94RmD2ljCkixmOZ2vjnXy0PpwO/Sn+5lv0zO5+2Cbm5BeU8HpOknPoel2UAsZ1wQg8KMHU4pMD02g928efjnjhYgL0s6Y1PlMd+Zu4i23NoB0o83Lw==" ;
      this.DWObject.AcquireImage();
      *******************************************************************/

      /*

      if (this.DWObject.SourceCount > 0 && this.DWObject.SelectSourceByIndex(this.selectSources.selectedIndex)) {
        const onAcquireImageSuccess = () => { this.DWObject.CloseSource(); };
        const onAcquireImageFailure = onAcquireImageSuccess;
        this.DWObject.OpenSource();
        this.DWObject.AcquireImage({}, onAcquireImageSuccess, onAcquireImageFailure);
      } else {
        alert("No Source Available!");
      }
      this.disableAllButtons=false ; 
      */

      if (!this.DWObject)
        this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain();
      if (this.bWASM) {
        if (document.getElementById(this.containerId + "-fileInput")) {
          (<HTMLInputElement>document.getElementById(this.containerId + "-fileInput")).value = "";
          document.getElementById(this.containerId + "-fileInput").click();
        } else {
          this.createInputForWASM().then(_ => {
            if (document.getElementById(this.containerId + "-fileInput")) {
              (<HTMLInputElement>document.getElementById(this.containerId + "-fileInput")).value = "";
              document.getElementById(this.containerId + "-fileInput").click();
            }
          });
        }
      }
      else if (this.DWObject.SourceCount > 0 && this.DWObject.SelectSourceByIndex(this.selectSources.selectedIndex)) {
        const onAcquireImageSuccess = () => { this.DWObject.CloseSource(); };
        const onAcquireImageFailure = onAcquireImageSuccess;
        this.DWObject.OpenSource();
        this.DWObject.AcquireImage({}, onAcquireImageSuccess, onAcquireImageFailure);
      } else {
        alert("No Source Available!");
      }

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
    this.DWObject.HTTPPort = 80;
    var authToken = this.authenctationService.getHeaderToken();
    this.DWObject.SetHTTPHeader("Authorization", authToken.Authorization);
    this.DWObject.SetHTTPFormField("examcode", this.examcode);
    this.DWObject.SetHTTPFormField("rollnumber", this.rollnumber);
    this.DWObject.SetHTTPFormField("numberofsupplimentaries", this.numberofsupplimentaries);
    //this.DWObject.SetHTTPFormField("DocumentType", "Invoice");

    // Upload all the images in Dynamic Web TWAIN viewer to the HTTP server as a PDF file asynchronously
    try {
      this.DWObject.HTTPUploadAllThroughPostAsPDF(
        environment.apiURL,
        '/api/v1/scanner/uploadscan',
        "imageData.pdf",
        this.OnHttpUploadSuccess,
        this.OnHttpUploadFailure.bind(this)
      )
    }
    catch (ex) {
      console.log("error occurred --------------------------------------" + ex);
    }
  }

  setScannedCount() {
    if (this.scannerSummaryData.scannedcopies == "") {
      this.scannerSummaryData.scannedcopies = 0;
    }
    this.scannerSummaryData.scannedcopies = this.scannerSummaryData.scannedcopies + 1
  }

  OnHttpUploadSuccess() {

    //this.DWObject.ClearAllHTTPFormField(); // Clear all fields first
    //this.alertService.success("Document uploaded successfully, Ready for Next Scanning ; ") ;


  }
  OnHttpUploadFailure(errorCode, errorString, sHttpResponse) {
    let responseObject = JSON.parse(sHttpResponse);
    if (responseObject && responseObject.code == SUCCESS_CODE) {
      this.alertService.success("Document uploaded successfully, Ready for Next Scanning. ");
      this.numberofsupplimentaries = 0;
      this.rollnumber = "";
      this.DWObject.RemoveAllImages();

      this.setScannedCount();
      this.isScanning = false;
      this.disableAllButtons = false;
    }
    else {
      this.alertService.error("Error in uploading the documents." + responseObject.message);
      this.DWObject.RemoveAllImages();
      this.isScanning = false;
      this.disableAllButtons = false;
    }

  }


  openImage(): void {


    if (!this.rollnumber || this.rollnumber == "") {
      this.alertService.error("Roll number cannot be blank");
      return;
    }
    if (!this.DWObject)
      this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');
    this.DWObject.IfShowFileDialog = true;
    /**
     * Note, this following line of code uses the PDF Rasterizer which is an extra add-on that is licensed seperately
     */
    this.DWObject.Addon.PDF.SetConvertMode(Dynamsoft.EnumDWT_ConvertMode.CM_RENDERALL);
    this.DWObject.LoadImageEx("", Dynamsoft.EnumDWT_ImageType.IT_ALL,
      () => {
        console.log("Image Loaded Successfully") ;
      }, () => {
        console.log("Image Load Failed") ;
      });
  }
  /**
   * Workaround on making a input for WASM mode.
   */
  createInputForWASM(): Promise<any> {
    return new Promise((res, rej) => {
      try {
        let WASMInput = document.createElement("input");
        WASMInput.style.position = "fixed";
        WASMInput.style.top = "-1000px";
        WASMInput.setAttribute("multiple", "multiple");
        WASMInput.setAttribute("id", this.containerId + "-fileInput");
        WASMInput.setAttribute("type", "file");
        WASMInput.onclick = _ => {
          let filters = [], filter = "";
          filters.push("image/jpeg");
          filters.push("image/png");
          filters.push("image/tiff");
          filters.push("application/pdf");
          if (filters.length > 0) {
            filter = filters.join(",");
          }
          WASMInput.setAttribute("accept", filter);
        }
        WASMInput.onchange = evt => {
          let _input = <HTMLInputElement>evt.target;
          let files = _input.files;
          for (let i = 0; i < files.length; i++) {
            this.DWObject.LoadImageFromBinary(files[i], () => { console.log('Successful!'); }, (errCode, errString) => { alert(errString); })
          }
        };
        document.getElementById('container').appendChild(WASMInput);
        res(true);
      } catch (err) {
        rej(err);
      }
    });
  }
  /**
   * To make dynamsoft.webtwain.install.js compatible with Angular
   */
  modulizeInstallJS() {
    let _DWT_Reconnect = (<any>window).DWT_Reconnect;
    (<any>window).DWT_Reconnect = (...args) => _DWT_Reconnect.call({ Dynamsoft: Dynamsoft }, ...args);
    let __show_install_dialog = (<any>window)._show_install_dialog;
    (<any>window)._show_install_dialog = (...args) => __show_install_dialog.call({ Dynamsoft: Dynamsoft }, ...args);
    let _OnWebTwainOldPluginNotAllowedCallback = (<any>window).OnWebTwainOldPluginNotAllowedCallback;
    (<any>window).OnWebTwainOldPluginNotAllowedCallback = (...args) => _OnWebTwainOldPluginNotAllowedCallback.call({ Dynamsoft: Dynamsoft }, ...args);
    let _OnWebTwainNeedUpgradeCallback = (<any>window).OnWebTwainNeedUpgradeCallback;
    (<any>window).OnWebTwainNeedUpgradeCallback = (...args) => _OnWebTwainNeedUpgradeCallback.call({ Dynamsoft: Dynamsoft }, ...args);
    let _OnWebTwainPreExecuteCallback = (<any>window).OnWebTwainPreExecuteCallback;
    (<any>window).OnWebTwainPreExecuteCallback = (...args) => _OnWebTwainPreExecuteCallback.call({ Dynamsoft: Dynamsoft }, ...args);
    let _OnWebTwainPostExecuteCallback = (<any>window).OnWebTwainPostExecuteCallback;
    (<any>window).OnWebTwainPostExecuteCallback = (...args) => _OnWebTwainPostExecuteCallback.call({ Dynamsoft: Dynamsoft }, ...args);
    let _OnRemoteWebTwainNotFoundCallback = (<any>window).OnRemoteWebTwainNotFoundCallback;
    (<any>window).OnRemoteWebTwainNotFoundCallback = (...args) => _OnRemoteWebTwainNotFoundCallback.call({ Dynamsoft: Dynamsoft }, ...args);
    let _OnRemoteWebTwainNeedUpgradeCallback = (<any>window).OnRemoteWebTwainNeedUpgradeCallback;
    (<any>window).OnRemoteWebTwainNeedUpgradeCallback = (...args) => _OnRemoteWebTwainNeedUpgradeCallback.call({ Dynamsoft: Dynamsoft }, ...args);
    let _OnWebTWAINDllDownloadFailure = (<any>window).OnWebTWAINDllDownloadFailure;
    (<any>window).OnWebTWAINDllDownloadFailure = (...args) => _OnWebTWAINDllDownloadFailure.call({ Dynamsoft: Dynamsoft }, ...args);
  }

}