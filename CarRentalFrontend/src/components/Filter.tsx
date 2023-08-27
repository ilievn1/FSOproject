//./components/Filter.tsx

import { useRef, useState } from "react";
import classNames from "classnames";
import { Vehicle } from "../types";

type Props = {
    items: Array<Vehicle>;
    value: string;
    onChange(val: string): void;
};

const Filter = (props: Props) => {
    const { items, value, onChange } = props;
    const filterRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const brands = items.map(c => c.brand)
    const distinctBrands = [... new Set(brands)];

    // UI Component library keeps menu focused all the time, even if clicked
    // handleMenuClick closes upon clicked menu item
    const handleMenuClick = () => {
        const elem = document.activeElement;
        if (elem && elem instanceof HTMLElement) {
            elem.blur();
        }
    };

    return (
        <div
            className={classNames({
                "dropdown w-full flex place-content-center": true,
                "dropdown-open": open,
            })}
        >
            <input
                type="text"
                className="input input-bordered w-full md:w-1/3"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search brand..."
                ref={filterRef}

            />
            <div className="dropdown-content bg-base-200 top-14 max-h-96 overflow-auto flex-col rounded-md z-10">
                <ul
                    className="menu menu-compact "
                    onClick={handleMenuClick}
                    // width of menu to match width of parent
                    style={{ width: filterRef.current?.clientWidth }}
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
