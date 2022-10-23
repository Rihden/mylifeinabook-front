<template>
  <div
    class="d-row site-background"
    :class="{ hidebuttonmobilemenu: !displaymenubutton }"
  >
    <div class="overlay" v-if="showingOverlay">
      <div class="pop-up d-flex-centered d-col" v-if="isDeletingStory">
        <div class="pop-up-title">
          <span>Delete story</span>
        </div>
        <div class="pop-up-paragraph">
          <span
            >Are you sure you want to delete this story and all its
            contents?</span
          >
        </div>
        <div class="pop-up-buttons-container">
          <button class="pop-up-btn confirm" @click="deleteStory()">YES</button>
          <button class="pop-up-btn" @click="cancelDeletingStory()">NO</button>
        </div>
      </div>
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <div class="overlay mobile" v-if="showingaddQuestionOverlay">
      <div class="pop-up d-flex-centered d-col" v-if="isAddingNewQuestion">
        <div class="pop-up-title" style="font-size: 18px; margin-bottom: 8px">
          <span>Add your own question</span>
        </div>
        <div class="pop-up-paragraph" style="width: 100%; margin-bottom: 8px">
          <textarea
            rows="4"
            style="box-sizing: border-box"
            class="question-title-textarea"
            v-model="tempQuestionTitle"
            placeholder="Enter your new question"
            ref="newQuestionInputMobile"
          />
        </div>
        <div class="pop-up-buttons-container">
          <button
            class="pop-up-btn confirm"
            @click="confirmNewStory()"
            style="
              border-radius: 60px;
              padding: 13px 44px;
              text-transform: uppercase;
            "
          >
            Add new question
          </button>
          <button
            class="pop-up-btn"
            @click="cancelNewStory()"
            style="
              border-radius: 60px;
              padding: 13px 44px;
              text-transform: uppercase;
            "
          >
            Cancel
          </button>
        </div>
      </div>
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <div class="overlay mobile" v-if="showingEditQuestionOverlay">
      <div class="pop-up d-flex-centered d-col" v-if="isEditingNewQuestion">
        <div class="pop-up-title" style="font-size: 18px; margin-bottom: 8px">
          <span>Edit your question</span>
        </div>
        <div class="pop-up-paragraph" style="width: 100%; margin-bottom: 8px">
          <textarea
            rows="4"
            style="box-sizing: border-box"
            class="question-title-textarea"
            v-model="selectedChapter.stories[keyStoriesForEdit].tempTitle"
            v-if="selectedChapter.stories[keyStoriesForEdit].editingTitle"
            :placeholder="selectedChapter.stories[keyStoriesForEdit].question"
            :ref="'title' + selectedChapterIndex + '-' + keyStoriesForEdit"
          />
        </div>
        <div class="pop-up-buttons-container">
          <button
            class="pop-up-btn confirm"
            @click="confirmEditingStory(keyStoriesForEdit)"
            style="
              border-radius: 60px;
              padding: 13px 44px;
              text-transform: uppercase;
            "
          >
            Edit question
          </button>
          <button
            class="pop-up-btn"
            @click="cancelEditingStory(keyStoriesForEdit)"
            style="
              border-radius: 60px;
              padding: 13px 44px;
              text-transform: uppercase;
            "
          >
            Cancel
          </button>
        </div>
      </div>
      <div v-if="loading">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
    <div class="overlay" v-if="showingShareOverlay">
      <div class="pop-up d-flex-centered d-col" v-if="confirmingSharing">
        <div class="pop-up-paragraph" style="max-width: 382px">
          <span style="font-weight: 700; font-size: 24px"
            >This story and all its content will be shared with your recipients
          </span>
        </div>
        <div class="pop-up-buttons-container">
          <button
            class="pop-up-btn confirm"
            @click="confirmShared()"
            style="margin-right: 12px"
          >
            CONFIRM
          </button>
          <button class="pop-up-btn" @click="cancelShared()">BACK</button>
        </div>
      </div>
      <div class="pop-up d-flex-centered d-col" v-if="errorSharing">
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
      <div class="route-section chapters">
        <div
          class="drag-scroll-arrow up"
          v-if="showDragUpArrow"
          @dragover="dropFix($event)"
        ></div>
        <div
          class="drag-scroll-arrow down"
          v-if="showDragDownArrow"
          @dragover="dropFix($event)"
        ></div>
        <!-- chapters section -->
        <div v-if="showingChapters" ref="chapters_section_container_scrollable">
          <div class="route-title-container">
            <span class="route-title">Questions</span>
          </div>
        </div>
        <!-- stories section -->
        <h1 v-if="!showingForm" class="desktop title-section">Questions</h1>
        <h1 class="mobile title-section">Questions</h1>

        <div
          v-if="showingStories"
          class="questions-section-container"
          ref="questions_section_container_scrollable"
          style=""
        >
          <div class="questions-section-container-header">
            <div
              class="d-row"
              style="justify-content: space-between; padding-right: 7px"
            >
              <div class="d-row tab-btn-row tab-mobile">
                <button
                  class="tab-btn"
                  :class="{
                    active: !pastQuestion,
                  }"
                  @click="
                    selectedChapter.isShowingAnswered = false
                    selectedPaginationIndex = 1
                    pastQuestion = false
                  "
                >
                  Upcoming questions
                </button>
                <button
                  class="tab-btn"
                  :class="{
                    active: pastQuestion,
                  }"
                  @click="
                    pastQuestion = true
                    cancelNewStory()
                  "
                >
                  Past questions
                </button>
              </div>
              <div class="d-row search-secion">
                <div class="d-flex-centered" style="height: 30px">
                  <input
                    :class="{ hidden: !filteringStories }"
                    type="text"
                    v-model="storiesFilterText"
                    @input="filterStories()"
                    class="question-search-input"
                    placeholder="Search questions..."
                  />
                  <img
                    @click="toggleFiltering()"
                    class="ptr"
                    src="../assets/search.svg"
                    alt=""
                    height="16px"
                    width="16px"
                  />
                </div>
              </div>
            </div>
            <div class="questions-container" @dragover="dropFix($event)">
              <!-- add question section -->
              <div
                v-if="
                  !isAddingQuestion &&
                  !selectedChapter.isShowingAnswered &&
                  !pastQuestion
                "
                class="add-question-container d-flex-centered ptr"
                style=""
                @click="startAddingStory()"
              >
                <div class="">
                  <img src="../assets/union.svg" alt="" class="plus-sign" />
                </div>
                <div class="add-question-text">Add a question...</div>
              </div>
              <div
                class="empty-section"
                v-if="selectedQuestionSent == 0 && pastQuestion"
                style=""
              >
                <div class="empty-story-message">
                  Questions that have already been emailed, but not answered,<br />will
                  be displayed here.
                </div>
              </div>

              <!-- adding question section -->
              <div
                v-if="isAddingQuestion && !selectedChapter.isShowingAnswered"
                class="d-row question-head adding-question desktop"
                style="border: 1px solid #e1504b"
              >
                <div class="d-row" style="flex-grow: 1; margin-right: 8px">
                  <input
                    rows="1"
                    style="height: 27px; box-sizing: border-box"
                    class="question-title-input desktop"
                    v-model="tempQuestionTitle"
                    placeholder="Type your question here..."
                    @keypress.enter="confirmNewStory()"
                    ref="newQuestionInput"
                  />
                </div>
                <div class="d-row editing-buttons-container">
                  <div
                    class="question-control ptr"
                    @click="confirmNewStory()"
                    style="margin-right: 12px"
                  >
                    <img
                      src="../assets/confirm.svg"
                      alt=""
                      height="36px"
                      width="36px"
                      class="question-control"
                    />
                  </div>
                  <div class="question-control ptr" @click="cancelNewStory()">
                    <img
                      src="../assets/cancel.svg"
                      alt=""
                      height="36px"
                      width="36px"
                      class="question-control"
                    />
                  </div>
                </div>
              </div>
              <div>
                <draggable
                  @start="startDraggingQuestion"
                  @end="stopDraggingQuestion"
                  :move="switchPlacesQuestion"
                  :list="paginationInterval"
                  delay-on-touch-only="true"
                  delay="100"
                >
                  <div
                    v-for="(keyStories, indexQuestion) in paginationInterval"
                    :key="indexQuestion"
                    id="infinite-list"
                  >
                    <div
                      v-if="
                        (pastQuestion &&
                          selectedChapter.stories[keyStories].notifSent) ||
                        (!pastQuestion &&
                          !selectedChapter.stories[keyStories].notifSent)
                      "
                      class="question-head"
                      :class="{
                        dragging: keyStories == draggingIndexQuestions,
                      }"
                      @click="showStoryForm($event, keyStories)"
                    >
                      <div
                        v-if="!pastQuestion"
                        class="drag-container question-control"
                      ></div>
                      <div
                        class="d-row question-title-container"
                        style="flex-grow: 1; margin-right: 8px"
                      >
                        <div style="width: 100%">
                          <div
                            class="sent-date"
                            v-if="displayDate && !pastQuestion"
                          >
                            {{ selectedChapter.stories[keyStories].sentDate }}
                          </div>

                          <span
                            class="question-title"
                            v-if="
                              !selectedChapter.stories[keyStories].editingTitle
                            "
                          >
                            {{ selectedChapter.stories[keyStories].question }}
                          </span>
                          <input
                            rows="1"
                            style="height: 27px; box-sizing: border-box"
                            class="question-title-input"
                            v-model="
                              selectedChapter.stories[keyStories].tempTitle
                            "
                            v-if="
                              selectedChapter.stories[keyStories].editingTitle
                            "
                            :placeholder="
                              selectedChapter.stories[keyStories].question
                            "
                            :ref="
                              'title' + selectedChapterIndex + '-' + keyStories
                            "
                            @keypress.enter="confirmEditingStory(keyStories)"
                          />
                          <div
                            style="z-index: 10"
                            class="
                              question-control
                              mobile
                              question-control-delete
                            "
                            @click="startDeletingStory(keyStories)"
                            v-if="
                              !selectedChapter.stories[keyStories].editingTitle
                            "
                          >
                            Delete
                            <img
                              src="../assets/trash.svg"
                              alt=""
                              height="14px"
                              width="14px"
                              class="question-control"
                              style="vertical-align: middle"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        class="d-row"
                        style="position: relative; align-items: center"
                      >
                        <div
                          class="question-control question-control-pencil"
                          v-if="
                            !selectedChapter.stories[keyStories].editingTitle
                          "
                          @click="startEditingStoryTitle(keyStories)"
                        >
                          <img
                            src="../assets/pencil.svg"
                            class="question-control question-control-image"
                            style="vertical-align: middle"
                          />
                        </div>
                        <div
                          class="question-control"
                          @click="confirmEditingStory(keyStories)"
                          v-if="
                            selectedChapter.stories[keyStories].editingTitle
                          "
                          style="margin-right: 19px"
                        >
                          <img
                            src="../assets/confirm.svg"
                            alt=""
                            height="30px"
                            width="30px"
                            class="question-control"
                          />
                        </div>
                        <div
                          class="question-control"
                          @click="cancelEditingStory(keyStories)"
                          v-if="
                            selectedChapter.stories[keyStories].editingTitle
                          "
                          style="margin-right: 24px"
                        >
                          <img
                            src="../assets/cancel.svg"
                            alt=""
                            height="30px"
                            width="30px"
                            class="question-control"
                          />
                        </div>
                        <div
                          class="question-control desktop"
                          @click="startDeletingStory(keyStories)"
                          v-if="
                            !selectedChapter.stories[keyStories].editingTitle
                          "
                          style="margin-right: 25px; height: 26px"
                        >
                          <img
                            src="../assets/trash.svg"
                            alt=""
                            height="18px"
                            width="18px"
                            class="question-control"
                            style="vertical-align: middle"
                          />
                        </div>
                        <div class="open-question-button">
                          <img
                            src="../assets/angle-right.svg"
                            alt=""
                            class="open-question-image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </div>
            </div>
          </div>
        </div>
        <!-- form section -->
        <div v-if="showingForm" class="form-response-question">
          <div class="canvas-container">
            <canvas ref="imageCanvas"></canvas>
          </div>

          <div class="d-row" style="justify-content: space-between">
            <div class="d-row" style="align-items: center">
              <div @click="hideStoryForm()" class="ptr angle-container">
                <img
                  src="../assets/angle-left-red.svg"
                  class="story-form-top-button-left"
                  alt=""
                />
              </div>
              <div style="margin-left: 18px">
                <span class="route-title form-question">Back</span>
              </div>
            </div>
            <div class="d-row" style="align-items: center">
              <div style="margin-right: 18px">
                <span class="route-title form-question">Next</span>
              </div>
              <div
                @click="
                  if (SelectedStoryIndex + 1 < selectedChapter.stories.length) {
                    showStoryForm($event, SelectedStoryIndex + 1, {
                      noClick: true,
                    })
                  }
                "
                class="ptr angle-container"
                :class="{
                  'not-allowed':
                    SelectedStoryIndex + 1 >= selectedChapter.stories.length,
                }"
              >
                <img
                  src="../assets/angle-right-red.svg"
                  class="story-form-top-button"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div class="story-form-container">
            <div style="width: 100%">
              <div class="story-form-section d-flex-centered²">
                <div class="info-icon-container">
                  <div class="tooltip">
                    <img
                      src="../assets/info.svg"
                      alt="info"
                      width="16px"
                      height="16px"
                    />
                    <span class="tooltiptext">
                      This is the question, it won't appear in the book.
                    </span>
                  </div>
                </div>
                <textarea
                  type="text"
                  name=""
                  id=""
                  v-model="selectedStory.question"
                  placeholder="Question"
                  class="chapter-title-input story-form-textarea"
                  @blur="saveAnswer(selectedChapterIndex, SelectedStoryIndex)"
                />
              </div>
            </div>
            <div class="d-row" style="flex-wrap: wrap">
              <div class="left-side-story-form">
                <div class="story-form-section title" style="">
                  <div class="info-icon-container">
                    <div class="tooltip">
                      <img
                        src="../assets/info.svg"
                        alt="info"
                        width="16px"
                        height="16px"
                      />
                      <span class="tooltiptext">
                        This the header that will appear in the book.
                      </span>
                    </div>
                  </div>
                  <input
                    type="text"
                    name=""
                    id=""
                    v-model="selectedStory.title"
                    placeholder="Enter your story title here, this will show up in the book."
                    class="chapter-title-input story-form-input"
                    @blur="saveAnswer(selectedChapterIndex, SelectedStoryIndex)"
                  />
                </div>
                <div class="story-form-section story">
                  <textarea
                    v-model="selectedStory.textContent"
                    @focus="focusedOnStory = true"
                    @blur="
                      focusedOnStory = false
                      saveAnswer(selectedChapterIndex, SelectedStoryIndex)
                    "
                    rows="9"
                    placeholder="Write your story here.."
                    class="chapter-title-input story-form-textarea story-answer"
                    :class="{ focused: focusedOnStory }"
                  />
                </div>
              </div>
              <div class="right-side-story-form">
                <div
                  class="
                    story-form-section
                    image-selection-container
                    d-flex-centered d-col
                  "
                  style="padding-right: 22px"
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
                    v-if="selectedStory.imageBase64"
                    @click="deleteStoryImage()"
                  >
                    <img src="../assets/trash.svg" alt="" />
                  </div>
                  <input
                    class="visually-hidden"
                    type="file"
                    name=""
                    :ref="
                      'Image' +
                      SelectedStoryIndex +
                      'Q' +
                      selectedChapterIndex +
                      'C'
                    "
                    @change="
                      encodeImageFileAsURL(
                        selectedChapterIndex,
                        SelectedStoryIndex
                      )
                    "
                  />
                  <div
                    class="add-icon-container"
                    @click="
                      activateFileSelection(
                        selectedChapterIndex,
                        SelectedStoryIndex
                      )
                    "
                    v-if="!loadingImageUpload"
                  >
                    <img
                      v-if="selectedStory.imageBase64"
                      :src="selectedStory.imageBase64"
                      alt=""
                      class="image-preview-form"
                    />
                    <img
                      v-else
                      src="../assets/plus.svg"
                      class="plus-sign-form"
                      alt=""
                    />
                  </div>
                  <div v-else class="add-icon-container">
                    <div class="lds-dual-ring image-form"></div>
                  </div>

                  <div class="form-image-preview-text">
                    <span
                      class="story-image-selection-span"
                      v-if="!selectedStory.imageBase64"
                      >Upload a picture</span
                    >
                    <span
                      v-else
                      style="
                        overflow: hidden;
                        display: inline-block;
                        max-width: 90%;
                      "
                      >{{ selectedStory.imageFileName.substr(0, 30)
                      }}<span v-if="selectedStory.imageFileName.length > 30"
                        >...</span
                      >
                    </span>
                  </div>
                </div>
                <div class="story-form-section legend">
                  <textarea
                    type="text"
                    name=""
                    id=""
                    v-model="selectedStory.imageCaption"
                    maxlength="65"
                    @blur="saveAnswer(selectedChapterIndex, SelectedStoryIndex)"
                    placeholder="Write a caption for your image here.."
                    class="chapter-title-input story-form-textarea image-legend"
                  />
                  <div
                    style="
                      position: absolute;
                      bottom: 10px;
                      right: 10px;
                      font-size: 12px;
                      color: #ccc;
                    "
                  >
                    {{ selectedStory.imageCaption.length }}/65
                  </div>
                </div>
              </div>
            </div>
            <div class="form-submit-container d-row d-flex-spaced">
              <div class="d-flex-centered save-state-container">
                <div style="margin-right: 15px" v-if="loadingForm">
                  <div
                    class="lds-dual-ring small"
                    style="height: 12px; width: 12px; margin-right: 20px"
                  ></div>
                  <span class="tabs-span">Saving...</span>
                </div>

                <div
                  style="margin-right: 15px"
                  v-if="!loadingForm && !formSavingError"
                  class="d-row"
                >
                  <img
                    src="../assets/check-red.svg"
                    alt=""
                    height="16px"
                    width="16px"
                    style="margin-right: 10px"
                  />
                  <div class="tabs-span">Saved</div>
                </div>

                <div
                  style="margin-right: 15px"
                  v-if="!loadingForm && formSavingError"
                >
                  <img
                    src="../assets/clear.png"
                    alt=""
                    height="16px"
                    width="16px"
                    style="margin-right: 10px"
                  />
                  <span class="tabs-span">An error occured</span>
                </div>
              </div>
              <div
                v-if="
                  user.isBuyer === 0 || (user.isBuyer === 1 && user.guest != 1)
                "
                class="shared-container"
              >
                <button
                  class="shared-btn"
                  :class="{ shared: selectedStory.shared }"
                  :disabled="selectedStory.shared === true"
                  @click="startConfirmingShared()"
                >
                  {{ selectedStory.shared ? "shared" : "Share my story" }}
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
import axios from "axios"
import { serverUrl } from "../severUrl"
import { calculateStoryPages } from "../pdfUtils"
import navbar from "../components/navbar.vue"
import dayjs from "dayjs"
import isToday from "dayjs/plugin/isToday"
import infiniteScroll from "vue-infinite-scroll"
import Vue from "vue"
import VueMobileDetection from "vue-mobile-detection"
import Vue2TouchEvents from "vue2-touch-events"
import draggable from "vuedraggable"

