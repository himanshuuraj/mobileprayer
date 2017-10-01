import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HomeScreenPage } from '../home-screen/home-screen';
import {AlertController} from 'ionic-angular';
import 'rxjs/Rx';
import { Camera } from '@ionic-native/camera';
import {Platform} from 'ionic-angular';
import { Keyboard } from '@ionic-native/Keyboard';

/**
 * Generated class for the Invitation page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-invitation',
  templateUrl: 'invitation.html',
})
export class Invitation {

  invitationArray = [];
  friends = [];
  fofriends = [];
  headers;
  options;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public camera: Camera,private http:Http,private alertCtrl: AlertController, public keyboard: Keyboard){

      this.headers = new Headers();
      this.headers.append("Accept", 'application/json');
      this.headers.append('Content-Type', 'application/x-www-form-urlencoded' );
      this.options = new RequestOptions({ headers: this.headers });
      this.showFriends();
  }

  showFriends(){
    var data = {
      phonenumber : window.localStorage.phoneNumber || ""
    };
    var params = 'data='+encodeURI(JSON.stringify(data));
    var url = window.localStorage.dns+"prayercircle/get?"+params;
    this.http.get(url).map(res => res.json())
      .subscribe(msg => {
        console.log(msg);
        this.invitationArray = msg.prayercircleinvitations || [];
        this.friends = msg.friends || [];
        this.fofriends = msg.foflist || [];

        this.friends.sort(function(a, b){
          if ( a.name < b.name )
            return -1;
          if ( a.name > b.name )
            return 1;
          return 0;
        });

        this.fofriends.sort(function(a, b){
          if ( a.name < b.name )
            return -1;
          if ( a.name > b.name )
            return 1;
          return 0;
        });

      }, error => {
       //this.showAlert("Message","Error in creating profile",'Dismiss');
     });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Invitation');
  }

  swipeLeft(i){
    var data = this.invitationArray.splice(i,1);
    this.makeAjaxCall(data,false);
  }

  makeAjaxCall(invitation,type){
    let data = {
       phonenumber: window.localStorage.phoneNumber,
       accepted : type,
       contactphone : invitation[0].phonenumber
    };
    var params = 'data='+JSON.stringify(data);
    this.http.post(window.localStorage.dns+"prayercircle/accept", params, this.options)
     .subscribe(msg => {
     this.showFriends();
     console.log(msg);
     }, error => {
     console.log(error);
    });
  }

  swipeRight(i){
    var data = this.invitationArray.splice(i,1);
    this.makeAjaxCall(data,true);
  }

  sendToHomeScreen(){
    this.navCtrl.setRoot(HomeScreenPage);
  }

}
