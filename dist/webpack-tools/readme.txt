Bundling JET code with Webpack
==============================

This plugin should be used when using Webpack to bundle JET modules. It should be used if you are trying to generate Web-pack-specific bundles and not if you are planning to generate AMD modules and use Require.js at runtime. These tools require JET 6.0 or newer.

Refer to the enclosed webpack.config.js for typical configuration.

There are two main pieces involved in getting JET to 'play nicely' with Webpack:

1. ojL10n-loader - this is a build-time replacement for JET's ojL10n Require.js plugin. It assumes that the Webpack bundle is being generated for a particular locale (en-CA, fr-CA, fr-FR, etc.). The locale has to be provided as loader 'locale' option in webpack.config.js. If none is provided, the loader will generate a bundle for en-US.

2. WebpackRequireFixupPlugin - a plugin that resolves issues with JET features that are problematic for Webpack. It performs build-time code modifications to eliminate the need to use Require.js at runtime while preserving all JET functionality including the lazily loaded module (ojModule and <oj-module>).

ojModules and <oj-module> elements with global vs. relative paths
=================================================================
The instructions below provide different recommendations for ojModules and <oj-module> elements with global vs relative paths. If you are unsure what type of module you are using, just check whether you are specifying the require instance in ojModule config or in the ModuleElementUtils.createView/createViewModel. Without the require instance, views and viewModels will be loaded relative to what Require.js sees as application's baseUrl. i.e. globally to the entire application. With the require instance, views and viewModels will be loaded relative to the module that provided that require instance. Loading with a relative path is normally used when ojModule is used in a composite component (see the Cookbook sample 'ojModule->Embedding in a Composite'). 

Instructions:
==============
By default, the webpack.config.js is configured to run, as is, when unzipped into the root of an application generated using the ojet-cli tooling. To run Webpack against a JET Starter Template, follow these steps.

1) Create new JET app with:

	ojet create myWebPackTest --template=navdrawer

2) Build the JET app with "ojet build"

3) Unzip the jet-webpack.zip file into the root of the new application
4) From the root of your application, install three libraries
	
	npm i webpack webpack-cli text-loader --save-dev
	
5) Run "npx webpack" from the root of the project

These five steps will allow you to package the starter template application using Webpack.  The default will produce a "bundle.js" file in the /web directory.  To use this as the basis of your application, change the <script> references at the bottom of the index.html file to point to only "bundle.js".  Comment out the existing references to RequireJS and main.js

NOTE: The Resolve Alias section includes JET default libraries.  If your application includes additional libraries, you will need to add them to this section. 

*** Advanced ***
If you want to enable Webpack with an existing application, you will need to make modifications to the webpack.config.js file to match your needs. Some things to look for during that modification are:

1) Adjust resolve aliases for JET and 3rd party modules in webpack.config.js (Webpack will not pick up Require.js path_mappings.js)

2) Provide configuration for the ojL10n-loader in webpack.config.js (see the 'reaolveLoader' section and the  webpack.LoaderOptionsPlugin configuration in the example webpack.config.js)

3) Add WebpackRequireFixupPlugin in the 'plugins' section of webpack.config.js and set baseResourceUrl to the root of your JET distribution.

4) If your application is using ojModule or <oj-module>, provide the ojModuleResources configuration in WebpackRequireFixupPlugin configuration. Note that the 'root' setting is only used for modules that are defined with global (as opposed to relative) paths.

If your application is using ojModule with relative view/viewModel paths or <oj-module> with ModuleElementUtils and relative paths, make sure to annotate the require instance with information needed to locate the views and viewModels at build time. Note that annotation is placed in a comment that must immediately precede the variable containing the require instance.
ojModule example with 'req' variable pointing to the local require instance:
this.moduleConfig = {name: 'one', 
                     require: {instance: /*ojModuleResources: {root: './', view:{match: '^\\./views2/.+\\.html$'}, viewModel:{match: '^\\./viewModels2/.+\\.js$'}}*/req, 
                     viewPath:"text!./views2/", modelPath: "./viewModels2/"}};

ModuleElementUtils (<oj-module>) example:
    var masterPromise = Promise.all([
      moduleUtils.createView({'viewPath':"views/one.html", 'require': /*ojModuleElementView: {root: './', match: '^\\./views/.+\\.html$'}*/req}),
      moduleUtils.createViewModel({'viewModelPath':"viewModels/one", 
                                       'require': /*ojModuleElementViewModel: {root: './', match: '^\\./viewModels/.+\\.js$'}*/req})
    ]);
Note that the 'match', 'addExtension' and 'prefix' settings for views and viewModels can be sparse. i.e. you only need to specify settings that are different from the View and ViewModel settings in ojModuleResources configuration of WebpackRequireFixupPlugin (see step 4)

5) Run webpack as you would do for any other project (normally 'npx webpack').
