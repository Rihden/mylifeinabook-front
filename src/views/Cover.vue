<template>
  <div class="d-row site-background">
    <navbar></navbar>
    <div class="container">
      <div
        class="route-section"
        style="position: relative"
        v-show="!showingMobilePreview"
      >
        <div class="route-title-container">
          <span class="route-title title-section">Cover</span>
        </div>
        <!-- template -->
        <div class="cover-step-container">
          <div class="cover-step-title">1. Select a template</div>
          <div
            class="cover-step-content templates-section-container"
            :class="{ expanded: isTemplateSectionExpanded }"
          >
            <div class="templates-container d-row">
              <div
                v-for="style in styles"
                :key="style.index"
                class="template-container ptr"
                @click="setStyle(style.index)"
                :class="{
                  selected: currentCover.selectedStyleIndex == style.index,
                }"
              >
                <img
                  :src="'/cover-style' + style.index + '.png'"
                  alt=""
                  class="cover-template-image"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- information -->
        <div class="cover-step-container cover-data-input">
          <div class="cover-step-title">2. Content</div>
          <div class="cover-step-content">
            <div>
              <div class="cover-form-section">
                <input
                  v-model="currentCover.front.title"
                  placeholder="Title"
                  @change="generatePdf()"
                  class="cover-input"
                />
              </div>
              <div class="cover-form-section">
                <input
                  class="cover-input"
                  type="text"
                  placeholder="Author's name"
                  v-model="currentCover.front.subtitle"
                  @change="generatePdf()"
                />
              </div>
            </div>
            <!-- <div v-if="!isEditingFront">
              <div class="cover-form-section">
                <input
                  class="cover-input"
                  type="text"
                  placeholder="Description"
                  v-model="currentCover.back.description"
                  @change="generatePdf()"
                />
              </div>
            </div> -->
          </div>
        </div>
        <!-- image -->
        <div class="cover-step-container cover-data-input">
          <div class="canvas-container">
            <canvas ref="imageCanvas"></canvas>
          </div>
          <div class="cover-step-title">3. Picture</div>
          <div class="cover-step-content image-selection-section">
            <div
              class="
                story-form-section
                image-selection-container
                d-flex-centered d-col
              "
            >
              <div
                style="
                  position: absolute;
                  right: 18px;
                  top: 17px;
                  height: 16px;
                  width: 16px;
                "
                class="ptr"
                v-if="
                  (currentCover.front.imageData && isEditingFront) ||
                  (currentCover.back.imageData && !isEditingFront)
                "
                @click="deleteCoverImage()"
              >
                <img src="../assets/trash.svg" alt="" />
              </div>
              <input
                class="visually-hidden"
                type="file"
                name=""
                ref="imageInput"
                @change="encodeImageFileAsURL()"
              />
              <div
                style="margin-bottom: 8px"
                class="ptr"
                @click="activateFileSelection()"
              >
                <div v-if="isEditingFront">
                  <img
                    v-if="currentCover.front.imageData"
                    :src="currentCover.front.imageData"
                    style="border-radius: 10px"
                    alt=""
                    class="image-preview-form"
                  />
                  <img
                    v-else
                    src="../assets/plus.svg"
                    alt=""
                    class="plus-sign-form"
                  />
                </div>
                <div v-if="!isEditingFront">
                  <img
                    v-if="currentCover.back.imageData"
                    :src="currentCover.back.imageData"
                    style="border-radius: 10px"
                    alt=""
                    class="image-preview-form"
                  />
                  <img
                    v-else
                    src="../assets/plus.svg"
                    alt=""
                    class="plus-sign-form"
                  />
                </div>
              </div>
              <div style="width: 100%; text-align: center">
                <div
                  v-if="isEditingFront"
                  class="cover-image-selection-span form-image-preview-text"
                >
                  <span
                    v-if="currentCover.front.imageFileName"
                    style="
                      overflow: hidden;
                      display: inline-block;
                      max-width: 90%;
                    "
                    >{{ currentCover.front.imageFileName.substr(0, 30)
                    }}<span v-if="currentCover.front.imageFileName.length > 30"
                      >...</span
                    >
                  </span>

                  <span v-else>Upload an image</span>
                </div>
                <div
                  v-if="!isEditingFront"
                  class="cover-image-selection-span form-image-preview-text"
                >
                  <span
                    v-if="currentCover.back.imageFileName"
                    style="
                      overflow: hidden;
                      display: inline-block;
                      max-width: 90%;
                    "
                    >{{ currentCover.back.imageFileName.substr(0, 30)
                    }}<span v-if="currentCover.back.imageFileName.length > 30"
                      >...</span
                    >
                  </span>
                  <span v-else>Upload an image</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- mobile section -->
        <div class="cover-input-data-section-mobile">
          <!-- cover side switching  -->
          <div class="cover-side-btn-mobile-container">
            <div
              class="cover-side-btn-mobile d-row ptr"
              :class="{ active: isEditingFront }"
              @click="switchToFrontCover()"
            >
              <span>Front</span>
            </div>
            <div
              class="cover-side-btn-mobile d-row ptr"
              :class="{ active: !isEditingFront }"
              @click="switchToBackCover()"
            >
              <span>Back</span>
            </div>
          </div>
          <!-- image -->
          <div class="cover-step-container">
            <div class="canvas-container">
              <canvas ref="imageCanvas"></canvas>
            </div>
            <div class="cover-step-title">Picture</div>
            <div class="cover-step-content image-selection-section">
              <div
                class="
                  story-form-section
                  image-selection-container
                  d-flex-centered d-col
                "
              >
                <input
                  class="visually-hidden"
                  type="file"
                  name=""
                  ref="imageInput"
                  @change="encodeImageFileAsURL()"
                />
                <div
                  style="margin-bottom: 8px"
                  class="ptr"
                  @click="activateFileSelection()"
                >
                  <div v-if="isEditingFront">
                    <img
                      v-if="currentCover.front.imageData"
                      :src="currentCover.front.imageData"
                      style="border-radius: 10px"
                      alt=""
                      class="image-preview-form"
                    />
                    <img
                      v-else
                      src="../assets/plus.svg"
                      alt=""
                      class="plus-sign-form"
                    />
                  </div>
                  <div v-if="!isEditingFront">
                    <img
                      v-if="currentCover.back.imageData"
                      :src="currentCover.back.imageData"
                      style="border-radius: 10px"
                      alt=""
                      class="image-preview-form"
                    />
                    <img
                      v-else
                      src="../assets/plus.svg"
                      alt=""
                      class="plus-sign-form"
                    />
                  </div>
                </div>
                <div style="width: 100%; text-align: center">
                  <div
                    v-if="isEditingFront"
                    class="cover-image-selection-span form-image-preview-text"
                  >
                    <span
                      v-if="currentCover.front.imageFileName"
                      style="
                        overflow: hidden;
                        display: inline-block;
                        max-width: 90%;
                      "
                      >{{ currentCover.front.imageFileName.substr(0, 30)
                      }}<span
                        v-if="currentCover.front.imageFileName.length > 30"
                        >...</span
                      >
                    </span>

                    <span v-else>Upload an image</span>
                  </div>
                  <div
                    v-if="!isEditingFront"
                    class="cover-image-selection-span form-image-preview-text"
                  >
                    <span
                      v-if="currentCover.back.imageFileName"
                      style="
                        overflow: hidden;
                        display: inline-block;
                        max-width: 90%;
                      "
                      >{{ currentCover.back.imageFileName.substr(0, 30)
                      }}<span v-if="currentCover.back.imageFileName.length > 30"
                        >...</span
                      >
                    </span>
                    <span v-else>Upload an image</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- information -->
          <div class="cover-step-container last">
            <div class="cover-step-title">Information</div>
            <div class="cover-step-content">
              <div>
                <div class="cover-form-section">
                  <input
                    v-model="currentCover.front.title"
                    placeholder="Title"
                    @change="generatePdf()"
                    class="cover-input"
                  />
                </div>
                <div class="cover-form-section">
                  <input
                    class="cover-input"
                    type="text"
                    placeholder="Author's Name"
                    v-model="currentCover.front.subtitle"
                    @change="generatePdf()"
                  />
                </div>
              </div>
              <!-- <div v-if="!isEditingFront">
                <div class="cover-form-section">
                  <input
                    class="cover-input"
                    type="text"
                    placeholder="Description"
                    v-model="currentCover.back.description"
                    @change="generatePdf()"
                  />
                </div>
              </div> -->
            </div>
          </div>
        </div>

        <div class="cover-step-container last-section-cover">
          <div style="margin-bottom: 4px">
            <button class="save-cover-btn" @click="showPreviewSection()">
              Preview
            </button>
          </div>
          <div
            style="
              display: flex;
              font-size: 12px;
              margin-top: 8px;
              font-family: mont;
            "
            class="saved-message"
          >
            <div style="" v-if="loading">
              <div
                class="lds-dual-ring small"
                style="height: 12px; width: 12px; margin-right: 10px"
              ></div>
              <span class="tabs-span">Saving...</span>
            </div>
            <div
              style="margin-right: 15px"
              v-if="!loading && !coverSavingError"
            >
              <img
                src="../assets/check-red.svg"
                alt=""
                height="12px"
                width="12px"
                style="margin-right: 3px"
              />
              <span class="tabs-span" style="color: #062a20">Saved</span>
            </div>
            <div style="margin-right: 15px" v-if="!loading && coverSavingError">
              <img
                src="../assets/clear.png"
                alt=""
                height="14px"
                width="14px"
                style="margin-right: 10px"
              />
              <span class="tabs-span">An error occured</span>
            </div>
          </div>
        </div>
        <!-- preview section -->
        <div v-if="!pdfFile" class="preview-section preview-overlay"></div>
        <div class="preview-section">
          <!--<button @click="reloadPage()" class="retry">
            Click here if you didn't see the template
          </button> -->
          <div
            class="d-row"
            style="justify-content: space-between; margin-bottom: 25px"
          >
            <span
              style="
                font-weight: 500;
                font-size: 18px;
                line-height: 19px;
                color: #062a20;
              "
              >Preview:</span
            >
            <div
              style="
                font-weight: normal;
                font-size: 16px;
                line-height: 17px;
                color: #062a20;
              "
            >
              <span v-if="isEditingFront">Front</span>
              <span v-else>Back</span>
            </div>
          </div>
          <div style="margin-bottom: 32px">
            <span :ref="'pdfComponentDesktop'"
              ><pdf :src="pdfFile" v-if="pdfFile" class="pdf-preview"></pdf
            ></span>

            <div v-if="!pdfFile" class="d-flex-centered pdf-preview">
              <div style="height: 80px; width: 80px">
                <div class="lds-dual-ring"></div>
              </div>
            </div>
          </div>

          <div
            class="d-row"
            style="
              justify-content: space-between;
              align-items: center;
              margin-bottom: 7px;
            "
          >
            <div class="d-row">
              <div
                @click="switchToFrontCover()"
                class="cover-switch-button d-flex-centered"
                style="margin-right: 12px"
                :class="{ disabled: isEditingFront }"
              >
                <img src="../assets/angle-left-white.svg" alt="" />
              </div>
              <div
                @click="switchToBackCover()"
                class="cover-switch-button d-flex-centered"
                :class="{ disabled: !isEditingFront }"
              >
                <img src="../assets/angle-right-white.svg" alt="" />
              </div>
            </div>
          </div>
          <div
            style="display: flex; flex-direction: row-reverse; font-size: 12px"
          >
            <div style="margin-right: 15px" v-if="loading">
              <div
                class="lds-dual-ring small"
                style="height: 12px; width: 12px; margin-right: 10px"
              ></div>
              <span class="tabs-span">Saving...</span>
            </div>
            <div
              style="margin-right: 15px"
              v-if="!loading && !coverSavingError"
            >
              <img
                src="../assets/check-red.svg"
                alt=""
                height="12px"
                width="12px"
                style="margin-right: 3px"
              />
              <span class="tabs-span" style="color: #062a20">Saved</span>
            </div>
            <div style="margin-right: 15px" v-if="!loading && coverSavingError">
              <img
                src="../assets/clear.png"
                alt=""
                height="14px"
                width="14px"
                style="margin-right: 10px"
              />
              <span class="tabs-span">An error occured</span>
            </div>
          </div>
        </div>
      </div>
      <div class="route-section" :class="{ hidden: !showingMobilePreview }">
        <div class="d-row" style="align-items: center; margin-bottom: 12px">
          <div @click="hidePreviewSection()" class="ptr">
            <img
              src="../assets/back-arrow.svg"
              class="story-form-top-button"
              alt=""
            />
          </div>
          <div style="margin-left: 18px">
            <span class="route-title form-question">Back</span>
          </div>
        </div>
        <div class="d-flex-centered">
          <!--<button @click="reloadPage()" class="retry-mobile">
            Click here if you didn't see the template
          </button>-->
        </div>
        <div
          class="d-row"
          style="justify-content: space-between; margin-bottom: 25px"
        >
          <span
            style="
              font-weight: 500;
              font-size: 18px;
              line-height: 19px;
              color: #062a20;
            "
            >Preview:</span
          >
          <div
            style="
              font-weight: normal;
              font-size: 16px;
              line-height: 17px;
              color: #062a20;
            "
          >
            <span v-if="isEditingFront">Front</span>
            <span v-else>Back</span>
          </div>
        </div>
        <div style="margin-bottom: 16px">
          <span :ref="'pdfComponent'"
            ><pdf :src="pdfFile" v-show="pdfFile" class="pdf-preview"></pdf
          ></span>
          <div v-if="!pdfFile" class="d-flex-centered pdf-preview">
            <div style="height: 150px; width: 150px">
              <div class="lds-dual-ring"></div>
            </div>
          </div>
        </div>

        <div class="last-section-preview d-row">
          <div class="d-row">
            <div
              @click="switchToFrontCover()"
              class="cover-switch-button d-flex-centered"
              style="margin-right: 12px"
              :class="{ disabled: isEditingFront }"
            >
              <img src="../assets/angle-left-white.svg" alt="" />
            </div>
            <div
              @click="switchToBackCover()"
              class="cover-switch-button d-flex-centered"
              :class="{ disabled: !isEditingFront }"
            >
              <img src="../assets/angle-right-white.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { generateCover } from "../pdfCover"
