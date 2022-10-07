<template>
  <div class="d-row site-background">
    <div class="container">
      <div
        class="route-section d-flex-centered"
        style="justify-content: center"
      >
        <div class="welcome-content-container d-col">
          <div style="margin-bottom: 28px"></div>

          <div style="margin-bottom: 32px">
            <span class="welcome-title-text">
              Which account would like to enter on?</span
            >
          </div>
          <div style="margin-bottom: 50px; text-align: center">
            <div
              v-for="(user, indexUser) in listOrders"
              :key="indexUser"
              class="ptr"
            >
              <div>
                <div
                  class="guest-container ptr"
                  :class="{ selected: selectedBook === user.bookId }"
                  @click="selectedBook = user.bookId"
                >
                  {{
                    user.recipLName
                      ? user.recipLName + " " + user.recipFName
                      : user.name
                  }}
                </div>
              </div>
            </div>
          </div>
          <div style="margin-bottom: 18px; width: 200px">
            <button
              class="confirm-impression-btn ptr"
              @click="setdefaultBook()"
            >
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
.welcome-title-text {
  color: #062a20;
  font-weight: bold;
  font-size: 24px;
  line-height: 26px;
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

@media screen and (max-width: 1024px) {
  .welcome-title-text {
    font-size: 20px;
  }

  .welcome-content-container {
    padding: 70px 20px;
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
