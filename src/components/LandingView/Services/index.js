import React from 'react'
import Icon1 from '../../../images/svg-1.svg'
import Icon2 from '../../../images/svg-2.svg'
import Icon3 from '../../../images/svg-3.svg'
import { ServicesContainer, ServicesWrapper, ServicesCard, ServicesIcon, ServicesH1, ServicesH2, ServicesP } from './ServicesElements'
const Services = () => {
    return (
        <>
            <ServicesContainer id='services'>
                <ServicesH1>Our Services</ServicesH1>
                <ServicesWrapper>
                    {/* Card #1 */}
                    <ServicesCard>
                        <ServicesIcon src={Icon1} />
                        <ServicesH2>From Social Media</ServicesH2>
                        <ServicesP>
                            We help bring your audiences to your market place.
                        </ServicesP>
                    </ServicesCard>

                    {/* Card #2 */}
                    <ServicesCard>
                        <ServicesIcon src={Icon2} />
                        <ServicesH2>One Stop Service</ServicesH2>
                        <ServicesP>
                            We provide easy access of e-learning & e-commerce features.
                        </ServicesP>
                    </ServicesCard>

                    {/* Card #3 */}
                    <ServicesCard>
                        <ServicesIcon src={Icon3} />
                        <ServicesH2>Maximize your sales </ServicesH2>
                        <ServicesP>
                            Any kind of your content can be on sales.
                        </ServicesP>
                    </ServicesCard>

                </ServicesWrapper>
            </ServicesContainer>
        </>
    )
}

export default Services