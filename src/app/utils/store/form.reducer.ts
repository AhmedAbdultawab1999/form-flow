import { createReducer, on } from '@ngrx/store';
import { undoForm, redoForm, updateForm } from './form.actions';

export interface FormState {
  previousStates: any[];
  currentState: any;
  futureStates: any[];
}

export const initialState: FormState = {
  previousStates: [],
  currentState: {
    name: '',
    age: null,
    terms: false,
    gender: ''
  },
  futureStates: []
};

export const formReducer = createReducer(
  initialState,
  on(updateForm, (state, { newState }) => ({
    ...state,
    previousStates: [...state.previousStates, state.currentState],
    currentState: newState,
    futureStates: []
  })),
  on(undoForm, state => {
    const previousState = state.previousStates[state.previousStates.length - 1];
    return previousState
      ? {
          ...state,
          previousStates: state.previousStates.slice(0, -1),
          currentState: previousState,
          futureStates: [state.currentState, ...state.futureStates]
        }
      : state;
  }),
  on(redoForm, state => {
    const futureState = state.futureStates[0];
    return futureState
      ? {
          ...state,
          previousStates: [...state.previousStates, state.currentState],
          currentState: futureState,
          futureStates: state.futureStates.slice(1)
        }
      : state;
  })
);
