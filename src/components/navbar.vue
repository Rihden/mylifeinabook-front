<template>
  <div>
    <div class="navbar">
      <div class="col-navbar d-col">
        <div class="">
          <router-link to="/">
            <img
              src="../assets/Logo-white-en.png"
              alt=""
              width="83px"
              height="107px"
            />
          </router-link>
        </div>
        <div class="nav-items-container">
          <span class="sotryletter-container">
            <select
              v-model="selectedBook"
              v-if="listOrders.length > 1"
              @change="onChange()"
              class="storyletter"
            >
              <option
                v-for="order in listOrders"
                :value="order.bookId"
                :key="order.bookId"
              >
                {{ order.recipFName ? order.recipFName : order.name }}
              </option>
            </select>
          </span>
          <router-link to="/" v-if="admin != 'true'"
            ><div class="nav-item" @click="reloadChapters()">
              <span>Questions</span>
            </div></router-link
          >
          <router-link to="/stories" v-if="admin != 'true'"
            ><div class="nav-item">
              <span>Stories</span>
            </div></router-link
          >

          <router-link to="/couverture" v-if="admin != 'true'"
            ><div class="nav-item">
              <span>Cover</span>
            </div></router-link
          >

          <router-link to="/revue" v-if="admin != 'true'">
            <div class="nav-item">
              <span>Preview</span>
            </div>
          </router-link>

          <router-link to="/impression" v-if="admin != 'true'">
            <div class="nav-item">
              <span>Print</span>
            </div>
          </router-link>
          <router-link to="/admin" v-if="admin == 'true'"
            ><div class="nav-item">
              <span>Printing</span>
            </div></router-link
          >
          <router-link to="/profile" v-if="admin != 'true'"
            ><div class="nav-item">
              <span>Settings</span>
            </div></router-link
          >
        </div>
        <div class="help-section d-flex-centered d-col" v-if="admin != 'true'">
          <img src="../assets/intersect-1.svg" alt="" class="stripe-1" />
          <img src="../assets/intersect-2.svg" alt="" class="stripe-2" />
          <img src="../assets/intersect-3.svg" alt="" class="stripe-3" />

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

          <button
            id="gorgias-chat-messenger-button-h"
            aria-label="Open the chat"
            class="messenger-button-iframe-1lk5rjv help-button"
            @click="gorgiasChatOpen()"
          >
            <span>Help</span>
          </button>
        </div>
      </div>
      <div class="user-item d-row">
        <div style="display: inline-block; margin-left: 14px">
          <div>
            <span class="user-name">{{ nameUser }} </span>
          </div>
          <div>
            <span @click="logout()" class="logout-button">Log out </span>
          </div>
        </div>
      </div>
      <div class="row-navbar">
        <router-link to="/" v-if="admin != 'true'"
          ><div @click="reloadChapters()">
            <img
              src="../assets/inf-active.svg"
              alt=""
              class="mobile-nav-image-active"
            />
            <img src="../assets/inf.svg" alt="" class="mobile-nav-image" /></div
        ></router-link>

        <router-link to="/couverture" v-if="admin != 'true'"
          ><div>
            <img
              src="../assets/book-active.svg"
              alt=""
              class="mobile-nav-image-active"
            />
            <img
              src="../assets/book.svg"
              alt=""
              class="mobile-nav-image"
            /></div
        ></router-link>

        <router-link to="/revue" v-if="admin != 'true'">
          <div>
            <img
              src="../assets/pdf-active.svg"
              alt=""
              class="mobile-nav-image-active"
            />
            <img src="../assets/pdf.svg" alt="" class="mobile-nav-image" />
          </div>
        </router-link>

        <router-link to="/impression" v-if="admin != 'true'">
          <div>
            <img
              src="../assets/print-active.svg"
              alt=""
              class="mobile-nav-image-active"
            />
            <img src="../assets/print.svg" alt="" class="mobile-nav-image" />
          </div>
        </router-link>

        <router-link to="/profile">
          <img
            src="../assets/user-active.svg"
            alt=""
            class="mobile-nav-image-active"
          />
          <img src="../assets/user.svg" alt="" class="mobile-nav-image" />
        </router-link>

        <router-link to="/admin" v-if="admin == 'true'"
          ><div>
            <span>admin</span>
          </div></router-link
        >
      </div>
    </div>

    <Slide
      right
      width="250"
      closeOnNavigation
      @openMenu="handleOpenMenu"
      @closeMenu="handleCloseMenu"
      class="menu-mobile"
      :class="{
        bmburgerbutton: isMenuOpen,
        isOpenMenu: !isMenuOpen,
      }"
    >
      <span class="sotryletter-container">
        <select
          v-model="selectedBook"
          v-if="listOrders.length > 1"
          @change="onChange()"
          class="storyletter"
        >
          <option
            v-for="order in listOrders"
            :value="order.bookId"
            :key="order.bookId"
          >
            {{ order.recipFName ? order.recipFName : order.name }}
          </option>
        </select>
      </span>
      <router-link to="/" v-if="admin != 'true'">
        <span @click="reloadChapters()">Questions</span>
      </router-link>
      <router-link to="/stories" v-if="admin != 'true'">
        <span>Stories</span>
      </router-link>

      <router-link to="/couverture" v-if="admin != 'true'">
        <span>Cover</span>
      </router-link>

      <router-link to="/revue" v-if="admin != 'true'">
        <span>Preview</span>
      </router-link>

      <router-link to="/impression" v-if="admin != 'true'">
        <span>Print</span>
      </router-link>
      <router-link to="/admin" v-if="admin == 'true'">
        <span>Printing</span>
      </router-link>
      <hr class="hr-menu" />
      <router-link to="/profile" v-if="admin != 'true'">
        <span>Settings</span>
      </router-link>
      <hr class="hr-menu" />
      <div>
        <span @click="logout()">Log out </span>
      </div>
    </Slide>
  </div>
