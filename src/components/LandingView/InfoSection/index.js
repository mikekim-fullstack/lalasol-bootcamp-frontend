import React from 'react'
import { Button } from '../../../components/LandingView/ButtonElement'
import { InfoContainer, InfoWrapper, InfoRow, Column1, Column2, TextWrapper, TopLine, Heading, Description, Description2, BtnWrap, ImgWrap, Img } from './InfoElements'
const InfoSection = ({ isDesc2, onClick, id, toScroll, lightBg, imgStart, topLine, headLine, lightText, darkText, description, moreDes, buttonLabel, img, alt, primary, dark, dark2 }) => {
    // console.log('lightText', lightText, ', darkText', darkText, ', img', img, ', imgStart', imgStart)

    return (
        <>
            <InfoContainer lightBg={lightBg} id={id}>
                <InfoWrapper>
                    <InfoRow imgStart={imgStart}>
                        <Column1>
                            <TextWrapper>
                                <TopLine >{topLine}</TopLine>
                                <Heading lightText={lightText}>{headLine}</Heading>
                                <Description darkText={darkText}>{description}</Description>
                                {isDesc2 && <Description2 darkText={darkText}>
                                    {moreDes.map((p, index) => <li key={index}>{p}</li>)}
                                </Description2>}
                                <BtnWrap>
                                    <Button
                                        to={toScroll || ''}
                                        onClick={e => onClick(e, id)}
                                        smooth={true}
                                        duration={500}
                                        spy={true}
                                        exact='true'
                                        offset={-80}
                                        primary={primary ? 1 : 0}
                                        dark={dark ? 1 : 0}
                                        dark2={dark2 ? 1 : 0}
                                    >{isDesc2 ? 'Read less' : buttonLabel}
                                    </Button>
                                </BtnWrap>
                            </TextWrapper>
                        </Column1>
                        <Column2>
                            <ImgWrap>
                                <Img src={img} alt={alt} />
                            </ImgWrap>
                        </Column2>
                    </InfoRow>
                </InfoWrapper>

            </InfoContainer>
        </>
    )
}

export default InfoSection