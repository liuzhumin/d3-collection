<template>
  <div>
      <plot-multiple
          ref="plot"
          x-item="time"
          y-item="tpr"
          :plot-data="plotData">
    </plot-multiple>
</div>
</template>

<script>
  import PlotMultiple from '@/components/plot-multiple'
export default {
  name: "",
  data() {
    return {
      plotData: []
    };
  },
  components: {
       PlotMultiple
  },
  created() {
    this.plotData = [
      [
        {
          tpr: "38.480000",
          time: "2019-01-26T02:43:01.868752Z"
        },
        {
          tpr: "39.320000",
          time: "2019-01-26T02:25:22.740314Z"
        },
        {
          tpr: "40.480000",
          time: "2019-01-26T02:08:01.566032Z"
        },
        {
          tpr: "38.440000",
          time: "2019-01-26T01:50:48.513513Z"
        }
      ],
      [
        {
          tpr: "39.340000",
          time: "2019-01-26T02:43:01.868752Z"
        },
        {
          tpr: "38.460000",
          time: "2019-01-26T02:25:22.740314Z"
        },
        {
          tpr: "36.430000",
          time: "2019-01-26T02:08:01.566032Z"
        },
        {
          tpr: "38.450000",
          time: "2019-01-26T01:50:48.513513Z"
        }
      ]
    ];
  },
  methods: {}
};
</script>

<style scope>
</style>
