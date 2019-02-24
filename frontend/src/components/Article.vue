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
            class="is-size-5"
            :href="item.url"
          >
            <strong>{{ item.title }} </strong>
          </a>
          <br>
          {{ item.description }}
          <br>
          <span style="color: gray;"><small>from: {{ item.host }} date: {{ published_date }}</small></span>
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
</style>