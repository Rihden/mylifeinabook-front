<template>
  <div class="d-row site-background">
    <div class="overlay" v-if="showingOverlay">
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <div class="overlay mobile-visible" v-if="showingEditingGiftDetails">
      <div class="pop-up d-flex-centered d-col" v-if="isEditingGiftDetails">
        <div class="pop-up-title" style="font-size: 18px; margin-bottom: 8px">
          <span> Edit the gift recipient email </span>
        </div>
        <div class="pop-up-paragraph" style="width: 100%; margin-bottom: 8px">
          <input
            class="gift-title-input-overlay chapter-control"
            type="text"
            v-model="recipEmail"
            :placeholder="user.recipEmail"
            @keypress.enter="confirmEditingGift('recipEmail')"
            :ref="recipEmail"
          />
        </div>
        <div class="pop-up-buttons-container">
          <button
            class="pop-up-btn confirm"
            @click="confirmEditingGift('recipEmail')"
            style="
              border-radius: 60px;
              padding: 13px 44px;
              text-transform: uppercase;
            "
          >
            Confirm
          </button>
          <button
            class="pop-up-btn"
            @click="cancelEditing()"
            style="
              border-radius: 60px;
              padding: 13px 44px;
              text-transform: uppercase;
            "
          >
            Cancel
          </button>
        </div>
      </div>
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>

    <div class="overlay mobile-visible" v-if="showingEditingGiftMessage">
      <div class="pop-up d-flex-centered d-col" v-if="isEditingGiftMessage">
        <div class="pop-up-title" style="font-size: 18px; margin-bottom: 8px">
          <span> Edit the gift recipient Message </span>
        </div>
        <div class="pop-up-paragraph" style="width: 100%; margin-bottom: 8px">
          <textarea
            rows="4"
            style="box-sizing: border-box"
            class="question-title-textarea"
            v-model="giftMessage"
            ref="giftMessage"
            @keypress.enter="confirmEditingGift('giftMessage')"
          />
        </div>
        <div class="pop-up-buttons-container">
          <button
            class="pop-up-btn confirm"
            @click="confirmEditingGift('giftMessage')"
            style="
              border-radius: 60px;
              padding: 13px 44px;
              text-transform: uppercase;
            "
          >
            Confirm
          </button>
          <button
            class="pop-up-btn"
            @click="cancelEditing()"
            style="
              border-radius: 60px;
              padding: 13px 44px;
              text-transform: uppercase;
            "
          >
            Cancel
          </button>
        </div>
      </div>
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <navbar></navbar>

    <div class="container">
      <div class="route-section">
        <div class="profile-container">
          <div v-if="routeIndex == 0">
            <vue-tabs type="pills" :start-index="1" direction="vertical">
              <v-tab
                title="Gift details"
                v-if="user.isBuyer == 1 && user.guest == 1"
              >
                <div class="profile-panel">
                  <div class="profile-route-title">
                    <span>Gift details</span>
                  </div>
                  <div
                    v-if="errorStatus.status"
                    style="color: #eb4848; margin-bottom: 10px"
                  >
                    <img
                      src="../assets/clear.png"
                      height="10px"
                      width="10px"
                      alt=""
                    />
                    {{ errorStatus.message }}
                  </div>
                  <div>
                    <div class="label-gift-title">
                      Your gift recipient email:
                    </div>
                    <div class="d-row">
                      <input
                        class="gift-title-input chapter-control desktop-visible"
                        type="text"
                        v-if="action == 'recipEmail'"
                        v-model="recipEmail"
                        :placeholder="user.recipEmail"
                        @keypress.enter="confirmEditingGift('recipEmail')"
                        :ref="recipEmail"
                      />
                      <span v-if="action != 'recipEmail'" class="gift-title"
                        >{{ user.recipEmail }}
                      </span>
                      <img
                        @click="startEditingTitle('recipEmail')"
                        v-if="action != 'recipEmail'"
                        src="../assets/pencil.svg"
                        class="chapter-control pen-icon-img"
                        alt=""
                        height="18px"
                        width="18px"
                        draggable="false"
                      />
                      <img
                        @click="confirmEditingGift('recipEmail')"
                        v-if="action == 'recipEmail'"
                        src="../assets/confirm.svg"
                        class="chapter-control pen-icon-img desktop-visible"
                        alt=""
                        height="30px"
                        width="30px"
                        draggable="false"
                        style="margin-right: 8px"
                      />
                      <img
                        @click="cancelEditing()"
                        v-if="action == 'recipEmail'"
                        src="../assets/cancel.svg"
                        class="chapter-control pen-icon-img desktop-visible"
                        alt=""
                        height="30px"
                        width="30px"
                        draggable="false"
                      />
                    </div>
                    <div class="label-gift-title" style="margin-top: 20px">
                      Send gift on:
                    </div>
                    <div class="d-row">
                      <datepicker
                        v-if="action == 'recipGiftDate'"
                        :disabled-dates="state.disabledDates"
                        input-class="datep-gift-input gift-title-input chapter-control"
                        calendar-class="register-calendar"
                        @keypress.enter="confirmEditingGift('recipGiftDate')"
                        required
                        v-model="recipGiftDate"
                        name="recipGiftDate"
                        ref="recipGiftDateInput"
                        format="dd/MM/yyyy"
                        :placeholder="recipGiftDate"
                      ></datepicker>
                      <span v-if="action != 'recipGiftDate'" class="gift-title"
                        >{{ recipGiftDate }}
                      </span>
                      <img
                        @click="startEditingTitle('recipGiftDate')"
                        v-if="action != 'recipGiftDate'"
                        src="../assets/pencil.svg"
                        class="chapter-control pen-icon-img"
                        alt=""
                        height="18px"
                        width="18px"
                        draggable="false"
                      />
                      <img
                        @click="confirmEditingGift('recipGiftDate')"
                        v-if="action == 'recipGiftDate'"
                        src="../assets/confirm.svg"
                        class="chapter-control pen-icon-img"
                        alt=""
                        height="30px"
                        width="30px"
                        draggable="false"
                        style="margin-right: 8px"
                      />
                      <img
                        @click="cancelEditing()"
                        v-if="action == 'recipGiftDate'"
                        src="../assets/cancel.svg"
                        class="chapter-control pen-icon-img"
                        alt=""
                        height="30px"
                        width="30px"
                        draggable="false"
                      />
                    </div>
                    <div class="label-gift-title" style="margin-top: 20px">
                      Gift message:
                    </div>
                    <div class="d-row">
                      <textarea
                        rows="4"
                        v-model="giftMessage"
                        class="gift-register-textarea desktop-visible"
                        maxlength="5000"
                        v-if="action == 'giftMessage'"
                        @keypress.enter="confirmEditingGift('giftMessage')"
                      ></textarea>
                      <span
                        v-if="action != 'giftMessage'"
                        class="gift-title"
                        style="max-width: 400px"
                        >{{ user.giftMessage }}
                      </span>
                      <img
                        @click="startEditingTitle('giftMessage')"
                        v-if="action != 'giftMessage'"
                        src="../assets/pencil.svg"
                        class="chapter-control pen-icon-img"
                        alt=""
                        height="18px"
                        width="18px"
                        draggable="false"
                      />
                      <img
                        @click="confirmEditingGift('giftMessage')"
                        v-if="action == 'giftMessage'"
                        src="../assets/confirm.svg"
                        class="chapter-control pen-icon-img desktop-visible"
                        alt=""
                        height="30px"
                        width="30px"
                        draggable="false"
                        style="margin-right: 8px"
                      />
                      <img
                        @click="cancelEditing()"
                        v-if="action == 'giftMessage'"
                        src="../assets/cancel.svg"
                        class="chapter-control pen-icon-img desktop-visible"
                        alt=""
                        height="30px"
                        width="30px"
                        draggable="false"
                      />
                    </div>
                    <div
                      style="margin-right: 15px; margin-top: 15px"
                      v-if="savedSeeting"
                    >
                      <img
                        src="../assets/check-red.svg"
                        alt=""
                        height="16px"
                        width="16px"
                        style="margin-right: 10px"
                      />
                      <span class="tabs-span">Settings saved</span>
                    </div>
                    <button class="gift-btn ptr" @click="sendGiftEmail()">
                      Resend gift email
                    </button>
                    <div
                      style="margin-right: 15px; margin-top: 15px"
                      v-if="emailSent"
                    >
                      <img
                        src="../assets/check-red.svg"
                        alt=""
                        height="16px"
                        width="16px"
                        style="margin-right: 10px"
                      />
                      <span class="tabs-span">Email sent</span>
                    </div>
                  </div>
                </div>
              </v-tab>
              <v-tab title="Reset Password">
                <div class="profile-panel">
                  <div class="d-row">
                    <div class="name-container">
                      <span>{{ user.lastName }} {{ user.name }}</span>
                    </div>
                  </div>
                  <div class="profile-route-title">
                    <span>Change Password</span>
                  </div>
                  <div style="max-width: 350px">
                    <div class="profile-form-section d-row">
                      <input
                        :type="passwordStates1"
                        class="profile-input"
                        :class="{ error: field1Error }"
                        v-model="oldPw"
                        @keypress.enter="updatePassword()"
                        placeholder="Old Password"
                      />
                      <div
                        class="password-eye update-password ptr"
                        @click="togglePassword(1)"
                      >
                        <img src="../assets/eye.png" alt="" />
                      </div>
                    </div>
                    <div class="profile-form-section d-row">
                      <input
                        :type="passwordStates2"
                        class="profile-input"
                        v-model="newPw1"
                        @keypress.enter="updatePassword()"
                        :class="{ error: field2Error }"
                        placeholder="New Password"
                      />
                      <div
                        class="password-eye update-password ptr"
                        @click="togglePassword(2)"
                      >
                        <img src="../assets/eye.png" alt="" />
                      </div>
                    </div>
                    <div class="profile-form-section d-row">
                      <input
                        :type="passwordStates3"
                        class="profile-input"
                        v-model="newPw2"
                        @keypress.enter="updatePassword()"
                        :class="{ error: field3Error }"
                        placeholder="Re-enter New Password"
                      />
                      <div class="password-eye update-password ptr">
                        <img
                          src="../assets/eye.png"
                          alt=""
                          @click="togglePassword(3)"
                        />
                      </div>
                    </div>
                    <div
                      style="
                        margin-bottom: 12px;
                        font-size: 14px;
                        text-align: left;
                        height: 21px;
                        padding-left: 12px;
                      "
                    >
                      <span v-if="errorText" style="color: #eb4848"
                        ><img
                          src="../assets/clear.png"
                          height="10px"
                          width="10px"
                          alt=""
                        />
                        {{ errorText }}</span
                      >
                      <span v-if="updatedPassword" style="color: #14473c">
                        <img
                          src="../assets/check-red.svg"
                          height="12px"
                          width="12px"
                          alt=""
                        />
                        Password changed successfully.
                      </span>
                    </div>
                    <div class="profile-btn-container" style="margin-top: 36px">
                      <button
                        class="password-confirm-btn ptr"
                        @click="updatePassword()"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
                <div class="mobile-visible">
                  <div>
                    <div
                      class="help-section d-flex-centered d-col"
                      v-if="user.role != 'admin'"
                    >
                      <img
                        src="../assets/intersect-1.svg"
                        alt=""
                        class="stripe-1"
                      />
                      <img
                        src="../assets/intersect-2.svg"
                        alt=""
                        class="stripe-2"
                      />
                      <img
                        src="../assets/intersect-3.svg"
                        alt=""
                        class="stripe-3"
                      />

                      <span
                        style="
                          font-weight: 400;
                          font-size: 16px;
                          line-height: 17px;
                          color: white;
                          margin-bottom: 11px;
                        "
                        >Support</span
                      >
                      <span style="font-weight: 500; color: white"
                        >Need help?</span
                      >
                      <a href="#" target="_blank" class="help-button"
                        ><span>Help</span></a
                      >
                    </div>
                  </div>
                  <div class="logout-btn-container">
                    <button class="save-cover-btn" @click="logout()">
                      Log out
                    </button>
                  </div>
                </div>
              </v-tab>
              <v-tab title="Recipients">
                <div class="profile-panel">
                  <div class="profile-route-title">
                    <span>Recipients of the stories</span>
                  </div>
                  <div>
                    <div class="visitors-list" style="margin-bottom: 15px">
                      <div
                        v-for="(visitor, indexvisitor) in user.visitors"
                        :key="indexvisitor"
                        class="ptr"
                      >
                        <div
                          class="visitor-head d-flex-centered"
                          style="height: 27px; box-sizing: border-box"
                        >
                          <input
                            rows="1"
                            style="border: none; font-weight: 500"
                            class="visitor-title-input"
                            :value="visitor.name"
                            readonly
                          />
                          <input
                            rows="1"
                            style="border: none"
                            class="visitor-title-input"
                            :value="visitor.email"
                            readonly
                          />
                          <div
                            @click="removeRecipient(indexvisitor)"
                            style="cursor: pointer"
                          >
                            <img
                              src="../assets/trash.svg"
                              alt=""
                              class="trash-sign"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- adding visitor section -->
                    <div
                      v-if="!isAddingVisitor"
                      class="ptr"
                      @click="startAddingStory()"
                    >
                      <div
                        class=""
                        style="
                          margin: auto;
                          text-align: center;
                          margin-top: 15px;
                          cursor: pointer;
                        "
                      >
                        <img src="/img/plus.f82d4a0f.svg" alt="" />
                      </div>
                      <div class="add-visitor-text" style="text-align: center">
                        Add new recipient
                      </div>
                    </div>
                    <div
                      v-if="isAddingVisitor"
                      class="d-row visitor-head adding-visitor"
                      style="border: 1px solid #e1504b"
                    >
                      <div
                        class="d-row visitor-title-input"
                        style="
                          flex-grow: 1;
                          margin-right: 8px;
                          height: 27px;
                          box-sizing: border-box;
                        "
                      >
                        <input
                          rows="1"
                          style="border: none"
                          class="visitor-title-input"
                          v-model="visitorName"
                          placeholder="First name"
                          @keypress.enter="confirmNewStory()"
                          ref="newvisitorNameInput"
                        />
                        <input
                          rows="1"
                          style="border: none"
                          class="visitor-title-input"
                          v-model="visitorEmail"
                          placeholder="Email address"
                          @keypress.enter="confirmNewStory()"
                        />
                      </div>
                      <div class="d-row editing-buttons-container">
                        <div
                          class="visitor-control ptr"
                          @click="confirmNewStory()"
                          style="margin-right: 12px; cursor: pointer"
                        >
                          <img
                            src="../assets/confirm.svg"
                            alt=""
                            height="36px"
                            width="36px"
                            class="visitor-control"
                          />
                        </div>
                        <div
                          class="visitor-control ptr"
                          style="cursor: pointer"
                          @click="cancelNewStory()"
                        >
                          <img
                            src="../assets/cancel.svg"
                            alt=""
                            height="36px"
                            width="36px"
                            class="visitor-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-tab>
              <v-tab title="Email settings">
                <div class="profile-panel">
                  <div class="profile-route-title">
                    <span>Email settings</span>
                  </div>
                  <label class="container-radio"
                    >Every day
                    <input
                      type="radio"
                      id="one"
                      value="1"
                      class="radio-custom"
                      v-model="mailFrequence"
                      name="radio"
                      :checked="user.mailFrequence == 1"
                    />
                    <span class="checkmark"></span>
                  </label>
                  <label class="container-radio"
                    >Once a week
                    <input
                      type="radio"
                      id="two"
                      value="2"
                      class="radio-custom"
                      v-model="mailFrequence"
                      name="radio"
                      :checked="user.mailFrequence == 2"
                    />
                    <span class="checkmark"></span>
                  </label>
                  <label class="container-radio"
                    >Bi-weekly
                    <input
                      type="radio"
                      id="three"
                      value="3"
                      class="radio-custom"
                      v-model="mailFrequence"
                      :checked="user.mailFrequence == 3"
                    />
                    <span class="checkmark"></span>
                  </label>
                  <label class="container-radio"
                    >Once every two weeks
                    <input
                      type="radio"
                      id="four"
                      value="4"
                      class="radio-custom"
                      v-model="mailFrequence"
                      :checked="user.mailFrequence == 4"
                    />
                    <span class="checkmark"></span>
                  </label>
                  <label class="container-radio"
                    >Once a month
                    <input
                      type="radio"
                      value="5"
                      class="radio-custom"
                      id="five"
                      v-model="mailFrequence"
                      :checked="user.mailFrequence == 5"
                    />
                    <span class="checkmark"></span>
                  </label>

                  <button
                    class="password-confirm-btn ptr confirm"
                    @click="confirmUpdate()"
                    style="
                      margin-right: 12px;
                      margin-top: 15px;
                      padding: 15px 30px;
                      width: auto;
                    "
                  >
                    Save changes
                  </button>
                  <div
                    style="margin-right: 15px; margin-top: 15px"
                    v-if="savedSeeting"
                  >
                    <img
                      src="../assets/check-red.svg"
                      alt=""
                      height="16px"
                      width="16px"
                      style="margin-right: 10px"
                    />
                    <span class="tabs-span">Settings saved</span>
                  </div>
                </div>
              </v-tab>
            </vue-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import navbar from "../components/navbar.vue"
