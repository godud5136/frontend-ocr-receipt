export default function convertForSameDate(inputArray) {
  const result = inputArray.reduce((acc, currentObj) => {
    const existingObj = acc.find((obj) =>
      obj.temp.includes(currentObj.temp.split('_')[3]),
    )

    if (existingObj) {
      existingObj.temp = existingObj.temp.replace(/_(\d+)원/, (match, p1) => {
        const newPrice =
          parseInt(p1, 10) + parseInt(currentObj.temp.match(/_(\d+)원/)[1], 10)
        return `_${newPrice}원`
      })

      existingObj.imagePathList.push(currentObj.imagePath)
      existingObj.money = (
        parseInt(existingObj.money) + parseInt(currentObj.money)
      ).toString()
      existingObj.restaurant += `,${currentObj.restaurant}`
      existingObj.imageName += ` / ${currentObj.imageName}`
    } else {
      const newObj = { ...currentObj, imagePathList: [currentObj.imagePath] }
      acc.push(newObj)
    }

    return acc
  }, [])

  return result
}
