import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HomeScreenPage } from '../home-screen/home-screen';
import {AlertController} from 'ionic-angular';
import 'rxjs/Rx';
import { Camera } from '@ionic-native/camera';
import {Platform} from 'ionic-angular';
import { Keyboard } from '@ionic-native/Keyboard';
import * as $ from 'jquery';
import { SampleModalPage } from '../sample-modal/sample-modal';
import { ModalController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';


import {
  StackConfig,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent,
  Direction
} from 'angular2-swing';
/**
 * Generated class for the Newtest page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-newtest',
  templateUrl: 'newtest.html',
})
export class Newtest {

  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

  cards: Array<any>;
  stackConfig: StackConfig;
  recentCard: string = '';
  noOfRequest = 1;
  prayermessage = "";
  pageData = {};
  showEdit = true;
  animate = false;
  anonymousFlag = false;
  timeOutVar;
  flagToShowIcons = {};
  images = {};
  flagOfAjaxCall = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingController:LoadingController, public platform: Platform, public camera: Camera,private http:Http,private alertCtrl: AlertController, public keyboard: Keyboard) {
    this.stackConfig = {
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.abs(offsetX) / (element.offsetWidth/2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 800;
      },
      allowedDirections: [Direction.RIGHT]
    };
    this.initializeVariables();
  }

  initializeVariables(){
    this.flagToShowIcons = {
        flagToShowPhotoDiv : true,
        mainDiv : false,
        firstDiv : false,
        secondDiv : false,
        thirdDiv : false,
        firstCross : false,
        secondCross : false,
        thirdCross : false
    };
    this.images = {
      firstImage : "",
      secondImage : "",
      thirdImage : ""
    };
    this.prayermessage = "";
  }

  onItemMove(element, x, y, r) {

    if(!this.prayermessage){
      return;
    }
    var color = '';
    var abs = Math.abs(x);
    let min = Math.trunc(Math.min(16*16 - abs, 16*16));
    let hexCode = this.decimalToHex(min, 2);
    if (x < 0) {
      color = '#FF' + hexCode + hexCode;
    } else {
      color = '#' + hexCode + 'FF' + hexCode;
    }
    var height = -this.platform.height();
    if(y < height)
      this.voteUp(true);
    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

  // Connected through HTML
  voteUp(type: boolean) {
    if(!type || !this.prayermessage || this.flagOfAjaxCall) return false;
    //if(!this.flagOfAjaxCall){
      this.flagOfAjaxCall = 1;
      //}else
      //return;

    this.cards = this.cards || [];
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded' );
    let options = new RequestOptions({ headers: headers });
      var datas = {
        prayermessage : this.prayermessage || "",
        prayerimageone : this.images["firstImage"] || "",
        prayerimagetwo : this.images["secondImage"] || "",
        prayerimagethree : this.images["thirdImage"] || "",
        phonenumber : window.localStorage.phoneNumber,
        anonymous : this.anonymousFlag
      };
      if(!datas.prayerimageone)
        delete datas.prayerimageone;
      else
        datas.prayerimageone = datas.prayerimageone.replace(/\+/g, '%2B');
      if(!datas.prayerimagetwo)
        delete datas.prayerimagetwo;
        else
          datas.prayerimagetwo = datas.prayerimagetwo.replace(/\+/g, '%2B');
      if(!datas.prayerimagethree)
        delete datas.prayerimagethree;
        else
          datas.prayerimagethree = datas.prayerimagethree.replace(/\+/g, '%2B');
      var params = 'data='+JSON.stringify(datas);
      this.http.post(window.localStorage.dns+"prayerrequest/create", params, options)
        .subscribe(msg => {
          var x = JSON.parse(msg["_body"]);
          if(x["success"] == 0)
            this.initializeVariables();
         }, error => {
          console.log(error);
          this.showAlert("Message","Error in creating request",'Dismiss');
        });
        this.animateFunction();
  }

  showAlert(title,subtitle,buttonString) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [buttonString]
    });
    alert.present();
  }

  animateFunction(){
    this.showEdit = false;
    this.animate = true;
    setTimeout(() => {
        $.ajax({
            type: 'GET',
            url: window.localStorage.dns+'animation/prayerrequest?data=%7B%22phonenumber%22%3A%22'+window.localStorage.phoneNumber+'%22%7D&phonenumber='+window.localStorage.phoneNumber,
            async:false,
            success: function(data) {
                var text = data['text'];
                var verse = data['verse'];
                var imagesrc = data['coversize'];
                imagesrc = "assets/images/dailyinspirationlogo.png";
                $('#animpart1').attr('src', imagesrc);
                $('#textverse').text(text);
                $('#verse').text(verse);
                $('#animpart1').fadeIn(20).delay(1500).fadeOut(2500);
                $('#animpart2').delay(35).fadeIn(5500);
            },
        fail: function() {
              var text = 'He does not faint or grow weary; his understanding is unsearchable';
              var verse = 'Isaiah 40:29';
              var imagesrc = 'https://cdn.athemes.com/wp-content/uploads/Original-JPG-Image.jpg';
              $('#animpart1').attr('src', imagesrc);
              $('#textverse').text(text);
              $('#verse').text(verse);
              $('#animpart1').fadeIn(20).delay(1500).fadeOut(2500);
              $('#animpart2').delay(35).fadeIn(5500);
          }
        });
    },50);
    this.timeOutVar = setTimeout(() => {
        this.navCtrl.setRoot(HomeScreenPage);
    },8500);
  }

  // Add new cards to our array
  addNewCards() {
    var data = {
      phonenumber : window.localStorage.phoneNumber || ""
    };
    var params = 'data='+encodeURI(JSON.stringify(data));
    var url = window.localStorage.dns+"prayerrequest/getallreceived?"+params;
    this.http.get(url).map(res => res.json())
      .subscribe(msg => {
          //console.log(msg);
          this.cards = msg.receivedprayerrequests || [];
          this.noOfRequest = this.cards.length;
          if(this.noOfRequest)
            this.pageData = this.cards.pop();
          else
            this.pageData = {};
      }, error => {
         //this.showAlert("Message","Error in receiving message",'Dismiss');
     });
  }

  decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
      hex = "0" + hex;
    }

    return hex;
  }

  doneButton(){
    this.showEdit = true;
    setTimeout(() => {
      try{
        var x = document.getElementById("doneButton");
        x.style.bottom = "100px";
        x = document.getElementById("anonymous");
        x.style.bottom = "160px";
      }catch(e){}
    },0);
  }

  ngAfterViewInit() {
    // Either subscribe in controller or set in HTML
    this.swingStack.throwin.subscribe((event: DragEvent) => {
      event.target.style.background = '#ffffff';
    });

    this.cards = [{email: ''}];
  }

  sendToHomeScreen(){
    this.navCtrl.setRoot(HomeScreenPage);
    if(this.timeOutVar)
      clearTimeout(this.timeOutVar);
  }

  showKeyBoard(){
    this.showEdit = false;
    setTimeout(()=> {
      try{
        this.keyboard.show();
        //document.getElementById("textarea").focus();
        document.getElementsByTagName("textarea")[0].focus();
      }catch(err){}
    },100);
  }

  showCross(type){
    if(type == "first"){
        if(this.images["firstImage"])
          this.flagToShowIcons["firstCross"] = true;
    }
    else if(type == "second"){
        if(this.images["secondImage"])
          this.flagToShowIcons["secondCross"] = true;
    }
    else if(type == "third"){
        if(this.images["thirdImage"])
          this.flagToShowIcons["thirdCross"] = true;
    }
  }

  addPhoto(){
    this.camera.getPicture({
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        destinationType: this.camera.DestinationType.DATA_URL,
        correctOrientation: true
      }).then((imageData) => {
        this.flagToShowIcons["mainDiv"] = true;
        if(!this.images["firstImage"]){
            this.images["firstImage"] = 'data:image/jpeg;base64,'+imageData;
            this.flagToShowIcons["firstDiv"] = true;
            this.flagToShowIcons["secondDiv"] = true;
            this.flagToShowIcons["thirdDiv"] = true;
        }
        else if(!this.images["secondImage"]){
            this.images["secondImage"] = 'data:image/jpeg;base64,'+imageData;
            this.flagToShowIcons["secondDiv"] = true;
        }
        else if(!this.images["thirdImage"]){
            this.images["thirdImage"] = 'data:image/jpeg;base64,'+imageData;
            this.flagToShowIcons["thirdDiv"] = true;
            this.flagToShowIcons["flagToShowPhotoDiv"] = false;
        }
       }, (err) => {
        console.log(err);
      });
  }

  removeImage(param){
    if(param == "first"){
      this.images["firstImage"] = this.images["secondImage"];
      this.images["secondImage"] = this.images["thirdImage"];
      this.flagToShowIcons["firstCross"] = false;
      if(!this.images["secondImage"])
        this.flagToShowIcons["secondCross"] = false;
    }else if(param == "second"){
      this.images["secondImage"] = this.images["thirdImage"];
      this.flagToShowIcons["secondCross"] = false;
    }
      this.images["thirdImage"] = "";
      this.flagToShowIcons["thirdCross"] = false;
    if(!this.images["firstImage"] || !this.images["secondImage"] || !this.images["thirdImage"]){
      this.flagToShowIcons["flagToShowPhotoDiv"] = true;
    }
    if(!this.images["firstImage"] && !this.images["secondImage"] && !this.images["thirdImage"]){
      this.flagToShowIcons["mainDiv"] = false;
    }
  }

}
