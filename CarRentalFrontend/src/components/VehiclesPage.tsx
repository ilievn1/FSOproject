import { useEffect, useState } from "react";
import Catalogue from "./Catalogue"
import Filter from "./Filter"
import { data } from "../mockData/cars";
import Pagination from "./Pagination";
import { Car } from "../types";
import usePagination from "../hooks/usePagination";
import Parallax from "./Parallax";
import { useLocation } from 'react-router-dom';

import Breadcrumbs from "./Breadcrumbs";
import CarCardLoading from "./CarCardLoading";


// const VehiclesPage = () => {
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [filterQuery, setFilterQuery] = useState<string>('');
//     const [filteredCars, setFilteredCars] = useState<Array<Car>>(data);

//     const carsPerPage = 9;
//     useEffect(() => {
//         setFilteredCars(data.filter(c => c.brand.toLowerCase().includes(filterQuery.toLowerCase())))
//         setCurrentPage(1)
//     }, [filterQuery])


//     const indexOfLastItem = currentPage * carsPerPage;
//     const indexOfFirstItem = indexOfLastItem - carsPerPage;

//     // refers to cars on current page    
//     const displayedCars = filteredCars.slice(indexOfFirstItem, indexOfLastItem);
//     const lastPage = Math.ceil(filteredCars.length / carsPerPage);


//     // Event handlers
//     const paginate = (pageNumber: number) => {
//         setCurrentPage(pageNumber);
//     };

//     const previousPage = () => {
//         if (currentPage !== 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     const nextPage = () => {
//         if (currentPage !== lastPage) {
//             setCurrentPage(currentPage + 1);
//         }
//     };
//     return (
//         <div>
//             <Filter items={filteredCars} value={filterQuery} onChange={setFilterQuery} />
//             <Catalogue displayedCars={displayedCars} />
//             <Pagination
//                 totalCars={filteredCars.length}
//                 carsPerPage={carsPerPage}
//                 currentPage={currentPage}
//                 changePage={paginate}
//                 previousPage={previousPage}
//                 nextPage={nextPage}
//             />
//         </div>
//     )
// }
const VehiclesPage = () => {

    const { pathname } = useLocation();

    const [filterQuery, setFilterQuery] = useState<string>('');
    const [filteredCars, setFilteredCars] = useState<Array<Car>>(data);
    const carsPerPage = 9;
    const isLoading = true;
    const { currentPage, paginate, previousPage, nextPage, getCurrentPageCars } = usePagination(filteredCars, carsPerPage)

    useEffect(() => {
        //
        setFilteredCars(data.filter(c => c.brand.toLowerCase().includes(filterQuery.toLowerCase())))
        // reset page numbers according to filtered results
        paginate(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterQuery])

    const displayedCars = getCurrentPageCars()

    return (
        <>
            <Breadcrumbs route={pathname} />
            <Parallax />
            <Filter items={filteredCars} value={filterQuery} onChange={setFilterQuery} />
            {isLoading
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