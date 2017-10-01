import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Invitation } from './invitation';

@NgModule({
  declarations: [
    Invitation,
  ],
  imports: [
    IonicPageModule.forChild(Invitation),
  ],
  exports: [
    Invitation
  ]
})
export class InvitationModule {}
