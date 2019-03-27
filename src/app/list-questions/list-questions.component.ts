import {Component, OnInit} from '@angular/core';
import {QuestionService} from "../shared/question.service";
import {QuestionList} from "./question-list";
import {MatSnackBar} from "@angular/material";
import {QuestionCategory} from "../question/category/question-category.model";
import {QuestionSection} from "../question/section/question-section.model";
import {CategoryService} from "../shared/category.service";
import {SectionService} from "../shared/section.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.scss']
})
export class ListQuestionsComponent implements OnInit {

  questions: QuestionList[];

  categories: QuestionCategory[] = [];
  sections: QuestionSection[] = [];
  sectionSelectDisable = true;
  docId: string;

  constructor(private service: QuestionService,
              public snackBar: MatSnackBar,
              private serviceCategory: CategoryService,
              private serviceSection: SectionService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.docId = res['docId'];
      this.getCategories();
      if (this.docId) {
        this.getRejectedQuestion();
      } else {
        this.getQuestions();
      }


    });

  }

  // TODO modify to get one question using doc id
  getRejectedQuestion() {
    this.service.getRejectedQuestions().subscribe(
      list => {
        this.questions = list.map(item => {
          if (this.docId === item.payload.doc.id) {
            this.serviceSection.getSections().subscribe(res => {
              res.map(item => {
                this.sections.push(new QuestionSection(item.payload.doc.id, item.payload.doc.get('name'), item.payload.doc.get('categoryId')))
              })
            });
            return {
              docId: item.payload.doc.id,
              ...item.payload.doc.data()
            }
          }

        })
      }
    )
  }

  getQuestions() {
    this.service.getActiveQuestions().subscribe(
      list => {
        this.questions = list.map(item => {
          this.serviceSection.getSections().subscribe(res => {
            res.map(item => {
              this.sections.push(new QuestionSection(item.payload.doc.id, item.payload.doc.get('name'), item.payload.doc.get('categoryId')))
            })
          });
          return {
            docId: item.payload.doc.id,
            ...item.payload.doc.data()
          }
        })
      }
    )
  }

  save(question) {
    if (this.docId) {
      question.status = 'in_moderation';
    }
    this.service.updateQuestion(question).then(
      res => {
        console.log("success", JSON.stringify(res));
        if (this.docId) {
          this.router.navigateByUrl('');
        }
      }
    )
  }

  getCategories() {
    this.serviceCategory.getCotegories().subscribe(
      list => {
        this.categories = []
        list.map(item => {
          this.categories.push(new QuestionCategory(item.payload.doc.id, item.payload.doc.get('name')))
        })
      }
    )
  }

  getSectionsByCategory(event) {
    const categoryId: string = event.value;
    // get data from DB by category ID
    this.serviceSection.getSectionsByCategory(categoryId).subscribe(
      list => {
        this.sections = []
        list.map(item => {
          this.sections.push(new QuestionSection(item.payload.doc.id, item.payload.doc.get('name'), item.payload.doc.get('categoryId')))
        })
      }
    )
    this.sectionSelectDisable = false;
  }

  delete(question) {
    this.service.deleteQuestion(question.docId);
    this.getQuestions();
    this.openSnackBar('Вопрос успешно удален!', '');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
