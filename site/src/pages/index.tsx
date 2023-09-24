import * as React from "react"
import { graphql, HeadFC, PageProps } from "gatsby"
import DashboardItem from "../components/DashboardItem"
import * as styles from "../index.module.css"

export default function IndexPage({
  data: {
    allDashboard: { nodes: dashboards },
  },
}: PageProps<Queries.IndexPageQuery>): React.ReactElement {
  return (
    <main>
      <h1 id="top">Public Portal</h1>
      <section>
        <ol>
          {dashboards.map((dashboard) => {
            return (
              <>
                <li style={{ margin: `5px` }}>
                  <a href={`#${dashboard.slug}`}>{dashboard.displayName}</a>
                </li>
              </>
            )
          })}
        </ol>
        {dashboards.map((dashboard) => {
          return (
            <div id={dashboard.slug}>
              <h2>{dashboard.displayName}</h2>
              <div className={styles.visualizationContainer}>
                {dashboard.dashboardItems.map((dashboardItem) => {
                  return <DashboardItem dashboardItem={dashboardItem} />
                })}
              </div>
              <a href="#top">Top</a>
            </div>
          )
        })}
      </section>
    </main>
  )
}

export const Head: HeadFC = () => (
  <React.Fragment>
    <title>Public Portal example</title>
  </React.Fragment>
)

export const query = graphql`
  query IndexPage {
    allDashboard(limit: 6, sort: { sortOrder: ASC }) {
      nodes {
        # id
        displayName
        # dhis2Id
        slug
        dashboardItems {
          # id
          # w
          # x
          # y
          type
          # resources {
          #   id
          #   name
          # }
          text
          visualization {
            description
            id
            name
            type
            analytics {
              metaData {
                items {
                  id
                  name
                }
              }
              # width
              # headerWidth
              # headers {
              #   valueType
              #   type
              #   name
              #   meta
              #   hidden
              #   column
              # }
              # height
              rows
            }
            # axes {
            #   decimals
            #   index
            #   maxValue
            #   minValue
            #   steps
            #   type
            #   title {
            #     text
            #   }
            #   targetLine {
            #     value
            #     title {
            #       text
            #     }
            #   }
            # }
            # colTotals
            # colSubTotals
            # colorSet
            columns {
              items {
                dimensionItemType
                id
                name
              }
              dimension
            }
            # rangeAxisDecimals
            # rangeAxisLabel
            # rangeAxisMaxValue
            # rangeAxisMinValue
            # rangeAxisSteps
            # rowSubTotals
            # rowTotals
            series {
              axis
              dimensionItem
            }
            # seriesKey {
            #   hidden
            # }
            # numberType
            # noSpaceBetweenColumns
            # yearlySeries
            # topLimit
            # targetLineValue
            # targetLineLabel
            # subscribed
            # sortOrder
            # skipRounding
            # showHierarchy
            # showDimensionLabels
            # showData
            rows {
              dimension
              items {
                dimensionItemType
                id
                name
              }
            }
            # regressionType
            # regression
            # percentStackedValues
            # digitGroupSeparator
            displayDensity
            displayFormName
            # displayRangeAxisLabel
            # displayTargetLineLabel
            # externalAccess
            # favorite
            # fixColumnHeaders
            # fixRowHeaders
            # fontSize
            # hideEmptyColumns
            # hideEmptyRowItems
            # hideEmptyRows
            # hideLegend
            # hideSubtitle
            # hideTitle
            # cumulativeValues
            # completedOnly
            # aggregationType
          }
          # shape
          # h
        }
      }
    }
  }
`
