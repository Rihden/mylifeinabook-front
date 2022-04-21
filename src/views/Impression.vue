<template>
  <div class="d-row site-background">
    <div class="overlay" v-if="showingOverlay">
      <div class="pop-up d-flex-centered d-col" v-if="confirmingPrint">
        <div class="pop-up-title">
          <span>CONFIRM PRINTING</span>
        </div>
        <div class="pop-up-paragraph" style="max-width: 362px">
          <span
            >We need a second confirmation to start printing. Warning, you will
            not be able to go back after the confirmation.
          </span>
        </div>
        <div class="pop-up-buttons-container">
          <button
            class="pop-up-btn confirm"
            @click="confirmPrint()"
            style="margin-right: 12px"
          >
            I CONFIRM
          </button>
          <button class="pop-up-btn" @click="cancelPrint()">BACK</button>
        </div>
      </div>
      <div class="pop-up d-flex-centered d-col" v-if="errorPrint">
        <div style="height: 68px; margin-bottom: 26px">
          <img
            src="../assets/alert.png"
            alt=""
            style="height: 68px; width: 68px"
          />
        </div>
        <div class="pop-up-title">
          <span>{{ errorReason }}</span>
        </div>
        <div class="pop-up-paragraph" style="max-width: 362px">
          <span>{{ errorParagraph }} </span>
        </div>
        <div class="d-row d-flex-centered">
          <button
            class="pop-up-btn confirm"
            @click="hideErrorPanel()"
            style="margin-right: 12px; background: #e1504b"
          >
            Understood
          </button>
        </div>
      </div>
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <navbar></navbar>

    <div class="container">
      <div class="route-section" style="">
        <div class="route-title-container">
          <span class="route-title">Printing</span>
        </div>
        <div class="print-section-container d-flex-centered">
          <div class="main-section-container">
            <div class="left-side-print">
              <img src="/cover-style1.jpg" class="print-image" />
            </div>

            <div class="right-side-print">
              <div class="print-confirm-btn-mobile">
                <button
                  class="confirm-impression-btn ptr"
                  @click="startConfirmingPrint()"
                  :class="{ disabled: user.printStatus != 'writing' }"
                  :disabled="user.printStatus != 'writing'"
                >
                  CONFIRM PRINTING
                </button>
              </div>
              <div style="margin-bottom: 18px">
                <span class="print-paragraph">
                  Congrats ! This is the last step, you can either go back to
                  make changes or start printing your book by clicking on the
                  button below.
                </span>
              </div>
              <div class="book-stats-container">
                <div style="margin-bottom: 5px">
                  <span
                    >Total number of stories:
                    <span style="color: #e1504b">{{ storiesCount }}</span>
                  </span>
                </div>
                <div style="margin-bottom: 5px">
                  <span
                    >Total number of pictures:
                    <span style="color: #e1504b">{{ imagesCount }}</span>
                  </span>
                </div>
                <div style="margin-bottom: 5px">
                  <span
                    >Total number of pages:
                    <span style="color: #e1504b">{{ pagesCount }}</span>
                  </span>
                </div>
              </div>
              <div class="print-confirm-btn">
                <button
                  class="confirm-impression-btn ptr"
                  @click="startConfirmingPrint()"
                  :class="{ disabled: user.printStatus != 'writing' }"
                  :disabled="user.printStatus != 'writing'"
                >
                  CONFIRM PRINTING
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import navbar from "../components/navbar.vue";
import axios from "axios";
import { serverUrl } from "../severUrl";

export default {
  components: {
    navbar,
  },
  data() {
    return {
      styles: [],
      showingOverlay: true,
      loading: false,
      confirmingPrint: false,
      storiesCount: 0,
      imagesCount: 0,
      pagesCount: 0,
      errorPrint: false,
      errorReason: "",
      errorParagraph: "",
    };
  },
  methods: {
    doSmth: function () {
      console.log(this.book);
    },
    startConfirmingPrint: function () {
      this.confirmingPrint = true;
      this.showingOverlay = true;
    },
    cancelPrint: function () {
      this.confirmingPrint = false;
      this.showingOverlay = false;
    },
    confirmPrint: async function () {
      try {
        this.confirmingPrint = false;
        this.loading = true;
        this.showingOverlay = true;

        const response = await axios.get(
          serverUrl + "/api/users/confirm-print/" + this.user._id,
          { withCredentials: true }
        );
        if (response.status == 200) {
          this.user.printStatus = "pending";
          this.loading = false;
          this.showingOverlay = false;
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.showingOverlay = false;
        if (error.response.status == 400) {
          console.log(error.response.data);
          this.showingOverlay = true;
          this.errorPrint = true;
          this.errorReason = error.response.data.reason;
          this.errorParagraph = error.response.data.paragraph;
        }
      }
    },
    hideErrorPanel: function () {
      this.errorPrint = false;
      this.showingOverlay = false;
      this.errorReason = "";
      this.errorParagraph = "";
    },
  },
  async mounted() {
    try {
      if (this.user) {
        this.showingOverlay = true;
        this.loading = true;
        const result = await axios.get(
          serverUrl + "/api/books/stats/" + this.user.bookId,
          { withCredentials: true }
        );
        if (result.data.pagesCount % 2 == 1) {
          this.pagesCount = result.data.pagesCount + 1;
        } else {
          this.pagesCount = result.data.pagesCount;
        }
        this.imagesCount = result.data.imagesCount;
        this.storiesCount = result.data.storiesCount;
        this.showingOverlay = false;
        this.loading = false;
      }
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser;
    },
  },
};
</script>

<style>
.main-section-container {
  padding: 70px;
  background: #ffffff;
  border: 1px solid rgba(6, 42, 32, 0.2);
  box-sizing: border-box;
  border-radius: 22px;
  display: flex;
}

.confirm-impression-btn {
  background: #e1504b;
  width: 100%;
  padding: 20px 0px;
  font-family: PT-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  text-transform: uppercase;
  border: none;

  /* white/white */
  color: #ffffff;
}

.confirm-impression-btn.disabled {
  background: #bebebe;
  cursor: not-allowed;
}

.left-side-print {
  margin-right: 53px;
}

.right-side-print {
  width: 293px;
}

.print-confirm-btn {
  text-align: center;
}

.print-confirm-btn-mobile {
  display: none;
  margin-bottom: 14px;
}

.print-paragraph {
  font-family: galaxie-polaris;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  color: #062a20;
}

.print-image {
  height: 324px;
  width: 213px;
}

.book-stats-container {
  font-weight: 500;
  font-size: 16px;
  color: #062a20;
  margin-bottom: 52px;
}

.route-title-container {
  display: none;
}

.print-section-container {
  height: 100%;
}

@media screen and (max-width: 1024px) {
  .print-section-container {
    height: auto;
  }
  .main-section-container {
    padding: 30px 20px;

    flex-direction: column;
  }
  .left-side-print {
    margin-right: 0px;
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .right-side-print {
    width: 100%;
  }
  .print-confirm-btn-mobile {
    display: block;
  }
  .print-confirm-btn {
    display: none;
  }
  .confirm-impression-btn {
    font-size: 14px;
    padding: 15px 0px;
  }
  .print-paragraph {
    font-size: 14px;
    line-height: 19px;
    display: inline-block;
    max-width: 500px;
  }
  .print-image {
    width: 173px;
    height: 264px;
  }

  .book-stats-container {
    font-weight: 500;
    font-size: 14px;
    color: #062a20;
  }

  .route-title-container {
    display: block;
    font-size: 20px;
    font-weight: 500;
  }
  .book-stats-container {
    margin-bottom: 18px;
  }
}
</style>