import CarCard from "./CarCard"
import CarCardLoading from "./CarCardLoading";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const DividedTopModels = () => {
    const carsQuery = useQuery({
        queryKey: ['topThreeVehicles'],
        queryFn: () => axios.get('http://localhost:3001/api/vehicles?top=3').then(res => res.data),
        refetchOnWindowFocus: false,
    })

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Top 3 models</h1>
            <div className="flex flex-col w-full md:flex-row">
                {carsQuery.isLoading ? <CarCardLoading /> : <CarCard car={carsQuery.data[0]} />}
                <div className="divider md:divider-horizontal"></div>
                {carsQuery.isLoading ? <CarCardLoading /> : <CarCard car={carsQuery.data[1]} />}
                <div className="divider md:divider-horizontal"></div>
                {carsQuery.isLoading ? <CarCardLoading /> : <CarCard car={carsQuery.data[2]} />}
            </div>
        </div>

    )
}

export default DividedTopModels