import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestWaiting } from './request-waiting';

@NgModule({
  declarations: [
    RequestWaiting,
  ],
  imports: [
    IonicPageModule.forChild(RequestWaiting),
  ],
  exports: [
    RequestWaiting
  ]
})
export class RequestWaitingModule {}
