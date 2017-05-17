<template>
  <div class="devices">

    <v-breadcrumbs icons class="elevation-1">
      <v-breadcrumbs-item href="/" target="_self">Home</v-breadcrumbs-item>
      <v-breadcrumbs-item href="/reservoirs" target="_self">Reservoirs</v-breadcrumbs-item>
      <v-breadcrumbs-item>Devices</v-breadcrumbs-item>
    </v-breadcrumbs>

    <!-- Filter -->
    <v-card class="filter">
      <v-card-row class="grey lighten-4">
        <v-card-title><small>Filters</small></v-card-title>
      </v-card-row>
      <v-card-text>
        <v-row row>
          <v-col xs12 sm12 md4>
            <v-select
              :items="getFilterDevices"
              v-model="filters.device"
              label="Device"
              light
              hide-details
              auto
            />
          </v-col>
          <v-col xs12 sm6 md4>
            <v-dialog persistent lazy>
              <v-text-field
                slot="activator"
                label="Date from"
                v-model="filters.dateFrom"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="filters.dateFrom" scrollable></v-date-picker>
            </v-dialog>
          </v-col>
          <v-col xs12 sm6 md4>
            <v-dialog persistent lazy>
              <v-text-field
                slot="activator"
                label="Date to"
                v-model="filters.dateTo"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="filters.dateTo" scrollable></v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <v-progress-linear v-bind:indeterminate="true" v-show="loaded === false"></v-progress-linear>

    <!-- No records -->
    <v-alert warning v-show="devices.length == 0 && loaded == true" class="yellow darken-3">There are no data to display</v-alert>

    <v-row v-if="device.data">
      <v-col xs12>
        <v-card class="device">

          <!-- Title -->
          <v-card-row class="blue-grey darken-1">
            <v-card-title>
              <span class="white--text">{{ device.data.attributes.name }}</span>
              <v-spacer></v-spacer>
              <div>
                <v-menu id="marriot" bottom left origin="top right">
                  <v-btn icon="icon" slot="activator" class="white--text">
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-item>
                      <v-list-tile @click.native="generateSettings(device.data.id)">
                        <v-list-tile-title>Generate device settings</v-list-tile-title>
                      </v-list-tile>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-card-title>
          </v-card-row>

          <v-card-text>
            <v-card-row>{{ device.data.attributes.description }}</v-card-row>

            <!-- NO Flow sensors -->
            <v-card-row v-show="device.data.relationships['flow-sensors'].data.length == 0" class="alert-no-data">
              <v-chip class="grey lighten-2">
                <v-avatar class="grey lighten-1">
                  <v-icon>error_outline</v-icon>
                </v-avatar>
                There are no registered flow sensors
              </v-chip>
            </v-card-row>
            <!-- NO Rulers -->
            <v-card-row v-show="device.data.relationships.rulers.data.length == 0" class="alert-no-data">
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
              <v-card-row class="blue-grey lighten-4">
                <v-card-title>Last measurement!</v-card-title>
              </v-card-row>
              <v-card-text>
                <v-row>
                  <!-- Flow sensors now -->
                  <v-col sm12 md6 v-if="device.data.relationships['flow-sensors'].data.length != 0">
                    <v-chip class="blue darken-2 white--text">
                      <v-avatar class="blue darken-4">
                        <v-icon>autorenew</v-icon>
                      </v-avatar>
                      Flow Sensors
                    </v-chip>
                    <canvas id="flow-sensors-last" :count="device.data.relationships['flow-sensors'].data.length"></canvas>
                    <chartjs-bar
                      target="flow-sensors-last"
                      v-for="(flowSensor, index) in device.data.relationships['flow-sensors'].data"
                      v-if="flowSensorsDataLast[flowSensor.id]"
                      :key="flowSensor.id"
                      :width="490"
                      :height="700"
                      :backgroundcolor="'rgba(75,136,192,0.2)'"
                      :bordercolor="'#1976d2'"
                      :datalabel="'Flow Sensor #' + (index + 1)"
                      :labels="flowSensorsDataLast[flowSensor.id].label"
                      :data="flowSensorsDataLast[flowSensor.id].data"
                      :bind="true"
                      :option="chartFlowSensorOptions"
                    ></chartjs-bar>
                  </v-col>
                  <!-- Rulers now -->
                  <v-col sm12 md6 v-if="device.data.relationships.rulers.data.length != 0">
                    <v-chip class="cyan darken-2 white--text">
                      <v-avatar class="cyan darken-4">
                        <v-icon>invert_colors</v-icon>
                      </v-avatar>
                      Rulers
                    </v-chip>
                    <canvas id="ruler-last" :count="device.data.relationships.rulers.data.length"></canvas>
                    <chartjs-bar
                      target="ruler-last"
                      v-for="(ruler, index) in device.data.relationships.rulers.data"
                      v-if="rulersDataLast.data[ruler.id]"
                      :key="ruler.id"
                      :width="490"
                      :height="700"
                      :datalabel="'Ruler #' + (index + 1)"
                      :labels="rulersDataLast.labels[ruler.id]"
                      :data="rulersDataLast.data[ruler.id]"
                      :backgroundcolor="rulersDataLast.backgroundColor[ruler.id]"
                      :bordercolor="rulersDataLast.borderColor[ruler.id]"
                      :bind="true"
                      :option="chartLevelSensorOptions"
                    ></chartjs-bar>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- History -->
            <v-card class="history elevation-1">
              <v-card-row class="blue-grey lighten-4">
                <v-card-title>History</v-card-title>
              </v-card-row>
              <v-card-text>
                <!-- Flow sensors -->
                <div v-if="device.data.relationships['flow-sensors'].data.length != 0">
                  <v-card-row>
                    <v-chip class="blue darken-2 white--text">
                      <v-avatar class="blue darken-4">
                        <v-icon>autorenew</v-icon>
                      </v-avatar>
                      Flow Sensors
                    </v-chip>
                  </v-card-row>
                  <v-card-row v-for="(flowSensor, index) in device.data.relationships['flow-sensors'].data" :key="flowSensor.id">
                    <canvas :id="'flow-sensors-history-' + index" :count="1"></canvas>
                    <chartjs-line
                      :target="'flow-sensors-history-' + index"
                      :width="600"
                      :height="400"
                      :fill="true"
                      :backgroundcolor="'rgba(75,136,192,0.2)'"
                      :bordercolor="'#1976d2'"
                      :datalabel="'Flow Sensor #' + (index + 1)"
                      :labels="flowSensorsDataHistory.labels[flowSensor.id]"
                      :data="flowSensorsDataHistory.data[flowSensor.id]"
                      :bind="true"
                      :option="chartFlowSensorOptions"
                    ></chartjs-line>
                  </v-card-row>
                  <br/>
                </div>
                <!-- Rulers -->
                <div v-if="device.data.relationships.rulers.data.length != 0">
                  <v-card-row>
                    <v-chip class="cyan darken-2 white--text">
                      <v-avatar class="cyan darken-4">
                        <v-icon>invert_colors</v-icon>
                      </v-avatar>
                      Rulers
                    </v-chip>
                  </v-card-row>
                  <v-card-row v-for="(ruler, index) in device.data.relationships.rulers.data" :key="ruler.id">
                    <canvas :id="'ruler-history-' + index" :count="1"></canvas>
                    <chartjs-bar
                      v-if="rulerSensorsDataHistory.data[ruler.id]"
                      :target="'ruler-history-' + index"
                      :width="600"
                      :height="400"
                      :datalabel="'Ruler #' + (index + 1)"
                      :labels="rulerSensorsDataHistory.labels[ruler.id]"
                      :data="rulerSensorsDataHistory.data[ruler.id]"
                      :backgroundcolor="rulerSensorsDataHistory.backgroundColor[ruler.id]"
                      :bordercolor="rulerSensorsDataHistory.borderColor[ruler.id]"
                      :bind="true"
                      :option="chartLevelSensorOptions"
                    ></chartjs-bar>
                  </v-card-row>
                </div>
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
      device: {},
      reservoir: {},
      flowSensors: [],
      rulers: [],
      // Last data
      flowSensorsDataLast: [],
      rulersDataLast: {
        labels: [],
        data: [],
        backgroundColor: [],
        borderColor: []
      },
      // Filters
      devices: [],
      filters: {
        device: null,
        dateFrom: moment(Date.now()).format('YYYY-MM-01'),
        dateTo: moment(Date.now()).format('YYYY-MM-DD')
      },
      flowSensorsDataHistory: {
        labels: [],
        data: []
      },
      rulerSensorsDataHistory: {
        labels: [],
        data: [],
        backgroundColor: [],
        borderColor: []
      },
      // Chart options
      chartFlowSensorOptions: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            ticks: {
              callback: function (value, index, values) {
                // Date value
                if (value.length === 16) {
                  return value.split(' ')
                }
                return value
              }
            }
          }],
          yAxes: [{
            ticks: {
              callback: function (value, index, values) {
                return value.toFixed(2) + ' L/m'
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
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            ticks: {
              callback: function (value, index, values) {
                // Date value
                if (value.length === 16) {
                  return value.split(' ')
                }
                return value
              }
            }
          }],
          yAxes: [{
            ticks: {
              callback: function (value, index, values) {
                return value.toFixed(2) + ' m³'
              }
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: function (itens, data) {
              return data.datasets[itens.datasetIndex].label + ': ' + itens.yLabel + ' m³'
            }
          }
        }
      },
      // Modal settings
      settings: {
        show: false,
        content: ''
      }
    }
  },
  computed: {
    getFilterDevices () {
      return this.devices.map((device) => {
        return {
          value: device.id,
          text: device.attributes.name
        }
      })
    }
  },
  watch: {
    'filters.device' (device) {
      this.$http.get(`devices/${device.value}`)
        .then((response) => {
          let included = response.data.included
          this.device = response.data
          this.reservoir = included.filter((object) => object.type === 'reservoirs')[0]
          this.flowSensors = included.filter((object) => object.type === 'flow-sensors')
          this.rulers = included.filter((object) => object.type === 'rulers')
          // Get data
          this.getLast()
          this.getHistory()
        })
        .then(() => {
          this.loaded = true
        })
    },
    'filters.dateFrom' () {
      this.getHistory()
    },
    'filters.dateTo' () {
      this.getHistory()
    }
  },
  created () {
    this.getDevices()
    setInterval(() => { this.getLast() }, 30000)
  },
  methods: {
    getDevices () {
      let reservoir = this.$route.params.reservoir
      this.$http.get(`reservoirs/${reservoir}/devices`)
        .then((response) => {
          this.devices = response.data.data
          // Pre-select first device on filter
          let deviceFirst = this.devices[0]
          this.filters.device = {
            value: deviceFirst.id,
            text: deviceFirst.attributes.name
          }
        })
    },
    getLast () {
      // For each flow sensor, do a requests to build chart
      this.flowSensors.forEach((flowSensor) => {
        this.$http.get(`flow_sensors/${flowSensor.id}/flow_sensors_data_last`)
          .then((response) => {
            if (response.data.data) {
              let createdAt = new Date(response.data.data.created_at)
              this.flowSensorsDataLast[flowSensor.id] = {
                label: [moment(createdAt).format('YYYY-MM-DD HH:mm')],
                data: [Number.parseFloat(response.data.data.consumption_per_minute)]
              }
            }
          })
          .catch((error) => {
            console.log('Flow sensors last data request error!')
            console.log(error)
          })
      })

      // Ruler - Create a data to display the total reservoir volume
      const rulersDataLast = {
        labels: ['Reservoir'],
        data: [Number.parseFloat(this.reservoir.attributes.volume)],
        backgroundColor: ['rgba(75, 192, 192, 0.4)'],
        borderColor: ['rgba(75, 192, 192, 0.5)']
      }
      // For each ruler, do a request to build the chart
      this.rulers.forEach((ruler) => {
        this.$http.get(`rulers/${ruler.id}/rulers_data_last`)
          .then((response) => {
            if (!response.data.data) {
              return
            }
            // Create with ruler volume
            rulersDataLast.labels.push(moment(new Date(response.data.data.created_at)).format('YYYY-MM-DD HH:mm'))
            rulersDataLast.data.push(this.getRulerSensorVolume(response.data.data.level_sensor_data))
            rulersDataLast.backgroundColor.push('rgba(190, 190, 190, 0.6)')
            rulersDataLast.borderColor.push('rgba(190, 190, 190, 0.9)')

            // Set all data ($set is used because this is the only way to say to vue.js to refresh interface with this data)
            this.$set(this.rulersDataLast.labels, ruler.id, rulersDataLast.labels)
            this.$set(this.rulersDataLast.data, ruler.id, rulersDataLast.data)
            this.$set(this.rulersDataLast.backgroundColor, ruler.id, rulersDataLast.backgroundColor)
            this.$set(this.rulersDataLast.borderColor, ruler.id, rulersDataLast.borderColor)
          })
          .catch((error) => {
            console.log('Ruler last data request error!')
            console.log(error)
          })
      })
    },
    getHistory () {
      // Define filter dates
      const dateFrom = this.filters.dateFrom.replace(/-/g, '') + ' 0000'
      const dateTo = this.filters.dateTo.replace(/-/g, '') + ' 2359'

      // For each flow sensor, do a requests to build chart
      this.flowSensors.forEach((flowSensor) => {
        let flowSensorsDataHistory = {
          labels: [],
          data: []
        }
        this.$http.get(`flow_sensors/${flowSensor.id}/flow_sensors_data?by_date[from]=${dateFrom}&by_date[to]=${dateTo}`)
          .then((response) => {
            response.data.data.forEach((data) => {
              flowSensorsDataHistory.labels.push(moment(new Date(data.created_at)).format('YYYY-MM-DD HH:mm'))
              flowSensorsDataHistory.data.push(Number.parseFloat(data.consumption_per_minute))
            })
            // Set all data ($set is used because this is the only way to say to vue.js to refresh interface with this data)
            this.$set(this.flowSensorsDataHistory.labels, flowSensor.id, flowSensorsDataHistory.labels)
            this.$set(this.flowSensorsDataHistory.data, flowSensor.id, flowSensorsDataHistory.data)
          })
          .catch((error) => {
            console.log('Flow sensors history data request error!')
            console.log(error)
          })
      })

      // For each level ruler, do a request to build chart
      this.rulers.forEach((ruler) => {
        // Create a data for each ruler
        this.$http.get(`rulers/${ruler.id}/rulers_data?by_date[from]=${dateFrom}&by_date[to]=${dateTo}`)
          .then((response) => {
            let rulerData = {
              labels: [],
              data: [],
              backgroundColor: [],
              borderColor: []
            }
            // Create a data to display the total reservoir volume
            rulerData.labels.push('Reservoir')
            rulerData.data.push(Number.parseFloat(this.reservoir.attributes.volume))
            rulerData.backgroundColor.push('rgba(75, 192, 192, 0.4)')
            rulerData.borderColor.push('rgba(75, 192, 192, 0.5)')
            // Create a data for each result
            response.data.data.forEach((data) => {
              rulerData.labels.push(moment(new Date(data.created_at)).format('YYYY-MM-DD HH:mm'))
              rulerData.data.push(this.getRulerSensorVolume(data.level_sensor_data))
              rulerData.backgroundColor.push('rgba(190, 190, 190, 0.6)')
              rulerData.borderColor.push('rgba(190, 190, 190, 0.9)')
            })
            // Set all data ($set is used because this is the only way to say to vue.js to refresh interface with this data)
            this.$set(this.rulerSensorsDataHistory.labels, ruler.id, rulerData.labels)
            this.$set(this.rulerSensorsDataHistory.data, ruler.id, rulerData.data)
            this.$set(this.rulerSensorsDataHistory.backgroundColor, ruler.id, rulerData.backgroundColor)
            this.$set(this.rulerSensorsDataHistory.borderColor, ruler.id, rulerData.borderColor)
          })
          .catch((error) => {
            console.log('Ruler sensors data request error!')
            console.log(error)
          })
      })
    },
    getRulerSensorVolume (levelSensorData) {
      if (!levelSensorData) {
        return 0
      }
      // Get the highest switched on sensor volume
      let rulerData = []
      if (levelSensorData) {
        levelSensorData.forEach((sensorData) => {
          if (sensorData.switched_on === false) {
            return
          }
          rulerData.push(Number.parseFloat(sensorData.level_sensor.volume))
        })
      }
      // Ruler maximum volume
      return rulerData.length === 0 ? 0 : Math.max.apply(null, rulerData)
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
