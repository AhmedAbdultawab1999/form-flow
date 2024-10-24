import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { redoForm, undoForm, updateForm } from '../../utils/store/form.actions';
import { FormState } from '../../utils/store/form.reducer';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
  ],
})
export class FormComponent implements OnInit {
  myForm!: FormGroup;
  canUndo$!: Observable<boolean>;
  canRedo$!: Observable<boolean>;
  currentState$!: Observable<any>;

  constructor(private fb: FormBuilder, private store: Store<{ form: FormState }>, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: '',
      age: null,
      terms: false,
      gender: ''
    });

    // Subscribe to form value changes and dispatch an update action
    this.myForm.valueChanges.subscribe(value => {
      this.store.dispatch(updateForm({ newState: value }));
    });

    // Subscribe to store to get current state and update form
    this.store.select(state => state.form.currentState).subscribe(state => {
      if (state) {
        this.myForm.patchValue(state, { emitEvent: false }); // update form without triggering valueChanges event
      }
    });

    // Select state to check if undo/redo is available
    this.canUndo$ = this.store.select(state => state.form.previousStates.length > 0);
    this.canRedo$ = this.store.select(state => state.form.futureStates.length > 0);
  }

  undo(): void {
    this.store.dispatch(undoForm());
    this.snackBar.open('Undo action performed', 'Close', { duration: 2000 });
  }

  redo(): void {
    this.store.dispatch(redoForm());
    this.snackBar.open('Redo action performed', 'Close', { duration: 2000 });
  }
}
