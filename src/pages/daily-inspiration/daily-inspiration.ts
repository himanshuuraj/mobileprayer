import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import { HomeScreenPage } from '../home-screen/home-screen';
/**
 * Generated class for the DailyInspiration page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-daily-inspiration',
  templateUrl: 'daily-inspiration.html',
})
export class DailyInspiration {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    $(document).ready(
      function() {
          $.ajax({
              type: 'GET',
              url: window.localStorage.dns+'animation/dailyinspiration?data=%7B%22phonenumber%22%3A%22'+window.localStorage.phoneNumber+'%22%7D&phonenumber='+window.localStorage.phoneNumber,
              async:false,
              success: function(data) {
                  var text = data['text'];
                  var verse = data['verse'];
                  var imagesrc = data['coversize'];
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
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DailyInspiration');
  }

  sendToHomeScreen(){
    this.navCtrl.setRoot(HomeScreenPage);
  }

}
