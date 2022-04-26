<template>
  <v-app>
    <v-main>
      <v-navigation-drawer
          :expand-on-hover="false"
          :rail="true"
      >
        <p class="flag">
          <router-link to="/en">🇺🇸</router-link>
        </p>
        <p class="flag">
          <router-link to="/tr">🇹🇷</router-link>
        </p>
      </v-navigation-drawer>
      <router-view/>
    </v-main>
  </v-app>
</template>

<style lang="scss">
b {
  font-weight: 700;
}
.flag {
  font-size: 60px;
}
</style>
