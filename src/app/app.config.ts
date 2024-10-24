import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { formReducer } from './utils/store/form.reducer'; // Import the form reducer
import { routes } from './app.routes'; // Import the routes if defined

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),  // Improve performance
    provideRouter(routes),  // Provide the routing
    provideAnimations(),    // Provide animations
    provideStore({ form: formReducer }),  // Provide the NgRx store with form reducer
    provideEffects([])  // Provide any effects if required, or pass an empty array for now
  ]
};
