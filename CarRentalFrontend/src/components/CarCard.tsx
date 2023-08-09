import { Car } from "../types"

const CarCard = ({car}:{car: Car}) => {
    return (
        <div className="card xs:card-side md:card card-compact lg:card-normal bg-base-100 shadow-xl">
            <figure className="xs:max-md:w-1/2"><img src="https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg" alt="Shoes" /></figure>
            <div className="card-body sm:max-md:w-1/2">
                <h2 className="card-title">{`${car.brand} ${car.model} ${car.year} (${car.fuel})`}</h2>
                <ul>
                    <li><strong>Engine:</strong> {car.engine}</li>
                    <li><strong>Transmission:</strong> {car.transmittion}</li>
                    <li><strong>Fuel Efficiency:</strong> <br />{car.fuelEfficiencyCity}L / 100Km (City) <br/> {car.fuelEfficiencyHighway} L / 100Km (Highway)</li>
                    <li><strong>Seats</strong> {car.seats} passengers</li>

                    <li><strong>Price per Day:</strong> {car.rentPrice} €</li>
                </ul>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                </div>
            </div>
        </div>
    )
}

export default CarCard