//local registration
import { VueTabs, VTab } from "vue-nav-tabs"
//you can also import this in your style tag
import "vue-nav-tabs/themes/vue-tabs.css"
import { serverUrl } from "../severUrl"
import dayjs from "dayjs"
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
      loading: false,
      showingOverlay: false,
      routeIndex: 0,
      newPw1: "",
      newPw2: "",
      oldPw: "",
      field1Error: false,
      field2Error: false,
      field3Error: false,
      updatedPassword: false,
      errorText: "",
      passwordStates1: "password",
      passwordStates2: "password",
      passwordStates3: "password",
      isAddingVisitor: false,
      visitorName: "",
      visitorEmail: "",
      mailFrequence: "",
      savedSeeting: false,
      action: "",
      recipEmail: "",
      recipGiftDate: "",
      giftMessage: "",
      errorStatus: {},
      state: statedate,
      emailSent: false,
      showingEditingGiftDetails: false,
      isEditingGiftDetails: false,
      showingEditingGiftMessage: false,
      isEditingGiftMessage: false,
    }
  },
  components: {
    navbar,
    VueTabs,
    VTab,
    Datepicker,
  },
  methods: {
    logout: async function () {
      if (this.user) {
        try {
          this.loading = true
          this.showingOverlay = true
          const response = await axios.get(serverUrl + "/auth/logout", {
            withCredentials: true,
          })
          if (response.status === 200) {
            this.$store.commit("setUser", null)
            this.loading = false
            this.showingOverlay = false
            this.$router.push("/login")
          }
        } catch (error) {
          console.log(error)
          this.loading = false
          this.showingOverlay = false
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
      if (index == 3) {
        if (this.passwordStates3 === "password") {
          this.passwordStates3 = "text"
        } else {
          this.passwordStates3 = "password"
        }
      }
    },
    updatePassword: async function () {
      this.field1Error = false
      this.field2Error = false
      this.field3Error = false
      this.updatedPassword = false
      this.errorText = ""
      if (this.oldPw == "") {
        this.field1Error = true
        this.errorText = "Old password is required."
        return
      }
      if (this.newPw1.length < 6) {
        this.field2Error = true
        this.errorText = "Password needs to be at least 6 characters long."
        return
      }
      if (this.newPw1 != this.newPw2) {
        this.field3Error = true
        this.errorText = "Passwords don't match."
        return
      }
      try {
        this.loading = true
        this.showingOverlay = true
        const result = await axios.put(
          serverUrl + "/api/users/update-password",
          {
            id: this.user._id,
            oldPw: this.oldPw,
            newPw: this.newPw1,
          },
          { withCredentials: true }
        )
        if (result.status == 200) {
          this.updatedPassword = true
          this.loading = false
          this.showingOverlay = false
        }
      } catch (error) {
        this.loading = false
        this.showingOverlay = false
        if (
          error.response.status == 400 &&
          error.response.data == "wrong old password"
        ) {
          this.field1Error = true
          this.errorText = "Wrong old password."
        }
        console.log(error)
      }
    },
    async confirmNewStory() {
      if (this.visitorEmail?.trim() !== "") {
        this.user.visitors.push({
          name: this.visitorName,
          email: this.visitorEmail,
        })
        //update both user(guest and buyer)
        this.user.updateBoth = true
        const response = await axios.put(serverUrl + "/api/users/", this.user, {
          withCredentials: true,
        })
        const userString = JSON.stringify(this.user)
        localStorage.setItem("user", userString)
        if (!response.status == 200) {
          console.log(response.data)
        }
        this.isAddingVisitor = false
      }
    },
    startAddingStory() {
      this.visitorName = ""
      this.visitorEmail = ""
      this.isAddingVisitor = true
      this.$nextTick(() => {
        this.$refs?.newvisitorNameInput?.focus()
      })
    },
    cancelNewStory() {
      this.isAddingVisitor = false
      this.visitorName = ""
      this.visitorEmail = ""
    },
    async removeRecipient(index) {
      this.user?.visitors.splice(index, 1)
      this.user.updateBoth = true
      const response = await axios.put(serverUrl + "/api/users/", this.user, {
        withCredentials: true,
      })
      const userString = JSON.stringify(this.user)
      localStorage.setItem("user", userString)
      if (!response.status == 200) {
        console.log(response.data)
      }
    },
    async confirmUpdate() {
      this.user.updateBoth = true
      this.user.mailFrequence = this.mailFrequence
      const response = await axios.put(serverUrl + "/api/users/", this.user, {
        withCredentials: true,
      })
      const userString = JSON.stringify(this.user)
      localStorage.setItem("user", userString)
      if (!response.status == 200) {
        console.log(response.data)
      }
      this.savedSeeting = true
    },
    async confirmEditingGift(key) {
      this.savedSeeting = false
      this.user[key] = this[key]
      const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      this.errorStatus = { status: false, message: "" }
      if (this.user?.giftSubscriptionSent) {
        this.errorStatus = {
          status: true,
          message: "Gift Subscription already sent",
        }
      } else if (key === "recipEmail") {
        if (
          this.recipEmail.length > 50 ||
          !this.recipEmail.match(mailformat) ||
          this.recipEmail == ""
        ) {
          this.errorStatus = {
            status: true,
            message: "please verify the email adress",
          }
        }
      } else if (key === "recipGiftDate") {
        if (this.recipGiftDate == "") {
          this.errorStatus = {
            status: true,
            message: "Date invalid",
          }
        }
      }

      if (!this.errorStatus.status) {
        this.user.updateBoth = true
        const response = await axios.put(serverUrl + "/api/users/", this.user, {
          withCredentials: true,
        })
        const userString = JSON.stringify(this.user)
        localStorage.setItem("user", userString)
        if (!response.status == 200) {
          console.log(response.data)
        } else {
          this.recipGiftDate = dayjs(this.user.recipGiftDate).format(
            "DD/MM/YYYY"
          )
          this.action = ""
          this.savedSeeting = true
        }
      }
      this.showingEditingGiftDetails = false
      this.isEditingGiftDetails = false
      this.showingEditingGiftMessage = false
      this.isEditingGiftMessage = false
    },
    startEditingTitle(key) {
      if (key == "recipEmail") {
        this.showingEditingGiftDetails = true
        this.isEditingGiftDetails = true
      } else if (key == "giftMessage") {
        this.showingEditingGiftMessage = true
        this.isEditingGiftMessage = true
      }

      this.action = key
    },
    cancelEditing() {
      this.action = ""
      this.showingEditingGiftDetails = false
      this.isEditingGiftDetails = false
      this.showingEditingGiftMessage = false
      this.isEditingGiftMessage = false
    },
    async sendGiftEmail() {
      this.emailSent = false
      const response = await axios.post(
        serverUrl + "/api/users/sendgiftmail",
        this.user,
        {
          withCredentials: true,
        }
      )
      if (!response.status == 200) {
        console.log(response.data)
      } else {
        this.emailSent = true
        console.log("email envoyé")
      }
    },
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser
    },
  },
  async mounted() {
    try {
      this.$router.replace("/profile")
    } catch (err) {
      console.log(err.message)
    }
  },

  created() {
    this.mailFrequence = this.user.mailFrequence
    this.recipGiftDate = dayjs(this.user.recipGiftDate).format("DD/MM/YYYY")
    this.giftMessage = this.user.giftMessage
  },
}
</script>

