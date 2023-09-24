import type { GatsbyNode } from "gatsby"
import type { ObjectSchema } from "gatsby-plugin-utils"

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({ Joi }): ObjectSchema => {
  return Joi.object({
    dhis2Url: Joi.string().uri().required().description(`The DHIS2 URL`),
    dhis2Username: Joi.string().required().description(`The DHIS2 URL`),
    dhis2Password: Joi.string().required().description(`The DHIS2 URL`),
  })
}
