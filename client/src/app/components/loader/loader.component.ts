import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../services';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {


  color = '#008080';
  mode = 'indeterminate';
  value = 50;
  isLoading: Subject<boolean> = this.spinnerService.visibility;
  constructor(private spinnerService: SpinnerService){}

  ngOnInit() {
  }

}
