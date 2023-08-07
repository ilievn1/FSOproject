import { useState } from 'react';
import Pagination from './Pagination';
import CarCard from './CarCard';
const data = [{
    id: 1,
    carImage: 'https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg',
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    transmittion: 'Manual',
    engine: '2.4 Litre 4 cylinder'
}, {
    id: 2,
    carImage: 'https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg',
    brand: 'Honda',
    model: 'Civic',
    year: 2018,
    transmittion: 'Manual',
    engine: '2.4 Litre 4 cylinder'
}, {
    id: 3,
    carImage: 'https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg',
    brand: 'Lexus',
    model: 'LFA',
    year: 2016,
    transmittion: 'Manual',
    engine: '2.4 Litre 4 cylinder'
}, {
    id: 4,
    carImage: 'https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg',
    brand: 'Cadillac',
    model: 'Escalade',
    year: 2017,
    transmittion: 'Manual',
    engine: '2.4 Litre 4 cylinder'
}
    , {
    id: 5,
    carImage: 'https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg',
    brand: 'Volkswaggen',
    model: 'Golf',
    year: 2003,
    transmittion: 'Manual',
    engine: '2.4 Litre 4 cylinder'
}
]
const Catalogue = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 3;

    const indexOfLastItem = currentPage * carsPerPage;
    const indexOfFirstItem = indexOfLastItem - carsPerPage;
    const displayedCars = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            {displayedCars.map((item) => (
                <CarCard key={item.id} />
            ))}
            <Pagination totalCars={data.length} carsPerPage={carsPerPage} changePage={paginate} />
        </>
    )
}

export default Catalogue