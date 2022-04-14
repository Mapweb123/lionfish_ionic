import { Component } from "@angular/core";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import {
  ActionSheetController,
  ModalController,
  MenuController,
  IonRouterOutlet,
} from "@ionic/angular";

import { ApiService } from "../api.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

import { TermsOfServicePage } from "../terms-of-service/terms-of-service.page";
import { PrivacyPolicyPage } from "../privacy-policy/privacy-policy.page";
import { PasswordValidator } from "../validators/password.validator";
import * as moment from "moment";

import * as dayjs from "dayjs";
import { format, parseISO } from "date-fns";
import { log } from "console";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./styles/signup.page.scss"],
})
export class SignupPage {
  signupForm: FormGroup;
  matching_passwords_group: FormGroup;

  currnetMonth;
  date;
  myDate;
  todayDate;

  showBussCat: boolean = false;
  showDiver: boolean = true;
  showTrapper: boolean = false;
  showOrg: boolean = false;
  showObserverFields: boolean = true;

  disableSubmit: boolean = false;
  form: any;
  errors: any;
  success: any;
  countryArr: any;
  statesArr: any;
  citiesArr: any;
  fileName: any;
  clickedImage: any;
  clickedImageBack: any;
  public allOrg: any;
  bussCate: any;
  org_buss_cate: any;
  formattedDate?: string;

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
    confirm_password: [
      { type: "required", message: "Confirm password is required" },
    ],
    matching_passwords: [{ type: "areNotEqual", message: "Password mismatch" }],
  };

  constructor(
    public router: Router,
    public modalController: ModalController,
    public menu: MenuController,
    private routerOutlet: IonRouterOutlet,
    private camera: Camera,
    private actionSheet: ActionSheetController,
    public api: ApiService
  ) {
    this.fetchCountries();
    this.todayDate = moment();
    this.matching_passwords_group = new FormGroup(
      {
        password: new FormControl(
          "",
          Validators.compose([Validators.minLength(5), Validators.required])
        ),
        confirm_password: new FormControl("", Validators.required),
      },
      (formGroup: FormGroup) => {
        return PasswordValidator.areNotEqual(formGroup);
      }
    );

    this.signupForm = new FormGroup({
      email: new FormControl(
        "test@test.com",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      //matching_passwords: this.matching_passwords_group,
      opt_iam: new FormControl("", Validators.required),
      //div_sel_country: new FormControl("", Validators.required),
      div_sel_country: new FormControl(""),
      div_sel_region: new FormControl("", Validators.required),
      div_opt_depth: new FormControl("", Validators.required),
      div_txt_fname: new FormControl("", Validators.required),
      div_txt_lname: new FormControl("", Validators.required),
      div_txt_nickname: new FormControl("", Validators.required),
      div_txt_business_name: new FormControl("", Validators.required),
      div_opt_gender: new FormControl("", Validators.required),
      // div_birthDate: new FormControl("", Validators.required),
      div_birthDate: new FormControl("", Validators.required),
      div_txt_city: new FormControl("", Validators.required),
      div_txt_county: new FormControl("", Validators.required),
      div_txt_state: new FormControl("", Validators.required),
      div_opt_bottom_type: new FormControl("", Validators.required),
      div_opt_dive_day_time: new FormControl("", Validators.required),
      div_opt_reason: new FormControl("", Validators.required),
      div_txt_email: new FormControl("", Validators.required),
      div_txt_password: new FormControl("", Validators.required),
      div_txt_repeat_password: new FormControl("", Validators.required),
      div_txt_phone_number: new FormControl("", Validators.required),
      div_file_profile_pic: new FormControl(""),
      div_file_profile_pic_back: new FormControl(""),
      div_org_linked_to: new FormControl("", Validators.required),
      org_sel_country: new FormControl("", Validators.required),
      org_sel_region: new FormControl("", Validators.required),
      org_txt_fname: new FormControl("", Validators.required),
      org_txt_lname: new FormControl("", Validators.required),
      org_txt_businessname: new FormControl("", Validators.required),
      org_buss_cate: new FormControl("", Validators.required),
      org_buss_cate_string: new FormControl(""),
      org_txt_city: new FormControl("", Validators.required),
      org_txt_county: new FormControl("", Validators.required),
      org_txt_state: new FormControl("", Validators.required),
      div_bottom_type: new FormControl("", Validators.required),
      org_txt_postal_code: new FormControl("", Validators.required),
      org_txt_email: new FormControl("", Validators.required),
      org_txt_password: new FormControl("", Validators.required),
      org_txt_repeat_password: new FormControl("", Validators.required),
      org_txt_phone_number: new FormControl("", Validators.required),
      org_file_profile_pic: new FormControl(""),
      org_about_information: new FormControl(""),
      org_txt_website: new FormControl(""),
      org_txt_facebook: new FormControl(""),
      org_txt_instagram: new FormControl(""),
      org_txt_linkedin: new FormControl(""),
      org_chk_terms: new FormControl("", Validators.required),
    });

    // When the data is ready
		this.signupForm.get('opt_iam').setValue('diver');
		this.signupForm.get('div_sel_country').setValue('US');
		this.signupForm.get('div_opt_depth').setValue('feet');
		this.signupForm.get('div_opt_gender').setValue('M');
		this.signupForm.get('div_opt_reason').setValue('personal');
		//this.signupForm.get('div_opt_visibility').setValue('public');
		this.signupForm.get('div_opt_bottom_type').setValue('natural');
		this.signupForm.get('div_opt_dive_day_time').setValue('morning');
		
		this.signupForm.get('org_sel_country').setValue('US');
		this.signupForm.get('org_chk_terms').setValue(false);
  }

  fetchCountries(): void {
    this.api.postItem("getCountries", "").subscribe(
      (res: any) => {
        if (res.data) {
          this.countryArr = res.data;
          //console.log(this.countryArr);
          this.signupForm.get('div_sel_country').setValue("");
          this.signupForm.get('org_sel_country').setValue("");
        }
      },
      (err) => {
      }
    );
  }

  fetchStates(event): void { 
    var shortName  = event.detail.value;// this.signupForm.value.div_sel_country; 
    if(shortName == "" || typeof(this.countryArr) == 'undefined') {
      this.statesArr = [];
      return;
    } 
    var selCountry = this.countryArr.find(item => item.shortname == shortName);
    this.api.postItem("getStates", {country_id : selCountry.id}).subscribe(
      (res: any) => {
        if (res.data) {
          this.statesArr = res.data;
          console.log(this.statesArr);
        }
      },
      (err) => {
      }
    );
  }

  fetchCities(event): void {
    var stateID  = event.detail.value;//this.signupForm.value.div_txt_state; 
    if(stateID == "" || typeof(this.statesArr) == 'undefined') {
      this.citiesArr = [];
      return;
    } 
    var selState = this.statesArr.find(item => item.id == stateID);
    console.dir(selState);
    this.api.postItem("getCities", {state_id : selState.id}).subscribe(
      (res: any) => {
        if (res.data) {
          this.citiesArr = res.data;
          console.log(this.citiesArr);
        }
      },
      (err) => {
      }
    );
  }

  formatDate(): void {
    console.log("Inn hererere");
    console.log(this.signupForm.value.div_birthDate);
    this.formattedDate = format(
      parseISO(this.signupForm.value.div_birthDate),
      "MMM d, yyyy"
    );
    this.signupForm.value.div_birthDate = format(
      parseISO(this.signupForm.value.div_birthDate),
      "yyyy/M/d"
    );
    console.log(this.signupForm.value.div_birthDate);
  }

  // Disable side menu for this page
  ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  // Restore to default when leaving this page
  ionViewDidLeave(): void {
    this.menu.enable(true);
  }

  async showTermsModal() {
    const modal = await this.modalController.create({
      component: TermsOfServicePage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }

  async showPrivacyModal() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }

  async doSignup(): Promise<void> {
    console.log("do sign up");
    console.log(this.signupForm.value);
    await this.api.postItem("register", this.signupForm.value).subscribe(
      (res: any) => {
        console.log(res);
        if (res.errors) {
          this.errors = res.errors;
          for (var key in this.errors) {
            this.errors[key] = "ERROR : " + this.errors[key];
          }
          this.disableSubmit = false;
        } else if (res.data) {
          //this.router.navigate(['/tabs']);
          this.success = res.data;
        }
      },
      (err) => {
        this.disableSubmit = false;
      }
    );
    //this.router.navigate(["app/categories"]);
  }

  doFacebookSignup(): void {
    console.log("facebook signup");
    this.router.navigate(["app/categories"]);
  }

  doGoogleSignup(): void {
    console.log("google signup");
    this.router.navigate(["app/categories"]);
  }

  doTwitterSignup(): void {
    console.log("twitter signup");
    this.router.navigate(["app/categories"]);
  }

  doAppleSignup(): void {
    console.log("apple signup");
    this.router.navigate(["app/categories"]);
  }

  onCategoryChange(): void {
    let category = this.signupForm.get("org_buss_cate").value;
    let catString = "";
    for (var cat in category) {
      //console.log(cat);
      //console.log(category[cat]);
      if (catString == "") catString = category[cat];
      else catString = catString + "," + category[cat];
    }
    //console.log(catString);
    this.signupForm.patchValue({
      org_buss_cate_string: catString,
    });
  }

  public changeListener(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.fileName = event.target.files[0].name;
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.signupForm.patchValue({
          div_file_profile_pic: reader.result,
        });
      };
    }
  }

  registerChange(accountType) {
    //console.log(accountType);
    console.log(accountType.detail.value);
    if (accountType.detail.value == "diver") {
      this.showDiver = true;
      this.showOrg = false;
      this.showTrapper = false;
      this.showObserverFields = true;
    } else if (accountType.detail.value == "trapper") {
      this.showDiver = false;
      this.showOrg = false;
      this.showTrapper = true;
      this.showObserverFields = false;
    } else {
      if (accountType.detail.value == "observer") {
        this.showObserverFields = false;
      } else {
        this.showObserverFields = true;
      }

      if (accountType.detail.value == "business") this.showBussCat = true;
      else this.showBussCat = false;

      this.showDiver = false;
      this.showOrg = true;
      this.showTrapper = false;
    }
  }

  getAllOrganisation() {
    this.allOrg = [];
    var reqData = { action: "getOrganisation" };
    this.api.postItem("getOrganisation", reqData).subscribe(
      (res: any) => {
        //console.log(res);
        if (res.errors) {
          this.allOrg = [];
        } else if (res.data) {
          this.allOrg = res.data;
        }
      },
      (err) => {
        this.allOrg = [];
      }
    );
  }

  getDate(date) {
    var d = new Date(date);
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    var c = monthNames[d.getMonth()];
    return c;
  }

  onCurrentDateChanged(ents) {
    this.currnetMonth = this.getDate(ents);
    //console.log(this.currnetMonth );
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit() {
    this.currnetMonth = this.getDate(new Date());
    //this.formatDate();
    //console.log(this.currnetMonth);
  }

  back() {
    this.date = this.todayDate.subtract(1, "days").toDate();
    this.myDate = moment(this.date).format("ddd, Do MMMM");
    var swiper = document.querySelector(".swiper-container")["swiper"];
    var date = moment().add("-1", "M").toLocaleString();
    this.currnetMonth = this.getDate(date);

    // swiper.slidePrev();
  }

  next() {
    this.date = this.todayDate.add(1, "days").toDate();
    this.myDate = moment(this.date).format("ddd, Do MMMM");
    var swiper = document.querySelector(".swiper-container")["swiper"];
  }

  goToHome() {
    this.router.navigate(["/tabs"]);
  }

  goToLogin() {
    this.router.navigate(["/"]);
  }

  async updateRegisterPic() {
    const actionSheetTmp = await this.actionSheet.create({
      mode: "ios",
      header: "Choose from",
      cssClass: "actionsheet-custom-class",
      buttons: [
        {
          text: "Camera",
          icon: "camera",
          handler: () => {
            console.log("camera clicked");
            this.assignRegisterPic("camera");
          },
        },
        {
          text: "Gallery",
          icon: "images",
          handler: () => {
            console.log("gallery clicked");
            this.assignRegisterPic("gallery");
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });

    await actionSheetTmp.present();
  }

  public assignRegisterPic(type) {
    try {
      const options: CameraOptions = {
        quality: 100,
        targetHeight: 800,
        targetWidth: 800,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType:
          type === "camera"
            ? this.camera.PictureSourceType.CAMERA
            : this.camera.PictureSourceType.PHOTOLIBRARY,
      };
      this.camera.getPicture(options).then((url) => {
        this.signupForm.patchValue({
          div_file_profile_pic: url,
          org_file_profile_pic: url,
        });
        let base64Image = "data:image/jpeg;base64," + url;
        this.clickedImage = base64Image;
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  async updateRegisterPic_background() {
    const actionSheetTmp = await this.actionSheet.create({
      mode: "ios",
      header: "Choose from",
      cssClass: "actionsheet-custom-class",
      buttons: [
        {
          text: "Camera",
          icon: "camera",
          handler: () => {
            console.log("camera clicked");
            this.assignRegisterPic_background("camera");
          },
        },
        {
          text: "Gallery",
          icon: "images",
          handler: () => {
            console.log("gallery clicked");
            this.assignRegisterPic_background("gallery");
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });

    await actionSheetTmp.present();
  }

  public assignRegisterPic_background(type) {
    try {
      const options: CameraOptions = {
        quality: 100,
        targetHeight: 800,
        targetWidth: 800,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType:
          type === "camera"
            ? this.camera.PictureSourceType.CAMERA
            : this.camera.PictureSourceType.PHOTOLIBRARY,
      };
      this.camera.getPicture(options).then((url) => {
        this.signupForm.patchValue({
          div_file_profile_pic_back: url,
        });
        let base64Image = "data:image/jpeg;base64," + url;
        this.clickedImageBack = base64Image;
      });
    } catch (error) {
      console.log("error", error);
    }
  }
}
