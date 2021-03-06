export const GENDER = [{code: 'male', name: "мужской"},
  {code: 'female', name: "женский"}];
export const CITIES = [{code: 'almaty', name: "Алматы"},
  {
    code: 'taraz', name: "Тараз"
  }];
export const USER_STATUS = [{code: 'created', name: 'Новый'},
  {code: 'active', name: 'Активен'}, {code: 'disabled', name: 'Заблокирован'}];
export const USER_ROLE_LIST = [
  {
    code: 'user',
    name: 'Пользователь'
  },
  {
    code: 'admin',
    name: 'Администратор'
  },
  {
    code: 'student',
    name: 'Студент'
  },
  {
    code: 'author',
    name: 'Автор'
  },
  {
    code: 'staff',
    name: 'Сотрудник'
  }
];
export const USER_PRIVILEGES = [
  {
    code: 'question', // Создать вопрос, Список своих вопросов
    name: 'Вопросы',
    description: 'Создать вопрос, Список своих вопросов'
  },
  {
    code: 'category', // Создание и удаление и список категории
    name: 'Категория',
    description: 'Создание и удаление и список категории'
  },
  {
    code: 'speciality', // Создание и удаление и список специальностей
    name: 'Специальность',
    description: 'Создание и удаление и список специальностей'
  },
  {
    code: 'section', // Создание и удаление и список раздела
    name: 'Раздел',
    description: 'Создание и удаление и список раздела'
  },
  {
    code: 'question-moderation', // Модерация вопроса и изменение определенного вопроса
    name: 'Модерация вопроса',
    description: 'Модерация вопроса и изменение определенного вопроса'
  },
  {
    code: 'question-template', // Создание и удаление шаблона теста и сдача шаблона
    name: 'Шаблон теста',
    description: 'Создание и удаление шаблона теста и сдача шаблона'
  },
  {
    code: 'users', // Создание и удаление и список пользователей
    name: 'Пользователи',
    description: 'Создание и удаление и список пользователей'
  },
  {
    code: 'examination', // Все что связано с экзаменом
    name: 'Экзамены',
    description: ' Все что связано с экзаменом'
  },
  {
    code: 'exam-list', // Все что связано с экзаменом
    name: 'Список экзаменов',
    description: 'Список экзаменов'
  },
  {
    code: 'staff',
    name: 'Добавить сотрудника',
    description: 'Добавление сотрудника по ИИН в компанию'
  }

];

export enum USER_PRIVILEGES_SHORT {
  QUESTION = 'question',
  CATEGORY = 'category',
  SPECIALITY = 'speciality',
  SECTION = 'section',
  QUESTION_MODERATION = 'question-moderation',
  QUESTION_TEMPLATE = 'question-template',
  USERS = 'users',
  EXAMINATION = 'examination',
  EXAM_LIST = 'exam-list',
  STAFF = 'staff'
}

export enum RESULT_CODE_LIST {
  PENDING = 'pending',
  ACTIVE = 'active',
  DISABLED = 'disabled',
  DONE = 'done'
}
