<template>
  <section>
    <div class="picker">
      <span>付款时间</span>
      <el-date-picker
        :picker-options="pickerOptions"
        v-model="time_value"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
    </div>
    <div class="statistics">
      <el-row :gutter="24">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="box">
            <header>看板1</header>
            <div class="channel-round content">
              <h3>圆柱图</h3>
              <div v-loading="loading1" id="chart1"></div>
            </div>
            <div class="line content">
              <h3>趋势图</h3>
              <div v-loading="loading2" id="chart2"></div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="box">
            <header>
              看板2
              <div class="btns g-clear">
                <button :class="{active: tab_number === 1}" @click="tab_number = 1">完成时间</button>
                <button :class="{active: tab_number === 2}" @click="tab_number = 2">完单率</button>
              </div>
            </header>
            <div class="content">
              <h3>{{ tab_number === 1 ? '完成时间（分钟）' : '完单率（%）' }}</h3>
              <div v-loading="loading3" v-show="tab_number === 1" id="chart3"></div>
              <div v-loading="loading4" v-show="tab_number === 2" id="chart4"></div>
            </div>
            <div class="line content">
              <h3>{{ tab_number === 1 ? '完成时间趋势（分钟）' : '完单率趋势（%）' }}</h3>
              <div v-loading="loading5" id="chart5"></div>
            </div>
          </div>
        </el-col>
        <el-col>
          <div class="box">
            <header>看板3</header>
            <div class="content" style="margin-bottom: 60px;">
              <h3>统计</h3>
              <div class="g-r-center">
                <div v-loading="loading6" id="chart6" class="row"></div>
                <div v-loading="loading7" id="chart7" class="row"></div>
                <div v-loading="loading8" id="chart8" class="row"></div>
              </div>
            </div>
            <div class="content">
              <h3>趋势</h3>
              <div v-loading="loading9" id="chart9"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import { initCurrentTime } from '~/assets/js/utils'

let hour_timeSpan = 3600 * 1000 * 24,
  first_select_time = null

