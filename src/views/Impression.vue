<template>
  <div class="d-row site-background">
    <div class="overlay" v-if="showingOverlay">
      <div class="pop-up d-flex-centered d-col" v-if="confirmingPrint">
        <div class="pop-up-title">
          <span>CONFIRM PRINTING</span>
        </div>
        <div class="pop-up-paragraph" style="max-width: 362px">
          <span
            >We need a second confirmation to start printing. Warning, you will
            not be able to go back after the confirmation.
          </span>
        </div>
        <div class="pop-up-buttons-container">
          <button
            class="pop-up-btn confirm"
            @click="confirmPrint()"
            style="margin-right: 12px"
          >
            I CONFIRM
          </button>
          <button class="pop-up-btn" @click="cancelPrint()">BACK</button>
        </div>
      </div>
      <div class="pop-up d-flex-centered d-col" v-if="errorPrint">
        <div style="height: 68px; margin-bottom: 26px">
          <img
            src="../assets/alert.png"
            alt=""
            style="height: 68px; width: 68px"
          />
        </div>
        <div class="pop-up-title">
          <span>{{ errorReason }}</span>
        </div>
        <div class="pop-up-paragraph" style="max-width: 362px">
          <span>{{ errorParagraph }} </span>
        </div>
        <div class="d-row d-flex-centered">
          <button
            class="pop-up-btn confirm"
            @click="hideErrorPanel()"
            style="margin-right: 12px; background: #e1504b"
          >
            Understood
          </button>
        </div>
      </div>
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <navbar></navbar>

    <div class="container">
      <div class="d-flex-centered d-col route-section" style="">
        <h1 style="font-size: 24px; width: 100%" class="mobile title-section">
          Print
        </h1>
        <div class="print-section-container d-col" v-show="step == 1">
          <div
            class="d-row"
            style="
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 12px;
              line-height: 18px;
            "
          >
            <div class="ptr" style="color: #e1504b" @click="step = 1">
              Shipping
            </div>
            <div
              class="ptr"
              style="color: rgba(6, 42, 32, 0.7)"
              @click="goToNextStep()"
            >
              Confirmation
            </div>
          </div>
          <div class="d-row" style="width: 100%; margin-bottom: 10px">
            <div
              class="ptr"
              style="
                width: 50%;
                height: 3px;
                background: #e1504b;

                position: relative;
              "
              @click="step = 1"
            ></div>
            <div
              class="ptr"
              style="
                width: 50%;
                height: 3px;
                background: #e5e9e8;

                position: relative;
              "
              @click="goToNextStep()"
            ></div>
          </div>
          <div class="form-title-container">
            <span style="text-align: center">SHIPPING ADDRESS</span>
          </div>
          <div style="margin-bottom: 10px">
            <span>Your account include {{ this.quantity }} book. </span>
          </div>
          <div class="print-form-section error-msg-container">
            <span class="print-form-error" v-if="errorMessage1">{{
              errorMessage1
            }}</span>
          </div>
          <div class="print-form-section error-msg-container">
            <span class="print-form-success" v-if="successSaved">
              Your adress has been successfully saved
            </span>
          </div>
          <div class="print-form-section">
            <input
              type="text"
              placeholder="Name"
              v-model="adressName"
              class="print-input"
              :class="{ 'form-input-error': nameError }"
              ref="nameInput"
              @keypress.enter="validateStep1()"
            />
          </div>
          <div class="print-form-section">
            <input
              type="text"
              placeholder="Address line 1"
              v-model="streetLine1"
              class="print-input"
              :class="{ 'form-input-error': streetError }"
              ref="streetInput"
              @keypress.enter="validateStep1()"
            />
          </div>
          <div class="print-form-section">
            <select
              class="print-input"
              :class="{ 'form-input-error': countryError }"
              v-model="country"
              ref="countryInput"
            >
              <option
                class="rounded-full"
                value="country"
                disabled
                selected="selected"
              >
                Country
              </option>
              <option value="usa">United States</option>
              <option value="ca">Canada</option>
              <option value="uk">UK</option>
              <option value="nz">New Zealand</option>
              <option value="aus">Australia</option>
            </select>
          </div>
          <div class="print-form-section">
            <input
              type="text"
              placeholder="City"
              v-model="city"
              class="print-input"
              :class="{ 'form-input-error': cityError }"
              ref="cityInput"
              @keypress.enter="validateStep1()"
            />
          </div>
          <div class="print-form-section">
            <input
              type="text"
              placeholder="State"
              v-model="state"
              class="print-input"
              ref="stateInput"
              @keypress.enter="validateStep1()"
            />
          </div>
          <div class="print-form-section">
            <input
              type="text"
              placeholder="Zip code"
              v-model="zipCode"
              class="print-input"
              :class="{ 'form-input-error': zipCodeError }"
              ref="zipCodeInput"
              @keypress.enter="validateStep1()"
            />
          </div>
          <div class="print-form-section spaced d-row d-flex-centered">
            <button
              @click="goToNextStep()"
              style="background-color: #e1504b; margin-right: 10px"
              class="login-btn"
            >
              NEXT
            </button>
            <button @click="saveShippingAdress()" class="login-btn">
              SAVE
            </button>
          </div>
        </div>
        <div class="d-col print-form-container" v-show="step == 2">
          <div
            class="d-row"
            style="
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 12px;
              line-height: 18px;
            "
          >
            <div
              class="ptr"
              style="color: rgba(6, 42, 32, 0.7)"
              @click="goToPrviewsStep()"
            >
              Shipping
            </div>
            <div class="ptr" style="color: #e1504b" @click="step = 2">
              Confirmation
            </div>
          </div>
          <div class="d-row" style="width: 100%; margin-bottom: 10px">
            <div
              class="ptr"
              style="
                width: 50%;
                height: 3px;
                background: #e5e9e8;
                position: relative;
              "
              @click="goToPrviewsStep()"
            ></div>
            <div
              class="ptr"
              style="
                width: 50%;
                height: 3px;
                background: #e1504b;
                position: relative;
              "
              @click="step = 2"
            ></div>
          </div>
          <div class="main-section-container" style="text-align: center">
            <div class="right-side-print">
              <div class="form-title-container">
                <span style="text-align: center">CONFIRM PRINTING</span>
              </div>
              <div class="print-confirm-btn-mobile">
                <button
                  class="confirm-impression-btn ptr"
                  @click="startConfirmingPrint()"
                  :class="{ disabled: printStatus != 'writing' }"
                  :disabled="printStatus != 'writing'"
                >
                  CONFIRM PRINTING
                </button>
              </div>
              <div style="margin-bottom: 18px">
                <span class="print-paragraph">
                  Congrats ! This is the last step, you can either go back to
                  make changes or start printing your book by clicking on the
                  button below.
                </span>
              </div>
              <div class="book-stats-container">
                <div style="margin-bottom: 5px">
                  <span
                    >Total number of stories:
                    <span style="color: #e1504b">{{ storiesCount }}</span>
                  </span>
                </div>
                <div style="margin-bottom: 5px">
                  <span
                    >Total number of pictures:
                    <span style="color: #e1504b">{{ imagesCount }}</span>
                  </span>
                </div>
                <div style="margin-bottom: 5px">
                  <span
                    >Total number of pages:
                    <span style="color: #e1504b">{{ pagesCount }}</span>
                  </span>
                </div>
              </div>
              <div class="print-confirm-btn">
                <button
                  class="confirm-impression-btn ptr"
                  @click="startConfirmingPrint()"
                  :class="{ disabled: printStatus != 'writing' }"
                  :disabled="printStatus != 'writing'"
                >
                  CONFIRM PRINTING
                </button>
                <button
                  class="back-impression-btn ptr"
                  @click="goToPrviewsStep()"
                >
                  BACK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from "../components/navbar.vue"
