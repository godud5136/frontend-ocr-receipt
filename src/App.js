import { useEffect, useState } from 'react'
import _ from 'lodash'

import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Alert, Snackbar, Button } from '@mui/material'

import UploadFile from './components/UploadFile'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Container } from './styled'

function App() {
  const [isChecked, setIsChecked] = useState(
    Boolean(localStorage.getItem('name')),
  )
  const [name, setName] = useState('')
  const [alert, setAlert] = useState({
    type: null,
    message: '',
    open: false,
  })

  const handleChangeName = (event) => {
    setName(event.target.value)
  }

  const errorValidation = async () => {
    let temp = false

    if (!name) {
      setAlert({
        type: 'error',
        message: '결재자를 작성해주세요 !',
        open: true,
      })

      setTimeout(() => {
        setAlert({
          type: null,
          message: '',
          open: false,
        })
      }, 1000)

      temp = true
    }

    return temp
  }

  const handleEnterKeyPress = _.debounce(async (event) => {
    if (event.key === 'Enter') {
      console.log('1')
      const error = await errorValidation()
      if (error) return

      // Enter 키 눌렸을 때 파일 선택 클릭
      document.getElementById('formId').click()
    }
  }, 400)

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked

    // 체크박스를 클릭했을 때 localStorage에 'name' 키로 데이터 저장
    if (checked) {
      localStorage.setItem('name', name)
    } else {
      // 체크박스를 false로 변경할 때 localStorage에서 'name' 키 삭제
      localStorage.removeItem('name')
    }

    setIsChecked(checked)
  }

  useEffect(() => {
    // 페이지가 마운트될 때 localStorage에서 'name' 키의 데이터 가져오기
    const storedValue = localStorage.getItem('name')
    setIsChecked(Boolean(storedValue))
    setName(storedValue)
  }, [])

  return (
    <Container>
      <TextField
        value={name || ''}
        required
        id="outlined-required"
        label="결재자"
        fullWidth
        onChange={handleChangeName}
        onKeyDown={handleEnterKeyPress}
      />
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            onChange={handleCheckboxChange}
            checked={isChecked}
          />
        }
        label="저장하기"
        sx={{
          '& .MuiTypography-root': {
            fontSize: 14,
            color: 'rgba(0, 0, 0, 0.6)',
            transform: 'translateY(1px)',
          },
        }}
      />

      <UploadFile
        name={name}
        setAlert={setAlert}
        errorValidation={errorValidation}
      />

      <div className="mediflow-btn">
        <Button
          variant="contained"
          href="https://me.mediflow.kr/"
          target="_blank"
        >
          메디플로우
        </Button>
      </div>

      {alert.type === 'success' && (
        <>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={alert.open}
            autoHideDuration={2000}
          >
            <Alert severity="success">{alert.message}</Alert>
          </Snackbar>
        </>
      )}

      {alert.type === 'error' && (
        <>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={alert.open}
            autoHideDuration={2000}
          >
            <Alert severity="error">{alert.message}</Alert>
          </Snackbar>
        </>
      )}
    </Container>
  )
}

export default App
