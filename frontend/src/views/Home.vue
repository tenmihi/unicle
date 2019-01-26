<template>
  <div class="hero-foot">
    <div v-if="is_loading">
      <v-loading></v-loading>
    </div>
    <div v-else>
      <div v-for="(item, index) in items" :key="index">
        <v-article
          class="item"
          :item="item"
        ></v-article>
        <hr>
      </div>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import VArticle from '@/components/Article'
import VLoading from '@/components/Loading'

export default {
  components: {
    VArticle,
    VLoading,
  },
  data () {
    return {
      items: []
    }
  },
  computed: {
    is_loading () {
      return this.items.length == 0
    }
  },
  async created () {
    const { data } = await axios.get('https://1z0m934jxe.execute-api.ap-northeast-1.amazonaws.com/prod/fetch')
    this.items = data
  }
}
</script>

<style lang="scss" scoped>
.description {
  color: gray;
}

</style>
