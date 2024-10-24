import { createAction, props } from '@ngrx/store';

export const updateFormState = createAction('[Form] Update Form State', props<{ newState: any }>());
export const undoFormState = createAction('[Form] Undo Form State');
export const redoFormState = createAction('[Form] Redo Form State');
