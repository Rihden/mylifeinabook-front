import Vuex from "vuex"
import Vue from "vue"
import axios from "axios"
import { serverUrl } from "../severUrl"
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loggedIn: false,
    chapters: [],
    populatedChapters: [],
    user: null,
    book: null,
    pdfFile: null,
  },
  getters: {
    getUser(state) {
      return state.user
    },
    getChapters(state) {
      return state.chapters
    },
    getBook(state) {
      return state.book
    },
    getBookPagesCount(state) {
      if (state.populatedChapters) {
        const activeChapters = state.populatedChapters.filter((chapter) => {
          return chapter.isActive
        })
        return activeChapters.reduce((prev, current) => {
          return prev + current.pagesCount
        }, 0)
      } else {
        return 0
      }
    },
    getAnsweredCount(state) {
      let answeredCount = 0
      if (state.book) {
        state.book.chapters.forEach((chapter) => {
          if (chapter.isActive) answeredCount += chapter.answeredStoriesCount
        })
      }
      return answeredCount
    },
    getTotalImagesCount(state) {
      let totalImages = 0
      if (state.populatedChapters) {
        state.populatedChapters.forEach((chapter) => {
          if (chapter.isActive)
            chapter.stories.forEach((story) => {
              if (story.imageFileNameServer && story.isAnswered) {
                totalImages++
              }
            })
        })
      }
      return totalImages
    },
    getPdfFile(state) {
      return state.pdfFile
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setBook(state, book) {
      state.book = book
    },
    setChapters(state, chapters) {
      state.chapters = chapters
    },
    setPopulatedChapters(state, chapters) {
      state.populatedChapters = chapters
    },
    updateChapter(state, payload) {
      state.chapters[payload.index] = payload.chapter
    },
    addChapter(state, newChapter) {
      state.chapters.push(newChapter)
    },
    updatePagesCount(state, { index, newPagesCount }) {
      state.chapters[index].pagesCount = newPagesCount
    },
    setPdfFile(state, pdfFile) {
      state.pdfFile = pdfFile
    },
  },
  actions: {
    async fetchPopulatedChapters(context) {
      return new Promise((resolve, reject) => {
        const bookId = context.state.user?.defaultBookId
          ? context.state.user.defaultBookId
          : context.state.user.bookId
        if (bookId) {
          axios
            .get(serverUrl + "/api/books/" + bookId + "?populated=true", {
              withCredentials: true,
            })
            .then((response) => {
              if (response.status == 200) {
                context.commit("setBook", response.data)
                const chapters = response.data.chapters
                const chapterId = chapters[0]?._id
                let answeredStories = []
                let answeredStoriesCount = 0
                let storiesCount = 0
                let pagesCount = 0
                let storiesList = []
                if (chapters.length > 1) {
                  chapters.forEach(async (chapter, index) => {
                    if (chapter?.stories?.length > 0) {
                      chapter.tempTitle = chapter.title
                      chapter.isShowingAnswered = false
                      answeredStories.push(chapter.answeredStories)
                      answeredStoriesCount =
                        answeredStoriesCount + chapter.answeredStoriesCount
                      pagesCount = pagesCount + chapter.pagesCount
                      storiesCount = storiesCount + chapter.storiesCount

                      const stories = chapter.stories
                      stories?.forEach(async (story) => {
                        story.chapterId = chapterId
                        await axios.put(serverUrl + "/api/stories/", story, {
                          withCredentials: true,
                        })
                      })
                      storiesList.push(stories)
                      if (index == 0) {
                        chapters[0] = chapter
                      }
                    }
                  })
                  chapters[0].answeredStories = answeredStories
                  chapters[0].answeredStoriesCount = answeredStoriesCount
                  chapters[0].storiesCount = storiesCount
                  chapters[0].pagesCount = pagesCount
                  chapters[0].stories = storiesList
                } else {
                  chapters[0].isShowingAnswered = false
                }
                context.commit("setChapters", chapters)
                context.commit("setPopulatedChapters", chapters)

                resolve()
              }
            })
            .catch((error) => {
              console.log(error)
              reject(error)
            })
        } else {
          reject("DEBUG - No bookId saved in store")
        }
      })
    },
  },
})

export default store
