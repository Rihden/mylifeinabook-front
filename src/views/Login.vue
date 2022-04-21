<template>
  <div class="d-flex-centered d-col site-background">
    <div class="overlay" v-if="showingOverlay">
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <div class="d-flex-centered d-col route-section">
      <div
        class="logo-container"
        :class="{ 'hidden-logo': showingForgotPassword }"
      >
        <img
          src="../assets/logo - black.png"
          alt="logo ma vie"
          height="107px"
          width="83px"
        />
      </div>
      <div class="d-col register-form-container" v-if="!emailSent">
        <div v-if="!showingForgotPassword">
          <div class="title-container">
            <div class="form-title-container">
              <span style="text-align: center">Login</span>
            </div>
          </div>
          <div class="register-form-section error-msg-container">
            <span class="register-form-error" v-if="errorMessage">
              {{ errorMessage }}</span
            >
          </div>
          <div class="register-form-section">
            <input
              type="text"
              placeholder="E-mail"
              v-model="email"
              class="register-input"
              @keypress.enter="login()"
            />
          </div>
          <div class="register-form-section spaced" style="position: relative">
            <input
              :type="isPassword"
              placeholder="Password"
              v-model="password"
              class="register-input"
              @keypress.enter="login()"
            />
            <div class="password-eye ptr" @click="toggleShowPassword()">
              <img src="../assets/eye.png" alt="" />
            </div>
            <div
              class="ptr"
              style="margin-top: 4px; text-align: right"
              @click="showForgotPassword()"
            >
              <span
                style="
                  font-size: 12px;
                  font-family: Polaris;
                  font-weight: 300;
                  text-decoration-line: underline;
                "
                >Forgot your password ?</span
              >
            </div>
          </div>
          <div class="register-form-section spaced">
            <button @click="login()" class="login-btn">CONTINUE</button>
          </div>
          <div class="register-form-section" style="margin-bottom: 0px">
            <div>
              <span
                style="
                  color: #000000;
                  font-size: 14px;
                  line-height: 21px;
                  font-family: galaxie-polaris;
                  font-weight: 500;
                "
                >New to My Life In A Book ?
              </span>
            </div>

            <a href="https://www.mylifeinabook.com"
              ><span
                style="
                  text-decoration: underline;
                  color: #000000;
                  font-size: 14px;
                  font-family: galaxie-polaris;
                  font-weight: light;
                "
                >Order your book</span
              ></a
            >
          </div>
        </div>
        <div v-if="showingForgotPassword">
          <div class="title-container">
            <div class="form-title-container">
              <span style="text-align: center">Password assistance</span>
            </div>
          </div>
          <div
            class="register-form-section"
            style="
              margin-bottom: 35px;
              font-size: 14px;
              font-family: polaris;
              font-weight: 300;
            "
          >
            <span>Enter the email address linked to your account.</span>
          </div>
          <div class="register-form-section">
            <input
              type="text"
              placeholder="E-mail"
              v-model="emailForgot"
              class="register-input"
              @keypress.enter="resetPassword()"
            />
          </div>
          <div class="register-form-section">
            <button @click="resetPassword()" class="login-btn">CONTINUE</button>
          </div>
        </div>
      </div>
      <div
        style="
          margin-top: 25px;
          font-size: 14px;
          line-height: 21px;
          font-family: galaxie-polaris;
          font-weight: 400;
          text-decoration: underline;
        "
        class="ptr"
        v-if="showingForgotPassword"
        @click="hideForgotPassword()"
      >
        <span>Go back to login</span>
      </div>
      <div v-if="emailSent" style="margin-top: 64px">
        <div style="margin-bottom: 54px" class="d-flex-centered">
          <img
            src="../assets/email-sent.png"
            alt=""
            class="email-sent-image"
            style=""
          />
        </div>
        <div class="email-sent-title">
          <span>Link sent to your email.</span>
        </div>
        <div class="email-sent-info-container">
          <span class="email-sent-info">
            Click the activation link we sent to
            <span style="color: #e1504b">{{ emailForgot }} </span> to continue.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { serverUrl } from "../severUrl";
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      toEmail: "",
      password: "",
      errorMessage: "",
      emailForgot: "",
      routerReady: false,
      showingOverlay: false,
      loading: false,
      isPassword: "password",
      showingForgotPassword: false,
      emailSent: false,
    };
  },
  methods: {
    showForgotPassword: function () {
      this.showingForgotPassword = true;
    },
    hideForgotPassword: function () {
      this.showingForgotPassword = false;
    },
    toggleShowPassword: function () {
      if (this.isPassword == "password") {
        this.isPassword = "text";
      } else {
        this.isPassword = "password";
      }
    },
    login: async function () {
      try {
        this.loading = true;
        this.showingOverlay = true;
        const response = await axios.post(
          serverUrl + "/auth/login",
          {
            email: this.email.toLowerCase(),
            password: this.password,
          },
          { withCredentials: true }
        );
        if (response.status == 200) {
          this.$store.commit("setUser", response.data);
          this.loading = false;
          this.showingOverlay = false;
          this.$router.push("/welcome");
        }
      } catch (error) {
        this.loading = false;
        this.showingOverlay = false;
        console.log(error);
        if (error.response.status != 500) {
          this.errorMessage = error.response.data;
        }
      }
    },
    resetPassword: async function () {
      if (!this.emailForgot) {
        alert("email required");
        return;
      }
      try {
        this.loading = true;
        this.showingOverlay = true;
        const result = await axios.post(
          serverUrl + "/api/users/reset-password",
          { email: this.emailForgot.toLowerCase(), toEmail: this.toEmail },
          { withCredentials: true }
        );
        this.loading = false;
        this.showingOverlay = false;
        if (result.status == 200) {
          this.showEmailSent();
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.showingOverlay = false;
      }
    },
    showEmailSent: function () {
      this.hideForgotPassword();
      this.emailSent = true;
    },
  },
  // async beforeRouteEnter(to, from, next) {
  //   // called before the route that renders this component is confirmed.
  //   // does NOT have access to `this` component instance,
  //   // because it has not been created yet when this guard is called!
  //   console.log(to, from, next);
  //   try {
  //     const response = await axios.get(serverUrl + "/auth/checkUser/", {
  //       withCredentials: true,
  //     });
  //     next((vm) => {
  //       // access to component instance via `vm`
  //       vm.$store.commit("setUser", response.data);
  //       //save user data
  //       vm.$router.replace("/");
  //     });
  //     // const response = await axios.get(
  //     //   serverUrl + "/api/books/" + this.user.bookId
  //     // );
  //     // this.hasCover = response.data.hasCover;

  //     // if (!this.user.hasSeenTips) {
  //     //   this.isOverlayShown = true;
  //     // }
  //     //
  //   } catch (error) {
  //     console.log(error);
  //     next((vm) => {
  //       // access to component instance via `vm`
  //       vm.routerReady = true;
  //     });
  //   }
  // },
  async created() {
    let params = new URLSearchParams(document.location.search);
    this.toEmail = params.get("to-email");
    if (this.toEmail) {
      this.toEmail.toString();
    }
    console.log(this.toEmail);
  },
};
</script>

