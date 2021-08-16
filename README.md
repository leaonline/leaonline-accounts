# lea.online Accounts

[![Test suite](https://github.com/leaonline/leaonline-accounts/actions/workflows/test_suite.yml/badge.svg)](https://github.com/leaonline/leaonline-accounts/actions/workflows/test_suite.yml)
![Lint suite](https://github.com/leaonline/leaonline-accounts/workflows/Lint%20suite/badge.svg)
[![CodeQL](https://github.com/leaonline/leaonline-accounts/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/leaonline/leaonline-accounts/actions/workflows/codeql-analysis.yml)
[![built with Meteor](https://img.shields.io/badge/Meteor-2.1.1-green?logo=meteor&logoColor=white)](https://meteor.com)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
![GitHub](https://img.shields.io/github/license/leaonline/leaonline-accounts)

## About

Provides an accounts service, based on Meteor using `leaonline:oauth2-server`.
Allows users to authenticate across multiple (registered) Meteor apps.

## Install and run

First, make sure [Meteor](https://meteor.com) is installed.
Then clone this repo and install the dependencies.
Finally run the `run.sh` script.

```bash
git clone git@github.com:leaonline/leaonline-accounts.git
cd leaonline-accounts && meteor npm install
./run.sh
```

### Initial accounts in development
<a name="initial-accounts"></a>

In development this project creates initial accounts without a password.
If you want to use them you need to check the console after the first startup
and click the link to set a new password. 

## Run tests

We have compiled a script for testing for you.
To run tests in watch mode simply run `./test.sh`.
If you want to run testsb once, including coverage analysis run `./test.sh -c`

## Contribute

Feel free to contribute via issues, PRs, feature requests etc.

## License

AGPL v3, see [LICENSE file](./LICENSE)
