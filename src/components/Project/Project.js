import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import styled, { css } from "styled-components"
import media from "styled-media-query"

import iconExpandLess from "../../images/icons/expand-less.svg"
import iconExpandMore from "../../images/icons/expand-more.svg"

import starsIcon from "../../images/icons/stars"
import iconCommits from "../../images/icons/commits"
import iconPrs from "../../images/icons/prs"
import iconIssues from "../../images/icons/issues"

import Colors from "../../constants/colors"

import { getRepoStats } from "../../services/github"

import BracketImage from "../../images/2020/open-bracket.svg";

const REPOSITORY_COUNT_ICONS = {
  stars: (home) => () => starsIcon(home),
  commits: (home) => () => iconCommits(home),
  prs: (home) => () => iconPrs(home),
  issues: (home) => () => iconIssues(home),
}

const ProjectWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${props =>
    !props.isFeatured &&
    css`
      margin-bottom: 1.7rem;
    `}
`

const ProjectDetails = styled.div`
  transition: visibility 225ms;

  ${props =>
    !props.open
      ? css`
          display: none;
          visibility: hidden;
        `
      : css`
          visibility: visible;
        `}

  ${media.greaterThan("medium")`
    visibility: visible;
    display: unset;
  `}
`

const ProjectName = styled.h2`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: ${props => props.home ? "0px" : "1.5rem"};
  color: ${props => props.home ? "#fff": "#000"}

`

const ProjectDescription = styled.p`
  padding: 1.5rem 0;
  line-height: 1.25;
  color: #fff;
  letter-spacing: 0.4px;
  text-align: center;
`

const ProjectWebSite = styled.a`
  display:block;
  text-align:center;
  color: ${Colors.PRIMARY_COLOR};
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`

const ProjectLinks = styled.div`
  padding: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content:space-around;
`

const ProjectLink = styled.a`
  font-weight: bold;
  color: ${props => props.home ? "#fff" : "#000"};
  padding: ${props => props.home ? "0px 10px" : "0px"};
`

const Nav = styled.div`
  padding: 20px 0;
  padding-left: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${media.greaterThan("medium")`
    padding: 1.5rem 0;
    height: 80px;
  `}
`

const NavButton = styled.i`
  width: 24px;
  height: 24px;

  ${props =>
    props.open
      ? css`
          background-image: url(${iconExpandLess});
        `
      : css`
          background-image: url(${iconExpandMore});
        `}

  ${media.greaterThan("medium")`
    display: none;
  `}
`

const ImageWrapper = styled.div`
  text-align: center;
  flex: 1;
`

const RepoInfo = styled.div`
  padding: 1.5rem 0 1rem;
  display: ${props => props.home ? 'flex': 'grid'};
  justify-content: space-between;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: ${props => props.home ? '0px':'35px'};
`

const RepoCounterWrapper = styled.div`
  color: #757575;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const RepoCounterIcon = styled.i`
  width: 30px;
  height: 20px;
  display: inline-block;
  background-position: center;
  margin-bottom: 10px;
`

const Bracket = styled.img`
    transform: scaleX(${props => props.inverted ? -1 : 1});
    width: ${props => props.width ? props.width : "26px"}
`

const StyledBracketWrapper = styled.div`
    display: flex;
    align-items:center;
`;

const BracketWrapper = (props) => {
  return (
    <StyledBracketWrapper style={{...props.style}}>
      {props.home && <Bracket src={BracketImage} width={props.width}/>}
        {props.children}
      {props.home && <Bracket src={BracketImage} width={props.width} inverted/>}
    </StyledBracketWrapper>
  )
}

function RepoCounter({ name, count, home }) {
  const Icon = REPOSITORY_COUNT_ICONS[name](home)
  
  return (
    <RepoCounterWrapper>
      <RepoCounterIcon>
        <Icon/>
      </RepoCounterIcon>
      <span style={{color: home ? "#fff": "unset"}}>{count === undefined ? "00000" : count}</span>
    </RepoCounterWrapper>
  )
}

RepoCounter.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number,
}

function Project(props) {
  const {
    name,
    owner,
    slug,
    image,
    siteURL,
    repoURL,
    docsURL,
    shortDescription,
    description,
    isFirst,
    isFeatured,
    repoNumbers,
    home
  } = props

  const [open, setOpen] = useState(isFirst)
  const [repoCounters, setRepoCounters] = useState({})

  function handleToggleOpen() {
    setOpen(!open)
  }

  console.log(REPOSITORY_COUNT_ICONS["stars"](props.home))
  useEffect(() => {
    async function fetchRepoCounter() {
      if (repoNumbers) {
        setRepoCounters({
          stars: repoNumbers.stars,
          prs: repoNumbers.prs,
          commits: repoNumbers.commits,
          issues: repoNumbers.issues,
        })
        return
      }

      const stats = await getRepoStats(owner, slug)
      if (!stats) return

      const { repository } = stats
      setRepoCounters({
        stars: repository.stargazers.totalCount,
        prs: repository.pullRequests.totalCount,
        commits: repository.object.history.totalCount,
        issues: repository.issues.totalCount,
      })
    }
    fetchRepoCounter()
  }, [owner, slug, repoNumbers])

  return (
    <ProjectWrapper isFeatured={isFeatured}>
      {image.publicURL ? (
        <Nav onClick={handleToggleOpen}>
          <ImageWrapper>
            <img style={{maxWidth: 218}} src={image.publicURL} alt={name} />
          </ImageWrapper>
          <NavButton open={open} />
        </Nav>
      ) : (
        <ProjectName>{name}</ProjectName>
      )}
      <ProjectDetails open={!isFeatured ? true : open}>
          <RepoInfo home={home}>
            <BracketWrapper home={home} style={{width: "100%", "justify-content": "space-around"}}>
              <RepoCounter name="stars" count={repoCounters.stars} home={home}/>
              <RepoCounter name="commits" count={repoCounters.commits} home={home}/>
              <RepoCounter name="prs" count={repoCounters.prs} home={home}/>
              <RepoCounter name="issues" count={repoCounters.issues} home={home}/>
            </BracketWrapper>
          </RepoInfo>

        <ProjectDescription home={home}>
          {shortDescription || description}
        </ProjectDescription>
        {siteURL && (
          <ProjectWebSite
            href={siteURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {siteURL}
          </ProjectWebSite>
        )}
        <ProjectLinks>
          {repoURL && (
            <BracketWrapper width="10px" home={home}>
              <ProjectLink
                home={home}
                href={repoURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {isFeatured ? "Repositório" : "Ver repositório"}
              </ProjectLink>
            </BracketWrapper>
          )}
          {docsURL && (
            <BracketWrapper width="10px" home={home}>
              <ProjectLink
                home={home}
                href={docsURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentação
              </ProjectLink>
            </BracketWrapper>
          )}
        </ProjectLinks>
      </ProjectDetails>
    </ProjectWrapper>
  )
}

Project.propTypes = {
  isFirst: PropTypes.bool.isRequired,
  isFeatured: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.object,
  repoURL: PropTypes.string.isRequired,
  siteURL: PropTypes.string,
  docsURL: PropTypes.string,
  shortDescription: PropTypes.string,
  description: PropTypes.string,
  repoNumbers: PropTypes.object,
  home: PropTypes.bool
}

Project.defaultProps = {
  isFirst: false,
  isFeatured: false,
}

export default Project
