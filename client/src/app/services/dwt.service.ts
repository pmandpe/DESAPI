import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment'
import Dynamsoft from 'dwt';
import { DWTInitialConfig } from 'dwt/Dynamsoft';
import { DynamsoftEnums } from 'dwt/Dynamsoft.Enum';
import { WebTwain } from 'dwt/WebTwain';
import { DeviceConfiguration, ScanSetup } from 'dwt/WebTwain.Acquire';
import { RuntimeSettings, TextResults, TextResult } from 'dwt/Addon.BarcodeReader';

@Injectable({
  providedIn: 'root'
})

export class DwtService {
  barcodeSubject: Subject<any> = new Subject<any>();
  bufferSubject: Subject<string> = new Subject<string>();
  generalSubject: Subject<any> = new Subject<any>();
  /**
   * WebTwain objects
   */
  protected _DWObject: WebTwain = null;
  protected _DWObjectEx: WebTwain = null;
  /**
   * Global environment that is detected by the dwt library.
   */
  public runningEnvironment = Dynamsoft.Lib.env;
  /**
   * UseService only makes sense on desktop OS (Windows, macOS, Linux)
   */
  public bUseService = false;
  /**
   * bWASM is for WASM mode which is opposed to the Service mode.
   * WASM mode could both be on desktop or mobile
   */
  public bWASM: boolean = false;
  /**
   * Scan
   */
  protected _scannersCount: number;
  public devices: Device[] = [];
  public _selectedDevice: string = "";
  /**
   * Camera
   */
  protected _useCamera: boolean;
  public bCameraAddonUsable: boolean = false;
  public cameraOptions = [];
  /**
   * Barcode
   */
  public barcodeResults = [];
  public barcodeRects = { imageIds: [], rects: [] };
  /**
   * OCR
   */
  public ocrResultBase64Strings: string[] = [];
  public OCRLanguages = [
    { desc: "Arabic", val: "ara" },
    { desc: "Bengali", val: "ben" },
    { desc: "Chinese_Simplified", val: "chi_sim" },
    { desc: "Chinese_Traditional", val: "chi_tra" },
    { desc: "English", val: "eng", selected: true },
    { desc: "French", val: "fra" },
    { desc: "German", val: "deu" },
    { desc: "Hindi", val: "hin" },
    { desc: "Indonesian", val: "ind" },
    { desc: "Italian", val: "ita" },
    { desc: "Japanese", val: "jpn" },
    { desc: "Javanese", val: "jav" },
    { desc: "Korean", val: "kor" },
    { desc: "Malay", val: "msa" },
    { desc: "Marathi", val: "mar" },
    { desc: "Panjabi", val: "pan" },
    { desc: "Persian", val: "fas" },
    { desc: "Portuguese", val: "por" },
    { desc: "Russian", val: "rus" },
    { desc: "Spanish", val: "spa" },
    { desc: "Swahili", val: "swa" },
    { desc: "Tamil", val: "tam" },
    { desc: "Telugu", val: "tel" },
    { desc: "Thai", val: "tha" },
    { desc: "Turkish", val: "tur" },
    { desc: "Vietnamese", val: "vie" },
    { desc: "Urdu", val: "urd" }
  ];
  public OCROutputFormats = [
    { desc: "STRING", val: 0 },
    { desc: "Text PDF", val: 1 },
    { desc: "Image-over-text PDF", val: 2 }
  ];
  /**
   * Save
   */
  private fileSavingPath = "C:";
  private fileActualName = "";

