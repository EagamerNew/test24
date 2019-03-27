import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QuestionCategory } from './question-category.model';
import { MatSnackBar } from '@angular/material';

import { AngularFirestore } from "@angular/fire/firestore";
import { CategoryService } from "../../shared/category.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  questionCategoryForm: FormGroup;
  categories: any
  btnTitle = "Добавить";

  constructor(public snackBar: MatSnackBar, private firestore: AngularFirestore, private service: CategoryService) { }

  ngOnInit() {

    this.resetCategoryForm();
    this.getCategories();

  }

  resetCategoryForm(): void{
    this.questionCategoryForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', { validators: [Validators.required] })
    });
  };

  getCategories(): void{
    this.service.getCotegories().subscribe(
      list => {

        this.categories = list.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          }
        })
        console.log(JSON.stringify(this.categories),"--------------------")

      }
    )

  }

  onSave(): void {
    this.btnTitle = "Добавить";
    const newCategory: QuestionCategory = this.questionCategoryForm.value;
    if (newCategory.id) {
      this.firestore.doc('category/' + newCategory.id).update({ 'name': newCategory.name })
      this.resetCategoryForm();
      this.getCategories();
      this.openSnackBar('Категория успешно изменён!', '');
    }
    else {
      this.firestore.collection('category').add({
        'name': newCategory.name
      });
      this.resetCategoryForm();
      this.getCategories();
      this.openSnackBar('Категория успешно сохранено!', '');
    }
  }

  edit(category: QuestionCategory) {
    this.btnTitle = "Сохранить";
    this.questionCategoryForm.patchValue(category);
    this.getCategories();
  }

  delete(category: QuestionCategory) {
    this.firestore.doc('category/' + category.id).delete()
    this.getCategories();
    this.openSnackBar('Категория успешно удалено!', '');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
