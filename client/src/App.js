import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "pages/layout";
import Dashboard from "pages/dashboard";
import Profits from "pages/profits";
import Products from "pages/products";
import Customers from "pages/customers";
import Transactions from "pages/transactions";
import Geography from "pages/geography";
import Overview from "pages/overview";
import Daily from "pages/daily";
import Monthly from "pages/monthly";
import Breakdown from "pages/breakdown";
import Admin from "pages/admin";
import Performance from "pages/performance";
import Kyc from "pages/kyc";
import FiatDeposit from "pages/Fiat-deposit";
import FiatWithdrawalAction from "pages/fiat-withdrawal";
import EmailBroadcast from "pages/email-broadcast";
import { Login } from "pages/login";
import MerchantManagement from "pages/merchant";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
              <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profits" element={<Profits />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/email-broadcast" element={<EmailBroadcast />} />
              <Route path="/kyc" element={<Kyc />} />
              <Route path="/fiat-deposit" element={<FiatDeposit />} />
              <Route path="/fiat-withdrawal" element={<FiatWithdrawalAction />} />
              <Route path="/merchants" element={<MerchantManagement />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/performance" element={<Performance />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
