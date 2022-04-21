<template>
  <div class="navbar">
    <div class="col-navbar d-col">
      <div class="">
        <router-link to="/">
          <img
            src="../assets/logo - white.png"
            alt=""
            width="83px"
            height="107px"
          />
        </router-link>
      </div>
      <div class="nav-items-container">
        <router-link to="/" v-if="admin != 'true'"
          ><div class="nav-item" @click="reloadChapters()">
            <span>Chapters</span>
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
        <a href="#" class="help-button"><span>Help</span></a>
      </div>
    </div>
    <div class="user-item d-row">
      <router-link to="/profile">
        <img
          :src="'/' + user.avatar"
          alt=""
          width="44px"
          height="44px"
          class="user-avatar"
        />
      </router-link>
      <div style="display: inline-block; margin-left: 14px">
        <div>
          <router-link to="/profile">
            <span class="user-name">{{ user.lastName }} {{ user.name }}</span>
          </router-link>
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
          <img src="../assets/book.svg" alt="" class="mobile-nav-image" /></div
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
</template>

<script>
import axios from "axios";
import { serverUrl } from "../severUrl";
export default {
  props: ["admin"],

  methods: {
    reloadChapters: function () {
      if (this.$route.path === "/") {
        this.$router.go("/");
      }
    },
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
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser;
    },
  },
};
</script>

<style>
.navbar {
  width: 224px;
  height: 100%;
  position: relative;
  padding-bottom: 12px;
}

.nav-items-container {
  margin-top: 70px;
  flex-grow: 1;
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

.row-navbar {
  display: none;
}

@media screen and (max-width: 1024px) {
  .navbar {
    width: 100%;
    height: 64px;
    position: absolute;
    padding: 0;
    bottom: 0;
    left: 0;
    display: block;
    z-index: 5;
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