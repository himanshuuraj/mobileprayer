import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Prayercircle } from './prayercircle';

@NgModule({
  declarations: [
    Prayercircle
  ],
  imports: [
    IonicPageModule.forChild(Prayercircle),
  ],
  exports: [
    Prayercircle
  ]
})
export class PrayercircleModule {}