Vue.use(Vue2TouchEvents)

Vue.use(VueMobileDetection)
Vue.use(infiniteScroll)
dayjs.extend(isToday)
export default {
  components: {
    navbar,
    draggable,
  },
  data() {
    return {
      loading: false,
      loadingForm: false,
      formSavingError: false,
      deletingChapterId: null,
      isDeletingChapter: false,
      isDeletingStory: false,
      showingOverlay: false,
      showingShareOverlay: false,
      showingStories: true,
      showingChapters: true,
      showingForm: false,
      isAddingChapter: false,
      isAddingQuestion: false,
      tempChapterTitle: "",
      tempQuestionTitle: "",
      editingTitleIndex: -1,
      selectedChapterIndex: 0,
      selectedChapter: {},
      backupStories: [],
      SelectedStoryIndex: 0,
      selectedStory: null,
      focusedOnStory: false,
      autosaveInterval: null,
      previousFormData: "",
      selectedPaginationIndex: 1,
      loadingImageUpload: false,
      tempSelectedPaginationIndex: 1,
      storiesFilterText: "",
      filteringStories: false,
      dragging: false,
      showDragUpArrow: false,
      showDragDownArrow: false,
      draggingIndexQuestions: -1,
      draggingIndexChapters: -1,
      editingSelectedChapter: false,
      selectedChapterTempTitle: "",
      confirmingSharing: false,
      errorSharing: false,
      defaultQuestion: "",
      defaultChapter: "",
      questionID: "",
      mailFrequence: 2,
      lastQuestionsent: "",
      displayDate: false,
      firstDateTosend: "",
      nextDateTosend: "",
      pastQuestion: "",
      busy: false,
      showingaddQuestionOverlay: false,
      firstDraggingIndexQuestion: "",
      isAddingNewQuestion: false,
      displaymenubutton: true,
      showingEditQuestionOverlay: false,
      isEditingNewQuestion: false,
      keyStoriesForEdit: 0,
      delayedDragging: false,
      listUpcomingQuestion: [],
      ListPastQuestion: [],
      startDraggingStorie: {},
      finshDragginStorie: {},
    }
  },
  methods: {
    loadMore: function ({ target: { scrollTop, clientHeight, scrollHeight } }) {
      // this.displaymenubutton = scrollTop < 30
      if (scrollTop + clientHeight + 55 >= scrollHeight) {
        this.busy = true

        if (this.selectedPaginationIndex < this.paginationsCount) {
          this.selectedPaginationIndex = this.selectedPaginationIndex + 1
          this.tempSelectedPaginationIndex = this.selectedPaginationIndex
        }
      }
    },
    updateDragArrowState: function () {
      let containerRef = null
      if (this.showingStories) {
        containerRef = this.$refs.questions_section_container_scrollable
      }
      if (this.showingChapters) {
        containerRef = this.$refs.chapters_section_container_scrollable
      }
      if (!containerRef) {
        return false
      }
      const scrollTop = containerRef.scrollTop
      const scrollHeight = containerRef.scrollHeight
      const clientHeight = containerRef.clientHeight
      const scrollOffsetPercent = Number(
        (scrollTop / (scrollHeight - clientHeight)).toFixed(1)
      )

      if (this.dragging && scrollOffsetPercent > 0.02) {
        this.showDragUpArrow = true
      } else {
        this.showDragUpArrow = false
      }
      if (this.dragging && scrollOffsetPercent < 0.98) {
        this.showDragDownArrow = true
      } else {
        this.showDragDownArrow = false
      }
    },
    startDraggingQuestion: function ({ oldIndex }) {
      this.startDraggingStorie = this.selectedChapter.stories[oldIndex]
      this.draggingIndexQuestions = oldIndex
      this.dragging = true
      this.updateDragArrowState()
    },
    switchPlacesQuestion: function ({ relatedContext }) {
      this.finshDragginStorie =
        this.selectedChapter.stories[relatedContext?.index]
    },
    stopDraggingQuestion: async function () {
      await axios
        .put(
          serverUrl + "/api/chapters/update-question-order",
          {
            chapterId: this.selectedChapter._id,
            startStory: this.startDraggingStorie._id,
            newindexStory: this.finshDragginStorie._id,
          },
          { withCredentials: true }
        )
        .then(async () => {
          await this.selectChapter(null, 0, {
            noClick: true,
          })
        })
        .catch((err) => console.log(err))
      this.dragging = false
      this.draggingIndexQuestions = -1
      this.showDragUpArrow = false
      this.showDragDownArrow = false
    },
    startDraggingChapters: function (keyChapter) {
      this.draggingIndexChapters = keyChapter
      this.dragging = true
      this.updateDragArrowState()
    },
    switchPlacesChapters: function (keyChapter) {
      const newIndex = keyChapter
      const oldIndex = this.draggingIndexChapters

      if (newIndex != oldIndex) {
        const aux = this.chapters[oldIndex]
        this.chapters.splice(oldIndex, 1)
        this.chapters.splice(newIndex, 0, aux)
        this.draggingIndexChapters = newIndex
      }
    },
    stopDraggingChapters: async function () {
      const newIndex = this.draggingIndexChapters

      axios
        .put(
          serverUrl + "/api/books/update-chapter-order",
          {
            chapterId: this.chapters[newIndex]._id,
            bookId: this.book._id,
            newIndex,
          },
          { withCredentials: true }
        )
        .then(() => {})
        .catch((err) => console.log(err))
      this.dragging = false
      this.draggingIndexChapters = -1
      this.showDragUpArrow = false
      this.showDragDownArrow = false
    },
    dropFix: function (e) {
      e.preventDefault()
    },
    testsmth: function (e) {
      console.log(e)
      // const questionHeads = [
      //   ...document.getElementsByClassName("question-head"),
      // ];
      // console.log(questionHeads);
    },
    filterStories: function () {
      this.selectedChapter.stories = this.backupStories.filter(
        (story) =>
          story.question
            .toLowerCase()
            .indexOf(this.storiesFilterText.toLowerCase()) > -1
      )
    },
    toggleFiltering: function () {
      this.filteringStories = !this.filteringStories
      if (!this.filteringStories) {
        this.storiesFilterText = ""
        this.filterStories()
      }
    },

    //chapters
    cancelEditing: function (id) {
      const updatedChapter = this.chapters[id]
      updatedChapter.tempTitle = ""
      this.$store.commit("updateChapter", {
        index: id,
        chapter: updatedChapter,
      })
      this.editingTitleIndex = -1
    },
    startAddingChapter: async function () {
      await this.confirmEditing()
      this.isAddingChapter = true
      this.$nextTick(() => {
        this.$refs.newChapterInput.focus()
      })
    },
    confirmEditing: async function () {
      const id = this.editingTitleIndex
      try {
        if (id > -1 && this.chapters[id].title != this.chapters[id].tempTitle) {
          this.chapters[id].title = this.chapters[id].tempTitle
          const confirmedChapter = this.chapters[id]

          const chapterData = {
            _id: confirmedChapter._id,
            bookId: this.user.bookId,
            title: confirmedChapter.title,
            isStandard: confirmedChapter.isStandard,
            isActive: confirmedChapter.isActive,
            isHidingStandardStories: confirmedChapter.isHidingStandardStories,
            order: confirmedChapter.order,
            storiesCount: confirmedChapter.storiesCount,
            answeredStoriesCount: confirmedChapter.answeredStoriesCount,
            pagesCount: confirmedChapter.pagesCount,
            answeredStories: confirmedChapter.answeredStories,
          }

          this.loading = true
          this.showingOverlay = true

          const result2 = await axios.put(
            serverUrl + "/api/chapters/",
            chapterData,
            { withCredentials: true }
          )
          if (result2.status != 200) {
            console.log(result2.status)
          }
        }
        this.editingTitleIndex = -1
        this.loading = false
        this.showingOverlay = false
      } catch (error) {
        this.editingTitleIndex = -1
        this.loading = false
        this.showingOverlay = false
        console.log(error)
      }
    },
    confirmNewChapter: async function () {
      try {
        const ChapterData = {
          title: this.tempChapterTitle,
          isStandard: false,
          isActive: true,
          isHidingStandardStories: true,
          order: this.chapters.length,
          storiesCount: 0,
          answeredStoriesCount: 0,
          pagesCount: 0,
          bookId: this.user.bookId,
        }
        this.loading = true
        this.showingOverlay = true
        const result = await axios.post(
          serverUrl + "/api/chapters/",
          ChapterData,
          { withCredentials: true }
        )

        if (result.status == 201) {
          const newChapter = result.data
          newChapter.tempTitle = ""
          newChapter.isShowingAnswered = false
          this.$store.commit("addChapter", newChapter)
          this.loading = false
          this.showingOverlay = false
          this.tempChapterTitle = ""
          this.isAddingChapter = false
        }
        if (result.status != 201) {
          console.log(result.status)
          this.loading = false
          this.showingOverlay = false
          alert(
            "Error while adding the chapter. Please reload the page and try again."
          )
        }
      } catch (error) {
        this.loading = false
        this.showingOverlay = false
        console.log(error)
      }
      // await this.fillUserChapters(this.user.bookId);
    },
    cancelNewChapter: function () {
      this.tempChapterTitle = ""
      this.isAddingChapter = false
    },
    startEditingTitle: async function (id) {
      await this.confirmEditing()
      this.chapters[id].tempTitle = this.chapters[id].title
      this.editingTitleIndex = id
      const refName = "title" + id
      this.cancelNewChapter()
      this.$nextTick(() => {
        this.$refs[refName][0].focus()
      })
    },
    toggleActiveChapter: async function (id) {
      try {
        this.chapters[id].isActive = !this.chapters[id].isActive

        //if got deactivated cancel editing its title
        if (this.chapters[id].isActive == false) {
          this.cancelEditing(id)
        }
        const toggledChapter = this.chapters[id]
        const chapterData = {
          _id: toggledChapter._id,
          bookId: this.user.bookId,
          title: toggledChapter.title,
          isStandard: toggledChapter.isStandard,
          isActive: toggledChapter.isActive,
          isHidingStandardStories: toggledChapter.isHidingStandardStories,
          order: toggledChapter.order,
          storiesCount: toggledChapter.storiesCount,
          answeredStoriesCount: toggledChapter.answeredStoriesCount,
          pagesCount: toggledChapter.pagesCount,
        }
        this.loading = true
        this.showingOverlay = true
        await axios.put(serverUrl + "/api/chapters/", chapterData, {
          withCredentials: true,
        })
        this.loading = false
        this.showingOverlay = false
      } catch (error) {
        console.log(error)
        this.loading = false
        this.showingOverlay = false
      }
    },
    startDeletingChapter: function (id) {
      this.deletingChapterId = id
      this.showingOverlay = true
      this.isDeletingChapter = true
    },
    deleteChapter: async function () {
      try {
        const chapter = this.chapters[this.deletingChapterId]
        this.isDeletingChapter = false
        this.loading = true

        const result = await axios.delete(
          serverUrl + "/api/chapters/" + chapter._id,
          { withCredentials: true }
        )
        if (result.status == 200) {
          this.chapters.splice(this.deletingChapterId, 1)
          this.showingOverlay = false
          this.loading = false
        }
        if (result.status != 200) {
          console.log(result.data)
        }
      } catch (error) {
        console.log(error)
        this.showingOverlay = false
        this.loading = false
      }
    },
    selectChapter: async function (event, id, options) {
      this.nextDateTosend = this.user.lastQuestionsent
        ? this.user.lastQuestionsent
        : dayjs().format("MM/DD/YYYY")
      if (
        !(
          (event && event.target.classList.contains("chapter-control")) ||
          this.editingTitleIndex == id
        ) ||
        (options && options.noClick)
      ) {
        try {
          this.showingOverlay = true
          this.loading = true
          const result = await axios.get(
            serverUrl +
              "/api/chapters/" +
              this.chapters[0]?._id +
              "?populated=stories",
            { withCredentials: true }
          )
          if (result.status == 200) {
            const chapter = result.data
            chapter.tempTitle = ""
            chapter.isShowingAnswered = false
            chapter.stories.forEach((story, storyIndex) => {
              if (!story.notifSent && !story.isAnswered) {
                if (storyIndex === 0) {
                  story.sentDate = this.getNexDateQuestion(true)
                } else {
                  story.sentDate = this.getNexDateQuestion()
                }
              }

              story.editingTitle = false
              story.tempTitle = ""
              chapter.stories[storyIndex] = story
            })
            this.selectedChapter = JSON.parse(JSON.stringify(chapter))
            // SORT BY ORDER ATTRIBUTE
            this.selectedChapter.stories = this.selectedChapter.stories?.filter(
              (story) => !story.isAnswered
            )
            this.listUpcomingQuestion = this.selectedChapter.stories?.filter(
              (story) => !story.notifSent && !story.isAnswered
            )
            this.ListPastQuestion = this.selectedChapter.stories?.filter(
              (story) => story.notifSent && !story.isAnswered
            )
            this.backupStories = this.selectedChapter.stories
            this.selectedChapterIndex = id
            this.showingOverlay = false
            this.loading = false
            this.showingStories = true
            this.showingChapters = false
          }
        } catch (error) {
          this.showingOverlay = false
          this.loading = false
          console.log(error)
        }
      }
    },

    //stories
    toggleHidingStandard: function () {
      this.selectedChapter.isHidingStandardStories =
        !this.selectedChapter.isHidingStandardStories
      this.selectedPaginationIndex = 0
    },
    startEditingSelectedChapter: function () {
      this.selectedChapter.tempTitle = this.selectedChapter.title

      this.editingSelectedChapter = true
      this.$nextTick(() => {
        this.$refs.selectedChapterTitleInput.focus()
      })
    },
    confirmEditingSelectedChapter: async function () {
      if (this.selectedChapter.title != this.selectedChapter.tempTitle) {
        this.selectedChapter.title = this.selectedChapter.tempTitle
        const confirmedChapter = this.selectedChapter

        const chapterData = {
          _id: confirmedChapter._id,
          bookId: this.user.bookId,
          title: confirmedChapter.title,
          isStandard: confirmedChapter.isStandard,
          isActive: confirmedChapter.isActive,
          isHidingStandardStories: confirmedChapter.isHidingStandardStories,
          order: confirmedChapter.order,
          storiesCount: confirmedChapter.storiesCount,
          answeredStoriesCount: confirmedChapter.answeredStoriesCount,
          pagesCount: confirmedChapter.pagesCount,
          answeredStories: confirmedChapter.answeredStories,
        }
        this.editingSelectedChapter = false
        axios
          .put(serverUrl + "/api/chapters/", chapterData, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.status != 200) {
              console.log(response.status)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    startEditingStoryTitle: function (keyStories) {
      this.keyStoriesForEdit = keyStories
      this.editingSelectedChapter = false
      this.selectedChapter.tempTitle = ""
      this.selectedChapter.stories.forEach((question, index) => {
        if (question.editingTitle == true) {
          this.confirmEditingStory(index)
        }
      })
      this.selectedChapter.stories[keyStories].tempTitle =
        this.selectedChapter.stories[keyStories].question
      this.selectedChapter.stories[keyStories].editingTitle = true
      this.isEditingNewQuestion = true
      this.showingEditQuestionOverlay = true

      this.cancelNewStory()
      const refName = "title" + this.selectedChapterIndex + "-" + keyStories
      this.cancelNewChapter()
      this.$nextTick(() => {
        this.$refs[refName][0]?.focus()
      })
    },
    confirmEditingStory: async function (keyStories) {
      try {
        const { question, tempTitle } = this.selectedChapter.stories[keyStories]
        if (question != tempTitle) {
          this.loading = true
          this.showingOverlay = true
          this.isEditingNewQuestion = false

          const result = await axios.get(
            serverUrl +
              "/api/stories/" +
              this.selectedChapter.stories[keyStories]._id
          )
          const story = result.data
          story.question = tempTitle
          const result2 = await axios.put(serverUrl + "/api/stories/", story, {
            withCredentials: true,
          })
          if (result2.status == 200) {
            this.selectedChapter.stories[keyStories].question = tempTitle
            this.loading = false
            this.showingOverlay = false
          }
          this.showingEditQuestionOverlay = false
          this.isEditingNewQuestion = false
        }
      } catch (error) {
        this.showingEditQuestionOverlay = false
        this.loading = false
        this.showingOverlay = false
        console.log(error)
      }
    },
    cancelEditingStory: function (keyStories) {
      this.selectedChapter.stories[keyStories].tempTitle = ""
      this.selectedChapter.stories[keyStories].editingTitle = false
      this.showingEditQuestionOverlay = false
      this.isEditingNewQuestion = false
    },
    startAddingStory: function () {
      this.selectedChapter?.stories?.forEach((question, index) => {
        if (question?.editingTitle == true) {
          this.confirmEditingStory(index)
        }
      })
      this.isAddingNewQuestion = true
      this.showingaddQuestionOverlay = true
      this.isAddingQuestion = true
      this.$nextTick(() => {
        this.$refs.newQuestionInput.focus()
      })
    },
    confirmNewStory: async function () {
      try {
        this.isAddingNewQuestion = false
        this.loading = true
        this.showingOverlay = true

        const newStory = {
          bookId: this.book._id,
          chapterId: this.selectedChapter._id,
          question: this.tempQuestionTitle,
          title: "",
          isAnswered: false,
          isStandard: false,
          order: 0,
          textContent: "",
          imageCaption: "",
          imageFileNameServer: "",
          imageFileName: "",
          lastUpdated: new Date(),
          pagesCount: 0,
        }
        const result = await axios.post(serverUrl + "/api/stories/", newStory, {
          withCredentials: true,
        })
        this.isAddingQuestion = false
        this.showingaddQuestionOverlay = false

        this.loading = false
        this.showingOverlay = false

        if (result.status == 200) {
          newStory._id = result.data._id
          newStory.editingTitle = false
          newStory.tempTitle = ""
          this.selectedChapter.storiesCount++
          this.selectedChapter.stories.push(newStory)
          await this.selectChapter(null, 0, {
            noClick: true,
          })
        } else {
          console.log(result.data)
        }

        this.tempQuestionTitle = ""
      } catch (error) {
        this.loading = false
        this.showingOverlay = false
        this.showingaddQuestionOverlay = false
        this.tempQuestionTitle = ""
        this.isAddingQuestion = false
        console.log(error)
      }
    },
    startDeletingStory: function (Qid) {
      this.deletingStoryId = Qid
      this.showingOverlay = true
      this.isDeletingStory = true
    },
    deleteStory: async function () {
      try {
        const story = this.selectedChapter.stories[this.deletingStoryId]
        this.isDeletingStory = false
        this.loading = true

        const result = await axios.delete(
          serverUrl + "/api/stories/" + story._id,
          { withCredentials: true }
        )
        if (result.status == 200) {
          await this.selectChapter(null, 0, {
            noClick: true,
          })
        }

        this.selectedPaginationIndex = 1
        this.showingOverlay = false
        this.loading = false

        if (result.status != 200) {
          console.log(result.data)
        }
      } catch (error) {
        this.showingOverlay = false
        this.loading = false
        console.log(error)
      }
    },
    cancelDeletingStory: function () {
      this.isDeletingStory = false
      this.deletingStoryId = null
      this.showingOverlay = false
    },
    cancelNewStory: function () {
      this.tempQuestionTitle = ""
      this.isAddingQuestion = false
      this.showingaddQuestionOverlay = false
    },
    showChapters: async function () {
      this.defaultQuestion = ""
      this.defaultChapter = ""
      this.editingSelectedChapter = false
      this.selectedChapter.tempTitle = ""
      this.showingOverlay = true
      this.loading = true
      await this.$store.dispatch("fetchPopulatedChapters")
      this.showingOverlay = false
      this.loading = false
      this.selectedPaginationIndex = 0
      this.tempSelectedPaginationIndex = 1
      this.showingStories = false
      this.showingChapters = true
      this.selectedChapterIndex = null
      this.selectedChapter = null
      this.backupStories = []
    },
    showStoryForm: async function (event, keyStories, options) {
      if (
        (!event?.target?.classList?.contains("question-control") &&
          !this?.selectedChapter?.stories[keyStories]?.editingTitle) ||
        (options && options.noClick)
      ) {
        try {
          if (options && options.noClick) {
            this.clearAutoSave()
          }
          this.editingSelectedChapter = false
          this.selectedChapter.tempTitle = ""
          this.showingOverlay = true
          this.loading = true

          const result = await axios.get(
            serverUrl +
              "/api/stories/" +
              this.selectedChapter.stories[keyStories]._id,
            { withCredentials: true }
          )
          if (result.status == 200) {
            const story = result.data
            story.editingTitle = false
            story.tempTitle = ""
            this.selectedStory = JSON.parse(JSON.stringify(story))
            this.SelectedStoryIndex = keyStories
            this.showingForm = true
            this.showingStories = false
            this.showingOverlay = false
            this.loading = false
            this.startAutoSave()
          }
        } catch (error) {
          console.log(error)
          this.showingOverlay = false
          this.loading = false
        }
      }
    },

    //form
    startAutoSave: function () {
      try {
        const story = this.selectedStory

        this.previousFormData = JSON.stringify({
          question: story.question,
          title: story.title,
          textContent: story.textContent,
          caption: story.imageCaption,
        })

        this.autosaveInterval = setInterval(
          this.saveAnswer,
          2000,
          this.selectedChapterIndex,
          this.SelectedStoryIndex
        )
      } catch (error) {
        console.log(error)
        if (this.autosaveInterval) clearInterval(this.autosaveInterval)
      }
    },
    clearAutoSave: function () {
      this.previousFormData = ""
      clearInterval(this.autosaveInterval)
    },
    activateFileSelection: function (cId, qId) {
      const s = "Image" + qId + "Q" + cId + "C"
      const fileInput = this.$refs[s]
      if (fileInput) fileInput.click()
    },
    encodeImageFileAsURL: function (cId, qId) {
      const s = "Image" + qId + "Q" + cId + "C"
      const file = this.$refs[s].files[0]
      let reader = new FileReader()
      reader.onloadend = async () => {
        if (reader.result) {
          const fileSizeMB = file.size / 1024 / 1024
          if (fileSizeMB > 0.1) {
            let image = new Image()
            image.src = reader.result
            image.onload = () => {
              // have to wait till it's loaded
              const canvas = this.$refs.imageCanvas
              const { height, width } = image
              const widthRatio = 900 / width
              const heightRatio = 600 / height
              const chosenRatio =
                widthRatio > heightRatio ? heightRatio : widthRatio

              canvas.width = width * chosenRatio
              canvas.height = height * chosenRatio

              let ctx = canvas.getContext("2d")
              ctx.drawImage(
                image,
                0,
                0,
                width * chosenRatio,
                height * chosenRatio
              )
              let compRatio = 0
              if (fileSizeMB > 1) {
                compRatio = (1 / fileSizeMB).toFixed(1)
              } else {
                compRatio = 1
              }
              console.log(compRatio)
              const imageData = canvas.toDataURL("image/jpeg")
              this.selectedStory.imageBase64 = imageData
              this.selectedStory.imageFileName = file.name
                ?.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            }
          } else {
            this.selectedStory.imageBase64 = reader.result
            this.selectedStory.imageFileName = file.name
              ?.normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          }
          await this.uploadStoryImage()
        } else {
          alert("La sélection du fichier a échoué, veuillez réessayer.")
        }
      }
      const pattern = /image-*/

      if (!file.type.match(pattern)) {
        alert(
          "Format du fichier invalide, veuillez selectionner une image de type JPEG, PNG ou GIF. uploaded file type: " +
            file.type
        )
        return
      }

      const filesize = (file.size / 1024 / 1024).toFixed(4) // MB

      if (
        file.name != "item" &&
        typeof file.name != "undefined" &&
        filesize > 15
      ) {
        alert("La taille de l'image doit être inférieure à 15Mo")
        return
      }
      reader.readAsDataURL(file)
    },
    encodeImageFileAsURLOLD: function (cId, qId) {
      const s = "Image" + qId + "Q" + cId + "C"
      const file = this.$refs[s].files[0]
      let reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          this.selectedStory.imageBase64 = reader.result
          this.selectedStory.imageFileName = file.name
          this.saveAnswer()
        } else {
          alert("La sélection du fichier a échoué, veuillez réessayer.")
        }
      }
      reader.readAsDataURL(file)
    },
    deleteStoryImage: async function () {
      try {
        const story = this.selectedStory
        this.loading = true
        this.showingOverlay = true

        if (story.textContent.length > 0) {
          story.isAnswered = true
          const ornament = await fetch(serverUrl + "/book ornament.jpg").then(
            (res) => res.arrayBuffer()
          )
          story.pagesCount = await calculateStoryPages(story, ornament)
        } else {
          story.isAnswered = false
          story.pagesCount = 0
        }

        const { bookId, chapterId, pagesCount } = story
        const id = story._id
        const response = await axios.put(
          serverUrl + "/api/stories/delete-image",
          {
            id,
            bookId,
            chapterId,
            pagesCount,
          },
          { withCredentials: true }
        )
        if (response.status === 200) {
          this.selectedStory.imageFileNameServer = ""
          this.selectedStory.imageFileName = ""
          this.selectedStory.imageBase64 = ""
        }
        this.loading = false
        this.showingOverlay = false
      } catch (error) {
        console.log(error)
        this.loading = false
        this.showingOverlay = false
      }
    },
    uploadStoryImage: async function () {
      const story = this.selectedStory
      try {
        story.isAnswered = true
        const ornament = await fetch(serverUrl + "/book ornament.jpg").then(
          (res) => res.arrayBuffer()
        )
        story.pagesCount = await calculateStoryPages(story, ornament)

        const {
          _id,
          chapterId,
          imageFileNameServer,
          imageFileName,
          imageBase64,
          pagesCount,
        } = story

        this.loadingImageUpload = true
        const formData = new FormData()
        formData.append("_id", _id)
        formData.append("chapterId", chapterId)
        formData.append("bookId", this.book._id)
        formData.append("imageFileNameServer", imageFileNameServer)
        formData.append("imageFileName", imageFileName)
        formData.append("imageBase64", imageBase64)
        formData.append("pagesCount", pagesCount)

        const result = await axios.put(
          serverUrl + "/api/stories/image",
          formData,

          { maxContentLength: Infinity },
          { maxBodyLength: Infinity },
          { withCredentials: true }
        )
        this.loadingImageUpload = false
        if (result.status == 200) {
          this.selectedStory.imageFileNameServer =
            result.data.imageFileNameServer
        }
      } catch (error) {
        this.loadingImageUpload = false
        alert("Erreur lors du téléchargement de l'image, veuillez réessayer.")
        console.log(error)
      }
    },
    saveAnswer: async function () {
      try {
        const story = this.selectedStory
        story.imageCaption = story.imageCaption.replaceAll("\n", "")

        let currentStoryString = JSON.stringify({
          question: story.question,
          title: story.title,
          textContent: story.textContent,
          caption: story.imageCaption,
        })
        if (currentStoryString != this.previousFormData) {
          story.lastUpdated = new Date()
          this.previousFormData = currentStoryString
          if (story.textContent.length > 0) {
            story.isAnswered = true
            const ornament = await fetch(serverUrl + "/book ornament.jpg").then(
              (res) => res.arrayBuffer()
            )
            story.pagesCount = await calculateStoryPages(story, ornament)
          } else {
            story.isAnswered = false
            story.pagesCount = 0
          }
          const {
            _id,
            chapterId,
            question,
            title,
            isAnswered,
            isStandard,
            order,
            textContent,
            imageCaption,
            lastUpdated,
            pagesCount,
          } = story

          this.loadingForm = true
          this.formSavingError = false

          console.log("updating..")
          const result = await axios.put(
            serverUrl + "/api/stories/",
            {
              _id,
              chapterId,
              bookId: this.book._id,
              title,
              question,
              isAnswered,
              isStandard,
              order,
              textContent,
              imageCaption,
              lastUpdated,
              pagesCount,
            },
            { withCredentials: true }
          )
          if (result.status == 200) {
            const newPagesCount = this.calculatePagesCount()
            this.$store.commit("updatePagesCount", {
              index: this.selectedChapterIndex,
              newPagesCount,
            })
          }

          this.loadingForm = false

          console.log("done..")
        }
      } catch (error) {
        this.loadingForm = false
        this.formSavingError = true
        console.log(error)
      }
    },
    calculatePagesCount: function () {
      const answeredStories = this.selectedChapter.stories.filter(
        (story) => story?.isAnswered
      )
      const pagesCount = answeredStories.reduce((prev, current) => {
        return prev + current.pagesCount
      }, 0)
      if (pagesCount > 0) return pagesCount + 1
      else return pagesCount
    },
    hideStoryForm: async function () {
      this.SelectedStoryIndex = null
      this.selectedStory = null
      this.showingForm = false
      this.clearAutoSave()
      const showingAnswered = this.selectedChapter?.isShowingAnswered
      await this.selectChapter(null, this.selectedChapterIndex, {
        noClick: true,
      })
      this.selectedChapter.isShowingAnswered = showingAnswered
    },

    //pagination handling
    decrementPagination: function () {
      if (this.selectedPaginationIndex > 1) {
        this.selectedPaginationIndex = this.selectedPaginationIndex - 1
        this.tempSelectedPaginationIndex = this.selectedPaginationIndex
      }
    },
    incrementPagination: function () {
      if (this.selectedPaginationIndex < this.paginationsCount) {
        this.selectedPaginationIndex = this.selectedPaginationIndex + 1
        this.tempSelectedPaginationIndex = this.selectedPaginationIndex
      }
    },
    validatePagination: function () {
      if (this.tempSelectedPaginationIndex > this.paginationsCount) {
        this.tempSelectedPaginationIndex = this.paginationsCount
      }
      if (this.tempSelectedPaginationIndex < 1) {
        this.tempSelectedPaginationIndex = 1
      }
    },
    changePagination: function () {
      if (this.tempSelectedPaginationIndex != this.selectedPaginationIndex) {
        this.selectedPaginationIndex = this.tempSelectedPaginationIndex
      } else {
        this.$refs["pagination-input"].focus()
      }
    },
    startConfirmingShared: function () {
      this.confirmingSharing = true
      this.showingShareOverlay = true
    },
    cancelShared: function () {
      this.confirmingSharing = false
      this.showingShareOverlay = false
    },
    confirmShared: async function () {
      try {
        this.confirmingSharing = false
        this.loading = true
        this.showingShareOverlay = true

        this.selectedStory.user = this.user
        this.selectedStory.shared = true
        this.selectedStory.sendMail = true
        const result = await axios.put(
          serverUrl + "/api/stories/",
          this.selectedStory,
          {
            withCredentials: true,
          }
        )
        if (result.status == 200) {
          this.loading = false
          this.showingShareOverlay = false
        }
      } catch (error) {
        console.log(error)
        this.loading = false
        this.showingShareOverlay = false
        if (error.response.status == 400) {
          console.log(error.response.data)
          this.showingShareOverlay = true
          this.errorSharing = true
          this.errorReason = error.response.data.reason
          this.errorParagraph = error.response.data.paragraph
        }
      }
    },
    hideErrorPanel: function () {
      this.errorSharing = false
      this.showingOverlay = false
      this.errorReason = ""
      this.errorParagraph = ""
    },
    getNexDateQuestion: function (first = false) {
      let diffDay = dayjs(this.nextDateTosend).day() - 1
      let nexSentDate = this.nextDateTosend
      let diffMonthDay
      let nextMonthDate = dayjs(nexSentDate)?.add(1, "month").endOf("month")
      let nextMonth = dayjs(nextMonthDate).get("month") + 1
      let nextYear = dayjs(nextMonthDate).get("year")
      const newmonthDate = "01/" + nextMonth + "/" + nextYear
      const startDayofMonth = dayjs(newmonthDate).day()

      const hoursDiff = dayjs().diff(dayjs(this.nextDateTosend), "hour")
      let diffWeekDay = Math.floor(hoursDiff / 24)
      switch (this.mailFrequence) {
        case 1:
          if (
            dayjs(this.nexDateToSend).isToday() &&
            dayjs().hour() < 20 &&
            first
          ) {
            nexSentDate = dayjs(this.nextDateTosend)
          } else {
            nexSentDate = dayjs(this.nextDateTosend)?.add("1", "day")
          }
          break
        case 2:
          if (
            dayjs(this.nexDateToSend).day() == 1 &&
            dayjs(this.nexDateToSend).isToday() &&
            dayjs().hour() < 20 &&
            first
          ) {
            diffDay = 7
          }
          if (diffDay === -1) {
            diffDay = 1
          } else {
            diffDay = 7 - diffDay
          }
          nexSentDate = dayjs(this.nextDateTosend)?.add(
            diffDay.toString(),
            "day"
          )
          break
        case 3:
          if (
            dayjs(this.nextDateTosend).day() == 1 &&
            dayjs(this.nexDateToSend).isToday() &&
            dayjs().hour() < 20 &&
            first
          ) {
            nexSentDate = dayjs(this.nextDateTosend)
          } else if (dayjs(this.nextDateTosend).day() == 1) {
            nexSentDate = dayjs(this.nextDateTosend)?.add(3, "day")
          } else if (
            dayjs(this.nextDateTosend).day() == 4 &&
            dayjs(this.nexDateToSend).isToday() &&
            dayjs().hour() < 20 &&
            first
          ) {
            nexSentDate = dayjs(this.nextDateTosend)
          } else if (dayjs(this.nextDateTosend).day() == 4) {
            nexSentDate = dayjs(this.nextDateTosend)?.add(4, "day")
          } else {
            if (dayjs(this.nextDateTosend).day() == 0) {
              nexSentDate = dayjs(this.nextDateTosend)?.add(1, "day")
            } else if (dayjs(this.nextDateTosend).day() > 4) {
              nexSentDate = dayjs(this.nextDateTosend)?.add(
                4 - (dayjs(this.nextDateTosend).day() - 4),
                "day"
              )
            } else {
              if (dayjs(this.nextDateTosend).day() == 2) {
                nexSentDate = dayjs(this.nextDateTosend)?.add("2", "day")
              } else {
                nexSentDate = dayjs(this.nextDateTosend)?.add("1", "day")
              }
            }
          }
          break
        case 4:
          if (first) {
            if (diffWeekDay > 7) {
              if (diffDay === -1) {
                diffWeekDay = 1
              } else {
                diffWeekDay = 7 - diffDay
              }
            } else {
              if (diffDay === -1) {
                diffWeekDay = 8
              } else {
                diffWeekDay = 14 - diffDay
              }
            }
            if (
              dayjs(this.nexDateToSend).day() == 1 &&
              dayjs(this.nexDateToSend).isToday() &&
              dayjs().hour() < 20
            ) {
              diffWeekDay = 0
            }
            nexSentDate = dayjs(this.nextDateTosend)?.add(diffWeekDay, "day")
          } else {
            nexSentDate = dayjs(this.nextDateTosend)?.add("14", "day")
          }
          break
        case 5:
          if (startDayofMonth == 0) {
            diffMonthDay = 1
          } else if (startDayofMonth == 1) {
            diffMonthDay = 0
          } else {
            diffMonthDay = 8 - startDayofMonth
          }
          nexSentDate = dayjs(newmonthDate)?.add(diffMonthDay, "day")
          break
        default:
          nexSentDate = dayjs(this.nextDateTosend)?.add(
            diffDay.toString(),
            "day"
          )
      }
      this.nextDateTosend = nexSentDate
      return dayjs(nexSentDate).format("ddd, MMMM D, YYYY")
    },
  },
  computed: {
    paginationsCount: function () {
      if (this.selectedChapter?.isShowingAnswered) {
        return 1
      }
      return this.paginationArray?.length
      //return Math.ceil(this.paginationArray?.length / 20)
    },
    paginationInterval: function () {
      //return this.paginationArray.slice(0, 20 * this.selectedPaginationIndex)

      return this.paginationArray
    },
    paginationArray: function () {
      const indexes = []
      let iterator = 0
      while (iterator < this.selectedChapter?.stories?.length) {
        const showingAnswered = this.selectedChapter?.isShowingAnswered
        const isAnswered = this.selectedChapter.stories[iterator]?.isAnswered

        if (!isAnswered && !showingAnswered) {
          indexes.push(iterator)
        }
        iterator++
      }
      return indexes
    },
    user: function () {
      return this.$store.getters.getUser
    },
    chapters: function () {
      return this.$store.getters.getChapters
    },
    book: function () {
      return this.$store.getters.getBook
    },
    selectedChapterAnsweredCount: function () {
      if (!this.selectedChapter.stories) {
        return 0
      }
      let count = 0
      this.selectedChapter.stories.forEach((story) => {
        if (story?.isAnswered) {
          count++
        }
      })
      return count
    },
    selectedQuestionSent: function () {
      const count = this.selectedChapter.stories?.filter(
        (story) => story.notifSent
      ).length

      return count
    },
  },
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true
        return
      }
      this.$nextTick(() => {
        this.delayedDragging = false
      })
    },
  },
  async mounted() {
    try {
      this.showingOverlay = true
      this.loading = true
      console.log("DEBUG - fetching chapters")
      await this.$store.dispatch("fetchPopulatedChapters")
      this.showingOverlay = false
      this.loading = false
      this.selectedChapter = this.chapters[0]

      const story = this.selectedChapter?.stories?.find(
        (stro) => stro?._id == this.defaultQuestion
      )
      if (story?.isAnswered) {
        this.$router.push(`/stories?nbr=2&question-id=${this.defaultQuestion}`)
      } else {
        if (this.defaultQuestion != null && this.defaultQuestion != "") {
          await this.selectChapter(null, this.defaultChapter, {
            noClick: true,
          })
          const searchedStory = this.selectedChapter.stories.find(
            (stor) => stor._id === this.defaultQuestion
          )
          const indexStory = this.selectedChapter.stories.indexOf(searchedStory)
          await this.showStoryForm(null, indexStory, {
            noClick: true,
            onmount: this.defaultQuestion == 0 ? false : true,
          })
        } else {
          await this.selectChapter(null, 0, {
            noClick: true,
          })
        }

        if (this.questionID) {
          this.$router.replace("/")
        }
      }
    } catch (error) {
      console.log(error)
      this.showingOverlay = false
      this.loading = false
    }
  },
  async created() {
    let params = new URLSearchParams(document.location.search)
    this.questionID = params.get("question-id")
    //const chapterIndex = params.get("chapter-id")
    if (this.questionID) {
      this.defaultQuestion = this.questionID.toString()
      this.defaultChapter = 0
    }
    this.selectedChapter.isShowingAnswered = false
    if (performance.navigation.type == 1) {
      if (this.defaultQuestion != null && this.defaultQuestion != "") {
        this.showChapters()
      }
    }
    this.mailFrequence = this.user.mailFrequence
    this.lastQuestionsent = this.user?.lastQuestionsent
      ? this.user?.lastQuestionsent
      : dayjs().format("MM/DD/YYYY")
    this.nextDateTosend = this.lastQuestionsent
    this.displayDate =
      this.user.guest == 1 ||
      this.user.isBuyer == 0 ||
      (this.user.isBuyer == 1 && this.user.guest !== 1)
        ? true
        : false
    //
  },
}
</script>

