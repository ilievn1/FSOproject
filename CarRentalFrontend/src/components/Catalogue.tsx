import { Car } from '../types';
import CarCard from './CarCard';

type Props = {
    displayedCars: Array<Car>;
};

const Catalogue = ({ displayedCars }: Props) => {

    return (
        <>
            <div className="grid grid-cols-1 p-4 md:grid-cols-11 md:place-items-center md:gap-y-8">
                {displayedCars.map((item, index) => (
                    <>
                        <div key={item.id} className='col-span-3'><CarCard car={item} /></div>
                        <div key={index*100} className={`divider md:divider-horizontal ${(index + 1) % 3 !== 0 ? 'md:col-span-1' : 'md:hidden'}`}></div>
                    </>
                ))}
            </div>
        </>
    )
}

export default Catalogue