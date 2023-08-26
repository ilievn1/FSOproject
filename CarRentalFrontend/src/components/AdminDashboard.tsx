// TODO: Add users, remove users, ban users
// TODO: Add and remove cars
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AdminDashboard = () => {
  const result = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => axios.get('http://localhost:3001/api/vehicles').then(res => res.data)
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const data = result.data
  
  return (
    <>
      {JSON.stringify(data)}
    </>
  )
}

export default AdminDashboard
