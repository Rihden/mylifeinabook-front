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
            type="text"
            placeholder="Your Name*"
            v-model="name"
            class="register-input"
            :class="{ 'form-input-error': nameError }"
            ref="nameInput"
            @keypress.enter="step = 3"
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
          <button
            @click="refg === '' || refg === null ? validateStep1() : register()"
            class="login-btn"
          >
            NEXT
          </button>
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
            ><router-link to="/login">Log in</router-link></span
          >
        </div>
      </div>
      <div class="d-col register-form-container" v-show="step == 3">
        <div class="form-title-container">
          <span
            style="text-align: center; word-wrap: break-word"
            :class="{ error: guestError }"
            >Who's going to write the stories?</span
          >
        </div>
        <div class="register-form-section spaced">
          <div>
            <div
              style="margin-bottom: 8px"
              class="guest-container ptr"
              :class="{ selected: guest == 1 }"
              @click="guest = 1"
            >
              <div style="height: 32px; text-align: center" class="d-col">
                <span style="width: 108px; text-align: center; margin: auto"
                  >Someone else</span
                >
              </div>
            </div>
            <div
              style="margin-bottom: 25px"
              class="guest-container ptr"
              :class="{ selected: guest == 0 }"
              @click="guest = 0"
            >
              <div style="height: 32px; text-align: center" class="d-col">
                <span style="width: 108px; text-align: center; margin: auto"
                  >Me</span
                >
              </div>
            </div>
          </div>
          <div class="register-form-section d-row d-flex-centered">
            <button @click="step = 1" class="cancel-btn">
              <svg
                height="40"
                viewBox="0 0 1792 1792"
                width="40"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1203 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z"
                />
              </svg>
            </button>
            <button
              @click="guest === 1 ? validateStep3() : register()"
              class="login-btn"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
      <div class="d-col register-form-container" v-show="step == 4">
        <div class="form-title-container" style="margin-bottom: 8px">
          <span style="text-align: center"
            >Tell us about your gift recipient and when to send their gift.
          </span>
        </div>
        <div
          style="
            margin-bottom: 3px;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            color: #062a20;
            text-align: center;
          "
        >
          <span :class="{ error: avatarError }">
            Provide <span style="color: #e1504b">gift recipient’s </span>details
          </span>
        </div>
        <div class="register-form-section error-msg-container">
          <span class="register-form-error" v-if="errorMessage4">{{
            errorMessage4
          }}</span>
        </div>
        <div class="register-form-section">
          <input
            type="text"
            placeholder="Your gift recipient’s first name*"
            v-model="recipFName"
            class="register-input"
            :class="{ 'form-input-error': recipFNameError }"
            ref="recipFNameInput"
            @keypress.enter="validateStep4()"
          />
        </div>
        <div class="register-form-section">
          <input
            type="text"
            placeholder="Your gift recipient’s last name*"
            v-model="recipLName"
            class="register-input"
            ref="recipLNameInput"
            :class="{ 'form-input-error': recipLNameError }"
            @keypress.enter="validateStep4()"
          />
        </div>
        <div class="register-form-section">
          <input
            type="text"
            placeholder="Your gift recipient’s email*"
            v-model="recipEmail"
            class="register-input"
            ref="recipEmailInput"
            :class="{ 'form-input-error': recipEmailError }"
            @keypress.enter="validateStep4()"
          />
        </div>
        <div class="register-form-section datepicker">
          <datepicker
            :disabled-dates="state.disabledDates"
            input-class="datep-register-input"
            calendar-class="register-calendar"
            wrapper-class="register-wrap-calendar"
            @keypress.enter="validateStep4()"
            required
            v-model="recipGiftDate"
            name="recipGiftDate"
            ref="recipGiftDateInput"
            format="MM/dd/yyyy"
            placeholder="Send my gift on*: MM/DD/YYYY"
          ></datepicker>
          <div class="icon-calendar">
            <img src="../assets/calendar.png" alt="calendar" />
          </div>
        </div>
        <div
          class="register-form-section"
          style="margin-top: 5px; margin-bottom: 8px"
        >
          <div style="float: left; width: 25%; margin-top: 6px"><hr /></div>
          <span>Add a gift message</span>
          <div style="float: right; width: 25%; margin-top: 6px"><hr /></div>
        </div>
        <div class="register-form-section">
          <input
            type="text"
            placeholder="Your name + anyone else the gift is from!"
            v-model="giftSender"
            class="register-input"
            :class="{ 'form-input-error': giftSenderError }"
            ref="giftSenderInput"
          />
        </div>
        <div class="register-form-section">
          <textarea
            rows="4"
            v-model="giftMessage"
            class="register-textarea"
            maxlength="5000"
            value="ckkk kk"
          ></textarea>
        </div>
        <div class="register-form-section d-row d-flex-centered">
          <button @click="step = 3" class="cancel-btn">
            <svg
              height="40"
              viewBox="0 0 1792 1792"
              width="40"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1203 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z"
              />
            </svg>
          </button>
          <button @click="register()" class="login-btn validation">
            VALIDATE & ACCESS THE DASHBOARD
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { serverUrl } from "../severUrl"
import axios from "axios"
import Datepicker from "vuejs-datepicker"

