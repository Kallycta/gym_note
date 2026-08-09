// src/data/exercises.ts

export interface Exercise {
  id: number
  name: string
  category: string
  muscles: string[]
  equipment?: string
  image?: string
}

export const exercises: Exercise[] = [
  // Грудь
  { id: 1, name: 'Жим лежа', category: 'Грудь', muscles: ['грудь', 'трицепс'], equipment: 'штанга' },
  { id: 2, name: 'Жим гантелей на наклонной', category: 'Грудь', muscles: ['грудь', 'плечи'], equipment: 'гантели' },
  { id: 3, name: 'Отжимания на брусьях', category: 'Грудь', muscles: ['грудь', 'трицепс'], equipment: 'свой вес' },
  
  // Руки
  { id: 4, name: 'Подъем штанги на бицепс', category: 'Руки', muscles: ['бицепс'], equipment: 'штанга' },
  { id: 5, name: 'Французский жим', category: 'Руки', muscles: ['трицепс'], equipment: 'штанга' },
  { id: 6, name: 'Молотки с гантелями', category: 'Руки', muscles: ['бицепс', 'предплечья'], equipment: 'гантели' },
  
  // Спина
  { id: 7, name: 'Становая тяга', category: 'Спина', muscles: ['спина', 'поясница'], equipment: 'штанга' },
  { id: 8, name: 'Подтягивания', category: 'Спина', muscles: ['спина', 'бицепс'], equipment: 'свой вес' },
  { id: 9, name: 'Тяга верхнего блока', category: 'Спина', muscles: ['спина'], equipment: 'тренажер' },
  
  // Ноги
  { id: 10, name: 'Приседания со штангой', category: 'Ноги', muscles: ['квадрицепс', 'ягодицы'], equipment: 'штанга' },
  { id: 11, name: 'Выпады', category: 'Ноги', muscles: ['квадрицепс', 'ягодицы'], equipment: 'гантели' },
  { id: 12, name: 'Сгибание ног в тренажере', category: 'Ноги', muscles: ['бицепс бедра'], equipment: 'тренажер' },
  
  // Плечи
  { id: 13, name: 'Жим штанги стоя', category: 'Плечи', muscles: ['плечи'], equipment: 'штанга' },
  { id: 14, name: 'Махи гантелями в стороны', category: 'Плечи', muscles: ['средняя дельта'], equipment: 'гантели' },
  { id: 15, name: 'Тяга к подбородку', category: 'Плечи', muscles: ['плечи', 'трапеция'], equipment: 'штанга' },
  
  // Корпус
  { id: 16, name: 'Планка', category: 'Корпус', muscles: ['пресс', 'кор'], equipment: 'свой вес' },
  { id: 17, name: 'Скручивания', category: 'Корпус', muscles: ['пресс'], equipment: 'свой вес' },
  { id: 18, name: 'Подъем ног в висе', category: 'Корпус', muscles: ['нижний пресс'], equipment: 'свой вес' },
  
  // Фулбоди
  { id: 19, name: 'Берпи', category: 'Фулбоди', muscles: ['все тело'], equipment: 'свой вес' },
  { id: 20, name: 'Трастеры', category: 'Фулбоди', muscles: ['ноги', 'плечи'], equipment: 'гантели' },
  
  // Кардио
  { id: 21, name: 'Бег на дорожке', category: 'Кардио', muscles: ['сердце', 'ноги'], equipment: 'тренажер' },
  { id: 22, name: 'Велотренажер', category: 'Кардио', muscles: ['ноги', 'сердце'], equipment: 'тренажер' },
  { id: 23, name: 'Скакалка', category: 'Кардио', muscles: ['икры', 'сердце'], equipment: 'скакалка' },
  
  // Другое
  { id: 24, name: 'Растяжка', category: 'Другое', muscles: ['все тело'], equipment: 'свой вес' },
  { id: 25, name: 'Упражнения Кегеля', category: 'Другое', muscles: ['тазовое дно'], equipment: 'свой вес' },
]
