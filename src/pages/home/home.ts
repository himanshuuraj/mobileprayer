import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { Contacts } from '@ionic-native';
import {Prayercircle} from '../prayercircle/prayercircle';
import { Http, Headers, RequestOptions } from '@angular/http';
//import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  aboutPage = Prayercircle;
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

}
