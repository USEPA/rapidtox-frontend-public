
# CCTE RapidTox Nuxt 3/4

  

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

  

Also check out [Vue 3 documentation](https://vuejs.org), Nuxt 3 is built on Vue 3.

  

## Included Features

  

* ESLint, lint-staged, Husky for enforcing linting all files on commit.

* @pinia/nuxt to allow use of [Pinia](https://pinia.vuejs.org) for state management/data stores.

* [@formkit/auto-animate](https://auto-animate.formkit.com/) for transitions.

* [@vueuse/nuxt](https://nuxt.com/modules/vueuse) module for [VueUse](https://vueuse.org/)

* [ag-grid-enterprise vue3](https://www.ag-grid.com/vue-data-grid/getting-started/)

* [Bootstrap 5.2.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/) configured as a Nuxt plugin and Bootstrap-icons .

* [primevue](https://primevue.org/) Vue3 component library with nuxt-primevue module integration.

* [Nuxt-security](https://nuxt.com/modules/security) OWASP based security module.

* [Vue 3](https://vuejs.org), Nuxt 3 is built on Vue 3.

* [Axe-vue](https://github.com/vue-a11y/vue-axe-next) for interactivly checking 508 compliance.

* [nuxt-devtools](https://devtools.nuxt.com/) in browser dev tools for nuxt.

  

## Possible Issues

  

* User has reported javascript heap out of memory.

  
  

## Setup

* To setup: create a directory in your dev environment called "RT" or a name of your choice.

* Clone https://github.com/USEPA/rapidtox-frontend.git into this directory

* cd into rapidtox-frontend.

* Create a new file named `.env`.

* Copy contents of `.env_template` to `.env`.

* If you are running this for cypress please change following environment variables 
	* `ENABLE_DEV_MODE = FALSE` to `ENABLE_DEV_MODE = TRUE` 
	* Modify `DEV_MODE_USERNAME` to the desired username for the session.

* Run yarn install.


Make sure to install the dependencies:

  

```bash

# yarn

yarn  install

  

# npm

npm  install

  

# pnpm

pnpm  install

  

# bun

bun  install

```

  

## Development Server

* cd into rapidtox-frontend

* port can be changed in local package.json or override in the yarn dev call using yarn dev --port <port  number>

Start the development server on `http://localhost:3000`:

  

```bash

# npm

npm  run  dev

  

# pnpm

pnpm  run  dev

  

# yarn

yarn  dev

  

# bun

bun  run  dev

```

  

## Production

  

Build the application for production:

  

```bash

# npm

npm  run  build

  

# pnpm

pnpm  run  build

  

# yarn

yarn  build

  

# bun

bun  run  build

```

  

Locally preview production build:

  

```bash

# npm

npm  run  preview

  

# pnpm

pnpm  run  preview

  

# yarn

yarn  preview

  

# bun

bun  run  preview

```

  

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Disclaimer:
The United States Environmental Protection Agency (EPA) GitHub project code is provided on an "as is" basis and the user assumes responsibility for its use.
EPA has relinquished control of the information and no longer has responsibility to protect the integrity, confidentiality, or availability of the information.
Any reference to specific commercial products, processes, or services by service mark, trademark, manufacturer, or otherwise, does not constitute or imply
their endorsement, recommendation or favoring by EPA. The EPA seal and logo shall not be used in any manner to imply endorsement of any commercial product or
activity by EPA or the United States Government. 
