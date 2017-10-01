import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { PrayerRequestPage } from '../prayer-request/prayer-request';
import { Newtest } from '../newtest/newtest';
import { RequestWaiting } from '../request-waiting/request-waiting';
import { HomePage } from '../home/home';
import { Whoispraying } from '../whoispraying/whoispraying';
import { Test } from '../test/test';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Invitation } from '../invitation/invitation';
import { DailyInspiration } from "../daily-inspiration/daily-inspiration";
import { Tithe } from "../tithe/tithe";
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { Badge } from '@ionic-native/badge';
import { Platform } from 'ionic-angular';

/**
 * Generated class for the HomeScreenPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-home-screen',
  templateUrl: 'home-screen.html',
})
export class HomeScreenPage {
  prayingWithMeCount = 0;
  dailyInspirationCount = 0;
  prayerCircleInvitationCount = 0;
  receivedprayerrequestsCount = 0;
  noOfExpireDays = 0;
  expireFlag = false;
  page = 'one';
  iap;
  showCancelButton = true;
  modalMessage;
  headers;
  options;
  modalFlag = false;
  productIds = ['cpp00001', 'cpp00002', 'cpp00003'];
  isDeviceTypeIOS = false;
  showHeading = false;

  constructor(public platform: Platform,public navCtrl: NavController,private http: Http, public navParams: NavParams,private ip: InAppPurchase, private badge: Badge) {
    console.log("ttt");
    if(this.platform.is('ios'))
        this.isDeviceTypeIOS = true;
    this.iap = ip;
    this.badge = badge;

    if(this.navParams.get("showSubscription")){
      this.page = "two";
      if(this.navParams.get("fromMyProfilePage"))
        this.showHeading = true;
    }else{
      this.loadProducts();
      this.getSubscriptionInfo();
      this.getNotification();
    }
    setInterval(() => {
          this.getNotification();
      },30*1000);
      this.headers = new Headers();
      this.headers.append("Accept", 'application/json');
      this.headers.append('Content-Type', 'application/x-www-form-urlencoded' );
      this.options = new RequestOptions({ headers: this.headers });
      this.getName();
  }

  getName(){
    var data = {
      phonenumber : window.localStorage.phoneNumber || ""
    };
    var params = 'data='+encodeURI(JSON.stringify(data));
     var url = window.localStorage.dns+"userprofile/get?"+params;
     this.http.get(url).map(res => res.json())
       .subscribe(msg => {
           window.localStorage.firstName = msg.firstname;
           window.localStorage.lastName = msg.lastname;
           window.localStorage.base64Image = msg.url;
       }, error => {
          //this.showAlert("Message","Error in receiving message",'Dismiss');
      });
  }

  getNotification(){
    var data = {
      phonenumber : window.localStorage.phoneNumber || ""
    };
    var params = 'data='+encodeURI(JSON.stringify(data));
     var url = window.localStorage.dns+"notification/get?"+params;
     this.http.get(url).map(res => res.json())
       .subscribe(msg => {
           this.prayingWithMeCount = msg.whoisprayingwithme;
           this.dailyInspirationCount = msg.dailyinspiration;
           this.prayerCircleInvitationCount = msg.prayercircleinvitations;
           this.receivedprayerrequestsCount = msg.receivedprayerrequests;
           window.localStorage.receivedPrayerRequestsCount = msg.receivedprayerrequests;
           this.badge.set(msg.notificationcount).then(function(data) {
               console.log(data);
           }).catch((error) =>
           { console.log(error); });
       }, error => {
          //this.showAlert("Message","Error in receiving message",'Dismiss');
      });
  }

  getSubscriptionInfo(){
    //if(window.sessionStorage.showModal)
      //return;
    var data = {
      phonenumber : window.localStorage.phoneNumber || ""
    };
    var params = 'data='+encodeURI(JSON.stringify(data));
     var url = window.localStorage.dns+"subscription/get?"+params;
     this.http.get(url).map(res => res.json())
       .subscribe(msg => {
          if(msg["subscription"] && msg["subscription"].length > 0){
              return;
          }
          if(msg["message"] && msg["lockapp"]){
            delete window.sessionStorage.modalMessage;
            this.showModal();
            this.modalMessage = msg["message"];
            this.showCancelButton = false;
          }else if(msg["message"]){
            var sessionStorageMessage = window.sessionStorage.modalMessage;
            if(sessionStorageMessage != msg["message"]){
               window.sessionStorage.modalMessage = msg["message"];
               this.showModal();
               this.modalMessage = msg["message"];
               window.sessionStorage.showModal = 1;
            }
          }
       }, error => {
          //this.showAlert("Message","Error in receiving message",'Dismiss');
      });
  }

  showPageTwo(){
    this.page = "two";
    this.showHeading = true;
  }

  showPageOne(){
    this.page = "one";
    this.getSubscriptionInfo();
    this.getNotification();
  }

  subscription(type){
      var productId = this.productIds[type];
      var subsdata;
      this.iap
      .subscribe(productId)
      .then((data) => {
        subsdata = JSON.stringify(data);
        this.storeSubscriptionInBackend(subsdata);
        this.navCtrl.push(HomeScreenPage);
        console.log(subsdata);
        //return this.iap.consume(data["type"], data["receipt"], data["signature"]);
      })
      .then((data) => {
        this.storeSubscriptionInBackend(subsdata);
      })
      .catch((err) => {
        var obj = {
          "transactionId": 1,
           "recipt": "123",
          "signature" : "234",
          "productType": productId
          };
        if(err.response == -1003 && err.code == -6){
          this.navCtrl.push(HomeScreenPage);
          this.storeSubscriptionInBackend(JSON.stringify(obj));
        }
        console.log(err);
        //this.showAlert("Message","Error in receiving message",'Dismiss');
      });
  }

  storeSubscriptionInBackend(subsdata){
      let data = {
        phonenumber : window.localStorage.phoneNumber,
        subscriptioninfo : subsdata,
        tithesubscriptionvalue : "0.0"
      };
      var params = 'data='+JSON.stringify(data);
      this.http.post(window.localStorage.dns+"subscription/store", params, this.options)
       .subscribe(msg => {
        console.log(msg);
        this.page = "one";
       }, error => {
        //window.localStorage.errorArray = data;
      });
  }

  closeModal(){
    this.modalFlag = false;
  }

  showModal(){
    this.modalFlag = true;
  }

  restore(){
    this.iap
      .restorePurchases()
      .then(function (purchases) {

      })
      .catch(function (err) {

      });
  };

  loadProducts(){
    this.iap
      .getProducts(this.productIds)
      .then(function (products) {

      })
      .catch(function (err) {
        console.log(err);
      });
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeScreenPage');
  }

  moveToTithe(){
    this.navCtrl.push(Tithe,{
      param : "fromHomeScreen"
    });
  }

  moveToTestPage(){
    this.navCtrl.push(Test);
  }

  moveToDailyinspiration() {
    this.navCtrl.push(DailyInspiration);
  }

  moveToPrayerRequest(){
    this.navCtrl.push(Newtest);
  }

  moveToInvitation(){
    this.navCtrl.push(Invitation);
  }

  moveToProfile(){
    this.navCtrl.push(HomePage,{
            param: 'edit'
          });
  }

  moveToRequestWaiting(){
    this.navCtrl.push(RequestWaiting);
  }

  moveToWhoIsPraying(){
    this.navCtrl.push(Whoispraying);
  }

}
