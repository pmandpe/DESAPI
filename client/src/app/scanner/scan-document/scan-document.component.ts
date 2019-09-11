import { Component, OnInit } from '@angular/core';
import * as Dynamsoft from 'dwt';

@Component({
  selector: 'app-scan-document',
  templateUrl: './scan-document.component.html',
  styleUrls: ['./scan-document.component.css']
})
export class ScanDocumentComponent implements OnInit {

  constructor() { }
  title = 'angular-cli-application';
  DWObject: WebTwain;
  ngOnInit() {
    Dynamsoft.WebTwainEnv.AutoLoad = false;
    Dynamsoft.WebTwainEnv.Containers = [{ ContainerId: 'dwtcontrolContainer', Width: '583px', Height: '513px' }];
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
}