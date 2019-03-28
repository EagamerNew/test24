import {Component, OnInit} from '@angular/core';
import {QuestionService} from "../../shared/question.service";
import {Template} from "../../shared/model/template";
import {QuestionCategory} from "../../question/category/question-category.model";
import {CommonService} from "../../shared/common.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(private service: CommonService,
              public snackBar: MatSnackBar,) {

  }

  templateList: Template[] = [];
  categoryList: any[] = [];
  sectionList: any[] = [];

  ngOnInit() {
    this.getActiveTemplateList();
    this.service.getCategoryList().then(res => {
      this.categoryList = res;
    })
    this.service.getSectionList().then(res => {
      this.sectionList = res;
    })
  }

  getActiveTemplateList() {
    this.service.getActiveTemplateList().then(res => {
      console.log(res);
      this.templateList = res.map(mres => {
        return new Template(mres.id, mres.name, mres.categoryId, mres.sectionId, mres.questionIdList, mres.status);
      });
    })
  }

  getNameFromSection(id): string {
    let res;
    if (res = this.sectionList.find(value => value.id === id)) {
      return res.name;
    } else {
      return "Раздел не найден";
    }
  }

  getNameFromCategory(id): string {
    let res;
    if (res = this.categoryList.find(value => value.id === id)) {
      return res.name;
    } else {
      return "Категория не найдена";
    }
  }

  deleteTemplateById(id: string) {
    this.service.deleteTemplateById(id).then(res => {
      this.getActiveTemplateList();
      this.openSnackBar("Шаблон успешно удален", '');
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
