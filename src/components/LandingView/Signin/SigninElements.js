import styled from "styled-components";
import { Link as LinkR } from 'react-router-dom'

export const Container = styled.div`
    position: fixed;
    top:0;
    bottom:0;
    left:0;
    right:0;
    z-index:0;
    min-height:692px;
    overflow:hidden;
    /* background:#1592b4; */
    background:linear-gradient(
        180deg,
        rgba(1,147,68,1) 0%,
        rgba(10,201,122,1) 100%

    );
`
export const FormWrap = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    /* align-items: center; */
    height: 100%;

    @media screen and (max-width:400px){
        height:80%;
    }

`

export const Icon = styled(LinkR)`
    margin-top: 32px;
    margin-left: 32px;
    text-decoration:none;
    color: #fff;
    font-weight:700;
    font-size:32px;
    @media screen and (max-width:480px){
        margin-left: 16px;
        margin-top: 40px;
    }
    &a:visited {
    color: white;
}
`

export const FormContent = styled.div`
    display:flex;
    flex-direction:column;
    /* align-items: center; */
    justify-content:center;
    height:100%;
    @media screen and (max-width:480px){
        padding: 10px;
    }
`

export const Form = styled.form`
    display:grid;
    max-width: 400px;
    width:100%;
    height:auto;
    z-index: 1;
    margin: 0 auto;
    padding: 40px 32px;
    background: #010101;
    border-radius:4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.9);
    @media screen and (max-width:400px){
        padding: 32px 32px;
    }
`

export const FormH1 = styled.h1`
    font-size:20px;
    font-weight:400;
    text-align:center;
    margin-bottom:40px;
    color:#fff;

`

export const FormLabel = styled.label`
    font-size:14px;
    margin-bottom:8px;
    color: #fff;
`

export const FormInput = styled.input`
    margin-bottom: 32px;
    padding: 16px 16px;
    border: none;
    border-radius:4px;
`

export const FormButton = styled.button`
    background: #01bf71;
    color:#fff;
    padding:16px 0;
    font-size:20px;
    border:none;
    border-radius:4px;
    cursor: pointer;
`

export const Text = styled.span`
    font-size:14px;
    text-align:center;
    color: #fff;
    margin-top:24px;
`