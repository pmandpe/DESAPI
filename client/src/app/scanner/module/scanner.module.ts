import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScannerDashboardComponent } from '../scanner-dashboard/scanner-dashboard.component';
import { ScanDocumentComponent } from '../../scanner/scan-document/scan-document.component';



@NgModule({
  declarations: [
    ScannerDashboardComponent,
    ScanDocumentComponent
  ],
  imports: [
    CommonModule
    
  ]
})
export class ScannerModule { }
