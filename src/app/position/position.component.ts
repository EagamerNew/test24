import { Component, OnInit } from '@angular/core';
import {CommonService} from '../shared/common.service';
import {MatSnackBar} from '@angular/material';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {
  position: Position = new Position();
  positions: Position[] = [];
  constructor(private _service: CommonService,
              public snackBar: MatSnackBar,
              private cookieService: CookieService) { }

  ngOnInit() {
    this.cookieService.set('title', 'Должность');
    this.getpositionList();
    this.position.name = '';
    this.position.code = '';
  }
  setposition(): void {
    let check = true;
    for(let i =0;i<this.positions.length;i++){
      if(this.positions[i].code == this.position.code){
        check = false;
        break;
      }
    }
    if(check){

      let temp: any = {
        name: this.position.name,
        code: this.position.code
      };
      this._service.addPostion(temp).then(res => {
        this.position.name = '';
        this.position.code = '';
        this.getpositionList();
        this.openSnackBar('Должность создан', '');
      });
    }else{
      this.openSnackBar('Должность с таким кодам существует', '');

    }
  }

  getpositionList(): void {
    this._service.getPostionList().then(res => {
      this.positions = res.map(result =>{
        return {
          id:result.id,
          code: result.code,
          name: result.name
        }
      });
    });
  }


  deletePosition(position): void {
    let temp: any = {
      name: position.name,
      code: position.code,
      id: position.id
    };
    console.log(position)
    this._service.deletePostion(position).then(res => {
      this.getpositionList();
      this.openSnackBar('Должность успешно удален', '');
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
export class Position {
  id: string;
  code:  string;
  name:  string;
}
