<template>
  <div class="d-row site-background admin">
    <div class="overlay" v-if="showingOverlay">
      <div class="pop-up d-flex-centered d-col" v-if="isDeletingUser">
        <div class="pop-up-title">
          <span>Confirmation</span>
        </div>
        <div class="pop-up-paragraph">
          <span>Voulez-vous supprimer l'utilisateur ?</span>
        </div>
        <div class="pop-up-buttons-container">
          <button
            class="pop-up-btn confirm-admin"
            @click="deleteUser(deletingUser)"
          >
            OUI
          </button>
          <button class="pop-up-btn" @click="cancelDeletingUser()">NON</button>
        </div>
      </div>
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <navbar admin="true"></navbar>
    <div class="container">
      <div class="route-section">
        <div style="margin-left: 12px">
          <div
            class="d-row"
            style="
              justify-content: space-between;
              margin-top: 21px;
              align-items: center;
            "
          >
            <div class="d-row">
              <div
                class="panel-tab-btn"
                :class="{ active: panelIndex == 0 }"
                @click="panelIndex = 0"
              >
                Pending printing
              </div>
              <div
                class="panel-tab-btn"
                :class="{ active: panelIndex == 1 }"
                @click="panelIndex = 1"
              >
                Printing in progress
              </div>
              <div
                class="panel-tab-btn"
                :class="{ active: panelIndex == 2 }"
                @click="panelIndex = 2"
              >
                Book in progress
              </div>
              <div
                class="panel-tab-btn"
                :class="{ active: panelIndex == 3 }"
                @click="panelIndex = 3"
              >
                Printing done
              </div>
            </div>
            <div
              class="download-all-btn d-flex-centered ptr"
              @click="downloadAudit()"
            >
              <span style="display: inline-block; margin-right: 12px"
                >DOWNLOAD ALL</span
              >
              <img src="../assets/download-icon.svg" alt="" />
            </div>
          </div>
          <div
            style="
              margin-top: 18px;
              background: #ffffff;
              border: 1px solid rgba(6, 42, 32, 0.2);
              box-sizing: border-box;
              border-radius: 30px;
              height: 650px;
              overflow-y: auto;
              padding: 40px 27px;
            "
          >
            <div class="d-row table-title-row">
              <div class="table-title-element">Order</div>
              <div class="table-title-element">E-mail</div>
              <div class="table-title-element">Adress</div>
              <div class="table-title-element" style="flex-grow: 1">
                Confirmed on
              </div>
              <div class="table-title-element">Quantity</div>
              <div class="table-title-element">Delete</div>
              <div class="table-title-element">Files</div>
              <div class="table-title-element">Status</div>
            </div>
            <div
              v-for="(user, userIndex) in filteredUsersData"
              :key="userIndex"
            >
              <div class="d-row table-row">
                <div class="table-title-element">
                  <span v-if="user.orderNumber">
                    {{ user.orderNumber }}
                  </span>
                  <span v-else> Test account </span>
                </div>
                <div class="table-title-element">
                  <span>
                    {{ user.email }}
                  </span>
                </div>
                <div class="table-title-element">
                  <div class="tooltip" v-if="user.streetLine1">
                    Adress here
                    <span class="tooltiptext">
                      {{ user.adressName }}<br />
                      {{ user.streetLine1 }}<br />
                      {{ user.country }}<br />
                      {{ user.city }}<br />
                      {{ user.zipCode }}<br />
                      {{ user.state }}</span
                    >
                  </div>
                </div>
                <div class="table-title-element" style="flex-grow: 1">
                  <span v-if="user.printDate"
                    >{{ new Date(user.printDate).getDate() }}/{{
                      new Date(user.printDate).getMonth() + 1
                    }}/{{ new Date(user.printDate).getFullYear() }}
                    {{
                      new Date(user.printDate).toTimeString().substring(0, 8)
                    }}
                  </span>
                  <span v-else> N/A </span>
                </div>
                <div class="table-title-element">
                  <span v-if="user.quantity">{{ user.quantity }}</span>
                  <span v-else>{{ user.quantity }}</span>
                </div>
                <div class="table-title-element">
                  <div
                    class="download-all-btn d-flex-centered ptr"
                    @click="startDeletingUser(user._id)"
                  >
                    <span style="display: inline-block; margin-right: 12px"
                      >DELETE</span
                    >
                    <img src="../assets/trash.svg" alt="" />
                  </div>
                </div>
                <div class="table-title-element">
                  <div
                    class="download-all-btn d-flex-centered ptr"
                    @click="downloadUserFiles(user._id)"
                  >
                    <span style="display: inline-block; margin-right: 12px"
                      >DOWNLOAD</span
                    >
                    <img src="../assets/download-icon.svg" alt="" />
                  </div>
                </div>
                <div class="table-title-element">
                  <div
                    class="download-all-btn d-flex-centered ptr"
                    v-if="panelIndex == 0"
                    @click="updateStatus(user, 'printing')"
                  >
                    <span>START Printing</span>
                  </div>
                  <div
                    class="download-all-btn d-flex-centered ptr"
                    v-if="panelIndex == 1"
                    @click="updateStatus(user, 'done')"
                  >
                    <span>FINISH Printing</span>
                  </div>
                  <span v-if="panelIndex == 2"> Writing </span>
                  <span v-if="panelIndex == 3"> Done </span>
                </div>
              </div>
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
import axios from "axios"
export default {
  components: {
    navbar,
  },
  data() {
    return {
      panelIndex: 0,
      usersData: [],
      showingOverlay: false,
      loading: false,
      deletingUserId: "",
      isDeletingUser: false,
    }
  },

  methods: {
    cancelDeletingUser: function () {
      this.showingOverlay = false
      this.isDeletingUser = false
      this.deletingUserId = ""
    },
    startDeletingUser: function (id) {
      this.showingOverlay = true
      this.isDeletingUser = true
      this.deletingUserId = id
    },
    deleteUser: async function () {
      try {
        this.showingOverlay = true
        this.loading = true

        await axios.delete(serverUrl + "/api/users/" + this.deletingUserId, {
          withCredentials: true,
        })
        await this.fetchUsersData()
        this.showingOverlay = false
        this.loading = false
      } catch (error) {
        console.log(error)
        this.showingOverlay = false
        this.loading = false
      }
    },
    filterTable: function (index) {
      this.panelIndex = index
    },
    downloadAudit: function () {
      try {
        window.open(serverUrl + "/api/users/audit")
      } catch (error) {
        console.log(error)
      }
    },
    downloadUserFiles: function (id) {
      window.open(serverUrl + "/api/users/files/" + id)
    },
    updateStatus: async function (user, newStatus) {
      console.log(user.printStatus)
      try {
        const response = await axios.put(
          serverUrl + "/api/users/update-status",
          { status: newStatus, id: user._id },
          { withCredentials: true }
        )
        if (response.status == 200) {
          user.printStatus = newStatus
        }
        console.log(response.status)
      } catch (error) {
        console.log(error)
        alert(
          "An error occured while updating user " +
            user.orderId +
            "Please refresh the page and try again"
        )
      }
    },
    fetchUsersData: async function () {
      try {
        this.loading = true
        this.showingOverlay = true
        const response = await axios.get(serverUrl + "/api/users", {
          withCredentials: true,
        })
        this.usersData = response.data
        this.loading = false
        this.showingOverlay = false
      } catch (error) {
        console.log(error)
        this.loading = false
        this.showingOverlay = false
      }
    },
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser
    },
    filteredUsersData: function () {
      return this.usersData.filter((user) => {
        if (this.panelIndex == 0) {
          return user.printStatus == "pending"
        }
        if (this.panelIndex == 1) {
          return user.printStatus == "printing"
        }
        if (this.panelIndex == 2) {
          return user.printStatus == "writing"
        }
        if (this.panelIndex == 3) {
          return user.printStatus == "done"
        }
      })
    },
  },
  async created() {
    try {
      await this.fetchUsersData()
    } catch (error) {
      console.log(error)
    }
  },
}
</script>

