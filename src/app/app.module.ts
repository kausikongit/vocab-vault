import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { VaultComponent } from './vault/vault.component';
import { SecurityService } from './security.service';
import { AudioService } from './audio.service';
import { CommonService } from './common.service';
import { OptionComponent } from './option/option.component';
import { RandomOrderPipe } from './random-order.pipe';
import { QuestionComponent } from './question/question.component';

@NgModule({
  declarations: [
    AppComponent,
    VaultComponent,
    OptionComponent,
    RandomOrderPipe,
    QuestionComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FontAwesomeModule
  ],
  providers: [
    CommonService,
    SecurityService,
    AudioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
