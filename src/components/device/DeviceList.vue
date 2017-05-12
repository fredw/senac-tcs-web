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
                  <!-- Flow sensors now -->
                  <v-col sm12 md6 v-if="device.relationships['flow-sensors'].data.length != 0">
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
                      :width="490"
                      :height="700"
                      :backgroundcolor="'rgba(75,136,192,0.2)'"
                      :bordercolor="'#1976d2'"
                      :datalabel="'Flow Sensor #' + (index + 1)"
                      :labels="flowSensorsDataLast[flowSensor.id].label"
                      :data="flowSensorsDataLast[flowSensor.id].data"
                      :beginzero="true"
                      :bind="true"
                      :option="chartFlowSensorOptions"
                    ></chartjs-bar>
                  </v-col>
                  <!-- Rulers now -->
                  <v-col sm12 md6 v-if="device.relationships.rulers.data.length != 0">
                    <v-chip class="cyan darken-2 white--text">
                      <v-avatar class="cyan darken-4">
                        <v-icon>invert_colors</v-icon>
                      </v-avatar>
                      Rulers
                    </v-chip>
                    <canvas id="ruler-last" :count="device.relationships.rulers.data.length"></canvas>
                    <chartjs-bar
                      target="ruler-last"
                      v-for="(ruler, index) in device.relationships.rulers.data"
                      v-if="rulersDataLast[ruler.id]"
                      :key="ruler.id"
                      :width="490"
                      :height="700"
                      :datalabel="'Ruler #' + (index + 1)"
                      :labels="rulersDataLast[ruler.id].label"
                      :data="rulersDataLast[ruler.id].data"
                      :beginzero="true"
                      :bind="true"
                      :option="chartLevelSensorOptions"
                    ></chartjs-bar>
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
                    <v-col xs12 sm5>
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
                    <v-col xs12 sm5>
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
                    <v-col xs12 sm2>
                      <v-btn secondary dark @click.native="list()">OK</v-btn>
                    </v-col>
                  </v-row>
                </v-card-row>
                <!-- Flow sensors -->
                <div v-if="device.relationships['flow-sensors'].data.length != 0">
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
                    ></chartjs-line>
                  </v-card-row>
                  <br/>
                </div>
                <!-- Rulers -->
                <div v-if="device.relationships.rulers.data.length != 0">
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
                    ></chartjs-bar>
                    <!--:backgroundcolor="getRandomColor()"-->
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
      // List
      reservoir: null,
      devices: [],
      rulers: [],
      levelSensors: [],
      flowSensors: [],
      // Last data
      flowSensorsDataLast: [],
      rulersDataLast: [],
      // History data
      filters: [],
      flowSensorsData: {
        labels: [],
        data: []
      },
      rulerSensorsData: {
        labels: [],
        data: []
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
  created () {
    this.list()
    setInterval(() => { this.list() }, 30000)
  },
  methods: {
    list () {
      let reservoir = this.$route.params.reservoir
      this.$http.get(`reservoirs/${reservoir}/devices`)
        .then((response) => {
          let included = response.data.included

          // Store all included on request on data values
          this.reservoir = included.filter((object) => object.type === 'reservoirs')[0]
          this.devices = response.data.data
          this.flowSensors = included.filter((object) => object.type === 'flow-sensors')
          this.rulers = included.filter((object) => object.type === 'rulers')
          this.levelSensors = included.filter((object) => object.type === 'level-sensors')

          // Fill date with start value for each device
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

            // Define filter dates
            let deviceId = flowSensor.relationships.device.data.id
            let dateFrom = this.filters[deviceId].dateFrom.replace(/-/g, '') + ' 0000'
            let dateTo = this.filters[deviceId].dateTo.replace(/-/g, '') + ' 2359'

            // History
            this.flowSensorsData.labels = []
            this.flowSensorsData.data = []
            this.$http.get(`flow_sensors/${flowSensor.id}/flow_sensors_data?by_date[from]=${dateFrom}&by_date[to]=${dateTo}`)
              .then((response) => {
                response.data.data.forEach((data) => {
                  this.flowSensorsData.labels.push(moment(new Date(data.created_at)).format('YYYY-MM-DD HH:mm'))
                  this.flowSensorsData.data.push(Number.parseFloat(data.consumption_per_minute))
                })
              })
              .catch((error) => {
                console.log('Flow sensors history data request error!')
                console.log(error)
              })
          })

          // For each level ruler, do a request to build chart
          this.rulers.forEach((ruler, index) => {
            // Last data (now)
            this.rulersDataLast[ruler.id] = {
              label: [],
              data: []
            }
            // Create a data to display the total reservoir volume
            this.rulersDataLast[ruler.id].label.push('Reservoir')
            this.rulersDataLast[ruler.id].data.push(Number.parseFloat(this.reservoir.attributes.volume))
            this.$http.get(`rulers/${ruler.id}/rulers_data_last`)
              .then((response) => {
                if (!response.data.data) {
                  return
                }
                // Create with ruler volume
                this.rulersDataLast[ruler.id].label.push(moment(new Date(response.data.data.created_at)).format('YYYY-MM-DD HH:mm'))
                this.rulersDataLast[ruler.id].data.push(this.getRulerSensorVolume(response.data.data.level_sensor_data))
              })
              .catch((error) => {
                console.log('Ruler last data request error!')
                console.log(error)
              })

            // Define filter dates
            let deviceId = ruler.relationships.device.data.id
            let dateFrom = this.filters[deviceId].dateFrom.replace(/-/g, '') + ' 0000'
            let dateTo = this.filters[deviceId].dateTo.replace(/-/g, '') + ' 2359'

            // History
            this.rulerSensorsData.labels = []
            this.rulerSensorsData.data = []
            // Create a data to display the total reservoir volume
            this.rulerSensorsData.labels.push('Reservoir')
            this.rulerSensorsData.data.push(Number.parseFloat(this.reservoir.attributes.volume))
            this.$http.get(`rulers/${ruler.id}/rulers_data?by_date[from]=${dateFrom}&by_date[to]=${dateTo}`)
              .then((response) => {
                // Create a data for each result
                response.data.data.forEach((data) => {
                  this.rulerSensorsData.labels.push(moment(new Date(data.created_at)).format('YYYY-MM-DD HH:mm'))
                  this.rulerSensorsData.data.push(this.getRulerSensorVolume(data.level_sensor_data))
                })
              })
              .catch((error) => {
                console.log('Ruler sensors data request error!')
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
    getRandomColor () {
      let letters = '0123456789ABCDEF'.split('')
      let color = '#'
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
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