import axios from "axios"
import { serverUrl } from "../severUrl"

export default {
  components: {
    navbar,
  },
  data() {
    return {
      styles: [],
      showingOverlay: true,
      loading: false,
      confirmingPrint: false,
      storiesCount: 0,
      imagesCount: 0,
      pagesCount: 0,
      errorPrint: false,
      errorReason: "",
      errorParagraph: "",
      currentCoverIndex: "1",
      step: 1,
      country: "",
      adressName: "",
      streetLine1: "",
      city: "",
      state: "",
      zipCode: "",
      nameError: false,
      streetError: false,
      countryError: false,
      cityError: false,
      zipCodeError: false,
      errorMessage1: "",
      adressSaved: false,
      successSaved: false,
      quantity: "",
      printStatus: "writing",
    }
  },
  methods: {
    validateStep1: function () {
      this.nameError = ""
      this.streetError = false
      this.countryError = false
      this.cityError = false
      this.zipCodeError = false
      this.successSaved = false
      this.errorMessage1 = ""
      if (this.adressName === "" || !this.adressName) {
        this.nameError = true
        this.$refs.nameInput.focus()
        this.errorMessage1 = "Adress name is required"
        this.step = 1
        return false
      }
      if (this.streetLine1 === "" || !this.streetLine1) {
        this.streetError = true
        this.$refs.streetInput.focus()
        this.errorMessage1 = "Adress line 1 is required"
        this.step = 1
        return false
      }
      if (this.country === "" || this.country === "country" || !this.country) {
        this.countryError = true
        this.$refs.countryInput.focus()
        this.errorMessage1 = "Country is required"
        this.step = 1
        return false
      }
      if (this.city === "" || !this.city) {
        this.cityError = true
        this.$refs.cityInput.focus()
        this.errorMessage1 = "City is required"
        this.step = 1
        return false
      }
      if (this.zipCode === "" || !this.zipCode) {
        this.zipCodeError = true
        this.$refs.zipCodeInput.focus()
        this.errorMessage1 = "Zip Code is required"
        this.step = 1
        return false
      }

      return true
    },
    goToNextStep: function () {
      if (this.validateStep1() && this.adressSaved) {
        let orderUser = this.user
        if (!this.isPrincipalOrder) {
          const story = this.user?.listOrders?.find(
            (sto) => sto.bookId === this.user?.defaultBookId
          )
          const indexStory = this.user.listOrders?.indexOf(story)
          orderUser = this.user.listOrders[indexStory]
        }
        if (
          this.city !== orderUser?.city ||
          this.adressName !== orderUser?.adressName ||
          this.country !== orderUser?.country ||
          this.state !== orderUser?.state ||
          this.zipCode !== orderUser?.zipCode ||
          this.streetLine1 !== orderUser?.streetLine1
        ) {
          this.errorMessage1 =
            "You should save your adress before proceeding to the next step"
          this.step = 1
          return false
        } else {
          this.errorMessage1 = ""
          this.successSaved = false
          this.step = 2
        }
      } else {
        this.errorMessage1 =
          "You should save your adress before proceeding to the next step"
        this.step = 1
        return false
      }
    },
    goToPrviewsStep: function () {
      this.step = 1
    },
    saveShippingAdress: async function () {
      const isvalid = this.validateStep1()

      try {
        if (isvalid) {
          if (this.isPrincipalOrder) {
            this.user.updateBoth = true
            this.user.adressName = this.adressName
            this.user.country = this.country
            this.user.streetLine1 = this.streetLine1
            this.user.city = this.city
            this.user.state = this.state
            this.user.zipCode = this.zipCode
          } else {
            const book = this.user?.listOrders?.find(
              (sto) => sto.bookId === this.user?.defaultBookId
            )
            const indexStory = this.user.listOrders?.indexOf(book)
            this.user.listOrders[indexStory].updateBoth = true
            this.user.listOrders[indexStory].adressName = this.adressName
            this.user.listOrders[indexStory].country = this.country
            this.user.listOrders[indexStory].streetLine1 = this.streetLine1
            this.user.listOrders[indexStory].city = this.city
            this.user.listOrders[indexStory].state = this.state
            this.user.listOrders[indexStory].zipCode = this.zipCode
          }
          this.errorMessage1 = ""
          this.successSaved = false
          this.loading = true
          this.showingOverlay = true
          const response = await axios.put(
            serverUrl + "/api/users/",
            this.user,
            {
              withCredentials: true,
            }
          )
          if (response.status == 200) {
            const userString = JSON.stringify(this.user)
            localStorage.setItem("user", userString)
            this.adressSaved = true
            this.loading = false
            this.showingOverlay = false
            this.successSaved = true
          }
        }
      } catch (error) {
        console.log(error)
        this.loading = false
        this.showingOverlay = false
        this.adressSaved = false
        this.successSaved = false
      }
    },
    startConfirmingPrint: function () {
      this.confirmingPrint = true
      this.showingOverlay = true
    },
    cancelPrint: function () {
      this.confirmingPrint = false
      this.showingOverlay = false
    },
    confirmPrint: async function () {
      try {
        this.confirmingPrint = false
        this.loading = true
        this.showingOverlay = true
        const userData = {
          userId: this.user._id,
          dfBookId: this.user.defaultBookId
            ? this.user.defaultBookId
            : this.user.bookId,
        }
        const response = await axios.post(
          serverUrl + "/api/users/confirm-print/",
          userData,
          { withCredentials: true }
        )
        if (response.status == 200) {
          if (this.isPrincipalOrder) {
            this.user.printStatus = "pending"
          } else {
            const book = this.user?.listOrders?.find(
              (sto) => sto.bookId === this.user?.defaultBookId
            )
            const indexStory = this.user.listOrders?.indexOf(book)
            this.user.listOrders[indexStory].printStatus = "pending"
          }
          this.printStatus = "pending"
          this.loading = false
          this.showingOverlay = false
        }
      } catch (error) {
        console.log(error)
        this.loading = false
        this.showingOverlay = false
        if (error.response.status == 400) {
          console.log(error.response.data)
          this.showingOverlay = true
          this.errorPrint = true
          this.errorReason = error.response.data.reason
          this.errorParagraph = error.response.data.paragraph
        }
      }
    },
    hideErrorPanel: function () {
      this.errorPrint = false
      this.showingOverlay = false
      this.errorReason = ""
      this.errorParagraph = ""
    },
  },
  async mounted() {
    try {
      if (this.user) {
        this.showingOverlay = true
        this.loading = true
        const bookId = this.user?.defaultBookId
          ? this.user?.defaultBookId
          : this.user.bookId
        const result = await axios.get(
          serverUrl + "/api/books/stats/" + bookId,
          { withCredentials: true }
        )
        if (result.data.pagesCount % 2 == 1) {
          this.pagesCount = result.data.pagesCount + 1
        } else {
          this.pagesCount = result.data.pagesCount
        }
        this.imagesCount = result.data.imagesCount
        this.storiesCount = result.data.storiesCount
        this.showingOverlay = false
        this.loading = false
      }
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser
    },
    isPrincipalOrder: function () {
      return (
        this.user?.bookId === this.user?.defaultBookId ||
        !this.user?.defaultBookId
      )
    },
  },
  created() {
    if (this.isPrincipalOrder) {
      this.adressName = this.user?.adressName
      this.country = this.user?.country ? this.user?.country : "country"
      this.streetLine1 = this.user?.streetLine1
      this.city = this.user?.city
      this.state = this.user?.state
      this.zipCode = this.user?.zipCode
      this.quantity = this?.user?.quantity ? this?.user?.quantity : 1
      if (this.user?.streetLine1) {
        this.adressSaved = true
      }
      this.printStatus = this.user.printStatus
    } else {
      const story = this.user?.listOrders?.find(
        (sto) => sto.bookId === this.user?.defaultBookId
      )
      const indexStory = this.user.listOrders?.indexOf(story)
      this.adressName = this.user.listOrders[indexStory].adressName
      this.country = this.user.listOrders[indexStory]?.country
        ? this.user.listOrders[indexStory]?.country
        : "country"
      this.streetLine1 = this.user.listOrders[indexStory]?.streetLine1
      this.city = this.user.listOrders[indexStory]?.city
      this.state = this.user.listOrders[indexStory]?.state
      this.zipCode = this.user.listOrders[indexStory]?.zipCode
      this.quantity = this.user.listOrders[indexStory]?.quantity
        ? this.user.listOrders[indexStory]?.quantity
        : 1
      if (this.user.listOrders[indexStory]?.streetLine1) {
        this.adressSaved = true
      }
      this.printStatus = this.user.listOrders[indexStory]?.printStatus
        ? this.user.listOrders[indexStory]?.printStatus
        : "writing"
    }
  },
}
</script>