</template>

<script>
import axios from "axios"
import { serverUrl } from "../severUrl"
import { Slide } from "vue-burger-menu"
import Vue from "vue"
import VueMobileDetection from "vue-mobile-detection"
Vue.use(VueMobileDetection)

/*import VueGorgias from "vue-gorgias"
Vue.use(VueGorgias, {
  apiKey: "22dd57dfcd51ab5d2088a8b766db6585ca6fc890e42871048ca48016c50f95af",
  chatId: "45195",
})*/

//import ChaptersVue from "../views/Chapters.vue"
export default {
  props: ["admin"],
  data() {
    return {
      nameUser: "",
      isMenuOpen: false,
      listOrders: [],
      selectedBook: "",
    }
  },
  components: { Slide },

  methods: {
    reloadChapters: async function () {
      if (this.$route.path === "/") {
        await this.$router
          .replace({
            query: [""],
          })
          .catch(() => true)
        await this.$router.go("/")
      }
    },
    handleOpenMenu: function () {
      this.isMenuOpen = !this.isMenuOpen
    },
    handleCloseMenu: function () {
      this.isMenuOpen = false
    },
    gorgiasChatOpen: function () {
      window.GorgiasChat.open()
    },
    onChange: async function () {
      this.user.defaultBookId = this.selectedBook
      const response = await axios.put(serverUrl + "/api/users/", this.user, {
        withCredentials: true,
      })
      if (response.status == 200) {
        this.$store.commit("setUser", response.data)
        await this.$store.dispatch("fetchPopulatedChapters")
        window.location.reload()
        console.log(response.data)
      }
    },
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
            this.$router.replace("/")
            this.$router.go()
          }
        } catch (error) {
          console.log(error)
          this.loading = false
          this.showingOverlay = false
        }
      }
    },
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser
    },
  },
  created() {
    this.selectedBook = this.user.defaultBookId
    this.listOrders = [
      {
        bookId: this.user.bookId,
        recipLName: this.user.recipLName,
        recipFName: this.user.recipFName,
        name: this.user.name,
      },
    ]
    this.user.listOrders?.map((order) => {
      if (order && Object.keys(order).length > 0) {
        this.listOrders.push(order)
      }
    })
    if (this.user.guest == 1) {
      this.nameUser = this.user.recipFName + " " + this.user.recipLName
    } else {
      this.nameUser = this.user.name
    }

    window.GorgiasChat.close()
  },
}
</script>
<style>
.navbar {
  width: 224px;
  height: 100%;
  position: relative;
  padding-bottom: 12px;
}
.menu-mobile {
  display: none;
}
.bm-burger-button,
.logo-mobile {
  display: none;
}
.nav-items-container {
  margin-top: 70px;
  flex-grow: 1;
  overflow: auto;
}
.storyletter {
  background: transparent;
  padding: 15px;
  margin-bottom: 20px;
  color: white;

  width: 65%;
  border: none;
}
.sotryletter-container {
  width: 100%;
  padding: 12px;
  border-radius: 100px;
  border: solid 1px rgba(255, 255, 255, 0.2);
}
.nav-item {
  margin-bottom: 44px;
  color: white;
  font-size: 16px;
  line-height: 17px;
  font-family: galaxie-polaris;
}

