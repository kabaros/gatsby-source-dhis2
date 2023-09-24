import { AxiosCacheInstance } from "axios-cache-interceptor"
import { Reporter } from "gatsby"
import { IDashboardItem, IVisualizationResult } from "../../types"

const fetchVisualisations =
  (axios: AxiosCacheInstance, reporter: Reporter) =>
  async (dashboardItem: IDashboardItem): Promise<null | IVisualizationResult> => {
    if (!dashboardItem.visualization?.id) {
      return null
    }
    const visualizationUrl = `/visualizations/${dashboardItem.visualization?.id}`

    return axios
      .get<IVisualizationResult>(visualizationUrl, {
        params: {
          fields: `id,displayName~rename(name),type,displayDescription~rename(description),columns[dimension,legendSet[id],filter,programStage,items[dimensionItem~rename(id),displayName~rename(name),dimensionItemType]],rows[dimension,legendSet[id],filter,programStage,items[dimensionItem~rename(id),displayName~rename(name),dimensionItemType]],filters[dimension,legendSet[id],filter,programStage,items[dimensionItem~rename(id),displayName~rename(name),dimensionItemType]],*,!attributeDimensions,!attributeValues,!category,!categoryDimensions,!categoryOptionGroupSetDimensions,!columnDimensions,!dataDimensionItems,!dataElementDimensions,!dataElementGroupSetDimensions,!filterDimensions,!itemOrganisationUnitGroups,!lastUpdatedBy,!organisationUnitGroupSetDimensions,!organisationUnitLevels,!organisationUnits,!programIndicatorDimensions,!relativePeriods,!reportParams,!rowDimensions,!translations,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren`,
        },
      })
      .then(({ data }) => {
        reporter.verbose(`      success(${visualizationUrl}) | ${data?.displayFormName}`)
        return data
      })
      .catch((err) => {
        reporter.error(`        error(${visualizationUrl})`)
        reporter.error(err)
        return null
      })
  }

export default fetchVisualisations
