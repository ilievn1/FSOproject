import classNames from 'classnames';
import CarCard from './CarCard';

type Props = {
    displayedCars: Array<{
        id: number;
        carImage: string;
        brand: string;
        model: string;
        year: number;
        transmittion: string;
        engine: string;
    }>;
};

const Catalogue = ({ displayedCars }: Props) => {

    return (
        <>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                {displayedCars.map((item, index) => {
                    const gridRowClass = classNames({
                        'flex flex-col w-full mb-4': true,
                        // Add margin-bottom to cards except the last in a row
                        ' md:mb-0': (index + 1) % 3 !== 0 ? true : false 
                    });
                    return (
                        <div key={item.id} className={gridRowClass}>
                            <CarCard />
                        </div>
                    )
                })}
            </div> */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 grid-rows-3">
                {displayedCars.map((item, index) => (
                    <div key={item.id}>
                        <CarCard />
                        {(index + 1) % 3 !== 0 && <div className="divider md:divider-vertical">O</div>}
                    </div>  
                ))}
                </div>
                
        </>
    )
}

export default Catalogue