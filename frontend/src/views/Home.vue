<template>
  <div>
    <div class="hero-body">
      <div class="container has-text-centered">
        <img src="../../public/logo.png" width="128" height="80">
      </div>
    </div>
    <div class="hero-foot">
      <div v-for="(item, index) in items" :key="index">
        <v-article
          class="item"
          :item="item"
        ></v-article>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import VArticle from '@/components/Article'
import Pickup from '@/components/Pickup'
import axios from 'axios'

const dummy = {
  title: 'TITLE TITLE TITLE',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  url: 'https://jp.vuejs.org/index.html',
  image: 'https://jp.vuejs.org/images/logo.png',
  site_name: 'site name dayo'
}

export default {
  components: {
    VArticle,
    Pickup,
  },
  data () {
    return {
      items: []
      //items: [dummy, dummy, dummy, dummy]
    }
  },
  computed: {
    pickup_article() {
      return this.items[0]
    }
  },
  async created () {
    const { data } = await axios.get('https://t8mh9aeqbe.execute-api.ap-northeast-1.amazonaws.com/prod/fetch')
    this.items = data
  }
}
</script>