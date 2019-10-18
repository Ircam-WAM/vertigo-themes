# vertigo_components

This projects aims to generate bundled js file in order to be used as components.
The components can be integrated in inside a Django frontend.

For example
```
{% block main %}
<!-- Include csrf token if you need to submit forms -->
{% csrf_token %}
<div class="container">
  <!-- The id is the one inside src/apps/my-component.js file -->
	<div id="residency-blog-form"></div>
	<div id="residency-blog-list"></div>
</div>
{% endblock %}

{% block extra_js %}
<!-- Dependencies -->
<script type="text/javascript" src="{% static "components/vendors.js" %}"></script>
<!-- Components -->
<script type="text/javascript" src="{% static "components/residency-blog-form.js" %}"></script>
<script type="text/javascript" src="{% static "components/residency-blog-list.js" %}"></script>
```

## Architecture

```
src
├── apps
│   ├── residency-blog-form.js
│   └── residency-blog-list.js
├── components
│   ├── ResidencyBlogForm.vue
│   └── ResidencyBlogList.vue
└── utils
    └── getCsrfToken.js
```

`apps`: contains as many javascript files as components that you want to integrate inside your Django app.
`components`: contains components / sub-components for apps.
`utils`: contains js utils functions

## Important notice if you are using it in a docker environment


If you use docker to run your app, you may get permission issues on the `node_modules` directory in your local environment.
To avoid any issue, run every npm / yarn commands inside the container.

For example

```
docker-compose exec app sh -c 'cd /srv/lib/vertigo-themes/vertigo_components && npm install'
```

## Build

Generates the bundled files in the `static` directory.

```
npm run build
```

## Watch

Watch for file changes and re-build when a source file has been edited.

```
npm run watch
```

## Dev tools

This project uses the following developer tools. Make sure that your code editor is configured to use them.

- Editorconfig
- Eslint

## Compatibility

This project uses postcss and babel to transpile the project. So, IE11 and recent browsers are supported.
For more information, please see the `browserlist` key of package.json

# Authors

- Copyright 2019 (c) Martin Desrumaux <martin.desrumaux@ircam.fr>
