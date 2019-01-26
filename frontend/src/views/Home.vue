<template>
  <div>
    <div class="hero-body">
      <div class="container has-text-centered">
        <img src="../../public/logo.png" width="128" height="80">
        <p class="description">Untiyに関して話題になってる記事一覧をお届けします</p>
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

export default {
  components: {
    VArticle,
    Pickup,
  },
  data () {
    return {
      items: []
    }
  },
  computed: {
    pickup_article() {
      return this.items[0]
    }
  },
  async created () {
    const { data } = await axios.get('https://1z0m934jxe.execute-api.ap-northeast-1.amazonaws.com/prod/fetch')
    this.items = data
  }
}
</script>

<style scoped>
.description {
  color: gray;
}
</style>