const timeStamp = new Date().getTime()
const yesterdayTimeStamp = timeStamp - 24 * 60 * 60 * 1000
const yesterdayDate = new Date(yesterdayTimeStamp)
const statedate = {
  disabledDates: {
    to: yesterdayDate,
  },
}

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
      newInscription: false,
      guest: -1,
      showingOverlay: false,
      loading: false,
      passwordStates1: "password",
      passwordStates2: "password",
      isAddingQuestion: false,
      tempQuestionTitle: "",
      mailFrequence: 2,
      quantity: 1,
      state: statedate,
      orderNumber: "",
      tokenSh: "",
    }
  },
  components: {
    Datepicker,
  },
  methods: {
    validateStep1: function () {
      this.errorMessage1 = ""
      this.emailError = false
      this.password1Error = false
      this.password2Error = false
      this.nameError = false
      this.name = this.name.trim()
      const letters = /^[A-Za-zÄÖÜäöüßéèàûîï ]+$/

      const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

      if (this.email.length > 50) {
        this.emailError = true
        this.$refs.emailInput.focus()
        this.errorMessage1 = "Email address cannot exceed 50 characters."
        this.step = 1

        return false
      }
      if (!this.email.match(mailformat)) {
        this.emailError = true
        this.$refs.emailInput.focus()
        this.errorMessage1 = "Invalid Email address."
        this.step = 1

        return false
      }
      if (this.name === "") {
        this.nameError = true
        this.$refs.nameInput.focus()
        this.errorMessage1 = "Name is required."
        this.step = 1

        return false
      }
      if (this.name.length > 30) {
        this.nameError = true
        this.$refs.nameInput.focus()
        this.errorMessage1 = "Name cannot exceed 30 characters."
        this.step = 1

        return false
      }
      if (!this.name.match(letters)) {
        this.nameError = true
        this.$refs.nameInput.focus()
        this.errorMessage1 = "Name can only contain letters and spaces."
        this.step = 1

        return false
      }
      if (this.password1.length < 6) {
        this.password1Error = true
        this.$refs.password1Input.focus()

        this.errorMessage1 = "Password has to be at least 6 characters long."
        this.step = 1

        return false
      }
      if (this.password1.length > 30) {
        this.password1Error = true
        this.$refs.password1Input.focus()
        this.errorMessage1 = "Password cannot exceed 30 characters."
        this.step = 1

        return false
      }
      if (this.password1 != this.password2) {
        this.password2Error = true
        this.$refs.password2Input.focus()
        this.errorMessage1 = "Passwords do not match"
        this.step = 1

        return false
      }
      if (this.newInscription) {
        return true
      } else if (this.refg === "" || this.refg === null) {
        this.step = 3
      }
      return true
    },
    validateStep3: function () {
      if (this.guest === -1) {
        this.guestError = true
        this.step = 3

        return false
      }
      if (this.guest === 1) {
        this.step = 4
      }
      return true
    },
    validateStep4: function () {
      this.errorMessage4 = ""
      this.recipFNameError = false
      this.recipLNameError = false
      this.recipEmailError = false
      this.recipGiftDateError = false
      this.giftSenderError = false
      this.recipFName = this.recipFName.trim()
      this.recipLName = this.recipLName.trim()
      this.recipEmail = this.recipEmail.trim()
      this.giftSender = this.giftSender.trim()
      this.giftMessage = this.giftMessage.trim()
      const letters = /^[A-Za-zÄÖÜäöüßéèàûîï ]+$/
      const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      if (this.recipFName === "") {
        this.recipFNameError = true
        this.$refs.recipFNameInput.focus()
        this.errorMessage4 = "gift recipient's first name is required."
        this.step = 4
        return false
      }
      if (this.recipFName.length > 30) {
        this.recipFNameError = true
        this.$refs.recipFNameInput.focus()
        this.errorMessage4 =
          "gift recipient's first name cannot exceed 30 characters."
        this.step = 4
        return false
      }
      if (!this.recipFName.match(letters)) {
        this.recipFNameError = true
        this.$refs.recipFNameInput.focus()
        this.errorMessage4 =
          "gift recipient's first name can only contain letters and spaces."
        this.step = 4
        return false
      }
      if (this.recipLName === "") {
        this.recipLNameError = true
        this.$refs.recipLNameInput.focus()
        this.errorMessage4 = "gift recipient's last name is required."
        this.step = 4
        return false
      }
      if (this.recipLName.length > 30) {
        this.recipLNameError = true
        this.$refs.recipLNameInput.focus()
        this.errorMessage4 =
          "gift recipient's last name cannot exceed 30 characters."
        this.step = 4
        return false
      }
      if (!this.recipLName.match(letters)) {
        this.recipLNameError = true
        this.$refs.recipLNameInput.focus()
        this.errorMessage4 =
          "gift recipient's last name can only contain letters and spaces."
        this.step = 4
        return false
      }
      if (this.recipEmail.length > 50) {
        this.recipEmailError = true
        this.$refs.recipEmailInput.focus()
        this.errorMessage4 = "Email address cannot exceed 50 characters."
        this.step = 4
        return false
      }
      if (!this.recipEmail.match(mailformat)) {
        this.recipEmailError = true
        this.$refs.recipEmailInput.focus()
        this.errorMessage4 = "Invalid Email address."
        this.step = 4
        return false
      }
      console.log(this.recipGiftDate)
      if (this.recipGiftDate === "") {
        this.recipGiftDateError = true
        this.errorMessage4 = "Date is required."
        this.step = 4
        return false
      }
      if (this.giftSender.length > 30) {
        this.giftSenderError = true
        this.$refs.giftSenderInput.focus()
        this.errorMessage4 = "gift sender cannot exceed 30 characters."
        this.step = 4
        return false
      }
      return true
    },

    register: async function () {
      if (!this.newInscription) {
        const step1Valid = this.validateStep1()
        if (!step1Valid) {
          return
        }
        if (this.refg === "" || this.refg === null) {
          console.log(this.refg)
          const step3Valid = this.validateStep3()
          if (!step3Valid) {
            return
          }
          if (this.guest === 1) {
            const step4Valid = this.validateStep4()
            if (!step4Valid) {
              return
            }
          }
        }
      }

      try {
        this.loading = true
        this.showingOverlay = true
        const response = await axios.post(
          serverUrl + "/auth/register",
          {
            email: this.email.toLowerCase(),
            password: this.password1,
            orderId: this.orderId,
            name: this.name,
            guest: this.guest,
            recipFName: this.recipFName,
            recipLName: this.recipLName,
            recipEmail: this.recipEmail,
            giftSender: this.giftSender,
            giftMessage: this.giftMessage,
            recipGiftDate: this.recipGiftDate,
            mailFrequence: this.mailFrequence,
            quantity: this.quantity,
            token: this.tokenSh,
          },
          { withCredentials: true }
        )
        console.log("resultRegister", response)
        if (response.status == 200) {
          this.$store.commit("setUser", response.data)
          this.loading = false
          this.showingOverlay = false
          this.$router.push("/")
        } else {
          this.step = 1
          this.loading = false
          this.showingOverlay = false
        }
      } catch (error) {
        console.log("error", error)
        this.loading = false
        this.showingOverlay = false
        if (error.response.status != 500) {
          this.step = 1
          this.errorMessage1 = error.response.data
        }
      }
    },
    togglePassword: function (index) {
      if (index == 1) {
        if (this.passwordStates1 === "password") {
          this.passwordStates1 = "text"
        } else {
          this.passwordStates1 = "password"
        }
      }
      if (index == 2) {
        if (this.passwordStates2 === "password") {
          this.passwordStates2 = "text"
        } else {
          this.passwordStates2 = "password"
        }
      }
    },
    getGiftData(data, name) {
      const result = data?.find((data) => data?.name === name)
      return result?.value
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
    /*try {
      const response = await axios.get(serverUrl + "/auth/updatePass")
      console.log("password", response?.data)
    } catch (err) {
      console.log(err.message)
    }*/

    let params = new URLSearchParams(document.location.search)
    this.tokenSh = params.get("plk")
    this.orderId = params.get("order-id")
    this.refg = params.get("refg")
    if (this.tokenSh) {
      this.tokenSh.toString()
    }
    if (this.refg) {
      this.refg.toString()
    }
    if (this.orderId) {
      this.orderId.toString()
    }
    try {
      if (this.orderId) {
        const response = await axios.post(
          serverUrl + "/auth/getUserData",
          {
            tokenSh: this.tokenSh,
          },
          { withCredentials: true }
        )
        const result = response?.data
        this.orderNumber = result?.orderNumber
        this.quantity = response?.data?.quantity
        if (result?.giftCustomer?.length > 0) {
          //new form
          this.newInscription = true
          console.log("refg", this.refg)
          this.email = !this.refg
            ? result?.customer?.email
            : this.getGiftData(result?.giftCustomer, "Email")
          this.name = !this.refg
            ? result?.customer?.first_name
            : this.getGiftData(result?.giftCustomer, "FirstName")
          this.orderId = this.result?.orderId
          this.lastName = !this.refg
            ? result?.customer?.last_Name
            : this.getGiftData(result?.giftCustomer, "LastName")
          this.recipFName = !this.refg
            ? this.getGiftData(result?.giftCustomer, "FirstName")
            : ""
          this.recipLName = !this.refg
            ? this.getGiftData(result?.giftCustomer, "LastName")
            : ""
          this.recipEmail = !this.refg
            ? this.getGiftData(result?.giftCustomer, "Email")
            : ""
          this.giftSender = !this.refg
            ? this.getGiftData(result?.giftCustomer, "From")
            : ""
          this.recipGiftDate = !this.refg
            ? this.getGiftData(result?.giftCustomer, "GiftDate")
            : ""
          this.giftMessage = !this.refg
            ? this.getGiftData(result?.giftCustomer, "Message")
            : ""
          this.guest =
            this.getGiftData(result?.giftCustomer, "Whom") === "someoneWill"
              ? 1
              : 0

          console.log("email", this.email)
          await this.register()
        }
      } else if (this.tokenSh) {
        this.newInscription = true
        await this.register()
      }
    } catch (error) {
      console.log("error", error)
      this.loading = false
      this.showingOverlay = false
      if (error.response.status != 500) {
        this.step = 1
        this.errorMessage1 = error.response.data
      }
    }
  },
}
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

