import styled from 'styled-components'

export const Container = styled.div`
  margin-top: 30px;

  .file-drop {
    display: flex;
    justify-content: center;
    align-items: center;

    margin-top: auto;
    margin-bottom: 40px;
    padding: 20px;

    width: calc(100% - 40px);
    height: 50px;
    background: #fbfbfb;
    border-radius: 20px;
    filter: drop-shadow(0px 4px 3px rgba(51, 46, 58, 0.1));

    .file-input {
      display: flex;
      justify-content: center;

      span {
        font-size: 14px;
        color: #a0a4a8;
      }

      &-button {
        display: block;
        margin-left: 10px;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }

  .file-ocr-receipt-wrap {
    padding: 20px 20px 15px 20px;

    max-height: 600px;
    overflow-y: auto;

    border: 1px solid rgb(229, 234, 242);
    border-radius: 20px;
    filter: drop-shadow(0px 4px 3px rgba(51, 46, 58, 0.1));
  }

  .file-image-name {
    margin-bottom: 5px;
  }

  .file-ocr-receipt {
    display: flex;
    flex-wrap: wrap;

    .ocr-btn-wrap {
      margin-bottom: 5px;
    }

    .ocr-btn {
      margin-right: 5px;
      white-space: nowrap;
    }

    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
`
