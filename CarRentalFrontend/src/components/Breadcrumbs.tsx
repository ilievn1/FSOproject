import { Link } from 'react-router-dom'

const Breadcrumbs = ({ route }: { route: string }) => {
    const formatedRoute = route.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1));
  return (
      <div className="text-sm breadcrumbs">
          <ul>
              <li><Link to="/">Home</Link></li>

              {formatedRoute.map((subRoute, index) => {
                  const nThSubroute = route.split('/').filter(Boolean).slice(0,index+1).join('/')
                  return (<li key={index}><Link to={`/${nThSubroute}`}>{subRoute}</Link></li>)
              })}
              
          </ul>
      </div>  )
}

export default Breadcrumbs