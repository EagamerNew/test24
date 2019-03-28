import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "../shared/common.service";

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.css']
})
export class TestResultComponent implements OnInit {

  @Input() data: any;

  constructor() {
  }

  ngOnInit() {

    if (!this.data) {
      this.data = {
        isTest: true,
        correct: 18,
        mistake: 2,
        score: 8.0,
        category: 'Юрфак',
        section: 'Менеджмент',
        title: '',
        userDocId: ''
      }
    }
  }


}