.user-item {
  bottom: 22px;
  position: absolute;
}
.user-name {
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;
  color: white;
}

.logout-button {
  font-weight: normal;
  font-size: 14px;
  line-height: 15px;
  color: rgba(255, 255, 255, 0.3);
}

.logout-button:hover {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.45);
}
.user-avatar {
  align-items: baseline;
}

.router-link-active {
  font-weight: 500;
}
.active.router-link-active > div > span::before {
  content: url("../assets/navbar-prefix.svg");
  height: 8px;
  width: 8px;
  margin-right: 12px;
}

.help-section {
  position: relative;
  width: 195px;
  height: 142px;
  background: #e1504b;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.09);
  border-radius: 30px;
  text-align: center;
  margin-bottom: 105px;
  margin-top: 30px;
}

.help-button {
  position: absolute;
  bottom: -29px;
  height: 58px;
  width: 130px;
  background: #ffffff;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
  border-radius: 100px;
  border: none;
  font-family: galaxie-polaris;
  font-weight: 500;
  font-size: 16px;
  line-height: 17px;
  color: #14473c;
  padding: 18px 0px;
}
.help-button:hover {
  cursor: pointer;
}

.stripe-1 {
  position: absolute;
  left: 5.33%;
  right: 69.81%;
  top: 0%;
  bottom: 93.85%;
}
.stripe-2 {
  position: absolute;
  left: 1.04%;
  right: 64.83%;
  top: 0%;
  bottom: 85.71%;
}

.stripe-3 {
  position: absolute;
  left: 0%;
  right: 57.1%;
  top: 0%;
  bottom: 75.27%;
}
.col-navbar.d-col {
  overflow-y: auto;
  max-height: 88%;
  position: relative;
}
.row-navbar {
  display: none;
}

@media screen and (max-width: 1024px) {
  .navbar {
    display: none;
  }
  .menu-mobile .hr-menu {
    background-color: #d9d9d9;
    height: 1px;
    border: 0;
    padding: 0;
  }
  .menu-mobile {
    display: block;
  }

  .menu-mobile .bm-burger-button {
    display: block;
    z-index: 1;
    position: absolute;
    transition: top 0.3s;
    top: 27px;
  }
  .logo-mobile {
    display: block;
    position: absolute;
    top: 36px;
  }
  .menu-mobile .bm-burger-bars {
    background-color: #14473c;
  }
  .menu-mobile .line-style {
    height: 16%;
  }
  .menu-mobile.bmburgerbutton .bm-menu {
    border: 1px solid rgba(6, 42, 32, 0.1);
  }
  .menu-mobile.isOpenMenu .bm-menu {
    display: none;
  }
  .menu-mobile .bm-menu {
    background-color: white;
    box-sizing: border-box;
    position: absolute;
    height: 366px;
    left: 186px;
    top: 72px;
    border-radius: 10px;
    right: 32px !important;
    padding-top: 15px;
  }
  .menu-mobile .line-style {
    height: 11%;
    border-radius: 10px;
  }
  .menu-mobile .bm-burger-button {
    width: 24px;
    height: 20px;
  }
  .menu-mobile .bm-item-list {
    margin-left: 0;
  }
  .menu-mobile .bm-item-list > * > span {
    color: #14473c;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    text-align: right;
  }
  .row-navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #14473c;
    width: 100%;
    height: 64px;
    padding: 0px 35px;
  }
  .mobile-nav-image-active {
    display: none;
  }

  .col-navbar {
    display: none;
  }
  .active.router-link-active > div > img.mobile-nav-image-active {
    display: inline;
  }
  .active.router-link-active > div > img.mobile-nav-image {
    display: none;
  }

  .user-item {
    display: none;
  }
}
</style>
