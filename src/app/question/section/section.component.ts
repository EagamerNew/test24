import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {QuestionSection} from './question-section.model';
import {QuestionCategory} from '../category/question-category.model';
import {MatSnackBar} from '@angular/material';
import {AngularFirestore} from "@angular/fire/firestore";

import {CategoryService} from "../../shared/category.service";
import {SectionService} from "../../shared/section.service";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {

  questionSectionForm: FormGroup;
  sections: QuestionSection[] = [];
  categories: QuestionCategory[] = [];
  // sections: any;
  // categories: any;
  btnTitle = "Добавить";


  constructor(public snackBar: MatSnackBar, private serviceCategory: CategoryService, private serviceSection: SectionService, private firestore: AngularFirestore) {
  }

  ngOnInit() {
    this.questionSectionForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', {validators: [Validators.required]}),
      categoryId: new FormControl('', {validators: [Validators.required]})
    });

    this.getSections();
    this.getCategories();
  }

  getSections() {
    this.serviceSection.getSections().subscribe(
      list => {
        this.sections = []
        list.map(item => {
          this.sections.push(new QuestionSection(item.payload.doc.id, item.payload.doc.get('name'), item.payload.doc.get('categoryId')))
        })
      }
    )
    // this.serviceSection.getSections().subscribe(
    //   list => {
    //     this.sections = list.map(item => {
    //       return {
    //         id: item.payload.doc.id,
    //         ...item.payload.doc.data()
    //       }
    //     })
    //   }
    // )
  }

  getCategories() {
    this.serviceCategory.getCategories().subscribe(
      list => {
        this.categories = []
        list.map(item => {
          this.categories.push(new QuestionCategory(item.payload.doc.id, item.payload.doc.get('name')))
        })
      }
    )
    // this.serviceCategory.getCotegories().subscribe(
    //   list => {
    //     this.categories = list.map(item => {
    //       return {
    //         id: item.payload.doc.id,
    //         ...item.payload.doc.data()
    //       }
    //     })
    //   }
    // )
  }

  onSave() {
    this.btnTitle = "Добавить";
    const newCategory: QuestionSection = this.questionSectionForm.value;
    //save by id, add new data to DB
    if (newCategory.id) {
      this.firestore.doc('section/' + newCategory.id).update({
        'name': newCategory.name,
        'categoryId': newCategory.categoryId
      })
      this.questionSectionForm.reset();
      this.getSections();
      this.openSnackBar('Раздел успешно изменён!', '');
    } else {
      this.firestore.collection('section').add({
        'name': newCategory.name,
        'categoryId': newCategory.categoryId
      })
      this.questionSectionForm.reset();
      this.getSections();
      this.openSnackBar('Раздел успешно сохранён!', '');
    }
  }

  getExistingCategoryNameById(categoryId): string {
    let name = "";
    this.categories.forEach(value => {
      if (categoryId === value.id) {
        name = value.name;
      }
    });
    return name;
  }

  edit(section: QuestionSection) {
    this.btnTitle = "Сохранить";
    this.questionSectionForm.patchValue(section);
    this.getSections();
  }

  delete(section: QuestionSection) {
    // delete by id from DB
    this.firestore.doc('section/' + section.id).delete()
    this.getSections();
    this.openSnackBar('Раздел успешно удалён!', '');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
