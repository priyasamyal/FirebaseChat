import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController,Events } from 'ionic-angular';
import firebase from 'firebase';
import { GroupsProvider } from '../../providers/groups/groups';
import { UserProvider } from '../../providers/user/user';
import { RequestsProvider } from '../../providers/requests/requests';
/**
 * Generated class for the GroupParticipantsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-participants',
  templateUrl: 'group-participants.html',
})
export class GroupParticipantsPage {
  currentUser=firebase.auth().currentUser.uid;
  firefriends = firebase.database().ref('/friends');

temparr = [];
  filteredusers = [];
  myfriends;
  grpName;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events,
    public groupservice: GroupsProvider,
    public user:UserProvider,
    public requestService:RequestsProvider) {
    this.grpName = this.navParams.get('data');
    console.log(this.grpName)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupParticipantsPage');
  }
  ionViewWillEnter(){
   this.requestService.getmyfriends();
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.events.subscribe('friends', () => {
      this.myfriends = [];
      this.myfriends = this.requestService.myfriends; 
      loader.dismiss();
     })
  }

  searchuser(searchbar) {
    console.log(searchbar,"searchbar")
    this.filteredusers = this.temparr;
    var q = searchbar.target.value;
    if (q.trim() == '') {
      return;
    }

    this.filteredusers = this.filteredusers.filter((v) => {
      console.log(v.displayName.toLowerCase());
      console.log(q.toLowerCase());
      console.log(v.displayName.toLowerCase().indexOf(q.toLowerCase()));
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
       return true;
      }
      return false;
    })
  }
  add(key){
    console.log(key);
    this.groupservice.addmember(key,this.grpName).then((data)=>{
      console.log(data)
    }).catch((err)=>{
       console.log(err);
    })
   }

}
