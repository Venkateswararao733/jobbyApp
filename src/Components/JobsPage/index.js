import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {RiWalletFill} from 'react-icons/ri'
import Loader from 'react-loader-spinner'
import Headers from '../Headers'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const requestStatus = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobsPage extends Component {
  state = {
    profileStatus: requestStatus.initial,
    profileName: '',
    profileImageUrl: '',
    shortBio: '',
    jobsItemsStatus: requestStatus.initial,
    jobsDataList: [],
    searchValue: '',
    salaryRange: '',
    employmentType: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getProfileDetails = async () => {
    this.setState({profileStatus: requestStatus.progress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const jsonData = await response.json()
      const profileDetails = jsonData.profile_details
      const profileName = profileDetails.name
      const profileImageUrl = profileDetails.profile_image_url
      const shortBio = profileDetails.short_bio
      this.setState({
        profileStatus: requestStatus.success,
        profileName,
        profileImageUrl,
        shortBio,
      })
    } else {
      this.setState({profileStatus: requestStatus.failure})
    }
  }

  onClickProfileRetryBtn = () => {
    this.getProfileDetails()
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        className="profile-failure-btn"
        type="button"
        onClick={this.onClickProfileRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileName, profileImageUrl, shortBio} = this.state
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-name">{profileName}</h1>
        <p className="short-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileDetails = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case requestStatus.progress:
        return this.renderLoaderView()
      case requestStatus.success:
        return this.renderProfileSuccessView()
      case requestStatus.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  onChangeCheckbox = event => {
    const {employmentType} = this.state
    let newId
    const id = event.target.value
    const includes = employmentType.includes(id)
    if (employmentType.length === 0) {
      newId = `${id}`
    } else if (includes) {
      if (id.length === employmentType.length) {
        newId = employmentType.replace(`${id}`, '')
      } else {
        newId = employmentType.replace(`${id},`, '')
      }
    } else {
      newId = `${employmentType},${id}`
    }
    this.setState({employmentType: newId}, this.getJobsDetails)
  }

  renderEmploymentTypeOption = props => {
    const {label, employmentTypeId} = props
    return (
      <li key={employmentTypeId} className="option">
        <input
          type="checkbox"
          id={employmentTypeId}
          className="checkbox"
          value={employmentTypeId}
          onChange={this.onChangeCheckbox}
        />
        <label htmlFor={employmentTypeId} className="option-label">
          {label}
        </label>
      </li>
    )
  }

  onChangeRadioBtn = event => {
    this.setState({salaryRange: event.target.value}, this.getJobsDetails)
  }

  renderSalaryRangeOption = props => {
    const {salaryRange} = this.state
    const {label, salaryRangeId} = props
    const isChecked = salaryRangeId === salaryRange
    return (
      <li key={salaryRangeId} className="option">
        <input
          value={salaryRangeId}
          type="radio"
          name={salaryRangeId}
          id={salaryRangeId}
          className="radio"
          onChange={this.onChangeRadioBtn}
          checked={isChecked}
        />
        <label htmlFor={salaryRangeId} className="option-label">
          {label}
        </label>
      </li>
    )
  }

  getJobsDetails = async () => {
    this.setState({jobsItemsStatus: requestStatus.progress})
    const {searchValue, salaryRange, employmentType} = this.state
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${searchValue}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsUrl, options)
    if (response.ok === true) {
      const jsonData = await response.json()
      const jobsData = jsonData.jobs
      const updatedJobsData = jobsData.map(eachJob =>
        this.getUpdatedJobsData(eachJob),
      )
      this.setState({
        jobsItemsStatus: requestStatus.success,
        jobsDataList: updatedJobsData,
      })
    } else {
      this.setState({jobsItemsStatus: requestStatus.failure})
    }
  }

  getUpdatedJobsData = eachJob => ({
    companyLogoUrl: eachJob.company_logo_url,
    employmentType: eachJob.employment_type,
    id: eachJob.id,
    jobDescription: eachJob.job_description,
    location: eachJob.location,
    packagePerAnnum: eachJob.package_per_annum,
    rating: eachJob.rating,
    title: eachJob.title,
  })

  onChangeSearchValue = event => {
    this.setState({searchValue: event.target.value})
  }

  onClickSearchBtn = () => {
    this.getJobsDetails()
  }

  onClickJobsRetryBtn = () => {
    this.getJobsDetails()
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className="jobs-failure-image"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="job-failure-btn"
        type="button"
        onClick={this.onClickJobsRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderJobItem = props => {
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = props
    return (
      <li className="job-item" key={id}>
        <Link to={`/jobs/${id}`} className="link-item">
          <div className="job-lh-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
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
          <h1 className="sub-heading">Description</h1>
          <p className="description">{jobDescription}</p>
        </Link>
      </li>
    )
  }

  renderJobsSuccessView = () => {
    const {jobsDataList} = this.state

    return jobsDataList.length === 0 ? (
      <div className="jobs-failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="jobs-failure-image"
        />
        <h1 className="jobs-failure-heading">No Jobs Found</h1>
        <p className="jobs-failure-description">
          We could not find any job. Try other filters
        </p>
      </div>
    ) : (
      <ul className="jobs-success-container">
        {jobsDataList.map(eachJob => this.renderJobItem(eachJob))}
      </ul>
    )
  }

  renderJobsItems = () => {
    const {jobsItemsStatus} = this.state
    switch (jobsItemsStatus) {
      case requestStatus.progress:
        return this.renderLoaderView()
      case requestStatus.failure:
        return this.renderJobsFailureView()
      case requestStatus.success:
        return this.renderJobsSuccessView()
      default:
        return null
    }
  }

  render() {
    const {searchValue} = this.state
    return (
      <div className="app-container">
        <Headers />
        <div className="jobs-container">
          <div className="job-search-container-mobile">
            <input
              type="search"
              className="search-input-element"
              placeholder="Search"
              value={searchValue}
              onChange={this.onChangeSearchValue}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-btn"
              onClick={this.onClickSearchBtn}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="pro-fil-container">
            {this.renderProfileDetails()}
            <hr className="hr-line" />
            <ul className="options-container">
              <h1 className="employment-heading">Type of Employment</h1>
              {employmentTypesList.map(eachType =>
                this.renderEmploymentTypeOption(eachType),
              )}
            </ul>
            <hr className="hr-line" />
            <ul className="options-container">
              <h1 className="employment-heading">Salary Range</h1>
              {salaryRangesList.map(eachRange =>
                this.renderSalaryRangeOption(eachRange),
              )}
            </ul>
          </div>

          <div className="job-items-container">
            <div className="job-search-container-desktop">
              <input
                type="search"
                className="search-input-element"
                placeholder="Search"
                value={searchValue}
                onChange={this.onChangeSearchValue}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.onClickSearchBtn}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsItems()}
          </div>
        </div>
      </div>
    )
  }
}

export default JobsPage
