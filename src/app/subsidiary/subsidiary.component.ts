import {Component, OnInit} from '@angular/core';
import {CommonService} from "../shared/common.service";
import {City} from "../city/city.component";

@Component({
  selector: 'app-subsidiary',
  templateUrl: './subsidiary.component.html',
  styleUrls: ['./subsidiary.component.css']
})
export class SubsidiaryComponent implements OnInit {
  subsidiary: Subsidiary = new Subsidiary();
  subsidiaryList: Subsidiary [] = [];
  cities: City[] = [];

  constructor(private _service: CommonService) {

  }

  ngOnInit() {
    this.getSubsidiaryList();
    this.getCityList()

  }

  setSubsidiary(): void {
    console.log(this.subsidiary)

    let temp: any = {
      name: this.subsidiary.name,
      cityCode: this.subsidiary.cityCode,
      address: this.subsidiary.address
    };
    this._service.addSubsidiary(temp).then(res => {
      this.subsidiary = new Subsidiary();
      this.getSubsidiaryList();

    });
  }

  updateSubsidiary(subsidiary): void {
    let temp: any = {
      id: subsidiary.id,
      name: subsidiary.name,
      cityCode: subsidiary.cityCode,
      address: subsidiary.address
    };
    console.log(temp)
    this._service.updateSubsidiary(temp).then(res => {
      this.subsidiary = new Subsidiary();

    });
  }

  delete(subsidiary): void {
    let temp: any = {
      id: subsidiary.id,
      name: subsidiary.name,
      cityCode: subsidiary.cityCode,
      address: subsidiary.address
    };
    this._service.deleteSubsidiary(temp).then(res => {
      this.getSubsidiaryList();
    });
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


  getCityList(): void {
    this._service.getCityList().then(res => {
      this.cities = res.map(result => {
        return {
          id: result.id,
          code: result.code,
          name: result.name
        }
      });
    });
  }
}

export class Subsidiary {
  id: string;
  cityCode: string;
  name: string;
  address: string;
}
