<template>
  <div class="devices">

    <v-breadcrumbs icons class="elevation-1">
      <v-breadcrumbs-item href="/" target="_self">Home</v-breadcrumbs-item>
      <v-breadcrumbs-item href="/reservoirs" target="_self">Reservoirs</v-breadcrumbs-item>
      <v-breadcrumbs-item>Devices</v-breadcrumbs-item>
    </v-breadcrumbs>

    <v-alert warning v-show="devices.length == 0 && loaded == true" class="yellow darken-3">There are no registered devices</v-alert>

    <v-row>
      <v-col xs12 v-for="device in devices" :key="device.id">
        <v-card class="device">

          <!-- Title -->
          <v-card-row class="blue-grey darken-1">
            <v-card-title>
              <span class="white--text">{{ device.attributes.name }}</span>
              <v-spacer></v-spacer>
              <div>
                <v-menu id="marriot" bottom left origin="top right">
                  <v-btn icon="icon" slot="activator" class="white--text">
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-item>
                      <v-list-tile @click.native="generateSettings(device.id)">
                        <v-list-tile-title>Generate device settings</v-list-tile-title>
                      </v-list-tile>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-card-title>
          </v-card-row>

          <v-card-text>
            <v-card-row>{{ device.attributes.description }}</v-card-row>

            <!-- NO Flow sensors -->
            <v-card-row v-show="device.relationships['flow-sensors'].data.length == 0" class="alert-no-data">
              <v-chip class="grey lighten-2">
                <v-avatar class="grey lighten-1">
                  <v-icon>error_outline</v-icon>
                </v-avatar>
                There are no registered flow sensors
              </v-chip>
            </v-card-row>
            <!-- NO Rulers -->
            <v-card-row v-show="device.relationships.rulers.data.length == 0" class="alert-no-data">
              <v-chip class="grey lighten-2">
                <v-avatar class="grey lighten-1">
                  <v-icon>error_outline</v-icon>
                </v-avatar>
                There are no registered rulers
              </v-chip>
            </v-card-row>

            <v-divider class="description-divider"></v-divider>

            <!-- Now -->
            <v-card class="now elevation-1">
              <v-card-row class="grey lighten-4">
                <v-card-title>Last measurement!</v-card-title>
              </v-card-row>
              <v-card-text>
                <v-row>
                  <v-col xs12 sm6>
                    <v-chip class="blue darken-2 white--text">
                      <v-avatar class="blue darken-4">
                        <v-icon>autorenew</v-icon>
                      </v-avatar>
                      Flow Sensors
                    </v-chip>
                    <canvas id="flow-sensors-last" :count="device.relationships['flow-sensors'].data.length"></canvas>
                    <chartjs-bar
                      target="flow-sensors-last"
                      v-for="(flowSensor, index) in device.relationships['flow-sensors'].data"
                      v-if="flowSensorsDataLast[flowSensor.id]"
                      :key="flowSensor.id"
                      :width="470"
                      :height="250"
                      :datalabel="'Flow Sensor #' + (index + 1)"
                      :labels="flowSensorsDataLast[flowSensor.id].label"
                      :data="flowSensorsDataLast[flowSensor.id].data"
                      :beginzero="true"
                      :bind="true"
                      :option="chartFlowSensorOptions"
                      style="width: 100%"
                    ></chartjs-bar>
                  </v-col>
                  <v-col xs12 sm6>
                    <!-- @TODO: implementar ultimo nivel -->
                    <v-chip class="cyan darken-2 white--text">
                      <v-avatar class="cyan darken-4">
                        <v-icon>invert_colors</v-icon>
                      </v-avatar>
                      Rulers
                    </v-chip>
                    Ultimo nivel...
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- History -->
            <v-card class="history elevation-1">
              <v-card-row class="grey lighten-4">
                <v-card-title>History</v-card-title>
              </v-card-row>
              <v-card-text>
                <!-- Filter -->
                <v-card-row>
                  <v-row>
                    <v-col xs12 sm6>
                      <v-dialog persistent lazy>
                        <v-text-field
                          slot="activator"
                          label="Date from"
                          v-model="filters[device.id].dateFrom"
                          prepend-icon="event"
                          readonly
                        ></v-text-field>
                        <v-date-picker v-model="filters[device.id].dateFrom" scrollable></v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col xs12 sm6>
                      <v-dialog persistent lazy>
                        <v-text-field
                          slot="activator"
                          label="Date to"
                          v-model="filters[device.id].dateTo"
                          prepend-icon="event"
                          readonly
                        ></v-text-field>
                        <v-date-picker v-model="filters[device.id].dateTo" scrollable></v-date-picker>
                      </v-dialog>
                    </v-col>
                  </v-row>
                </v-card-row>
                <!-- Flow sensors -->
                <v-card-row>
                  <v-chip class="blue darken-2 white--text">
                    <v-avatar class="blue darken-4">
                      <v-icon>autorenew</v-icon>
                    </v-avatar>
                    Flow Sensors
                  </v-chip>
                </v-card-row>
                <v-card-row>
                  <canvas id="flow-sensors" :count="device.relationships['flow-sensors'].data.length"></canvas>
                  <chartjs-line
                    target="flow-sensors"
                    v-for="(flowSensor, index) in device.relationships['flow-sensors'].data"
                    :key="flowSensor.id"
                    :width="600"
                    :height="400"
                    :fill="true"
                    :backgroundcolor="'rgba(75,136,192,0.2)'"
                    :bordercolor="'#1976d2'"
                    :datalabel="'Flow Sensor #' + (index + 1)"
                    :labels="flowSensorsData.labels"
                    :data="flowSensorsData.data"
                    :beginzero="true"
                    :bind="true"
                    :option="chartFlowSensorOptions"
                    style="width: 100%"
                  ></chartjs-line>
                </v-card-row>
                <br/>
                <!-- Rulers -->
                <v-card-row>
                  <v-chip class="cyan darken-2 white--text">
                    <v-avatar class="cyan darken-4">
                      <v-icon>invert_colors</v-icon>
                    </v-avatar>
                    Rulers
                  </v-chip>
                </v-card-row>
                <v-card-row>
                  <canvas id="rulers" :count="device.relationships.rulers.data.length"></canvas>
                  <chartjs-bar
                    target="rulers"
                    v-for="(ruler, index) in device.relationships.rulers.data"
                    :key="ruler.id"
                    :width="600"
                    :height="400"
                    :datalabel="'Ruler #' + (index + 1)"
                    :labels="rulerSensorsData.labels"
                    :data="rulerSensorsData.data"
                    :beginzero="true"
                    :bind="true"
                    :option="chartLevelSensorOptions"
                    style="width: 100%"
                  ></chartjs-bar>
                </v-card-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Settings modal -->
    <v-dialog v-model="settings.show" scrollable width="600" class="settings">
      <v-card>
        <v-card-title>Device settings</v-card-title>
        <v-divider></v-divider>
        <v-card-row height="300px">
          <v-card-text>
            <p>You need to create a <code style="width: auto">settings.json.txt</code> file and put on your device SD with this follow content.
            <strong>Important!</strong> You need to inform your password at the end of file!</p>
            <code>{{ settings.content }}</code>
          </v-card-text>
        </v-card-row>
        <v-divider></v-divider>
        <v-card-row actions>
          <v-btn class="blue--text darken-1" flat @click.native="settings.show = false">Close</v-btn>
        </v-card-row>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      loaded: false,
      devices: [],
      rulers: [],
      levelSensors: [],
      flowSensors: [],
      flowSensorsDataLast: [],
      flowSensorsData: {
        labels: [],
        data: []
      },
      rulerSensorsData: {
        labels: [],
        data: []
      },
      filters: [],
      settings: {
        show: false,
        content: ''
      },
      chartFlowSensorOptions: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            ticks: {
              callback: function (value, index, values) {
                return value.split(' ')
              }
            }
          }],
          yAxes: [{
            ticks: {
              callback: function (value, index, values) {
                return value + ' L/m'
              }
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: function (itens, data) {
              return data.datasets[itens.datasetIndex].label + ': ' + itens.yLabel + ' L/m'
            }
          }
        }
      },
      chartLevelSensorOptions: {
        responsive: true,
        maintainAspectRatio: true
      }
    }
  },
  created () {
    this.last()
    this.list()
  },
  watch: {
    'filters.dateFrom': function () {
      this.list()
    },
    'filters.dateTo': function () {
      this.list()
    }
  },
  methods: {
    last () {

    },
    list () {
      let reservoir = this.$route.params.reservoir
      this.$http.get(`reservoirs/${reservoir}/devices`)
        .then((response) => {
          let included = response.data.included

          // Store all included on request on data values
          this.devices = response.data.data
          this.flowSensors = included.filter((object) => object.type === 'flow-sensors')
          this.rulers = included.filter((object) => object.type === 'rulers')
          this.levelSensors = included.filter((object) => object.type === 'level-sensors')

          // Fill date for each device
          if (this.loaded === false) {
            let firstDate = moment(Date.now()).format('YYYY-MM-01')
            let now = moment(Date.now()).format('YYYY-MM-DD')
            this.devices.forEach((device) => {
              this.filters[device.id] = {
                dateFrom: firstDate,
                dateTo: now
              }
            })
          }

          // For each flow sensor, do a requests to build chart
          this.flowSensors.forEach((flowSensor) => {
            // Last data (now)
            this.flowSensorsDataLast = []
            this.$http.get(`flow_sensors/${flowSensor.id}/flow_sensors_data_last`)
              .then((response) => {
                let createdAt = new Date(response.data.data[0].attributes['created-at'])
                this.flowSensorsDataLast[flowSensor.id] = {
                  label: [moment(createdAt).format('YYYY-MM-DD HH:mm')],
                  data: [Number.parseFloat(response.data.data[0].attributes['consumption-per-minute'])]
                }
              })
              .catch((error) => {
                console.log('Flow sensors last data request error!')
                console.log(error)
              })

            // Define filter dates
            let device = flowSensor.relationships.device.data.id
            let dateFrom = this.filters[device].dateFrom.replace(/-/g, '') + ' 0000'
            let dateTo = this.filters[device].dateTo.replace(/-/g, '') + ' 2359'

            // History
            this.flowSensorsData.labels = []
            this.flowSensorsData.data = []
            this.$http.get(`flow_sensors/${flowSensor.id}/flow_sensors_data?by_date[from]=${dateFrom}&by_date[to]=${dateTo}`)
              .then((response) => {
                response.data.data.forEach((data) => {
                  let createdAt = new Date(data.attributes['created-at'])
                  this.flowSensorsData.labels.push(moment(createdAt).format('YYYY-MM-DD HH:mm'))
                  this.flowSensorsData.data.push(Number.parseFloat(data.attributes['consumption-per-minute']))
                })
              })
              .catch((error) => {
                console.log('Flow sensors history data request error!')
                console.log(error)
              })
          })

          // For each level sensor, do a request to build chart
          this.levelSensors.forEach((levelSensors) => {
            // Define filter dates
            let rulerId = levelSensors.relationships.ruler.data.id
            let ruler = this.rulers.filter((r) => r.id === rulerId)
            let device = ruler.relationships.device.data.id
            let dateFrom = this.filters[device].dateFrom.replace(/-/g, '') + ' 0000'
            let dateTo = this.filters[device].dateTo.replace(/-/g, '') + ' 2359'

            // History
            this.rulerSensorsData.labels = []
            this.rulerSensorsData.data = []
            this.$http.get(`level_sensors/${levelSensors.id}/level_sensors_data?by_date[from]=${dateFrom}&by_date[to]=${dateTo}`)
              .then((response) => {
                response.data.data.forEach((data) => {
                  let createdAt = new Date(data.attributes['created-at'])
                  this.rulerSensorsData.labels.push(moment(createdAt).format('YYYY-MM-DD HH:mm'))
                  this.rulerSensorsData.data.push(Number.parseFloat(data.attributes['consumption-per-minute']))
                })
              })
              .catch((error) => {
                console.log('Level sensors data request error!')
                console.log(error)
              })
          })
        })
        .catch((error) => {
          console.log('Device request error!')
          console.log(error)
        })
        .then(() => {
          this.loaded = true
        })
    },
    generateSettings (device) {
      this.settings.show = true
      this.$http.get(`devices/${device}/generate_settings`)
        .then((response) => {
          this.settings.content = JSON.stringify(response.data, null, 4)
        })
        .catch((error) => {
          console.log('Device settings request error!')
          console.log(error)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.filter {
  margin-bottom: 15px;

  .input-group {
    margin-bottom: 0;
  }
}

.device {
  margin-bottom: 15px;

  .chip {
    width: 100%;
    margin: 0;
    justify-content: flex-start;
  }

  .description-divider {
    margin-bottom: 10px;
  }

  .alert-no-data {
    display: inline-block;
    margin: 0 5px 10px 0 !important;

    .chip {
      margin: 0;
    }
  }

  .now {
    margin-bottom: 10px;
  }

  .now .card__title,
  .history .card__title {
    padding: 10px;
    font-size: 1.2em;
  }

  .chart-row {
    justify-content: center;

    canvas {
      width: 100% !important;
      max-width: 600px;
      height: auto !important;
    }
  }
}

.settings code {
  width: 100%;
}
</style>
