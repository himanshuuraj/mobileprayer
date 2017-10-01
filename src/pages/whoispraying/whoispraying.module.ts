import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Whoispraying } from './whoispraying';

@NgModule({
  declarations: [
    Whoispraying,
  ],
  imports: [
    IonicPageModule.forChild(Whoispraying),
  ],
  exports: [
    Whoispraying
  ]
})
export class WhoisprayingModule {}
