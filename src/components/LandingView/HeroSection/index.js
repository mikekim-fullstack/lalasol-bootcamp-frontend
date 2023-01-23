import React, { useState } from 'react'
import { HeroContainer, HeroBg, VideoBg } from './HeroElements'
import Video from '../../../videos/youtube.mp4'
import { HeroContent, HeroH1, HeroP, HeroBtnWrapper, ArrowForward, ArrowRight } from './HeroElements'
import { Button } from '../ButtonElement'
import { Link as LinkS } from 'react-scroll'
const HeroSection = () => {
    const [hover, setHover] = useState(false)
    const onClick = () => {
        // console.log('clicked--');
        // < LinkS to='signup' smooth={true} duration={500} spy={true} exact='true' offset={- 80
        // } />
    }
    const onHover = () => setHover(!hover)
    return (
        <HeroContainer id='home'>
            <HeroBg>
                <VideoBg autoPlay loop muted src={Video} type='video/mp4' />
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