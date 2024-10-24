import { createReducer, on, Action } from '@ngrx/store';
import { FormGroup } from '@angular/forms';
import * as FormActions from './form.actions';

export interface FormState {
  currentState: any;
  previousStates: any[];
  futureStates: any[];
}

const initialState: FormState = {
  currentState: {},
  previousStates: [],
  futureStates: []
};

const formReducer = createReducer(
  initialState,
  on(FormActions.updateForm, (state, { newState }) => ({
    ...state,
    previousStates: [...state.previousStates, state.currentState],
    currentState: newState,
    futureStates: []
  })),
  on(FormActions.undoForm, state => {
    const previousStates = [...state.previousStates];
    const lastState = previousStates.pop();
    return lastState ? {
      ...state,
      futureStates: [state.currentState, ...state.futureStates],
      currentState: lastState,
      previousStates
    } : state;
  }),
  on(FormActions.redoForm, state => {
    const futureStates = [...state.futureStates];
    const nextState = futureStates.shift();
    return nextState ? {
      ...state,
      previousStates: [...state.previousStates, state.currentState],
      currentState: nextState,
      futureStates
    } : state;
  })
);

export function reducer(state: FormState | undefined, action: Action) {
  return formReducer(state, action);
}
