<template>
  <div class="d-flex-centered d-col site-background">
    <div class="overlay" v-if="showingOverlay">
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <div class="d-flex-centered d-col route-section">
      <div
        class="d-col register-form-container"
        v-if="!emailSent && !emailTokenSent"
      >
        <div
          class="logo-container"
          :class="{ 'hidden-logo': showingForgotPassword }"
        >
          <img
            src="../assets/logo-mylife.png"
            alt="logo my life"
            width="auto"
          />
        </div>
        <div v-if="!showingForgotPassword">
          <div class="title-container">
            <div class="form-title-container">
              <span style="text-align: center">Log In</span>
            </div>
            <div class="form-subtitle-container" style="margin-bottom: 15px">
              <span style="text-align: center"
                >Enter your email address to log in to your account. We'll send
                you a secured link to log in.</span
              >
            </div>
          </div>

          <div class="register-form-section">
            <input
              type="text"
              placeholder="E-mail"
              v-model="emailToken"
              class="register-input"
              @keypress.enter="getToken()"
            />
            <div class="register-form-section spaced" style="margin-top: 10px">
              <button @click="getToken()" class="get-token-btn">
                LOG IN VIA EMAIL
              </button>
            </div>
          </div>
          <div class="form-section-seprator" style="text-align: center">
            <span style="text-align: center">Or</span>
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
            <button @click="login()" class="login-btn">Log In</button>
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
      <div v-if="emailTokenSent" class="login-token-container">
        <div class="email-token-sent-title">
          <span>Your login link is on its way</span>
        </div>
        <div class="email-sent-info-container">
          <span class="email-token-sent-info">
            We’ve sent a login email to {{ emailToken }}. Check your email and
            click the link to log in.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { serverUrl } from "../severUrl"
import axios from "axios"
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
      emailTokenSent: false,
      orderId: "",
      isBuyer: "",
      questionId: "",
      chapterId: "",
      tokenSh: "",
      emailToken: "",
    }
  },
  methods: {
    showForgotPassword: function () {
      this.showingForgotPassword = true
    },
    hideForgotPassword: function () {
      this.showingForgotPassword = false
    },
    toggleShowPassword: function () {
      if (this.isPassword == "password") {
        this.isPassword = "text"
      } else {
        this.isPassword = "password"
      }
    },
    login: async function () {
      const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      if (!this.tokenSh && !this.orderId) {
        if (
          !this.email ||
          this.email.length > 50 ||
          !this.email.match(mailformat)
        ) {
          alert("please enter an email and respect its format")
          return
        }
      }

      try {
        this.loading = true
        this.showingOverlay = true
        const response = await axios.post(
          serverUrl + "/auth/login",
          {
            email: this.email.toLowerCase(),
            password: this.password,
            orderId: this.orderId,
            isBuyer: this.isBuyer,
            token: this.tokenSh,
          },
          { withCredentials: true }
        )
        if (response.status == 200) {
          this.$store.commit("setUser", response.data)
          this.loading = false
          this.showingOverlay = false
          if (response.data?.nbrOrders > 1) {
            const historyLocation = this.questionId
              ? `/welcome?question-id=${this.questionId}&chapter-id=${this.chapterId}`
              : this.$router.history._startLocation
            this.$router.push(
              historyLocation.toLowerCase().indexOf("login") === -1 &&
                historyLocation.toLowerCase().indexOf("register") === -1
                ? historyLocation
                : "/welcome"
            )
          } else {
            const historyLocation = this.questionId
              ? `/?question-id=${this.questionId}&chapter-id=${this.chapterId}`
              : this.$router.history._startLocation
            this.$router.push(
              historyLocation.toLowerCase().indexOf("login") === -1 &&
                historyLocation.toLowerCase().indexOf("register") === -1
                ? historyLocation
                : "/"
            )
          }
        }
      } catch (error) {
        this.loading = false
        this.showingOverlay = false
        console.log(error)
        if (error.response.status != 500) {
          this.errorMessage = error.response.data
        }
      }
    },
    resetPassword: async function () {
      const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      if (
        !this.emailForgot ||
        this.emailForgot.length > 50 ||
        !this.emailForgot.match(mailformat)
      ) {
        alert("please enter an email and respect its format")
        return
      }
      try {
        this.loading = true
        this.showingOverlay = true
        const result = await axios.post(
          serverUrl + "/api/users/reset-password",
          { email: this.emailForgot.toLowerCase(), toEmail: this.toEmail },
          { withCredentials: true }
        )
        this.loading = false
        this.showingOverlay = false
        if (result.status == 200) {
          this.showEmailSent()
        }
      } catch (error) {
        console.log(error)
        this.loading = false
        this.showingOverlay = false
      }
    },
    showEmailSent: function () {
      this.hideForgotPassword()
      this.emailSent = true
    },
    showEmailTokenSent: function () {
      this.emailTokenSent = true
    },
    async getToken() {
      const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

      if (
        !this.emailToken ||
        this.emailToken.length > 50 ||
        !this.emailToken.match(mailformat)
      ) {
        alert("please enter an email and respect its format")
        return
      }
      try {
        this.loading = true
        this.showingOverlay = true
        const result = await axios.post(serverUrl + "/auth/genreatetoken", {
          email: this.emailToken.toLowerCase(),
        })
        this.loading = false
        this.showingOverlay = false
        if (result.status == 200) {
          this.showEmailTokenSent()
        }
      } catch (error) {
        console.log(error)
        this.loading = false
        this.showingOverlay = false
      }
    },
  },

  async created() {
    let params
    if (!document.location.search && this.$router.history._startLocation) {
      params = new URLSearchParams(this.$router.history._startLocation)
    } else {
      params = new URLSearchParams(document.location.search)
    }
    this.tokenSh = params.get("plk")
    this.orderId = params.get("order-id")
    this.isBuyer = params.get("is-buyer")
    this.questionId = params.get("question-id")
    this.chapterId = params.get("chapter-id")
    if (this.isBuyer) {
      this.isBuyer.toString()
    }
    if (this.orderId) {
      this.orderId.toString()
      this.login()
    }
    if (this.tokenSh) {
      console.log(this.tokenSh)
      this.tokenSh.toString()
      this.login()
    }
    if (this.questionId) {
      this.questionId.toString()
      this.chapterId.toString()
    }
  },
}
</script>

