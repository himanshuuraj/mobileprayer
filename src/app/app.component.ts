import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/Keyboard'
import { HomeScreenPage } from '../pages/home-screen/home-screen';
import { Auth } from '../pages/auth/auth';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { HomePage } from '../pages/home/home';
import { Prayercircle }  from '../pages/prayercircle/prayercircle';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, keyboard : Keyboard,private iap: InAppPurchase) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      window.localStorage.dns = "http://api.cprayerpower.com/cpp/";
      if(!window.localStorage.profileCreationStatus && window.localStorage.phoneNumber){
        this.rootPage = HomeScreenPage;
      }else if(window.localStorage.profileCreationStatus == 2){
        this.rootPage = HomePage;
      }else if(window.localStorage.profileCreationStatus == 3){
        this.rootPage = HomePage;
      }
      else
        this.rootPage = Auth;
    });
  }


}
