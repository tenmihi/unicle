<template>
  <article class="media">
    <figure class="media-left">
      <figure class="image is-128x128">
        <img :src="item.image">
      </figure>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <a
            :href="item.url"
          >
            <strong
              class="is-size-5-desktop article-title"
              v-line-clamp="3"
            >{{ item.title }}</strong>
          </a>
          <span class="is-size-7-mobile article-description" v-line-clamp="3">{{ item.description }}</span>
          <span class="is-size-7-mobile from-date"><small>from: {{ item.host }} date: {{ published_date }}</small></span>
        </p>
      </div>
    </div>
  </article>
</template>

<script>
import * as moment from 'moment'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    }
  },
  computed: {
    published_date () {
      return moment.unix(this.item.timestamp).format('YYYY-MM-DD')
    }
  },
}
</script>

<style scoped>
a {
  color: black;
}
a:hover {
  text-decoration: underline;
}

img {
  height: 100% !important;
  object-fit: contain;
}

.article-title, .article-description {
  margin-bottom: 8px;
}

.from-date {
  color:gray;
}
</style>