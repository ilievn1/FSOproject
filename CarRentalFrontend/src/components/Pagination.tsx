
interface Props {
    currentPage: number;
    carsPerPage: number;
    totalCars: number;
    changePage(val: number): void;
    previousPage(): void;
    nextPage(): void;

}

const Pagination = ({ currentPage, carsPerPage, totalCars, changePage, previousPage, nextPage }: Props) => {
    const allPageNumbers = [];
    
    const lastPage = Math.ceil(totalCars / carsPerPage);

    for (let i = 1; i <= lastPage; i++) {
        allPageNumbers.push(i);
    }

    let shownPageNumbers;

    if (allPageNumbers.length <= 2) {
        shownPageNumbers = allPageNumbers
    } else {
        if (currentPage === 1) {
            shownPageNumbers = allPageNumbers.slice(currentPage - 1, currentPage + 2);
        } else if (currentPage === lastPage) {
            shownPageNumbers = allPageNumbers.slice(currentPage - 3, currentPage);
        } else {
            shownPageNumbers = allPageNumbers.slice(currentPage - 2, currentPage + 1);
        }
    }
    return (

        <div className="pagination-container">
            <nav>
                <ul className="flex items-center -space-x-px h-8 text-sm">
                    <li onClick={previousPage} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        Prev
                    </li>
                    {shownPageNumbers.map((number) => (
                        <li key={number} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => changePage(number)}>
                            {number}
                        </li>
                    ))}
                    <li onClick={nextPage} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        Next
                    </li>
                </ul>
            </nav>

        </div>
    );
};

export default Pagination;