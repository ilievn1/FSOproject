import { data } from "../mockData/cars"
import CarCard from "./CarCard"

//TODO: Show 3 most popular cars (i.e. by top 3 by rating)
const DividedTopModels = () => {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Top 3 models</h1>
            <div className="flex flex-col w-full md:flex-row">
                <CarCard car={data[0]} />
                <div className="divider md:divider-horizontal"></div>
                <CarCard car={data[0]} />
                <div className="divider md:divider-horizontal"></div>
                <CarCard car={data[0]} />
            </div>
        </div>

    )
}

export default DividedTopModels