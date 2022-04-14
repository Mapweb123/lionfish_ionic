import { Component } from "@angular/core";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { MenuController } from "@ionic/angular";

import { UtilService } from "../services/util.service";
import { ApiService } from "../api.service";

import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./styles/forgot-password.page.scss"],
})
export class ForgotPasswordPage {
  forgotPasswordForm: FormGroup;
  errors: any;
  success: any;
  language: string = this.translateService.currentLang;

  langStrings = {
    en: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." },
    ],
    es: [
      { type: "required", message: "correo electronico es requerido." },
      { type: "pattern", message: "Introduzca un correo electrónico válido." },
    ],
  };

  validation_messages = {
    email: this.langStrings[this.language],
  };

  constructor(
    public router: Router,
    public menu: MenuController,
    public api: ApiService,
    public util: UtilService,
    private translateService: TranslateService
  ) {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
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

  recoverPassword(): void {
    console.log(this.forgotPasswordForm.value);
    this.util.presentLoader();
    // this.router.navigate(['app/categories']);
    this.api.postItem("resetPassword", this.forgotPasswordForm.value).subscribe(
      (res: any) => {
        //console.log(res);
        if (res.errors) {
          this.errors = res.errors;
          for (var key in this.errors) {
            this.errors[key] = "<strong>ERROR</strong> : " + this.errors[key];
          }
          this.util.hideLoader();
          this.util.showToast(this.errors);
        } else if (res.data) {
          this.errors = false;
          this.success = res.data;
          this.util.hideLoader();
          this.util.showToast(this.success);
        }
      },
      (err) => {
        this.util.hideLoader();
        this.util.showToast("An Error Occurred...Try Again Later....");
      }
    );
  }

  goToLogin() {
    this.router.navigate(['']);
  }

  goToRegister() {
    this.router.navigate(['/auth/signup']);
  }
}
