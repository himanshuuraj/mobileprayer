import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HomeScreenPage } from '../home-screen/home-screen';
import { HomePage } from '../home/home';
import {AlertController} from 'ionic-angular';
/**
 * Generated class for the Auth page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.

Status type = 0 // authorization unsuccessful
       type = 1 // authorization successful and no profile exists


 */
@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class Auth {

  page = 'first';
  headers;
  options;
  phoneNumber;
  countryCode
  code
  fail = false;
  constructor(private http: Http,public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
      this.headers = new Headers();
      this.headers.append("Accept", 'application/json');
      this.headers.append('Content-Type', 'application/x-www-form-urlencoded' );
      this.options = new RequestOptions({ headers: this.headers });
      if(window.localStorage.profileCreationStatus == 1){
        this.phoneNumber = window.localStorage.phoneNumber;
        this.page = 'second';
      }
  }

  filterPhoneNumber(){
      if(!this.phoneNumber)
        return;
      this.phoneNumber = this.phoneNumber.split("-").join("");
  }

  sendCode(){
      this.filterPhoneNumber();
      let data = {
         phonenumber: this.phoneNumber,
         countrycode : this.countryCode || '1'
      };
      var params = 'data='+JSON.stringify(data);
      this.http.post(window.localStorage.dns+"authorization/send", params, this.options)
       .subscribe(msg => {
        console.log(msg);
        this.page = "second";
       }, error => {
      });
  }

  verify(){
      this.filterPhoneNumber();
      let data = {
         phonenumber: this.phoneNumber,
         code : this.code
      };
      var params = 'data='+JSON.stringify(data);
      this.http.post(window.localStorage.dns+"authorization/verify", params, this.options)
       .subscribe(msg => {
        console.log(msg);
        var msgg = msg["_body"];
        msgg = JSON.parse(msgg);
        window.localStorage.phoneNumber = this.phoneNumber;
        if(msgg.success == 0){
          if(msgg.existingprofile && msgg.prayercircle == true){
            delete window.localStorage.firstName;
            delete window.localStorage.lastName;
            delete window.localStorage.profileCreationStatus;
            this.navCtrl.setRoot(HomeScreenPage);
          }else if(msgg.prayercircle == false){
            window.localStorage.profileCreationStatus = 3;
            this.navCtrl.setRoot(HomePage,{
              param : "contact"
            });
          }
          else{
            window.localStorage.profileCreationStatus = 2;
            this.navCtrl.setRoot(HomePage,{
              param : "firstTimeAccount"
            });
          }
        }
        else{
          this.fail = true;
          window.localStorage.profileCreationStatus = 1;
        }
       }, error => {
       alert("Network error");
      });
  }

  keyDown(e){
    console.log(e);
    //if(e.key)
    if(!this.phoneNumber)
      return;
    if(this.phoneNumber.length > 12 && e.code.toString().includes("Digit")){
      this.phoneNumber = this.phoneNumber.substring(0,this.phoneNumber.length-1);
      return;
    }
    if(!e.code.toString().includes("Digit")){
      this.phoneNumber = this.phoneNumber.substring(0,this.phoneNumber.length-1);
    }
    if(this.phoneNumber.length == 4 )
      this.phoneNumber = this.phoneNumber.substring(0,3) + "-" + this.phoneNumber.substring(3);
    if(this.phoneNumber.length == 8 )
      this.phoneNumber = this.phoneNumber.substring(0,7) + "-" + this.phoneNumber.substring(7);
  }

  resendCode(){
      this.filterPhoneNumber();
      let data = {
         phonenumber: this.phoneNumber,
         countrycode : this.countryCode || '1'
      };
      var params = 'data='+JSON.stringify(data);
      this.http.post(window.localStorage.dns+"authorization/resend", params, this.options)
       .subscribe(msg => {
        console.log(msg);
        //window.localStorage.phoneNumber = this.phoneNumber;
        this.showAlert("Message","code resent");
       }, error => {
       alert("Network error");
      });
  }

  showAlert(title,subtitle,buttonString = "ok") {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [buttonString]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Auth');
  }

}
