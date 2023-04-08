import React, { useEffect, useState } from "react";
import axiosClient from "../services/axiosConfig";
import moment from "moment";

import { useNavigate, useParams, useLocation } from "react-router-dom";

import { IconContext } from "react-icons";
import { IoArrowBackSharp } from "react-icons/io5";
import { AiOutlineDollar } from "react-icons/ai";
import { Spinner } from "@chakra-ui/react";

import { useCategoryImageContext, CategoryImageMapper } from "../contexts";

interface ExpenseData {
    id: string;
    name: string;
    amount: number;
    description: string;
    created_at: Date;
    category: {
        name: string;
    };
}

const ExpenseDetail = (): JSX.Element => {
    const categoryImage: CategoryImageMapper = useCategoryImageContext();
    const navigate = useNavigate();
    const location = useLocation();
    const { slug } = useParams();
    moment.locale("id");

    const [categoryImageUrl, setCategoryImageUrl] = useState<string>();
    const [isFetched, setIsFetched] = useState<boolean>(false);
    const [expense, setExpense] = useState<ExpenseData>();

    useEffect(() => {
        axiosClient
            .get(`/expenses/${slug}`)
            .then((res) => {
                const categoryName = res.data.category.name;
                setCategoryImageUrl(
                    categoryImage[categoryName as keyof CategoryImageMapper],
                );
                setIsFetched(true);
                setExpense(res.data);
            })
            .catch((err) => {});
    }, [slug, categoryImage]);

    const navigateBack = () => {
        location.key !== "default" ? navigate(-1) : navigate("/");
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <div
                className="w-full flex justify-start items-center text-[32px] font-bold pb-5 pl-12 text-white hover:text-gray-300 cursor-pointer"
                onClick={navigateBack}>
                <IconContext.Provider
                    value={{ className: "inline-block outline-2" }}>
                    <IoArrowBackSharp />
                </IconContext.Provider>
                <span className="pl-1">Back</span>
            </div>
            <div className="h-[625px] w-[650px] bg-white rounded-lg pt-12 px-12 overflow-y-scroll">
                {isFetched ? (
                    <div className="flex flex-col h-full w-full divide-y divide-black">
                        <div className="flex items-center pb-7">
                            <div>
                                <img src={categoryImageUrl} alt="" />
                            </div>
                            <div className="ml-2 text-[16px] flex grow">
                                {expense?.name}
                            </div>
                            <div className="flex items-center w-1/4">
                                <IconContext.Provider
                                    value={{
                                        className: "text-[#19A7CE] text-[30px]",
                                    }}>
                                    <AiOutlineDollar />
                                </IconContext.Provider>
                                <span className="ml-2 font-bold text-[16px] text-[#19A7CE]">
                                    {expense?.amount.toLocaleString("de-DE", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col py-7 justify-around gap-7">
                            <div className="font-semibold text-[16px]">
                                Transaction Details
                            </div>
                            <div className="flex justify-between text-[14px]">
                                <p>ID</p>
                                <p className="font-bold">{expense?.id}</p>
                            </div>
                            <div className="flex justify-between text-[14px]">
                                <p>Type</p>
                                <p className="font-bold">
                                    {expense?.category.name}
                                </p>
                            </div>
                            <div className="flex justify-between text-[14px]">
                                <p>Time</p>
                                <p className="font-bold">
                                    {moment(expense?.created_at).format(
                                        "DD MMM YYYY, HH:mm [WIB]",
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="pt-7 pb-12">
                            <p className="pb-3 font-semibold">Notes</p>
                            <p className="text-[14px]">
                                {expense?.description}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full justify-center items-center">
                        <Spinner
                            boxSize={100}
                            color="blue"
                            speed=".8s"
                            thickness="3px"
                        />
                    </div>
                )}
            </div>
            {/* <IoArrowBackSharp /> */}
        </div>
    );
};

export default ExpenseDetail;
