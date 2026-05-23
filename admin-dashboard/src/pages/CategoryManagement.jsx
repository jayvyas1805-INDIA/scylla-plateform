import React, { useState } from "react";
import CategoryHeader from "../components/category/CategoryHeader";
import CategoryTabs from "../components/category/CategoryTabs";
import VendorTypeSection from "../components/category/VendorTypeSection";
import CompanyTypeSection from "../components/category/CompanyTypeSection";
import VendorNatureSection from "../components/category/VendorNatureSection";
import VehicleClassesSection from "../components/category/VehicleClassesSection";
import MotorsportDisciplinesSection from "../components/category/MotorsportDisciplinesSection";

const CategoryManagement = () => {
  const [activeTab, setActiveTab] = useState("vendor-categories");

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 space-y-6">
      <CategoryHeader />
      <CategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="grid grid-cols-1 gap-6">
        {activeTab === "vendor-categories" && (
          <>
            <VendorTypeSection />
            <CompanyTypeSection />
            <VendorNatureSection />
          </>
        )}
        {activeTab === "vehicle-classes" && <VehicleClassesSection />}
        {activeTab === "motorsport-disciplines" && <MotorsportDisciplinesSection />}
      </div>
    </div>
  );
};

export default CategoryManagement;