import { downloadPdf } from "../downloadPdf"
import axios from "axios"
import { serverUrl } from "../severUrl"
import pdf from "vue-pdf"
import navbar from "../components/navbar.vue"

export default {
  components: {
    pdf,
    navbar,
  },
  data() {
    return {
      isTemplateSectionExpanded: false,
      pdfFile: null,
      coverSavingError: false,
      loading: false,
      isEditingFront: true,
      styles: [],
      currentCover: {
        selectedStyleIndex: 0,
        front: {
          title: "",
          subtitle: "",
          imageData: "",
          imageFileName: "",
        },
        back: {
          description: "",
          imageData: "",
          imageFileName: "",
        },
      },
      showingMobilePreview: false,
    }
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser
    },
  },
  methods: {
    hidePreviewSection: function () {
      this.showingMobilePreview = false
    },
    showPreviewSection: function () {
      this.showingMobilePreview = true
    },
    getBook: async function () {
      try {
        const result = await axios.get(
          serverUrl + "/api/books/" + this.user.bookId,
          { withCredentials: true }
        )
        const book = result.data
        this.book = book
        //change into  = book.cover.content;
        //set the current variable cover data to the fetched data
        this.currentCover.front = JSON.parse(
          JSON.stringify(this.book.cover.content.front)
        )

        this.currentCover.back = JSON.parse(
          JSON.stringify(this.book.cover.content.back)
        )
        this.currentCover.selectedStyleIndex = book.cover.templateId
      } catch (error) {
        console.log(error.message)
        console.log("didn't get book")
      }
    },
    /* reloadPage: function () {
      this.$router.go(this.$router.currentRoute)
    },*/
    generatePdf: async function () {
      try {
        this.pdfFile = null
        this.pdfFile = await generateCover(
          this.currentCover,
          this.isEditingFront,
          this.currentStyle
        )
        this.$nextTick(async () => {
          await this.saveCoverData()
          const x = this.$refs.myframe
          var y = x?.contentWindow || x?.contentDocument
          if (y?.document) y = y?.document
        })
      } catch (error) {
        console.log(error)
      }
    },
    activateFileSelection: function () {
      const fileInput = this.$refs["imageInput"]
      console.log(fileInput)
      if (fileInput) {
        fileInput.click()
      }
    },
    encodeImageFileAsURL: function () {
      const file = this.$refs["imageInput"].files[0]
      let reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          let image = new Image()
          image.src = reader.result
          image.onload = () => {
            // have to wait till it's loaded
            const canvas = this.$refs.imageCanvas
            const { height, width } = image
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext("2d")
            ctx.drawImage(image, 0, 0, width, height)
            const imageData = canvas.toDataURL("image/jpeg", 0.7)
            this.setImageData(imageData)
            if (this.isEditingFront) {
              this.currentCover.front.imageFileName = file.name
            } else {
              this.currentCover.back.imageFileName = file.name
            }
          }
        } else {
          alert("Selection Failed, please try again.")
        }
      }
      const pattern = /image-*/

      if (!file.type.match(pattern)) {
        alert("Invalid file Format. Please select an image.")
        return
      }

      const filesize = (file.size / 1024 / 1024).toFixed(4) // MB

      if (
        file.name != "item" &&
        typeof file.name != "undefined" &&
        filesize > 15
      ) {
        alert("Image cannot be larger than 15MB.")
        return
      }
      reader.readAsDataURL(file)
    },
    setImageData: function (dataString) {
      if (this.isEditingFront) {
        this.currentCover.front.imageData = dataString
      } else {
        this.currentCover.back.imageData = dataString
      }
      this.generatePdf()
    },
    deleteCoverImage: async function () {
      try {
        this.loading = true
        const response = await axios.put(
          serverUrl + "/api/books/delete-cover-image",
          {
            bookId: this.book._id,
            deletingFront: this.isEditingFront,
          },
          { withCredentials: true }
        )
        if (response.status == 200) {
          if (this.isEditingFront) {
            this.currentCover.front.imageData = ""
            this.currentCover.front.imageFileName = ""
          } else {
            this.currentCover.back.imageData = ""
            this.currentCover.back.imageFileName = ""
          }
          this.loading = false
          this.generatePdf()
        }
      } catch (error) {
        console.log(error)
        this.loading = false
        this.coverSavingError = true
      }
    },
    switchToBackCover: async function () {
      if (this.isEditingFront) {
        this.isEditingFront = false
        // Load user's previous data for the back cover
        // this.options = user.preferences.styles[styleIndex].options.backcoverOptions

        this.generatePdf()
      }
    },
    switchToFrontCover: async function () {
      if (!this.isEditingFront) {
        this.isEditingFront = true
        // Load user's previous data for the front cover

        this.generatePdf()
      }
    },
    encodeImageArrayBuffer: function () {
      const file = this.$refs["imageInput"].files[0]
      let reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          this.setImageData(reader.result)
          console.log(reader.result)
        } else {
          alert("Selection Failed, please try again.")
        }
      }
      reader.readAsArrayBuffer(file)
    },
    downloadPdfFile: function () {
      downloadPdf(this.pdfFile, "Downloaded from Racontenous app.pdf")
    },
    saveCoverData: async function () {
      try {
        const cover = {
          content: {
            front: this.currentCover.front,
            back: this.currentCover.back,
          },
          selectedStyle: this.currentCover.selectedStyleIndex,
        }
        // compare the objects and return if no changnes were made
        if (
          JSON.stringify(this.book.cover.content) ===
            JSON.stringify(cover.content) &&
          cover.selectedStyle == this.book.cover.templateId
        ) {
          return
        }
        const data = {
          cover,
          bookId: this.book._id,
        }

        this.loading = true
        this.coverSavingError = false
        const response = await axios.put(serverUrl + "/api/books/cover", data, {
          withCredentials: true,
        })
        this.book.cover.content = JSON.parse(JSON.stringify(cover.content))
        this.book.cover.templateId = cover.selectedStyle
        this.loading = false
        this.$emit("saveCover", response.data.hasCover)
      } catch (error) {
        console.log(error)
        this.loading = false
        this.coverSavingError = true
      }
    },
    setStyle: async function (index) {
      try {
        if (this.currentCover.selectedStyleIndex != index) {
          this.currentCover.selectedStyleIndex = index
          this.pdfFile = null
          const styleIndex = this.styles?.find((style) => style.index === index)
          const response = await axios.get(
            serverUrl + "/api/cover-styles/" + styleIndex?._id,
            { withCredentials: true }
          )
          this.currentStyle = response?.data
          this.generatePdf()
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  // async beforeRouteEnter(to, from, next) {
  //   try {
  //     const response = await axios.get(serverUrl + "/auth/checkUser/", {
  //       withCredentials: true,
  //     });
  //     next((vm) => {
  //       // access to component instance via `vm`
  //       console.log("DEBUG - setting user");
  //       vm.$store.commit("setUser", response.data);
  //       //save user data
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     next((vm) => {
  //       // access to component instance via `vm`
  //       if (error.response.status == 401) {
  //         vm.$router.replace("/login");
  //       }
  //       //save user data
  //     });
  //   }
  // },
  async mounted() {
    try {
      const result = await axios.get(serverUrl + "/api/cover-styles")
      this.styles = result.data
      await this.getBook()
      const styleIndex = this.styles?.find(
        (style) => style.index === this.currentCover.selectedStyleIndex
      )

      const resultStyle = await axios.get(
        serverUrl + "/api/cover-styles/" + styleIndex._id,
        { withCredentials: true }
      )
      this.currentStyle = resultStyle.data
      this.generatePdf()
    } catch (error) {
      console.log(error)
    }
  },
}
</script>

<style scoped>
.cover-step-title {
  font-weight: 500;
  font-size: 18px;
  line-height: 19px;
  color: #062a20;
  margin-bottom: 21px;
  font-family: galaxie-polaris;
}
.cover-step-container {
  margin-bottom: 33px;
}
.cover-step-content {
  margin-left: 34px;
}

.template-container {
  margin-right: 12px;
  height: 213px;
}

.cover-input {
  padding: 15px 20px 18px 20px;
  font-size: 16px;
  line-height: 24px;
  border: 1px solid rgba(6, 42, 32, 0.2);
  font-family: galaxie-polaris;
  outline: none;
  color: #14473c;
  height: 62px;
  width: 368px;
  box-sizing: border-box;
}
.cover-form-section {
  margin-bottom: 8px;
}

.pdf-preview {
  width: 100%;
  height: 573px;
}

.retry {
  background: #e1504b;
  cursor: pointer;
  border: none;
  font-weight: 500;
  font-size: 18.8px;
  margin-bottom: 10px;
  line-height: 17px;
  color: white;
  padding: 18px;
}
.retry-mobile {
  background: #e1504b;
  cursor: pointer;
  border: none;
  font-weight: 500;
  font-size: 13px;
  line-height: 14px;
  color: white;
  padding: 6px;
  margin: auto;
  text-align: center;
  margin-bottom: 10px;
}
.cover-switch-button {
  height: 38px;
  width: 38px;
  border-radius: 50%;
  background: #14473c;
}

.cover-switch-button:hover {
  cursor: pointer;
}

.cover-switch-button.disabled {
  background: rgba(6, 42, 32, 0.2);
}

.cover-switch-button.disabled:hover {
  cursor: not-allowed;
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
.cover-image-selection-span {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
}

.main-section-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.5s ease-in-out;
  -webkit-transition: 0.5s ease-in-out;
  -moz-transition: 0.5s ease-in-out;
  -o-transition: 0.5s ease-in-out;
}
.templates-button-img {
  transition: 0.3s ease-in-out;
  -webkit-transition: 0.3s ease-in-out;
  -moz-transition: 0.3s ease-in-out;
  -o-transition: 0.3s ease-in-out;
  transform: rotate(270deg);
  -webkit-transform: rotate(270deg);
  -moz-transform: rotate(270deg);
  -o-transform: rotate(270deg);
}

.reversed {
  transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -o-transform: rotate(90deg);
}

.translated {
  transform: translateX(15vw);
  -webkit-transform: translateX(15vw);
  -moz-transform: translateX(15vw);
  -o-transform: translateX(15vw);
}

.selected {
  border: 1px solid black;
}

.preview-section {
  position: absolute;
  right: 0px;
  top: 0;
  height: 100%;
  padding: 50px 58px 33px 61px;
  width: 484px;
  background: white;
  border-radius: 0px 30px 30px 0px;
}

.preview-overlay {
  background: #00000000;
  z-index: 500;
}

.cover-template-image {
  width: 148px;
  height: 211px;
}
.image-selection-section {
  width: 368px;
  background: white;
  border-radius: 18px;
}

.last-section-cover {
  display: none;
}

.cover-input-data-section-mobile {
  display: none;
}

.route-section.hidden {
  overflow: scroll;
  opacity: 0;
  height: 1px;
  width: 1px;
  position: absolute;
  top: -2000px;
}

.templates-container {
  width: calc(100% - 484px);
  overflow-x: auto;
  padding-bottom: 12px;
}

@media screen and (max-width: 1024px) {
  .route-title-container {
    font-size: 22px;
    margin-top: 8px;
  }

  .preview-section {
    display: none;
  }
  .cover-step-title {
    font-size: 16px;
    margin-bottom: 15px;
    margin-top: 15px;
  }
  .cover-step-content {
    margin-left: 0px;
  }
  .template-container {
    height: 143px;
  }
  .cover-template-image {
    width: 99px;
    height: 141px;
  }
  .cover-step-container {
    margin-bottom: 23px;
  }
  .cover-input {
    width: 100%;
  }
  .cover-step-content.image-selection-section {
    width: 100%;
  }
  .story-form-section.image-selection-container {
    height: 85px;
  }
  .save-cover-btn {
    width: 100%;
    padding: 15px 10px;
    height: auto;
    font-size: 14px;
    border-radius: 50px;
    gap: 10px;
    margin-top: 10px;
  }
  .last-section-cover {
    display: block;
  }
  .pdf-preview {
    max-width: 328px;
    max-height: 515px;
    margin: 0 auto;
  }
  .last-section-preview {
    justify-content: center;
    align-items: center;
    margin-bottom: 7px;
  }
  .cover-step-container.cover-data-input {
    display: none;
  }
  .cover-input-data-section-mobile {
    display: block;
    background: white;
    padding: 29px 22px;
    border: 1px solid rgba(6, 42, 32, 0.2);
    border-radius: 40px;
    margin-bottom: 15px;
  }
  .cover-step-container.last {
    margin-bottom: 0px;
  }
  .cover-side-btn-mobile-container {
    display: flex;
    justify-content: space-between;
  }
  .cover-side-btn-mobile {
    background: rgba(6, 42, 32, 0.2);
    border-radius: 40px;
    font-family: galaxie-polaris;
    font-weight: 400;
    color: white;
    font-size: 12px;
    line-height: 13px;
    width: 48%;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cover-side-btn-mobile.active {
    background: #14473c;
  }
  .route-section.hidden {
    opacity: 0;
    height: 1px;
    width: 1px;
    position: absolute;
    top: -2000px;
  }
  .desktop-navbar {
    display: none;
  }
  .templates-container {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 12px;
  }
  .saved-message {
    justify-content: center;
  }
}
</style>