<style>
.tab-content.right-text-tabs {
  width: 88%;
}
.left-vertical-tabs {
  width: 12%;
}
.vue-tabs .nav-pills > li > a {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.vue-tabs .nav-pills > li.active > a,
.vue-tabs .nav-pills > li.active > a:hover,
.vue-tabs .nav-pills > li.active > a:focus {
  color: #fff;
  background-color: #14473c;
}
.vue-tabs .nav > li span.title {
  justify-content: left;
}
@media screen and (max-width: 1024px) {
  .tab-content.right-text-tabs,
  .left-vertical-tabs {
    width: auto;
  }
  .vue-tabs .nav-pills > li.active > a,
  .vue-tabs .nav-pills > li.active > a:hover,
  .vue-tabs .nav-pills > li.active > a:focus {
    color: initial;
    background-color: initial;
    font-weight: 500;
  }
  .vue-tabs .nav-pills > li > a {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    color: #14473c;
  }
  .nav-tabs-wrapper.stacked {
    background: white;
    border: 1px solid rgba(6, 42, 32, 0.1);
    border-radius: 10px;
  }
  .vue-tabs .nav > li span.title {
    justify-content: left;
  }
  .vue-tabs .nav-stacked > li {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .vue-tabs .nav-stacked > li + li {
    border-top: 1px solid #d9d9d9;
  }
}
.datep-gift-input {
  border: none;
  padding: 0px 40px 25px 0px;
  font-size: 18px;
  line-height: 24px;
  font-family: galaxie-polaris;
  outline: none;
  color: #14473c;
  box-sizing: border-box;
}
</style>
<style scoped>
.profile-panel {
  /* white/white */
  background: #ffffff;
  padding: 37px 61px 37px 61px;
  /* dark green / 20% */
  border: 1px solid rgba(6, 42, 32, 0.2);
  box-sizing: border-box;
  height: 100%;
  flex-grow: 1;
}

.profile-routes-container {
  width: 194px;
  text-align: center;
}
.profile-route {
  padding: 14px;
  font-size: 18px;
  line-height: 27px;
  font-weight: 300;
  color: rgba(6, 42, 32, 0.4);
}

.profile-route.active {
  background: #e1504b;
  border-radius: 10px 0px 0px 10px;
  border: none;
  font-weight: 500;
  color: white;
}

.profile-input {
  border: 1px solid #eeeeee;
  box-sizing: border-box;
  border-radius: 0px;
  padding: 18px 22px;
  outline: none;
  width: 100%;
  font-size: 16px;
  line-height: 24px;
  font-family: galaxie-polaris;
  color: #14473c;
}

.profile-form-section {
  margin-bottom: 22px;
  position: relative;
  justify-content: space-between;
  align-items: center;
}

.profile-route-title {
  font-size: 18px;
  font-weight: 500;
  color: #14473c;
  margin-bottom: 30px;
  margin-top: 16px;
}

.password-confirm-btn {
  background: #e1504b;
  width: 150px;
  padding: 15px 0px;
  font-family: PT-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  text-transform: uppercase;
  border: none;
  color: #ffffff;
}

.error {
  border: 1px solid #eb4848;
}

.update-password {
  background: white;
}

.profile-container {
  height: 100%;
  width: 100%;
}

.profile-user-image {
  width: 78px;
  height: 78px;
}
.name-container {
  display: inline-block;
  font-size: 18px;
  line-height: 19px;
  padding-top: 19px;
  color: #14473c;
  font-family: galaxie-polaris;
  font-weight: 500;
}

.profile-input-container {
  position: relative;
}
.profile-input-container > input {
  width: 100%;
}

.save-cover-btn {
  width: 187px;
  height: 62px;
  color: white;
  background: #14473c;
  font-family: PT-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 21px;
  border: 1px solid #14473c;
}

.save-cover-btn:hover {
  cursor: pointer;
}

.mobile-visible {
  display: none;
}
.desktop-visible {
  display: block;
}
.label-gift-title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  color: #14473c;
  margin-bottom: 15px;
}
.gift-register-textarea {
  border: none;
  outline: none;
  font-family: galaxie-polaris;
  font-weight: 400;
  padding: 0;
  font-size: 18px;
  line-height: 27px;
  color: #14473c;
  caret-color: #14473c;
  width: 400px;
}
.gift-title-input {
  border: none;
  outline: none;
  font-family: galaxie-polaris;
  font-weight: 400;
  padding: 0;
  font-size: 18px;
  line-height: 27px;
  color: #14473c;
  caret-color: #14473c;
}
.gift-title-input-overlay {
  font-size: 18px;
  line-height: 27px;
  caret-color: #14473c;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-right: 8px;
  padding: 5px 10px;
  outline: none;
  color: #062a20;
  font-weight: 400;
  font-family: galaxie-polaris;
  transition: ease-in-out 0.6s;
  width: 100%;
}

.gift-title {
  font-weight: 400;
  font-size: 18px;
  line-height: 27px;
  color: #14473c;
  margin-right: 10px;
}
.gift-title-input::placeholder {
  color: rgba(6, 42, 32, 0.4);
}
.gift-btn {
  margin-top: 25px;
  background-color: #14473c;
  color: white;
  font-weight: 700;
  font-size: 18px;
  line-height: 17px;
  padding: 20px 35px;
  text-transform: none;
  border-radius: 100px;
  border: 1px solid #14473c;
}
.password-eye {
  position: absolute;
  right: 20px;
  top: 22px;
  height: 18px;
  width: 18px;
}

.profile-btn-container {
  margin-top: 36px;
}
.visitor-head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 30px 32px;
  background: #ffffff;
  border: 1px solid rgba(6, 42, 32, 0.1);
  border-radius: 18px;
  margin-top: 14px;
}
.adding-visitor.visitor-head:hover {
  cursor: default;
}
.adding-visitor {
  padding: 13px 32px;
}
.visitor-head:hover {
  cursor: pointer;
}
.visitor-title-input {
  border: none;
  outline: none;
  width: 100%;
  resize: none;
  font-family: galaxie-polaris;
  padding: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 27px;
  caret-color: #062a20;
}
.visitor-title-input::placeholder {
  color: rgba(6, 42, 32, 0.4);
}