export default {
  data() {
    return {
      pickerOptions: {
        onPick(time) {
          if (time.maxDate) {
            first_select_time = null
          } else {
            first_select_time = time.minDate.getTime()
          }
        },
        disabledDate(time) {
          let status = time.getTime() > Date.now() - hour_timeSpan * 1

          if (first_select_time) {
            status =
              status ||
              time.getTime() < first_select_time - hour_timeSpan * 31 ||
              time.getTime() > first_select_time + hour_timeSpan * 30
          }

          return status
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', [new Date(), new Date()])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              let time = initCurrentTime(new Date())
              time.setTime(time.getTime() - hour_timeSpan)
              picker.$emit('pick', [time, time])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              let end = initCurrentTime(new Date())
              let start = initCurrentTime(new Date())
              start.setTime(start.getTime() - hour_timeSpan * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              let end = initCurrentTime(new Date())
              let start = initCurrentTime(new Date())
              start.setTime(start.getTime() - hour_timeSpan * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      time_value: [],
      tab_number: 1,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      loading6: false,
      loading7: false,
      loading8: false,
      loading9: false
    }
  },
  watch: {
    time_value(val) {
      if (val) {
        sessionStorage.selectTime = JSON.stringify(val)
        this.timeSelectChange()
      }
    },
    tab_number(number) {
      let url =
        number === 1
          ? '/json/chart5_1.json'
          : '/json/chart5_2.json'

      this.setLineTable(5, url)

      this.$nextTick(res => {
        this[number === 1 ? 'setOrderCompleteTime' : 'setOrderCompleteRate']()
      })
    }
  },
  mounted() {
    let selectTime = sessionStorage.selectTime

    if (selectTime) {
      let array = JSON.parse(selectTime)

      this.time_value = [new Date(array[0]), new Date(array[1])]
    } else {
      this.time_value = [new Date(), new Date()]
    }

    this.antvG2Init()
  },
  methods: {
    /**
     * 判断时间是否是当天
     * 是的话返回当天的凌晨00:00:00的时间戳
     * 不是的话返回false
     * @param {Object} time - 时间对象
     * @return
     */
    judgeTimeIsToday(time) {
      let date = new Date(),
        current_y = date.getFullYear(),
        current_m = date.getMonth() + 1,
        current_d = date.getDate(),
        select_y = time.getFullYear(),
        select_m = time.getMonth() + 1,
        select_d = time.getDate()

      if (
        current_y === select_y &&
        current_m === select_m &&
        current_d === select_d
      ) {
        return parseInt(
          new Date(`${select_y}-${select_m}-${select_d} 00:00:00`).getTime() /
            1000
        )
      } else {
        return false
      }
    },
    /**
     * 时间选择变化
     */
    timeSelectChange(type) {
      let url =
          this.tab_number === 1
            ? '/json/chart5_1.json'
            : '/json/chart5_2.json',
        timeSpan = this.judgeTimeIsToday(this.time_value[0])

      if (timeSpan) {
        this.timeStamps = [
          timeSpan,
          parseInt(this.time_value[1].getTime() / 1000)
        ]
      } else {
        this.timeStamps = [
          parseInt(this.time_value[0].getTime() / 1000),
          parseInt((this.time_value[1].getTime() + hour_timeSpan - 1) / 1000)
        ]
      }

      this.setPlatformPrice()
      this.setLineTable(2, '/json/chart2.json')
      this[
        this.tab_number === 1 ? 'setOrderCompleteTime' : 'setOrderCompleteRate'
      ]()
      this.setLineTable(5, url)
      this.orderHandleStatistics(6, '/json/chart6.json')
      this.orderHandleStatistics(7, '/json/chart7.json')
      this.orderHandleStatistics(8, '/json/chart8.json')
      this.setLineTable(9, '/json/chart9.json')
    },
    /**
     * antvG2 初始化
     */
    antvG2Init() {
      // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值
      let sliceNumber = 0.01
      // 自定义 other 的图形，增加两条线
      G2.Shape.registerShape('interval', 'sliceShape', {
        draw: function draw(cfg, container) {
          var points = cfg.points
          var path = []
          path.push(['M', points[0].x, points[0].y])
          path.push(['L', points[1].x, points[1].y - sliceNumber])
          path.push(['L', points[2].x, points[2].y - sliceNumber])
          path.push(['L', points[3].x, points[3].y])
          path.push('Z')
          path = this.parsePath(path)
          return container.addShape('path', {
            attrs: {
              fill: cfg.color,
              path: path
            }
          })
        }
      })

      // 采购渠道统计
      this.chart1 = new G2.Chart({
        container: 'chart1',
        width: 200,
        height: 200,
        padding: 'auto'
      })

      let param1 = {
        height: 300,
        forceFit: true,
        padding: [50, 40, 60, 60]
      }

      // 趋势图
      this.ds = new DataSet()
      this.chart2 = new G2.Chart(Object.assign({ container: 'chart2' }, param1))
      this.chart5 = new G2.Chart(Object.assign({ container: 'chart5' }, param1))
      this.chart9 = new G2.Chart(Object.assign({ container: 'chart9' }, param1))

      // 平均订单完成时间
      this.chart3 = new G2.Chart({
        container: 'chart3',
        forceFit: true,
        height: 200,
        padding: [20, 20, 50, 20]
      })

      //订单处理统计
      let param2 = {
        forceFit: true,
        height: 200,
        padding: 'auto'
      }

      this.chart6 = new G2.Chart(Object.assign({ container: 'chart6' }, param2))
      this.chart7 = new G2.Chart(Object.assign({ container: 'chart7' }, param2))
      this.chart8 = new G2.Chart(Object.assign({ container: 'chart8' }, param2))
    },
    /**
     * 设置 渠道圆形
     */
    setPlatformPrice(type) {
      this.loading1 = true
      this.$axios
        .get('/json/chart1.json', {
          params: {
            startTime: this.timeStamps[0],
            endTime: this.timeStamps[1]
          }
        })
        .then(res => {
          this.loading1 = false
          if (res.code === 0) {
            this.chart1.clear()

            this.chart1.guide().html({
              position: ['50%', '50%'],
              html:
                '<div class="g2-guide-html"><p class="title">总计</p><p class="value">' +
                res.data.sumPrice +
                '</p></div>'
            })

            this.chart1.source(res.data.data)
            this.chart1.coord('theta', {
              innerRadius: 0.65
            })
            this.chart1.tooltip({
              showTitle: false
            })
            this.chart1.legend({
              useHtml: true,
              position: 'right-center',
              containerTpl:
                '<div class="g2-legend" style="padding-left: 66px">' +
                '<table class="g2-legend-list"></table>' +
                '</div>',
              'g2-legend': {
                marginLeft: '0px',
                marginTop: '-107px'
              },
              itemTpl: (value, color, checked, index) => {
                let data = res.data.data[index]

                checked = checked ? 'checked' : 'unChecked'
                return (
                  '<tr class="g2-legend-list-item item-' +
                  index +
                  ' ' +
                  checked +
                  '" data-value="' +
                  value +
                  '" data-color=' +
                  color +
                  ' style="cursor: pointer;font-size: 14px;">' +
                  '<td style="border: none;padding:0;"><i class="g2-legend-marker" style="width:10px;height:10px;display:inline-block;margin-right:10px;background-color:' +
                  color +
                  ';"></i>' +
                  '<span class="g2-legend-text" style="color: rgba(0,0,0,.65);">' +
                  value +
                  '</span></td>' +
                  '<td>| ' +
                  ((data.price / res.data.sumPrice) * 100).toFixed(2) +
                  '%' +
                  '</td>' +
                  '<td style="color: rgba(0,0,0,.65);padding-left: 20px;">' +
                  data.price +
                  '</td>' +
                  '</tr>'
                )
              }
            })
            this.chart1
              .intervalStack()
              .position('price')
              .color('name')
              .shape('sliceShape')
            this.chart1.render()
          } else {
            this.$message.error(res.message)
          }
        })
    },
    /**
     * 设置 趋势
     * @param {Number} index - 下标
     * @param {String} url - 路由
     */
    setLineTable(index, url) {
      this['loading' + index] = true
      this.$axios
        .get(url, {
          params: {
            startTime: this.timeStamps[0],
            endTime: this.timeStamps[1]
          }
        })
        .then(res => {
          this['loading' + index] = false
          if (res.code === 0) {
            let chartObj = this['chart' + index],
              tab_number = this.tab_number

            // 字符串转数值
            for (let item of res.data) {
              if (index === 5) {
                if (tab_number === 1) {
                  item.count = Number(
                    parseInt(item.count / 60) + '.' + parseInt(item.count % 60)
                  )
                } else {
                  item.count = Number(item.count)
                }
              } else {
                item.count = Number(item.count)
              }
            }

            chartObj.clear()

            let Util = G2.Util,
              dv = this.ds.createView().source(res.data)

            chartObj.source(dv)
            chartObj.tooltip({
              crosshairs: 'y',
              shared: true,
              htmlContent: function htmlContent(title, items) {
                let html = '<div class="g2-tooltip">',
                  titleDom =
                    '<div class="g2-tooltip-title" style="margin-bottom: 4px;">' +
                    title +
                    '</div>',
                  listDom = '<ul class="g2-tooltip-list">'

                for (var i = 0; i < items.length; i++) {
                  let item = items[i],
                    itemDom =
                      '<li data-index={index}>' +
                      '<span style="background-color:' +
                      item.color +
                      ';width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>' +
                      item.name +
                      '<span class="g2-tooltip-value">' +
                      (index === 5
                        ? tab_number === 1
                          ? item.value.replace('.', '分') + '秒'
                          : item.value + '%'
                        : item.value) +
                      '</span>' +
                      '</li>'
                  listDom += itemDom
                }
                listDom += '</ul>'

                return html + titleDom + listDom + '</div>'
              }
            })
            chartObj.legend({
              position: 'top-left',
              offsetY: -20,
              onHover: Util.debounce(function(ev) {
                var item = ev.item

                var name = item.dataValue
                chartObj.get('geoms').forEach(function(geom) {
                  geom.getShapes().forEach(function(shape) {
                    var origin = shape.get('origin')
                    if (Util.isArray(origin)) {
                      origin = origin[0]
                    }
                    if (!shape.get('_originAttrs')) {
                      shape.set('_originAttrs', Util.cloneDeep(shape._attrs)) // 缓存原来的属性
                    }
                    if (origin._origin.name === name) {
                      var originAttrs = shape.get('_originAttrs')
                      shape._attrs = Util.cloneDeep(originAttrs)
                    } else {
                      shape.attr('stroke', '#ccc')
                    }
                  })
                })
              }),
              onUnhover: Util.debounce(function() {
                chartObj.get('geoms').forEach(function(geom) {
                  geom.getShapes().forEach(function(shape) {
                    if (shape.get('_originAttrs')) {
                      var originAttrs = shape.get('_originAttrs')
                      shape._attrs = Util.cloneDeep(originAttrs)
                    }
                  })
                })
                chartObj.get('canvas').draw()
              })
            })
            chartObj
              .line()
              .position('time*count')
              .color('name')
              .size('name', 2)
            chartObj.render()
            var tooltipCtr = chartObj.get('tooltipController')
            var tooltip = tooltipCtr.tooltip
          } else {
            this.$message.error(res.message)
          }
        })
    },
    /**
     * 设置订单完成时间
     */
    setOrderCompleteTime() {
      this.loading3 = true
      this.$axios
        .get('/json/chart3.json', {
          params: {
            startTime: this.timeStamps[0],
            endTime: this.timeStamps[1]
          }
        })
        .then(res => {
          this.loading3 = false
          if (res.code === 0) {
            this.chart3.clear()
            this.chart3.source(res.data)
            this.chart3.scale('avgtime', {
              alias: '平均完单时间'
            })
            this.chart3.axis('name', {
              label: {
                textStyle: {
                  fill: '#aaaaaa'
                }
              },
              tickLine: {
                alignWithLabel: false,
                length: 0
              }
            })
            this.chart3.axis('time', false)
            this.chart3.tooltip(false)

            this.chart3
              .interval()
              .position('name*time')
              .opacity(1)
              .label('value', {
                useHtml: true,
                htmlTemplate: function htmlTemplate(text, item) {
                  var a = item.point
                  return (
                    '<div class="g2-label-item"><p class="g2-label-item-value" style="width: 60px; font-size: 12px; text-align: center; color: #545454;">' +
                    (parseInt(a.time / 60)
                      ? parseInt(a.time / 60) + '分'
                      : '') +
                    (parseInt(a.time % 60)
                      ? parseInt(a.time % 60) + '秒'
                      : '') +
                    '</p></div>'
                  )
                }
              })
            this.chart3.render()
          } else {
            this.$message.error(res.message)
          }
        })
    },
    /**
     * 设置 订单完成率
     */
    setOrderCompleteRate() {
      this.loading4 = true
      if (!this.chart4) {
        this.chart4 = new G2.Chart({
          container: 'chart4',
          forceFit: true,
          height: 200,
          padding: 'auto'
        })
      }

      this.$nextTick(res => {
        this.$axios
          .get('/json/chart4.json', {
            params: {
              startTime: this.timeStamps[0],
              endTime: this.timeStamps[1]
            }
          })
          .then(res => {
            this.loading4 = false
            if (res.code === 0) {
              this.chart4.clear()
              this.chart4.source(res.data)
              this.chart4.legend(false)
              this.chart4.tooltip({
                showTitle: false
              })
              this.chart4.facet('rect', {
                fields: ['name'],
                padding: 20,
                showTitle: false,
                eachView: function eachView(view, facet) {
                  var data = facet.data
                  var color = void 0
                  if (data[0].name === '嘻哈') {
                    color = '#1990FF'
                  } else {
                    color = '#FACC14'
                  }
                  data.push({
                    name: '其他',
                    rate: 100 - data[0].rate
                  })
                  view.source(data)
                  view.coord('theta', {
                    radius: 0.8,
                    innerRadius: 0.5
                  })
                  view
                    .intervalStack()
                    .position('rate')
                    .color('name', [color, '#EFF0F3'])
                    .opacity(1)
                  view.guide().html({
                    position: ['50%', '50%'],
                    html:
                      '<div class="g2-guide-html"><p class="title">' +
                      data[0].name +
                      '</p><p class="value">' +
                      (data[0].rate + '%') +
                      '</p></div>'
                  })
                }
              })
              this.chart4.render()
            } else {
              this.$message.error(res.message)
            }
          })
      })
    },
    /**
     * 订单处理统计
     * @param {Number} index - 下标
     * @param {String} url - 路由
     */
    orderHandleStatistics(index, url) {
      this['loading' + index] = true
      this.$axios
        .get(url, {
          params: {
            startTime: this.timeStamps[0],
            endTime: this.timeStamps[1]
          }
        })
        .then(res => {
          this['loading' + index] = false
          if (res.code === 0) {
            let dv = this.ds.createView().source(res.data.data),
              chartObj = this['chart' + index]

            for (let item of res.data.data) {
              item.num = item.num / res.data.sumPrice
            }

            dv.transform({
              type: 'map',
              callback: function callback(row) {
                row.value = parseInt((res.data.sumPrice * row.num) / 100)
                return row
              }
            })
            chartObj.clear()
            chartObj.source(dv)
            chartObj.tooltip(false)
            chartObj.legend({
              useHtml: true,
              position: 'bottom-center',
              offsetY: -5
            })
            chartObj.coord('theta', {
              radius: 0.75,
              innerRadius: 0.6
            })
            chartObj
              .intervalStack()
              .position('num')
              .color('name')
              .opacity(1)
              .label('num', {
                textStyle: {
                  fill: 'block',
                  fontSize: 12,
                  shadowBlur: 2,
                  shadowColor: 'rgba(0, 0, 0, .45)'
                },
                rotate: 0,
                autoRotate: false,
                formatter: function formatter(text, item) {
                  return (
                    ((item.point.num / res.data.sumPrice) * 100).toFixed(2) +
                    '%'
                  )
                }
              })
            chartObj.guide().html({
              position: ['50%', '50%'],
              html:
                '<div class="g2-guide-html g2-guide-html-move"><p class="title">总计</p><p class="value">' +
                res.data.sumPrice +
                '</p></div>'
            })
            chartObj.on('interval:mouseenter', function(ev) {
              let data = ev.data._origin,
                g2_guide = document.getElementsByClassName(
                  'g2-guide-html-move'
                )[index - 6]

              g2_guide.style.opacity = 1
              g2_guide.getElementsByClassName('title')[0].innerHTML = data.name
              g2_guide.getElementsByClassName('value')[0].innerHTML = data.num
            })

            chartObj.on('interval:mouseleave', function() {
              let g2_guide = document.getElementsByClassName(
                'g2-guide-html-move'
              )[index - 6]

              g2_guide.getElementsByClassName('title')[0].innerHTML = '总计'
              g2_guide.getElementsByClassName('value')[0].innerHTML =
                res.data.sumPrice
            })
            chartObj.render()
          } else {
            this.$message.error(res.message)
          }
        })
    }
  }
}
</script>
<style lang='scss' scoped>
.container {
  background-color: #eff0f4;
}
.picker {
  span {
    padding-right: 8px;
    font-size: 20px;
  }
}
.statistics {
  min-width: 900px;
  padding-top: 30px;
  header {
    position: relative;
    height: 56px;
    padding: 0 24px 30px;
    line-height: 56px;
    font-size: 16px;
    border-bottom: 1px solid #e9e9e9;
    .btns {
      position: absolute;
      top: 11px;
      right: 24px;
      button {
        float: left;
        height: 32px;
        padding: 0 16px;
        color: #000;
        border: 1px solid #d9d9d9;
        border-radius: 4px 0 0 4px;
        cursor: pointer;
        &.active {
          color: #1890ff;
          border: 1px solid #1890ff;
        }
        &:last-child {
          border-radius: 0 4px 4px 0;
        }
      }
    }
  }
  .box {
    margin-bottom: 24px;
    background-color: #fff;
    .content {
      margin: 0 24px;
      h3 {
        height: 70px;
        line-height: 70px;
        font-size: 14px;
        color: #000;
      }
      &.line {
        margin-top: 22px;
        border-top: 1px solid #e9e9e9;
      }
      .hide {
        width: 100%;
        position: absolute;
        z-index: -1;
      }
      #channel-round {
        padding-left: 16px;
      }
      .g-r-center {
        .row {
          flex: 1;
        }
      }
    }
  }
}
</style>
<style lang='scss'>
#chart1 {
  .g2-legend {
    max-width: none !important;
  }
}

.g2-guide-html {
  text-align: center;
  .title {
    color: #8c8c8c;
    font-size: 12px;
  }
  .value {
    font-size: 20px;
  }
  &.g2-guide-html-move {
    width: 100px;
  }
}

.g2-tooltip {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 3px;
  color: rgb(87, 87, 87);
  font-size: 12px;
  line-height: 20px;
  padding: 10px 10px 6px 10px;
  box-shadow: 0px 0px 10px #aeaeae;
  pointer-events: none;
}

.g2-tooltip-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.g2-tooltip-value {
  margin-left: 30px;
  display: inline;
  float: right;
}

.g2-tooltip-story {
  color: #9b9b9b;
  font-size: 12px;
  padding-bottom: 10px;
  margin-top: 10px;
  list-style-type: none;
  padding-top: 10px;
}
</style>
