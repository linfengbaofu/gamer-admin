<template>
  <div id="app">
    <router-view />
    <theme-picker />
  </div>
</template>

<script>
// import { getKefu } from '@/api/member/config';
import ThemePicker from "@/components/ThemePicker";

export default {
  name: "App",
  components: { ThemePicker },
  // metaInfo() {
  //   return {
  //     title:
  //       this.$store.state.settings.dynamicTitle &&
  //       this.$store.state.settings.title,
  //     titleTemplate: (title) => {
  //       return title
  //         ? `${title} - ${process.env.VUE_APP_TITLE}`
  //         : process.env.VUE_APP_TITLE;
  //     },
  //   };
  // },
  created() {
    if(localStorage.getItem('logoName')){
      document.title = localStorage.getItem('logoName') + '管理后台';
      return;
    }
    // getKefu().then(res => {
    //   document.title = res.data.logoName + '管理后台';
    //   localStorage.setItem('logoName', res.data.logoName);
    // });
  },
};
</script>
<style scoped>
#app .theme-picker {
  display: none;
}
</style>
