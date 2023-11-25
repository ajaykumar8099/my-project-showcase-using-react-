import {Component} from 'react'
import Loader from 'react-loader-spinner'

import ProjectItem from '../ProjectItem'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectDetails extends Component {
  state = {
    selectItem: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {selectItem} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${selectItem}`
    console.log(url)
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updateProjectsList = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updateProjectsList,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onChangeSelectItem = event => {
    this.setState({selectItem: event.target.value}, this.getProjects)
  }

  onApiSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="un-list-container">
        {projectsList.map(each => (
          <ProjectItem key={each.id} details={each} />
        ))}
      </ul>
    )
  }

  onApiFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="image-failure"
      />
      <h1 className="heading-failure">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.getProjects}>
        Retry
      </button>
    </div>
  )

  onApiLoadingView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  allViewsBasedOnApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.onApiSuccessView()
      case apiConstants.failure:
        return this.onApiFailureView()
      case apiConstants.inProgress:
        return this.onApiLoadingView()
      default:
        return null
    }
  }

  render() {
    const {selectItem} = this.state
    console.log(selectItem)
    return (
      <div className="bg-container">
        <nav className="nav-bar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="nav-image"
          />
        </nav>
        <div className="main-container">
          <select
            value={selectItem}
            className="select-container"
            onChange={this.onChangeSelectItem}
          >
            {categoriesList.map(each => (
              <option value={each.id}>{each.displayText}</option>
            ))}
          </select>
          <div className="result-container">
            {this.allViewsBasedOnApiStatus()}
          </div>
        </div>
      </div>
    )
  }
}
export default ProjectDetails
