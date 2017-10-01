import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrayerRequestPage } from './prayer-request';

@NgModule({
  declarations: [
    PrayerRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(PrayerRequestPage),
  ],
  exports: [
    PrayerRequestPage
  ]
})
export class PrayerRequestPageModule {}
