import React, { createContext, useContext, useState } from "react";

const PlanContext = createContext<any>(null);

export const PlanProvider = ({ children }: any) => {
  const [planData, setPlanData] = useState({
    date: null,
    timeRange: [9, 12], // örnek: sabah 9 - 12
    concept: null,
    budget: null,
    brief: "",
  });

  return (
    <PlanContext.Provider value={{ planData, setPlanData }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
