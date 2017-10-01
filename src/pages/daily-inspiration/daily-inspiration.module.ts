import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DailyInspiration } from './daily-inspiration';

@NgModule({
  declarations: [
    DailyInspiration,
  ],
  imports: [
    IonicPageModule.forChild(DailyInspiration),
  ],
  exports: [
    DailyInspiration
  ]
})
export class DailyInspirationModule {}
