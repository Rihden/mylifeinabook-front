<template>
  <div v-if="!isLoaded" class="app-loader">
    <div>
      <div style="margin-bottom: 28px">
        <img
          src="../assets/logo - black.png"
          alt="logo ma vie"
          height="107px"
          width="83px"
        />
      </div>
      <div class="lds-dual-ring" style="width: 30px; height: 30px"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoaded: false,
    };
  },
  mounted() {
    document.onreadystatechange = () => {
      if (document.readyState == "complete") {
        this.isLoaded = true;
      }
    };
  },
};
</script>

<style>
.app-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  height: webkit-fill-available;
  width: 100%;
  background: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}

@media screen and (max-width: 1000px) {
  .app-loader {
    height: calc(100vh - calc(100vh - 100%));
  }
}
</style>