import * as React from "react"
import { IDashboardItem } from "plugin/dist/types"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

type VisualizationProps = {
  dashboardItem: Queries.DashboardDashboardItems
}

const Visualization = ({ dashboardItem }: VisualizationProps) => {
  const columnItems = dashboardItem.visualization?.columns?.[0]?.items

  const { rows, metaData } = dashboardItem.visualization.analytics ?? {}

  // rows looks like [orgUnit, PE, value]
  const categories = [...new Set(rows?.map((r) => r[0]))].map(
    (id) => metaData?.items.find((m) => m.id === id)?.name ?? id
  )

  const series = columnItems?.map((c) => {
    return {
      name: c.name,
      data: rows?.filter((r) => !!r.includes(c.id)).map((arrayOfValues) => Number(arrayOfValues[2])), // it looks like [orgUnit, PE, value]
    }
  })

  const types = {
    COLUMN: `column`,
    LINE: `line`,
    BAR: `column`,
    PIE: `pie`,
  }
  const options: Highcharts.Options = {
    chart: {
      type: types[dashboardItem.visualization.type] ?? `column`,
    },
    title: {
      text: ``,
    },
    xAxis: {
      categories,
    },
    // yAxis: {
    //   min: 0,
    //   title: {
    //     text: `Rainfall (mm)`,
    //   },
    // },
    series,
  }

  console.log(dashboardItem)
  return (
    <>
      {dashboardItem.visualization?.name} | {dashboardItem.visualization?.type}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  )
}

export default Visualization
