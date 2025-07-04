import { Routes, Route } from "react-router-dom";
import Playground from "./playground/UiKit";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserArea from "./pages/UserArea";
import Balance from "./pages/module_A/Balance";
import Transactions from "./pages/module_A/Transactions";
import Statistics from "./pages/module_A/Statistics";
import Budgets from "./pages/module_A/Budgets";
import MyPortfolio from "./pages/module_B/MyPortfolio";
import MarketStats from "./pages/module_B/MarketStats";
import FinanceNews from "./pages/module_B/FinanceNews";
import WikiFinance from "./pages/module_B/WikiFinance";
import LegalNotice from "./components/ui/legalNotice/LegalNotice";
import PrivacyPolicy from "./components/ui/privacyPolicy/PrivacyPolicy";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/dev" element={<Playground />} />
      <Route path="/user" element={<UserArea />} />
      <Route path="/personal/balance" element={<Balance />} />
      <Route path="/personal/transactions" element={<Transactions />} />
      <Route path="/personal/stats" element={<Statistics />} />
      <Route path="/personal/budget" element={<Budgets />} />
      <Route path="/finance/portfolio" element={<MyPortfolio />} />
      <Route path="/finance/market" element={<MarketStats />} />
      <Route path="/finance/news" element={<FinanceNews />} />
      <Route path="/finance/wiki" element={<WikiFinance />} />
      <Route path="/legal-notice" element={<LegalNotice />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
  );
}

export default App;
