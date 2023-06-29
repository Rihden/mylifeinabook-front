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
          <span>
            Edit the
            {{
              keyToUpdate == "recipEmail"
                ? "gift recipient email"
                : keyToUpdate == "recipFName"
                ? "gift recipient first name"
                : keyToUpdate == "recipLName"
                ? "gift recipient last name"
                : keyToUpdate
            }}
          </span>
        </div>
        <div class="pop-up-paragraph" style="width: 100%; margin-bottom: 8px">
          <input
            class="gift-title-input-overlay chapter-control"
            type="text"
            v-model="$data[keyToUpdate]"
            :placeholder="$data[keyToUpdate]"
            @keypress.enter="confirmEditingGift(keyToUpdate)"
            :ref="$data[keyToUpdate]"
          />
        </div>
        <div class="pop-up-buttons-container">
          <button
            class="pop-up-btn confirm"
            @click="confirmEditingGift(keyToUpdate)"
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
            <vue-tabs
              type="pills"
              :start-index="1"
              direction="vertical"
              v-model="activeTab"
              @tab-change="handleTabChange"
            >
              <v-tab title="Extend program">
                <div class="profile-panel">
                  <div v-if="success" class="alert success">
                    {{ message }}
                  </div>
                  <div v-else-if="error" class="alert error">
                    {{ message }}
                  </div>
                  <div class="profile-route-title">
                    <span>Renew subscription</span>
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
                    <div class="label-subsc-title">
                      Your program ends on
                      <span> {{ endDateSubscription }}</span>
                    </div>
                    <div class="label-subsc-title">
                      Your program will not automatically renew.
                    </div>
                    <div class="label-subsc-title">
                      An extension <span>($29/year)</span> gives access to your
                      gift recipient to write for another year.
                    </div>
                    <div class="label-gift-title">
                      What method of payment would you prefer?
                    </div>
                    <div class="d-row">
                      <div class="label-subsc-title">
                        Credit and debit cards
                      </div>
                    </div>
                    <div class="d-row col-mobile">
                      <stripe-element-card
                        v-if="stripeLoaded"
                        ref="elementRef"
                        :pk="publishableKey"
                        @token="createToken"
                        class="stripe-card"
                        :hidePostalCode="true"
                      />
                      <div
                        style="
                          margin-left: 10px;
                          margin-right: 10px;
                          margin-top: 15px;
                        "
                      >
                        or
                      </div>
                      <div class="hide-button-text-overlay">
                        <PayPal
                          amount="29.00"
                          currency="USD"
                          :client="credentials"
                          env="sandbox"
                          :button-style="myStyle"
                          @payment-completed="onApprove"
                          @payment-cancelled="onError"
                          ><template #paypal-button>
                            <button
                              class="custom-paypal-button"
                              type="submit"
                            ></button>
                          </template>
                        </PayPal>
                      </div>
                    </div>

                    <button @click="submit" class="gift-btn ptr">
                      Extend now for $29
                    </button>
                  </div>
                </div>
              </v-tab>
              <v-tab title="Purchase copies">
                <div class="profile-panel">
                  <div v-if="success" class="alert success">
                    {{ message }}
                  </div>
                  <div v-else-if="error" class="alert error">
                    {{ message }}
                  </div>
                  <div class="profile-route-title">
                    <span>Purchase copies</span>
                  </div>
                  <div>
                    <div class="label-subsc-title">
                      You have {{ quantity }} copies included in your
                      subscription.
                    </div>
                    <div class="label-gift-title">
                      How many copies would you like to purchase?
                    </div>
                    <select class="quantity-book" v-model="quantityBook">
                      <option class="rounded-full" disabled selected>
                        No extra books
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="13">13</option>
                      <option value="14">14</option>
                      <option value="15">15</option>
                    </select>
                    <div class="label-gift-title">
                      What method of payment would you prefer?
                    </div>
                    <div class="d-row">
                      <div class="label-subsc-title">
                        Credit and debit cards
                      </div>
                    </div>
                    <div class="d-row col-mobile">
                      <stripe-element-card
                        ref="elementRefQ"
                        v-if="stripePurLoaded"
                        :pk="publishableKey"
                        @token="createTokenForQuantity"
                        class="stripe-card"
                        :hidePostalCode="true"
                      />
                      <div
                        style="
                          margin-left: 10px;
                          margin-right: 10px;
                          margin-top: 15px;
                        "
                      >
                        or
                      </div>
                      <div class="hide-button-text-overlay">
                        <PayPal
                          :amount="`${
                            30 *
                            (quantityBook === 'No extra books'
                              ? 1
                              : quantityBook)
                          }`"
                          currency="USD"
                          :client="credentials"
                          env="sandbox"
                          :button-style="myStyle"
                          @payment-completed="onApproveQuantityPayment"
                          @payment-cancelled="onError"
                          commit="true"
                          ><template #paypal-button>
                            <button
                              class="custom-paypal-button"
                              type="submit"
                            ></button>
                          </template>
                        </PayPal>
                      </div>
                    </div>
                    <button @click="submitQuantity" class="gift-btn ptr">
                      Purchase
                    </button>
                  </div>
                </div>
              </v-tab>
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
                      Your gift recipient first name:
                    </div>
                    <div class="d-row">
                      <input
                        class="gift-title-input chapter-control desktop-visible"
                        type="text"
                        v-if="action == 'recipFName'"
                        v-model="recipFName"
                        :placeholder="recipFName"
                        @keypress.enter="confirmEditingGift('recipFName')"
                        :ref="recipFName"
                      />
                      <span v-if="action != 'recipFName'" class="gift-title"
                        >{{ recipFName }}
                      </span>
                      <img
                        @click="startEditingTitle('recipFName')"
                        v-if="action != 'recipFName'"
                        src="../assets/pencil.svg"
                        class="chapter-control pen-icon-img"
                        alt=""
                        height="18px"
                        width="18px"
                        draggable="false"
                      />
                      <img
                        @click="confirmEditingGift('recipFName')"
                        v-if="action == 'recipFName'"
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
                        v-if="action == 'recipFName'"
                        src="../assets/cancel.svg"
                        class="chapter-control pen-icon-img desktop-visible"
                        alt=""
                        height="30px"
                        width="30px"
                        draggable="false"
                      />
                    </div>

                    <div class="label-gift-title">
                      Your gift recipient last name:
                    </div>
                    <div class="d-row">
                      <input
                        class="gift-title-input chapter-control desktop-visible"
                        type="text"
                        v-if="action == 'recipLName'"
                        v-model="recipLName"
                        :placeholder="recipLName"
                        @keypress.enter="confirmEditingGift('recipLName')"
                        :ref="recipLName"
                      />
                      <span v-if="action != 'recipLName'" class="gift-title"
                        >{{ recipLName }}
                      </span>
                      <img
                        @click="startEditingTitle('recipLName')"
                        v-if="action != 'recipLName'"
                        src="../assets/pencil.svg"
                        class="chapter-control pen-icon-img"
                        alt=""
                        height="18px"
                        width="18px"
                        draggable="false"
                      />
                      <img
                        @click="confirmEditingGift('recipLName')"
                        v-if="action == 'recipLName'"
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
                        v-if="action == 'recipLName'"
                        src="../assets/cancel.svg"
                        class="chapter-control pen-icon-img desktop-visible"
                        alt=""
                        height="30px"
                        width="30px"
                        draggable="false"
                      />
                    </div>

                    <div class="label-gift-title">
                      Your gift recipient email:
                    </div>
                    <div class="d-row">
                      <input
                        class="gift-title-input chapter-control desktop-visible"
                        type="text"
                        v-if="action == 'recipEmail'"
                        v-model="recipEmail"
                        :placeholder="recipEmail"
                        @keypress.enter="confirmEditingGift('recipEmail')"
                        :ref="recipEmail"
                      />
                      <span v-if="action != 'recipEmail'" class="gift-title"
                        >{{ recipEmail }}
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
                        >{{ giftMessage }}
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
                      v-if="emailSent === true"
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
                    <div
                      style="margin-right: 15px; margin-top: 15px"
                      v-if="emailSent === 'error'"
                    >
                      <img
                        src="../assets/check-red.svg"
                        alt=""
                        height="16px"
                        width="16px"
                        style="margin-right: 10px"
                      />
                      <span class="tabs-span"
                        >The gift email cannot be sent now since the gift date
                        is scheduled for a later date.</span
                      >
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
                  <div style="max-width: 450px">
                    <div class="profile-form-section">
                      <div style="margin-bottom: 10px">
                        Enter the email address linked to your account.
                      </div>
                      <input
                        type="email"
                        class="profile-input"
                        v-model="emailForgot"
                        @keypress.enter="sendResetEmail()"
                        :class="{ error: field3Error }"
                        placeholder="Confirm your Email"
                      />
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
                        @click="sendResetEmail()"
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
                      :checked="mailFrequence == 1"
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
                      :checked="mailFrequence == 2"
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
                      :checked="mailFrequence == 3"
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
                      :checked="mailFrequence == 4"
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
                      :checked="mailFrequence == 5"
                    />
                    <span class="checkmark"></span>
                  </label>
                  <div
                    class="d-flex"
                    v-if="user.isBuyer == 1 && user.guest == 1"
                  >
                    <br />
                    <div class="profile-route-title">
                      <span>Disable guest responses :</span>
                    </div>
                    <label class="container-radio"
                      >Yes
                      <input
                        type="radio"
                        value="1"
                        class="radio-custom"
                        v-model="disableGustResponse"
                        :checked="disableGustResponse == 1"
                        name=""
                      />
                      <span class="checkmark"></span>
                    </label>
                    <label class="container-radio"
                      >No
                      <input
                        type="radio"
                        value="0"
                        class="radio-custom"
                        v-model="disableGustResponse"
                        :checked="
                          !disableGustResponse ||
                          disableGustResponse == 0 ||
                          disableGustResponse == null
                        "
                      />
                      <span class="checkmark"></span>
                    </label>
                  </div>
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
              <v-tab title="Profile">
                <div class="profile-panel">
                  <div class="profile-route-title">
                    <span>Profile</span>
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
                  <div v-if="name">
                    <div class="label-gift-title">Name:</div>
                    <div class="d-row">
                      <input
                        class="gift-title-input chapter-control desktop-visible"
                        type="text"
                        v-if="action == 'name'"
                        v-model="name"
                        :placeholder="name"
                        @keypress.enter="confirmEditingGift('name')"
                        :ref="name"
                      />
                      <span v-if="action != 'name'" class="gift-title"
                        >{{ name }}
                      </span>
                      <img
                        @click="startEditingTitle('name')"
                        v-if="action != 'name'"
                        src="../assets/pencil.svg"
                        class="chapter-control pen-icon-img"
                        alt=""
                        height="18px"
                        width="18px"
                        draggable="false"
                      />
                      <img
                        @click="confirmEditingGift('name')"
                        v-if="action == 'name'"
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
                        v-if="action == 'name'"
                        src="../assets/cancel.svg"
                        class="chapter-control pen-icon-img desktop-visible"
                        alt=""
                        height="30px"
                        width="30px"
                        draggable="false"
                      />
                    </div>
                  </div>
                  <div v-if="email">
                    <div class="label-gift-title">Email:</div>
                    <div class="d-row">
                      <input
                        class="gift-title-input chapter-control desktop-visible"
                        type="text"
                        v-if="action == 'email'"
                        v-model="email"
                        :placeholder="email"
                        @keypress.enter="confirmEditingGift('email')"
                        :ref="email"
                      />
                      <span v-if="action != 'email'" class="gift-title"
                        >{{ email }}
                      </span>
                      <img
                        @click="startEditingTitle('email')"
                        v-if="action != 'email'"
                        src="../assets/pencil.svg"
                        class="chapter-control pen-icon-img"
                        alt=""
                        height="18px"
                        width="18px"
                        draggable="false"
                      />
                      <img
                        @click="confirmEditingGift('email')"
                        v-if="action == 'email'"
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
                        v-if="action == 'email'"
                        src="../assets/cancel.svg"
                        class="chapter-control pen-icon-img desktop-visible"
                        alt=""
                        height="30px"
                        width="30px"
                        draggable="false"
                      />
                    </div>
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
import PayPal from "vue-paypal-checkout" //local registration
import { VueTabs, VTab } from "vue-nav-tabs"
//you can also import this in your style tag
import "vue-nav-tabs/themes/vue-tabs.css"
import { serverUrl } from "../severUrl"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import Datepicker from "vuejs-datepicker"
import { StripeElementCard } from "@vue-stripe/vue-stripe"

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
    this.publishableKey = process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY

    return {
      loading: false,
      showingOverlay: false,
      routeIndex: 0,
      newPw1: "",
      newPw2: "",
      oldPw: "",
      quantityBook: "No extra books",
      quantity: 1,
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
      disableGustResponse: 0,
      visitors: [],
      savedSeeting: false,
      action: "",
      recipEmail: "",
      recipLName: "",
      recipFName: "",
      recipGiftDate: "",
      firstName: "",
      lastName: "",
      name: "",
      email: "",
      giftMessage: "",
      errorStatus: {},
      state: statedate,
      emailSent: false,
      showingEditingGiftDetails: false,
      isEditingGiftDetails: false,
      showingEditingGiftMessage: false,
      isEditingGiftMessage: false,
      endDateSubscription: "",
      userOrder: {},
      stripeLoaded: true,
      keyToUpdate: "",
      emailForgot: "",
      credentials: {
        sandbox: process.env.VUE_APP_PAYPAL_SANDBOX_CLIENT_ID,
        production: process.env.VUE_APP_PAYPAL_SANDBOX_CLIENT_ID_PROD,
      },
      myStyle: {
        size: "medium",
        label: "paypal",
        shape: "pill",
        color: "silver",
        tagline: false,
      },
      token: null,
      success: false,
      error: false,
      message: "",
      activeTab: "",
      stripePurLoaded: false,
    }
  },
  components: {
    navbar,
    VueTabs,
    PayPal,
    VTab,
    Datepicker,
    StripeElementCard,
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
    handleTabChange(tabIndex, newTab) {
      this.initMessage()
      console.log(tabIndex)
      if (newTab.title === "Extend program") this.stripeLoaded = true
      else this.stripeLoaded = false
      if (newTab.title === "Purchase copies") this.stripePurLoaded = true
      else this.stripePurLoaded = false
    },
    onApprove: async function (data) {
      this.initMessage()
      try {
        this.loading = true
        this.showingOverlay = true
        if (data?.state === "approved") {
          const result = await axios.post(
            serverUrl + "/api/payment/add-payment",
            {
              userId: this.user._id,
              orderId:
                Object.keys(this.userOrder).length === 0
                  ? this.user?.orderId
                  : this.userOrder?.orderId,
              type: "ext1year",
              total: data?.transactions[0]?.amount?.total,
              quantity: 1,
              cart: data?.cart,
              paymentMethod: data?.payer?.payment_method,
              paymentId: data?.id,
              state: data?.state,
              createdTime: data?.create_time,
              currency: data?.transactions[0]?.amount?.currency,
              endDate: this.endDateSubscription,
            },
            { withCredentials: true }
          )
          this.endDateSubscription = result?.data?.newEndDate
          if (result?.data?.success) {
            this.success = true
            this.message =
              "Successful transaction. Your program renewal is now confirmed."
          } else {
            this.error = true
            this.message = "error with payment"
          }
        }
        this.showingOverlay = false
        this.loading = false
      } catch (e) {
        this.error = true
        this.message = "error with payment"
        this.showingOverlay = false
        this.loading = false
        console.log("e", e.message)
      }
    },
    onApproveQuantityPayment: async function (data) {
      this.initMessage()
      try {
        this.loading = true
        this.showingOverlay = true
        if (data?.state === "approved") {
          const result = await axios.post(
            serverUrl + "/api/payment/quantity-paypal-payment",
            {
              userId: this.user._id,
              orderId:
                Object.keys(this.userOrder).length === 0
                  ? this.user?.orderId
                  : this.userOrder?.orderId,
              type: "extQuantity",
              total: data?.transactions[0]?.amount?.total,
              cart: data?.cart,
              paymentMethod: data?.payer?.payment_method,
              paymentId: data?.id,
              state: data?.state,
              createdTime: data?.create_time,
              currency: data?.transactions[0]?.amount?.currency,
              quantity:
                this.quantityBook === "No extra books" ? 1 : this.quantityBook,
            },
            { withCredentials: true }
          )
          this.quantity = result?.data?.quantity
          if (result?.data?.success) {
            this.success = true
            this.message =
              "Transaction completed successfully. Your additional copies have been incorporated into your program."
          } else {
            this.error = true
            this.message = "error with payment"
          }
        }
        this.showingOverlay = false
        this.loading = false
      } catch (e) {
        this.error = true
        this.message = "error with payment"
        this.showingOverlay = false
        this.loading = false
        console.log("e", e.message)
      }
    },
    onError: function (err) {
      console.log("err", err)
      // Gérez les erreurs lors du paiement
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
    validateQuantityBook() {
      console.log(
        "Number.isInteger(this.quantityBook)",
        Number.isInteger(this.quantityBook)
      )
      return Number.isInteger(this.quantityBook)
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
        if (this.isPrincipalOrder) {
          this.user.visitors.push({
            name: this.visitorName,
            email: this.visitorEmail,
          })
        } else {
          this.user.listOrders[this.getIndexOrder].visitors.push({
            name: this.visitorName,
            email: this.visitorEmail,
          })
        }

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
      if (this.isPrincipalOrder) {
        this.user?.visitors.splice(index, 1)
      } else {
        this.user.listOrders[this.getIndexOrder].visitors.splice(index, 1)
      }
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
      if (this.isPrincipalOrder) {
        this.user.mailFrequence = this.mailFrequence
        this.user.disableGustResponse = this.disableGustResponse
      } else {
        this.user.listOrders[this.getIndexOrder].mailFrequence =
          this.mailFrequence
        this.user.listOrders[this.getIndexOrder].disableGustResponse =
          this.disableGustResponse
      }
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

      let lastRecipEmail =
        key == "recipEmail" ? this.user.recipEmail : this.user.email
      if (this.isPrincipalOrder) {
        this.user[key] = this[key]
      } else {
        this.user.listOrders[this.getIndexOrder][key] = this[key]
      }
      const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      this.errorStatus = { status: false, message: "" }
      if (key === "recipEmail") {
        if (
          this.recipEmail.length > 50 ||
          !this.recipEmail.match(mailformat) ||
          this.recipEmail == ""
        ) {
          this.errorStatus = {
            status: true,
            message: "please verify the email adress",
          }
        } else {
          if (this.isPrincipalOrder) {
            this.user.lastRecipEmail = lastRecipEmail
          } else {
            this.user.listOrders[this.getIndexOrder].lastRecipEmail =
              lastRecipEmail
          }
        }
      } else if (key === "recipGiftDate") {
        if (this.recipGiftDate == "") {
          this.errorStatus = {
            status: true,
            message: "Date invalid",
          }
        }
      } else if (key === "mail") {
        if (
          this.mail.length > 50 ||
          !this.mail.match(mailformat) ||
          this.mail == ""
        ) {
          this.errorStatus = {
            status: true,
            message: "please verify the email adress",
          }
        } else {
          if (this.isPrincipalOrder) {
            this.user.lastRecipEmail = lastRecipEmail
          } else {
            this.user.listOrders[this.getIndexOrder].lastRecipEmail =
              lastRecipEmail
          }
        }
      } else if (
        key === "name" ||
        key === "recipLName" ||
        key === "recipFName"
      ) {
        if (this.name == "" || this.recipLName == "" || this.recipFName == "") {
          this.errorStatus = {
            status: true,
            message: "name invalid",
          }
        } else {
          if (key === "name") {
            if (this.isPrincipalOrder) {
              this.user.name = this.name
            } else {
              this.user.listOrders[this.getIndexOrder].name = this.name
            }
          } else {
            if (this.isPrincipalOrder) {
              this.user.recipLName = this.recipLName
              this.user.recipFName = this.recipFName
            } else {
              this.user.listOrders[this.getIndexOrder].recipLName =
                this.recipLName
              this.user.listOrders[this.getIndexOrder].recipFName =
                this.recipFName
            }
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
          if (this.isPrincipalOrder) {
            this.recipGiftDate = dayjs(this.user.recipGiftDate).format(
              "DD/MM/YYYY"
            )
          } else {
            this.recipGiftDate = dayjs(
              this.user.listOrders[this.getIndexOrder]?.recipGiftDate
            ).format("DD/MM/YYYY")
          }
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
      if (
        key == "recipEmail" ||
        key == "email" ||
        key == "name" ||
        key == "recipLName" ||
        key == "recipFName"
      ) {
        this.keyToUpdate = key
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
      let giftSent = false
      if (this.isPrincipalOrder) {
        giftSent = this.user?.giftSubscriptionSent
      } else {
        giftSent =
          this.user?.listOrders[this.getIndexOrder].giftSubscriptionSent
      }
      if (giftSent) {
        this.errorStatus = {
          status: true,
          message: "Gift Subscription already sent",
        }
      } else {
        this.emailSent = false
        dayjs.extend(customParseFormat)
        if (
          dayjs().diff(dayjs(this.recipGiftDate, "DD/MM/YYYY"), "hour") >= 0
        ) {
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
        } else {
          this.emailSent = "error"
        }
      }
    },
    async sendResetEmail() {
      try {
        this.loading = true
        this.showingOverlay = true
        const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        if (
          !this.emailForgot ||
          this.emailForgot.length > 50 ||
          !this.emailForgot.match(mailformat)
        ) {
          alert("please enter an email and respect its format")
          return
        }
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
    submit() {
      // this will trigger the process
      this.$refs.elementRef.submit()
    },
    submitQuantity() {
      this.$refs.elementRefQ.submit()
    },

    async createToken(token) {
      try {
        this.initMessage()
        this.loading = true
        this.showingOverlay = true
        const result = await axios.post(
          serverUrl + "/api/payment/add-stripe-payment",
          {
            token,
            amount: 2900,
            currency: "USD",
            description: "extend",
            userId: this.user._id,
            orderId:
              Object.keys(this.userOrder).length === 0
                ? this.user?.orderId
                : this.userOrder?.orderId,
            type: "ext1year",
            endDate: this.endDateSubscription,
          }
        )
        if (result?.data?.success) {
          this.endDateSubscription = result?.data?.newEndDate
          this.success = true
          this.message =
            "Successful transaction. Your program renewal is now confirmed."
        } else {
          this.error = true
          this.message = "error with payment"
          console.log("erreur")
        }
        this.loading = false
        this.showingOverlay = false
      } catch (e) {
        this.loading = false
        this.error = true
        this.message = "error with payment"
        this.showingOverlay = true
        console.log(e)
      }

      // handle the token
      // send it to your server
    },
    initMessage() {
      this.error = false
      this.success = false
      this.message = ""
    },
    async createTokenForQuantity(token) {
      this.initMessage()
      if (
        this.quantityBook === "No extra books" ||
        parseInt(this.quantityBook) <= 0
      ) {
        this.error = true
        this.message = "Kindly select the quantity."
        return
      }
      try {
        this.loading = true
        this.showingOverlay = true

        const result = await axios.post(
          serverUrl + "/api/payment/quantity-stripe-payment",
          {
            token,
            amount: 3000 * this.quantityBook,
            currency: "USD",
            description: "quanity extend",
            quantity: this.quantityBook,
            orderId:
              Object.keys(this.userOrder).length === 0
                ? this.user?.orderId
                : this.userOrder?.orderId,
            type: "extQuantity",
            userId: this.user._id,
          }
        )
        if (result?.data?.success) {
          this.quantity = result?.data?.quantity
          this.success = true
          this.message =
            "Transaction completed successfully. Your additional copies have been incorporated into your program."
        } else {
          this.error = true
          this.message = "error with payment"
          console.log("erreur")
        }
        this.loading = false
        this.showingOverlay = false
      } catch (e) {
        this.loading = false
        this.error = true
        this.message = "error with payment"
        this.showingOverlay = true
        console.log(e)
      }

      // handle the token
      // send it to your server
    },
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
    getIndexOrder: function () {
      const story = this.user?.listOrders?.find(
        (sto) => sto?.bookId === this.user?.defaultBookId
      )
      return this.user?.listOrders?.indexOf(story)
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
    if (!this.isPrincipalOrder) {
      this.userOrder = this.user?.listOrders[this.getIndexOrder]
      this.mailFrequence = this.userOrder?.mailFrequence
      this.disableGustResponse = this.userOrder?.disableGustResponse
        ? this.userOrder?.disableGustResponse
        : 0
      this.recipGiftDate = dayjs(this.userOrder?.recipGiftDate).format(
        "DD/MM/YYYY"
      )
      this.giftMessage = this.userOrder?.giftMessage
      this.recipEmail = this.userOrder?.recipEmail
      this.recipFName = this.userOrder?.recipFName
      this.recipLName = this.userOrder?.recipLName
      this.name = this.userOrder?.name
      this.email = this.userOrder?.email
      this.quantity = this?.userOrder?.quantity ? this?.userOrder?.quantity : 1
      this.endDateSubscription = this.userOrder.dateEndContract
        ? dayjs(this.userOrder?.dateEndContract).format("MM/DD/YYYY")
        : this.userOrder?.recipGiftDate
        ? dayjs(this.userOrder?.recipGiftDate)
            .add(1, "year")
            .format("MM/DD/YYYY")
        : dayjs(this.userOrder?.creationDate)
            .add(1, "year")
            .format("MM/DD/YYYY")
    } else {
      this.mailFrequence = this.user.mailFrequence
      this.disableGustResponse = this.user.disableGustResponse
        ? this.user.disableGustResponse
        : 0
      this.recipGiftDate = dayjs(this.user?.recipGiftDate).format("DD/MM/YYYY")
      this.giftMessage = this.user?.giftMessage
      this.recipEmail = this.user?.recipEmail
      this.recipFName = this.user?.recipFName
      this.recipLName = this.user?.recipLName
      this.recipEmail = this.user?.recipEmail
      this.name = this.user?.name
      this.email = this.user?.email
      this.endDateSubscription = this.user.dateEndContract
        ? dayjs(this.user?.dateEndContract).format("MM/DD/YYYY")
        : this.user?.recipGiftDate
        ? dayjs(this.user?.recipGiftDate).add(1, "year").format("MM/DD/YYYY")
        : dayjs(this.user?.creationDate).add(1, "year").format("MM/DD/YYYY")
      this.quantity = this?.user?.quantity ? this?.user?.quantity : 1
    }
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
.paypal-button-text {
  display: none;
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
#stripe-element-mount-point {
  height: 50px;
  padding: 15px 20px;
  border-radius: 20px;
  box-shadow: none;
  border: 1px solid rgba(6, 42, 32, 0.1);
}
.custom-paypal-button {
  /* Appliquer ici le style souhaité pour le bouton */
  /* Par exemple, définir un fond sans texte */
  background-color: transparent;
  border: none;
  /* Définir la taille et la position du bouton */
  width: 150px;
  height: 50px;
  /* Masquer le texte en ajustant la position du fond */
  background-position: -9999px -9999px;
  overflow: hidden;
}
.paypal-button-text {
  display: none !important;
}
</style>
<style scoped>
.paypal-button-text {
  display: none !important;
}
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
.paypal-message {
  display: none;
}
.quantity-book {
  border: 1px solid rgba(6, 42, 32, 0.1);
  border-radius: 20px;
  padding: 10px 10px;
  width: 200px;
  background: transparent;
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
.hide-button-text-overlay {
  position: relative;
  z-index: 1;
}

.hide-button-text-overlay::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  pointer-events: none;
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
button:disabled {
  background-color: #f6f4f3;
  color: #14473c61;
  border: 1px solid #14473c0a;
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
  margin-top: 15px;
}
.label-subsc-title {
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  color: #14473c;
  margin-top: 15px;
}
.label-subsc-title span {
  color: #e1504b;
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
.alert {
  padding: 10px;
  margin-bottom: 10px;
  color: #fff;
  font-weight: bold;
}

.success {
  background-color: green;
}

.error {
  background-color: red;
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
.stripe-card {
  width: 50%;
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
  .d-row.col-mobile {
    flex-direction: column;
  }
  .stripe-card {
    width: 100%;
  }
}
</style>