<style scoped>
.login-btn,
.get-token-btn {
  padding: 20px 43px;
  width: 100%;
  font-family: PT-serif;
  font-weight: bold;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid rgba(6, 42, 32, 0.2);
  border-radius: 50px;
  cursor: pointer;
  align-items: center;
  text-transform: uppercase;
}
.get-token-btn:hover {
  background: #14473c;
  color: #ffffff;
}
.get-token-btn {
  color: #14473c;
  background: #ffffff;
}
.login-btn {
  background: #14473c;
  color: #ffffff;
}
.login-btn:hover {
  color: #14473c;
  background: #ffffff;
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
  background: transparent;
}
.login-token-container {
  margin-top: 200px;
  padding: 50px 30px;
  background: white;
  text-align: center;
  border: solid 1px rgba(6, 42, 32, 0.2);
  border-radius: 15px;
}
.email-token-sent-info {
  font-family: galaxie-polaris;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: rgba(6, 42, 32, 0.7);
  display: inline-block;
}
.email-token-sent-title {
  font-family: "PT Serif";
  font-style: normal;
  font-weight: 700;
  font-size: 34px;
  line-height: 44px;
  text-align: center;
  color: #062a20;
  margin-bottom: 15px;
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
  font-family: PT-serif;
  font-weight: 700;
  font-size: 34px;
  text-align: center;
  width: 100%;
  margin-bottom: 27px;
  line-height: 44px;
  color: #062a20;
}
.form-subtitle-container {
  font-family: "Polaris";
  font-style: normal;
  font-weight: 680;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #14473c;
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
  text-align: center;
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
    overflow: scroll;
    padding: 24px;
  }
  .login-token-container {
    background: transparent;
    border: none;
  }
  .register-form-container {
    padding: 0px;
    border: none;
    background: transparent;
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
  .get-token-btn {
    background: transparent;
  }
  .login-btn:hover {
    background: transparent;
  }
}

@media screen and (max-height: 625px) {
  .register-form-container {
    margin-bottom: 24px;
  }
}
</style>
