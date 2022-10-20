<template>
  <div class="d-row site-background">
    <div class="container-welcome">
      <div
        class="route-section d-flex-col d-flex-centered"
        style="justify-content: center"
      >
        <img
          src="../assets/logo-mylife.png"
          alt=""
          width="83px"
          height="107px"
          class="welcome-logo"
        />
        <div class="welcome-content-container d-col">
          <div style="margin-bottom: 28px"></div>

          <div style="margin-bottom: 32px; text-align: center">
            <span class="welcome-title-text">
              Which account would like to enter on?</span
            >
            <div class="error-message-container">
              <span v-if="errorMessage" class="error-message"
                >You have to choose an account
              </span>
            </div>
          </div>

          <div class="guest-container">
            <div
              v-for="(user, indexUser) in listOrders"
              :key="indexUser"
              class="ptr"
            >
              <div>
                <div
                  class="guest-name ptr"
                  :class="{ selected: selectedBook === user.bookId }"
                  @click="selectedBook = user.bookId"
                >
                  {{ user.recipFName ? user.recipFName[0] : user.name[0] }}
                </div>
                {{ user.recipFName ? user.recipFName : user.name }}
              </div>
            </div>
          </div>
          <div style="margin-bottom: 18px">
            <button class="confirm-login ptr" @click="setdefaultBook()">
              LOG IN
            </button>
          </div>
        </div>
      </div>
    </div>
    <navbar class="mobile-navbar"></navbar>
  </div>
</template>

<script>
import navbar from "../components/navbar.vue"
import { serverUrl } from "../severUrl"
import axios from "axios"
export default {
  components: {
    navbar,
  },
  data() {
    return {
      listOrders: [],
      selectedBook: "",
      errorMessage: false,
    }
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser
    },
    serverUrl: function () {
      return serverUrl
    },
  },
  methods: {
    setdefaultBook: async function () {
      if (this.selectedBook) {
        this.user.defaultBookId = this.selectedBook
        const response = await axios.put(serverUrl + "/api/users/", this.user, {
          withCredentials: true,
        })
        if (response.status == 200) {
          this.$store.commit("setUser", response.data)
          await this.$store.dispatch("fetchPopulatedChapters")

          console.log(response.data)
        }
        this.$router.push("/")
      } else {
        this.errorMessage = true
      }
    },
  },
  async created() {
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
  },
}
</script>

<style>
.container-welcome {
  width: 100%;
  padding: 43px 50px;
}
.welcome-title-text {
  color: #062a20;
  font-family: "PT-serif";
  font-weight: bold;
  font-size: 30px;
  line-height: 26px;
}
.error-message {
  color: red;
}
.error-message-container {
  margin-top: 10px;
  text-align: center;
}
.welcome-content-container {
  background: #ffffff;
  border: 1px solid rgba(6, 42, 32, 0.2);
  box-sizing: border-box;
  border-radius: 22px;
  padding: 70px;
  align-items: center;
  width: 730px;
}
.welcome-paragraph-text {
  color: #062a20;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
}
.d-flex-col {
  flex-direction: column;
}
.welcome-tutorial-text {
  color: #062a20;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}

.welcome-tutorial-link {
  color: #062a20;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-decoration: underline;
}
.welcome-logo {
  margin-bottom: 20px;
}
.guest-name {
  background-color: #14473c;
  text-align: center;
  display: flex;
  color: white;
  text-transform: uppercase;
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 50%;
  font-size: 24px;
  font-weight: 500;
}
.guest-container {
  width: 100%;
  margin: auto;
  justify-content: space-evenly;
  margin-bottom: 50px;
  text-align: center;
  display: flex;
}
.guest-name.selected {
  border: 3px solid rgba(225, 80, 75, 1);
}
.confirm-login {
  background-color: #14473c;
  padding: 10px 30px;
  border-radius: 30px;
  color: #ffffff;
  border: none;
  font-size: 16px;
}

@media screen and (max-width: 1024px) {
  .welcome-title-text {
    font-size: 20px;
  }

  .welcome-content-container {
    padding: 70px 20px;
  }
}
@media screen and (max-width: 768px) {
  .welcome-content-container {
    width: auto;
    background: transparent;
    border: none;
  }
  .welcome-title-text {
    text-align: center;
  }
}

@media screen and (max-width: 325px) {
  .welcome-title-text {
    font-size: 16px;
  }
  .welcome-paragraph-text {
    font-size: 13px;
    line-height: 16px;
  }
  .welcome-tutorial-text {
    font-size: 13px;
    line-height: 16px;
  }
  .welcome-tutorial-link {
    font-size: 13px;
    line-height: 16px;
  }

  .welcome-content-container {
    padding: 70px 20px;
  }
}
</style>
