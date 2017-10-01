import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { HomeScreenPage } from '../home-screen/home-screen';
import 'rxjs/Rx';
import { Slides } from 'ionic-angular';

import {
  StackConfig,
  SwingStackComponent,
  SwingCardComponent
} from 'angular2-swing';
/**
 * Generated class for the Whoispraying page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-whoispraying',
  templateUrl: 'whoispraying.html',
})
export class Whoispraying {
@ViewChild('myswing1') swingStack: SwingStackComponent;
@ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;
@ViewChild(Slides) slides: Slides;

cards: Array<any>;
stackConfig: StackConfig;
recentCard: string = '';
noOfRequest = 1;
prayermessage = "";
pageData = {};
showEdit = true;
constructor(private http: Http,public navCtrl: NavController, public navParams: NavParams) {

}

doneButton(){
  this.showEdit = true;
}

showKeyBoard(){
  this.showEdit=false;
}

move(msg){
this.cards = msg.wipwmetoday || [];
  try{
  this.noOfRequest = msg.whoisprayingwithme;//this.cards.length;
  //var x = this.cards.length-1;
  //if(x > 1)
  //this.slides.slideTo(x, 500);
  }catch(err){console.log(err);}
}

/*ionViewDidLoad() {
        console.log(this.slides);\
        //this.m
  }*/

// Add new cards to our array
addNewCards() {
  var data = {
    phonenumber : window.localStorage.phoneNumber || ""
  };
  var params = 'data='+encodeURI(JSON.stringify(data));
   var url = window.localStorage.dns+"whoisprayingwithme/get?"+params;
   this.http.get(url).map(res => res.json())
     .subscribe(msg => {
         console.log(msg);
         this.move(msg);
     }, error => {
        //this.showAlert("Message","Error in receiving message",'Dismiss');
    });
}


//ngAfterViewInit() {
ionViewDidLoad(){
  this.cards = [{email: ''}];
  this.addNewCards();
}

sendToHomeScreen(){
  this.navCtrl.setRoot(HomeScreenPage);
}

}
