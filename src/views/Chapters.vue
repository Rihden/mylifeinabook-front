<template>
  <div class="d-row site-background">
    <div class="overlay" v-if="showingOverlay">
      <!-- <div class="pop-up" v-if="isDeletingChapter">
        <div class="pop-up-title">
          <span>Supprimer chapitre</span>
        </div>
        <div class="pop-up-paragraph">
          <span
            >Vous êtes sûr de supprimer ce chapitre et tout son centenu?</span
          >
        </div>
        <div style="text-align: center">
          <button
            class="pop-up-btn confirm"
            @click="deleteChapter()"
            style="margin-right: 40px"
          >
            Oui
          </button>
          <button
            class="pop-up-btn cancel"
            @click="
              isDeletingChapter = false;
              deletingChapterId = null;
            "
          >
            Non
          </button>
        </div>
      </div> -->
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
        <div
          v-if="showingChapters"
          class="scrollable"
          ref="chapters_section_container_scrollable"
          @scroll="updateDragArrowState()"
        >
          <div class="route-title-container">
            <span class="route-title">My chapters</span>
          </div>
          <!-- chapters list -->
          <div class="chapters-container" @dragover="dropFix($event)">
            <div
              v-for="(chapter, keyChapters) in chapters"
              :key="keyChapters"
              class="chapter-head d-row"
              :class="{ dragging: keyChapters == draggingIndexChapters }"
              @click="selectChapter($event, keyChapters)"
              @dragover.prevent="switchPlacesChapters(keyChapters, $event)"
              @dragstart="startDraggingChapters(keyChapters)"
              @dragend="stopDraggingChapters()"
              :draggable="editingTitleIndex != keyChapters"
            >
              <div class="drag-container" style="">
                <img
                  src="../assets/drag.svg"
                  alt=""
                  height="30px"
                  width="18px"
                  draggable="false"
                />
              </div>
              <div
                class="d-row"
                style="
                  flex-grow: 1;
                  justify-content: space-between;
                  margin-right: 46px;
                "
              >
                <div style="flex-grow: 1">
                  <div class="mobile-chapter-toggle">
                    <img
                      src="../assets/switch-active.svg"
                      alt="switch on"
                      v-if="chapter.isActive"
                      class="chapter-control"
                      height="21px"
                      width="38px"
                      @click="toggleActiveChapter(keyChapters)"
                      draggable="false"
                    />
                    <img
                      v-else
                      src="../assets/switch-inactive.svg"
                      alt=""
                      class="chapter-control"
                      height="21px"
                      width="38px"
                      @click="toggleActiveChapter(keyChapters)"
                      draggable="false"
                    />
                  </div>
                  <div class="d-row">
                    <span
                      class="chapter-counter"
                      :class="{ inactive: !chapter.isActive }"
                    >
                      Chapter {{ keyChapters + 1 }}:
                    </span>
                    <div class="chapter-control">
                      <img
                        @click="startEditingTitle(keyChapters)"
                        v-if="editingTitleIndex != keyChapters"
                        src="../assets/pencil.svg"
                        class="chapter-control pen-icon-img"
                        alt=""
                        height="18px"
                        width="18px"
                        draggable="false"
                      />
                      <img
                        @click="confirmEditing(keyChapters)"
                        v-if="editingTitleIndex == keyChapters"
                        src="../assets/confirm.svg"
                        class="chapter-control pen-icon-img"
                        alt=""
                        height="30px"
                        width="30px"
                        draggable="false"
                        style="margin-right: 8px"
                      />
                      <img
                        @click="cancelEditing(keyChapters)"
                        v-if="editingTitleIndex == keyChapters"
                        src="../assets/cancel.svg"
                        class="chapter-control pen-icon-img"
                        alt=""
                        height="30px"
                        width="30px"
                        draggable="false"
                      />
                    </div>
                  </div>

                  <input
                    class="chapter-title-input chapter-control"
                    type="text"
                    v-if="editingTitleIndex == keyChapters"
                    v-model="chapter.tempTitle"
                    :placeholder="chapter.title"
                    :class="{ inactive: !chapter.isActive }"
                    @keypress.enter="confirmEditing(keyChapters)"
                    :ref="'title' + keyChapters"
                  />

                  <span
                    v-if="editingTitleIndex != keyChapters"
                    class="chapter-title"
                    >{{ chapter.title }}
                  </span>
                </div>

                <div
                  class="chapter-control desktop-chapter-toggle"
                  @click="toggleActiveChapter(keyChapters)"
                >
                  <img
                    src="../assets/switch-active.svg"
                    alt="switch on"
                    v-if="chapter.isActive"
                    class="chapter-control"
                    height="50px"
                    width="58px"
                    draggable="false"
                  />
                  <img
                    v-else
                    src="../assets/switch-inactive.svg"
                    alt=""
                    class="chapter-control"
                    height="50px"
                    width="58px"
                    draggable="false"
                  />
                </div>
              </div>
              <div style="flex-grow: 0">
                <div>
                  <img
                    src="../assets/angle-right.svg"
                    alt=""
                    class="chapter-next-angle"
                    draggable="false"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- add chapter button -->
          <div
            v-if="!isAddingChapter"
            class="d-flex-centered d-col add-chapter-container"
          >
            <div class="add-icon-container" @click="startAddingChapter()">
              <img src="../assets/plus.svg" alt="" height="56px" width="56px" />
            </div>
            <span class="add-title" @click="startAddingChapter()">
              Add a chapter
            </span>
          </div>
          <!-- adding chapter head -->
          <div v-show="isAddingChapter">
            <div class="chapter-head adding">
              <div class="drag-container">
                <img
                  src="../assets/drag.svg"
                  alt=""
                  height="30px"
                  width="18px"
                />
              </div>
              <div class="adding-chapter-text" style="flex-grow: 1">
                <span class="chapter-counter"
                  >Chapter {{ this.chapters.length + 1 }} :
                </span>
                <div style="flex-grow: 1">
                  <input
                    ref="newChapterInput"
                    class="chapter-title-input"
                    type="text"
                    v-model="tempChapterTitle"
                    placeholder="New title..."
                  />
                </div>
              </div>
              <div class="d-row desktop-add-controls">
                <div @click="cancelNewChapter()" style="margin-right: 12px">
                  <img
                    src="../assets/cancel.svg"
                    class="adding-chapter-buttons"
                    alt=""
                  />
                </div>
                <div @click="confirmNewChapter()">
                  <img
                    src="../assets/confirm.svg"
                    class="adding-chapter-buttons"
                    alt=""
                    height="56px"
                    width="56px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- stories section -->
        <div
          v-if="showingStories"
          class="questions-section-container scrollable"
          ref="questions_section_container_scrollable"
          style=""
          @scroll="updateDragArrowState()"
        >
          <div class="d-row">
            <div @click="showChapters()" class="ptr back-container">
              <img
                src="../assets/back-arrow.svg"
                class=""
                alt=""
                height="46px"
                width="46px"
              />
            </div>
            <div style="margin-left: 18px">
              <div class="questions-chapter-number" style="">
                <span>CHAPTER {{ this.selectedChapterIndex + 1 }}: </span>
                <img
                  @click="startEditingSelectedChapter()"
                  src="../assets/pencil.svg"
                  class="chapter-control pen-icon-img"
                  alt=""
                  height="18px"
                  width="18px"
                  draggable="false"
                  v-if="!editingSelectedChapter"
                />

                <img
                  @click="confirmEditingSelectedChapter()"
                  src="../assets/confirm.svg"
                  class="chapter-control pen-icon-img"
                  alt=""
                  height="30px"
                  width="30px"
                  draggable="false"
                  v-else
                />
              </div>
              <div class="questions-chapter-title">
                <span v-if="!editingSelectedChapter">
                  {{ selectedChapter.title }}
                </span>
                <input
                  class="chapter-title-input selected-chapter"
                  type="text"
                  v-else
                  v-model="selectedChapter.tempTitle"
                  placeholder="New title..."
                  @keypress.enter="confirmEditing()"
                  ref="selectedChapterTitleInput"
                />
              </div>
            </div>
          </div>

          <div style="margin-top: 30px">
            <div
              class="d-row"
              style="justify-content: space-between; padding-right: 7px"
            >
              <div class="d-row">
                <button
                  class="tab-btn"
                  :class="{
                    active: !selectedChapter.isShowingAnswered,
                  }"
                  @click="
                    selectedChapter.isShowingAnswered = false;
                    selectedPaginationIndex = 1;
                  "
                >
                  Questions
                </button>
                <button
                  class="tab-btn"
                  :class="{
                    active: selectedChapter.isShowingAnswered,
                  }"
                  @click="
                    selectedChapter.isShowingAnswered = true;
                    selectedPaginationIndex = 1;
                    cancelNewStory();
                  "
                >
                  My stories
                </button>
              </div>
              <div class="d-row">
                <!-- <span class="tabs-span left">
                  Total pages :
                  {{ selectedChapter.pagesCount }} pages</span
                > -->
                <div
                  v-if="selectedChapter.isStandard"
                  class="d-row toggle-standard"
                  style="align-items: flex-start"
                >
                  <span class="hide-standards-text"
                    >Hide standard questions</span
                  >
                  <div
                    @click="toggleHidingStandard()"
                    style="margin-left: 9px; margin-bottom: 10px"
                    class="ptr"
                  >
                    <img
                      v-if="selectedChapter.isHidingStandardStories"
                      src="../assets/switch-active.svg"
                      class="chapter-control pen-icon-img"
                      alt=""
                      height="32px"
                      width="58px"
                    />
                    <img
                      v-else
                      src="../assets/switch-inactive.svg"
                      class="chapter-control pen-icon-img"
                      alt=""
                      height="32px"
                      width="58px"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="questions-container" @dragover="dropFix($event)">
              <!-- search section -->
              <div class="search-section d-row" style="">
                <span
                  v-if="!selectedChapter.isShowingAnswered"
                  class="questions-count"
                  >Questions:
                  <span style="font-weight: 400">{{
                    backupStories.length - selectedChapterAnsweredCount
                  }}</span></span
                >
                <span v-else class="questions-count"
                  >My stories:
                  <span style="font-weight: 400">{{
                    selectedChapterAnsweredCount
                  }}</span>
                </span>
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
              <!-- toggle standard mobile -->
              <div
                v-if="selectedChapter.isStandard"
                class="d-row toggle-standard-mobile"
                style="align-items: flex-start"
              >
                <div
                  @click="toggleHidingStandard()"
                  style="margin-right: 7px; margin-bottom: 10px"
                  class="ptr"
                >
                  <img
                    v-if="selectedChapter.isHidingStandardStories"
                    src="../assets/switch-active.svg"
                    class="chapter-control pen-icon-img"
                    alt=""
                    height="21px"
                    width="38px"
                  />
                  <img
                    v-else
                    src="../assets/switch-inactive.svg"
                    class="chapter-control pen-icon-img"
                    alt=""
                    height="21px"
                    width="38px"
                  />
                </div>
                <span class="hide-standards-text">Hide standard questions</span>
              </div>
              <!-- add question section -->
              <div
                v-if="!isAddingQuestion && !selectedChapter.isShowingAnswered"
                class="add-question-container d-flex-centered ptr"
                style=""
                @click="startAddingStory()"
              >
                <div class="">
                  <img src="../assets/union.svg" alt="" class="plus-sign" />
                </div>
                <div class="add-question-text">Add a question...</div>
              </div>
              <!-- adding question section -->
              <div
                v-if="isAddingQuestion && !selectedChapter.isShowingAnswered"
                class="d-row question-head adding-question"
                style="border: 1px solid #e1504b"
              >
                <div class="d-row" style="flex-grow: 1; margin-right: 8px">
                  <input
                    rows="1"
                    style="height: 27px; box-sizing: border-box"
                    class="question-title-input"
                    v-model="tempQuestionTitle"
                    placeholder="New Question"
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

                <!-- <div class="">
                <div
                  class=""
                  @click="toggleExpandedQuestion(keyChapters, keyStories)"
                  :class="{ reverse: question.isExpanded }"
                >
                  <img
                    src="../assets/arrow-down.png"
                    alt=""
                    height="12px"
                    width="12px"
                  />
                </div>
              </div> -->
              </div>
              <!-- <div
            v-for="(question, keyStories) in selectedChapter
              .stories"
            :key="keyStories"
          > -->
              <div>
                <div
                  v-for="(keyStories, indexQuestion) in paginationInterval"
                  :key="indexQuestion"
                  @dragover="dropFix($event)"
                >
                  <div
                    v-if="
                      ((selectedChapter.isShowingAnswered &&
                        selectedChapter.stories[keyStories].isAnswered) ||
                        (!selectedChapter.isShowingAnswered &&
                          !selectedChapter.stories[keyStories].isAnswered)) &&
                      (!selectedChapter.stories[keyStories].isStandard ||
                        !selectedChapter.isHidingStandardStories)
                    "
                    :draggable="
                      selectedChapter.isShowingAnswered &&
                      !selectedChapter.stories[keyStories].editingTitle
                    "
                    class="question-head"
                    :class="{ dragging: keyStories == draggingIndexQuestions }"
                    @click="showStoryForm($event, keyStories)"
                    @dragstart="startDraggingQuestion(keyStories)"
                    @dragover.prevent="switchPlacesQuestion(keyStories, $event)"
                    @dragend="stopDraggingQuestion($event)"
                  >
                    <div
                      v-if="selectedChapter.stories[keyStories].isAnswered"
                      class="drag-container question-control"
                    ></div>
                    <div
                      class="d-row question-title-container"
                      style="flex-grow: 1; margin-right: 8px"
                    >
                      <span
                        class="question-title"
                        v-if="!selectedChapter.stories[keyStories].editingTitle"
                      >
                        {{ selectedChapter.stories[keyStories].question }}
                      </span>
                      <input
                        rows="1"
                        style="height: 27px; box-sizing: border-box"
                        class="question-title-input"
                        v-model="selectedChapter.stories[keyStories].tempTitle"
                        v-if="selectedChapter.stories[keyStories].editingTitle"
                        :placeholder="
                          selectedChapter.stories[keyStories].question
                        "
                        :ref="'title' + selectedChapterIndex + '-' + keyStories"
                        @keypress.enter="confirmEditingStory(keyStories)"
                      />
                    </div>
                    <div
                      class="d-row"
                      style="position: relative; align-items: center"
                    >
                      <div
                        class="question-control"
                        v-if="!selectedChapter.stories[keyStories].editingTitle"
                        @click="startEditingStoryTitle(keyStories)"
                        style="margin-right: 25px; height: 33px"
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
                        v-if="selectedChapter.stories[keyStories].editingTitle"
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
                        v-if="selectedChapter.stories[keyStories].editingTitle"
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
                        class="question-control"
                        @click="startDeletingStory(keyStories)"
                        v-if="!selectedChapter.stories[keyStories].editingTitle"
                        style="margin-right: 30px; height: 33px"
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
                          src="../assets/angle-right-red.svg"
                          alt=""
                          class="open-question-image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pagination-section" v-if="paginationsCount > 1">
              <div
                @click="decrementPagination()"
                class="ptr"
                style="margin-right: 12px"
              >
                <button
                  :disabled="selectedPaginationIndex == 1"
                  class="pagination-btn"
                  :class="{ disabled: selectedPaginationIndex == 1 }"
                >
                  &lt;
                </button>
              </div>

              <div class="d-row" style="align-items: baseline">
                <div style="margin-right: 12px">
                  <span
                    style="
                      color: rgba(6, 42, 32, 0.4);
                      font-family: galaxie-polaris;
                      font-size: 14px;
                    "
                    >page</span
                  >
                </div>

                <div class="d-row" style="margin-right: 12px">
                  <input
                    type="number"
                    min="1"
                    :max="paginationsCount"
                    v-model="tempSelectedPaginationIndex"
                    @input="validatePagination()"
                    @keypress.enter="changePagination()"
                    class="pagination-input"
                    ref="pagination-input"
                  />
                  <button @click="changePagination()" class="pagination-submit">
                    Go
                  </button>
                </div>
                <div
                  style="
                    margin-right: 12px;
                    font-family: galaxie-polaris;
                    font-size: 14px;
                  "
                >
                  <span style="color: rgba(6, 42, 32, 0.4)"
                    >of {{ paginationsCount }}</span
                  >
                </div>
              </div>

              <div
                class="pagination-icon-container ptr"
                @click="incrementPagination()"
              >
                <button
                  :disabled="selectedPaginationIndex == paginationsCount"
                  :class="{
                    disabled: selectedPaginationIndex == paginationsCount,
                  }"
                  class="pagination-btn"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- form section -->
        <div v-if="showingForm">
          <div class="canvas-container">
            <canvas ref="imageCanvas"></canvas>
          </div>

          <div class="d-row" style="justify-content: space-between">
            <div class="d-row" style="align-items: center">
              <div @click="hideStoryForm()" class="ptr">
                <img
                  src="../assets/back-arrow.svg"
                  class="story-form-top-button"
                  alt=""
                />
              </div>
              <div style="margin-left: 18px">
                <span class="route-title form-question">Go Back</span>
              </div>
            </div>
            <div class="d-row" style="align-items: center">
              <div style="margin-right: 18px">
                <span class="route-title form-question">Next Story</span>
              </div>
              <div
                @click="
                  if (SelectedStoryIndex + 1 < selectedChapter.stories.length) {
                    showStoryForm($event, SelectedStoryIndex + 1, {
                      noClick: true,
                    });
                  }
                "
                class="ptr"
                :class="{
                  'not-allowed':
                    SelectedStoryIndex + 1 >= selectedChapter.stories.length,
                }"
              >
                <img
                  src="../assets/next-arrow.svg"
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
                  <img
                    src="../assets/info.svg"
                    alt=""
                    width="16px"
                    height="16px"
                  />
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
                    <img
                      src="../assets/info.svg"
                      alt=""
                      width="16px"
                      height="16px"
                    />
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
                      focusedOnStory = false;
                      saveAnswer(selectedChapterIndex, SelectedStoryIndex);
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
                    v-if="selectedStory.imageFileName"
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
                      v-if="!selectedStory.imageFileName"
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
            <div class="form-submit-container">
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
                >
                  <img
                    src="../assets/check-red.svg"
                    alt=""
                    height="16px"
                    width="16px"
                    style="margin-right: 10px"
                  />
                  <span class="tabs-span">Saved</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { serverUrl } from "../severUrl";
