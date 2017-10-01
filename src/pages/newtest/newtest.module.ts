import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Newtest } from './newtest';

@NgModule({
  declarations: [
    Newtest,
  ],
  imports: [
    IonicPageModule.forChild(Newtest),
  ],
  exports: [
    Newtest
  ]
})
export class NewtestModule {}
