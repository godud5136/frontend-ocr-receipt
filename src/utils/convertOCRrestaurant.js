export default function convertOCRrestaurant(ocr) {
  const restaurantPattern = /가맹점명\s*(.+?)\n/
  // 결과 출력
  const convertOCRMatch = ocr.match(restaurantPattern)
  const merchantName = convertOCRMatch
    ? convertOCRMatch[1].trim()
    : '가맹점명을 찾을 수 없습니다.'

  return merchantName.replaceAll(' ', '')
}
