import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomeScreenPage } from '../home-screen/home-screen';
import { Http, Headers, RequestOptions } from '@angular/http';
import {AlertController} from 'ionic-angular';
import {Platform} from 'ionic-angular';
import { Keyboard } from '@ionic-native/Keyboard';
/**
 * Generated class for the RequestWaiting page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-request-waiting',
  templateUrl: 'request-waiting.html',
})
export class RequestWaiting {

flagToShowIcons = {
    flagToShowPhotoDiv : true,
    mainDiv : false,
    firstDiv : false,
    secondDiv : false,
    thirdDiv : false,
    firstCross : false,
    secondCross : false,
    thirdCross : false
};
images = {
  firstImage : "a",
  secondImage : "a",
  thirdImage : "a"
};
showEdit = true;
noOfRequest = 0;
doneButton(){
  this.showEdit = true;
}
pageData = {
  prayerimages : 0,
  prayermessage : 0
};
receivedprayerrequests = [];
constructor(public navCtrl: NavController, public navParams: NavParams,public platform: Platform, private http:Http,private alertCtrl: AlertController,public keyboard: Keyboard) {

var headers = new Headers();
headers.append("Accept", 'application/json');
headers.append('Content-Type', 'application/x-www-form-urlencoded' );
 //let options = new RequestOptions({ headers: headers });
  var data = {
    phonenumber : window.localStorage.phoneNumber || ""
  };

  var params = 'data='+encodeURI(JSON.stringify(data));
  var url = window.localStorage.dns + "prayerrequest/getallreceived?"+params;
  console.log(url);
  this.http.get(url).map(res => res.json())
    .subscribe(msg => {
        //this.showAlert("Message","prayer request sent",'Dismiss');
        console.log(msg);
        this.receivedprayerrequests = msg.receivedprayerrequests || [];
        this.noOfRequest = this.receivedprayerrequests.length;

        if(this.noOfRequest > 0)
          this.pageData = this.receivedprayerrequests[this.noOfRequest-1];

    }, error => {
       this.showAlert("Message","Error in receiving message",'Dismiss');
   });
}

  sendToHomeScreen(){
    this.navCtrl.setRoot(HomeScreenPage);
  }

  leftClick = function(){
    this.ajaxCallToSend(false);
  }

  rightClick = function(){
    this.ajaxCallToSend(true);
  }

  ajaxCallToSend = function(type){
  var headers = new Headers();
  headers.append("Accept", 'application/json');
  headers.append('Content-Type', 'application/x-www-form-urlencoded' );
  let options = new RequestOptions({ headers: headers });
  let data = {
     message: this.prayermessage,
     phonenumber: window.localStorage.phoneNumber,//this.pageData.phonenumber,
     prayerid: this.pageData.prayerid,
     userid :  window.localStorage.phoneNumber,
     accepted : type
  };
  var params = 'data='+JSON.stringify(data);
  this.first = document.getElementById("first");
  var width = this.platform.width();
  this.noOfRequest = this.receivedprayerrequests.length;
  var t1 = setInterval(function(){
    if(!this.first){
      clearInterval(t1);
      return;
    }
    var t = this.first.style.left;
    t = t.substring(0,t.length-2);
    t = parseInt(t);
    if(type){
      t = t+8;
      if(t>width){
        clearInterval(t1);
        this.first.style.left = "0px";
        //this.navCtrl.setRoot(HomeScreenPage);
      }
      else{
        this.first.style.left = t + "px";
      }
    }else{
      t = t-8;
      var x = -1 * width;
      if(t<x){
        clearInterval(t1);
        this.first.style.left = "0px";
      }
      else{
        this.first.style.left = t + "px";
      }
    }

  },6);
  this.http.post(window.localStorage.dns + "prayerresponse/create", params, options)
   .subscribe(msg => {
      this.prayermessage = "";
      this.noOfRequest = this.receivedprayerrequests.length-1;
     this.receivedprayerrequests.splice(this.noOfRequest,1);
     this.noOfRequest;// = this.receivedprayerrequests.length;
     if(this.noOfRequest <= 0){
       this.pageData = {};
     }else{
        this.pageData = this.receivedprayerrequests[this.noOfRequest-1];
     }
      /*if(type)
        this.index++;
        if(this.index >= 0){
          this.index++;
          this.pageData = this.receivedprayerrequests[this.index];
        }else{
          //this.navCtrl.setRoot(HomeScreenPage);
        }
      }else if(type == false){
        if(this.index >= 0){
          //this.index--;
          this.pageData = this.receivedprayerrequests[this.index];
        }else{
          this.navCtrl.setRoot(HomeScreenPage);
        }
      }*/
    }, error => {
    this.showAlert("Message","Network Error",'Dismiss');
   });
  }

  showAlert(title,subtitle,buttonString) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [buttonString]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestWaiting');
  }

  showKeyBoard(){
    this.showEdit=false;
    this.keyboard.show();
  }
}
