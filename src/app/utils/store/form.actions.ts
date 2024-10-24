import { createAction, props } from '@ngrx/store';

export const updateForm = createAction(
  '[Form] Update Form',
  props<{ newState: any }>()
);

export const undoForm = createAction('[Form] Undo Form');

export const redoForm = createAction('[Form] Redo Form');