<style>
.main-section-container {
  padding: 40px;
  background: #ffffff;
  box-sizing: border-box;
  border-radius: 22px;
  display: flex;
}
.route-section {
  overflow: scroll;
}
.confirm-impression-btn {
  background: #e1504b;
  width: 100%;
  padding: 20px 0px;
  font-family: PT-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  text-transform: uppercase;
  border: none;

  /* white/white */
  color: #ffffff;
}
.back-impression-btn {
  margin-top: 10px;
  background: #fff;
  color: #000;
  border: 1px solid #000;
  width: 100%;
  padding: 20px 0px;
  font-family: PT-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  text-transform: uppercase;
}

.confirm-impression-btn.disabled {
  background: #bebebe;
  cursor: not-allowed;
}

.left-side-print {
  margin-right: 53px;
}

.right-side-print {
  width: 293px;
}

.print-confirm-btn {
  text-align: center;
}

.print-confirm-btn-mobile {
  display: none;
  margin-bottom: 14px;
}

.print-paragraph {
  font-family: galaxie-polaris;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  color: #062a20;
}
.form-input-error:focus {
  border: 2px solid #eb4848;
}
.print-image {
  height: 324px;
  width: 213px;
}

.book-stats-container {
  font-weight: 500;
  font-size: 16px;
  color: #062a20;
  margin-bottom: 52px;
}

