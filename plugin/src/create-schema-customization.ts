import type { GatsbyNode } from "gatsby"
import { NODE_TYPES } from "./constants"

export const createSchemaCustomization: GatsbyNode[`createSchemaCustomization`] = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
      type ${NODE_TYPES.Dashboard} implements Node {
        id: ID!
        name: String!
      }
    `)
}