import { calculateStoryPages } from "../pdfUtils";
import navbar from "../components/navbar.vue";
export default {
  components: {
    navbar,
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
      showingStories: false,
      showingChapters: true,
      showingForm: false,
      isAddingChapter: false,
      isAddingQuestion: false,
      tempChapterTitle: "",
      tempQuestionTitle: "",
      editingTitleIndex: -1,
      selectedChapterIndex: 0,
      selectedChapter: null,
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
    };
  },
  methods: {
    updateDragArrowState: function () {
      let containerRef = null;
      if (this.showingStories) {
        containerRef = this.$refs.questions_section_container_scrollable;
      }
      if (this.showingChapters) {
        containerRef = this.$refs.chapters_section_container_scrollable;
      }
      if (!containerRef) {
        console.log("ref is false");
        return false;
      }
      const scrollTop = containerRef.scrollTop;
      const scrollHeight = containerRef.scrollHeight;
      const clientHeight = containerRef.clientHeight;
      const scrollOffsetPercent = Number(
        (scrollTop / (scrollHeight - clientHeight)).toFixed(1)
      );

      if (this.dragging && scrollOffsetPercent > 0.02) {
        this.showDragUpArrow = true;
      } else {
        this.showDragUpArrow = false;
      }
      if (this.dragging && scrollOffsetPercent < 0.98) {
        this.showDragDownArrow = true;
      } else {
        this.showDragDownArrow = false;
      }
    },
    startDraggingQuestion: function (keyStories) {
      if (!this.selectedChapter.isShowingAnswered) {
        return;
      }
      this.draggingIndexQuestions = keyStories;
      this.dragging = true;
      this.updateDragArrowState();
    },
    switchPlacesQuestion: function (keyStories) {
      if (!this.selectedChapter.isShowingAnswered) {
        return;
      }
      // console.log(e.target);
      // console.log(keyStories);
      const newIndex = keyStories;
      const oldIndex = this.draggingIndexQuestions;

      if (newIndex != oldIndex) {
        const aux = this.selectedChapter.stories[oldIndex];
        this.selectedChapter.stories.splice(oldIndex, 1);
        this.selectedChapter.stories.splice(newIndex, 0, aux);
        this.draggingIndexQuestions = newIndex;
      }
    },
    stopDraggingQuestion: async function () {
      //find new index in answered section
      if (!this.selectedChapter.isShowingAnswered) {
        return;
      }
      let firstAnsweredIndex = 0;
      while (
        !this.selectedChapter.stories[firstAnsweredIndex].isAnswered &&
        firstAnsweredIndex < this.selectedChapter.stories.length
      ) {
        firstAnsweredIndex++;
      }
      const newIndex = this.draggingIndexQuestions - firstAnsweredIndex;

      axios
        .put(
          serverUrl + "/api/chapters/update-story-order",
          {
            chapterId: this.selectedChapter._id,
            storyId:
              this.selectedChapter.stories[this.draggingIndexQuestions]._id,
            newIndex,
          },
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res.status);
          console.log("updated order");
        })
        .catch((err) => console.log(err));
      this.dragging = false;
      this.draggingIndexQuestions = -1;
      this.showDragUpArrow = false;
      this.showDragDownArrow = false;
    },
    startDraggingChapters: function (keyChapter) {
      this.draggingIndexChapters = keyChapter;
      this.dragging = true;
      this.updateDragArrowState();
    },
    switchPlacesChapters: function (keyChapter) {
      const newIndex = keyChapter;
      const oldIndex = this.draggingIndexChapters;

      if (newIndex != oldIndex) {
        const aux = this.chapters[oldIndex];
        this.chapters.splice(oldIndex, 1);
        this.chapters.splice(newIndex, 0, aux);
        this.draggingIndexChapters = newIndex;
      }
    },
    stopDraggingChapters: async function () {
      const newIndex = this.draggingIndexChapters;

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
        .then((res) => {
          console.log(res.status);
          console.log("updated order");
        })
        .catch((err) => console.log(err));
      this.dragging = false;
      this.draggingIndexChapters = -1;
      this.showDragUpArrow = false;
      this.showDragDownArrow = false;
    },
    dropFix: function (e) {
      e.preventDefault();
    },
    testsmth: function (e) {
      console.log(e);
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
      );
    },
    toggleFiltering: function () {
      this.filteringStories = !this.filteringStories;
      if (!this.filteringStories) {
        this.storiesFilterText = "";
        this.filterStories();
      }
    },

    //chapters
    cancelEditing: function (id) {
      const updatedChapter = this.chapters[id];
      updatedChapter.tempTitle = "";
      this.$store.commit("updateChapter", {
        index: id,
        chapter: updatedChapter,
      });
      this.editingTitleIndex = -1;
    },
    startAddingChapter: async function () {
      await this.confirmEditing();
      this.isAddingChapter = true;
      this.$nextTick(() => {
        this.$refs.newChapterInput.focus();
      });
    },
    confirmEditing: async function () {
      const id = this.editingTitleIndex;
      try {
        if (id > -1 && this.chapters[id].title != this.chapters[id].tempTitle) {
          this.chapters[id].title = this.chapters[id].tempTitle;
          const confirmedChapter = this.chapters[id];

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
          };

          this.loading = true;
          this.showingOverlay = true;

          const result2 = await axios.put(
            serverUrl + "/api/chapters/",
            chapterData,
            { withCredentials: true }
          );
          if (result2.status != 200) {
            console.log(result2.status);
          }
        }
        this.editingTitleIndex = -1;
        this.loading = false;
        this.showingOverlay = false;
      } catch (error) {
        this.editingTitleIndex = -1;
        this.loading = false;
        this.showingOverlay = false;
        console.log(error);
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
        };
        this.loading = true;
        this.showingOverlay = true;
        const result = await axios.post(
          serverUrl + "/api/chapters/",
          ChapterData,
          { withCredentials: true }
        );

        if (result.status == 201) {
          const newChapter = result.data;
          newChapter.tempTitle = "";
          newChapter.isShowingAnswered = false;
          this.$store.commit("addChapter", newChapter);
          this.loading = false;
          this.showingOverlay = false;
          this.tempChapterTitle = "";
          this.isAddingChapter = false;
        }
        if (result.status != 201) {
          console.log(result.status);
          this.loading = false;
          this.showingOverlay = false;
          alert(
            "Error while adding the chapter. Please reload the page and try again."
          );
        }
      } catch (error) {
        this.loading = false;
        this.showingOverlay = false;
        console.log(error);
      }
      // await this.fillUserChapters(this.user.bookId);
    },
    cancelNewChapter: function () {
      this.tempChapterTitle = "";
      this.isAddingChapter = false;
    },
    startEditingTitle: async function (id) {
      await this.confirmEditing();
      this.chapters[id].tempTitle = this.chapters[id].title;
      this.editingTitleIndex = id;
      const refName = "title" + id;
      this.cancelNewChapter();
      this.$nextTick(() => {
        this.$refs[refName][0].focus();
      });
    },
    toggleActiveChapter: async function (id) {
      try {
        this.chapters[id].isActive = !this.chapters[id].isActive;

        //if got deactivated cancel editing its title
        if (this.chapters[id].isActive == false) {
          this.cancelEditing(id);
        }
        const toggledChapter = this.chapters[id];
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
        };
        this.loading = true;
        this.showingOverlay = true;
        await axios.put(serverUrl + "/api/chapters/", chapterData, {
          withCredentials: true,
        });
        this.loading = false;
        this.showingOverlay = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.showingOverlay = false;
      }
    },
    startDeletingChapter: function (id) {
      this.deletingChapterId = id;
      this.showingOverlay = true;
      this.isDeletingChapter = true;
    },
    deleteChapter: async function () {
      try {
        const chapter = this.chapters[this.deletingChapterId];
        this.isDeletingChapter = false;
        this.loading = true;

        const result = await axios.delete(
          serverUrl + "/api/chapters/" + chapter._id,
          { withCredentials: true }
        );
        if (result.status == 200) {
          this.chapters.splice(this.deletingChapterId, 1);
          this.showingOverlay = false;
          this.loading = false;
        }
        if (result.status != 200) {
          console.log(result.data);
        }
      } catch (error) {
        console.log(error);
        this.showingOverlay = false;
        this.loading = false;
      }
    },
    selectChapter: async function (event, id, options) {
      if (
        !(
          (event && event.target.classList.contains("chapter-control")) ||
          this.editingTitleIndex == id
        ) ||
        (options && options.noClick)
      ) {
        try {
          this.showingOverlay = true;
          this.loading = true;
          const result = await axios.get(
            serverUrl +
              "/api/chapters/" +
              this.chapters[id]._id +
              "?populated=stories",
            { withCredentials: true }
          );
          if (result.status == 200) {
            const chapter = result.data;
            chapter.tempTitle = "";
            chapter.isShowingAnswered = false;
            chapter.stories.forEach((story, storyIndex) => {
              story.editingTitle = false;
              story.tempTitle = "";
              chapter.stories[storyIndex] = story;
            });
            this.selectedChapter = JSON.parse(JSON.stringify(chapter));

            // SORT BY ORDER ATTRIBUTE

            let orderedStories = [];
            this.selectedChapter.answeredStories.forEach((id) => {
              const storyIndex = this.selectedChapter.stories.findIndex(
                (story) => id == story._id
              );
              if (storyIndex > -1) {
                orderedStories.push(this.selectedChapter.stories[storyIndex]);
                this.selectedChapter.stories.splice(storyIndex, 1);
              }
            });
            this.selectedChapter.stories =
              this.selectedChapter.stories.concat(orderedStories);
            this.backupStories = this.selectedChapter.stories;

            this.selectedChapterIndex = id;
            this.showingOverlay = false;
            this.loading = false;
            this.showingStories = true;
            this.showingChapters = false;
          }
        } catch (error) {
          this.showingOverlay = false;
          this.loading = false;
          console.log(error);
        }
      }
    },

    //stories
    toggleHidingStandard: function () {
      console.log(this.selectedChapter.isHidingStandardStories);
      this.selectedChapter.isHidingStandardStories =
        !this.selectedChapter.isHidingStandardStories;
      this.selectedPaginationIndex = 1;
    },
    startEditingSelectedChapter: function () {
      this.selectedChapter.tempTitle = this.selectedChapter.title;

      this.editingSelectedChapter = true;
      this.$nextTick(() => {
        this.$refs.selectedChapterTitleInput.focus();
      });
    },
    confirmEditingSelectedChapter: async function () {
      if (this.selectedChapter.title != this.selectedChapter.tempTitle) {
        this.selectedChapter.title = this.selectedChapter.tempTitle;
        const confirmedChapter = this.selectedChapter;

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
        };
        this.editingSelectedChapter = false;
        axios
          .put(serverUrl + "/api/chapters/", chapterData, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.status != 200) {
              console.log(response.status);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    startEditingStoryTitle: function (keyStories) {
      console.log(keyStories);
      this.editingSelectedChapter = false;
      this.selectedChapter.tempTitle = "";
      this.selectedChapter.stories.forEach((question, index) => {
        if (question.editingTitle == true) {
          this.confirmEditingStory(index);
        }
      });
      this.selectedChapter.stories[keyStories].tempTitle =
        this.selectedChapter.stories[keyStories].question;
      this.selectedChapter.stories[keyStories].editingTitle = true;
      this.cancelNewStory();
      const refName = "title" + this.selectedChapterIndex + "-" + keyStories;
      this.cancelNewChapter();
      this.$nextTick(() => {
        this.$refs[refName][0].focus();
      });
    },
    confirmEditingStory: async function (keyStories) {
      try {
        const { question, tempTitle } =
          this.selectedChapter.stories[keyStories];
        if (question != tempTitle) {
          this.loading = true;
          this.showingOverlay = true;
          const result = await axios.get(
            serverUrl +
              "/api/stories/" +
              this.selectedChapter.stories[keyStories]._id
          );
          const story = result.data;
          story.question = tempTitle;
          const result2 = await axios.put(serverUrl + "/api/stories/", story, {
            withCredentials: true,
          });
          if (result2.status == 200) {
            this.selectedChapter.stories[keyStories].question = tempTitle;
            this.loading = false;
            this.showingOverlay = false;
          }
        }
        this.selectedChapter.stories[keyStories].editingTitle = false;
      } catch (error) {
        this.loading = false;
        this.showingOverlay = false;
        console.log(error);
      }
    },
    cancelEditingStory: function (keyStories) {
      this.selectedChapter.stories[keyStories].tempTitle = "";
      this.selectedChapter.stories[keyStories].editingTitle = false;
    },
    startAddingStory: function () {
      this.selectedChapter.stories.forEach((question, index) => {
        if (question.editingTitle == true) {
          this.confirmEditingStory(index);
        }
      });
      this.isAddingQuestion = true;
      this.$nextTick(() => {
        this.$refs.newQuestionInput.focus();
      });
    },
    confirmNewStory: async function () {
      try {
        const newStory = {
          bookId: this.book._id,
          chapterId: this.selectedChapter._id,
          question: this.tempQuestionTitle,
          title: "",
          isAnswered: false,
          isStandard: false,
          order: this.selectedChapter.stories.length,
          textContent: "",
          imageCaption: "",
          imageFileNameServer: "",
          imageFileName: "",
          lastUpdated: new Date(),
          pagesCount: 0,
        };
        this.loading = true;
        this.showingOverlay = true;

        const result = await axios.post(serverUrl + "/api/stories/", newStory, {
          withCredentials: true,
        });
        if (result.status == 200) {
          newStory._id = result.data._id;
          newStory.editingTitle = false;
          newStory.tempTitle = "";
          this.selectedChapter.storiesCount++;
          this.selectedChapter.stories.push(newStory);
        } else {
          console.log(result.data);
        }

        this.loading = false;
        this.showingOverlay = false;
        this.tempQuestionTitle = "";

        this.isAddingQuestion = false;
      } catch (error) {
        this.loading = false;
        this.showingOverlay = false;
        this.tempQuestionTitle = "";
        this.isAddingQuestion = false;
        console.log(error);
      }
    },
    startDeletingStory: function (Qid) {
      this.deletingStoryId = Qid;
      this.showingOverlay = true;
      this.isDeletingStory = true;
    },
    deleteStory: async function () {
      try {
        const story = this.selectedChapter.stories[this.deletingStoryId];
        this.isDeletingStory = false;
        this.loading = true;

        const result = await axios.delete(
          serverUrl + "/api/stories/" + story._id,
          { withCredentials: true }
        );
        if (result.status == 200) {
          const result2 = await axios.get(
            serverUrl +
              "/api/chapters/" +
              this.selectedChapter._id +
              "?populated=stories",
            { withCredentials: true }
          );
          if (result2.status == 200) {
            const chapter = result2.data;
            chapter.isShowingAnswered = this.selectedChapter.isShowingAnswered;
            chapter.tempTitle = "";
            chapter.stories.forEach((story, storyIndex) => {
              story.editingTitle = false;
              story.tempTitle = "";
              chapter.stories[storyIndex] = story;
            });
            this.selectedChapter = JSON.parse(JSON.stringify(chapter));
            // SORT BY ORDER ATTRIBUTE

            let orderedStories = [];
            this.selectedChapter.answeredStories.forEach((id) => {
              const storyIndex = this.selectedChapter.stories.findIndex(
                (story) => id == story._id
              );
              if (storyIndex > -1) {
                orderedStories.push(this.selectedChapter.stories[storyIndex]);
                this.selectedChapter.stories.splice(storyIndex, 1);
              }
            });
            this.selectedChapter.stories =
              this.selectedChapter.stories.concat(orderedStories);
            this.backupStories = this.selectedChapter.stories;

            this.showingOverlay = false;
            this.loading = false;
          }
        }

        this.selectedPaginationIndex = 1;
        this.showingOverlay = false;
        this.loading = false;

        if (result.status != 200) {
          console.log(result.data);
        }
      } catch (error) {
        this.showingOverlay = false;
        this.loading = false;
        console.log(error);
      }
    },
    cancelDeletingStory: function () {
      this.isDeletingStory = false;
      this.deletingStoryId = null;
      this.showingOverlay = false;
    },
    cancelNewStory: function () {
      this.tempQuestionTitle = "";
      this.isAddingQuestion = false;
    },
    showChapters: async function () {
      this.editingSelectedChapter = false;
      this.selectedChapter.tempTitle = "";
      this.showingOverlay = true;
      this.loading = true;
      await this.$store.dispatch("fetchChapters");
      this.showingOverlay = false;
      this.loading = false;
      this.selectedPaginationIndex = 1;
      this.tempSelectedPaginationIndex = 1;
      this.showingStories = false;
      this.showingChapters = true;
      this.selectedChapterIndex = null;
      this.selectedChapter = null;
      this.backupStories = [];
    },
    showStoryForm: async function (event, keyStories, options) {
      if (
        (!event.target.classList.contains("question-control") &&
          !this.selectedChapter.stories[keyStories].editingTitle) ||
        (options && options.noClick)
      ) {
        try {
          if (options && options.noClick) {
            this.clearAutoSave();
          }
          this.editingSelectedChapter = false;
          this.selectedChapter.tempTitle = "";
          this.showingOverlay = true;
          this.loading = true;

          const result = await axios.get(
            serverUrl +
              "/api/stories/" +
              this.selectedChapter.stories[keyStories]._id,
            { withCredentials: true }
          );
          if (result.status == 200) {
            const story = result.data;
            story.editingTitle = false;
            story.tempTitle = "";
            this.selectedStory = JSON.parse(JSON.stringify(story));
            this.SelectedStoryIndex = keyStories;
            this.showingForm = true;
            this.showingStories = false;
            this.showingOverlay = false;
            this.loading = false;
            this.startAutoSave();
          }
        } catch (error) {
          console.log(error);
          this.showingOverlay = false;
          this.loading = false;
        }
      }
    },

    //form
    startAutoSave: function () {
      try {
        const story = this.selectedStory;

        this.previousFormData = JSON.stringify({
          question: story.question,
          title: story.title,
          textContent: story.textContent,
          caption: story.imageCaption,
        });

        this.autosaveInterval = setInterval(
          this.saveAnswer,
          2000,
          this.selectedChapterIndex,
          this.SelectedStoryIndex
        );
      } catch (error) {
        console.log(error);
        if (this.autosaveInterval) clearInterval(this.autosaveInterval);
      }
    },
    clearAutoSave: function () {
      this.previousFormData = "";
      clearInterval(this.autosaveInterval);
    },
    activateFileSelection: function (cId, qId) {
      const s = "Image" + qId + "Q" + cId + "C";
      const fileInput = this.$refs[s];
      if (fileInput) fileInput.click();
    },
    encodeImageFileAsURL: function (cId, qId) {
      const s = "Image" + qId + "Q" + cId + "C";
      const file = this.$refs[s].files[0];
      let reader = new FileReader();
      reader.onloadend = async () => {
        if (reader.result) {
          const fileSizeMB = file.size / 1024 / 1024;
          if (fileSizeMB > 0.1) {
            let image = new Image();
            image.src = reader.result;
            image.onload = () => {
              // have to wait till it's loaded
              const canvas = this.$refs.imageCanvas;
              const { height, width } = image;
              const widthRatio = 900 / width;
              const heightRatio = 600 / height;
              const chosenRatio =
                widthRatio > heightRatio ? heightRatio : widthRatio;

              console.log(chosenRatio);
              canvas.width = width * chosenRatio;
              canvas.height = height * chosenRatio;

              let ctx = canvas.getContext("2d");
              ctx.drawImage(
                image,
                0,
                0,
                width * chosenRatio,
                height * chosenRatio
              );
              let compRatio = 0;
              if (fileSizeMB > 1) {
                compRatio = (1 / fileSizeMB).toFixed(1);
              } else {
                compRatio = 1;
              }
              console.log(Number(compRatio));
              const imageData = canvas.toDataURL("image/jpeg");
              this.selectedStory.imageBase64 = imageData;
              this.selectedStory.imageFileName = file.name;
            };
          } else {
            this.selectedStory.imageBase64 = reader.result;
            this.selectedStory.imageFileName = file.name;
          }
          await this.uploadStoryImage();
        } else {
          alert("La sélection du fichier a échoué, veuillez réessayer.");
        }
      };
      const pattern = /image-*/;

      if (!file.type.match(pattern)) {
        alert(
          "Format du fichier invalide, veuillez selectionner une image de type JPEG, PNG ou GIF. uploaded file type: " +
            file.type
        );
        return;
      }

      const filesize = (file.size / 1024 / 1024).toFixed(4); // MB

      if (
        file.name != "item" &&
        typeof file.name != "undefined" &&
        filesize > 15
      ) {
        alert("La taille de l'image doit être inférieure à 15Mo");
        return;
      }
      reader.readAsDataURL(file);
    },
    encodeImageFileAsURLOLD: function (cId, qId) {
      const s = "Image" + qId + "Q" + cId + "C";
      const file = this.$refs[s].files[0];
      let reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          this.selectedStory.imageBase64 = reader.result;
          this.selectedStory.imageFileName = file.name;
          this.saveAnswer();
        } else {
          alert("La sélection du fichier a échoué, veuillez réessayer.");
        }
      };
      reader.readAsDataURL(file);
    },
    deleteStoryImage: async function () {
      try {
        const story = this.selectedStory;
        this.loading = true;
        this.showingOverlay = true;

        if (story.textContent.length > 0) {
          story.isAnswered = true;
          const ornament = await fetch(serverUrl + "/book ornament.jpg").then(
            (res) => res.arrayBuffer()
          );
          story.pagesCount = await calculateStoryPages(story, ornament);
        } else {
          story.isAnswered = false;
          story.pagesCount = 0;
        }

        const { bookId, chapterId, pagesCount } = story;
        const id = story._id;
        const response = await axios.put(
          serverUrl + "/api/stories/delete-image",
          {
            id,
            bookId,
            chapterId,
            pagesCount,
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          this.selectedStory.imageFileNameServer = "";
          this.selectedStory.imageFileName = "";
          this.selectedStory.imageBase64 = "";
        }
        this.loading = false;
        this.showingOverlay = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.showingOverlay = false;
      }
    },
    uploadStoryImage: async function () {
      const story = this.selectedStory;
      try {
        if (story.textContent.length > 0) {
          story.isAnswered = true;
          const ornament = await fetch(serverUrl + "/book ornament.jpg").then(
            (res) => res.arrayBuffer()
          );
          story.pagesCount = await calculateStoryPages(story, ornament);
        } else {
          story.isAnswered = false;
          story.pagesCount = 0;
        }
        const {
          _id,
          chapterId,
          imageFileNameServer,
          imageFileName,
          imageBase64,
          pagesCount,
        } = story;
        this.loadingImageUpload = true;
        const result = await axios.put(
          serverUrl + "/api/stories/image",
          {
            _id,
            chapterId,
            bookId: this.book._id,
            imageFileNameServer,
            imageFileName,
            imageBase64,
            pagesCount,
          },
          { withCredentials: true }
        );
        this.loadingImageUpload = false;
        if (result.status == 200) {
          this.selectedStory.imageFileNameServer =
            result.data.imageFileNameServer;
        }
      } catch (error) {
        this.loadingImageUpload = false;
        alert("Erreur lors du téléchargement de l'image, veuillez réessayer.");
        console.log(error);
      }
    },
    saveAnswer: async function () {
      try {
        const story = this.selectedStory;
        story.imageCaption = story.imageCaption.replaceAll("\n", "");

        let currentStoryString = JSON.stringify({
          question: story.question,
          title: story.title,
          textContent: story.textContent,
          caption: story.imageCaption,
        });
        if (currentStoryString != this.previousFormData) {
          story.lastUpdated = new Date();
          this.previousFormData = currentStoryString;
          if (story.textContent.length > 0) {
            story.isAnswered = true;
            const ornament = await fetch(serverUrl + "/book ornament.jpg").then(
              (res) => res.arrayBuffer()
            );
            story.pagesCount = await calculateStoryPages(story, ornament);
          } else {
            story.isAnswered = false;
            story.pagesCount = 0;
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
          } = story;

          this.loadingForm = true;
          this.formSavingError = false;

          console.log("updating..");
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
          );
          if (result.status == 200) {
            const newPagesCount = this.calculatePagesCount();
            this.$store.commit("updatePagesCount", {
              index: this.selectedChapterIndex,
              newPagesCount,
            });
          }

          this.loadingForm = false;

          console.log("done..");
        }
      } catch (error) {
        this.loadingForm = false;
        this.formSavingError = true;
        console.log(error);
      }
    },
    calculatePagesCount: function () {
      const answeredStories = this.selectedChapter.stories.filter(
        (story) => story.isAnswered
      );
      const pagesCount = answeredStories.reduce((prev, current) => {
        return prev + current.pagesCount;
      }, 0);
      if (pagesCount > 0) return pagesCount + 1;
      else return pagesCount;
    },
    hideStoryForm: async function () {
      this.SelectedStoryIndex = null;
      this.selectedStory = null;
      this.showingForm = false;
      this.clearAutoSave();
      const showingAnswered = this.selectedChapter.isShowingAnswered;
      await this.selectChapter(null, this.selectedChapterIndex, {
        noClick: true,
      });
      this.selectedChapter.isShowingAnswered = showingAnswered;
    },

    //pagination handling
    decrementPagination: function () {
      if (this.selectedPaginationIndex > 1) {
        this.selectedPaginationIndex = this.selectedPaginationIndex - 1;
        this.tempSelectedPaginationIndex = this.selectedPaginationIndex;
      }
    },
    incrementPagination: function () {
      if (this.selectedPaginationIndex < this.paginationsCount) {
        this.selectedPaginationIndex = this.selectedPaginationIndex + 1;
        this.tempSelectedPaginationIndex = this.selectedPaginationIndex;
      }
    },
    validatePagination: function () {
      if (this.tempSelectedPaginationIndex > this.paginationsCount) {
        this.tempSelectedPaginationIndex = this.paginationsCount;
      }
      if (this.tempSelectedPaginationIndex < 1) {
        this.tempSelectedPaginationIndex = 1;
      }
    },
    changePagination: function () {
      if (this.tempSelectedPaginationIndex != this.selectedPaginationIndex) {
        this.selectedPaginationIndex = this.tempSelectedPaginationIndex;
      } else {
        this.$refs["pagination-input"].focus();
      }
    },
  },
  computed: {
    paginationsCount: function () {
      if (this.selectedChapter.isShowingAnswered) {
        return 1;
      }

      console.log(
        "total paginations: ",
        Math.ceil(this.paginationArray.length / 4)
      );
      return Math.ceil(this.paginationArray.length / 4);
    },
    paginationInterval: function () {
      if (this.selectedChapter.isShowingAnswered) {
        return this.paginationArray;
      } else {
        return this.paginationArray.slice(
          4 * (this.selectedPaginationIndex - 1),
          4 * this.selectedPaginationIndex
        );
      }
    },
    paginationArray: function () {
      const indexes = [];
      let iterator = 0;
      while (iterator < this.selectedChapter.stories.length) {
        const showingAnswered = this.selectedChapter.isShowingAnswered;
        const isAnswered = this.selectedChapter.stories[iterator].isAnswered;
        const isHidingStandardStories =
          this.selectedChapter.isHidingStandardStories;
        const isStandard = this.selectedChapter.stories[iterator].isStandard;
        if (
          (isAnswered && showingAnswered) ||
          (!isAnswered &&
            !showingAnswered &&
            !(isHidingStandardStories && isStandard))
        ) {
          indexes.push(iterator);
        }
        iterator++;
      }
      return indexes;
    },
    user: function () {
      return this.$store.getters.getUser;
    },
    chapters: function () {
      return this.$store.getters.getChapters;
    },
    book: function () {
      return this.$store.getters.getBook;
    },
    selectedChapterAnsweredCount: function () {
      if (!this.selectedChapter.stories) {
        return 0;
      }
      let count = 0;
      this.selectedChapter.stories.forEach((story) => {
        if (story.isAnswered) {
          count++;
        }
      });
      return count;
    },
    // showUpArrowDrag: function () {},
    // showDownArrowDrag: function () {
    //   return false;
    //   const containerRef = this.$refs.questions_section_container;
    //   if (!containerRef) {
    //     return false;
    //   }
    //   const scrollTop = containerRef.scrollTop;
    //   const scrollHeight = containerRef.scrollHeight;
    //   const clientHeight = containerRef.clientHeight;
    //   const scrollOffsetPercent = Number(
    //     (scrollTop / (scrollHeight - clientHeight)).toFixed(1)
    //   );
    //   if (
    //     (this.draggingIndexQuestions != -1 ||
    //       this.draggingIndexChapters != -1) &&
    //     scrollOffsetPercent < 1
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
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
  //         vm.$router.push("/login");
  //       }
  //     });
  //   }
  // },
  async mounted() {
    try {
      this.showingOverlay = true;
      this.loading = true;
      console.log("DEBUG - fetching chapters");
      await this.$store.dispatch("fetchChapters");
      this.showingOverlay = false;
      this.loading = false;
    } catch (error) {
      console.log(error);
      this.showingOverlay = false;
      this.loading = false;
    }
  },
};
</script>