.visitor-title {
  font-family: galaxie-polaris;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 27px;
  color: #062a20;
}
.visitors-list {
  max-height: 390px;
  overflow: auto;
}
.add-visitor-text {
  height: 100%;
  font-family: galaxie-polaris;
  font-weight: 500;
  font-size: 16px;
  line-height: 27px;
  color: #062a20;
}

/* The container */
.container-radio {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 18px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default radio button */
.container-radio input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 50%;
}

/* On mouse-over, add a grey background color */
.container-radio:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.container-radio input:checked ~ .checkmark {
  background-color: #e1504b;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container-radio input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container-radio .checkmark:after {
  top: 6px;
  left: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}
@media screen and (max-width: 1024px) {
  /* .container {
    min-height: 100%;
    overflow-y: auto;
  } */
  .vue-tabs.stacked {
    flex-direction: column;
  }
  .nav-tabs-wrapper.stacked {
    background: white;
    border: 1px solid rgba(6, 42, 32, 0.1);
    border-radius: 10px;
  }
  .left-vertical-tabs,
  .tab-content.right-text-tabs {
    width: 100%;
  }
  .profile-container {
    display: flex;
    flex-direction: column;
    margin-top: 60px;
  }
  .profile-routes-container {
    display: flex;
    width: 100%;
  }
  .profile-route {
    width: fit-content;
    font-size: 14px;
  }
  .profile-route.active {
    border-radius: 10px 10px 0px 0px;
  }
  .profile-panel {
    padding: 22px 21px;
    height: auto;
    margin-bottom: 19px;
    background: transparent;
    border: none;
  }
  .profile-form-section.first {
    margin-top: 26px;
  }
  .help-section {
    margin-top: 0px;
    margin-bottom: 38px;
    width: 100%;
  }
  .logout-btn-container {
    display: block;
    bottom: 16px;
    width: 100%;
  }
  .save-cover-btn {
    width: 100%;
    padding: 15px 10px;
    height: auto;
    font-size: 14px;
  }
  .mobile-visible {
    display: block;
  }
  .desktop-visible {
    display: none;
  }
  .profile-input {
    font-size: 14px;
    line-height: 18px;
  }
  .password-eye {
    position: absolute;
    right: 20px;
    top: 18px;
    height: 16px;
    width: 16px;
  }
  .profile-btn-container {
    margin-top: 18px;
    text-align: center;
  }
}
</style>
