# project can not work after update react-scripts form 2.0.0-next.a671462c to  2.0.0

<!--
  PLEASE READ THE FIRST SECTION :-)
-->

### Is this a bug report?
yes

<!--
  If you answered "Yes":

    Please note that your issue will be fixed much faster if you spend about
    half an hour preparing it, including the exact reproduction steps and a demo.

    If you're in a hurry or don't feel confident, it's fine to report bugs with
    less details, but this makes it less likely they'll get fixed soon.

    In either case, please fill as many fields below as you can.

  If you answered "No":

    If this is a question or a discussion, you may delete this template and write in a free form.
    Note that we don't provide help for webpack questions after ejecting.
    You can find webpack docs at https://webpack.js.org/.
-->

### Did you try recovering your dependencies?

<!--
  Your module tree might be corrupted, and that might be causing the issues.
  Let's try to recover it. First, delete these files and folders in your project:

    * node_modules
    * package-lock.json
    * yarn.lock

  Then you need to decide which package manager you prefer to use.
  We support both npm (https://npmjs.com) and yarn (http://yarnpkg.com/).
  However, **they can't be used together in one project** so you need to pick one.

  If you decided to use npm, run this in your project directory:

    npm install -g npm@latest
    npm install

  This should fix your project.

  If you decided to use yarn, update it first (https://yarnpkg.com/en/docs/install).
  Then run in your project directory:

    yarn

  This should fix your project.

  Importantly, **if you decided to use yarn, you should never run `npm install` in the project**.
  For example, yarn users should run `yarn add <library>` instead of `npm install <library>`.
  Otherwise your project will break again.

  Have you done all these steps and still see the issue?
  Please paste the output of `npm --version` and/or `yarn --version` to confirm.
-->

yes

### Which terms did you search for in User Guide?

<!--
  There are a few common documented problems, such as watcher not detecting changes, or build failing.
  They are described in the Troubleshooting section of the User Guide:

  https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#troubleshooting

  Please scan these few sections for common problems.
  Additionally, you can search the User Guide itself for something you're having issues with:

  https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md

  If you didn't find the solution, please share which words you searched for.
  This helps us improve documentation for future readers who might encounter the same problem.
-->

"Updating to New Releases", "Migrating from 2.0.0-next.xyz"


### Environment

<!--
  To help identify if a problem is specific to a platform, browser, or module version, information about your environment is required.
  This enables the maintainers quickly reproduce the issue and give feedback.

  Run the following command in your React app's folder in terminal.
  Note: The result is copied to your clipboard directly.

  `npx create-react-app --info`

  Paste the output of the command in the section below.
-->

(paste the output of the command here)

### Steps to Reproduce

<!--
  How would you describe your issue to someone who doesn’t know you or your project?
  Try to write a sequence of steps that anybody can repeat to see the issue.
-->

(Write your steps here:)

1. init project with react-scripts@2.0.0-next.a671462c
```sh
$ create-react-app app --scripts-version 2.0.0-next.a671462c
```
2. add dva and modify `src/index.js`
```sh
$ cd app
$ yarn add dva
```
```js
// src/index.js
import React from 'react';
import dva from 'dva';
import createHistory from 'history/createHashHistory';

// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
// app.use({});

// 3. Register global model
// app.model(require('../models/index').default);

// 4. Router
app.router(() => <div>Test</div>);

// 5. Start
app.start('#root');
```
3. The project can be successfully started
```sh
$ yarn start
yarn run v1.5.1
$ react-scripts start
Starting the development server...
Compiled successfully!

You can now view app in the browser.

  Local:            http://localhost:3000/
  On Your Network:  http://192.168.30.22:3000/

Note that the development build is not optimized.
To create a production build, use yarn build.
```
4. update react-scripts to 2.0.0, project can not work any more.
```sh
$ yarn add --exact react-scripts@2.0.0
$ yarn start
yarn run v1.5.1
$ react-scripts start
Starting the development server...
Failed to compile.

./node_modules/dva-core/lib/index.js
Module not found: Can't resolve '@babel/runtime/core-js/get-iterator' in 'D:\git
hub\app\node_modules\dva-core\lib'
Compiling...
Failed to compile.

./node_modules/dva-core/lib/index.js
Module not found: Can't resolve '@babel/runtime/core-js/get-iterator' in 'D:\git
hub\app\node_modules\dva-core\lib'

```


### Expected Behavior

<!--
  How did you expect the tool to behave?
  It’s fine if you’re not sure your understanding is correct.
  Just write down what you thought would happen.
-->

(Write what you thought would happen.)
![image](https://user-images.githubusercontent.com/2703455/46127444-42056200-c263-11e8-8150-0da168d420c6.png)


### Actual Behavior

<!--
  Did something go wrong?
  Is something broken, or not behaving as you expected?
  Please attach screenshots if possible! They are extremely helpful for diagnosing issues.
-->

(Write what happened. Please add screenshots!)
![image](https://user-images.githubusercontent.com/2703455/46127475-5ea19a00-c263-11e8-9edd-11ffbf95d31c.png)


### Reproducible Demo

<!--
  If you can, please share a project that reproduces the issue.
  This is the single most effective way to get an issue fixed soon.

  There are two ways to do it:

    * Create a new app and try to reproduce the issue in it.
      This is useful if you roughly know where the problem is, or can’t share the real code.

    * Or, copy your app and remove things until you’re left with the minimal reproducible demo.
      This is useful for finding the root cause. You may then optionally create a new project.

  This is a good guide to creating bug demos: https://stackoverflow.com/help/mcve
  Once you’re done, push the project to GitHub and paste the link to it below:
-->

(Paste the link to an example project and exact instructions to reproduce the issue.)

<!--
  What happens if you skip this step?

  We will try to help you, but in many cases it is impossible because crucial
  information is missing. In that case we'll tag an issue as having a low priority,
  and eventually close it if there is no clear direction.

  We still appreciate the report though, as eventually somebody else might
  create a reproducible example for it.

  Thanks for helping us help you!
-->
