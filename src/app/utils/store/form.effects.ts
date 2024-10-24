import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as FormActions from './form.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class FormEffects {
  constructor(private actions$: Actions, private snackBar: MatSnackBar) {}

  undoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.undoForm),
      tap(() => this.snackBar.open('Undo action performed', 'Close', { duration: 2000 }))
    ), { dispatch: false });

  redoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.redoForm),
      tap(() => this.snackBar.open('Redo action performed', 'Close', { duration: 2000 }))
    ), { dispatch: false });
}
