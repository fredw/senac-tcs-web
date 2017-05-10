<template>
  <div class="reservoirs">

    <v-breadcrumbs icons class="elevation-1">
      <v-breadcrumbs-item href="/" target="_self">Home</v-breadcrumbs-item>
      <v-breadcrumbs-item>Reservoirs</v-breadcrumbs-item>
    </v-breadcrumbs>

    <v-alert warning v-show="reservoirs.length == 0 && loaded == true" class="yellow darken-3">There are no registered reservoirs</v-alert>

    <v-row>
      <v-col xs12 sm6 md4 v-for="reservoir in reservoirs" :key="reservoir.id">
        <v-card class="reservoir">
          <v-card-row class="green darken-1">
            <v-card-title>
              <span class="white--text">{{ reservoir.attributes.name }}</span>
            </v-card-title>
          </v-card-row>
          <v-card-text>
            <v-card-row class="description">{{ reservoir.attributes.description }}</v-card-row>
          </v-card-text>
          <v-card-row actions>
            <v-btn flat class="green--text darken-1" :router="true" :href="{ name: 'device.list', params: { reservoir: reservoir.id } }">View Devices</v-btn>
          </v-card-row>
        </v-card>
      </v-col>
    </v-row>

    <v-pagination :length.number="pageCount" v-model="page" v-show="reservoirs.length > 0" circle />

  </div>
</template>

<script>
export default {
  data () {
    return {
      loaded: false,
      reservoirs: [],
      page: 1,
      perPage: 3,
      pageCount: 0
    }
  },
  created () {
    this.list()
  },
  watch: {
    page: function () {
      this.list()
    }
  },
  methods: {
    list () {
      this.$http.get(`reservoirs?page=${this.page}&per_page=${this.perPage}`)
        .then((response) => {
          this.reservoirs = response.data.data
          this.perPage = response.headers['per-page']
          this.pageCount = Math.ceil(response.headers['total'] / this.perPage)
        })
        .catch((error) => {
          console.log('Reservoirs request error!')
          console.log(error)
        })
        .then(() => {
          this.loaded = true
        })
    }
  }
}
</script>

<style scoped lang="scss">
.reservoir {
  margin-bottom: 15px;

  .description {
    display: block;
    display: -webkit-box;
    margin: 0 auto;
    height: 90px !important;
    line-height: 1.4;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
