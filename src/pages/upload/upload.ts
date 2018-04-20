import { Component, ChangeDetectionStrategy, Input, NgZone  } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform  } from 'ionic-angular';
import { Http } from '@angular/http';
import { Camera } from 'ionic-native';
import * as firebase from 'firebase';
declare var window: any;
/**
 * Generated class for the UploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {
  picdata:any
  picurl:any
  mypicref:any

  constructor(public navCtrl: NavController,
    public platform: Platform,
    private http: Http,
    private zone: NgZone,public camera :Camera) {
      this.mypicref=firebase.storage().ref('/');
  }
  takepic(){
    Camera.getPicture({
      quality:100,
      destinationType:Camera.DestinationType.DATA_URL,
      sourceType:Camera.PictureSourceType.CAMERA,
      encodingType:Camera.EncodingType.PNG,
      saveToPhotoAlbum: true,

    }).then(imgdata=>{
      this.picdata=imgdata;
      console.log(this.picdata,"this.picdata")
      this.upload()
    })
   }

   upload(){
    console.log("upload","uuid")
    this.mypicref.child(this.uid()).child('pic.png').
    putString(this.picdata,'base64',{contentType:'image/png'})
    .then(savepic=>{
      this.picurl=savepic.downloadURL
      console.log(this.picurl,"this.picurl")
    })
  }
  uid(){
    console.log("uuid","uuid")
    var d=new Date().getTime();
    var uuid='xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g,function(c){
      var r=(d+Math.random()*16)%16|0;
      d=Math.floor(d/16);
      return(c=='x'?r:(r& 0x8)).toString(16)
    });
    console.log(uuid,"uuid")
    return uuid;
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
  }
 


  
  
    
   
    
    

}
