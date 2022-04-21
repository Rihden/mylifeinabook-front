<template>
  <div class="d-flex-centered" style="height: 100vh">
    <div class="d-row">
      <div class="d-col" style="margin-right: 80px">
        <div class="line-container">
          <span class="font-1 w-300">Galaxie Polaris Light 300</span>
        </div>
        <div class="line-container">
          <span class="font-1 w-400">Galaxie Polaris Book 400</span>
        </div>
        <div class="line-container">
          <span class="font-1 w-500">Galaxie Polaris Medium 500</span>
        </div>
        <div class="line-container">
          <span class="font-1 w-600">Galaxie Polaris Bold 600</span>
        </div>
        <div class="line-container">
          <span class="font-1 w-600">Galaxie Polaris Heavy 700</span>
        </div>
      </div>
      <div class="d-col" style="margin-right: 80px; flex-gap: 20px">
        <div class="line-container">
          <span class="font-2 w-300">...........................</span>
        </div>
        <div class="line-container">
          <span class="font-2 w-400">Polaris Book 400</span>
        </div>
        <div class="line-container">
          <span class="font-2 w-500">Polaris Meduim 500</span>
        </div>
        <div class="line-container">
          <span class="font-2 w-300">...........................</span>
        </div>
        <div class="line-container">
          <span class="font-2 w-300">...........................</span>
        </div>
      </div>
      <div class="d-col" style="margin-right: 40px">
        <div class="line-container">
          <span class="font-3 w-300">...........................</span>
        </div>
        <div class="line-container">
          <span class="font-3 w-400">PT-Serif Book 400</span>
        </div>
        <div class="line-container">
          <span class="font-3 w-300">...........................</span>
        </div>
        <div class="line-container">
          <span class="font-3 w-600">PT-Serif Bold 600</span>
        </div>
        <div class="line-container">
          <span class="font-3 w-300">...........................</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style scoped>
@font-face {
  font-family: galaxie-polaris;
  font-weight: 300;
  src: url("/fonts/galaxie polaris/Galaxie Polaris Light.otf");
}

@font-face {
  font-family: galaxie-polaris;
  font-weight: 400;
  src: url("/fonts/galaxie polaris/Galaxie Polaris Book.otf");
}

@font-face {
  font-family: galaxie-polaris;
  font-weight: 500;
  src: url("/fonts/galaxie polaris/Galaxie Polaris Medium.otf");
}

@font-face {
  font-family: galaxie-polaris;
  font-weight: 600;
  src: url("/fonts/galaxie polaris/Galaxie Polaris Bold.otf");
}

@font-face {
  font-family: galaxie-polaris;
  font-weight: 700;
  src: url("/fonts/galaxie polaris/Galaxie Polaris Heavy.otf");
}

@font-face {
  font-family: polaris;
  font-weight: 400;
  src: url("/fonts/polaris/GalaxiePolaris-Book.otf");
}

@font-face {
  font-family: polaris;
  font-weight: 500;
  src: url("/fonts/polaris/GalaxiePolaris-Medium.otf");
}

@font-face {
  font-family: PT-serif;
  src: url("/fonts/PTSerif-Regular.ttf");
  font-weight: 400;
}

@font-face {
  font-family: PT-serif;
  src: url("/fonts/PTSerif-Bold.ttf");
  font-weight: 600;
}

.line-container {
  min-height: 60px;
  font-size: 32px;
}

.font-1 {
  font-family: galaxie-polaris;
}

.font-2 {
  font-family: polaris;
}
.font-3 {
  font-family: PT-serif;
}

.w-300 {
  font-weight: 300;
}
.w-400 {
  font-weight: 400;
}
.w-500 {
  font-weight: 500;
}
.w-600 {
  font-weight: 600;
}
.w-700 {
  font-weight: 700;
}
</style>