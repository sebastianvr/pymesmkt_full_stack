import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Cambiar el locale de la app
import localeEsCL from '@angular/common/locales/es-CL';
import { registerLocaleData } from '@angular/common'
registerLocaleData(localeEsCL)

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    {provide : LOCALE_ID, useValue : 'es-CL'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
