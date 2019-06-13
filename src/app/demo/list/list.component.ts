import {Component, OnInit} from '@angular/core';
import {QuestionService} from "../../shared/question.service";
import {Template} from "../../shared/model/template";
import {QuestionCategory} from "../../question/category/question-category.model";
import {CommonService} from "../../shared/common.service";
import {MatSnackBar} from "@angular/material";
import {CookieService} from "ngx-cookie-service";
import {QuestionSection} from "../../question/section/question-section.model";
import {template} from "@angular/core/src/render3";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  searchText: string = '';

  constructor(private service: CommonService,
              public snackBar: MatSnackBar,
              public cookieService: CookieService) {

  }

  templateList: Template[] = [];
  categoryList: any[] = [];
  sectionList: any[] = [];
  categorySectionList: any[] = [];
  companyList: any[] = [];
  displayCompanyList: any[] = [];
  allTemplateList: Template[] = [];
  searching: boolean = false;
  loading: boolean = false;
  isFiltering: boolean = false;
  showFilterResult: boolean = false;
  sectionSelectDisable: boolean = true;
  disableReset: boolean = true;
  resultList = [];
  filterTemplate: any = new Object();

  ngOnInit() {
    this.loading = true;
    this.getActiveTemplateList();
    this.service.getCategoryList().then(res => {
      this.categoryList = res;
    })
    this.service.getSectionList().then(res => {
      this.sectionList = res;
    })
    this.service.getActiveCompanyList().then(res => {
      this.companyList = res;
    })
    this.service.getCompanyList().then(res => {
      this.displayCompanyList = res;
    })
  }

  showFilter(){
    this.handleSearchString();
    this.isFiltering = true;
    this.showFilterResult = false;
  }

  getSectionsByCategory(event) {
    const categoryId: string = event.value;
    this.categorySectionList = [];
    this.sectionList.forEach(value=>{
      if(value.categoryId === categoryId){
        this.categorySectionList.push(value);
      }
    });
    this.sectionSelectDisable = false;
  }

  getActiveTemplateList() {
    this.service.getActiveTemplateList().then(res => {
      console.log(res);
      let templateIdList = [];
      this.templateList = res.map(mres => {
        let temp =  new Template(mres.id, mres.name, mres.categoryId, mres.sectionId, mres.questionIdList,mres.companyId, mres.status);
        templateIdList.push(temp.id);
        this.allTemplateList.push(temp);
        return temp;
      });
      this.getResultListByTemplateIds(templateIdList);
      this.loading = false;
    })
  }

  getResultListByTemplateIds(ids:string[]){
    this.service.getTemplateResultListByIds(ids).then(res=>{
      this.resultList = res;
    })
  }

  getCountForTemplateResult(id:string){
    let res;
    return this.resultList.filter(value => value.templateId === id).length + 1;
  }

  getNameFromSection(id): string {
    let res;
    if (res = this.sectionList.find(value => value.id === id)) {
      return res.name;
    } else {
      return "Раздел не найден";
    }
  }

  getNameFromCompany(id): string {
    let res;
    if (res = this.displayCompanyList.find(value => value.id === id)) {
      return res.name;
    } else {
      return "Компания не найдена";
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

  handleSearchString() {
    this.disableReset = true;
    this.searchText = "";
    this.searching = false;
    this.templateList = this.allTemplateList;
    this.filterTemplate = new Object();
    this.isFiltering = false;
    this.showFilterResult = false;
  }

  search(): void {
    if (this.searchText === ''
      || this.searchText === null
      || this.searchText.trim() === ''
      || this.searchText.trim().length === 0
      || this.searchText.length === 0) {
      this.handleSearchString() ;
    } else {
      this.loading = true;
      this.searching = true;
      this.disableReset = false;
      this.templateList = [];
      this.service.searchTemplate(this.searchText).then(res=>{
        if(res && res.length > 0){
          this.templateList = res.map(mres => {
            let temp =  new Template(mres.id, mres.name, mres.categoryId, mres.sectionId, mres.questionIdList,mres.companyId, mres.status);
            return temp;
          });
        }
        this.loading = false;
      })
      // this.allTemplateList.forEach(value => {
      //   if (value.name.toLowerCase().includes(this.searchText.toLowerCase())) {
      //     this.templateList.push(value);
      //   }
      // });
    }
  }

  filter() {
    this.loading = true;
    this.service.filterTemplate(this.filterTemplate).then(res =>{
      this.loading = false;
      this.isFiltering = false;
      this.showFilterResult = true;
      this.disableReset = false;
      this.templateList = [];
      if(res && res.length > 0){
        this.templateList = res.map(mres => {
          let temp =  new Template(mres.id, mres.name, mres.categoryId, mres.sectionId, mres.questionIdList,mres.companyId, mres.status);
          return temp;
        });
      }
    })
  }
}
