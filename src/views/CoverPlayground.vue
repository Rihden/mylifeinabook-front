<template>
  <div
    style="display: flex; justify-content: center; align-items: center"
  ></div>
</template>

<script>
import axios from "axios"
import { generateFullCover } from "../pdfCover"
import { serverUrl } from "../severUrl"
export default {
  data() {
    return {
      pdfFile: "",
      loading: false,
    }
  },
  async mounted() {
    const orderId = this.$route.params.orderId
    try {
      let loggedUserString = localStorage.getItem("user")
      let parsed = JSON.parse(loggedUserString)
      if (!loggedUserString || parsed.orderId != orderId) {
        const response = await axios.get(
          serverUrl + "/auth/login?orderId=" + orderId
        )
        if (response.status == 200) {
          parsed = response.data
          localStorage.setItem("user", JSON.stringify(parsed))
          this.$emit("login")
        }
      }

      this.user = parsed

      const result = await axios.get(serverUrl + "/api/cover-styles")
      this.styles = result.data
      const bookId = this.user?.defaultBookId
        ? this.user?.defaultBookId
        : this.user.bookId
      const book = await axios.get(serverUrl + "/api/books/" + bookId)
      this.book = book.data
      this.loading = true
      this.pdfFile = await generateFullCover(this.book, this.styles[1])
      this.loading = false
    } catch (error) {
      console.log(error)
    }
  },
}
</script>

<style></style>