<style scoped>
.login-btn {
  background: #14473c;
  padding: 20px 43px;
  color: white;
  border: none;
  border-radius: 0px;
  font-size: 16px;
  width: 100%;
  font-family: PT-serif;
  font-weight: bold;
}
.register-input {
  padding: 15px 20px 18px 20px;
  font-size: 16px;
  line-height: 24px;
  border: 1px solid rgba(6, 42, 32, 0.2);
  font-family: galaxie-polaris;
  outline: none;
  color: #14473c;
  height: 62px;
  width: 100%;
  box-sizing: border-box;
}

.register-input:focus {
  border: 1px solid rgba(6, 42, 32, 0.35);
}

.form-input-error:focus {
  border: 2px solid #eb4848;
}

.form-input-error {
  border: 2px solid #eb4848;
}
.register-input::placeholder {
  color: rgba(6, 42, 32, 0.4);
}
.login-btn:hover {
  cursor: pointer;
}

.register-form-container {
  padding: 70px;
  background: #ffffff;
  border: 1px solid rgba(6, 42, 32, 0.2);
  border-radius: 22px;
  margin-top: 44px;
  box-sizing: border-box;
  width: 468px;
  max-width: 100%;
}
.form-title-container {
  font-family: galaxie-polaris;
  font-weight: 500;
  font-size: 24px;
  text-align: center;
  width: 100%;
  margin-bottom: 27px;
  color: #062a20;
}

.register-form-section {
  text-align: center;
  margin-bottom: 8px;
  width: 100%;
}
.register-form-error {
  color: #eb4848;
  font-size: 14px;
}
.register-form-section.spaced {
  text-align: center;
  margin-bottom: 18px;
  width: 100%;
}

.avatar-image-container {
  padding: 10px;
  border: 1px solid rgba(6, 42, 32, 0.1);
  box-sizing: border-box;
  border-radius: 14px;
  height: 128px;
  width: 102px;
  font-size: 14px;
  line-height: 21px;
  color: #062a20;
  font-weight: 400;
  text-align: center;
  align-items: center;
  margin-right: 8px;
}
.avatar-image-container.selected {
  background: #e1504b;
  border: 1px solid rgba(6, 42, 32, 0.1);
  color: white;
}
.error {
  color: #eb4848;
}

.password-eye {
  position: absolute;
  right: 20px;
  top: 22px;
  height: 18px;
  width: 18px;
}

.error-msg-container {
  min-height: 21px;
}

.email-sent-title {
  text-align: center;
  font-family: galaxie-polaris;
  font-weight: 500;
  font-size: 24px;
  line-height: 26px;
  color: #062a20;
  margin-bottom: 22px;
}

.email-sent-info-container {
  text-align: center;
}
.email-sent-info {
  font-family: galaxie-polaris;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 23px;
  max-width: 328px;
  /* dark green/100% */
  color: #14473c;
  display: inline-block;
}

.logo-container {
  margin-top: 12px;
}
.email-sent-image {
  max-width: 395px;
  max-height: 250px;
}

@media screen and (max-width: 1024px) {
  .site-background {
    padding: 0px;
    background: none;
  }
  .route-section {
    background: white;
    padding: 24px;
  }
  .register-form-container {
    padding: 0px;
    border: none;
  }
  .logo-container {
    margin-top: 44px;
  }
  .hidden-logo {
    height: 107px;
    width: 83px;
    opacity: 0;
  }
  .email-sent-image {
    max-width: 198px;
    max-height: 125px;
  }
}

@media screen and (max-height: 625px) {
  .register-form-container {
    margin-bottom: 24px;
  }
}
</style>