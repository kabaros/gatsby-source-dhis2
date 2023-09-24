# DHIS2 Gatsby Plugin

This is a Gatsby plugin that sources data from a DHIS2 instance and makes it available for consumption in Gatsby to produce a public website.

> 🔴 This is still a proof of concept. Not ready for production.

Check an example demo site on: https://gleaming-elf.netlify.app/ (not all visualizations types are supported but it should give an idea of what's possible)

## Background

Gatsby is one of the most popular Static Site Generators ([What is a static site generator](https://www.gatsbyjs.com/docs/glossary/static-site-generator/)). It integrates with a variety of data sources through plugins that _source_ data and make it available for Gatsby at **build** time to generate static HTML pages.

[DHIS2](https://dhis2.org/) is the largest open-source Health Information Management System in the world used by 70+ countries as their national HIMS system. It's commonly used by governments, health ministries and NGOs to collect and analyse health data at the national level, but sometimes there is a need to expose _some_ of this data through portals available for the public. This is a use case that became very popular during the Covid pandemic.

This plugin sources data through DHIS2 API and makes it available at build time so that developers can build static sites without exposing the system behind it to the public.

## Why is this a good solution for public portals?

1. Security: With this approach, a public portal is served as a static website without exposing the DHIS2 system behind it. Access to DHIS2 is only needed at build time, not at runtime. The DHIS2 data can be sourced at build time privately, and only the resulting static website is made public.

1. Simplicity: The alternative for building a public portal the right way is relatively complicated. The "right way" - among other concerns - is a way that is secure and doesn't expose the DHIS2 system to the public as it is a cirtical system and likely holds sensitive information. Alternatives such as using a reverse proxy to DHIS2, or server-side generation, are more complicated to setup and still not as secure as they leave space for misconfiguration.

1. Scalability: The generated website is just HTML, CSS and some JS. It doesn't need to talk to an API or even know about the API. It can be hosted on any static hosting, or public cloud storage with a CDN in front of it, and it's ready to scale cheaply to millions.

1. Developer experience: The data sourced from DHIS2 is made avialable through a GraphQL API at build time. It is strongly typed (types are inferred from the data) and Gatsby itself is a React (meta)framework making it very accessible to all the developers who know React.

   https://github.com/kabaros/gatsby-source-dhis2/assets/1014725/a4e5d6bb-7202-42e4-8d93-28b8dfc5f6dc

1. Gatsby's community: In a public portal, you might want to integrate with sources other than DHIS2 to build the final public website. This could be a traditional CMS such as WordPress or Drupal, a headless CMS or any other API or data source. Gatsby is open-source, has 50k+ stars on GitHub, and was recently bought by Netlify securing it as a product for the long-term. It has (3000+ plugins)[https://www.gatsbyjs.com/plugins] that cover every integration imaginable. It also takes care of many other considerations of building a public website such as SEO optimisation, OpenGraph for sharing on social media, optimsing images, integrating with third-party analytics etc...

### The tradeoff

The tradeoff is that, on a public portal built this way, the data is **not live**. You are free to re-build the website as frequently as you'd like to keep the content fresh, through a cron job for example, but the fact remains that the data is still _technically_ not live.

### Vs NextJS

[NextJS](https://nextjs.org/docs#what-is-nextjs) is the obvious alternative to Gatsby in the conversation around Static Site Generation (SSG) and Server-Side Rendering (SSR). It's more popular than Gatsby and provides SSG as well as SSR. So why Gatsby not NextJS? A year or so ago, the differences between the two were more pronounced, NextJS was an SSR framework, while Gatsby did SSG. Now, Gatsby added SSR capababilities, and NextJS supports (and recommends) SSG.

The main reason though for choosing Gatsby here is the DHIS2 context. A rendered page in DHIS2 will likely include orchestration of several APIs in order to get all the information needed. With Gatsby, these complicated details can be abstracted away with plugins and consumed cleanly with GraphQL. NextJS doesn't have an equivalent concept, and it's not easy to build a nice reusable abstraction to hide the DHIS2 details especially if you want to build an equivalent of GraphQL schemas and relationships which provide a lot of flexibility to decide what parts of the data graph you want to build. With NextJS, it's likely going to be an all-or-nothing approach to data fetching. But all in all, there is nothing here that Gatsby does that can't be done in NextJS, so do your research and decide.

# Current state

The plugin sources DHIS2 `dashboards` right now. It gets all dashboards, and makes calls to `analytics` and `visualization` endpoints in DHIS2 to prepare everything needed to render a dashboard and its components.

There is a sample website consuming the data and showing it, but it doesn't handle all visualization types, as this is not the main scope for this project. The scope is to make the DHIS2 data available through Gatsby interface, then developers can make use of it in any manner they see fit.

## ToDo

- [ ] Call `maps` and other visulizations to make their data available at build time
- [ ] Use GraphQL to build relationships between entities (Dashboard->DashboardItem->Visulization,Analytics) instead of building a big object
- [ ] Check if there is are better ways to source all of this data
- [ ] Source data from endpoints other than /dashboards (make user specify in config)
- [ ] Ensure it sources data correctly with DHIS2 older versions
- [ ] Improve typings in the plugin side
- [ ] ¿Improve the sample site, maybe render more visualization types?

# To develop

Clone this repo, then run `yarn install`.

- copy `.env.example` to `.env.development` and update values for DHIS2 URL, username and password to the system you want to target.

Then open two terminals:

- `yarn develop:plugin` which will run the plugin in develop mode
- `yarn develop:site` to run the sample site consuming the plugin

# To use (not ready)

You can go through [Gatsby Get Started](https://www.gatsbyjs.com/docs/tutorial/getting-started/) tutorial to get an idea about how Gatsby and plugins work in general.

To use this plugin in an existing Gatsby project, you can [add it as a plugin](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/using-a-plugin-in-your-site/) to your project.

In the root of your project:

```bash
yarn add gatsby-source-dhis2 # not published yet
```

This install the plugin and adds to the project's package.json.

Then you can edit `gatsby-config.ts`, make sure you're using `dotenv` or similar. Chekc the guide [here](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/).

To use `dotenv`, add this line to the top of the file

```ts
require(`dotenv`).config({
  path: `.env.${process.env.NODE_ENV}`,
});
```

Then in the list of plugins, add

```ts
{
      resolve: `gatsby-source-dhis2`,
      options: {
        dhis2Url: process.env.DHIS2_URL,
        dhis2Username: process.env.DHIS2_USERNAME,
        dhis2Password: process.DHIS2_PASSWORD,
        // .. other options coming soon
      } satisfies IPluginOptions,
},
```

You can check the sample website in this repo (/site) for a reference implementation.

When you run the project, then the plugin will source DHIS2 data and make it available for the frontend. You can run the site with `yarn develop --verbose` to get more details into what data is being sourced from DHIS2.
