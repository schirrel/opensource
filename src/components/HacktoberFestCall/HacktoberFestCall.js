import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import media from "styled-media-query"

import ButtonLink from "../ButtonLink"
import UserProgress from "./UserProgress"
import { Container } from "../Layout"

import hacktoberFestImg from "../../images/2020/astronauta.png"
import hacktoberFestCall from "../../images/2020/logo-desktop.png"

const HacktoberFestCallWrapper = styled.section`
  height: 100vh;
  color: #fff;
`

const Title = styled.div`
  margin: 2rem 0 32px 0;
  font-family: "Bigelow Rules", cursive;
  font-size: 4.5rem;

  ${media.greaterThan("medium")`
    font-size: 5.5rem;
  `}

  ${media.greaterThan("large")`
    font-size: 7.5rem;
  `}
`

const EventHeader1 = styled.div`
  margin-bottom: 16px;
  line-height: 1.4rem;
  width: 100%;
  text-align: center;

  ${media.greaterThan("medium")`
    font-size: 1.75rem;
    line-height: 2.3rem;
    margin-bottom: 32px;
    text-align: unset;
  `}


  strong {
    font-weight: 700;
  }

  span {
    display: inline;
    ${media.greaterThan("medium")`
      display: block;
  `}
  }
`

const EventHeader2 = styled.div`
  margin-bottom: 16px;
  text-align: center;
  font-size: 0.825rem;

  ${media.greaterThan("medium")`
    font-size: 1.25rem;
    text-align: unset;
    margin-bottom: 32px;
  `}

`

const CallContainer = styled(Container)`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;

  ${media.greaterThan("medium")`

    flex-direction: row;
  `}

  ${media.greaterThan("large")`
    justify-content: space-between;
  `}

  img {
    width: calc(100vh - 65vh);
    &.astronaut{
        ${media.greaterThan("large")`
          width: 60%;
      `}
    }

    &.call{
      ${media.greaterThan("large")`
        width: 100%;
      `}
    }
  }

`

const ActionButtons = styled.div`
  text-align: center;

  ${media.greaterThan("medium")`
    text-align: left;
  `}
`

function HacktoberFestCall({ user, isCallOnly }) {
  return (
    <HacktoberFestCallWrapper>
      <CallContainer>
        <img className="astronaut" src={hacktoberFestImg} alt="Hacktoberfest Art" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <img className="call" src={hacktoberFestCall} alt="Hacktoberfest Art" />
          <div className="info">
            <EventHeader1>
              <strong>1 a 31 de outubro </strong>
              <span>na Globo</span>
            </EventHeader1>
            <EventHeader2>
              Contribua e ganhe uma camiseta exclusiva.
            </EventHeader2>
            <ActionButtons>
              {isCallOnly ? (
                <ButtonLink href="/hacktoberfest" dark={true}>
                  Saiba mais
                </ButtonLink>
              ) : user ? (
                <UserProgress user={user} />
              ) : (
                <ButtonLink href="/login" dark={true}>
                  Participar
                </ButtonLink>
              )}
            </ActionButtons>
          </div>
        </div>
      </CallContainer>
    </HacktoberFestCallWrapper>
  )
}

HacktoberFestCall.propTypes = {
  user: PropTypes.object,
  isCallOnly: PropTypes.bool,
  onSignIn: PropTypes.func,
}

HacktoberFestCall.defaultProps = {
  isCallOnly: false,
}

export default HacktoberFestCall
