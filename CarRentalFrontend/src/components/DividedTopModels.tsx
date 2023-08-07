import CarCard from "./CarCard"

const DividedTopModels = () => {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Top 3 models</h1>
            <div className="flex flex-col w-full md:flex-row">
                <CarCard />
                <div className="divider md:divider-horizontal"></div>
                <CarCard />
                <div className="divider md:divider-horizontal"></div>
                <CarCard />
            </div>
        </div>

    )
}

export default DividedTopModels