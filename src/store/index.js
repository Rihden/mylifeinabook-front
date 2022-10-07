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
    async fetchChapters(context) {
      return new Promise((resolve, reject) => {
        const bookId = context.state.user?.defaultBookId
          ? context.state.user.bookId
          : context.state.user.bookId
        console.log("bookId: ", bookId)
        if (bookId) {
          axios
            .get(serverUrl + "/api/books/" + bookId + "?populated=true", {
              withCredentials: true,
            })
            .then((response) => {
              if (response.status == 200) {
                context.commit("setBook", response.data)
                // order chapters and add tempTitle + isShowingAnswered attributes
                const unorderedChapters = response.data.chapters
                let orderedChapters = []
                const chaptersOrder = response.data.chaptersOrder
                const chapterId = unorderedChapters[0]?._id
                let answeredStories = []
                let answeredStoriesCount = 0
                let storiesCount = 0
                let pagesCount = 0
                let storiesList = []
                if (unorderedChapters.length > 0) {
                  chaptersOrder.forEach((id) => {
                    //find index of current chapter
                    const index = unorderedChapters.findIndex((chapter) => {
                      return chapter._id == id
                    })
                    //add temptitle and showingAnswered
                    unorderedChapters[index].tempTitle =
                      unorderedChapters[index].title
                    unorderedChapters[index].isShowingAnswered = false

                    //push to ordered array
                    orderedChapters.push(unorderedChapters[index])
                  })
                  if (orderedChapters.length > 1) {
                    orderedChapters.forEach(async (chapter, index) => {
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
                        orderedChapters[0] = chapter
                      } else {
                        await axios.delete(
                          serverUrl + "/api/chapters/" + chapter._id,
                          { withCredentials: true }
                        )
                      }
                    })
                    orderedChapters[0].answeredStories = answeredStories
                    orderedChapters[0].answeredStoriesCount =
                      answeredStoriesCount
                    orderedChapters[0].storiesCount = storiesCount
                    orderedChapters[0].pagesCount = pagesCount
                    orderedChapters[0].stories = storiesList
                  }
                }
                context.commit("setChapters", orderedChapters)
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
    async fetchPopulatedChapters(context) {
      return new Promise((resolve, reject) => {
        const bookId = context.state.user?.defaultBookId
          ? context.state.user.defaultBookId
          : context.state.user.bookId
        console.log(
          "context.state.user?.defaultBookId",
          context.state.user?.defaultBookId
        )
        console.log("fetchPopulatedChapters", bookId)
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
                      } /*else {
                      await axios.delete(
                        serverUrl + "/api/chapters/" + chapter._id,
                        { withCredentials: true }
                      )
                    }*/
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
