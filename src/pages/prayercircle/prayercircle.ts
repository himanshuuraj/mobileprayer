import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomeScreenPage } from '../home-screen/home-screen';
//import { HomePage } from '../home/home';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Contacts } from '@ionic-native/contacts';
import {AlertController} from 'ionic-angular';

/**
 * Generated class for the Prayercircle page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prayercircle',
  templateUrl: 'prayercircle.html'
})
export class Prayercircle {
  contactsArray = [];
  dataToSend = [];
  constructor(public navCtrl: NavController,public navParams: NavParams, private http:Http,private alertCtrl: AlertController,public contact: Contacts) {

      this.contactsArray = navParams.get("contactsArray");
      this.contactsArray.sort(function(a,b){
        if(a.name > b.name)
          return 1;
        if(a.name < b.name)
          return -1;
      });
      this.dataToSend = [];//JSON.parse(JSON.stringify(this.contactsArray));

  }

  sendContacts(){
    var data = this.dataToSend || [];
    if(this.dataToSend.length == 0){
      alert("Please select a contact");
      return 1;
    }
    data.sort(function(a,b){
      if(a.name > b.name)
        return 1;
      if(a.name < b.name)
        return -1;
    });
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded' );
     let options = new RequestOptions({ headers: headers });
      var datas = {
        phonenumber : window.localStorage.phoneNumber || "8901",
        phonecontacts : data,
        fof : this.navParams.get("fof")
      }
      var params = 'data='+JSON.stringify(datas);
      this.http.post(window.localStorage.dns+"phonecontacts/update", params, options)
        .subscribe(msg => {
          delete window.localStorage.profileCreationStatus;
         }, error => {
          this.showAlert("Message","Error in creating profile",'Dismiss');
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
    console.log('ionViewDidLoad Prayercircle');
  }

  removeContact(name,phonenumber, item){
    this.dataToSend = this.dataToSend || [];
    var flag = 0;
    for(var index = 0; index < this.dataToSend.length; index++){
      if(this.dataToSend[index].name == name){
        this.dataToSend.splice(index,1);
        flag = 1;
        item.checked = false;
        break;
      }
    }
    if(!flag){
      var x = {};
      x["name"] = name;
      x["phonenumber"] = phonenumber;
      this.dataToSend.push(x);
      item.checked = true;
    }
  }

 openHomeScreen(){
    if(this.sendContacts() == 1)
      return;
    this.navCtrl.setRoot(HomeScreenPage);
 }



}
