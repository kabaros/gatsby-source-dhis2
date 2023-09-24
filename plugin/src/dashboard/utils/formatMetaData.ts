const formatMetaData = (metaData: Record<string, Record<string, { name: string }>>) => {
  const mappedMetaData = Object.entries(metaData).reduce((prev, currentEntry) => {
    const [key, value] = currentEntry

    return {
      ...prev,
      [key]: Object.entries(value).map(([metaDataId, metaDataName]) => ({
        id: metaDataId,
        name: metaDataName.name,
      })),
    }

    // return {
    //   [key]: Object.entries(value).map(([metaDataId, metaDataName]) => ({
    //     id: metaDataId,
    //     name: metaDataName,
    //   })),
    // }
  }, {})

  return mappedMetaData
}
export default formatMetaData
