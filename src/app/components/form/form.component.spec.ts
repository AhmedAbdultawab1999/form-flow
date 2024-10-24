// form.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { redoForm, undoForm, updateForm } from '../../utils/store/form.actions';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let store: MockStore;
  let snackBar: MatSnackBar;
  const initialState = {
    form: {
      previousStates: [],
      currentState: {
        name: '',
        age: null,
        terms: false,
        gender: ''
      },
      futureStates: []
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        FormComponent // Adjust for standalone component
      ],
      providers: [
        provideMockStore({ initialState }),
        MatSnackBar
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges(); // Trigger initial data binding

    // Mock the store selectors
    spyOn(store, 'select').and.callFake(selector => {
      if (selector === jasmine.any(Function)) {
        return of(false); // mock for canUndo$ and canRedo$
      }
      return of(initialState.form.currentState);
    });
  });

  it('should create the form component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.myForm.value).toEqual({
      name: '',
      age: null,
      terms: false,
      gender: ''
    });
  });

  it('should dispatch updateForm action when form value changes', () => {
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    component.myForm.patchValue({ name: 'John' });

    expect(dispatchSpy).toHaveBeenCalledWith(updateForm({ newState: { name: 'John', age: null, terms: false, gender: '' } }));
  });

  it('should call undoForm action when undo button is clicked', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const undoButton = fixture.debugElement.query(By.css('button[mat-raised-button][color="primary"]')).nativeElement;

    undoButton.click();
    expect(dispatchSpy).toHaveBeenCalledWith(undoForm());
  });

  it('should call redoForm action when redo button is clicked', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const redoButton = fixture.debugElement.query(By.css('button[mat-raised-button][color="accent"]')).nativeElement;

    redoButton.click();
    expect(dispatchSpy).toHaveBeenCalledWith(redoForm());
  });

  it('should display snack bar notification on undo', () => {
    const snackBarSpy = spyOn(snackBar, 'open');
    component.undo();
    expect(snackBarSpy).toHaveBeenCalledWith('Undo action performed', 'Close', { duration: 2000 });
  });

  it('should display snack bar notification on redo', () => {
    const snackBarSpy = spyOn(snackBar, 'open');
    component.redo();
    expect(snackBarSpy).toHaveBeenCalledWith('Redo action performed', 'Close', { duration: 2000 });
  });

  it('should disable undo button if canUndo$ is false', () => {
    // Since canUndo$ returns false, undo button should be disabled
    fixture.detectChanges();

    const undoButton = fixture.debugElement.query(By.css('button[mat-raised-button][color="primary"]')).nativeElement;
    expect(undoButton.disabled).toBeTrue();
  });

  it('should disable redo button if canRedo$ is false', () => {
    // Since canRedo$ returns false, redo button should be disabled
    fixture.detectChanges();

    const redoButton = fixture.debugElement.query(By.css('button[mat-raised-button][color="accent"]')).nativeElement;
    expect(redoButton.disabled).toBeTrue();
  });
});
