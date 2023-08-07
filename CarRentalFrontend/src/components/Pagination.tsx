
interface Props {
    carsPerPage: number;
    totalCars: number;
    changePage(val: number): void;

}

const Pagination = ({ carsPerPage, totalCars, changePage }: Props) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalCars / carsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination-container">
            <ul className="pagination">
                {pageNumbers.map((number) => (
                    <li key={number} className="page-number" onClick={() => changePage(number)}>
                        {number}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Pagination;