import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HomeScreenPage } from '../home-screen/home-screen';
import 'rxjs/Rx';
import { SampleModalPage } from '../sample-modal/sample-modal';
import { ModalController } from 'ionic-angular';
import * as $ from 'jquery';
import {Platform} from 'ionic-angular';
import { Keyboard } from '@ionic-native/Keyboard';
import { LoadingController } from 'ionic-angular';

import {
  StackConfig,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent
} from 'angular2-swing';
/**
 * Generated class for the Test page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class Test {

  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

  cards: Array<any> = [];
  stackConfig: StackConfig;
  recentCard: string = '';
  noOfRequest = 1;  // this is for cards
  prayermessage = "";
  pageData = {};
  showEdit = true;
  headers
  options;
  timeOutVar;
  animate = false;
  imageCache = [];
  loading:any;
  totalNoOfReuests = parseInt(window.localStorage.receivedPrayerRequestsCount);
  counter = 0;

  openModal(data,type) {
    var x = {};
    if(type=="text")
      x["text"] = data;
    else
      x["image"] = data;
    let myModal = this.modalCtrl.create(SampleModalPage,x);
    myModal.present();
  }

  constructor(private http: Http,public platform:Platform, public navCtrl: NavController,public loadingController:LoadingController, public keyboard : Keyboard, public navParams: NavParams, public modalCtrl: ModalController) {
    this.stackConfig = {
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.abs(offsetX) / (element.offsetWidth/2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 800;
      }
    };
    this.headers = new Headers();
    this.headers.append("Accept", 'application/json');
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded' );
    this.options = new RequestOptions({ headers: this.headers });
  }

  insertImageInCache(){
    var length = this.cards.length;
    for(var index = 0; index < length ; index++){
      $.ajax({
          type: 'GET',
          url: window.localStorage.dns+'animation/prayerresponse?data=%7B%22phonenumber%22%3A%22'+window.localStorage.phoneNumber+'%22%7D&phonenumber='+window.localStorage.phoneNumber,
          async:false,
          success: (data) => {
              this.imageCache.push(JSON.stringify(data));
          },
      fail: () => {
            var data = {};
            data['text'] = 'He does not faint or grow weary; his understanding is unsearchable';
            data['verse'] = 'Isaiah 40:29';
            data['imagesrc'] = 'https://cdn.athemes.com/wp-content/uploads/Original-JPG-Image.jpg';
            this.imageCache.push(JSON.stringify(data));
        }
      });
    }
  }


  strictPrayerMessageCharacters(){
    if(this.prayermessage && this.prayermessage.length > 300){
      this.prayermessage = this.prayermessage.substring(0,300);
    }
  }

  doneButton(){
    setTimeout(()=>{
      var x = document.getElementById((this.noOfRequest-1)+"Message");
      if(x)
        x.innerHTML = this.prayermessage;
    },100);

    this.showEdit = true;
  }

   animateFunction(){
     this.showEdit = false;
     this.animate = true;
      setTimeout(() => {
         var data = this.imageCache.pop() || "";
         if(data != "")
          data = JSON.parse(data);
         else
          data = {};
         var text = data['text'] || 'He does not faint or grow weary; his understanding is unsearchable';
         var verse = data['verse'] || 'Isaiah 40:29';
         var imagesrc = data['coversize'] || 'https://cdn.athemes.com/wp-content/uploads/Original-JPG-Image.jpg';
         $('#animpart1').attr('src', imagesrc);
         $('#textverse').text(text);
         $('#verse').text(verse);
         $('#animpart1').fadeIn(20).delay(1500).fadeOut(2500);
         $('#animpart2').delay(35).fadeIn(5500);
     },50);
     this.timeOutVar = setTimeout(() => {
         this.showEdit = true;
         this.animate = false;
     },8500);
   }

  showKeyBoard(){
    setTimeout(()=> {
      this.keyboard.show();
      //document.getElementById("textarea").focus();
      document.getElementsByTagName("textarea")[0].focus();
    },100);
    this.showEdit = false;
  }

  onItemMove(element, x, y, r) {
    //var color = '';
    //var abs = Math.abs(x);
    //let min = Math.trunc(Math.min(16*16 - abs, 16*16));
    //let hexCode = this.decimalToHex(min, 2);

    /*if (x < 0) {
      color = '#FF' + hexCode + hexCode;
    } else {
      color = '#' + hexCode + 'FF' + hexCode;
    }*/
    var height = -this.platform.height();
    if(y < height){
      //this.voteUp(true);
      if(this.counter == 0){
        this.counter = 1;
        this.voteUp(true);
        setTimeout(()=>{
          this.counter = 0;
        },400);
      }
      console.log(x+" "+y+ " " + height);
    }
    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

  // Connected through HTML
  voteUp(type: boolean) {
    console.log("sent");
    this.cards = this.cards || [];
    this.noOfRequest = this.cards.length;
    var pageData = {};
    if(this.noOfRequest){ // if > 0
      this.totalNoOfReuests -= 1;
      pageData = this.cards.pop();
    }
    let data = {
       message: this.prayermessage,
       phonenumber: window.localStorage.phoneNumber,
       prayerid: pageData["prayerid"],
       userid :  window.localStorage.phoneNumber,
       accepted : type,
       username : window.localStorage.firstName + " " + window.localStorage.lastName,
       url : window.localStorage.profileUrl
    };
    var params = 'data='+JSON.stringify(data);
    if(this.prayermessage)
      this.animateFunction();
    this.prayermessage = "";
    this.noOfRequest = this.cards.length;
    if(this.noOfRequest == 0){
      this.loading = this.loadingController.create({content : "please wait..."});
      this.loading.present();
    }
    this.http.post(window.localStorage.dns+"prayerresponse/create", params, this.options)
     .subscribe(msg => {
       if(!this.noOfRequest)
         this.addNewCards();
     }, error => {
       console.log(error);
       if(this.noOfRequest == 0)
         this.addNewCards();
        if(this.loading)
          this.loading.dismissAll();
        this.loading = "";
    });
  }

  // Add new cards to our array
  addNewCards() {
      if(!this.loading){
        this.loading = this.loadingController.create({content : "please wait..."});
        this.loading.present();
      }
      var data = {
        phonenumber : window.localStorage.phoneNumber || ""
      };
      var params = 'data='+encodeURI(JSON.stringify(data));
      var url = window.localStorage.dns+"prayerrequest/getnextset?"+params;
      this.http.get(url).map(res => res.json())
        .subscribe(msg => {
            msg.receivedprayerrequests = msg.receivedprayerrequests.reverse();
            this.cards = this.cards.concat(msg.receivedprayerrequests) || [];
            this.noOfRequest = this.cards.length;
            if(this.loading)
              this.loading.dismissAll();
            this.loading = "";
            this.insertImageInCache();
        }, error => {
           if(this.loading)
              this.loading.dismissAll();
           this.loading = "";
       });
  }

  // http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
  decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
      hex = "0" + hex;
    }

    return hex;
  }

  ngAfterViewInit() {
    try{
      this.swingStack.throwin.subscribe((event: DragEvent) => {
        event.target.style.background = '#ffffff';
      });
    }catch(err){}
    this.cards = [];
    this.addNewCards();
  }

  sendToHomeScreen(){
    this.navCtrl.setRoot(HomeScreenPage);
    if(this.timeOutVar)
      clearTimeout(this.timeOutVar);
  }

}
