import React, { useEffect, useState } from "react";
import ExpenseCard from "../components/ExpenseCard";
import axiosClient from "../services/axiosConfig";
import paginateStyle from "../assets/css/Paginate.module.css";

import { IconContext } from "react-icons";
import { AiOutlineDollar } from "react-icons/ai";

import ReactPaginate from "react-paginate";
import { Spinner } from "@chakra-ui/react";

import { useLocation, useNavigate } from "react-router-dom";
import FilterPanel from "../components/FilterPanel";

interface ExpenseData {
    id: string;
    name: string;
    amount: number;
    created_at: Date;
    category: {
        name: string;
    };
}

interface PaginationInfo {
    page: number;
    limit: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

function Home() {
    const location = useLocation();
    const navigate = useNavigate();

    const [expenses, setExpenses] = useState<ExpenseData[]>([]);
    const [totalExpense, setTotalExpense] = useState<number>(0);
    const [pageOffset, setPageOffset] = useState<number>(1);
    const [pagination, setPagination] = useState<PaginationInfo>();
    const [isFetched, setIsFetched] = useState<boolean>(false);

    const handleCheckboxChange = (values: string[]): void => {
        const queryParams = new URLSearchParams(location.search);
        values.length
            ? queryParams.set("category_id", values.join(","))
            : queryParams.delete("category_id");
        navigate(`?${queryParams.toString()}`);
    };

    const handleRangeChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const queryParams = new URLSearchParams(location.search);
        const { name, value } = event.target;
        value
            ? queryParams.set(`${name}`, value)
            : queryParams.delete(`${name}`);
        navigate(`?${queryParams.toString()}`);
    };

    const handlePageChange = async (data: { selected: number }) => {
        if (!pagination) return;
        setPageOffset(data.selected + 1);
    };

    useEffect(() => {
        const fetchExpenses = async (pageNumber: number | null = null) => {
            const queryParams = new URLSearchParams(location.search);
            const expensesDataAndPaging = await axiosClient
                .get("/expenses", {
                    params: {
                        page: pageNumber,
                        min_price: queryParams.get("min_price"),
                        max_price: queryParams.get("max_price"),
                        category_id: queryParams.get("category_id"),
                    },
                })
                .then((res) => {
                    return res.data;
                })
                .catch((err) => {
                    console.log("Soehtng went wrong");
                });
            
            if (!expensesDataAndPaging) return;

            const allExpenses = expensesDataAndPaging.data;
            const result: ExpenseData[] = [];

            for await (const expense of allExpenses) {
                const expenseName = await axiosClient
                    .get(`/expenses/${expense.id}`)
                    .then((res) => res.data.name);
                result.push({
                    ...expense,
                    name: expenseName,
                });
            }

            setIsFetched(true);
            setPagination(expensesDataAndPaging.paging);
            setExpenses(result);
        };

        const fetchTotal = async () => {
            return axiosClient.get("/expenses/total").then((res) => {
                setTotalExpense(parseInt(res.data.total));
            });
        };

        setIsFetched(false);

        fetchExpenses(pageOffset);
        fetchTotal();
    }, [pageOffset, location]);

    return (
        <div className="h-screen w-screen grid grid-cols-3 m-0 px-[200px] gap-x-6 pt-10">
            <div className="col-span-2">
                <div className="h-[90vh]">
                    {isFetched ? (
                        <div className="flex flex-col gap-2">
                            {expenses.map((expense: ExpenseData, idx) => (
                                <div key={idx}>
                                    <ExpenseCard
                                        id={expense.id}
                                        categoryName={expense.category.name}
                                        expenseCost={expense.amount}
                                        expenseName={expense.name}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full justify-center items-center">
                            <Spinner
                                boxSize={100}
                                color="white"
                                speed=".8s"
                                thickness="4px"
                            />
                        </div>
                    )}
                </div>
                {pagination ? (
                    <div className={`mt-4 ${paginateStyle.pagination}`}>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={handlePageChange}
                            pageRangeDisplayed={2}
                            pageCount={pagination?.pageCount ?? 0}
                            previousLabel="<"
                            activeClassName={paginateStyle.selected}
                            disabledClassName={paginateStyle.disabled}
                            containerClassName={"pagination"}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <div className="col-span-1 h-[90vh] flex flex-col gap-2">
                <div className="flex flex-col bg-white rounded-lg p-7">
                    <p className="font-bold text-[24px] mb-3">
                        Current Expenses
                    </p>
                    <div className="flex items-center">
                        <IconContext.Provider
                            value={{
                                className: "text-[#19A7CE] text-[40px]",
                            }}>
                            <AiOutlineDollar />
                        </IconContext.Provider>
                        <span className="ml-2 font-bold text-[24px] text-[#19A7CE]">
                            {totalExpense.toLocaleString("de-DE", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                </div>
                <div className="flex grow">
                    <FilterPanel
                        handleCheckboxChange={handleCheckboxChange}
                        handleRangeChange={handleRangeChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;