<style>
.site-background.admin {
  background: #e1504b;
}
.panel-tab-btn {
  border-radius: 40px;
  padding: 20px 23px;
  color: rgba(6, 42, 32, 0.4);
  font-size: 18px;
  line-height: 27px;
  font-weight: 300;
  margin-right: 10px;
}
.panel-tab-btn:hover {
  cursor: pointer;
}
.panel-tab-btn.active {
  background: #e1504b;
  color: white;
  font-weight: 500;
}
.download-all-btn {
  font-family: PT-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: white;
  width: 168px;
  height: 44px;
  background: #e1504b;
  border-radius: 40px;
}

.table-title-row {
  margin-bottom: 25px;
}
.table-title-element {
  margin-right: 50px;
  text-align: center;
  width: 150px;
  font-size: 16px;
  line-height: 17px;
  color: #14473c;
}
.table-row {
  margin-bottom: 8px;
  background: #ffffff;
  border: 1px solid rgba(6, 42, 32, 0.1);
  box-sizing: border-box;
  border-radius: 18px;
  height: 94px;
  align-items: center;
}
.table-select {
  border: 1px solid rgba(6, 42, 32, 0.1);
  box-sizing: border-box;
  border-radius: 40px;
  width: 134px;
  height: 44px;
  background: white;
  padding: 0px 10px;
  font-family: galaxie-polaris;
  font-weight: 300;
}

.table-select-option {
  width: 134px;
  height: 44px;
  background: white;
  padding: 10px 10px;
  font-family: galaxie-polaris;
  font-weight: 300;
}
.confirm-admin {
  background: #e1504b;
  color: white;
  margin-right: 30px;
  border: none;
}
.tooltip {
  position: relative;
  display: inline-block;
  font-size: 11px;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 15px 10px;
  font-size: 13px;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
