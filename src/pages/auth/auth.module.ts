import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Auth } from './auth';

@NgModule({
  declarations: [
    Auth,
  ],
  imports: [
    IonicPageModule.forChild(Auth),
  ],
  exports: [
    Auth
  ]
})
export class AuthModule {}
