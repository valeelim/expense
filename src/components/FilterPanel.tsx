import { useEffect, useState } from "react";

import {
    Checkbox,
    CheckboxGroup,
    Input,
    InputGroup,
    InputLeftElement,
} from "@chakra-ui/react";

import { IconContext } from "react-icons";
import { HiOutlineFilter } from "react-icons/hi";
import { AiOutlineDollar } from "react-icons/ai";

import axiosClient from "../services/axiosConfig";
import { useLocation } from "react-router-dom";
import { useCategoryImageContext, CategoryImageMapper } from "../contexts";

interface Props {
    handleCheckboxChange: (x: string[]) => void;
    handleRangeChange: (x: React.ChangeEvent<HTMLInputElement>) => void;
}

interface CategoryData {
    id: string;
    name: string;
}

const FilterPanel = ({
    handleCheckboxChange,
    handleRangeChange,
}: Props): JSX.Element => {
    const location = useLocation();
    const categoryImage: CategoryImageMapper = useCategoryImageContext();

    const [selectedOptions, setSelectedOptions] = useState<string[]>();
    const [categories, setCategories] = useState<CategoryData[]>();
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(0);
    // const [isFetched, setIsFetched] = useState<boolean>(false);

    useEffect(() => {
        const fetchCategories = async () => {
            return axiosClient.get("/expenses/category").then((res) => {
                setCategories(res.data);
            });
        };
        const queryParams = new URLSearchParams(location.search);
        setSelectedOptions(queryParams.get("category_id")?.split(","));
        setMinPrice(parseInt(queryParams?.get("min_price") ?? ""));
        setMaxPrice(parseInt(queryParams?.get("max_price") ?? ""));
        fetchCategories();
    }, [location]);

    return (
        <div className="flex flex-col bg-white rounded-md p-7 h-full w-full">
            <div>
                <IconContext.Provider
                    value={{
                        className: "text-[50px] stroke-1 inline-block",
                    }}>
                    <HiOutlineFilter />
                </IconContext.Provider>
                <span className="font-bold pl-4 text-[24px]">Filters</span>
            </div>
            <div className="flex flex-col mt-5">
                <p className="font-bold text-[16px] mb-5">
                    Filter by Transaction Category
                </p>
                <CheckboxGroup
                    onChange={handleCheckboxChange}
                    value={selectedOptions}>
                    <div className="flex flex-col gap-3">
                        {categories?.length ? (
                            categories.map((category, idx) => (
                                <Checkbox value={category.id} key={idx}>
                                    <img
                                        className="w-[22px] aspect-square inline-block"
                                        src={
                                            categoryImage[
                                                category.name as keyof CategoryImageMapper
                                            ]
                                        }
                                        alt=""
                                    />
                                    <span className="font-semibold pl-3">
                                        {category.name}
                                    </span>
                                </Checkbox>
                            ))
                        ) : (
                            <></>
                        )}
                    </div>
                </CheckboxGroup>
            </div>
            <hr className="my-5 border-t-[1px] border-black" />
            <div className="flex flex-col">
                <p className="font-bold text-[16px] mb-5">
                    Filter by Expenses Range
                </p>
                <div className="flex flex-col w-full">
                    <div className="flex w-full">
                        <span className="italic font-semibold text-[14px] mb-1 w-1/3 text-center">
                            Min
                        </span>
                        <span className="w-1/3"></span>
                        <span className="italic font-semibold text-[14px] mb-1 w-1/3 text-center">
                            Max
                        </span>
                    </div>
                    <div className="flex w-full">
                        <div className="flex w-1/3 items-center px-2">
                            <div>
                                <IconContext.Provider
                                    value={{ className: "text-[25px]" }}>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<AiOutlineDollar />}
                                        />
                                        <Input
                                            isInvalid={minPrice > maxPrice}
                                            type="number"
                                            value={
                                                isNaN(minPrice)
                                                    ? ""
                                                    : minPrice.toString()
                                            }
                                            errorBorderColor="red.300"
                                            name="min_price"
                                            outline="1px solid black"
                                            borderRadius={8}
                                            onInput={handleRangeChange}
                                        />
                                    </InputGroup>
                                </IconContext.Provider>
                            </div>
                        </div>
                        <div className="flex w-1/3 items-center px-2">
                            <hr className="border-t-[1px] border-black w-full" />
                        </div>
                        <div className="flex flex-col w-1/3 items-center px-2">
                            <div>
                                <IconContext.Provider
                                    value={{ className: "text-[25px]" }}>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<AiOutlineDollar />}
                                        />
                                        <Input
                                            isInvalid={maxPrice < minPrice}
                                            type="number"
                                            value={
                                                isNaN(maxPrice)
                                                    ? ""
                                                    : maxPrice.toString()
                                            }
                                            name="max_price"
                                            outline="1px solid black"
                                            errorBorderColor="red.300"
                                            borderRadius={8}
                                            onInput={handleRangeChange}
                                        />
                                    </InputGroup>
                                </IconContext.Provider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