<style>
/* ************** */
/* chapters section */
/* ************** */
.question-head:hover {
  background: rgba(6, 42, 32, 0.1);
  border: none;
}
.mobile {
  display: none !important;
}
.desktop {
  display: block;
}

.question-control-pencil {
  margin-right: 25px;
  height: 26px;
}
.chapter-head {
  background-color: white;
  border-radius: 25px;
  margin-bottom: 22px;
  padding: 29px 32px;
  width: 100%;
  align-items: center;
  cursor: pointer;
}
.angle-container {
  background: white;
  border-radius: 5px;
  padding: 7px 11px;
}
/* stories section  */

.chapter-counter {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  color: #062a20;
  display: inline-block;
  margin-right: 5px;
}

.questions-section-container-header {
  margin-top: 30px;
}
.chapter-title {
  font-weight: 400;
  font-size: 18px;
  line-height: 27px;
  color: #062a20;
}
.pen-icon-img {
  vertical-align: sub;
}
.open-question-image {
  height: 20px;
}
.add-icon-container {
  margin-bottom: 14px;
}
.add-icon-container:hover {
  cursor: pointer;
}
.add-title {
  font-family: galaxie-polaris;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 27px;
  color: #062a20;
}
.add-title:hover {
  cursor: pointer;
}
.add-chapter-container {
  padding-top: 16px;
}
.chapter-title-input {
  border: none;
  outline: none;
  width: 97%;
  font-family: galaxie-polaris;
  font-weight: 400;
  padding: 0;
  font-size: 18px;
  line-height: 27px;
  color: #062a20;
  caret-color: #062a20;
}
.chapter-title-input::placeholder {
  color: rgba(6, 42, 32, 0.4);
}
.drag-container.question-control {
  background: url("../assets/drag.svg");
  background-size: contain;
  background-repeat: no-repeat;
}
.drag-container {
  flex-grow: 0;
  height: 20px;
  width: 16px;
  margin-right: 36px;
}
/* ************** */
/* stories section  */
/* ************** */

