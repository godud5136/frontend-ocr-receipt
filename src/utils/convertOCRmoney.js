export default function convertOCRmoney(ocr) {
  const amountPattern = /결제 금액 (\d{1,3}.\d{3})/

  // 결제 금액 추출
  const amountMatch = ocr.match(amountPattern)

  const paymentAmount = amountMatch
    ? amountMatch[1]
    : '결제 금액을 찾을 수 없음'

  // 쉼표(,)를 제거하고 숫자로 형변환
  const formattedNumber = paymentAmount.includes(',')
    ? paymentAmount.replace(/,/g, '')
    : paymentAmount.replace('.', '')

  return formattedNumber
}
