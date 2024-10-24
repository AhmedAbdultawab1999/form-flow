
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UndoRedoManager } from '../../utils/undo-redo-manager';
import { UpdateFormCommand } from '../../utils/update-form-command';
import { debounceTime } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatGridListModule,
    MatIconModule,
    MatToolbarModule
  ],
})
export class FormComponent implements OnInit {
  myForm!: FormGroup;
  undoRedoManager = new UndoRedoManager();
  private ignoreFormChanges = false; // Prevent triggering on Undo/Redo

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: '',
      age: null,
      terms: false,
      gender: ''
    });

    // Subscribe to form changes with debounce
    this.myForm.valueChanges.pipe(
      debounceTime(300) // Wait for 300ms pause in user input
    ).subscribe(value => {
      if (!this.ignoreFormChanges) {
        this.trackChanges(value);
      }
    });
  }

  trackChanges(newState: any): void {
    const command = new UpdateFormCommand(this.myForm, newState);
    this.undoRedoManager.executeCommand(command);
  }

  undo(): void {
    this.ignoreFormChanges = true; // Temporarily ignore valueChanges trigger
    this.undoRedoManager.undo();
    this.ignoreFormChanges = false;
  }

  redo(): void {
    this.ignoreFormChanges = true; // Temporarily ignore valueChanges trigger
    this.undoRedoManager.redo();
    this.ignoreFormChanges = false;
  }

  get canUndo(): boolean {
    return this.undoRedoManager.canUndo();
  }

  get canRedo(): boolean {
    return this.undoRedoManager.canRedo();
  }
}



