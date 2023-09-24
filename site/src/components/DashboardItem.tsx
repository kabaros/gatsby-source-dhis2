import * as React from "react"
import * as styles from "../index.module.css"
import Visualization from "./Visualization"

type DasboardItemProps = {
  dashboardItem: Queries.DashboardDashboardItems
}

const DashboardItem = ({ dashboardItem }: DasboardItemProps) => {
  if (dashboardItem.type === `VISUALIZATION`) {
    return (
      <div className={styles.dashboardItem}>
        <Visualization dashboardItem={dashboardItem} />
      </div>
    )
  }

  if (dashboardItem.type === `TEXT`) {
    return (
      <div className={styles.dashboardItem} style={{ display: `flex`, alignItems: `center` }}>
        <div>{dashboardItem?.text}</div>
      </div>
    )
  }
  return (
    <div className={styles.dashboardItem}>
      <div>{dashboardItem?.type} | (not supported in this example site)</div>
    </div>
  )
}

export default DashboardItem
