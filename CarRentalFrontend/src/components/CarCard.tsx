import { useNavigate } from "react-router-dom"
import { Vehicle } from "../types"
import { useQueryClient } from "@tanstack/react-query"
import vehicleService from '../services/vehicle'

const CarCard = ({ car }: { car: Vehicle }) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient();

    const handleRent = async () => {
        try {
            await queryClient.fetchQuery({ queryKey: ['rentVehicle'], queryFn: () => vehicleService.getRentVehicle(car.brand, car.model, car.year) })
            navigate(`/rent?brand=${car.brand}&model=${car.model}&year=${car.year}`)
        } catch (error) {
            window.alert("All vehicles of selected model are reserved.\nPlease choose another vehicle.")
        }

    }
    return (
        <div className="card xs:card-side md:card card-compact lg:card-normal shadow-xl">
            <figure className="xs:max-md:w-1/2"><img src="https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg" alt="Shoes" /></figure>
            <div className="card-body sm:max-md:w-1/2">
                <h2 className="card-title">{`${car.brand} ${car.model} ${car.year} (${car.fuel})`}</h2>
                <ul>
                    <li><strong>Engine:</strong> {car.engine}</li>
                    <li><strong>Transmission:</strong> {car.transmittion}</li>
                    <li><strong>Fuel Efficiency:</strong> <br />{car.fuelEfficiencyCity}L / 100Km (City) <br /> {car.fuelEfficiencyHighway}L / 100Km (Highway)</li>
                    <li><strong>Seats</strong> {car.seats} passengers</li>
                    <li><strong>Price per Day:</strong> {car.rentPrice} €</li>
                    <li className="rating">
                        {Array.from({ length: car.rating }, (_, index) => (<input key={index} type="radio" className="mask mask-star-2 bg-yellow-400" readOnly />))}
                    </li>
                </ul>
                <div className="card-actions justify-end">
                    <button onClick={handleRent} className="btn btn-primary">Rent</button>
                </div>
            </div>
        </div>
    )
}

export default CarCard