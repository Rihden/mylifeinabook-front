<template>
  <div class="d-row site-background admin">
    <div class="overlay" v-if="showingOverlay">
      <div class="pop-up d-flex-centered d-col" v-if="isDeletingOrder">
        <div class="pop-up-title">
          <span>Confirmation</span>
        </div>
        <div class="pop-up-paragraph">
          <span>Are you sure you want to delete this order ?</span>
        </div>
        <div class="pop-up-buttons-container">
          <button class="pop-up-btn confirm-admin" @click="deleteAccount()">
            Yes
          </button>
          <button class="pop-up-btn" @click="cancel()">No</button>
        </div>
      </div>
      <div class="pop-up d-flex-centered d-col" v-if="isSendingGiftEmail">
        <div class="pop-up-title">
          <span>Confirmation</span>
        </div>
        <div class="pop-up-paragraph">
          <span>Are you sure you want to send a gift email ?</span>
        </div>
        <div class="pop-up-buttons-container">
          <button class="pop-up-btn confirm-admin" @click="sendGiftEmail()">
            Yes
          </button>
          <button class="pop-up-btn" @click="cancel()">No</button>
        </div>
      </div>
      <div class="pop-up d-flex-centered d-col" v-if="isToIwill">
        <div class="pop-up-title">
          <span>Confirmation</span>
        </div>
        <div class="pop-up-paragraph">
          <span>Are you sure you want to transform the order to I will </span>
        </div>
        <div class="pop-up-buttons-container">
          <button class="pop-up-btn confirm-admin" @click="transformToIWill()">
            Yes
          </button>
          <button class="pop-up-btn" @click="cancel()">No</button>
        </div>
      </div>
      <div class="pop-up d-flex-centered d-col" v-if="isResetQuestion">
        <div class="pop-up-title">
          <span>Confirmation</span>
        </div>
        <div class="pop-up-paragraph">
          <span>Are you sure you want to reset questions ?</span>
        </div>
        <div class="pop-up-buttons-container">
          <button class="pop-up-btn confirm-admin" @click="resetQuestion()">
            Yes
          </button>
          <button class="pop-up-btn" @click="cancel()">No</button>
        </div>
      </div>
      <div class="pop-up d-flex-centered d-col" v-if="isRecreateAccount">
        <div class="pop-up-title">
          <span>Confirmation</span>
        </div>
        <div class="pop-up-paragraph">
          <div class="d-row recreacte-row">
            <input type="checkbox" v-model="checkedEBTR" />
            <span v-if="checkedEBTR">keep default buyer email </span>
            <input
              v-if="!checkedEBTR"
              type="email"
              name="emailBuyerTR"
              v-model="emailBuyerTR"
              placeholder="new buyer email"
              class="recreate-form-input"
            />
          </div>
          <div class="d-row recreacte-row">
            <input type="checkbox" v-model="checkedERTR" />
            <span v-if="checkedERTR">keep default reciptient email </span>
            <input
              v-if="!checkedERTR"
              type="email"
              name="emailReciptientTR"
              v-model="emailReciptientTR"
              placeholder="new reciptient email"
              class="recreate-form-input"
            />
          </div>
          <div class="d-row recreacte-row">
            <input type="checkbox" v-model="checkedFNRTR" />
            <span v-if="checkedFNRTR">keep default reciptient First Name </span>
            <input
              v-if="!checkedFNRTR"
              type="text"
              name="fNameReciptientTR"
              v-model="fNameReciptientTR"
              placeholder="new reciptient First Name"
              class="recreate-form-input"
            />
          </div>
          <div class="d-row recreacte-row">
            <input type="checkbox" v-model="checkedLNRTR" />
            <span v-if="checkedLNRTR">keep default reciptient Last Name </span>
            <input
              v-if="!checkedLNRTR"
              type="text"
              name="lNameReciptientTR"
              v-model="lNameReciptientTR"
              placeholder="new reciptient Last Name"
              class="recreate-form-input"
            />
          </div>
          <div class="d-row recreacte-row">
            <input type="checkbox" v-model="checkedgfTR" />
            <span v-if="checkedgfTR">keep default gift sender </span>
            <input
              v-if="!checkedgfTR"
              type="text"
              name="giftSenderTR"
              v-model="giftSenderTR"
              placeholder="new gift sender"
              class="recreate-form-input"
            />
          </div>
          <div class="d-row recreacte-row">
            <input type="checkbox" v-model="checkedgdTR" />
            <span v-if="checkedgdTR">keep default gift Date </span>
            <datepicker
              v-if="!checkedgdTR"
              :disabled-dates="state.disabledDates"
              input-class="datep-gift-input gift-title-input chapter-control recreate-form-input"
              calendar-class="register-calendar"
              v-model="giftDateTR"
              name="giftDateTR"
              ref="recipGiftDateInput"
              format="yyyy-MM-dd"
              placeholder="new gift Date"
            ></datepicker>
          </div>
          <div class="d-row recreacte-row">
            <input type="checkbox" v-model="checkedgmTR" />
            <span v-if="checkedgmTR">keep default gift message </span>
            <textarea
              v-if="!checkedgmTR"
              rows="4"
              style="box-sizing: border-box"
              class="question-title-textarea recreate-form-textarea"
              v-model="giftMessageTR"
            />
          </div>

          <span>Are you sure you want to recreate this order ?</span>
        </div>
        <div class="pop-up-buttons-container">
          <button
            class="pop-up-btn confirm-admin"
            @click="recreateTheAccount()"
          >
            Yes
          </button>
          <button class="pop-up-btn" @click="cancel()">No</button>
        </div>
      </div>
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <navbar manager="true" admin="true"></navbar>
    <div class="container">
      <div class="route-section">
        <div style="margin-left: 12px">
          <div>
            <div
              class="d-row"
              style="
                justify-content: space-between;
                margin-top: 21px;
                align-items: center;
              "
            >
              <input
                type="text"
                name="orderIdSearch"
                v-model="orderIdSearch"
                placeholder="Enter an Order Id"
                class="chapter-title-input story-form-input"
              />
              <input
                type="email"
                name="emailBuyerSearch"
                v-model="emailBuyerSearch"
                placeholder="Enter an buyer email"
                class="chapter-title-input story-form-input"
              />
              <input
                type="email"
                name="emailReciptSearch"
                v-model="emailReciptSearch"
                placeholder="Enter an Reciptient email"
                class="chapter-title-input story-form-input"
              />
            </div>
            <div
              class="d-row"
              style="
                justify-content: space-between;
                margin-top: 21px;
                align-items: center;
              "
            >
              <button class="btn recreate-btn" @click="searchOrder()">
                Search
              </button>
              <button
                v-if="noResult"
                class="btn recreate-btn"
                @click="confirmRecreateAccount()"
              >
                Create new order
              </button>
            </div>
            <div
              v-if="displayErrorNotFound"
              style="margin-top: 25px; color: red"
            >
              <h3>{{ ErrorNotFoundMessage }}</h3>
            </div>
            <div
              v-if="multiOrderForRecip"
              style="
                margin-top: 18px;
                background: #ffffff;
                border: 1px solid rgba(6, 42, 32, 0.2);
                box-sizing: border-box;
                border-radius: 30px;
                min-height: 300px;
                overflow-y: auto;
                padding: 40px 27px;
              "
            >
              <h4 style="margin-bottom: 20px">
                Choose between this list ,wich order you want to use
              </h4>
              <div class="d-row table-title-row">
                <div class="table-title-element">orderId</div>
                <div class="table-title-element">Email buyer</div>
              </div>
              <div
                v-for="(order, orderIndex) in multirecipOrders"
                :key="orderIndex"
              >
                <div class="d-row table-row">
                  <div class="table-title-element">
                    <span>{{ order.orderId }}</span>
                  </div>
                  <div class="table-title-element">
                    <span>{{ order.emailBuyer }}</span>
                  </div>
                  <div class="table-title-element">
                    <button
                      class="btn recreate-btn"
                      @click="searchOrder(order.orderId, order.emailBuyer)"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="findOrder"
              style="
                margin-top: 18px;
                background: #ffffff;
                border: 1px solid rgba(6, 42, 32, 0.2);
                box-sizing: border-box;
                border-radius: 30px;
                min-height: 300px;
                overflow-y: auto;
                padding: 40px 27px;
              "
            >
              <div class="d-row table-title-row">
                <div class="table-title-element">Type</div>
                <div class="table-title-element">orderId</div>
                <div class="table-title-element">orderNumber</div>
                <div class="table-title-element">Email</div>
                <div class="table-title-element">Name</div>
                <div class="table-title-element">LastLogin</div>
                <div class="table-title-element">Quantity</div>
                <div class="table-title-element">Recipient First Name</div>
                <div class="table-title-element">Recipient Last Name</div>
                <div class="table-title-element">Recipient Email</div>
                <div class="table-title-element">Recipient Gift Date</div>
                <div class="table-title-element">Recipient Gift Message</div>
                <div class="table-title-element">Mail Frequence</div>
                <div class="table-title-element">Gift Subscription Sent</div>
                <div class="table-title-element">last Question Sent</div>
                <div class="table-title-element">Creation Date</div>
                <div class="table-title-element">End Contract</div>
              </div>
              <div v-for="(order, orderIndex) in orders" :key="orderIndex">
                <div class="d-row table-row">
                  <div class="table-title-element">
                    <span>{{ order.isBuyer ? "Buyer" : "Recip" }}</span>
                  </div>
                  <div class="table-title-element">
                    <span>{{ order.orderId }}</span>
                  </div>
                  <div class="table-title-element">
                    <span>{{ order.orderNumber }}</span>
                  </div>
                  <div class="table-title-element">
                    <input
                      class="input-form"
                      type="email"
                      v-model="order.email"
                      required
                    />
                  </div>
                  <div class="table-title-element">
                    <span
                      ><input
                        class="input-form"
                        type="text"
                        v-model="order.name"
                        required
                    /></span>
                  </div>
                  <div class="table-title-element">
                    <span>{{ order.lastLogin | formatDate }}</span>
                  </div>
                  <div class="table-title-element">
                    <span>{{ order.quantity }}</span>
                  </div>
                  <div class="table-title-element">
                    <span
                      ><input
                        class="input-form"
                        type="text"
                        v-if="orderIndex === 0"
                        v-model="order.recipFName"
                        required
                    /></span>
                  </div>
                  <div class="table-title-element">
                    <span
                      ><input
                        type="text"
                        class="input-form"
                        v-if="orderIndex === 0"
                        v-model="order.recipLName"
                        required
                    /></span>
                  </div>
                  <div class="table-title-element">
                    <span
                      ><input
                        v-if="orderIndex === 0"
                        class="input-form"
                        type="email"
                        v-model="order.recipEmail"
                        required
                    /></span>
                  </div>
                  <div class="table-title-element">
                    <span>{{ order.recipGiftDate | formatDate }}</span>
                  </div>
                  <div class="table-title-element">
                    <span>
                      <textarea
                        v-if="orderIndex === 0"
                        rows="4"
                        style="box-sizing: border-box"
                        class="question-title-textarea recreate-form-textarea"
                        v-model="order.giftMessage"
                      />
                    </span>
                  </div>
                  <div class="table-title-element">
                    <span>{{ order.mailFrequence }}</span>
                  </div>
                  <div class="table-title-element">
                    <span>{{ order.giftSubscriptionSent }}</span>
                  </div>
                  <div class="table-title-element">
                    <span>{{ order.lastQuestionsent | formatDate }}</span>
                  </div>
                  <div class="table-title-element">
                    <span>{{ order.creationDate | formatDate }}</span>
                  </div>
                  <div class="table-title-element">
                    <datepicker
                      :disabled-dates="state.disabledDates"
                      input-class="datep-gift-input gift-title-input chapter-control recreate-form-input"
                      calendar-class="register-calendar"
                      v-model="order.dateEndContract"
                      name="dateEndContract"
                      ref="dateEndContract"
                      format="yyyy-MM-dd"
                      placeholder="End Contract"
                    ></datepicker>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="d-row"
              style="
                justify-content: space-between;
                margin-top: 21px;
                align-items: center;
              "
              v-if="findOrder"
            >
              <button class="update-btn btn" @click="updateAccount()">
                Update Account
              </button>
              <button
                v-if="orders.length > 1"
                class="recreate-btn btn"
                @click="confirmSendGiftEmail()"
              >
                Send Gift Email
              </button>
              <button class="reset-btn btn" @click="confirmResetAccount()">
                Reset Questions
              </button>
              <button
                class="recreate-btn btn"
                @click="confirmRecreateAccount()"
              >
                Recreate Account
              </button>
              <button
                v-if="orders.length > 1"
                class="recreate-btn btn"
                @click="confirmToIWill()"
              >
                Transform to I will
              </button>
              <button class="delete-btn btn" @click="confirmDelete()">
                Delete Account
              </button>
            </div>
            <div
              v-if="displayErrorMessage"
              style="color: red; margin-top: 20px"
            >
              <h4>{{ errorMessage }}</h4>
            </div>
            <div
              v-if="displaySuccessMessage"
              style="color: green; margin-top: 20px"
            >
              <h4>{{ successMessage }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navbar from "../components/navbar.vue"
import { serverUrl } from "../severUrl"
import dayjs from "dayjs"
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
  components: {
    navbar,
    Datepicker,
  },
  data() {
    return {
      orderIdSearch: "",
      emailBuyerSearch: "",
      emailReciptSearch: "",
      orders: [],
      multirecipOrders: [],
      originalOrders: [],
      showingOverlay: false,
      isRecreateAccount: false,
      loading: false,
      findOrder: false,
      ErrorNotFoundMessage: "",
      displayErrorNotFound: false,
      successMessage: "",
      displaySuccessMessage: false,
      errorMessage: "",
      displayErrorMessage: false,
      isDeletingOrder: false,
      checkedEBTR: true,
      emailBuyerTR: "",
      checkedERTR: true,
      emailReciptientTR: "",
      checkedFNRTR: true,
      fNameReciptientTR: "",
      checkedLNRTR: true,
      lNameReciptientTR: "",
      checkedgfTR: true,
      giftSenderTR: "",
      checkedgmTR: true,
      giftMessageTR: "",
      checkedgdTR: true,
      giftDateTR: "",
      isResetQuestion: false,
      isToIwill: false,
      isSendingGiftEmail: false,
      state: statedate,
      noResult: true,
      multiOrderForRecip: false,
    }
  },
  methods: {
    initSearch: function () {
      this.findOrder = false
      this.orders = []
      this.originalOrders = []
      this.multirecipOrders = []
      this.ErrorNotFoundMessage = ""
      this.successMessage = ""
      this.errorMessage = ""
      this.displayErrorMessage = false
      this.isDeletingOrder = false
      this.checkedEBTR = true
      this.checkedERTR = true
      this.checkedFNRTR = true
      this.checkedLNRTR = true
      this.checkedgfTR = true
      this.checkedgmTR = true
      this.checkedgdTR = true
      this.emailBuyerTR = ""
      this.emailReciptientTR = ""
      this.fNameReciptientTR = ""
      this.lNameReciptientTR = ""
      this.giftSenderTR = ""
      this.giftMessageTR = ""
      this.giftDateTR = ""
      this.noResult = true
      this.multiOrderForRecip = false
    },
    searchOrder: async function (orderId = null, emailBuyer = null) {
      this.orders = []
      this.originalOrders = []
      this.multirecipOrders = []

      if (orderId && emailBuyer) {
        this.orderIdSearch = orderId
        this.emailBuyerSearch = emailBuyer
      }
      try {
        this.multiOrderForRecip = false
        this.findOrder = false
        this.loading = true
        this.showingOverlay = true
        this.displayErrorNotFound = false
        this.displayErrorMessage = false
        this.displaySuccessMessage = false
        let response
        if (this.orderIdSearch && this.emailBuyerSearch) {
          const dataUser = {
            orderIdSearch: this.orderIdSearch,
            emailBuyerSearch: this.emailBuyerSearch,
          }
          response = await axios.post(
            serverUrl + "/api/users/get-users-by-orderid-email",
            dataUser,
            {
              withCredentials: true,
            }
          )
        } else if (this.orderIdSearch && !this.emailBuyerSearch) {
          response = await axios.post(
            serverUrl + "/api/users/get-users-by-orderid",
            { orderIdSearch: this.orderIdSearch },
            {
              withCredentials: true,
            }
          )
        } else if (this.emailReciptSearch) {
          response = await axios.post(
            serverUrl + "/api/users/get-users-by-email-recip",
            { emailReciptSearch: this.emailReciptSearch },
            {
              withCredentials: true,
            }
          )
        }
        if (response.status == 200 && response?.data?.length > 0) {
          if (response?.data[1] && response?.data[1].multiOrderForRecip) {
            this.multiOrderForRecip = true
            const ordersRecip = response?.data[0]
            this.multirecipOrders[0] = {
              orderId: ordersRecip?.orderId,
              emailBuyer: ordersRecip?.emailBuyer,
            }
            ordersRecip?.listOrders?.map((order) => {
              if (order?.orderId) {
                this.multirecipOrders.push({
                  orderId: order?.orderId,
                  emailBuyer: order?.emailBuyer,
                })
              }
            })
          } else {
            this.multiOrderForRecip = false
            this.findOrder = true
            this.orders = response?.data
            this.originalOrders = response?.data
            this.orders[0].originMail = this?.orders[0].email
            if (this.orders[1]) {
              this.orders[1].originMail = this?.orders[1].email
            }
            this.orders = this.orders?.filter((elem) => elem !== null)
            this.originalOrders = this.orders?.filter((elem) => elem !== null)
            this.noResult = false
          }
        } else {
          this.ErrorNotFoundMessage = "Commande not found"
          this.displayErrorNotFound = true
          this.noResult = true
        }

        this.loading = false
        this.showingOverlay = false
      } catch (error) {
        this.ErrorNotFoundMessage = "Commande not found"
        this.displayErrorNotFound = true
        this.loading = false
        this.showingOverlay = false
        this.noResult = true
      }
    },
    confirmDelete: function () {
      this.showingOverlay = true
      this.isDeletingOrder = true
    },
    confirmResetAccount: function () {
      this.showingOverlay = true
      this.isResetQuestion = true
    },
    confirmRecreateAccount: function () {
      if (this.orderIdSearch) {
        this.showingOverlay = true
        this.isRecreateAccount = true
      }
    },
    confirmToIWill: function () {
      this.showingOverlay = true
      this.isToIwill = true
    },
    confirmSendGiftEmail: function () {
      this.showingOverlay = true
      this.isSendingGiftEmail = true
    },
    cancel: function () {
      this.showingOverlay = false
      this.isDeletingOrder = false
      this.isRecreateAccount = false
    },
    resetQuestion: async function () {
      try {
        this.loading = true
        const res = await axios.post(
          `${serverUrl}/auth/cregister`,
          {
            bookId: this.orders[0]?.bookId,
            userId: this.orders[0]._id,
          },
          { withCredentials: true }
        )
        if (res?.status == 200) {
          this.successMessage = "order already recreated successfully"
          this.displaySuccessMessage = true
        } else {
          this.errorMessage = "error in recreat order"
          this.displayErrorMessage = true
        }
        this.loading = false
        this.showingOverlay = false
        this.isResetQuestion = false
      } catch (e) {
        this.loading = false
        this.showingOverlay = false
        this.isResetQuestion = false
      }
    },
    deleteAccount: async function () {
      try {
        this.loading = true
        this.orders.forEach(async (ord) => {
          const response = await axios.post(
            serverUrl + "/api/users/delete-order",
            { order: ord },
            {
              withCredentials: true,
            }
          )
          if (response?.status == 200) {
            this.initSearch()
            this.successMessage = "delete completed successfully"
            this.displaySuccessMessage = true
          } else {
            this.errorMessage = "error in delete account"
            this.displayErrorMessage = true
          }
        })
        this.showingOverlay = false
        this.loading = false
        this.isDeletingOrder = false
      } catch (e) {
        console.log("helo", e)
        this.loading = false
        this.showingOverlay = false
        this.isDeletingOrder = false
      }
    },
    recreateTheAccount: async function () {
      this.loading = true
      const isValidForm = this.isValidFormToRecreate()
      if (isValidForm) {
        try {
          this.orders.forEach(async (ord) => {
            await axios.post(
              serverUrl + "/api/users/delete-order",
              { order: ord },
              {
                withCredentials: true,
              }
            )
          })
          const recreate = await axios.post(
            serverUrl + "/api/users/recreat-order",
            {
              orderIdSearch: this.orderIdSearch,
              emailBuyerTR: !this.checkedEBTR ? this.emailBuyerTR : "",
              emailReciptientTR: !this.checkedERTR
                ? this.emailReciptientTR
                : "",
              fNameReciptientTR: !this.checkedFNRTR
                ? this.fNameReciptientTR
                : "",
              lNameReciptientTR: !this.checkedLNRTR
                ? this.lNameReciptientTR
                : "",
              giftSenderTR: !this.checkedgfTR ? this.giftSenderTR : "",
              giftMessageTR: !this.checkedgmTR ? this.giftMessageTR : "",
              giftDateTR: !this.checkedgdTR ? this.giftDateTR : "",
            },
            {
              withCredentials: true,
            }
          )
          if (recreate?.status == 200) {
            const res = await axios.post(
              `${serverUrl}/auth/cregister`,
              {
                bookId: recreate?.data,
              },
              { withCredentials: true }
            )
            if (res?.status == 200) {
              this.initSearch()
              this.successMessage = "order already recreated successfully"
              this.displaySuccessMessage = true
            } else {
              this.errorMessage = "error in recreat order"
              this.displayErrorMessage = true
            }
          }

          this.loading = false
          this.showingOverlay = false
          this.isRecreateAccount = false
        } catch (e) {
          this.loading = false
          this.showingOverlay = false
          this.isRecreateAccount = false
        }
      }
    },
    isValidFormToRecreate: function () {
      const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      if (!this.checkedEBTR) {
        if (
          this.emailBuyerTR?.length > 50 ||
          !this.emailBuyerTR.match(mailformat)
        ) {
          return false
        }
      }
      if (!this.checkedERTR) {
        if (
          this.emailReciptientTR?.length > 50 ||
          !this.emailReciptientTR.match(mailformat)
        ) {
          return false
        }
      }
      return true
      /* if (!this.checkedFNRTR) {
        this.fNameReciptientTR
      }
      if (!this.checkedLNRTR) {
        this.lNameReciptientTR
      }
      if (!this.checkedgfTR) {
        this.giftSenderTR
      }
      if (!this.checkedgmTR) {
        this.giftMessageTR
      }*/
    },
    isValidFormToUpdate: function () {
      const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      if (
        this.orders[0]?.email?.length > 50 ||
        !this.orders[0]?.email.match(mailformat) ||
        !this.orders[0]?.name
      ) {
        return false
      }
      if (this.orders[0]?.isBuyer && this.orders[0]?.guest == 1) {
        if (
          this.orders[0]?.recipEmail?.length > 50 ||
          !this.orders[0]?.recipEmail.match(mailformat) ||
          !this.orders[0]?.recipFName ||
          !this.orders[0]?.recipEmail
        ) {
          return false
        }
      }
      if (this.orders[1]) {
        if (
          this.orders[1]?.email?.length > 50 ||
          !this.orders[1]?.email.match(mailformat) ||
          !this.orders[1]?.name
        ) {
          return false
        }
      }
      return true
    },
    updateAccount: async function () {
      try {
        this.displayErrorMessage = false
        this.displaySuccessMessage = false

        if (this.orders[1] && !this.orders[1]?.isBuyer) {
          this.orders[1].emailBuyer = this.orders[0].email
          this.orders[1].email = this.orders[0].recipEmail
        }
        const isValidForm = this.isValidFormToUpdate()
        if (isValidForm) {
          this.orders.forEach(async (ord) => {
            const response = await axios.put(
              serverUrl + "/api/users/update-order",
              ord,
              {
                withCredentials: true,
              }
            )
            if (response?.status == 200) {
              this.successMessage = "update completed successfully"
              this.displaySuccessMessage = true
              this.originalOrders = this.orders
            } else {
              this.errorMessage = "error in update"
              this.displayErrorMessage = true
            }
          })
        } else {
          this.errorMessage =
            "Make sure that all field are well filled out and respect the requested format"
          this.displayErrorMessage = true
        }
      } catch (e) {
        this.errorMessage = e?.message
        this.displayErrorMessage = true
      }
    },
    transformToIWill: async function () {
      this.loading = true
      try {
        this.orders.forEach(async (ord, index) => {
          if (!ord?.isBuyer) {
            await axios.post(
              serverUrl + "/api/users/delete-order",
              { order: ord },
              {
                withCredentials: true,
              }
            )
            delete this.orders[index]
          }
        })
        this.orders[0].guest = 0
        this.orders[0].recipFName = ""
        this.orders[0].recipLName = ""
        this.orders[0].recipEmail = ""
        this.orders[0].giftSender = ""
        const response = await axios.put(
          serverUrl + "/api/users/update-order",
          this.orders[0],
          {
            withCredentials: true,
          }
        )
        if (response?.status == 200) {
          this.successMessage = "account transform on i will successfully"
          this.displaySuccessMessage = true
        } else {
          this.errorMessage = "error in transform to i will"
          this.displayErrorMessage = true
        }
        this.initSearch()
        this.loading = false
        this.showingOverlay = false
        this.isToIwill = false
      } catch (e) {
        this.loading = false
        this.showingOverlay = false
        this.isToIwill = false
        this.errorMessage = e?.message
        this.displayErrorMessage = true
      }
    },
    sendGiftEmail: async function () {
      try {
        const response = await axios.post(
          serverUrl + "/api/users/sendgiftmail",
          this.orders[0],
          {
            withCredentials: true,
          }
        )
        if (response?.status == 200) {
          this.successMessage = "gift email sent successfully"
          this.displaySuccessMessage = true
        } else {
          this.errorMessage = "error in sending gift email"
          this.displayErrorMessage = true
        }
        this.loading = false
        this.showingOverlay = false
        this.isSendingGiftEmail = false
      } catch (e) {
        this.loading = false
        this.showingOverlay = false
        this.isSendingGiftEmail = false
        this.errorMessage = e?.message
        this.displayErrorMessage = true
      }
    },
  },
  filters: {
    formatDate: (date) => {
      if (!date) {
        return null
      }

      return dayjs(date).format("MM/DD/YYYY")
    },
  },
}
</script>
<style>
.btn {
  padding: 10px 23px;
  color: rgba(6, 42, 32, 0.4);
  font-size: 18px;
  line-height: 27px;
  font-weight: 300;
  margin-right: 10px;
}
.btn:hover {
  cursor: pointer;
}
.btn.active {
  background: #0f172a;
  color: white;
  font-weight: 500;
}

.story-form-input {
  padding: 20px;
  margin-right: 10px;
}
.input-form {
  padding: 10px;
  border: solid 1px #00000017;
}
.table-title-element {
  margin-right: 5px;
  text-align: center;
  min-width: 151px;
  margin-left: 10px;
}
.recreacte-row {
  padding: 10px;
}
.recreacte-row span {
  margin-left: 10px;
}
.recreate-form-input {
  padding: 10px;
  margin-left: 10px;
}
.recreate-form-textarea {
  margin-left: 10px;
}
</style>
