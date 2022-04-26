<template>
  <v-app>
    <v-main>
      <v-navigation-drawer
          :expand-on-hover="true"
          :rail="true"
      >
        <router-link to="/en">English</router-link>
      </v-navigation-drawer>
      <router-view/>
    </v-main>
  </v-app>
</template>

<style>
b {
  font-weight: 700;
}
</style>