<style>
/* ************** */
/* chapters section */
/* ************** */

.chapter-head {
  background-color: white;
  border-radius: 25px;
  margin-bottom: 22px;
  padding: 29px 32px;
  width: 100%;
  align-items: center;
  cursor: pointer;
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

.chapter-title {
  font-weight: 400;
  font-size: 18px;
  line-height: 27px;
  color: #062a20;
}
.pen-icon-img {
  vertical-align: sub;
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

.tab-btn {
  padding: 5px 23px;
  font-family: galaxie-polaris;
  font-weight: 400;
  font-size: 18px;
  line-height: 27px;
  background: transparent;
  border-radius: 10px 10px 0px 0px;
  border: none;
  color: rgba(6, 42, 32, 0.4);
}
.tab-btn.active {
  background: #e1504b;
  color: white;
}

.tab-btn:hover {
  cursor: pointer;
}

.questions-container {
  background: white;
  padding: 37px 27px;
  border: 1px solid rgba(6, 42, 32, 0.2);
  border-radius: 0px 30px 30px 30px;
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
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='18' ry='18' stroke='%23E1504BFF' stroke-width='2' stroke-dasharray='16%2c 16' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
  border-radius: 18px;
  padding: 20px;
  box-sizing: border-box;
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
.question-title-input::placeholder {
  color: rgba(6, 42, 32, 0.4);
}

.question-title {
  font-family: galaxie-polaris;
  font-style: normal;
  font-weight: 500;
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
  width: 46px;
  height: 46px;
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

@media screen and (max-width: 1024px) {
  .container {
    width: 100%;
    min-height: calc(100% - 64px);
  }
  .route-section {
    padding: 24px;
  }
  .drag-container {
    display: none;
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
  .back-container {
    display: none;
  }
  .tab-btn {
    padding: 6px 24px 12px 24px;
    font-size: 16px;
    line-height: 18px;
  }
  .toggle-standard {
    display: none;
  }
  .toggle-standard-mobile {
    display: flex;
  }
  .questions-container {
    padding: 19px 17px;
  }

  .hide-standards-text {
    font-size: 12px;
    line-height: 18px;
    font-family: galaxie-polaris;
    color: #062a20;
  }
  .add-question-container {
    padding: 7px;
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

  .question-head {
    display: block;
    padding: 13px 13px 13px 16px;
    background: #ffffff;
    border: 1px solid rgba(6, 42, 32, 0.1);
    border-radius: 18px;
    margin-top: 14px;
  }
  .question-title-container {
    margin-bottom: 15px;
  }

  .question-title {
    font-family: galaxie-polaris;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
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
    right: 20px;
    top: 3px;
    padding-bottom: 3px;
  }

  .open-question-image {
    height: 18px;
    width: 18px;
    display: block;
  }

  .route-title.form-question {
    font-size: 14px;
    font-weight: 500;
    line-height: 15px;
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
    width: 38px;
    height: 38px;
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