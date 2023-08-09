import { useState } from 'react';
import { Car } from '../types';

const usePagination = (cars: Array<Car>, carsPerPage: number): {
    currentPage: number;
    paginate: (pageNumber: number) => void;
    previousPage: () => void;
    nextPage: () => void;
    getCurrentPageCars: () => Car[]
} => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const lastPage = Math.ceil(cars.length / carsPerPage);

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

    const getCurrentPageCars = () => {
        const indexOfLastItem = currentPage * carsPerPage;
        const indexOfFirstItem = indexOfLastItem - carsPerPage;
        const currentItems = cars.slice(indexOfFirstItem, indexOfLastItem);
        return currentItems;
    };

    return { currentPage, paginate, previousPage, nextPage, getCurrentPageCars };
};

export default usePagination;
