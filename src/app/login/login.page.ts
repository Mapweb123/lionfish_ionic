import { Component } from "@angular/core";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuController, Platform, ModalController } from "@ionic/angular";
import { UtilService } from "../services/util.service";
import { ApiService } from "../api.service";

import { TranslateService } from "@ngx-translate/core";

import { TermsOfServicePage } from "../terms-of-service/terms-of-service.page";
import { PrivacyPolicyPage } from "../privacy-policy/privacy-policy.page";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./styles/login.page.scss"],
})
export class LoginPage {
  errors: any;
  loginForm: FormGroup;
  language: string = this.translateService.currentLang;

  validation_messages = {
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." },
    ],
    password: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "Password must be at least 5 characters long.",
      },
    ],
  };

  constructor(
    public router: Router,
    public menu: MenuController,
    public api: ApiService,
    private platform: Platform,
    private modalController: ModalController,
    public util: UtilService,
    private translateService: TranslateService
  ) {
    //this.language = this.translateService.currentLang;
    this.loginForm = new FormGroup({
      email: new FormControl(
        "test@test.com",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
    });
  }

  // Disable side menu for this page
  ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  // Restore to default when leaving this page
  ionViewDidLeave(): void {
    this.menu.enable(true);
  }

  languageChange(): void {
    this.translateService.setDefaultLang(this.language);
    this.translateService.use(this.language);
  }

  doLogin(): void {
    console.log("do Log In");
    //this.router.navigate(['app/categories']);
    this.util.presentLoader();
    this.api.postItem("login", this.loginForm.value).subscribe(
      (res: any) => {
        console.log(res);
        if (res.errors) {
          this.errors = res.errors;
          for (var key in this.errors) {
            this.errors[key] = "<strong>ERROR</strong> : " + this.errors[key];
          }
          this.util.hideLoader();
          this.util.showToast(this.errors);
        } else if (res.data) {
          console.log(res.data);
          //localStorage.setItem('userData', res.data);
          localStorage.setItem("user_account_type", res.data.account_type);
          localStorage.setItem("user_city", res.data.city);
          localStorage.setItem("user_depth", res.data.depth);
          localStorage.setItem("user_email", res.data.email);
          localStorage.setItem("user_fishing_for", res.data.fishing_for);
          localStorage.setItem("user_fname", res.data.fname);
          localStorage.setItem("user_lname", res.data.lname);
          localStorage.setItem("user_nickname", res.data.nickname);
          localStorage.setItem("user_profile_pic", res.data.profile_pic);
          localStorage.setItem("user_user_id", res.data.user_id);
          localStorage.setItem("user_visibility", res.data.visibility);
          localStorage.setItem("user_account_type", res.data.account_type);

          localStorage.setItem("user_country", res.data.country);
          localStorage.setItem("user_region", res.data.region);
          localStorage.setItem("user_country", res.data.country);
          localStorage.setItem("user_state", res.data.state);
          localStorage.setItem("user_phone", res.data.phone);
          localStorage.setItem("about_us", res.data.about_us);
          localStorage.setItem("businessname", res.data.businessname);

          localStorage.setItem("user_bottom_type", res.data.bottom_type);

          this.util.hideLoader();
          //this.router.navigate(['/tabs']);
        }
      },
      (err) => {
        this.util.hideLoader();
        this.util.showToast("An Error Occurred...Try Again Later....");
      }
    );
  }

  goToForgotPassword(): void {
    console.log("redirect to forgot-password page");
  }

  doFacebookLogin(): void {
    console.log("facebook login");
    this.router.navigate(["app/categories"]);
  }

  doGoogleLogin(): void {
    console.log("google login");
    this.router.navigate(["app/categories"]);
  }

  doTwitterLogin(): void {
    console.log("twitter login");
    this.router.navigate(["app/categories"]);
  }

  doAppleLogin(): void {
    console.log("apple login");
    this.router.navigate(["app/categories"]);
  }

  async terms() {
    //console.log('terms');
    const modal = await this.modalController.create({
      component: TermsOfServicePage,
      cssClass: "custom_modal2",
    });
    return await modal.present();
  }

  async privacy() {
    //console.log('privacy');
    const modal = await this.modalController.create({
      component: PrivacyPolicyPage,
      cssClass: "custom_modal2",
    });
    return await modal.present();
  }
}
