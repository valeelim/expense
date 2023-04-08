import React from "react";

import { IconContext } from "react-icons";
import { AiOutlineDollar } from "react-icons/ai";

import { Link } from "react-router-dom";
import { useCategoryImageContext, CategoryImageMapper } from "../contexts";

interface ExpenseCardProps {
    id: string;
    categoryName: string;
    expenseName: string;
    expenseCost: number;
}

const ExpenseCard = ({
    id,
    categoryName,
    expenseName,
    expenseCost,
}: ExpenseCardProps): JSX.Element => {
    const categoryImage: CategoryImageMapper = useCategoryImageContext();
    let categoryUrl: string =
        categoryImage[categoryName as keyof CategoryImageMapper];

    return (
        <Link to={`expenses/${id}`}>
            <div className="flex p-4 bg-white w-full rounded-lg hover:bg-gray-200 cursor-pointer">
                <div>
                    <img src={categoryUrl} alt="" />
                </div>
                <div className="ml-5 flex flex-col justify-center grow">
                    <div className="text-[16px]">{categoryName}</div>
                    <div className="text-[20px] font-semibold">
                        {expenseName}
                    </div>
                </div>
                <div className="flex items-center w-1/5">
                    <IconContext.Provider
                        value={{
                            className: "text-[#19A7CE] text-[35px]",
                        }}>
                        <AiOutlineDollar />
                    </IconContext.Provider>
                    <span className="ml-2 font-bold text-[20px] text-[#19A7CE]">
                        {expenseCost.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ExpenseCard;
