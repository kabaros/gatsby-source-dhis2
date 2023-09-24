import slugify from "slugify"
import { SourceNodesArgs } from "gatsby"
import { INodeBuilderArgs, IPluginOptionsInternal } from "../types"
import { NODE_TYPES } from "../constants"
import { setupCache } from "axios-cache-interceptor"
import Axios, { AxiosHeaderValue } from "axios"
import fetchAllDashboards from "./api/fetchAllDashboards"
import fetchVisualisations from "./api/fetchVisualizations"
import fetchAnalytics from "./api/fetchAnalytics"

const getAllDashboards = async (
  gatsbyApi: SourceNodesArgs,
  pluginOptions: IPluginOptionsInternal,
  nodeBuilder: ({ gatsbyApi, input }: INodeBuilderArgs) => void
) => {
  const { reporter } = gatsbyApi
  const { dhis2Url, dhis2Username, dhis2Password } = pluginOptions

  reporter.info(`connecting to ${dhis2Url}`)

  const authenticationHeaderValue = Buffer.from(dhis2Username + `:` + dhis2Password).toString(`base64`)

  const headers: { [key: string]: AxiosHeaderValue } = {
    Authorization: `Basic ${authenticationHeaderValue}`,
  }

  const axios = setupCache(Axios)
  axios.defaults.baseURL = dhis2Url
  axios.defaults.headers = {
    ...axios.defaults.headers,
    ...headers,
  }

  const getAllDashboards = fetchAllDashboards(axios, reporter)
  const getVisualisations = fetchVisualisations(axios, reporter)
  const getAnalytics = fetchAnalytics(axios, reporter)

  /**
   * getting dashboards
   */
  const dashboardSourcingTimer = reporter.activityTimer(`Sourcing Dashboards`)
  dashboardSourcingTimer.start()
  const allDashboards = await getAllDashboards()
  dashboardSourcingTimer.setStatus(`received all ${allDashboards.length} dashboards.`)
  dashboardSourcingTimer.end()

  /**
   * augmenting dashboard items with visualizations
   */
  const visualizingSourcingTimer = reporter.activityTimer(`Sourcing visualizations`)
  visualizingSourcingTimer.start()
  const allVisualisations = (
    await Promise.all(
      allDashboards
        .map((d) => d.dashboardItems)
        .flat()
        .map(async (dashboardItem) => {
          return getVisualisations(dashboardItem)
        })
    )
  ).filter((r) => !!r)
  visualizingSourcingTimer.setStatus(`received all ${allVisualisations.length} visualizations.`)
  visualizingSourcingTimer.end()

  /**
   * augmenting with analytics data
   */
  const analyticsSourcingTimer = reporter.activityTimer(`Sourcing analytics`)
  analyticsSourcingTimer.start()
  const allAnalytics = await Promise.all(
    allDashboards
      .map((d) => d.dashboardItems)
      .flat()
      .map(async (dashboardItem) => {
        return getAnalytics({
          ...dashboardItem,
          visualization: allVisualisations.find((v) => v.id === dashboardItem.visualization?.id),
        })
      })
  )
  analyticsSourcingTimer.setStatus(`received all ${allAnalytics.length} analytics requests.`)
  analyticsSourcingTimer.end()

  for (const dashboardResult of allDashboards) {
    dashboardResult.dashboardItems = dashboardResult.dashboardItems.map((dashboardItem) => {
      const visualization = allVisualisations.find((v) => v.id === dashboardItem.visualization?.id) //?? dashboardItem?.visualization
      const analytics = allAnalytics.find((analytic) => analytic?.visualizationId === dashboardItem.visualization?.id)

      return {
        ...dashboardItem,
        visualization: {
          ...visualization,
          analytics,
        },
      }
    })
  }

  /**
   * Iterate over the data and create nodes
   */
  for (const dashboardResult of allDashboards) {
    nodeBuilder({
      gatsbyApi,
      input: {
        type: NODE_TYPES.Dashboard,
        data: {
          ...dashboardResult,
          dhis2Id: dashboardResult.id,
          slug: slugify(dashboardResult.displayName, { lower: true }),
          sortOrder: dashboardResult.sortOrder,
        },
      },
    })
  }
}

export default getAllDashboards
