import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../shared/common.service';
import {MatSnackBar} from '@angular/material';
import {Company} from '../../new-company/new-company.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Subsidiary} from "../../subsidiary/subsidiary.component";

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.css']
})
export class CompanyEditComponent implements OnInit {
  company: Company = new Company();
  id: any;
  subsidiaryList: Subsidiary [] = [];

  constructor(private _service: CommonService,
              public snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.params.subscribe(res => {
      this.id = res['id'];
    })
  }

  ngOnInit() {
    this.getSubsidiaryList();
    this.getpositionList()
  }

  getSubsidiaryList() {
    console.log('-------------')
    this._service.getSubsidiaryList().then(res => {
      console.log(res)
      this.subsidiaryList = res.map(result => {
        return {
          id: result.id,
          cityCode: result.cityCode,
          address: result.address,
          name: result.name
        }
      });
    });
  }

  deleteCompany(): void {
    this._service.deleteCompany(this.id).then(res => {
      this.router.navigateByUrl('/company-list')
      this.openSnackBar('Компания успешно удален', '');
    });
  }
  addSubsidary() {
    this.company.subsidiary.push('');
  }

  getpositionList(): void {
    console.log(this.id)
    this._service.getCompanyById(this.id).then(res => {
      console.log(res)
      if (res.length > 0) {
        this.company = {
          id: res[0].id,
          bin: res[0].bin,
          name: res[0].name,
          subsidiary: res[0].subsidiary,
          phoneNumber: res[0].phoneNumber,
        };

      }
    });
    // if (this.company.subsidiary.length == 0) {
    //   this.company.subsidiary.push('');
    // }
    console.log(this.company)
  }

  setCompany(): void {

    let temp: any = {
      id: this.company.id,
      bin: this.company.bin,
      phoneNumber: this.company.phoneNumber,
      name: this.company.name,
      subsidiary: this.company.subsidiary
    };
    this._service.updateCompany(temp).then(res => {
      // this.router.navigateByUrl('/company-list')
      console.log('=---=-=-=-=-=-================')
      console.log(JSON.stringify(res))

      this.openSnackBar('Компания обновлен', '');
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
