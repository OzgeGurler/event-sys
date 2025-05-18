import React, { createContext, useContext, useState, ReactNode } from "react";

type FilterContextType = {
    selectedCategory: string;
    setSelectedCategory: (cat: string) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    return (
        <FilterContext.Provider value={{ selectedCategory, setSelectedCategory }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    const ctx = useContext(FilterContext);
    if (!ctx) throw new Error("useFilter must be inside FilterProvider");
    return ctx;
};