  constructor() {
    /**
     * ResourcesPath & ProductKey must be set in order to use the library!
     */
    Dynamsoft.WebTwainEnv.ResourcesPath = environment.Dynamsoft.resourcesPath;
    Dynamsoft.WebTwainEnv.ProductKey = environment.Dynamsoft.dwtProductKey;
    /**
     * ConnectToTheService is overwritten here for smoother install process.
     */
    Dynamsoft.WebTwainEnv.ConnectToTheService = () => {
      this.mountDWT();
    };
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
  mountDWT(UseService?: boolean): Promise<any> {
    this._DWObject = null;
    return new Promise((res, rej) => {
      let dwtInitialConfig: DWTInitialConfig = {
        WebTwainId: "dwtObject"
      };
      /**
       * [Why checkScript()?]
       * Dynamic Web TWAIN relies on a few extra scripts to work correct.
       * Therefore we must make sure these files are ready before creating a WebTwain instance.
       */
      let checkScript = () => {
        if (Dynamsoft.Lib.detect.scriptLoaded) {
          this.modulizeInstallJS();
          if (UseService !== undefined)
            Dynamsoft.WebTwainEnv.UseLocalService = UseService;
          else {
            Dynamsoft.WebTwainEnv.UseLocalService = this.bUseService;
          }
          this.bWASM = this.runningEnvironment.bMobile || !Dynamsoft.WebTwainEnv.UseLocalService;
          /**
           * The Camera Addon only works for Service mode on Desktop at present (dwt@16.0.0)
           */
          this.bCameraAddonUsable = !this.bWASM && this.runningEnvironment.bWin;
          Dynamsoft.WebTwainEnv.CreateDWTObjectEx(
            dwtInitialConfig,
            (_DWObject) => {
              this._DWObject = _DWObject;
              /**
               * The event OnBitmapChanged is used here for monitoring the image buffer.
               */
              this._DWObject.RegisterEvent("OnBitmapChanged", (changedIndexArray, operationType, changedIndex, imagesCount) => {
                switch (operationType) {
                  /** reserved space
                   * type: 1-Append(after index), 2-Insert(before index), 3-Remove, 4-Edit(Replace), 5-Index Change
                   */
                  case 1: break;
                  case 2: break;
                  case 3: break;
                  case 4: break;
                  case 5: break;
                  default: break;
                }
                this.bufferSubject.next("changed");
                if (this._DWObject.HowManyImagesInBuffer === 0)
                  this.bufferSubject.next("empty");
                else
                  this.bufferSubject.next("filled");
              });
              res(_DWObject);
            },
            (errorString) => {
              rej(errorString);
            }
          );
        } else {
          setTimeout(() => checkScript(), 100);
        }
      };
      checkScript();
    });
  }
  /**
   * Create an extra WebTwain instance _DWObjectEx
   * This is used solely for displaying & capturing from a video stream.
   */
  mountVideoContainer(): Promise<any> {
    this._DWObjectEx = null;
    return new Promise((res, rej) => {
      if (this._DWObject) {
        let dwtInitialConfig: DWTInitialConfig = {
          WebTwainId: "videoContainer"
        };
        Dynamsoft.WebTwainEnv.CreateDWTObjectEx(
          dwtInitialConfig,
          (_container) => {
            this._DWObjectEx = _container;
            res(_container);
          },
          (errorString) => {
            rej(errorString);
          }
        );
      } else {
        rej("Please call mountDWT first!");
      }
    });
  }
  /**
   * Removes the extra WebTwain instance. Optional.
   */
  unMountVideoContainer(): Promise<any> {
    return new Promise((res, rej) => {
      if (Dynamsoft.WebTwainEnv.DeleteDWTObject("videoContainer"))
        res(true);
      else
        rej(false);
    });
  }
  /**
   * Retrieve all devices (scanners + cameras).
   */
  getDevices() {
    let _dwt = this._DWObject;
    if (this._DWObjectEx)
      _dwt = this._DWObjectEx;
    this.devices = [];
    let _scanners = <string[]>this._DWObject.GetSourceNames();
    for (let i = 0; i < _scanners.length; i++) {
      this.devices.push({ name: (i + 1).toString() + "." + _scanners[i], realName: _scanners[i], type: "scanner" });
    }
    this._scannersCount = this.devices.length;
    let _cameras = _dwt.Addon.Webcam.GetSourceList();
    for (let i = 0; i < _cameras.length; i++) {
      this.devices.push({ name: (i + 1).toString() + "." + _cameras[i], realName: _cameras[i], type: "camera" });
    }
    return this.devices;
  }
  /**
   * Retrieve detailed information of the devices.
   */
  getDeviceDetails() {
    return this._DWObject.GetSourceNames(true);
  }
  /**
   * Select a scanner or camera by name.
   * @param name the name of the device
   */
  selectADevice(name: string): Promise<boolean> {
    return new Promise((res, rej) => {
      this._selectedDevice = "";
      this._useCamera = false;
      if (this.devices.length === 0)
        rej(false);
      this.devices.forEach((value, index) => {
        if (value && value.name === name) {
          if (index > this._scannersCount - 1) {
            let _dwt = this._DWObject;
            if (this._DWObjectEx)
              _dwt = this._DWObjectEx;
            _dwt.Addon.Webcam.StopVideo();
            if (_dwt.Addon.Webcam.SelectSource(value.realName)) {
              this._selectedDevice = name;
              this._useCamera = true;
              this.updateCameraValues(_dwt);
            }
            else {
              rej("Can't use the Webcam " + name + ", please make sure it's not in use!")
            }
          }
          else {
            if (this._DWObject.SelectSourceByIndex(index)) {
              this._selectedDevice = name;
            }
          }
        }
      });
      if (this._selectedDevice !== "") {
        this.generalSubject.next({ type: "deviceName", deviceName: this._selectedDevice });
        res(true);
      }
      else
        res(false);
    });
  }
  /**
   * Retrieve detailed camera capabilities.
   * @param _dwt The WebTwain instance.
   */
  updateCameraValues(_dwt: WebTwain) {
    let mediaTypes = _dwt.Addon.Webcam.GetMediaType(),
      _mediaTypes = [],
      _currentmT = mediaTypes.GetCurrent();
    let frameRates = _dwt.Addon.Webcam.GetFrameRate(),
      _frameRates = [],
      _currentfR = frameRates.GetCurrent();
    let resolutions = _dwt.Addon.Webcam.GetResolution(),
      _resolutions = [],
      _currentRes = resolutions.GetCurrent();
    let _advancedSettings = [],
      _advancedCameraSettings = [];
    for (let i = 0; i < mediaTypes.GetCount(); i++) {
      mediaTypes.Get(i) === _currentmT
        ? _mediaTypes[i] = { value: mediaTypes.Get(i).toString(), checked: true }
        : _mediaTypes[i] = { value: mediaTypes.Get(i).toString(), checked: false };
    }
    for (let i = 0; i < frameRates.GetCount(); i++) {
      frameRates.Get(i) === _currentfR
        ? _frameRates[i] = { value: frameRates.Get(i).toString(), checked: true }
        : _frameRates[i] = { value: frameRates.Get(i).toString(), checked: false };
    }
    for (let i = 0; i < resolutions.GetCount(); i++) {
      resolutions.Get(i) === _currentRes
        ? _resolutions[i] = { value: resolutions.Get(i).toString(), checked: true }
        : _resolutions[i] = { value: resolutions.Get(i).toString(), checked: false };
    }
    _advancedSettings = Object.keys(Dynamsoft.EnumDWT_VideoProperty).map((_value) => { return { value: _value.substr(3) } });
    for (let i = 0; i < _advancedSettings.length; i++) {
      _advancedSettings[i].checked = false;
    }
    _advancedSettings[0].checked = true;
    _advancedCameraSettings = Object.keys(Dynamsoft.EnumDWT_CameraControlProperty).map((_value) => { return { value: _value.substr(4) } });
    for (let i = 0; i < _advancedCameraSettings.length; i++) {
      _advancedCameraSettings[i].checked = false;
    }
    _advancedCameraSettings[0].checked = true;
    this.cameraOptions = [{
      name: "Media Type",
      items: _mediaTypes,
      current: false
    }, {
      name: "Frame Rate",
      items: _frameRates,
      current: false
    }, {
      name: "Resolution",
      items: _resolutions,
      current: true
    }, {
      name: "Video Setup",
      items: _advancedSettings,
      current: false
    }, {
      name: "Camera Setup",
      items: _advancedCameraSettings,
      current: false
    }];
    this.cameraOptions["type"] = "cameraOptions";
    this.generalSubject.next(this.cameraOptions);
  }
  /**
   * Acquire images (scanner or camera).
   * @param config Configuration for image aquisition.
   */
  acquire(config?: DeviceConfiguration | ScanSetup, bAdvanced?: boolean): Promise<any> {
    return new Promise((res, rej) => {
      if (this._selectedDevice !== "") {
        if (this._useCamera) {
          if (this._DWObjectEx) {
            this._DWObjectEx.Addon.Webcam.CaptureImage(() => {
              this.getBlob([0], Dynamsoft.EnumDWT_ImageType.IT_PNG, this._DWObjectEx)
                .then(blob => this._DWObject.LoadImageFromBinary(blob, () => {
                  this._DWObjectEx.RemoveImage(0);
                  res(true);
                }, (errCode, errString) => rej(errString)));
            }, (errCode, errStr) => rej(errStr));
          } else {
            rej("No WebTwain instanance for camera capture!");
          }
        } else {
          this._DWObject.SetOpenSourceTimeout(3000);
          if (this._DWObject.OpenSource()) {
            if (bAdvanced) {
              this._DWObject.startScan(<ScanSetup>config);
            } else {
              this._DWObject.AcquireImage(<DeviceConfiguration>config, () => {
                this._DWObject.CloseSource();
                this._DWObject.CloseWorkingProcess();
                res(true);
              }, (errCode, errString) => {
                rej(errString);
              });
            }
          } else {
            rej(this._DWObject.ErrorString);
          }
        }
      } else {
        rej("Please select a device first!");
      }
    });
  }
  /**
   * Load images by opending a file dialog (either with built-in feature or use a INPUT element).
   * @param files Files to load.
   */
  load(files?: FileList): Promise<any> {
    return new Promise((res, rej) => {
      this._DWObject.Addon.PDF.SetConvertMode(Dynamsoft.EnumDWT_ConvertMode.CM_DEFAULT);
      this._DWObject.Addon.PDF.SetResolution(200);
      if (this.bWASM && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          this._DWObject.LoadImageFromBinary(files[i], () => { res(true); }, (errCode, errString) => { rej(errString); })
        }
      } else {
        let filter = "BMP,TIF,JPG,PNG,PDF|*.bmp;*.tif;*.png;*.jpg;*.pdf;*.tiff;*.jpeg";
        if (Dynamsoft.Lib.env.bMac)
          filter = "TIF,TIFF,JPG,JPEG,PNG,PDF";
        this._DWObject.IfShowFileDialog = true;
        this._DWObject.RegisterEvent("OnPostLoad", (
          directory: string,
          fileName: string,
          fileType: DynamsoftEnums.EnumDWT_ImageType) => {
        });
        this._DWObject.RegisterEvent("OnGetFilePath", (isSave, filesCount, index, directory, fileName) => {
          if (index === filesCount - 1)
            this._DWObject.LoadImage(directory + "\\" + fileName, () => { res(true); }, (errCode, errStr) => rej(errStr));
          else
            this._DWObject.LoadImage(directory + "\\" + fileName, () => { }, (errCode, errStr) => rej(errStr));
        });
        this._DWObject.ShowFileDialog(false, filter, 0, "", "", true, false, 0);
      }
    });
  }
  /**
   * Filter zones for the current image.
   * @param zones Original zones.
   */
  filterZones(index: number, zones: Zone[]): Zone[] {
    if (zones !== undefined && zones.length > 0) {
      for (let i = 0; i < zones.length; i++) {
        if (zones[i].index !== index)
          zones.splice(i, 1);
      }
      return zones;
    }
    return [];
  }
  /**
   * Read barcode off the current image.
   * @param config Configuration for the read.
   */
  readBarcode(config?: any) {
    let _index = this._DWObject.CurrentImageIndexInBuffer;
    if (config && config.index !== undefined) {
      _index = Math.floor(config.index);
      if (_index < 0 || _index > this._DWObject.HowManyImagesInBuffer - 1)
        _index = this._DWObject.CurrentImageIndexInBuffer;
    }
    Dynamsoft.Lib.showMask();
    this._DWObject.Addon.BarcodeReader.getRuntimeSettings()
      .then(settings => {
        if (this._DWObject.GetImageBitDepth(_index) === 1) {
          settings.scaleDownThreshold = 214748347;
        } else {
          settings.scaleDownThreshold = 2300;
        }
        settings.barcodeFormatIds = Dynamsoft.EnumBarcodeFormat.BF_ALL;
        if (config) {
          if (config.formatId) {
            settings.barcodeFormatIds = config.formatId;
          }
          if (config.formatId2) {
            settings.barcodeFormatIds_2 = config.formatId2;
          }
          if (config.zones)
            config.zones = this.filterZones(_index, config.zones);
        }
        // Clear old results before reading again
        this.barcodeResults = [];
        settings.region.regionMeasuredByPercentage = 0;

        if (config && config.zones && config.zones.length > 0) {
          let i = 0;
          let readBarcodeFromRect = () => {
            i++;
            settings.region.regionLeft = config.zones[i].x;
            settings.region.regionTop = config.zones[i].y;
            settings.region.regionRight = config.zones[i].x + config.zones[i].width;
            settings.region.regionBottom = config.zones[i].y + config.zones[i].height;
            if (i === config.zones.length - 1)
              this.doReadBarode(_index, settings, null);
            else
              this.doReadBarode(_index, settings, readBarcodeFromRect);
          }
          settings.region.regionLeft = config.zones[0].x;
          settings.region.regionTop = config.zones[0].y;
          settings.region.regionRight = config.zones[0].x + config.zones[0].width;
          settings.region.regionBottom = config.zones[0].y + config.zones[0].height;
          if (config.zones.length === 1)
            this.doReadBarode(_index, settings, null);
          else
            this.doReadBarode(_index, settings, readBarcodeFromRect);
        }
        else {
          settings.region.regionLeft = 0;
          settings.region.regionTop = 0;
          settings.region.regionRight = 0;
          settings.region.regionBottom = 0;
          this.doReadBarode(_index, settings, null);
        }
      });
  }
  /**
   * Actual barcode reading...
   * @param index The index of the image to read.
   * @param settings RuntimeSettings for the read.
   * @param callback Callback for the read.
   */
  doReadBarode(index: number, settings: RuntimeSettings, callback: () => void) {
    let bHasCallback = !!callback;
    let outputResults = () => {
      let resultString = [];
      if (this.barcodeResults.length === 0) {
        resultString.push({ text: "--------------------------", type: "seperator" });
        resultString.push({ text: "Nothing found on the image!", type: "important" });
        this.barcodeSubject.next(resultString);
      } else {
        let allBarcodeResults: TextResults = [];
        for (let j = 0; j < this.barcodeResults.length; j++) {
          allBarcodeResults = allBarcodeResults.concat(this.barcodeResults[j]);
        }
        resultString.push({ text: "--------------------------", type: "seperator" });
        resultString.push({ text: "Total barcode(s) found: " + allBarcodeResults.length, type: "important" });
        for (let i = 0; i < allBarcodeResults.length; ++i) {
          let result: TextResult = allBarcodeResults[i];
          resultString.push({ text: "------------------", type: "seperator" });
          resultString.push({ text: "Barcode " + (i + 1).toString(), type: "nomral" });
          resultString.push({ text: "Type: " + (result.barcodeFormatString ? result.barcodeFormatString : result.barcodeFormatString_2), type: "nomral" });
          resultString.push({ text: "Value: " + result.barcodeText, type: "important" });
        }
        this.returnBarcodeRects();
        this.barcodeSubject.next(resultString);
      }
      this.barcodeSubject.next({ done: true });
      Dynamsoft.Lib.hideMask();
    };
    this._DWObject.Addon.BarcodeReader.updateRuntimeSettings(settings)
      .then(_ => {
        let decoderFunc = () => {
          try {
            this._DWObject.Addon.BarcodeReader.decode(index)
              .then(textResults => {
                this.barcodeResults.push(textResults);
                bHasCallback ? callback() : outputResults();
              }, error => {
                console.log(error);
                bHasCallback ? callback() : outputResults();
              });
          } catch (err) { console.log(err); setTimeout(() => { decoderFunc() }, 1000); }
        }
        decoderFunc();
      });
  }
  /**
   * Calculate and return the rects of the barcodes (coordinates to indicate where they are located).
   */
  returnBarcodeRects() {
    this.barcodeRects = { imageIds: [], rects: [] };
    let results = this.barcodeResults;
    for (let j = 0; j < results.length; j++) {
      let eachBarcodeResults: TextResults = results[j];
      let existingIndex = -1;
      for (let k = 0; k < this.barcodeRects.imageIds.length; k++) {
        if (this.barcodeRects.imageIds[k] === eachBarcodeResults.imageid) {
          existingIndex = k;
          break;
        }
      }
      let tempRects = [];
      for (let i = 0; i < eachBarcodeResults.length; ++i) {
        let result = eachBarcodeResults[i];
        let loc = result.localizationResult;
        let left = Math.min(loc.x1, loc.x2, loc.x3, loc.x4);
        let top = Math.min(loc.y1, loc.y2, loc.y3, loc.y4);
        let right = Math.max(loc.x1, loc.x2, loc.x3, loc.x4);
        let bottom = Math.max(loc.y1, loc.y2, loc.y3, loc.y4);
        tempRects.push({ x: left, y: top, w: right - left, h: bottom - top });
      }
      if (existingIndex === -1) {
        this.barcodeRects.imageIds.push(eachBarcodeResults.imageid);
        this.barcodeRects.rects.push(tempRects);
      } else {
        this.barcodeRects.rects[existingIndex] = this.barcodeRects.rects[existingIndex].concat(tempRects);
      }
    }
    this.barcodeSubject.next(this.barcodeRects);
  }
  /**
   * loadOCRModule & downloadOCRBasic prepare resources for the OCR module.
   */
  loadOCRModule(): Promise<any> {
    return new Promise((res, rej) => {
      if (Dynamsoft.Lib.product.bHTML5Edition) {
        if (this._DWObject.Addon.OCR.IsModuleInstalled()) {
          this.downloadOCRBasic(false)
            .then(
              success =>
                res(success),
              error =>
                rej(error)
            );
        } else {
          this.downloadOCRBasic(true)
            .then(
              success =>
                res(success),
              error =>
                rej(error)
            );
        }
      }
      else {
        rej("OCR not supported in this environment!");
      }
    });
  }
  downloadOCRBasic(bDownloadDLL: boolean, langPath?: string): Promise<any> {
    return new Promise((res, rej) => {
      let strOCRPath = Dynamsoft.WebTwainEnv.ResourcesPath + "/addon/OCRx64.zip";
      let strOCRLangPath = Dynamsoft.WebTwainEnv.ResourcesPath + '/addon/OCRBasicLanguages/English.zip';
      if (langPath)
        strOCRLangPath = langPath;
      if (bDownloadDLL) {
        this._DWObject.Addon.OCR.Download(
          strOCRPath,
          () => this.downloadOCRBasic(false),
          (errorCode, errorString) => rej(errorString)
        );
      } else {
        this._DWObject.Addon.OCR.DownloadLangData(
          strOCRLangPath,
          () => res(true),
          (errorCode, errorString) => rej(errorString)
        );
      }
    });
  }
  /**
   * Prepararation for the OCR.
   * @param language The target language.
   * @param outputFormat The output format.
   * @param zones Zones to read.
   */
  ocr(language: DynamsoftEnums.EnumDWT_OCRLanguage | string, outputFormat: DynamsoftEnums.EnumDWT_OCROutputFormat, zones?: Zone[]): Promise<string> {
    let _index = this._DWObject.CurrentImageIndexInBuffer;
    if (zones) zones = this.filterZones(_index, zones);
    return new Promise((res, rej) => {
      this._DWObject.Addon.OCR.SetLanguage(language);
      this._DWObject.Addon.OCR.SetOutputFormat(outputFormat);
      let strOCRLangPath = Dynamsoft.WebTwainEnv.ResourcesPath + '/addon/OCRBasicLanguages/English.zip';
      for (let i = 0; i < this.OCRLanguages.length; i++) {
        if (this.OCRLanguages[i].val === language) {
          strOCRLangPath = Dynamsoft.WebTwainEnv.ResourcesPath + '/addon/OCRBasicLanguages/' + this.OCRLanguages[i].desc + '.zip';
        }
      }
      this.downloadOCRBasic(false)
        .then(
          () => {
            this.ocrResultBase64Strings = [];
            let i = 0;
            if (zones !== undefined && zones.length > 0) {
              let ocrCallback = (hasError: boolean, errStr?: string) => {
                if (hasError) {
                  rej(errStr);
                } else {
                  if (i === zones.length) {
                    res(this.processOCRResult());
                  } else {
                    this.doOCR(_index, zones[i], ocrCallback);
                    i++;
                  }
                }
              };
              ocrCallback(false);
            } else
              this.doOCR(_index, null, (hasError: boolean, errStr?: string) => {
                if (hasError) {
                  rej(errStr);
                } else
                  res(this.processOCRResult());
              });
          },
          err => rej(err)
        );
    });
  }
  /**
   * Actual OCR.
   * @param index Specify the image to read.
   * @param zone Specify a Zone.
   * @param callback Callback after the read.
   */
  doOCR(index: number, zone?: any, callback?: (...args) => void): any {
    if (!!zone && !!callback) {
      this._DWObject.Addon.OCR.RecognizeRect(
        index, zone.x, zone.y, zone.x + zone.width, zone.y + zone.height, (imageId, left, top, right, bottom, result) => {
          this.ocrResultBase64Strings.push(result.Get());
          callback(false);
        }, (errCode, errString) => callback(true, errString));
    } else if (this._DWObject.SelectedImagesIndices.length > 1) {
      this._DWObject.Addon.OCR.RecognizeSelectedImages((result) => {
        this.ocrResultBase64Strings.push(result.Get());
        callback(false);
      }, (errCode, errString) => callback(true, errString));
    }
    else {
      this._DWObject.Addon.OCR.Recognize(index,
        (imageId, result) => {
          this.ocrResultBase64Strings.push(result.Get());
          callback(false);
        }, (errCode, errString) => callback(true, errString));
    }
  }
  /**
   * Process OCR result.
   */
  processOCRResult(): Promise<any> {
    return new Promise((res, rej) => {
      if (this.ocrResultBase64Strings.length === 0)
        rej("No text found!");
      else {
        res(this.ocrResultBase64Strings.join(","));
      }
    });
  }
  /**
   * Convert image(s) to a Blob.
   * @param indices Specify the image(s).
   * @param type Specify the type of the Blob.
   * @param dwt Specify the WebTwain instance doing the job.
   */
  getBlob(indices: number[], type: DynamsoftEnums.EnumDWT_ImageType, dwt?: WebTwain): Promise<any> {
    return new Promise((res, rej) => {
      let _dwt = this._DWObject;
      if (dwt)
        _dwt = dwt;
      switch (type) {
        case Dynamsoft.EnumDWT_ImageType.IT_ALL:
          rej("Must specify an image type!"); break;
      }
      _dwt.ConvertToBlob(indices, type, (result, indices, type) => {
        res(result);
      }, (errCode, errString) => {
        rej(errString);
      });
    });
  }
  /**
   * Convert image(s) to a Base64 string.
   * @param indices Specify the image(s).
   * @param type Specify the type of the Base64 string.
   * @param dwt Specify the WebTwain instance doing the job.
   */
  getBase64(indices: number[], type: DynamsoftEnums.EnumDWT_ImageType, dwt?: WebTwain): Promise<any> {
    return new Promise((res, rej) => {
      let _dwt = this._DWObject;
      if (dwt)
        _dwt = dwt;
      if (type === Dynamsoft.EnumDWT_ImageType.IT_ALL)
        rej("Must specify an image type!");
      _dwt.ConvertToBase64(indices, type, (result, indices, type) => {
        let _result = result.getData(0, result.getLength());
        switch (type) {
          case 0:
            res("data:image/bmp;base64," + _result); break;
          case 1:
            res("data:image/jpeg;base64," + _result); break;
          case 2:
          case 8:
            res("data:image/tiff;base64," + _result); break;
          case 3:
            res("data:image/png;base64," + _result); break;
          case 4:
          case 7:
            res("data:application/pdf;base64," + _result); break;
          default:
            rej("Wrong image type!"); break;
        }
      }, (errCode, errString) => {
        rej(errString);
      });
    });
  }
  /**
   * Return the extention string of the specified image type.
   * @param type The image type (number).
   */
  getExtension(type: DynamsoftEnums.EnumDWT_ImageType) {
    switch (type) {
      case 0: return ".bmp";
      case 1: return ".jpg";
      case 2: case 8: return ".tif";
      case 3: return ".png";
      case 4: case 7: return ".pdf";
      default: return ".unknown";
    }
  }
  /**
   * Return the file filter for the save-file dialog based on the image type.
   * @param type The image type (number).
   */
  getDialogFilter(type: DynamsoftEnums.EnumDWT_ImageType): string {
    let filter = "BMP,TIF,JPG,PNG,PDF|*.bmp;*.tif;*.png;*.jpg;*.pdf;*.tiff;*.jpeg";
    switch (type) {
      case 0: filter = "BMP|*.bmp"; break;
      case 2: case 8: filter = "TIF|*.tif;*.tiff"; break;
      case 1: filter = "JPG|*.jpg;*.jpeg"; break;
      case 3: filter = "PNG|*.png"; break;
      case 4: case 7: filter = "PDF|*.pdf"; break;
      default: break;
    }
    if (this.runningEnvironment.bMac) {
      filter = "TIF,TIFF,JPG,JPEG,PNG,PDF";
      switch (type) {
        case 0: filter = "BMP"; break;
        case 2: case 8: filter = "TIF,TIFF"; break;
        case 1: filter = "JPG,JPEG"; break;
        case 3: filter = "PNG"; break;
        case 4: case 7: filter = "PDF"; break;
        default: break;
      }
    }
    return filter;
  }
  /**
   * Saved the specified images locally.
   * @param indices Specify the image(s).
   * @param type Specify the type of the target file.
   * @param fileName Specify the file name.
   * @param showDialog Specify whether to show a saving dialog.
   */
  saveLocally(indices: number[], type: DynamsoftEnums.EnumDWT_ImageType, fileName: string, showDialog: boolean): Promise<any> {
    return new Promise((res, rej) => {
      let saveInner = (_path, _name, _type): Promise<any> => {
        return new Promise((res, rej) => {
          let s = () => {
            if (showDialog) {
              _name = this.fileActualName;
              _path = this.fileSavingPath + "\\" + _name;
            }
            res({ name: _name, path: _path });
          }, f = (errCode, errStr) => rej(errStr);
          switch (_type) {
            case 0: this._DWObject.SaveAsBMP(_path, indices[0], s, f); break;
            case 1: this._DWObject.SaveAsJPEG(_path, indices[0], s, f); break;
            case 2: this._DWObject.SaveAsTIFF(_path, indices[0], s, f); break;
            case 3: this._DWObject.SaveAsPNG(_path, indices[0], s, f); break;
            case 4: this._DWObject.SaveAsPDF(_path, indices[0], s, f); break;
            case 7: this._DWObject.SaveSelectedImagesAsMultiPagePDF(_path, s, f); break;
            case 8: this._DWObject.SaveSelectedImagesAsMultiPageTIFF(_path, s, f); break;
            default: break;
          }
        });
      };
      fileName = fileName + this.getExtension(type);
      let filePath = this.fileSavingPath + "\\" + fileName;
      if (showDialog) {
        this.fileSavingPath = "";
        this.fileActualName = "";
        this._DWObject.IfShowFileDialog = true;
        this._DWObject.RegisterEvent("OnGetFilePath", (isSave, filesCount, index, directory, _fn) => {
          if (directory === "" && _fn === "") {
            rej("User cancelled the operation.")
          } else {
            this.fileActualName = _fn;
            this.fileSavingPath = directory;
          }
        });
        res(saveInner(this.fileSavingPath + "\\" + fileName, fileName, type));
      } else {
        this._DWObject.IfShowFileDialog = false;
        res(saveInner(filePath, fileName, type));
      }
    });
  }
  /**
   * Upload the specified images to the server.
   * @param indices Specify the image(s).
   * @param type Specify the type of the target file.
   * @param fileName Specify the file name.
   */
  uploadToServer(indices: number[], type: DynamsoftEnums.EnumDWT_ImageType, fileName: string): Promise<any> {
    return new Promise((res, rej) => {
      fileName = fileName + this.getExtension(type);
      let url = "", savedDir = "";
      if (environment.Dynamsoft.uploadTargetURL !== "") {
        url = environment.Dynamsoft.uploadTargetURL;
        /**
         * Change this to point to a url of a directory under which the uploaded files are saved.
         */
        savedDir = "";
      }
      else {
        /**
         * Testing server based on express & formidable
         * Make sure you have the server in /server/ running
         */
        let protocol = Dynamsoft.Lib.detect.ssl ? "https://" : "http://"
        let _strPort = 2020;
        let strActionPage = "/upload";
        savedDir = protocol + window.location.hostname + ":" + _strPort + "/uploaded/";
        url = protocol + window.location.hostname + ":" + _strPort + strActionPage;
      }
      this._DWObject.HTTPUpload(
        url,
        indices,
        type,
        Dynamsoft.EnumDWT_UploadDataFormat.Binary,
        fileName,
        () => {
          res({ name: fileName, url: savedDir + fileName });
        },
        (errCode, errString, responseStr) => {
          if (responseStr !== "") {
            this.generalSubject.next({ type: "httpResponse", responsString: responseStr });
          }
          rej(errString);
        }
      );
    });
  }
}
export interface Device {
  name: string,
  realName: string,
  type: string
}

interface Zone {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
}
