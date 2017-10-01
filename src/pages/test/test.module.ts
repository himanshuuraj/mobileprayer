import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Test } from './test';

@NgModule({
  declarations: [
    Test,
  ],
  imports: [
    IonicPageModule.forChild(Test),
  ],
  exports: [
    Test
  ]
})
export class TestModule {}
