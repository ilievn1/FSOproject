import { Link } from 'react-router-dom'

const Breadcrumbs = ({ currentRoute }: { currentRoute: string }) => {
    const formatedRoute = currentRoute.split('/');

  return (
      <div className="text-sm breadcrumbs">
          <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to={currentRoute}>{formatedRoute}</Link></li>
          </ul>
      </div>  )
}

export default Breadcrumbs