.question-title {
  font-family: galaxie-polaris;
  font-style: normal;
  font-weight: 550;
  font-size: 16px;
  line-height: 27px;
  color: #062a20;
}
.questions-list {
  max-height: 390px;
  overflow: auto;
}
.route-section {
  overflow: scroll;
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
  .register-form-container {
    background: transparent;
  }
  .register-form-container.chapter-question {
    margin-top: 20px;
  }
  .register-form-container,
  .giftform .register-form-container {
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
  .add-question-container {
    margin-top: 6px;
    padding: 7px;
  }
  .add-question-text {
    font-family: galaxie-polaris;
    margin-left: 12px;
    font-size: 14px;
    line-height: 27px;
    font-weight: 400;
  }

  .plus-sign {
    width: 12px;
    height: 12px;
  }
  .login-btn.validation {
    padding: 10px 43px;
  }
  .question-head {
    display: block;
    padding: 20px 13px 20px 13px;
    background: #ffffff;
    border: 1px solid rgba(6, 42, 32, 0.1);
    border-radius: 18px;
    margin-top: 14px;
  }
  .question-title-container {
    margin-bottom: 15px;
  }

  .question-title {
    font-family: galaxie-polaris;
    font-style: normal;
    font-weight: 550;
    font-size: 14px;
    line-height: 16px;
    color: #062a20;
  }

  .question-control-image {
    height: 18px;
    width: 18px;
  }
}
</style>
<style>
.register-form-section.datepicker {
  width: 100%;
  border: 1px solid rgba(6, 42, 32, 0.2);
  outline: none;
  display: flex;
}
.register-wrap-calendar {
  width: 100%;
}
.register-wrap-calendar .datep-register-input {
  border: none;
  width: 100%;
  padding: 15px 20px 18px 20px;
  font-size: 16px;
  line-height: 24px;
  font-family: galaxie-polaris;
  outline: none;
  color: #14473c;
  height: 62px;
  box-sizing: border-box;
}
.register-form-section.datepicker .icon-calendar {
  height: 19px;
  width: 22px;
  margin-top: 14px;
  z-index: 4;
  margin-right: 20px;
  font-size: 25px;
}
.register-wrap-calendar .datep-register-input::placeholder {
  color: rgba(6, 42, 32, 0.4);
}
</style>
