import { Navigate, Route, Routes } from "react-router-dom";
import { AddTransactionPage } from "@/pages/AddTransaction/AddTransactionPage";
import { AnalysisPage } from "@/pages/Analysis/AnalysisPage";
import { CategoriesPage } from "@/pages/Categories/CategoriesPage";
import { HomePage } from "@/pages/Home/HomePage";
import { SettingsPage } from "@/pages/Settings/SettingsPage";
import { PageHeader } from "@/components/layout/PageHeader";
import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analysis" element={<AnalysisPage />} />
      <Route path="/add" element={<AddTransactionPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route
        path="/transactions"
        element={
          <>
            <PageHeader title="Transactions" />
            <PagePlaceholder title="Transactions Page" />
          </>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
