import { useNavigate } from "react-router-dom"
import { Vehicle } from "../types"
import axios from "axios"

const CarCard = ({ car }: { car: Vehicle }) => {
    const navigate = useNavigate()

    const handleRent = async () => {
        
        const getVehicle = async (): Promise<Vehicle | undefined > => {
            const resp = await axios.get(`http://localhost:3001/api/vehicles?brand=${car.brand}&model=${car.model}&year=${car.year}`, { withCredentials: true });
            if (resp.status===404) {
                return undefined
            }
            return resp.data
        }

        const isAvailable = await getVehicle();
        if (isAvailable) {
            navigate(`/rent?brand=${car.brand}&model=${car.model}&year=${car.year}`)
        } else {
            alert("All cars of this model are already rented");
        }
    }
    return (
        <div className="card xs:card-side md:card card-compact lg:card-normal bg-base-100 shadow-xl">
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