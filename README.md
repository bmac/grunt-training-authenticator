# grunt-reporter

> The best Grunt plugin ever.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-reporter --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-reporter');
```

## The "reporter" task

### Overview
In your project's Gruntfile, add a section named `reporter` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  reporter: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.tokenFile
Type: `String`
Default value: `'.accessToken'`

The filename used to store the access token after a successful auth.

#### options.testOutputFile
Type: `String`
Default value: `'out.json'`

The name of the file containing the mocha test output.

#### options.tokenRequestUri
Type: `String`
Default value: `'http://localhost:1337/oauth/token'`

The URI used to request an OAuth2 access token.

#### options.testReportUri
Type: `String`
Default value: `'http://localhost:1337/testResult'`

The URI used to post test results.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
