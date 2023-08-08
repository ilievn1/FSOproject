import { useState } from "react";
import Catalogue from "./Catalogue"
import Filter from "./Filter"
import { data } from "../mockData/cars";
import Pagination from "./Pagination";

// TODO: possibly extract Pagination to separate custom hook

const VehiclesPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterQuery, setFilterQuery] = useState('');
    
    // Pagination consts
    const carsPerPage = 9;
    const lastPage = Math.ceil(data.length / carsPerPage);

    const indexOfLastItem = currentPage * carsPerPage;
    const indexOfFirstItem = indexOfLastItem - carsPerPage;

    const filteredCars = filterQuery === '' ? data : data.filter(c => c.brand === filterQuery)
    const displayedCars = filteredCars.slice(indexOfFirstItem, indexOfLastItem);

    // Event handlers
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const previousPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage !== lastPage) {
            setCurrentPage(currentPage + 1);
        }
    };
    return (
        <div>
            <Filter items={data} value={filterQuery} onChange={setFilterQuery} />
            <Catalogue displayedCars={displayedCars}/>
            <Pagination
                totalCars={data.length}
                carsPerPage={carsPerPage}
                currentPage={currentPage}
                changePage={paginate}
                previousPage={previousPage}
                nextPage={nextPage}
            />
        </div>
    )
}

export default VehiclesPage