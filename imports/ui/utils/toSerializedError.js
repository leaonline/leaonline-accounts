export const toSerializedError = error => {
  const obj = Object.create(null)
  obj.message = error.message
  obj.name = error.name
  obj.stack = error.stack
  obj.type = error.type

  if (error.errorType) {
    obj.errorType = error.errorType
    obj.reason = error.reason
    obj.details = error.details
    obj.error = error.error
  }

  return obj
}
