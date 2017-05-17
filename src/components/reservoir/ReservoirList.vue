<template>
  <div class="reservoirs">

    <v-breadcrumbs icons class="elevation-1">
      <v-breadcrumbs-item href="/" target="_self">Home</v-breadcrumbs-item>
      <v-breadcrumbs-item>Reservoirs</v-breadcrumbs-item>
    </v-breadcrumbs>

    <!-- Filter -->
    <v-card class="filter" v-show="reservoirs.length > 0 || loaded === true">
      <v-card-row class="grey lighten-4">
        <v-card-title><small>Filters</small></v-card-title>
      </v-card-row>
      <v-card-text>
        <v-row row>
          <v-col xs12 md6>
            <v-select
              :items="getFilterReservoirsGroups"
              v-model="filters.reservoirsGroup"
              label="Reservoir group"
              light
              hide-details
              auto
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <v-progress-linear v-bind:indeterminate="true" v-show="loading === true"></v-progress-linear>

    <!-- No records -->
    <v-alert warning v-show="reservoirs.length == 0 && loaded === true" class="yellow darken-3">There are no reservoirs to display</v-alert>

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
            <v-chip class="grey lighten-4" v-if="reservoir.relationships['reservoir-group'].data" title="Reservoir Group">
              <v-avatar>
                <v-icon>group_work</v-icon>
              </v-avatar>
              {{ getReservoirGroupName(reservoir) }}
            </v-chip>
            <v-spacer></v-spacer>
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
      loading: true,
      reservoirs: [],
      reservoirsGroups: [],
      filters: {
        reservoirsGroup: ''
      },
      page: 1,
      perPage: 6,
      pageCount: 0
    }
  },
  computed: {
    getFilterReservoirsGroups () {
      let options = []
      options.push({value: '', text: '[None]'})
      this.reservoirsGroups.map((group) => {
        options.push({
          value: group.id,
          text: group.attributes.name
        })
      })
      return options
    }
  },
  created () {
    // Reservoirs groups (filter)
    this.$http.get(`reservoir_groups`)
      .then((response) => {
        this.reservoirsGroups = response.data.data
      })
    // Reservoirs
    this.list()
  },
  watch: {
    page: function () {
      this.list()
    },
    'filters.reservoirsGroup' () {
      this.list()
    }
  },
  methods: {
    list () {
      this.loading = true
      let reservoirsGroup = this.filters.reservoirsGroup ? this.filters.reservoirsGroup.value : ''
      this.$http.get(`reservoirs?page=${this.page}&per_page=${this.perPage}&reservoir_group=${reservoirsGroup}`)
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
          this.loading = false
          this.loaded = true
        })
    },
    getReservoirGroupName (reservoir) {
      let group = this.reservoirsGroups.filter((group) => group.id === reservoir.relationships['reservoir-group'].data.id)
      if (group) {
        return group[0].attributes.name
      }
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

  .chip {
    margin: 0;
    font-size: .8em;

    .avatar {
      margin-right: 1px;
      color: #dcdcdc;
    }
  }
}
</style>
