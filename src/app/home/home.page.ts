import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { MenuController,Platform, ModalController } from '@ionic/angular';
import { UtilService } from '../services/util.service';
import { ApiService } from '../api.service';

import { TranslateService } from '@ngx-translate/core'; 

import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: [
    './styles/home.page.scss',
    './styles/home.shell.scss',
    './styles/home.responsive.scss'
  ]
})
export class HomePage { 
  errors: any;
  language: string = this.translateService.currentLang;

  
	
	slider;
	slideOpts = {
		slidesPerView: 3,
	};
	
	slideOpts2 = {
		slidesPerView: 1.4,
	};
	
	public allCatch:any;
	showLoading: boolean = false;
	showAddMyCatchOption: boolean = true;
	public lastPostId:any;
	
	ionPackageName: string;
	ionVersionNumber: string;
	showVersionUpdateOption: boolean = false;
	public updateVersionNumber: any;
	public AppUpdateText: any;
	public AppCancelBtnText: any;
	public AppUpdateBtnText: any;	
	public loginUser:any;

  constructor(
    public router: Router,
    public menu: MenuController,
    public api: ApiService,
    private platform: Platform,
    private modalController: ModalController,
    public util: UtilService,
    private translateService: TranslateService
  ) {  
		console.log('HomePage User ID:'+localStorage.getItem('user_user_id'));		
		this.loginUser = localStorage.getItem('user_user_id');
		
		if(localStorage.getItem('user_account_type') == 'diver' || localStorage.getItem('user_account_type') == 'trapper')
		{
			this.showAddMyCatchOption = true;
		}
		else
			this.showAddMyCatchOption = false;
		  
		this.showLoading = false;
		this.getMyCatches();
  }
  
  getMyCatches() {
  	console.log('UU : '+this.loginUser);
  		this.showLoading = true;
		this.util.presentLoader();
		
  		this.allCatch = [];
		var reqData = {action:'getMyCatch',last_post_id:this.lastPostId,login_user_id:this.loginUser};			
		this.api.postItem('getMyCatch', reqData).subscribe((res:any) => { //console.log(res);
			if (res.errors) {
				this.allCatch = [];				
				this.showLoading = false;
				this.util.hideLoader();
            } else if (res.data) {
				for (var i = 0; i < res.data.length; i++) {
					let date = new Date();
					res.data[i].fishing_pic = res.data[i].fishing_pic+"?_dc="+date.getTime();
				}
				this.allCatch    = res.data;
				this.lastPostId  = res.last_post_id;
				this.showLoading = false;
				this.util.hideLoader();
			}
		}, err => {
				this.allCatch = [];
				this.showLoading = false;
				this.util.hideLoader();
		});
  }

}
