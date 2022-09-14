<template>
  <div class="d-row site-background">
    <navbar></navbar>
    <div class="container" style="height: 100%">
      <div class="route-section d-col preview">
        <div class="route-title-container">
          <span class="route-title title-section">Review content</span>
        </div>
        <div class="preview-container">
          <div class="d-flex-centered" style="height: 100%">
            <pdf v-if="pdfFile"></pdf>
            <div
              v-if="!pdfFile"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 100%;
              "
            >
              <div class="lds-dual-ring"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { generateBook } from "../interiorGeneration";
import { serverUrl } from "../severUrl";
import axios from "axios";
import navbar from "../components/navbar.vue";
// import pdfobject from "pdfobject";
import pdf from "../components/PDFJSViewer.vue";

export default {
  components: {
    navbar,
    pdf,
  },
  data() {
    return {
      isLoadingPdf: false,
    };
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser;
    },
    pdfFile: function () {
      return this.$store.getters.getPdfFile;
    },
  },
  methods: {
    applyContent: async function () {
      try {
        const result = await axios.get(
          serverUrl + "/api/books/" + this.user.bookId + "?populated=true",
          { withCredentials: true }
        );
        const ornament = await fetch(serverUrl + "/book ornament.jpg").then(
          (res) => res.arrayBuffer()
        );
        const bookStyles = { ornament };
        const book = JSON.parse(JSON.stringify(result.data));
        //sort stories inside each chapter
        book.chapters.forEach((chapter, chapterIndex) => {
          let orderedStories = [];
          chapter.answeredStories.forEach((id) => {
            const storyIndex = chapter.stories.findIndex(
              (story) => id == story._id
            );
            if (storyIndex > -1) {
              orderedStories.push(chapter.stories[storyIndex]);
              chapter.stories.splice(storyIndex, 1);
            }
          });
          book.chapters[chapterIndex].stories =
            chapter.stories.concat(orderedStories);
        });

        //sort chapters
        const unorderedChapters = book.chapters;
        let orderedChapters = [];
        const chaptersOrder = book.chaptersOrder;
        if (unorderedChapters.length > 0) {
          chaptersOrder.forEach((id) => {
            //find index of current chapter
            const index = unorderedChapters.findIndex((chapter) => {
              return chapter._id == id;
            });
            //push to ordered array
            orderedChapters.push(unorderedChapters[index]);
          });
        }
        book.chapters = orderedChapters;

        const resultBookStats = await axios.get(
          serverUrl + "/api/books/stats/" + this.user.bookId,
          { withCredentials: true }
        );
        const pagesCount = resultBookStats.data.pagesCount;
        book.pagesCount = pagesCount;
        const buffer = await generateBook(book, bookStyles);
        const blob = new Blob([buffer], {
          type: "application/pdf",
        });
        const pdfFile = URL.createObjectURL(blob);
        this.$store.commit("setPdfFile", pdfFile);

        // pdfobject.embed(buffer, "#testPdf", {
        //   assumptionMode: false,
        //   forcePDFJS: true,
        //   width: "600px",
        //   height: "500px",
        //   PDFJS_URL: "lib/pdfjs-2.12.313-dist/web/viewer.html",
        //   forceIframe: true,
        // });
      } catch (error) {
        console.log(error);
      }
    },
  },
  async mounted() {
    try {
      await this.applyContent();
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style>
.preview-container {
  background: white;
  padding: 79px 160px 30px 160px;
  border: 1px solid rgba(6, 42, 32, 0.2);
  box-sizing: border-box;
  border-radius: 30px;
  flex-grow: 1;
}
.route-section.preview {
  height: 100%;
}

@media screen and (max-width: 1024px) {
  .preview-container {
    background: transparent;
    padding: 0px;
    border: none;
    border-radius: 0px;
  }
  .site-background.preview {
    height: calc(100vh - calc(100vh - 100%));
  }
  .route-title-container {
    margin-top: 0px;
  }
}
</style>