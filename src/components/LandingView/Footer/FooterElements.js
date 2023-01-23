import styled from "styled-components";
import { Link as LinkR } from 'react-router-dom'

export const FooterContainer = styled.footer`
    background: #101522;
    background: #16011e;
    
`

export const FooterWrap = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items: center;
    margin: 0 auto;
    max-width:1100px;
    padding: 48px 24px;

`

export const FooterLinksContainer = styled.div`
    display:flex;
    justify-content:center;
    @media screen and (max-width:820px){
        padding-top:32px;
    }
`

export const FooterLinksWrapper = styled.div`
    display:flex;
    @media screen and (max-width:820px){
        flex-direction:column;
    }
`

export const FooterLinkItems = styled.div`
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    margin:16px;
    text-align:left;
    width:160px;
    box-sizing: border-box;
    color: #fff;

    @media screen and (max-width:420px){
        margin:0;
        padding:10px;
        width:100%;
    }
`

export const FooterLinkTitle = styled.h1`
    font-size: 14px;
    margin-bottom: 16;
`

export const FooterLink = styled(LinkR)`
    font-size: 14px;
    text-decoration: none;
    margin-bottom: 0.5rem;
    color:#fff;
    

    &:hover{

        color:#01bf71;
        transition: all 0.3s ease-out;
    }
`

// Social Media
export const SocialMedia = styled.section`
    max-width:1000px;
    width:100%;
`

export const SocialMediaWrap = styled.div`
    display:flex;
    justify-content: space-between;
    align-items: center;
    max-width:1100px;
    margin: 40px auto 0 auto;
    @media screen and (max-width: 820px){
        flex-direction:column;
    }
`
export const SocialLogo = styled(LinkR)`
    display:flex;
    justify-self:start;
    align-items: center;
    margin-bottom: 16px;
    font-size:1.5rem;
    font-weight:bold;
    text-decoration:none;
    color:#fff;
    cursor:pointer;
`
export const WebsiteRights = styled.small`
    color: #fff;
    margin-bottom:16px;
`

export const SocialIcons = styled.div`
    display:flex;
    justify-content:space-between;
    align-items: center;
    width: 240px;
`

export const SocialIconLink = styled.a`
    color:#fff;
    font-size:24px;
`