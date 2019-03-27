import { QuestionCategory } from '../category/question-category.model';

export interface IQuestionSection {
    id?: string;
    name?: string;
    categoryId?: string;
}


export class QuestionSection implements IQuestionSection {
    constructor(
        public id: string,
        public name: string,
        public categoryId?: string,
    ) {
        this.id = this.id ? this.id : null;
        this.name = this.name ? this.name : '';
        this.categoryId = this.categoryId ? this.categoryId : null;
    }
}
