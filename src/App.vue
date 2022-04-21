<template>
  <div id="app">
    <div class="overlay" v-if="loading">
      <div>
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <loading-screen></loading-screen>
    <router-view
      :user="user"
      @login="registerUser()"
      @saveCover="checkCover($event)"
      class="desktop-view"
    ></router-view>
    <!-- <div
      class="help-button-container"
      @click="showingFAQ = true"
      v-if="!showingFAQ"
    >
      <img src="./assets/help.png" alt="" class="help-button" />
    </div>
    <div class="FAQ-section" v-else>
      <span class="FAQ-section-title">Foire Aux Questions</span>
      <div class="categories-container">
        <div
          class="FAQ-category-container"
          v-for="(FAQcategory, keyCategories) in FAQ"
          :key="keyCategories"
        >
          <div
            class="FAQ-category-title-container"
            @click="FAQcategory.isExpanded = !FAQcategory.isExpanded"
          >
            <span class="FAQ-category-title">{{ FAQcategory.title }}</span>
            <img src="./assets/arrow-down.png" alt="" class="FAQ-expand-btn" />
          </div>
          <div class="FAQ-questions-container" v-if="FAQcategory.isExpanded">
            <div
              v-for="(FAQquestion, keyFAQQuestions) in FAQcategory.questions"
              :key="keyFAQQuestions"
            >
              <span>{{ FAQquestion }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="close-FAQ" @click="showingFAQ = false">
        <img src="./assets/close-FAQ.svg" alt="" />
      </div>
    </div> -->
  </div>
</template>

<script>
import axios from "axios";
import { serverUrl } from "./severUrl";
import LoadinComponent from "./components/Loading.vue";
export default {
  name: "App",
  components: {
    "loading-screen": LoadinComponent,
  },
  data() {
    return {
      hasCover: false,
      isOverlayShown: false,
      showingFAQ: false,
      FAQ: [
        {
          title: "catégorie 1",
          questions: [
            "Cras at ipsum pulvinar, placerat purus vehicula, maximus metus?",
            "Aliquam condimentum sapien vitae sapien venenatis blandit?",
            "Duis eget ex laoreet, tristique eros at, finibus magna?",
            "Maecenas in lectus mattis, dignissim diam a, finibus massa?",
          ],
          isExpanded: true,
        },
        {
          title: "catégorie 2",
          questions: [
            "Cras at ipsum pulvinar, placerat purus vehicula, maximus metus?",
            "Aliquam condimentum sapien vitae sapien venenatis blandit?",
            "Duis eget ex laoreet, tristique eros at, finibus magna?",
            "Maecenas in lectus mattis, dignissim diam a, finibus massa?",
          ],
          isExpanded: false,
        },
        {
          title: "catégorie 3",
          questions: [
            "Cras at ipsum pulvinar, placerat purus vehicula, maximus metus?",
            "Aliquam condimentum sapien vitae sapien venenatis blandit?",
            "Duis eget ex laoreet, tristique eros at, finibus magna?",
            "Maecenas in lectus mattis, dignissim diam a, finibus massa?",
          ],
          isExpanded: false,
        },
      ],
      loading: true,
    };
  },
  methods: {
    hideOverlay: async function () {
      this.isOverlayShown = false;
      this.user.hasSeenTips = true;
      const response = await axios.put(serverUrl + "/api/users/", this.user, {
        withCredentials: true,
      });
      const userString = JSON.stringify(this.user);
      localStorage.setItem("user", userString);
      if (!response.status == 200) {
        console.log(response.data);
      }
    },
    getUser: async function () {
      try {
        const response = await axios.get(
          serverUrl + "/api/users/61a4e3235118691817f7cb9d",
          { withCredentials: true }
        );
        if (response.status == 200) {
          this.user = response.data;
          console.log("got user from app component");
        } else console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    checkCover: async function (payload) {
      console.log(payload);
      this.hasCover = payload;
    },
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser;
    },
  },
  mounted() {
    this.loading = false;
  },
};
</script>

<style>
/* scrollbar */
/* * {
  scrollbar-width: thin;
  scrollbar-color: #bdbdbd #ffffff;
} */

/* Works on Chrome, Edge, and Safari */
/* *::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
} */

/* *::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
} */

/* *::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #bdbdbd;
} */
html {
  height: 100%;
  width: 100vw;
}

body {
  height: 100%;
  width: 100%;
}
@media screen and (max-width: 1024px) {
  html {
    min-height: 100%;
  }

  .route-section {
    height: 100%;
  }

  .container {
    height: calc(100% - 64px);
    overflow-y: auto;
  }
}
@media screen and (min-resolution: 120dpi) and (min-width: 1024px) {
  html {
    transform: scale(0.8);
    transform-origin: top left;
    height: 125%;
    width: 125%;
    overflow: hidden;
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

@font-face {
  font-family: PT-serif;
  src: url("/fonts/PTSerif-Regular.ttf");
  font-weight: normal;
}

@font-face {
  font-family: PT-serif;
  src: url("/fonts/PTSerif-Bold.ttf");
  font-weight: bold;
}

@font-face {
  font-family: PT-serif;
  src: url("/fonts/PTSerif-italic.ttf");
  font-weight: normal;
  font-style: italic;
}
@font-face {
  font-family: galaxie-polaris;
  font-weight: 300;
  src: url("/fonts/galaxie polaris/Galaxie Polaris Light.otf");
}

@font-face {
  font-family: galaxie-polaris;
  font-weight: 400;
  src: url("/fonts/galaxie polaris/Galaxie Polaris Book.otf");
}

@font-face {
  font-family: galaxie-polaris;
  font-weight: 500;
  src: url("/fonts/galaxie polaris/Galaxie Polaris Medium.otf");
}

@font-face {
  font-family: galaxie-polaris;
  font-weight: 600;
  src: url("/fonts/galaxie polaris/Galaxie Polaris Bold.otf");
}

@font-face {
  font-family: galaxie-polaris;
  font-weight: 700;
  src: url("/fonts/galaxie polaris/Galaxie Polaris Heavy.otf");
}

@font-face {
  font-family: polaris;
  font-weight: 400;
  src: url("/fonts/polaris/GalaxiePolaris-Book.otf");
}

@font-face {
  font-family: polaris;
  font-weight: 500;
  src: url("/fonts/polaris/GalaxiePolaris-Medium.otf");
}

@font-face {
  font-family: mont;
  font-weight: 400;
  src: url("/fonts/mont/Mont-Book.otf");
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

#app {
  height: 100%;
  font-family: galaxie-polaris, arial;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #e1504b;
  border-color: #e1504b transparent #e1504b transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}

.lds-dual-ring.small:after {
  content: " ";
  display: block;
  width: 12px;
  height: 12px;
  margin: 0px;
  border-radius: 50%;
  border: 3px solid rgb(255, 107, 107);
  border-color: rgb(255, 107, 107) transparent rgb(255, 107, 107) transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.d-col {
  display: flex;
  flex-direction: column;
}

.d-row {
  display: flex;
  flex-direction: row;
}

.ptr:hover {
  cursor: pointer;
}

.d-flex-centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

a {
  text-decoration: none;
  color: inherit;
}

.site-background {
  background: #14473c;
  height: 100%;
  padding: 43px 50px 43px 50px;
}
.container {
  width: calc(100% - 224px);
}
.route-title-container {
  margin-top: 14px;
  margin-bottom: 28px;
}

.route-title {
  font-size: 24px;
  line-height: 26px;
  font-weight: 600;
  text-align: justify;
  color: #062a20;
}

.route-section {
  padding: 31px;
  height: 100%;
  width: 100%;
  background: #f6f4f3;
  /* background: pink; */
  border-radius: 30px;
  justify-content: flex-start;
}

.overlay {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
  padding: 20px;
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0px;
  left: 0px;
}
.pop-up {
  padding: 70px;
  background: #ffffff;
  border: 1px solid rgba(6, 42, 32, 0.2);
  box-sizing: border-box;
  border-radius: 22px;
}

.pop-up-title {
  font-size: 24px;
  line-height: 26px;
  font-weight: 500;
  color: #062a20;
  margin-bottom: 20px;
}

.pop-up-paragraph {
  text-align: center;
  font-family: polaris;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #062a20;
  margin-bottom: 34px;
}

.pop-up-buttons-container {
  display: flex;
  justify-content: center;
}

.pop-up-btn {
  font-weight: bold;
  padding: 20px 43px;
  font-size: 16px;
  line-height: 21px;
  color: #14473c;
  font-family: PT-serif;
  background: transparent;
  border: 1px solid #062a2033;
}
.pop-up-btn:hover {
  cursor: pointer;
}
.pop-up-btn.confirm {
  color: white;
  background: #14473c;
  border: none;
  margin-right: 40px;
}

.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
}

.pagination-icon-container {
  display: inline-block;
  margin-right: 45px;
}
.pagination-icon-container:hover {
  cursor: pointer;
}

.pagination-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-button {
  height: 15px;
  width: 15px;
  border-radius: 50%;
  background-color: #bcbcbc;
}

.pagination-button:hover {
  cursor: pointer;
  background-color: #eca2a2;
}
.pagination-button.active {
  background-color: #e26767;
}
.mobile-banner {
  display: none;
}

.mobile-banner-img {
  width: 80%;
  height: 80%;
}

.banner-title {
  color: #14473c;
  font-size: 18px;
  font-weight: 500;
}

.banner-paragraph {
  text-align: justify;
  text-justify: inter-word;
  color: #14473c;
}

.mobile-navbar {
  display: none;
}
@media screen and (max-width: 1024px) {
  .site-background {
    padding: 0px;
    background: none;
    position: relative;
    height: calc(100vh - calc(100vh - 100%));
    height: webkit-fill-available;
    display: block;
  }
  .route-section {
    border-radius: 0px;
    height: fit-content;
    min-height: 100%;
  }
  .pop-up {
    padding: 30px 39px 48px 39px;
  }
  .pop-up-buttons-container {
    flex-direction: column;
    width: 100%;
  }
  .pop-up-btn {
    font-weight: bold;
    padding: 20px 43px;
    font-size: 16px;
    width: 100%;
    line-height: 21px;
    color: #14473c;
    font-family: PT-serif;
    background: transparent;
    border: 1px solid #062a2033;
  }
  .pop-up-btn.confirm {
    margin-right: 0px;
    margin-bottom: 8px;
  }
  .pop-up-paragraph {
    font-size: 14px;
  }
  .mobile-navbar {
    display: block;
  }
  .navbar.desktop-navbar {
    display: none;
  }
}
</style>
