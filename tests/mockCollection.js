import { Mongo } from 'meteor/mongo'
import { Schema } from '../imports/api/schema/Schema'

const originals = new Map()

export const mockCollection = (context, { collectionFn, attachSchema = true } = {}) => {
  originals.set(context.name, context.collection)
  const collection = new Mongo.Collection(null)

  if (context.schema && attachSchema === true) {
    const schema = Schema.create(context.schema)
    collection.attachSchema(schema)
  }

  context.collection = collectionFn || (() => collection)
  return collection
}

export const restoreCollection = context => {
  const originalCollection = originals.get(context.name)
  context.collection = originalCollection
  originals.delete(context.name)
  return originalCollection
}

export const clearCollection = async context => {
  let collection
  if (context.collection instanceof Mongo.Collection) {
    collection = context.collection
  }
  if (!collection) {
    collection = typeof context.collection === 'function'
      ? context.collection()
      : context.collection
  }
  return collection.removeAsync({})
}
