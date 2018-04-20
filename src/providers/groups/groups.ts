import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import firebase from 'firebase';

/*
  Generated class for the GroupsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GroupsProvider {
  firegroup = firebase.database().ref('/groups');
  firegroupUser = firebase.database().ref('/groupUsers');
  mygroups: Array<any> = [];
  updateGroups:Array<any>=[];
  groupbuddy:any;
  buddymessages;
  constructor(public events: Events) {

  }
  initializebuddy(buddy) {
    this.groupbuddy = buddy;
    console.log(this.groupbuddy)
  }
  addgroup(newGroup) {
    var promise = new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(newGroup.groupName).set({
        groupimage: newGroup.groupPic,
         owner: firebase.auth().currentUser.uid
      }).then(() => {
        this.firegroupUser.child(firebase.auth().currentUser.uid).push({
          GroupName: newGroup.groupName,
          groupAdmin:firebase.auth().currentUser.uid,
          GroupPic:"https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e"
         }).then(data=>{
           console.log(data);
           resolve(true)
         }).catch((err)=>{
          console.log(err)
          reject(err)
         })
        resolve(true);
        }).catch((err) => {
          reject(err);
      })
    });
    return promise;
  }

  getmygroups() {
    this.firegroup.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
      this.mygroups = [];
      if(snapshot.val() != null) {
        var temp = snapshot.val();
        for (var key in temp) {
          var newgroup = {
            groupName: key,
            groupimage: temp[key].groupimage
          }
          this.mygroups.push(newgroup);
        }
      }
      this.events.publish('newgroup');
    })
  }

  addmember(key,grpName){
    return new Promise((resolve, reject) => {
     this.firegroupUser.child(key.uid).push({
       GroupName: grpName,
       groupAdmin:firebase.auth().currentUser.uid,
       GroupPic:"https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e"
      }).then(data=>{
        console.log(data);
        resolve(true)
      }).catch((err)=>{
       console.log(err)
       reject(err)
      })
   })
 }

 addnewmessage(msg) {
   if (this.groupbuddy) {
     console.log("this.groupbuddy",this.groupbuddy)
     return new Promise((resolve, reject) => {
       this.firegroup.child(this.groupbuddy.groupadmin).child(this.groupbuddy.groupName).child("chat").push({
         sentby: firebase.auth().currentUser.uid,
         message: msg,
         timestamp: firebase.database.ServerValue.TIMESTAMP,
         name:firebase.auth().currentUser.displayName
       }).then(() => {
         resolve(true)
        
       }).catch((err)=>{
           reject(err);
       })
     })
    
   }
 }
 getbuddymessages() {
   let temp;
   this.firegroup.child(this.groupbuddy.groupadmin).child(this.groupbuddy.groupName).child("chat").on('value', (snapshot) => {
     this.buddymessages = [];
     temp = snapshot.val();
     console.log(temp);
     for (var tempkey in temp) {
       this.buddymessages.push(temp[tempkey]);
     }
     this.events.publish('newmessage');
   })
 }

}
