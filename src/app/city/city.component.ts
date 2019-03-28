import { Component, OnInit } from '@angular/core';
import {CommonService} from '../shared/common.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  city: City = new City();
  cities: City[] = [];
  constructor(private _service: CommonService,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getCityList();
    this.city.name = '';
    this.city.code = '';
  }
setCity(): void {
    let check = true;
    for(let i =0;i<this.cities.length;i++){
        if(this.cities[i].code == this.city.code){
          check = false;
          break;
        }
    }
    if(check){

      let temp: any = {
        name: this.city.name,
        code: this.city.code
      };
      this._service.addCity(temp).then(res => {
        this.city.name = '';
        this.city.code = '';
        this.getCityList();
        this.openSnackBar('Город создан', '');
      });
    }else{
      this.openSnackBar('Город с таким кодам существует', '');

    }
}

  getCityList(): void {
    this._service.getCityList().then(res => {
      this.cities = res.map(result =>{
        return {
          id:result.id,
          code: result.code,
          name: result.name
        }
      });
    });
}


  deleteCity(city): void {
    let temp: any = {
      name: city.name,
      code: city.code,
      id: city.id
    };
    console.log(city)
    this._service.deleteCity(city).then(res => {
      this.openSnackBar('Город успешно удален', '');
    });
}

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
export class City {
  id: string;
  code:  string;
  name:  string;
}
