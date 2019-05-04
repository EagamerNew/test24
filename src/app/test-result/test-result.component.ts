import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "../shared/common.service";
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

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
        userDocId: '',
        templateId: ''
      }
    }
    // For find percent of correct answer
    const all: number = parseInt(this.data.correct) + parseInt(this.data.mistake);
    this.percent = ((this.data.correct*100)/(all)).toFixed();
  }
  public captureScreen()
  {
    var data = document.getElementById('toPreview');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      // noinspection JSPotentiallyInvalidConstructorUsage
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('my-result.pdf'); // Generated PDF
    });
  }

}
