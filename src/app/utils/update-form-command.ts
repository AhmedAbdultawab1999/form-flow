
import { FormGroup } from "@angular/forms";
import { Command } from "./command";

export class UpdateFormCommand implements Command {
  private previousState: any;
  private newState: any;
  private form: FormGroup;

  constructor(form: FormGroup, newState: any) {
    this.form = form;
    this.newState = newState;
    this.previousState = { ...form.value }; // Clone the previous state
  }

  execute(): void {
    this.form.patchValue(this.newState, { emitEvent: false }); // Apply new state without triggering valueChanges
  }

  undo(): void {
    this.form.patchValue(this.previousState, { emitEvent: false }); // Revert to previous state without triggering valueChanges
  }
}
