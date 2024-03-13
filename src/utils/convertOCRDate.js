export default function convertOCRDate(ocr) {
  const datePattern = /(\d{4}.\d{2}.\d{2})/

  // 날짜 추출
  const dateMatch = ocr.match(datePattern)
  const paymentDate = dateMatch ? dateMatch[1] : '날짜를 찾을 수 없음'
  // 날짜를 형식에 맞게 변환
  const formattedDate = paymentDate.replace(/\./g, '').substring(2)

  return formattedDate
}
