export function mapDoc(doc) {
  if (!doc) return null
  const obj = doc.toObject ? doc.toObject() : { ...doc }
  const { _id, __v, ...rest } = obj
  return {
    ...rest,
    id: _id?.toString() ?? obj.id,
  }
}

export function mapDocs(docs) {
  return docs.map((d) => mapDoc(d))
}
