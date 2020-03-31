# lea.online Accounts

![Lint suite](https://github.com/leaonline/leaonline-accounts/workflows/Lint%20suite/badge.svg)
[![built with Meteor](https://img.shields.io/badge/Meteor-1.10.1-green?logo=meteor&logoColor=white)](https://meteor.com)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
![GitHub](https://img.shields.io/github/license/leaonline/leaonline-accounts)

## Roles system

There are four main roles within the lea.system. The roles are placed within
a hierarchy of access, where the top-most role has the least restricted permissions:

1. Administrators (`admin`) - no restriction
2. Core team members (`team`) - can't manage roles and users but backend and classes
3. Course instructors (`teacher`) - can only manage classes
4. Particpants (`user`) - no special permissions

A future `test` role is to be added in order to separate "real" users from
test users. This role needs to include a special permission of deleting
all test data that is associated with the test user.

### Developers note

In the code the roles are named `Personas` in order to keep this
separated from the `Roles` API, that defined by the `alanning:roles` package.
