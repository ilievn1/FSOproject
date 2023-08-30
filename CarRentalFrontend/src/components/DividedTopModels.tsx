import CarCard from "./CarCard"
import CarCardLoading from "./CarCardLoading";
import { useQuery } from "@tanstack/react-query";
import vehicleService from '../services/vehicle'
import { Vehicle } from "../types";

const DividedTopModels = () => {
    const carsQuery = useQuery(['topThreeVehicles'], vehicleService.getTopThreeVehicles)
    
    if (carsQuery.isError) {
        <p>Error fetching top models.</p>
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4 text-center">Top 3 models</h1>
            <div className="flex flex-col w-full md:flex-row">
                {carsQuery.isLoading ? <CarCardLoading /> : <CarCard car={carsQuery.data?.at(0) as Vehicle} />}
                <div className="divider md:divider-horizontal"></div>
                {carsQuery.isLoading ? <CarCardLoading /> : <CarCard car={carsQuery.data?.at(1) as Vehicle} />}
                <div className="divider md:divider-horizontal"></div>
                {carsQuery.isLoading ? <CarCardLoading /> : <CarCard car={carsQuery.data?.at(2) as Vehicle} />}
            </div>
        </div>

    )
}

export default DividedTopModels