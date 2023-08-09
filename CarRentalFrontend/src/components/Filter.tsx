//./components/Filter.tsx

import { useRef, useState } from "react";
import classNames from "classnames";
import { Car } from "../types";

type Props = {
    items: Array<Car>;
    value: string;
    onChange(val: string): void;
};

const Filter = (props: Props) => {
    const { items, value, onChange } = props;
    const ref = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const brands = items.map(c => c.brand)
    const distinctBrands = [... new Set(brands)];

    return (
        <div
            className={classNames({
                "dropdown w-full flex place-content-center": true,
                "dropdown-open": open,
            })}
        >
            <input
                type="text"
                className="input input-bordered w-1/3"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search brand..."
                ref={ref}

            />
            <div className="dropdown-content bg-base-200 top-14 max-h-96 overflow-auto flex-col rounded-md z-10">
                <ul
                    className="menu menu-compact "
                    // width of menu to match width of parent
                    style={{ width: ref.current?.clientWidth }}
                >
                    {distinctBrands.map((item) => {
                        return (
                            <li
                                key={item}
                                onClick={() => {
                                    onChange(item);
                                    setOpen(false);
                                }}
                                className="border-b border-b-base-content/10 w-full"
                            >
                                <button>{item}</button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Filter;
