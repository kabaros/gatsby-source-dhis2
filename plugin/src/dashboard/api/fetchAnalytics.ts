import { AxiosCacheInstance } from "axios-cache-interceptor"
import { Reporter } from "gatsby"
import { IDashboardItem } from "../../types"
import getAnalyticsParams from "../utils/getAnalyticsParams"
import formatMetaData from "../utils/formatMetaData"

const fetchAnalytics =
  (axios: AxiosCacheInstance, reporter: Reporter) =>
  async (dashboardItem: IDashboardItem): Promise<null | IDashbordItemAnalytics> => {
    const logInfo = `visualization id: ${dashboardItem.visualization?.id} | ${dashboardItem.visualization?.name}`

    if (!dashboardItem.visualization?.id) {
      return null
    }
    const params = getAnalyticsParams(dashboardItem)

    return axios
      .get<IDashbordItemAnalytics>(`/analytics`, {
        params,
      })
      .then(({ data }) => {
        reporter.verbose(`      success(/analytics) | ${logInfo}`)
        data.metaData = {
          ...formatMetaData(data.metaData),
        }
        data.visualizationId = dashboardItem.visualization?.id
        return data
      })
      .catch((err) => {
        reporter.error(`        error(/analytics) | ${err} | ${JSON.stringify(err?.response?.data)}`)
        reporter.verbose(`      ${logInfo} | ${JSON.stringify(params)}`)
        return null
      })
  }

type IDashbordItemAnalytics = Record<string, unknown> & {
  metaData: Record<string, Record<string, { name: string }>>
  visualizationId: string
}

export default fetchAnalytics