.questions-chapter-number {
  height: 30px;
  font-weight: normal;
  font-size: 18px;
  line-height: 19px;
  color: #062a20;
  display: flex;
  align-items: center;
}

.questions-chapter-number > span {
  display: inline-block;
  margin-right: 12px;
}

.questions-chapter-title {
  font-weight: 500;
  font-size: 23px;
  color: #062a20;
  margin-top: 18px;
}

.hide-standards-text {
  font-size: 16px;
  line-height: 24px;
  font-family: galaxie-polaris;
  color: #062a20;
}
.tab-btn-row {
  margin-bottom: 20px;
}
.tab-btn {
  padding: 5px 23px;
  font-family: galaxie-polaris;
  font-weight: 400;
  font-size: 18px;
  line-height: 27px;
  background: transparent;
  border-radius: 100px;
  color: #14473c;
  border: 1px solid #14473c;
  margin-right: 20px;
  gap: 10px;
}
.empty-section {
  text-align: center;
  padding: 15%;
}
.empty-story-message {
  font-family: galaxie-polaris;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 27px;
  color: #062a20;
}
.loading {
  text-align: center;
  position: absolute;
  color: #fff;
  z-index: 9;
  background: #14473c;
  padding: 8px 18px;
  border-radius: 5px;
  left: calc(50% - 45px);
  top: calc(50% - 18px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.tab-btn.active {
  background: #14473c;
  color: white;
}

.tab-btn:hover {
  cursor: pointer;
}

.questions-container {
  background: white;
  padding: 37px 27px;
  border: 1px solid rgba(6, 42, 32, 0.2);
  border-radius: 30px;
  position: relative;
}

.questions-count {
  font-family: galaxie-polaris;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 17px;
  color: #062a20;
}
.add-question-container {
  border-radius: 100px;
  padding: 15px 50px;
  box-sizing: border-box;
  border: 1px solid #14473c;
  width: fit-content;
  margin: auto;
}

.add-question-text {
  margin-left: 24px;
  height: 100%;
  font-family: galaxie-polaris;
  font-weight: 500;
  font-size: 16px;
  line-height: 27px;
  color: #062a20;
}
.question-head.desktop {
  display: flex !important;
}
.question-head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 32px;
  background: #ffffff;
  border: 1px solid rgba(6, 42, 32, 0.1);
  border-radius: 18px;
  margin-top: 14px;
}
.adding-question.question-head:hover {
  cursor: default;
  background: white;
}

.question-head:hover {
  cursor: pointer;
}

.question-title-input {
  border: none;
  outline: none;
  width: 100%;
  resize: none;
  font-family: galaxie-polaris;
  padding: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 27px;
  caret-color: #062a20;
}
.question-title-textarea {
  outline: none;
  width: 100%;
  resize: none;
  font-family: galaxie-polaris;
  padding: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 27px;
  caret-color: #062a20;
  border: 1px solid #14473c;
  border-radius: 18px;
  padding: 10px;
}
.question-title-input::placeholder,
.question-title-textarea {
  color: rgba(6, 42, 32, 0.4);
}

.question-title {
  font-family: galaxie-polaris;
  font-style: normal;
  font-weight: 550;
  font-size: 16px;
  line-height: 27px;
  color: #062a20;
}

.pagination-section {
  margin-top: 23px;
}

.chapter-title-input.selected-chapter {
  background: #f6f4f3;
  font-weight: 500;
  font-size: 23px;
  line-height: 25px;
  color: #062a20;
}
/* ************** */
/* form section */
/* ************** */

.canvas-container {
  display: none;
}
.tooltip {
  position: relative;
  display: inline-block;
  font-size: 11px;
}

.info-icon-container .tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: white;
  color: black;
  border: 1px solid rgba(6, 42, 32, 0.2);
  text-align: center;
  border-radius: 2px;
  border-radius: 6px;
  padding: 15px 10px;
  font-size: 13px;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  right: -36px;
  top: -60px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.story-form-container {
  margin-top: 22px;

  background: #ffffff;
  width: 100%;
  border: 1px solid rgba(6, 42, 32, 0.2);
  box-sizing: border-box;
  border-radius: 30px;
  padding: 37px 27px;
}
.story-form-section {
  padding: 11px 35px 11px 22px;
  border: 1px solid rgba(6, 42, 32, 0.1);
  box-sizing: border-box;
  border-radius: 18px;
  width: 100%;
  margin-bottom: 14px;
  position: relative;
}

.story-form-section.title {
  height: 70px;
  display: flex;
  align-items: center;
}
.story-form-section.story {
  height: 266px;
}

.story-form-input {
  font-weight: 500;
  font-size: 16px;
  line-height: 27px;
  color: #062a20;
  padding: 0px;
  border: none;
  outline: none;
}

.story-form-textarea {
  font-weight: 500;
  font-size: 16px;
  line-height: 27px;
  color: #062a20;
  padding: 0px;
  border: none;
  outline: none;
  height: 54px;
  resize: none;
}

.story-form-textarea.story-answer {
  height: 100%;
  font-weight: normal;
  font-size: 16px;
}

.story-form-textarea.image-legend {
  height: 100%;
  font-weight: normal;
  font-size: 14px;
}

.story-form-section.image-selection-container {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='18' ry='18' stroke='%2314473CFF' stroke-width='2' stroke-dasharray='12%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  border-radius: 18px;
  border: none;
  height: 145px;
}

.info-icon-container {
  position: absolute;
  top: 13px;
  right: 13px;
}

.save-story-btn {
  font-family: PT-serif;
  width: 187px;
  height: 62px;
  color: white;
  font-weight: bold;
  font-size: 16px;
  line-height: 21px;
  /* main red */
  background: #e1504b;
  border: none;
}

.save-state-container {
  color: #14473c;
  margin-left: 21px;
  font-family: mont;
  font-size: 14px;
  line-height: 15px;
}

.pagination-btn {
  padding: 10px;
  border: none;
  background: #14473c;
  color: white;
  font-size: 14px;
  font-weight: 500;
  font-family: galaxie-polaris;
}
.pagination-btn:hover {
  cursor: pointer;
}

.pagination-btn.disabled {
  background: #bbc0bf;
  cursor: not-allowed;
}

.pagination-input {
  width: 30px;
  height: 40px;
  font-size: 14px;
  color: #062a20;
  font-family: galaxie-polaris;
  font-weight: 500;
  border: 1px solid #062a20;
  outline: none;
  border-radius: 5px 0px 0px 5px;
  text-align: center;
}
.pagination-submit {
  font-size: 14px;
  height: 40px;
  width: 45px;
  font-family: galaxie-polaris;
  font-weight: 500;
  background: #14473c;
  color: white;
  border: none;
  border-radius: 0px 5px 5px 0px;
}

.question-search-input {
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-right: 8px;
  padding: 5px 10px;
  outline: none;
  color: #062a20;
  font-weight: 400;
  width: 240px;
  font-family: galaxie-polaris;
  transition: ease-in-out 0.6s;
}
.hidden {
  opacity: 0;
  width: 1px;
}
.mobile-chapter-toggle {
  display: none;
}

.desktop-chapter-toggle {
  display: block;
}

.chapter-next-angle {
  height: 32px;
  width: 32px;
}

.questions-section-container {
  margin-left: 12px;
  margin-top: 7px;
}

.plus-sign {
  width: 25px;
  height: 25px;
}
.toggle-standard-mobile {
  display: none;
}

.search-section {
  justify-content: space-between;
  margin-bottom: 28px;
}

.question-control-image {
  height: 18px;
  width: 18px;
}
.sent-date {
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #14473c;
  line-height: 27px;
}

.open-question-button {
  padding-bottom: 3px;
}

.left-side-story-form {
  width: calc(75% - 15px);
  margin-right: 14px;
  box-sizing: border-box;
}

.right-side-story-form {
  width: 25%;
  box-sizing: border-box;
}

.plus-sign-form {
  height: 34px;
  width: 34px;
}

.image-preview-form {
  height: 56px;
  width: 56px;
}

.form-image-preview-text {
  font-size: 16px;
  width: 100%;
  text-align: center;
}

.story-form-section.legend {
  height: 191px;
  position: relative;
}

.form-submit-container {
  display: flex;
}

.story-form-top-button {
  width: 21px;
  height: 24px;
}
.story-form-top-button-left {
  width: 28px;
  height: 27px;
}
.scrollable {
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;
}

.route-section.chapters {
  padding-right: 15px;
  position: relative;
}

.dragging {
  background: #e8e8e8;
}
.drag-scroll-arrow {
  width: 0px;
  height: 0px;
  z-index: 3;
  position: absolute;
  left: calc(50% - 5px);
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

.down {
  bottom: 20px;
  border-right: 10px solid transparent;
  border-left: 10px solid transparent;
  border-top: 10px solid #e1504b;
  animation-name: bobbingDown;
}
.up {
  top: 20px;
  border-right: 10px solid transparent;
  border-left: 10px solid transparent;
  border-bottom: 10px solid #e1504b;
  animation-name: bobbingUp;
}
@keyframes bobbingUp {
  0% {
    top: 20px;
  }
  50% {
    top: 15px;
  }
  100% {
    top: 20px;
  }
}
@keyframes bobbingDown {
  0% {
    bottom: 20px;
  }
  50% {
    bottom: 15px;
  }
  100% {
    bottom: 20px;
  }
}

.not-allowed:hover {
  cursor: not-allowed;
}

.chapter-head.adding {
  display: flex;
}

.adding-chapter-text {
  display: flex;
  flex-direction: row;
}
.adding-chapter-buttons {
  height: 56px;
  width: 56px;
}
.shared-btn {
  padding: 10px 23px;
  font-family: galaxie-polaris;
  font-weight: 550;
  margin-top: 20px;
  font-size: 18px;
  line-height: 27px;
  background: transparent;
  border-radius: 100px;
  background: #14473c;
  color: white;
  margin-right: 20px;
  gap: 10px;
  cursor: pointer;
  border: none;
}

.shared-btn.shared {
  background: #062a2033;
  border: none;
}
@media screen and (max-width: 1024px) {
  .container {
    width: 100%;
  }
  .question-control-delete {
    border: 1px solid rgba(20, 71, 60, 0.2);
    border-radius: 50px;
    margin-top: 10px;
    padding: 5px 13px;
    color: #14473c;
    max-width: 92px;
    font-size: 14px;
    line-height: 21px;
  }
  .route-section {
    padding: 24px;
  }
  .shared-container {
    width: 100%;
  }
  .shared-btn {
    border: none;
    width: 100%;
  }
  .questions-section-container-header {
    margin-top: 20px;
  }
  .tab-mobile {
    width: 100%;
    justify-content: space-around;
  }
  .site-background.hidebuttonmobilemenu .menu-mobile .bm-burger-button {
    display: none;
  }
  .form-response-question {
    margin-top: 30px;
  }
  .question-control-image {
    height: 12px;
    width: 12x;
  }
  .question-control-pencil {
    margin-right: 20px;
    height: 33px;
    margin-top: 1px;
  }
  .search-secion,
  .desktop {
    display: none !important;
  }
  .mobile {
    display: block !important;
  }
  .sent-date {
    font-size: 12px;
    line-height: 12px;
    margin-bottom: 7px;
  }
  .mobile-chapter-toggle {
    display: block;
  }
  .desktop-chapter-toggle {
    display: none;
  }
  .chapter-next-angle {
    height: 16px;
    width: 9px;
  }
  .questions-section-container {
    margin-left: 0px;
    margin-top: 0px;
  }
  .drag-container {
    min-width: 16px;
    margin-right: 15px;
  }
  .back-container {
    display: none;
  }
  .tab-btn {
    padding: 5px 14px;
    font-size: 14px;
    line-height: 21px;
    margin-right: 0px;
  }
  .toggle-standard {
    display: none;
  }
  .toggle-standard-mobile {
    display: flex;
  }
  .questions-container {
    padding: 0;
    border: none;
    background-color: #f6f4f3;
  }
  .tabs-span {
    margin-top: 2px;
  }
  .hide-standards-text {
    font-size: 12px;
    line-height: 18px;
    font-family: galaxie-polaris;
    color: #062a20;
  }
  .add-question-container {
    margin-top: 6px;
    padding: 6px 26px;
    background: white;
  }
  .add-question-text {
    font-family: galaxie-polaris;
    margin-left: 12px;
    font-size: 14px;
    line-height: 27px;
    font-weight: 400;
  }

  .plus-sign {
    width: 12px;
    height: 12px;
  }
  .question-head.desktop {
    display: none !important;
  }
  .question-head {
    display: flex;
    padding: 20px 13px 20px 13px;
    background: #ffffff;
    border: 1px solid rgba(6, 42, 32, 0.1);
    border-radius: 18px;
    margin-top: 14px;
  }
  .question-title {
    font-family: galaxie-polaris;
    font-style: normal;
    font-weight: 550;
    font-size: 16px;
    line-height: 27px;
    color: #062a20;
  }

  .question-control-image {
    height: 18px;
    width: 18px;
  }
  .editing-buttons-container {
    margin-top: 15px;
  }

  .open-question-button {
    position: absolute;
    right: 0px;
    top: 3px;
    padding-bottom: 3px;
  }

  .open-question-image {
    height: 12px;
    width: 10px;
    display: block;
  }

  .route-title.form-question {
    font-size: 14px;
    font-weight: 550;
    line-height: 15px;
    color: #062a20;
  }

  .story-form-container {
    margin-top: 16px;
    margin-left: 0px;
    width: 100%;
    border: 1px solid rgba(6, 42, 32, 0.2);
    box-sizing: border-box;
    border-radius: 30px;
    padding: 19px 16px;
  }
  .left-side-story-form {
    width: 100%;
    margin-right: 0px;
    box-sizing: border-box;
  }
  .right-side-story-form {
    width: 100%;
    box-sizing: border-box;
  }
  .story-form-section {
    margin-bottom: 8px;
  }

  .story-form-textarea {
    font-size: 14px;
    line-height: 17px;
    height: 36px;
  }

  .story-form-input {
    font-size: 14px;
    line-height: 15px;
  }

  .story-form-section.title {
    height: auto;
  }

  .story-form-section.story {
    height: 226px;
  }
  .story-form-section.image-selection-container {
    padding-top: 0px;
    padding-bottom: 0px;
    height: 64px;
  }
  .add-icon-container {
    margin-bottom: 0px;
  }
  .story-image-selection-span {
    font-size: 12px;
  }
  .plus-sign-form {
    height: 24px;
    width: 24px;
  }

  .image-preview-form {
    height: 34px;
    width: 34px;
  }

  .lds-dual-ring.image-form {
    height: 34px;
    width: 34px;
  }
  .lds-dual-ring.image-form::after {
    height: 12px;
    width: 12px;
    margin: 6px;
  }

  .form-image-preview-text {
    font-size: 12px;
    width: 100%;
  }

  .story-form-section.legend {
    height: 76px;
    position: relative;
  }
  .form-submit-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .save-story-btn {
    margin-bottom: 12px;
    font-size: 14px;
  }
  .story-form-top-button {
    width: 16px;
    height: 16px;
  }
  .story-form-top-button-left {
    width: 16px;
    height: 16px;
  }
  .angle-container {
    background: white;
    border-radius: 5px;
    padding: 7px 11px;
  }
  .question-search-input {
    width: 100px;
  }
  .questions-chapter-title {
    font-size: 18px;
  }
  .scrollable {
    height: 100%;
    overflow-y: auto;
    padding-right: 6px;
  }

  .route-section.chapters {
    padding-right: 15px;
  }
  .chapter-head.adding {
    display: block;
  }
  .adding-chapter-text {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
  }
  .adding-chapter-buttons {
    height: 32px;
    width: 32px;
  }
}
</style>
