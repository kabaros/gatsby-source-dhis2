import type { PluginOptions as GatsbyDefaultPluginOptions, IPluginRefOptions, SourceNodesArgs } from "gatsby"
import { NODE_TYPES } from "./constants"

export type IDashboardItem = {
  visualization: any
  users: Array<any>
  x: number
  y: number
  type: string // 'VISUALIZATION' | 'MAP'
  id: string
  reports: Array<any>
  resources: Array<any>
  h: number
  w: number
  analytics: any
}

export type IVisualizationResult = {
  id: string
  displayFormName: string
  rows: Array<any>
  columns: Array<any>
}

export type IDashboard = {
  id: string
  dhis2Id: string
  slug: string
  sortOrder: number
  displayName: string
  dashboardItems: Array<IDashboardItem>
}

export type NodeBuilderInput = { type: typeof NODE_TYPES.Dashboard; data: IDashboard }

interface IPluginOptionsKeys {
  dhis2Url: string
  dhis2Username: string
  dhis2Password: string
}

/**
 * Gatsby expects the plugin options to be of type "PluginOptions" for gatsby-node APIs (e.g. sourceNodes)
 */
export interface IPluginOptionsInternal extends IPluginOptionsKeys, GatsbyDefaultPluginOptions {}

/**
 * These are the public TypeScript types for consumption in gatsby-config
 */
export interface IPluginOptions extends IPluginOptionsKeys, IPluginRefOptions {}

export interface INodeBuilderArgs {
  gatsbyApi: SourceNodesArgs
  // This uses the "Discriminated Unions" pattern
  // https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions
  input: NodeBuilderInput
}
