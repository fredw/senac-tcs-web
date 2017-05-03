<template>
  <div class="reservoirs">

    <!-- <table class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reservoir in reservoirs">
          <td>{{ reservoir.attributes.name }}</td>
        </tr>
    </tbody>
    </table> -->

    <v-data-table v-model="reservoirs" :headers="headers" hide-actions class="elevation-1">
      <template slot="items" scope="props">
        <td>{{ props.item.attributes.name }}</td>
        <td>{{ props.item.attributes.description }}</td>
      </template>
    </v-data-table>

    <br/><v-divider></v-divider><br/>

    <v-row>
      <v-col xs12 sm6 md4 v-for="reservoir in reservoirs" :key="reservoir.id">
        <v-card class="reservoir">
          <v-card-row class="green darken-1">
            <v-card-title>
              <span class="white--text">{{ reservoir.attributes.name }}</span>
              <!-- <v-spacer></v-spacer>
              <div>
                <v-menu id="marriot" bottom left origin="top right">
                  <v-btn icon="icon" slot="activator" class="white--text">
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-item>
                      <v-list-tile>
                        <v-list-tile-title>Never show rewards</v-list-tile-title>
                      </v-list-tile>
                    </v-list-item>
                    <v-list-item>
                      <v-list-tile>
                        <v-list-tile-title>Remove Card</v-list-tile-title>
                      </v-list-tile>
                    </v-list-item>
                    <v-list-item>
                      <v-list-tile>
                        <v-list-tile-title>Send Feedback</v-list-tile-title>
                      </v-list-tile>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div> -->
            </v-card-title>
          </v-card-row>
          <v-card-text>
            <v-card-row height="90px">{{ reservoir.attributes.description }}</v-card-row>
          </v-card-text>
          <v-card-row actions>
            <v-btn flat class="green--text darken-1" to="/teste">View Devices</v-btn>
          </v-card-row>
        </v-card>
      </v-col>
    </v-row>

    <v-pagination v-bind:length.number="4" v-model="page" circle />

  </div>
</template>

<script>
export default {
  data () {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
          left: true
        },
        {
          text: 'Description',
          value: 'description',
          left: true
        }
      ],
      reservoirs: [],
      page: 1,
      perPage: 10,
      search: ''
    }
  },
  created () {
    this.list()
  },
  methods: {
    list () {
      this.$http.get(`reservoirs?page=${this.page}&per_page=${this.perPage}&search=${this.search}`)
        .then((response) => {
          this.reservoirs = response.data.data
          this.perPage = response.headers['per-page']
          this.total = response.headers['total']
        })
        .catch((error) => {
          console.log(error.response)
        })
    }
  }
}
</script>

<style scoped>
.reservoir {
  margin-bottom: 15px;
}
</style>
