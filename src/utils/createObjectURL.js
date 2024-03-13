export default function createObjectURL(files) {
  let result = []
  let imageNameList = []

  for (let i = 0; i < files.length; i++) {
    const url = URL.createObjectURL(files[i])

    result.push(url)
    imageNameList.push(files[i].name)
  }

  return [result, imageNameList]
}
