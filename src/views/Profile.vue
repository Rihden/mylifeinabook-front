<template>
  <div class="d-row site-background">
    <div class="overlay" v-if="showingOverlay">
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <navbar></navbar>

    <div class="container">
      <div class="route-section">
        <div class="profile-container">
          <!-- <div class="profile-routes-container">
            <div class="profile-route ptr" :class="{ active: routeIndex == 0 }">
              <span>Profile</span>
            </div>
          </div> -->
          <div
            v-if="routeIndex == 0"
            style="min-height: 100%; flex-grow: 1; position: relative"
          >
            <div class="profile-panel">
              <div class="d-row">
                <img
                  :src="'/' + user.avatar"
                  alt=""
                  class="profile-user-image"
                />
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
                  <span style="font-weight: 500; color: white">Need help?</span>
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
          </div>
          <!-- <div v-if="routeIndex == 1" style="flex-grow: 1">
            <div class="profile-panel">
              <div class="profile-route-title">
                <span>Modifer mot de passe</span>
              </div>
              <div style="max-width: 350px">
                <div class="profile-form-section d-row">
                  <input
                    :type="passwordStates1"
                    class="profile-input"
                    :class="{ error: field1Error }"
                    v-model="oldPw"
                    @keypress.enter="updatePassword()"
                    placeholder="Ancien mot de passe"
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
                    placeholder="Nouveau mot de passe"
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
                    placeholder="Répeter mot de passe"
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
                    password changed successfully
                  </span>
                </div>
                <div style="margin-top: 36px">
                  <button
                    class="password-confirm-btn ptr"
                    @click="updatePassword()"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import navbar from "../components/navbar.vue";
import { serverUrl } from "../severUrl";
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
    };
  },
  components: {
    navbar,
  },
  methods: {
    logout: async function () {
      if (this.user) {
        try {
          this.loading = true;
          this.showingOverlay = true;
          const response = await axios.get(serverUrl + "/auth/logout", {
            withCredentials: true,
          });
          if (response.status === 200) {
            this.$store.commit("setUser", null);
            this.loading = false;
            this.showingOverlay = false;
            this.$router.push("/login");
          }
        } catch (error) {
          console.log(error);
          this.loading = false;
          this.showingOverlay = false;
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
      if (index == 3) {
        if (this.passwordStates3 === "password") {
          this.passwordStates3 = "text";
        } else {
          this.passwordStates3 = "password";
        }
      }
    },
    updatePassword: async function () {
      this.field1Error = false;
      this.field2Error = false;
      this.field3Error = false;
      this.updatedPassword = false;
      this.errorText = "";
      if (this.oldPw == "") {
        this.field1Error = true;
        this.errorText = "Old password is required.";
        return;
      }
      if (this.newPw1.length < 6) {
        this.field2Error = true;
        this.errorText = "Password needs to be at least 6 characters long.";
        return;
      }
      if (this.newPw1 != this.newPw2) {
        this.field3Error = true;
        this.errorText = "Passwords don't match.";
        return;
      }
      try {
        this.loading = true;
        this.showingOverlay = true;
        const result = await axios.put(
          serverUrl + "/api/users/update-password",
          {
            id: this.user._id,
            oldPw: this.oldPw,
            newPw: this.newPw1,
          },
          { withCredentials: true }
        );
        if (result.status == 200) {
          this.updatedPassword = true;
          this.loading = false;
          this.showingOverlay = false;
        }
      } catch (error) {
        this.loading = false;
        this.showingOverlay = false;
        if (
          error.response.status == 400 &&
          error.response.data == "wrong old password"
        ) {
          this.field1Error = true;
          this.errorText = "Wrong old password.";
        }
        console.log(error);
      }
    },
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser;
    },
  },
};
</script>

<style scoped>
.profile-panel {
  /* white/white */
  background: #ffffff;
  padding: 37px 61px 37px 61px;
  /* dark green / 20% */
  border: 1px solid rgba(6, 42, 32, 0.2);
  box-sizing: border-box;
  border-radius: 22px 22px 22px 22px;
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
  display: flex;
}
.profile-user-image {
  width: 78px;
  height: 78px;
}
.name-container {
  display: inline-block;
  margin-left: 22px;
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
@media screen and (max-width: 1024px) {
  /* .container {
    min-height: 100%;
    overflow-y: auto;
  } */
  .profile-container {
    display: flex;
    flex-direction: column;
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