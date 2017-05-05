import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { Contacts } from '@ionic-native';
//import {Prayercircle} from '../prayercircle/prayercircle';
//import {Prayercircle} from '../home/home';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Camera } from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  //aboutPage = Prayercircle;
  modalElement
  imageUploadFlag = false;
  base64Image;
  firstName
  lastName
  phoneNumber
  reEnteredPhoneNumber
  constructor(public navCtrl: NavController, private http:Http,public camera: Camera) {
    this.modalElement = document.getElementById("modalElement");
  }

  openFilters(){
    //this.navCtrl.setRoot(this);
  }

  sendData(){

      if(this.phoneNumber != this.reEnteredPhoneNumber){
        alert("Phone Numbers are not matching");
        return;
      }
      var headers = new Headers();
      headers.append("Accept", 'application/json');
     headers.append('Content-Type', 'application/x-www-form-urlencoded' );
     let options = new RequestOptions({ headers: headers });

     let datas = {
       data : {
         firstname: this.firstName,
         lastname: this.lastName,
         phonenumber: this.phoneNumber
       }
     };

     this.http.post("http://35.166.81.58/cpp/noimageprofile/create", datas, options)
       .subscribe(data => {
         console.log(data);
        }, error => {
         console.log(error._data);// Error getting the data
       });
  }

  getImageFromGallery(){
    console.log(this.camera);
    this.camera.getPicture({
       sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
       destinationType: this.camera.DestinationType.DATA_URL
      }).then((imageData) => {
        this.imageUploadFlag = true;
        this.base64Image = 'data:image/jpeg;base64,'+imageData;
       }, (err) => {
        console.log(err);
      });
  }

  showModal(){
    this.modalElement = document.getElementById("modalElement");
    this.modalElement.style.display = "block";
  }

}
