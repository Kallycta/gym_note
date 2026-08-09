import { reactive, computed } from 'vue';

export interface WorkoutExercise {
  id: number;
  name: string;
  category: string;
  date: string; // Формат YYYY-MM-DD
}

interface WorkoutState {
  exercises: WorkoutExercise[];
  selectedDate: string;
}

const getTodayString = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

const state = reactive<WorkoutState>({
  exercises: [],
  selectedDate: getTodayString(),
});

export const workoutStore = {
  get exercises() {
    return state.exercises;
  },

  get selectedDate() {
    return state.selectedDate;
  },

  setSelectedDate(date: string) {
    state.selectedDate = date;
  },

  addExercise(exercise: { id: number; name: string; category: string }) {
    const exists = state.exercises.find(
      (e) => e.id === exercise.id && e.date === state.selectedDate
    );

    if (!exists) {
      state.exercises.push({
        ...exercise,
        date: state.selectedDate,
      });
    }
  },

  removeExercise(id: number) {
    state.exercises = state.exercises.filter(
      (e) => e.id !== id || e.date !== state.selectedDate
    );
  },

  getExercisesForDate(date: string) {
    return state.exercises.filter((e) => e.date === date);
  },

  isExerciseSelected(id: number) {
    return state.exercises.some(
      (e) => e.id === id && e.date === state.selectedDate
    );
  },
};
