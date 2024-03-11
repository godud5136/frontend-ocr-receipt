import Tesseract from 'tesseract.js';
import { useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState([]);

  const createObjectURL = (files) => {
    let result = [];

    for (let i = 0; i < files.length; i++) {
      const url = URL.createObjectURL(files[i])

      result.push(url)
    }

    return result;
  }

  const getOCR = async (imagePath) => {
    let promises = [];
    
    for (let i = 0; i < imagePath.length; i++) {

      const promise = Tesseract.recognize(
        imagePath[i], 
        'eng+kor', 
        {logger: m => {
          console.log('m')
        }}
      ).catch (err => {
        console.error(err);
      }).then(({ data: { text } }) => { 
        const temp = convertOCR(text)
        
        return { imagePath: imagePath[i], temp };
      });

      promises.push(promise);
    }
    
    const results = await Promise.all(promises);
    return results;
  }
  

  const convertOCR = (ocr) => {
    // 정규 표현식을 사용하여 날짜와 결제 금액 추출
    const datePattern = /(\d{4}.\d{2}.\d{2})/;
    const amountPattern = /결제 금액 (\d{1,3},\d{3}) 원/;
    // 날짜 추출
    const dateMatch = ocr.match(datePattern);
    const paymentDate = dateMatch ? dateMatch[1] : '날짜를 찾을 수 없음';
    // 날짜를 형식에 맞게 변환
    const formattedDate = paymentDate.replace(/\./g, '').substring(2);

    // 결제 금액 추출
    const amountMatch = ocr.match(amountPattern);
    const paymentAmount = amountMatch ? amountMatch[1] : '결제 금액을 찾을 수 없음';
    // 쉼표(,)를 제거하고 숫자로 형변환
    const formattedNumber = Number(paymentAmount.replace(/,/g, ''));

    return `식비_점심_${formattedNumber}_${formattedDate}_이해영`
  }

  const handleChange = async (event) => {
    const tempImagePathList = createObjectURL(event.target.files)

    const result = await getOCR(tempImagePathList)
    setResult(result)
  }

  return (
    <div className="App">
      <main className="App-main">
        <h3>이미지 업로드</h3>
        <input type="file" multiple onChange={handleChange}/>
        {/* {imagePath && (imagePath.map((path) => { return (
            <div className='image-path'>
              <img src={path} className="upload_img" alt='upload_img'/>
            </div>
          )}
        ))} */}

        <h3>인식 결과</h3>

        {result?.map((item) => {return (
          <div>
            <p>{item.temp}</p>
            <button onClick={() => navigator.clipboard.writeText(item.temp)}>복사</button>
          </div>
        )})}
      </main>
    </div>
  );
}

export default App;