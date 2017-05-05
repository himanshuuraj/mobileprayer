import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { Contacts } from '@ionic-native';
import {Prayercircle} from '../prayercircle/prayercircle';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Camera } from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  aboutPage = Prayercircle;
  imageUploadFlag = false;
  base64Image
  constructor(public navCtrl: NavController, private http:Http) {

  }

  openFilters(){
    this.navCtrl.setRoot(this.aboutPage);
  }

  sendData(){
      var headers = new Headers();
      headers.append("Accept", 'application/json');
     headers.append('Content-Type', 'application/json' );
     let options = new RequestOptions({ headers: headers });

     let postParams = {
       title: 'foo',
       body: 'bar',
       userId: 1
     }

     this.http.post("http://jsonplaceholder.typicode.com/posts", postParams, options)
       .subscribe(data => {
         console.log(data['_body']);
        }, error => {
         console.log(error);// Error getting the data
       });
  }


  getImageFromGallery(){
    console.log(Camera);
    Camera.getPicture({
       sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
       destinationType: Camera.DestinationType.DATA_URL
      }).then((imageData) => {
        this.base64Image = 'data:image/jpeg;base64,'+imageData;
       }, (err) => {
        console.log(err);
      });
  }

}
