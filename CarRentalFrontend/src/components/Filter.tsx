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
    const ref = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const brands = items.map(c => c.brand)
    const distinctBrands = [... new Set(brands)];

    return (
        <div
            className={classNames({
                "dropdown w-full": true,
                "dropdown-open": open,
            })}
            ref={ref}
        >
            <input
                type="text"
                className="input input-bordered w-full"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search brand..."
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
