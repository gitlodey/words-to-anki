<template>
  <v-app>
    <v-main>
      <v-navigation-drawer :expand-on-hover="false" :rail="true">
        <p class="flag">
          <router-link activeClass="__active" to="/en"> 🇺🇸 </router-link>
        </p>
        <p class="flag">
          <router-link activeClass="__active" to="/tr"> 🇹🇷 </router-link>
        </p>
      </v-navigation-drawer>
      <v-main>
        <v-container>
          <router-view />
        </v-container>
      </v-main>
    </v-main>
  </v-app>
</template>

<style lang="scss">
#app {
  font: 16px "Helvetica", "Arial", "serif";
}
b {
  font-weight: 700;
}
.flag {
  font-size: 60px;

  > a {
    text-decoration: none;
    opacity: 0.7;

    &.__active {
      opacity: 1;
    }
  }
}
.button-container {
  display: flex;
  justify-content: flex-end;

  > * {
    &:not(:first-child) {
      margin-left: 20px;
    }
  }
}
.mb20 {
  margin-bottom: 20px;
}
.mr10 {
  margin-right: 10px;
}
</style>
