// form.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { updateFormState, undoFormState, redoFormState } from './form.actions';

export interface FormState {
  history: any[];
  future: any[];
  currentState: any;
}

export const initialState: FormState = {
  history: [],
  future: [],
  currentState: {}  // Ensure initial state is an empty object
};

export const formReducer = createReducer(
  initialState,
  on(updateFormState, (state, { newState }) => ({
    ...state,
    history: [...state.history, state.currentState],  // Push current state to history
    currentState: newState,  // Set the new state as the current state
    future: []  // Clear the future stack whenever a new state is applied
  })),
  on(undoFormState, (state) => {
    const previousState = state.history[state.history.length - 1];  // Get the last state from history
    return previousState
      ? {
          ...state,
          history: state.history.slice(0, -1),  // Remove the last state from history
          future: [state.currentState, ...state.future],  // Push the current state to the future stack
          currentState: previousState,  // Set the previous state as the current state
        }
      : state;  // If there is no previous state, return the current state
  }),
  on(redoFormState, (state) => {
    const nextState = state.future[0];  // Get the next state from future
    return nextState
      ? {
          ...state,
          history: [...state.history, state.currentState],  // Push the current state to history
          future: state.future.slice(1),  // Remove the first state from future
          currentState: nextState,  // Set the next state as the current state
        }
      : state;  // If there is no future state, return the current state
  })
);
