<template>
  <div class="main-container d-flex-centered">
    <div>
      <div class="not-found-number-container">
        <span class="not-found-number">404</span>
      </div>
      <div class="not-found-title-container">
        <span class="not-found-title">OUPS ! There is nothing here.</span>
      </div>
      <div>
        <span class="not-found-info"
          >Go to back to the homepage,
          <router-link to="/">click here.</router-link>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.main-container {
  height: 100%;
  background: #f6f4f3;
}
.not-found-number {
  display: block;
  text-align: center;
  font-family: galaxie-polaris;
  font-style: normal;
  font-weight: 600;
  font-size: 224px;
  line-height: 239px;
  color: #e1504b;
}

.not-found-number-container {
  margin-bottom: 39px;
}

.not-found-title {
  display: block;
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  line-height: 26px;

  /* black */
  color: #062a20;
}

.not-found-title-container {
  margin-bottom: 6px;
}

.not-found-info {
  display: block;
  color: #062a20;
  font-size: 16px;
  line-height: 24px;
  font-family: galaxie-polaris;
  font-weight: 400;
  text-align: center;
}

@media screen and (max-width: 1024px) {
  .not-found-number {
    font-size: 74px;
    line-height: 80px;
  }
  .not-found-number-container {
    margin-bottom: 16px;
  }
  .not-found-title {
    font-size: 18px;
  }
  .not-found-info {
    font-size: 14px;
  }
}
</style>