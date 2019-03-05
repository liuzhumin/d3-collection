<template>
  <div class="curve-wrap">
    <p>customTimeFormat</p>
    <p>同一坐标系下，绘制多个曲线图</p>
    <p>d3缩放功能</p>
    <p>tooltip提示框</p>
    <div :id="id" class="curve">
      <!--<svg width="960" height="500"></svg>-->
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { FormatTime } from "@/util/format-time";

export default {
  name: "",
  data() {
    return {
      colors: null,
      plotArrayData: []
    };
  },
  props: {
    plotData: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: "default"
    },
    xItem: {
      type: String,
      default: ""
    },
    yItem: {
      type: String,
      default: ""
    },
  },
  created() {
    this.colors = d3.scaleOrdinal(d3.schemeCategory10);
  },
  mounted() {
    this.plotChart(this.plotData);
  },
  watch: {
    plotData(data) {
      let vm = this;
      console.log("画图数据");
      this.$nextTick(() => {
        vm.plotChart(data);
      });
    }
  },
  methods: {
    plotChart(data) {
      const vm = this;
      d3.select(`#${vm.id} svg`).remove();
      if (data.length === 0) {
        return;
      }

      let parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
      let formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");

      let curvewidth = document.getElementById(`${vm.id}`).offsetWidth;
      let curveheight = document.getElementById(`${vm.id}`).offsetHeight;

      //边距
      let margin = { top: 20, right: 20, bottom: 30, left: 40 },
        margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
        width = curvewidth - margin.left - margin.right,
        height = curveheight - margin.top - margin.bottom,
        height2 = curveheight - margin2.top - margin2.bottom;

      let customTimeFormat = timeFormat([
        [
          d3.timeFormat("%Y"),
          function() {
            return true;
          }
        ],
        [
          d3.timeFormat("%m月"),
          function(d) {
            return d.getMonth();
          }
        ],
        [
          d3.timeFormat("%m. %d"),
          function(d) {
            return d.getDate() != 1;
          }
        ],
        [
          d3.timeFormat("%m %d"),
          function(d) {
            return d.getDay() && d.getDate() != 1;
          }
        ],
        [
          d3.timeFormat("%H 点"),
          function(d) {
            return d.getHours();
          }
        ],
        [
          d3.timeFormat("%H:%M"),
          function(d) {
            return d.getMinutes();
          }
        ],
        [
          d3.timeFormat(":%S"),
          function(d) {
            return d.getSeconds();
          }
        ],
        [
          d3.timeFormat(".%L"),
          function(d) {
            return d.getMilliseconds();
          }
        ]
      ]);
      //定义画布宽高

      let svg = d3
        .select(`#${vm.id}`)
        .append("svg:svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      let x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]);

      let xAxis = d3.axisBottom(x).tickFormat(customTimeFormat),
        yAxis = d3.axisLeft(y);

      let zoom = d3
        .zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

      svg
        .append("defs")
        .append("clipPath")
        .attr("id", `clip-${vm.id}`)
        .append("rect")
        .attr("width", width)
        .attr("height", height);

      svg
        .append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);

      let focus = svg
        .append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg
        .append("g")
        .attr("class", "context")
        .attr(
          "transform",
          "translate(" + margin2.left + "," + margin2.top + ")"
        );

      //添加提示框
      let tooltip = d3
        .select(`#${vm.id}`)
        .append("div")
        .attr("class", "tooltip")
        .style("display", "none");


      let axisArray = [];
      //所有数据放到一个数组里面
      let yAxisArray = [];

      data.forEach(item => {
        axisArray = axisArray.concat(item.filter(o => o));
        yAxisArray = yAxisArray.concat(
        item.filter(o => o).map(o => Number(o[vm.yItem])));
      });
      console.log(data);

      x.domain(
        d3.extent(axisArray, function(d) {
          return parseDate(FormatTime(d[vm.xItem]));
        })
      );

      y.domain([d3.min(yAxisArray) - 1, d3.max(yAxisArray) + 1]);
      x2.domain(x.domain());
      y2.domain(y.domain());

      data.forEach((dataset, index) => {
        // 绘制体温
        plotCurve(dataset, vm.colors(index), index, vm.yItem);
      });

      focus
        .append("g")
        .attr("class", "axis x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      focus
        .append("g")
        .attr("class", "axis y")
        .call(yAxis);

      function plotCurve(data, color, index, yItem) {
        data.forEach(function(d) {
          if (d) {
            d[vm.xItem] = parseDate(FormatTime(d[vm.xItem]));
            // d[yItem] = +d[yItem];
          }
        });

        focus
          .append("path")
          .datum(data)
          // .attr("class", "line")
          .attr("stroke", color)
          .attr("stroke-width", "1px")
          .style("clip-path", `url(#clip-${vm.id})`)
          .attr("class", `line line-${yItem} line-${index}`)
          .attr("d", getLine(yItem));

        const g_circles = focus
          .selectAll(`.circle-${yItem}-${index}`)
          .data(
            data.filter(function(d) {
              return d;
            })
          )
          .enter()
          .append("g");

        g_circles
          .append("circle")
          .attr(
            "class",
            `linecircle linecircle-${yItem} circle-${yItem}-${index}`
          )
          .style("clip-path", `url(#clip-${vm.id})`)
          .attr("cx", d => x(d[vm.xItem]))
          .attr("cy", d => y(d[yItem]))
          .attr("r", 2)
          .style("fill", "#ffffff")
          .style("opacity", 0.8)
          .attr("stroke", color)
          .attr("stroke-width", "1px")
          .on("mouseover", function(d) {
            d3.select(this)
              .transition()
              .duration(500)
              .attr("cx", d => x(d[vm.xItem]))
              .attr("cy", d => y(d[yItem]))
              .attr("r", 3)
              .style("opacity", 1);

            const tprText = "温度" 

            tooltip
              .html(
                `时间：${formatDate(d[vm.xItem])}<br> ${tprText}：${Number(
                  d[yItem]
                ).toFixed(2)} ℃<br> rss：${d.rssi}`
              )
              .style("left", d3.mouse(this)[0] - 20 + "px")
              .style("top", d3.mouse(this)[1] + 50 + "px")
              .style("background-color", color)
              .style("display", "block");
          })
          .on("mousemove", function() {
            //             /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */
            tooltip
              .style("left", d3.mouse(this)[0] - 20 + "px")
              .style("top", d3.mouse(this)[1] + 50 + "px");
          })
          .on("mouseout", function() {
            d3.select(this)
              .transition()
              .duration(500)
              .attr("cx", d => x(d[vm.xItem]))
              .attr("cy", d => y(d[yItem]))
              .attr("r", 2)
              .style("opacity", 0.8);
            tooltip.style("display", "none");
          });
      }

      function getLine(yItem) {
        let line = d3
          .line(yItem)
          .defined(d => {
            return d;
          })
          .x(function(d) {
            return x(d[vm.xItem]);
          })
          .y(function(d) {
            return y(d[yItem]);
          })
          .curve(d3.curveCatmullRom.alpha(0.5));
        return line;
      }

      function zoomed() {
        let t = d3.event.transform;
        console.log("tttt");
        console.log(t);
        x.domain(t.rescaleX(x2).domain());
        y.domain(t.rescaleY(y2).domain());
        focus.select(".axis.x").call(xAxis);
        focus.select(".axis.y").call(yAxis);
        zoomItem(vm.yItem);
      }

      function zoomItem(item) {
        focus.selectAll(`.line-${item}`).attr("d", getLine(item));
        focus
          .selectAll(`.linecircle-${item}`)
          .attr("cx", d => x(d[vm.xItem]))
          .attr("cy", d => y(d[item]));
      }

      function timeFormat(formats) {
        return function(collect_time) {
          let i = formats.length - 1,
            f = formats[i];
          while (!f[1](collect_time)) f = formats[--i];
          return f[0](collect_time);
        };
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
.curve-wrap {
  margin-top: 20px;
  height: 400px;
}

.curve {
  height: 300px;
}

.empty {
  text-align: left;
}

.curve {
  /*height: 500px;*/
  margin-bottom: 20px;
  position: relative;
}
.axis path, .axis line {
  fill: none;
  stroke: #666;
  shape-rendering: crispEdges;
}


.tick line {
  stroke: #666;
  stroke-dasharray: 1
}

.line {
  fill: none;
  /*clip-path: url(#clip);*/
}

.axis text {
  font: 10px sans-serif;
}

.linecircle {
  cursor: pointer;
  /*clip-path: url(#clip);*/
}

.tooltip {
  position: absolute;
  width: 200px;
  height: auto;
  font-family: simsun;
  color: #fff;
  background-color: #f1c551;
  border-radius: 5px;
  padding: 6px 10px;
}

.zoom {
  cursor: move;
  fill: none;
  pointer-events: all;
}
.area {
  fill: steelblue;
  clip-path: url(#clip);
}




</style>
