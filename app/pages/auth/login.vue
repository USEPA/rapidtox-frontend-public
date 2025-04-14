<script setup lang="ts">
const {APPLICATION_ROUTER_BASE} = useRuntimeConfig().public;
const loginPath = `${APPLICATION_ROUTER_BASE}auth/oidc/login`;
</script>

<template>
  <NuxtLayout name="default">
    <main
      id="main"
      class="container-fluid main-content px-0"
    >
      <div class="container-fluid app-container">
        <div class="row justify-content-center">
          <div class="col">
            <h1 class="page-title">
              Welcome to RapidTox - Enabling Decision Making
            </h1>
          </div>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="col-3" />
          <div class="col-6">
            <section aria-label="Rapidtox login section">
              <img
                alt="RapidTox - decision support sessions to integrate chemistry, toxicity and exposure information"
                src="../../assets/images/rapidtox-home.png"
                style="padding-bottom: 10px !important;"
                data-cy="RapidToxImage"
                class="position-relative start-50 translate-middle-x"
              >
              <p
                class="text-center"
                data-cy="WelcomeText"
              >
                Greetings and welcome to RapidTox. This platform provides a collection of flexible decision-based
                workflows
                that target the fit-for-purpose surfacing and rapid assembly of chemistry, biology/toxicology,
                and exposure data that informs the
                evaluation of chemicals of potential concern. RapidTox workflows are specifically designed to provide
                critical
                support for addressing environmental chemical problem formulations under the purview of U.S.
                EPA Program Offices and Regional partners.
                The workflows include Emergency Response and Human Health Assessment.
                In addition to workflow outputs, the flexibility of the platform allows for targeted or discrete
                searching
                of empirical or predicted data as appropriate.
              </p>
              <p class="text-center">
                <a
                  :href="loginPath"
                  class="logout"
                  alt="click to login"
                  style="color: white;"
                >
                  <button
                    type="button"
                    class="start-50 translate-middle- btn mb-8 btn-epa-primary text-white border-dark"
                    style="width: 140px !important;"
                    data-cy="SignInButton"
                  >
                    Sign In
                  </button>
                </a>
              </p>
            </section>
          </div>
          <div class="col-3" />
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<style type="text/css" scoped>
.top {
  max-height: 60vh;
  overflow: auto;
  margin-top: 50px;
}
.top > .col-3 > p {
  text-align: left;
}
.btn
{
  width: 50% !important;
}
.spinner-container {
  height: 60vh;
  color: #6c757d;
  position: absolute;
  top: 50%;
  left: 50%;
}
.radial-column {
  padding-right: 0px;
}
.logincol
{
  height: fit-content;
  background-color: lightgray;
  padding-bottom: 20px;
}
a.logout {
  color: white !important;
}
</style>
