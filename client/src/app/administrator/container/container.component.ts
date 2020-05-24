import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  options: FormGroup;
  constructor(fb: FormBuilder) {
    this.options = fb.group({
      bottom: 0,
      fixed: true,
      top: 0
    });
  }
  ngOnInit() {
  }

}
