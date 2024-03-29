import React, { Fragment, useEffect, useState } from 'react'
import Tesseract from 'tesseract.js'
import Lottie from 'react-lottie'

import {
  convertOCRmoney,
  convertOCRDate,
  convertOCR,
  convertOCRrestaurant,
  convertForSameDate,
  createObjectURL,
} from '../../utils'

import { Container } from './styled.js'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import Loading from '../../assets/ai-loading.json'

export default function UploadFile({ name, setAlert, errorValidation }) {
  const [displayTextIndex, setDisplayTextIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState([])

  const getOCR = async (imagePath, imageNameList) => {
    let promises = []

    setIsLoading(true)

    for (let i = 0; i < imagePath.length; i++) {
      const promise = Tesseract.recognize(imagePath[i], 'kor', {
        logger: (m) => {},
      })
        .catch((err) => {
          console.error(err)
        })
        .then(({ data: { text } }) => {
          const money = convertOCRmoney(text)
          const date = convertOCRDate(text)
          const temp = convertOCR(money, date, name)
          const temp2 = convertOCRrestaurant(text)

          return {
            imagePath: imagePath[i],
            temp,
            restaurant: temp2,
            money,
            date,
            imageName: imageNameList[i],
          }
        })

      promises.push(promise)
    }

    const results = await Promise.all(promises)

    setIsLoading(false)

    return results
  }

  const handleChange = async (event) => {
    const [tempImagePathList, imageNameList] = createObjectURL(
      event.target.files,
    )

    const ocr = await getOCR(tempImagePathList, imageNameList)

    const result = convertForSameDate(ocr)
    const sort = result.sort((a, b) => a.date - b.date)

    setResult(sort)

    // 파일 초기화
    event.target.value = null
  }

  const handleDrop = async (event) => {
    event.preventDefault()

    const error = await errorValidation()

    if (error) return

    const files = event.dataTransfer.files
    const [tempImagePathList, imageNameList] = createObjectURL(files)

    const ocr = await getOCR(tempImagePathList, imageNameList)

    const convertedResult = convertForSameDate(ocr)
    const sortedResult = convertedResult.sort((a, b) => a.date - b.date)

    setResult(sortedResult)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleClickButton = (text) => {
    navigator.clipboard.writeText(text)

    setAlert({
      type: 'success',
      message: '복사되었습니다',
      open: true,
    })

    setTimeout(() => {
      setAlert({
        type: null,
        message: '',
        open: false,
      })
    }, 1000)
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Loading,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTextIndex((prevIndex) => (prevIndex === 0 ? 1 : 0))
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Container>
      <div
        className="file-drop"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="file-input">
          <span>이곳에 영수증 파일을 드롭해주세요.</span>

          <label onChange={handleChange} htmlFor="formId">
            <input
              accept=".png, .svg, .jpg, .jpeg"
              id="formId"
              type="file"
              multiple
              disabled={!name}
              style={{ display: 'none' }}
            />
            <span onClick={errorValidation} className="file-input-button">
              파일 선택
            </span>
          </label>
        </div>
      </div>

      {isLoading ? (
        <>
          <Lottie options={defaultOptions} height={150} width={150} />
          <ul className="lottie-txt-wrap">
            <li
              className="lottie-txt"
              style={{ display: displayTextIndex === 0 ? 'block' : 'none' }}
            >
              조금만 기다려주세요.
            </li>
            <li
              className="lottie-txt"
              style={{ display: displayTextIndex === 1 ? 'block' : 'none' }}
            >
              영수증 결과물을 생성 중이에요.
            </li>
          </ul>
        </>
      ) : (
        <>
          {result.length > 0 && (
            <div className="file-ocr-receipt-wrap">
              {result?.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <Typography variant="subtitle2" gutterBottom>
                      {item.imageName}
                    </Typography>
                    <div key={index} className="file-ocr-receipt">
                      <div className="ocr-btn-wrap">
                        <Button
                          className="ocr-btn"
                          variant="outlined"
                          onClick={() => handleClickButton(item.temp)}
                        >
                          {item.temp}
                        </Button>
                      </div>
                      <div className="ocr-btn-wrap">
                        <Button
                          className="ocr-btn"
                          variant="outlined"
                          onClick={() => handleClickButton(item.money)}
                        >
                          {item.money}
                        </Button>
                      </div>
                      <div className="ocr-btn-wrap">
                        <Button
                          className="ocr-btn"
                          variant="outlined"
                          onClick={() => handleClickButton(item.restaurant)}
                        >
                          {item.restaurant}
                        </Button>
                      </div>
                    </div>
                  </Fragment>
                )
              })}
            </div>
          )}
        </>
      )}
    </Container>
  )
}
