import { AxiosCacheInstance } from "axios-cache-interceptor"
import { Reporter } from "gatsby"
import { IDashboard, IDashboardItem } from "../../types"

const fetchAllDashboards = (axios: AxiosCacheInstance, reporter: Reporter) => async () => {
  const { data } = await axios.get<DashboardResponse>(`/dashboards`, {
    params: {
      fields: `id,displayName,favorite~rename(starred)&paging=false`,
    },
  }) // @todo go through pages?

  // result comes back sorted rather than having a sort field, so adding the index as a sort field to avoid losing the order in graphql
  data.dashboards = data.dashboards.map((dashboard, index) => {
    return { ...dashboard, sortOrder: index }
  })

  reporter.verbose(`     success(/dashboards) | ${data.dashboards.length} dashboards.`)

  const requestsForDashboards = data.dashboards.map(({ id }) => {
    return axios
      .get<SingleDashboardResponse>(`/dashboards/${id}`, {
        params: {
          fields: `id,displayName,displayDescription,favorite~rename(starred),restrictFilters,allowedFilters,layout,itemConfig,dashboardItems[id,type,shape,x,y,width~rename(w),height~rename(h),messages,text,appKey,reports[type,id,displayName~rename(name)],resources[id,displayName~rename(name)],users[id,displayName~rename(name)],visualization[id,displayName~rename(name),type,displayDescription~rename(description)],map[id,displayName~rename(name),type,displayDescription~rename(description)],eventReport[id,displayName~rename(name),type,displayDescription~rename(description)],eventChart[id,displayName~rename(name),type,displayDescription~rename(description)],eventVisualization[id,displayName~rename(name),type,displayDescription~rename(description)]]`,
        },
      })
      .then(({ data }) => {
        reporter.verbose(`     success(/dashboard/${id}) | ${data.displayName}`)
        return data
      })
  })

  const allDashboards = await Promise.all(requestsForDashboards)

  const result = allDashboards.map((d) => ({
    ...data.dashboards.find((originalDashboard) => originalDashboard.id === d.id),
    ...d,
  }))

  return result
}

type DashboardResponse = {
  dashboards: Array<IDashboard>
}

type SingleDashboardResponse = {
  id: string
  displayName: string
  sortOrder: number
  dashboardItems: Array<IDashboardItem>
}

export default fetchAllDashboards
