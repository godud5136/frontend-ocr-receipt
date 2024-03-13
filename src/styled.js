import styled from 'styled-components'

export const Container = styled.div`
  max-width: 500px;
  height: 100vh;
  padding: 60px 20px;
  margin: 0 auto;

  .mediflow-logo {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin: 0 -30px 0 -20px;

    a {
      padding: 20px;

      img {
        display: block;
        width: 140px;
        height: 20px;
      }
    }
  }
`
