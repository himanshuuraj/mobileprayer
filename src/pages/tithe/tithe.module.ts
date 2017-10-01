import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Tithe } from './tithe';

@NgModule({
  declarations: [
    Tithe,
  ],
  imports: [
    IonicPageModule.forChild(Tithe),
  ],
  exports: [
    Tithe
  ]
})
export class TitheModule {}
