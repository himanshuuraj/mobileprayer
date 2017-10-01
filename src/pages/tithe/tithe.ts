import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomeScreenPage } from '../home-screen/home-screen';
import { Http, Headers, RequestOptions } from '@angular/http';

/**
 * Generated class for the Tithe page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tithe',
  templateUrl: 'tithe.html',
})
export class Tithe {

  page;//='first';
  churchNumber = 0;
  headers;
  options;
  zipcode;
  churchDataArray = [];
  selectedChurch = {};
  showHeading = false;

  constructor(private http: Http,public navCtrl: NavController, public navParams: NavParams) {
      this.headers = new Headers();
      this.headers.append("Accept", 'application/json');
      this.headers.append('Content-Type', 'application/x-www-form-urlencoded' );
      this.options = new RequestOptions({ headers: this.headers });
      var param = this.navParams.get("param");
      //if(param == "fromHomeScreen")
        //this.showHeading = true;
      this.getTitheInfo();
  }

  getTitheInfo(){
      var data = {
        phonenumber : window.localStorage.phoneNumber || ""
      };
      var params = 'data='+encodeURI(JSON.stringify(data));
      var url = window.localStorage.dns+"subscription/get?"+params;
      this.http.get(url).map(res => res.json())
        .subscribe(msg => {
          if(!msg["subscription"]){
            this.navCtrl.push(HomeScreenPage,{
              showSubscription : true
            });
            return;
          }
          if(msg["tithed"]){
            this.selectedChurch = msg["churchinfo"];
            this.page = 'second';
          }else
            this.page = 'first';
        }, error => {
           //this.showAlert("Message","Error in receiving message",'Dismiss');
       });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Tithe');
  }

  removeChurch(church){
    this.selectedChurch = church;
    console.log(church);
    this.page = 'second';
    this.sendDataToServer();
  }


  sendDataToServer(){
      let data = {
        phonenumber : window.localStorage.phoneNumber,
        churchid : this.selectedChurch["id"],
        tithesubscriptionvalue : "0.0"
      };
      var params = 'data='+JSON.stringify(data);
      this.http.post(window.localStorage.dns+"titheuser/update", params, this.options)
       .subscribe(msg => {
        console.log(msg);
       }, error => {
        //window.localStorage.errorArray = data;
      });
  }


  editTithing(){
    this.page = 'first';
  }

  sendToHomeScreen(){
    this.navCtrl.setRoot(HomeScreenPage);
  }

  next(){
    let data = {
       churchid: this.selectedChurch["id"],
       phonenumber: window.localStorage.phoneNumber,
       tithesubscriptionvalue : "abc"
    };
    var params = 'data='+JSON.stringify(data);
    this.http.post(window.localStorage.dns+"titheuser/update", params, this.options)
     .subscribe(msg => {
     }, error => {
    });
  }

  moveBack(){
    this.page = 'first';
  }

  getChurchData(){
      var data = {
        phonenumber : window.localStorage.phoneNumber || "",
        zipcode : this.zipcode
      };
      var params = 'data='+encodeURI(JSON.stringify(data));
      var url = window.localStorage.dns+"churchlist/get?"+params;
      this.http.get(url).map(res => res.json())
        .subscribe(msg => {
            console.log(msg);
            this.page = 'fourth';
            this.churchDataArray = msg.data;
        }, error => {
           //this.showAlert("Message","Error in receiving message",'Dismiss');
       });
  }

}
