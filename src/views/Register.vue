<template>
  <div class="d-flex-centered d-col site-background">
    <div class="overlay" v-if="showingOverlay">
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <div class="d-flex-centered d-col route-section">
      <div class="d-col register-form-container" v-show="step == 1">
        <div class="form-title-container">
          <span style="text-align: center">Create account</span>
        </div>
        <div class="d-row" style="width: 100%; margin-bottom: 10px">
          <div
            class="ptr"
            style="
              width: 50%;
              height: 4px;
              background: #e1504b;

              position: relative;
            "
            @click="step = 1"
          >
            <div
              style="
                position: absolute;
                left: 0;
                top: -5px;
                height: 14px;
                width: 14px;
                background: #e1504b;

                border-radius: 50%;
              "
            ></div>
          </div>
          <div
            class="ptr"
            style="
              width: 50%;
              height: 4px;
              background: #e5e9e8;

              position: relative;
            "
            @click="step = 2"
          >
            <div
              style="
                position: absolute;
                right: 0;
                top: -5px;
                height: 14px;
                width: 14px;
                background: #e5e9e8;

                border-radius: 50%;
              "
            ></div>
          </div>
        </div>
        <div
          class="d-row"
          style="
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 12px;
            line-height: 18px;
          "
        >
          <div class="ptr" style="color: #e1504b" @click="step = 1">
            1. Create account
          </div>
          <div
            class="ptr"
            style="color: rgba(6, 42, 32, 0.7)"
            @click="step = 2"
          >
            2. Your profile
          </div>
        </div>
        <div class="register-form-section error-msg-container">
          <span class="register-form-error" v-if="errorMessage1">{{
            errorMessage1
          }}</span>
        </div>
        <div class="register-form-section">
          <input
            type="text"
            placeholder="Your email*"
            v-model="email"
            class="register-input"
            :class="{ 'form-input-error': emailError }"
            ref="emailInput"
            @keypress.enter="validateStep1()"
          />
        </div>
        <div class="register-form-section">
          <input
            :type="passwordStates1"
            placeholder="Enter your password*"
            v-model="password1"
            class="register-input"
            :class="{ 'form-input-error': password1Error }"
            ref="password1Input"
            @keypress.enter="validateStep1()"
          />
          <div class="password-eye update-password ptr">
            <img src="../assets/eye.png" alt="" @click="togglePassword(1)" />
          </div>
        </div>
        <div class="register-form-section spaced">
          <input
            :type="passwordStates2"
            placeholder="Re-enter password*"
            v-model="password2"
            class="register-input"
            :class="{ 'form-input-error': password2Error }"
            ref="password2Input"
            @keypress.enter="validateStep1()"
          />
          <div class="password-eye update-password ptr">
            <img src="../assets/eye.png" alt="" @click="togglePassword(2)" />
          </div>
        </div>
        <!-- <div style="text-align: center; margin-bottom: 10px">
          <input
            type="text"
            placeholder="nom"
            v-model="lastName"
            class="register-input"
            :class="{ 'form-input-error': lastNameError }"
            ref="lastNameInput"
            @keypress.enter="register()"
          />
        </div>
        <div style="text-align: center; margin-bottom: 10px">
          <input
            type="text"
            placeholder="prénom"
            v-model="name"
            class="register-input"
            :class="{ 'form-input-error': nameError }"
            ref="nameInput"
            @keypress.enter="register()"
          />
        </div> -->
        <div class="register-form-section spaced">
          <button @click="validateStep1()" class="login-btn">NEXT</button>
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
              >Already have an account ?
            </span>
          </div>

          <span
            style="
              text-decoration: underline;
              color: #000000;
              font-size: 14px;
              font-family: galaxie-polaris;
              font-weight: light;
            "
            ><router-link to="/login">Log in</router-link></span
          >
        </div>
      </div>
      <div class="d-col register-form-container" v-show="step == 2">
        <div class="form-title-container">
          <span style="text-align: center">Finaliser</span>
        </div>
        <div class="d-row" style="width: 100%; margin-bottom: 10px">
          <div
            class="ptr"
            style="
              width: 50%;
              height: 4px;
              background: #e5e9e8;
              position: relative;
            "
            @click="step = 1"
          >
            <div
              style="
                position: absolute;
                left: 0;
                top: -5px;
                height: 14px;
                width: 14px;
                background: #e5e9e8;
                border-radius: 50%;
              "
            ></div>
          </div>
          <div
            class="ptr"
            style="
              width: 50%;
              height: 4px;
              background: #e1504b;
              position: relative;
            "
            @click="step = 2"
          >
            <div
              style="
                position: absolute;
                right: 0;
                top: -5px;
                height: 14px;
                width: 14px;
                background: #e1504b;
                border-radius: 50%;
              "
            ></div>
          </div>
        </div>
        <div
          class="d-row"
          style="
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 12px;
            line-height: 18px;
          "
        >
          <div
            class="ptr"
            style="color: rgba(6, 42, 32, 0.7)"
            @click="step = 1"
          >
            1. Create account
          </div>
          <div class="ptr" style="color: #e1504b" @click="step = 2">
            2. Your Profile
          </div>
        </div>
        <div class="register-form-section error-msg-container">
          <span class="register-form-error" v-if="errorMessage2">{{
            errorMessage2
          }}</span>
        </div>
        <div class="register-form-section">
          <input
            type="text"
            placeholder="Your Name*"
            v-model="name"
            class="register-input"
            :class="{ 'form-input-error': nameError }"
            ref="nameInput"
            @keypress.enter="register()"
          />
        </div>
        <div class="register-form-section spaced">
          <div
            style="
              margin-bottom: 18px;
              font-weight: 400;
              font-size: 16px;
              line-height: 24px;
              color: #062a20;
              text-align: center;
            "
          >
            <span :class="{ error: avatarError }"> Select Your avatar</span>
          </div>
          <div class="d-row d-flex-centered">
            <div
              class="d-col avatar-image-container ptr"
              :class="{ selected: avatar == 0 }"
              @click="avatar = 0"
            >
              <img
                src="../assets/avatar-beard.svg"
                height="52px"
                width="52px"
                alt=""
              />
              <div style="height: 42px; justify-content: center" class="d-col">
                <span style="width: 55px; word-wrap: break-word">Male</span>
              </div>
            </div>
            <div
              class="d-col avatar-image-container ptr"
              :class="{ selected: avatar == 1 }"
              @click="avatar = 1"
            >
              <img
                src="../assets/avatar-white-hair.svg"
                height="52px"
                width="52px"
                alt=""
                style=""
              />
              <div style="height: 42px; justify-content: center" class="d-col">
                <span style="width: 55px; word-wrap: break-word">Female</span>
              </div>
            </div>
            <div
              class="d-col avatar-image-container ptr"
              :class="{ selected: avatar == 2 }"
              @click="avatar = 2"
            >
              <img
                src="../assets/avatar-male.svg"
                height="52px"
                width="52px"
                alt=""
              />
              <div style="height: 42px; justify-content: center" class="d-col">
                <span style="width: 55px; word-wrap: break-word">Other</span>
              </div>
            </div>
          </div>
        </div>
        <div class="register-form-section spaced">
          <button @click="register()" class="login-btn">NEXT</button>
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
              >Vous avez déjà un compte ?
            </span>
          </div>

          <span
            style="
              text-decoration: underline;
              color: #000000;
              font-size: 14px;
              font-family: galaxie-polaris;
              font-weight: light;
            "
            ><router-link to="/login">Identifiez-vous</router-link></span
          >
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
      password1: "",
      password2: "",
      name: "",
      lastName: "",
      errorMessage1: "",
      errorMessage2: "",
      orderId: null,
      emailError: false,
      password1Error: false,
      password2Error: false,
      avatarError: false,
      nameError: false,
      step: 1,
      avatar: -1,
      showingOverlay: false,
      loading: false,
      passwordStates1: "password",
      passwordStates2: "password",
    };
  },
  methods: {
    validateStep1: function () {
      this.errorMessage1 = "";
      this.emailError = false;
      this.password1Error = false;
      this.password2Error = false;
      const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

      if (this.email.length > 50) {
        this.emailError = true;
        this.$refs.emailInput.focus();
        this.errorMessage1 =
          "L'adresse email ne doit pas dépasser 50 caractères.";
        this.step = 1;

        return false;
      }
      if (!this.email.match(mailformat)) {
        this.emailError = true;
        this.$refs.emailInput.focus();
        this.errorMessage1 = "L'adresse email doit être valide.";
        this.step = 1;

        return false;
      }
      if (this.password1.length < 6) {
        this.password1Error = true;
        this.$refs.password1Input.focus();

        this.errorMessage1 =
          "Le mot de passe doit contenir au moin 6 caractères.";
        this.step = 1;

        return false;
      }
      if (this.password1.length > 30) {
        this.password1Error = true;
        this.$refs.password1Input.focus();
        this.errorMessage1 =
          "Le mot de passe ne doit pas dépasser 30 caractères.";
        this.step = 1;

        return false;
      }
      if (this.password1 != this.password2) {
        this.password2Error = true;
        this.$refs.password2Input.focus();
        this.errorMessage1 = "Les mots de passes doivent être identiques.";
        this.step = 1;

        return false;
      }
      this.step = 2;
      return true;
    },
    validateStep2: function () {
      this.errorMessage2 = "";
      this.avatarError = false;
      this.nameError = false;
      this.name = this.name.trim();
      const letters = /^[A-Za-zÄÖÜäöüßéèàûîï]+$/;
      if (this.name === "") {
        this.nameError = true;
        this.$refs.nameInput.focus();
        this.errorMessage2 = "Le prénom est obligatoire.";
        this.step = 2;

        return false;
      }
      if (this.name.length > 30) {
        this.nameError = true;
        this.$refs.nameInput.focus();
        this.errorMessage2 = "Le nom ne doit pas dépasser 30 caractères.";
        this.step = 2;

        return false;
      }
      if (!this.name.match(letters)) {
        this.nameError = true;
        this.$refs.nameInput.focus();
        this.errorMessage2 =
          "Le prénom ne doit contenir que des lettres ou espaces.";
        this.step = 2;

        return false;
      }
      if (this.avatar == -1) {
        this.avatarError = true;
        this.step = 2;

        return false;
      }
      return true;
    },
    register: async function () {
      const step1Valid = this.validateStep1();
      if (!step1Valid) {
        return;
      }
      const step2Valid = this.validateStep2();
      if (!step2Valid) {
        return;
      }
      try {
        this.loading = true;
        this.showingOverlay = true;
        let avatarFileName = "";
        if (this.avatar == 0) {
          avatarFileName = "avatar-beard.svg";
        }
        if (this.avatar == 1) {
          avatarFileName = "avatar-white-hair.svg";
        }
        if (this.avatar == 2) {
          avatarFileName = "avatar-male.svg";
        }
        const response = await axios.post(
          serverUrl + "/auth/register",
          {
            email: this.email.toLowerCase(),
            password: this.password1,
            orderId: this.orderId,
            name: this.name,
            avatar: avatarFileName,
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
        console.log(error);
        this.loading = false;
        this.showingOverlay = false;
        if (error.response.status != 500) {
          this.step = 1;
          this.errorMessage1 = error.response.data;
        }
      }
    },
    togglePassword: function (index) {
      if (index == 1) {
        if (this.passwordStates1 === "password") {
          this.passwordStates1 = "text";
        } else {
          this.passwordStates1 = "password";
        }
      }
      if (index == 2) {
        if (this.passwordStates2 === "password") {
          this.passwordStates2 = "text";
        } else {
          this.passwordStates2 = "password";
        }
      }
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
    this.orderId = params.get("order-id");
    if (this.orderId) {
      this.orderId.toString();
    }
    console.log(this.orderId);
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
  position: relative;
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
    margin-top: 105px;
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
</style>