.route-title-container {
  display: none;
}

.print-section-container {
  padding: 70px;
  background: #ffffff;
  border: 1px solid rgba(6, 42, 32, 0.2);
  border-radius: 22px;
  margin-top: 44px;
  box-sizing: border-box;
  width: 468px;
  max-width: 100%;
}
.print-input {
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
select.print-input {
  display: block;
  font-size: 1em;
  /* padding: 0.8rem 0.5rem; */
  font-family: inherit;
  appearance: none;
  background-image: url("../assets/arrow-down.png");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 0.9em;
}
.print-input:focus {
  border: 1px solid rgba(6, 42, 32, 0.35);
}
.print-input::placeholder {
  color: rgba(6, 42, 32, 0.4);
}
.print-form-container {
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
  margin-bottom: 20px;
  margin-top: 15px;
  color: #062a20;
}
.print-form-section {
  text-align: center;
  margin-bottom: 8px;
  width: 100%;
  position: relative;
}
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
  cursor: pointer;
}
.print-form-error {
  color: #eb4848;
  font-size: 14px;
}
.print-form-success {
  color: #44ba12;
  font-size: 14px;
}
@media screen and (max-width: 1024px) {
  .print-section-container {
    padding: 0px;
    border: none;
    margin-top: 50px;
    background: transparent;
  }
  .route-section {
    overflow: scroll;
    padding: 24px;
  }
  .main-section-container {
    padding: 30px 20px;

    flex-direction: column;
  }
  .left-side-print {
    margin-right: 0px;
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .right-side-print {
    width: 100%;
  }
  .print-confirm-btn-mobile {
    display: block;
  }
  .print-confirm-btn {
    display: none;
  }
  .confirm-impression-btn {
    font-size: 14px;
    padding: 15px 0px;
  }
  .print-paragraph {
    font-size: 14px;
    line-height: 19px;
    display: inline-block;
    max-width: 500px;
  }
  .print-image {
    width: 173px;
    height: 264px;
  }

  .book-stats-container {
    font-weight: 500;
    font-size: 14px;
    color: #062a20;
  }

  .route-title-container {
    display: block;
    font-size: 20px;
    font-weight: 500;
  }
  .book-stats-container {
    margin-bottom: 18px;
  }
}
</style>
