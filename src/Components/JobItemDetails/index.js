import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {RiWalletFill} from 'react-icons/ri'
import {GrShare} from 'react-icons/gr'

import Headers from '../Headers'

import './index.css'

const requestStatus = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobItemStatus: requestStatus.initial,
    jobItemDetailsData: {},
    similarJobsArray: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({jobItemStatus: requestStatus.progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const jobItemUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobItemUrl, options)
    if (response.ok === true) {
      const jsonData = await response.json()
      console.log(jsonData)
      const jobItemDetails = jsonData.job_details
      const updatesJobDetails = {
        companyLogoUrl: jobItemDetails.company_logo_url,
        companyWebsiteUrl: jobItemDetails.company_website_url,
        employmentType: jobItemDetails.employment_type,
        id: jobItemDetails.id,
        jobDescription: jobItemDetails.job_description,
        skills: jobItemDetails.skills,
        title: jobItemDetails.title,
        lifeAtCompany: jobItemDetails.life_at_company,
        location: jobItemDetails.location,
        packagePerAnnum: jobItemDetails.package_per_annum,
        rating: jobItemDetails.rating,
      }
      const similarJobsData = jsonData.similar_jobs
      const updatedSimilarJobs = similarJobsData.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobItemDetailsData: updatesJobDetails,
        similarJobsArray: updatedSimilarJobs,
        jobItemStatus: requestStatus.success,
      })
    } else {
      this.setState({jobItemStatus: requestStatus.failure})
    }
  }

  onClickJobsRetryBtn = () => {
    this.getJobItemDetails()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemFailureView = () => (
    <div className="jobs-item-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className="job-item-failure-image"
      />
      <h1 className="job-item-failure-heading">Oops! Something Went Wrong</h1>
      <p className="job-item-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="job-item-failure-btn"
        type="button"
        onClick={this.onClickJobsRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderSkillItem = eachSkill => {
    const {imageUrl, name} = eachSkill
    return (
      <li className="skill-item" key={name}>
        <img src={imageUrl} alt={name} className="skill-image" />
        <p className="skill-name">{name}</p>
      </li>
    )
  }

  renderSimilarJobItem = eachJob => {
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      id,
      location,
      rating,
      title,
    } = eachJob
    return (
      <li className="similar-job-item-container" key={id}>
        <div className="job-lh-container">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="company-logo"
          />
          <div className="heading-container">
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="rating-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <h1 className="sub-heading">Description</h1>
        <p className="description">{jobDescription}</p>
        <div className="lpe-container">
          <div className="le-container">
            <MdLocationOn className="le-icon" />
            <p className="le-names">{location}</p>
            <RiWalletFill className="le-icon" />
            <p className="le-names">{employmentType}</p>
          </div>
        </div>
      </li>
    )
  }

  renderJobItemSuccessView = () => {
    const {jobItemDetailsData, similarJobsArray} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
      lifeAtCompany,
    } = jobItemDetailsData
    const skillsArray = skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    }))
    const updatedLifeAtCompany = {
      description: lifeAtCompany.description,
      imageUrl: lifeAtCompany.image_url,
    }
    const {description, imageUrl} = updatedLifeAtCompany
    return (
      <>
        <div className="job-item-container">
          <div className="job-lh-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="heading-container">
              <h1 className="title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="rating-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="lpe-container">
            <div className="le-container">
              <MdLocationOn className="le-icon" />
              <p className="le-names">{location}</p>
              <RiWalletFill className="le-icon" />
              <p className="le-names">{employmentType}</p>
            </div>
            <p className="sub-heading">{packagePerAnnum}</p>
          </div>
          <hr className="hr-line" />
          <div className="description-heading-container">
            <h1 className="sub-heading">Description</h1>
            <a href={companyWebsiteUrl} className="visit-link">
              Visit <GrShare className="share-icon" />
            </a>
          </div>
          <p className="description">{jobDescription}</p>
          <h1 className="sub-heading">Skills</h1>
          <ul className="skills-container">
            {skillsArray.map(eachSkill => this.renderSkillItem(eachSkill))}
          </ul>
          <h1 className="sub-heading">Life at company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company-description">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1 className="sub-heading">Similar jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobsArray.map(eachJob => this.renderSimilarJobItem(eachJob))}
        </ul>
      </>
    )
  }

  renderJobItemDetails = () => {
    const {jobItemStatus} = this.state
    switch (jobItemStatus) {
      case requestStatus.progress:
        return this.renderLoadingView()
      case requestStatus.failure:
        return this.renderJobItemFailureView()
      case requestStatus.success:
        return this.renderJobItemSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <Headers />
        <div className="job-item-details-container">
          {this.renderJobItemDetails()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
