import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "../shared/common.service";
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.css']
})
export class TestResultComponent implements OnInit {

  @Input() data: any;
  @Input() companyId: string;
  @Input() company: any;
  companyName: string = 'Компания не найдена';
  percent: string = '';
  constructor(private commonService: CommonService) {
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
        templateId: '',
        username: '',
        companyName: ''
      }
    }
    if(this.companyId && !this.data.companyName){
      this.commonService.getCompanyById(this.companyId).then(res=> {
          if (res) {
            this.companyName = res[0].name;
            this.company = res;
          }
        }
      );
    }
    // For find percent of correct answer
    // const all: number = parseInt(this.data.correct) + parseInt(this.data.mistake);
    // this.percent =  ((this.data.correct * 100) / (all)).toFixed();
    this.percent = ((parseInt(this.data.score )* 100) / parseInt(this.data.scoreMust)).toFixed();
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
