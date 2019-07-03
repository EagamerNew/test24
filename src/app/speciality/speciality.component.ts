import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../shared/common.service";
import {QuestionCategory} from "../question/category/question-category.model";
import {MatSnackBar} from "@angular/material";
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-speciality',
  templateUrl: './speciality.component.html',
  styleUrls: ['./speciality.component.css']
})
export class SpecialityComponent implements OnInit {
  questionSpecialityForm: FormGroup;
  specialities: any;
  btnTitle = "Добавить";

  constructor(private commonService: CommonService,
              private snackBar: MatSnackBar,
              private cookieService: CookieService) {
  }

  ngOnInit() {
    this.cookieService.set('title', 'Специальности');
    this.getSpecialityList();
    this.resetSpecialityForm();
  }

  getSpecialityList(){
    this.commonService.getSpecialityList().then(res=>{
      this.specialities = res;
    });
  }

  resetSpecialityForm(): void {
    this.questionSpecialityForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', {validators: [Validators.required]})
    });
  };

  onSave(): void {
    this.btnTitle = "Добавить";
    const newCategory: any = this.questionSpecialityForm.value;
    if (newCategory.id) {
      this.commonService.updateSpeciality(newCategory).then(res=>{
        this.getSpecialityList();
        this.resetSpecialityForm();
        this.openSnackBar('Специальность успешно изменён!', '');
      })
    }
    else {
      this.commonService.saveQuestionSpeciality(newCategory).then(res=>{
        this.getSpecialityList();
        this.resetSpecialityForm();
        this.openSnackBar('Специальность успешно сохранено!', '');
      });
    }
  }

  edit(speciality) {
    this.btnTitle = "Сохранить";
    this.questionSpecialityForm.patchValue(speciality);
  }

  delete(specialityId) {
    this.commonService.deleteSpeciality(specialityId).then(res=>{
      this.getSpecialityList();
      this.openSnackBar('Специальность успешно удалено!', '');
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
