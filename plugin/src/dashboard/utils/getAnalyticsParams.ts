import { IDashboardItem } from "../../types"

const getAnalyticsParams = (dashboardItem: IDashboardItem) => {
  const filters = dashboardItem.visualization.filters
    ?.map((f) => {
      return `${f.dimension}:${f.items.map((i) => i.id).join(`;`)}`
    })
    .filter((f) => !!f)
    .join(`,`)

  const rows = dashboardItem.visualization.rows
    ?.map((f) => {
      return `${f.dimension}:${f.items.map((i) => i.id).join(`;`)}`
    })
    .filter((r) => !!r)
    .join(`,`)

  const columns = dashboardItem.visualization.columns
    ?.map((f) => {
      return `${f.dimension}:${f.items.map((i) => i.id).join(`;`)}`
    })
    .filter((f) => !!f)
    .join(`,`)

  const params = {
    dimension: `${rows},${columns}`,
    filter: filters,
    displayProperty: `NAME`,
    includeNumDen: false,
    skipMeta: false, // @todo: maybe should be false?
    skipData: false,
  }

  return params
}
export default getAnalyticsParams
