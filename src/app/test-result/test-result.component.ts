import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "../shared/common.service";

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.css']
})
export class TestResultComponent implements OnInit {

  @Input() data: any;

  percent: string = '';

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
    // all - 100
    // correct - x
    // x = correct*100/ all
    console.log(this.data.correct)
    console.log(this.data.mistake)
    const all: number = parseInt(this.data.correct) + parseInt(this.data.mistake);
    console.log(all)
    this.percent = ((this.data.correct*100)/(all)).toFixed();
  }


}
