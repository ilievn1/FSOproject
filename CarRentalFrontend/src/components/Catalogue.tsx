import { Fragment } from 'react';
import { Car } from '../types';
import CarCard from './CarCard';

type Props = {
    displayedCars: Array<Car>;
};

const Catalogue = ({ displayedCars }: Props) => {

    return (
        <>
            <div key={999} className="grid grid-cols-1 p-4 md:grid-cols-11 md:place-items-center md:gap-y-8">
                {displayedCars.map((item, index) => (
                    <Fragment key={item.id}>
                        <div className='col-span-3'>
                            <CarCard car={item} />
                        </div>
                        <div className={`divider md:divider-horizontal ${(index + 1) % 3 !== 0 ? 'md:col-span-1' : 'md:hidden'}`}></div>
                    </Fragment>
                ))}
            </div>
        </>
    )
}

export default Catalogue