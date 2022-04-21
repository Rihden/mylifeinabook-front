<template>
  <div class="d-row site-background">
    <navbar class="desktop-navbar"></navbar>
    <div class="container">
      <div
        class="route-section d-flex-centered"
        style="justify-content: center"
      >
        <div class="welcome-content-container d-col">
          <div style="margin-bottom: 28px">
            <img
              :src="serverUrl + '/' + user.avatar"
              height="44px"
              width="44px"
              alt=""
            />
          </div>

          <div style="margin-bottom: 32px">
            <span class="welcome-title-text"> Welcome {{ user.name }},</span>
          </div>
          <div style="margin-bottom: 50px; text-align: center">
            <span class="welcome-paragraph-text">
              We wish you a pleasant writing session.</span
            >
          </div>
          <div style="margin-bottom: 18px; width: 200px">
            <button class="confirm-impression-btn ptr" @click="startEditing()">
              START
            </button>
          </div>
          <div style="text-align: center" class="d-col">
            <span class="welcome-tutorial-text">
              Want to see the tutorial?
            </span>
            <span class="welcome-tutorial-link" style="">Click here</span>
          </div>
        </div>
      </div>
    </div>
    <navbar class="mobile-navbar"></navbar>
  </div>
</template>

<script>
import navbar from "../components/navbar.vue";
import { serverUrl } from "../severUrl";
export default {
  components: {
    navbar,
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser;
    },
    serverUrl: function () {
      return serverUrl;
    },
  },
  methods: {
    startEditing: function () {
      this.$router.push("/");
    },
  },
};
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