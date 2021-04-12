/* eslint-env mocha */
import { canUserAccessClient } from './canUserAccessClient'

describe(canUserAccessClient.name, function () {
  it('returns false if the user is not defined')
  it('returns false if the client is not defined')
  it('returns false if the user has not the clientKey as role')
  it('returns true if the user has the clientKey as role')
})