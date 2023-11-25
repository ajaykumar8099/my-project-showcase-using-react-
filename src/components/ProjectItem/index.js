import './index.css'

const ProjectItem = props => {
  const {details} = props
  const {name, imageUrl} = details
  return (
    <li className="list-item">
      <img src={imageUrl} alt={name} />
      <p className="para">{name}</p>
    </li>
  )
}
export default ProjectItem
