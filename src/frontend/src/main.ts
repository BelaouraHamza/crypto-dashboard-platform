import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { LoggingInterceptor } from './app/interceptors/logging.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Add the interceptor to the list of providers
appConfig.providers.push({ provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true });
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
