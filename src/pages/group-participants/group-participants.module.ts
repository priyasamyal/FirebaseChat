import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupParticipantsPage } from './group-participants';

@NgModule({
  declarations: [
    GroupParticipantsPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupParticipantsPage),
  ],
  exports: [
    GroupParticipantsPage,
  ],
})
export class GroupParticipantsPageModule {}
