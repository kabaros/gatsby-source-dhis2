import type { GatsbyConfig } from "gatsby"
import type { IPluginOptions } from "plugin"

require(`dotenv`).config({
  path: `.env.${process.env.NODE_ENV}`,
})

/**
 * In a real-world scenario, you would probably place this in a .env file
 * @see https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/
 */
const { DHIS2_URL, DHIS2_USERNAME, DHIS2_PASSWORD } = process.env

const config: GatsbyConfig = {
  graphqlTypegen: true,
  plugins: [
    // Load the plugin with its options
    {
      resolve: `plugin`,
      // You can pass any serializable options to the plugin
      options: {
        dhis2Url: DHIS2_URL,
        dhis2Username: DHIS2_USERNAME,
        dhis2Password: DHIS2_PASSWORD,
      } satisfies IPluginOptions,
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
}

export default config
