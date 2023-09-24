import type { GatsbyNode, NodeInput } from "gatsby"
import type { INodeBuilderArgs, IPluginOptionsInternal } from "./types"
import { CACHE_KEYS } from "./constants"
import getAllDashboards from "./dashboard"

let isFirstSource = true

/**
 * The sourceNodes API is the heart of a Gatsby source plugin. This is where data is ingested and transformed into Gatsby's data layer.
 * @see https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#sourceNodes
 */
export const sourceNodes: GatsbyNode[`sourceNodes`] = async (gatsbyApi, pluginOptions: IPluginOptionsInternal) => {
  const { actions, reporter, cache, getNodes } = gatsbyApi
  const { touchNode } = actions

  /**
   * It's good practice to give your users some feedback on progress and status. Instead of printing individual lines, use the activityTimer API.
   * This will give your users a nice progress bar and can you give updates with the .setStatus API.
   * In the end your users will also have the exact time it took to source the data.
   * @see https://www.gatsbyjs.com/docs/reference/config-files/node-api-helpers/#reporter
   */
  const sourcingTimer = reporter.activityTimer(`Sourcing from DHIS2 plugin`)
  sourcingTimer.start()

  if (isFirstSource) {
    /**
     * getNodes() returns all nodes in Gatsby's data layer
     */
    getNodes().forEach((node) => {
      /**
       * "owner" is the name of your plugin, the "name" you defined in the package.json
       */
      if (node.internal.owner !== `plugin`) {
        return
      }

      /**
       * Gatsby aggressively garbage collects nodes between runs. This means that nodes that were created in the previous run but are not created in the current run will be deleted. You can tell Gatsby to keep old, but still valid nodes around, by "touching" them.
       * For this you need to use the touchNode API.
       *
       * However, Gatsby only checks if a node has been touched on the first sourcing. This is what the "isFirstSource" variable is for.
       * @see https://www.gatsbyjs.com/docs/reference/config-files/actions/#touchNode
       */
      touchNode(node)
    })

    isFirstSource = false
  }

  /**
   * If your API supports delta updates via e.g. a timestamp or token, you can store that information via the cache API.
   *
   * The cache API is a key-value store that persists between runs.
   * You should also use it to persist results of time/memory/cpu intensive tasks.
   * @see https://www.gatsbyjs.com/docs/reference/config-files/node-api-helpers/#cache
   */
  const lastFetchedDate: number = await cache.get(CACHE_KEYS.Timestamp)
  const lastFetchedDateCurrent = Date.now()

  reporter.verbose(`Last fetched date: ${lastFetchedDate}`)

  await getAllDashboards(gatsbyApi, pluginOptions, nodeBuilder)

  await cache.set(CACHE_KEYS.Timestamp, lastFetchedDateCurrent)

  sourcingTimer.setStatus(`Processed all dashboards`)
  sourcingTimer.end()
}

export function nodeBuilder({ gatsbyApi, input }: INodeBuilderArgs) {
  const id = gatsbyApi.createNodeId(`${input.type}-${input.data.id}`)

  const extraData: Record<string, unknown> = {}

  const node = {
    ...input.data,
    ...extraData,
    id,
    /**
     * "id" is a reserved field in Gatsby, so if you want to keep it, you need to rename it
     * You can see all reserved fields here:
     * @see https://www.gatsbyjs.com/docs/reference/graphql-data-layer/node-interface/
     */
    _id: input.data.id,
    parent: null,
    children: [],
    internal: {
      type: input.type,
      /**
       * The content digest is a hash of the entire node.
       * Gatsby uses this internally to determine if the node needs to be updated.
       */
      contentDigest: gatsbyApi.createContentDigest(input.data),
    },
  } satisfies NodeInput

  /**
   * Add the node to Gatsby's data layer. This is the most important piece of a Gatsby source plugin.
   * @see https://www.gatsbyjs.com/docs/reference/config-files/actions/#createNode
   */
  gatsbyApi.actions.createNode(node)
}

// export function createAssetNode(gatsbyApi: SourceNodesArgs, data: IPostImageInput) {
//   const id = gatsbyApi.createNodeId(`${NODE_TYPES.Asset}-${data.url}`)

//   /**
//    * For Image CDN and the "RemoteFile" interface, these fields are required:
//    * - url
//    * - filename
//    * - mimeType
//    * For images, these fields are also required:
//    * - width
//    * - height
//    */
//   const assetNode = {
//     id,
//     url: data.url,
//     /**
//      * Don't hardcode the "mimeType" field, it has to match the input image. If you don't have that information, use:
//      * @see https://github.com/nodeca/probe-image-size
//      * For the sake of this demo, it can be hardcoded since all images are JPGs
//      */
//     mimeType: `image/jpg`,
//     filename: data.url,
//     /**
//      * If you don't know the width and height of the image, use: https://github.com/nodeca/probe-image-size
//      */
//     width: data.width,
//     height: data.height,
//     placeholderUrl: `${data.url}&w=%width%&h=%height%`,
//     alt: data.alt,
//     parent: null,
//     children: [],
//     internal: {
//       type: NODE_TYPES.Asset,
//       contentDigest: gatsbyApi.createContentDigest(data),
//     },
//   } satisfies IRemoteImageNodeInput

//   gatsbyApi.actions.createNode(assetNode)

//   /**
//    * Return the id so it can be used for the foreign key relationship on the Post node.
//    */
//   return id
// }
