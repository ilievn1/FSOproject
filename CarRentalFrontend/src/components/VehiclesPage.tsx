import { useEffect, useState } from "react";
import Catalogue from "./Catalogue"
import Filter from "./Filter"
import Pagination from "./Pagination";
import { Vehicle } from "../types";
import usePagination from "../hooks/usePagination";
import Parallax from "./Parallax";
import { useLocation } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";
import CarCardLoading from "./CarCardLoading";
import { useQuery } from "@tanstack/react-query";
import vehicleService from '../services/vehicle'

const VehiclesPage = () => {

    const { pathname } = useLocation();
    const carsQuery = useQuery(['cars'], vehicleService.getAll)

    const [filterQuery, setFilterQuery] = useState<string>('');
    const [filteredCars, setFilteredCars] = useState<Array<Vehicle>>([]);
    const carsPerPage = 9;

    const { currentPage, paginate, previousPage, nextPage, getCurrentPageCars } = usePagination(filteredCars, carsPerPage);

    useEffect(() => {
        const cars = carsQuery.isSuccess
            ? carsQuery.data.filter((c: Vehicle) => c.brand.toLowerCase().includes(filterQuery.toLowerCase()))
            : []
        setFilteredCars(cars)

        // reset page numbers according to filtered results
        paginate(1)
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [carsQuery.data, filterQuery])
    
    const displayedCars = getCurrentPageCars()

    return (
        <>
            <Breadcrumbs route={pathname} />
            <Parallax />
            <Filter items={filteredCars} value={filterQuery} onChange={setFilterQuery} />
            {carsQuery.isLoading
                ? (<CarCardLoading/>)
                : (<Catalogue displayedCars={displayedCars} />)}
            <Pagination
                totalCars={filteredCars.length}
                carsPerPage={carsPerPage}
                currentPage={currentPage}
                changePage={paginate}
                previousPage={previousPage}
                nextPage={nextPage}
            />
        </>
    )
}

export default VehiclesPage