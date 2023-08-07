const CarCard = () => {
    return (
        <div className="card xs:card-side md:card card-compact lg:card-normal bg-base-100 shadow-xl">
            <figure className="xs:max-md:w-1/2"><img src="https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg" alt="Shoes" /></figure>
            <div className="card-body sm:max-md:w-1/2">
                <h2 className="card-title">Brand/Model (Diesel)</h2>
                <ul>
                    <li><strong>Engine:</strong> Litres cylinders</li>
                    <li><strong>Transmission:</strong> Manual/Automatic</li>
                    <li><strong>Fuel Efficiency:</strong> xx Kph (City) / xx Kph (Highway)</li>
                    <li><strong>Seats</strong> x passengers</li>

                    <li><strong>Price per Day:</strong> x €</li>
                </ul>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                </div>
            </div>
        </div>
    )
}

export default CarCard