import React, { useState, useEffect } from 'react'
import { HeroContainer, HeroBg, VideoBg, ImageBg } from './HeroElements'
// import Video from '../../../videos/youtube.mp4'
import { HeroContent, HeroH1, HeroP, HeroBtnWrapper, ArrowForward, ArrowRight } from './HeroElements'
import { Button } from '../ButtonElement'
import { Link as LinkS } from 'react-scroll'
import { Diversity1Rounded } from '@mui/icons-material'
const HeroSection = () => {
    const [hover, setHover] = useState(false)
    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 500px)").matches
    )
    const onClick = () => {
        // console.log('clicked--');
        // < LinkS to='signup' smooth={true} duration={500} spy={true} exact='true' offset={- 80
        // } />
    }

    useEffect(() => {
        window
            .matchMedia("(min-width: 500px)")
            .addEventListener('change', e => setMatches(e.matches));
    }, []);

    const onHover = () => setHover(!hover)
    return (
        <HeroContainer id='home'>
            <HeroBg>
                {/* {console.log('matches: ', matches)} */}
                {matches && (<VideoBg autoPlay muted loop playsinline src={require('../../../videos/youtube.mp4')} type='video/mp4' />)}
                {!matches && (<ImageBg src={require('../../../images/small2.jpg')} />)}
                {/* {!matches && (<ImageBg src={require('../../../images/small3.svg').default} />)} */}
                {/* <VideoBg autoPlay muted loop playsinline src={Video} type='video/mp4' /> */}
                {/* <ImageBg src={require('../../../images/smedia.jpg')} /> */}
                {/* <div style={{ width: '100%', height: '100%' }}
                    dangerouslySetInnerHTML={{
                        __html: `<video autoPlay loop muted src=${Video} type='video/mp4' 
                    style=${{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />`

                    }} /> */}
                {/* <video autoPlay loop muted src={Video} type='video/mp4'
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                /> */}

            </HeroBg>
            <HeroContent>
                <HeroH1>Connect Social Media to E-learning & E-commerce Easy</HeroH1>
                <HeroP>
                    Sign up for a new account today and try your content for 3 months free
                </HeroP>
                <HeroBtnWrapper>
                    <Button onClick={onClick} to='signup' onMouseLeave={onHover} onMouseEnter={onHover} primary='true' dark='true'
                        smooth={true} duration={500} spy={true} exact='true' offset={-80}
                    >
                        <span>Get Started</span> {hover ? <ArrowForward /> : <ArrowRight />}
                    </Button>
                </HeroBtnWrapper>
            </HeroContent>
        </HeroContainer>
    )
}

export default HeroSection