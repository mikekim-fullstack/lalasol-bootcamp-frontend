import styled from "styled-components";

export const ServicesContainer = styled.div`
    background:linear-gradient(180deg, rgba(0,0,0,1) 0%,rgba(37,18,40,1) 50%, rgba(47,18,40,1) 100%) ;
    /* background:#fff; */
    height: 800px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    

    @media screen and (max-width:768px){
        height:1100px;
    }

    @media screen and (max-width:480px) {
        height:1300px;
    }

`

export const ServicesWrapper = styled.div`
    max-width:1000px;
    margin:0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 16px;
    padding: 0 50px;
    align-items:center;

    @media screen and (max-width:1000px){
        grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width:768px){
        grid-template-columns: 1fr;
        padding: 0 20px;
    }

`

export const ServicesCard = styled.div`
    background: #c91ccb;
    background: rgb(171,0,205);
    box-shadow: 0 1px 3px rgba(1,1,1,.2);
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:center;
    min-height:400px;
    border-radius:10px;
    padding:10px;
    padding:30px 20px;
    /* height:600px; */
    transition: all 0.3s ease-in-out;

    &:hover{
        scale: 1.02;
        background: rgb(201,0,235);
        /* transition: all 0.2s ease-in-out; */
        cursor:pointer;
    }
    @media screen and (max-width:1000px){
        max-height:290px;
        min-height:unset;
        padding:20px 20px;
    }

    @media screen and (max-width:768px){
        /* max-height:200px; */
        min-height:unset;
    }
`

export const ServicesIcon = styled.img`
    width:160px;
    height:160px;
    margin-bottom:10px;
`

export const ServicesH1 = styled.h1`
    font-size:2.5rem;
    color: #fff;
    margin-bottom:64px;
    @media screen and (max-width:480px){
        font-size: 2rem;
    }
`

export const ServicesH2 = styled.h2`
    font-size: 1rem;
    margin-bottom:10px;
    
`

export const ServicesP = styled.p`
    font-size:1rem;
    text-align: center;
    /* color:#fff; */
`
