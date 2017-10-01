import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomeScreenPage } from '../home-screen/home-screen';
import 'rxjs/add/operator/map';
import { Camera } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/Keyboard';
import { Http, Headers, RequestOptions } from '@angular/http';
import {AlertController} from 'ionic-angular';
import {Platform} from 'ionic-angular';
/**
 * Generated class for the PrayerRequestPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-prayer-request',
  templateUrl: 'prayer-request.html',
})
export class PrayerRequestPage {

  showEdit = true;
  flagToShowIcons = {
      flagToShowPhotoDiv : true,
      mainDiv : true,
      firstDiv : true,
      secondDiv : false,
      thirdDiv : false,
      firstCross : true,
      secondCross : false,
      thirdCross : false
  };
  images = {
    firstImage : "",
    secondImage : "",
    thirdImage : ""
  };
  prayermessage;
  first
  second
  nav
  width
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public camera: Camera,private http:Http,private alertCtrl: AlertController, public keyboard: Keyboard) {
    keyboard.disableScroll(true);
    //keyboard.adjustPan();
    //keyboard.show();
    this.nav = navCtrl;
  }

  swipeEvent(event){
    this.createPrayerRequest();
  }

  removeImage(param){
    if(param == "first"){
      this.images.firstImage = this.images.secondImage;
      this.images.secondImage = this.images.thirdImage;
      this.flagToShowIcons.firstCross = false;
      if(!this.images.secondImage)
        this.flagToShowIcons.secondCross = false;
    }else if(param == "second"){
      this.images.secondImage = this.images.thirdImage;
      this.flagToShowIcons.secondCross = false;
    }
      this.images.thirdImage = "";
      this.flagToShowIcons.thirdCross = false;
    if(!this.images.firstImage || !this.images.secondImage || !this.images.thirdImage){
      this.flagToShowIcons.flagToShowPhotoDiv = true;
    }
    if(!this.images.firstImage && !this.images.secondImage && !this.images.thirdImage){
      this.flagToShowIcons.mainDiv = false;
    }
  }

  abc(){
    this.first = document.getElementById("first");
    var navCtrl = this.navCtrl;
    var width = this.platform.width();
    width -= 50;
    var t1 = setInterval(function(){
      var t = this.first.style.left;
      t = t.substring(0,t.length-2);
      t = parseInt(t);
      t = t+8;
      if(t>width){
        clearInterval(t1);
        navCtrl.setRoot(HomeScreenPage);
      }
      else{
        this.first.style.left = t + "px";
      }
    },6);
  }

  onSlideChanged(slider) {
    alert(slider);
  }

  showCross(type){
    if(type == "first"){
        if(this.images.firstImage)
          this.flagToShowIcons.firstCross = true;
    }
    else if(type == "second"){
        if(this.images.secondImage)
          this.flagToShowIcons.secondCross = true;
    }
    else if(type == "third"){
        if(this.images.thirdImage)
          this.flagToShowIcons.thirdCross = true;
    }
  }

  addPhoto(){
    this.camera.getPicture({
       sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
       destinationType: this.camera.DestinationType.DATA_URL
      }).then((imageData) => {
        this.flagToShowIcons.mainDiv = true;
        if(!this.images.firstImage){
            this.images.firstImage = 'data:image/jpeg;base64,'+imageData;
            this.flagToShowIcons.firstDiv = true;
            this.flagToShowIcons.secondDiv = true;
            this.flagToShowIcons.thirdDiv = true;
        }
        else if(!this.images.secondImage){
            this.images.secondImage = 'data:image/jpeg;base64,'+imageData;
            this.flagToShowIcons.secondDiv = true;
        }
        else if(!this.images.thirdImage){
            this.images.thirdImage = 'data:image/jpeg;base64,'+imageData;
            this.flagToShowIcons.thirdDiv = true;
            this.flagToShowIcons.flagToShowPhotoDiv = false;
        }
       }, (err) => {
        console.log(err);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrayerRequestPage');
  }

  sendToHomeScreen(){
    this.navCtrl.setRoot(HomeScreenPage);
  }

  showAlert(title,subtitle,buttonString) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [buttonString]
    });
    alert.present();
  }

  doneButton(){
    this.showEdit = true;
  }

  createPrayerRequest(){
    if(!this.prayermessage){
      this.showAlert("Message","No Prayer Message",'Dismiss');
      return;
    }
    this.abc();
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded' );
     let options = new RequestOptions({ headers: headers });
      var datas = {
        prayermessage : this.prayermessage || "",
        prayerimageone : this.images.firstImage || "",
        prayerimagetwo : this.images.secondImage || "",
        prayerimagethree : this.images.thirdImage || "",
        phonenumber : window.localStorage.phoneNumber
      };
      if(!datas.prayerimageone)
        delete datas.prayerimageone;
      else
        datas.prayerimageone = datas.prayerimageone.replace(/\+/g, '%2B');
      if(!datas.prayerimagetwo)
        delete datas.prayerimagetwo;
        else
          datas.prayerimagetwo = datas.prayerimagetwo.replace(/\+/g, '%2B');
      if(!datas.prayerimagethree)
        delete datas.prayerimagethree;
        else
          datas.prayerimagethree = datas.prayerimagethree.replace(/\+/g, '%2B');
      var params = 'data='+JSON.stringify(datas);
      this.http.post(window.localStorage.dns+"prayerrequest/create", params, options)
        .subscribe(msg => {
          console.log(msg);
          var x = JSON.parse(msg["_body"]);
          this.first.style.left = "0px";
          if(x.success == -1){
            this.showAlert("Message",x.error,'Dismiss');
          }else{
            //this.showAlert("Message","prayer request sent",'Dismiss');

            this.flagToShowIcons = {
                flagToShowPhotoDiv : true,
                mainDiv : false,
                firstDiv : false,
                secondDiv : false,
                thirdDiv : false,
                firstCross : false,
                secondCross : false,
                thirdCross : false
            };
            this.images = {
              firstImage : "",
              secondImage : "",
              thirdImage : ""
            };
            this.prayermessage = "";
           }
         }, error => {
          this.showAlert("Message","Error in creating profile",'Dismiss');
        });
  }
  showKeyBoard(){
    this.showEdit = false;
    this.keyboard.show();
  }
}
