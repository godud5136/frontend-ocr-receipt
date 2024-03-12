import { useState } from 'react'
import Tesseract from 'tesseract.js'

import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState([])
  const [name, setName] = useState('')

  const createObjectURL = (files) => {
    let result = []
    let imageNameList = []

    for (let i = 0; i < files.length; i++) {
      const url = URL.createObjectURL(files[i])

      result.push(url)
      imageNameList.push(files[i].name)
    }

    return [result, imageNameList]
  }

  const getOCR = async (imagePath, imageNameList) => {
    let promises = []

    setIsLoading(true)

    for (let i = 0; i < imagePath.length; i++) {
      const promise = Tesseract.recognize(imagePath[i], 'eng+kor', {
        logger: (m) => {},
      })
        .catch((err) => {
          console.error(err)
        })
        .then(({ data: { text } }) => {
          const money = convertOCRmoney(text)
          const temp = convertOCR(text, money)
          const temp2 = convertOCRrestaurant(text)

          return {
            imagePath: imagePath[i],
            temp,
            restaurant: temp2,
            money,
            imageName: imageNameList[i],
          }
        })

      promises.push(promise)
    }

    const results = await Promise.all(promises)

    setIsLoading(false)

    return results
  }

  const convertOCRmoney = (ocr) => {
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

  const convertOCR = (ocr, money) => {
    // 정규 표현식을 사용하여 날짜와 결제 금액 추출
    const datePattern = /(\d{4}.\d{2}.\d{2})/

    // 날짜 추출
    const dateMatch = ocr.match(datePattern)
    const paymentDate = dateMatch ? dateMatch[1] : '날짜를 찾을 수 없음'
    // 날짜를 형식에 맞게 변환
    const formattedDate = paymentDate.replace(/\./g, '').substring(2)

    return `식비_점심_${money}원_${formattedDate}_${name}`
  }

  const convertOCRrestaurant = (ocr) => {
    // 정규표현식 패턴
    const restaurantPattern = /가 맹 점 명\s*(.+?)\n/
    // 결과 출력
    const convertOCRMatch = ocr.match(restaurantPattern)
    const merchantName = convertOCRMatch
      ? convertOCRMatch[1].trim()
      : '가맹점명을 찾을 수 없습니다.'

    return merchantName.replaceAll(' ', '')
  }

  const convertForSameDate = (inputArray) => {
    const result = inputArray.reduce((acc, currentObj) => {
      const existingObj = acc.find((obj) =>
        obj.temp.includes(currentObj.temp.split('_')[3]),
      )

      if (existingObj) {
        existingObj.temp = existingObj.temp.replace(/_(\d+)원/, (match, p1) => {
          const newPrice =
            parseInt(p1, 10) +
            parseInt(currentObj.temp.match(/_(\d+)원/)[1], 10)
          return `_${newPrice}원`
        })

        existingObj.imagePathList.push(currentObj.imagePath)
      } else {
        const newObj = { ...currentObj, imagePathList: [currentObj.imagePath] }
        acc.push(newObj)
      }

      return acc
    }, [])

    return result
  }

  const handleChange = async (event) => {
    const [tempImagePathList, imageNameList] = createObjectURL(
      event.target.files,
    )

    const ocr = await getOCR(tempImagePathList, imageNameList)

    const result = convertForSameDate(ocr)

    setResult(result)
    event.target.value = null
  }

  const handleChangeName = (event) => {
    setName(event.target.value)
  }

  return (
    <div className="App">
      <main className="App-main">
        <a href="https://me.mediflow.kr/" target="_blank">
          메디플로우
        </a>
        <p>이름을 적은 후, 파일 선택을 눌러주세요</p>
        <input value={name} onChange={handleChangeName} />
        <h3>이미지 업로드</h3>
        <input type="file" multiple onChange={handleChange} disabled={!name} />
        {/* {imagePath && (imagePath.map((path) => { return (
            <div className='image-path'>
              <img src={path} className="upload_img" alt='upload_img'/>
            </div>
          )}
        ))} */}

        <h3>인식 결과</h3>

        {isLoading ? (
          <span>생성 중입니다. 조금만 기다려주세요 :)</span>
        ) : (
          <>
            {result?.map((item, index) => {
              return (
                <div
                  key={index}
                  style={{ display: 'flex', marginBottom: '40px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: '20px',
                    }}
                  >
                    <p style={{ marginRight: '10px' }}>{item.temp}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(item.temp)}
                    >
                      복사
                    </button>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: '20px',
                    }}
                  >
                    <p style={{ marginRight: '10px' }}>{item.money}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(item.money)}
                    >
                      복사
                    </button>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: '20px',
                    }}
                  >
                    <p style={{ marginRight: '10px' }}>{item.restaurant}</p>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(item.restaurant)
                      }
                    >
                      복사
                    </button>
                  </div>
                  <div>
                    <p style={{ marginRight: '10px' }}>{item.imageName}</p>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </main>
    </div>
  )
}

export default App
