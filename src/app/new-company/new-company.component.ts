import { Component, OnInit } from '@angular/core';
import {CommonService} from '../shared/common.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-new-company',
  templateUrl: './new-company.component.html',
  styleUrls: ['./new-company.component.css']
})
export class NewCompanyComponent implements OnInit {
  company: Company = new Company();

  constructor(private _service: CommonService,
              public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
setCompany(): void{

  let temp: any = {
    bin: this.company.bin,
    phoneNumber: this.company.phoneNumber,
    name: this.company.name,
    subsidiary: this.company.subsidiary
  };
  this._service.addCompany(temp).then(res => {
    this.company.name = '';
    this.company.phoneNumber = '';
    this.company.bin = '';
    this.company.subsidiary = '';
    this.openSnackBar('Компания создан', '');
  });
}
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
export class Company {
  id: string;
  bin: string;
  name: string;
  phoneNumber: string;
  subsidiary:string;
}
