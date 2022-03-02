/*
  Authors : Mapweb (Ashwin Khandave)
  Website : https://mapwebtechnologies.com/
  App Name : Lionfish app
  Created : 25-Feb-2022
*/

import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController, NavController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  
   loader: any;
   isLoading = false;
   public translations: any[] = [];

  constructor(
  		public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private toastCtrl: ToastController,
        public router: Router,
        private navCtrl: NavController,
        private menuCtrl: MenuController
  ) { }
  
  getLanguage() {
    // return this.translateService.currentLang;
  }
  
  // Show the loader for infinite time
  async presentLoader(msg?) {
    if(typeof msg == 'undefined') msg = 'Please wait...';
	this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      translucent: true,
      message: msg,
	  mode: 'ios',
	  spinner: 'circular'
    });
    await loading.present();
  }
  
  // Hide the loader if already created otherwise return error
  hideLoader() {
    this.isLoading = false;
    this.loadingCtrl.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });
  }
  
	/*
		Show Warning Alert Message
		param : msg = message to display
		Call this method to show Warning Alert,
	*/
    async showWarningAlert(msg) {
        const alert = await this.alertCtrl.create({
            header: 'Warning',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    async showSimpleAlert(msg) {
        const alert = await this.alertCtrl.create({
            header: '',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

	/*
		 Show Error Alert Message
		 param : msg = message to display
		 Call this method to show Error Alert,
	*/
    async showErrorAlert(msg) {
        const alert = await this.alertCtrl.create({
            header: 'Error',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    /*
       param : email = email to verify
       Call this method to get verify email
    */
    async getEmailFilter(email) {
        const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
        if (!(emailfilter.test(email))) {
            const alert = await this.alertCtrl.create({
                header: 'Warning',
                message: 'Please enter valid email',
                buttons: ['OK']
            });
            await alert.present();
            return false;
        } else {
            return true;
        }
    }


	/*
		Show Toast Message on Screen
		param : msg = message to display, color= background
		color of toast example dark,danger,light. position  = position of message example top,bottom
		Call this method to show toast message
	*/
    shoNotification(msg, colors, positon) {
        this.translate(msg).then(async (data) => {
            const toast = await this.toastCtrl.create({
                message: data,
                duration: 2000,
                color: colors,
                position: positon
            });
            toast.present();
        });

    }

    async showToast(msg, colors?, pos?) {
	    if(typeof colors == "undefined" || colors == "") colors="danger";
		if(typeof pos == "undefined" || pos == "") pos="bottom";
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 4000,
            color: colors,
            position: pos,
            buttons: [
                {
                    text: 'Ok',
                    role: 'cancel',
                    handler: () => {
                        // console.log('Cancel clicked');
                    }
                }
            ]
        });
        toast.present();
    }

    errorToast(msg) {
        this.translate(msg).then(async (data) => {
            const toast = await this.toastCtrl.create({
                message: data,
                duration: 2000,
            });
            toast.present();
        });
   }
   
   translate(str): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const value = this.translations[str];
            if (value && value !== undefined) {
                console.log('hope');
                resolve(value);
            } else {
                console.log('nope');
                resolve(str);
            }
        });
   }
}