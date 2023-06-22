import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Exchange from "../pages/Exchange"
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ResetPassword from "../pages/Auth/ResetPassword";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import OTP from "../pages/Auth/OTP";
import VerificationView from '../pages/Auth/VerificationView'
import UpiDetail from "../pages/UpiDetail";

import Profile from '../pages/profile.jsx';
import ChangePassword from '../pages/Changepassword';
import KYC from '../pages/kycsettings.jsx';
import BankDetail from "../pages/BankDetail"
import Authentication from '../pages/2FA.jsx';
import Fees from '../pages/Fees.jsx';
import Activity from '../pages/ActivityLog.jsx';
// import TradingReport from '../pages/tradingreport.jsx';
import Support from '../pages/setting/SupportPage.jsx';
import ContactUs from '../pages/setting/ContactusPage.jsx';
import TicketList from '../pages/setting/TicketList.jsx';
import Referral from '../pages/setting/ReferralLink';
import TicketModal from '../pages/setting/TicketModal.jsx';

//Portfolio
import PortfolioPage from '../pages/PortfolioPage.jsx';
import DepositHistory from '../pages/DepositHistory.jsx';
import WithdrawHistory from '../pages/WithdrawHistory';
import Sidenavbar from "../components/Responsive/Sidenavbar";
import BuysellPage from "../pages/BuysellPage";
import WithdrawOtp from "../pages/WithdrawOtp";

//p2p routes
import P2pHome from "../pages/p2p/P2pHome";
import P2pChatPage from "../pages/p2p/P2pChatPage";

import P2pDashboard from "../pages/p2p/P2pDashboard";
import P2pMyWallet from "../pages/p2p/P2pMyWallet";
import P2pOrderHistory from "../pages/p2p/P2pOrderHistory";
export default function AppRoutes() {


    // Routes for Components
    const routes = [
        {
            name: "Home",
            path: "/",
            Component: Home,
        },
        {
            name: "BankDetail",
            path: "/bankdetail",
            Component: BankDetail,
        }, {
            name: "Exchange",
            path: "/exchange",
            Component: Exchange,
        },
          {
            name: "BuySell",
            path: "/BuySell",
            Component: BuysellPage,
        },
        {
            name: "Login",
            path: "/login",
            Component: Login,
        },

        {
            name: "Signup",
            path: "/signup",
            Component: Signup,
        },
        {
            name: "VerificationView",
            path: "/verifymail",
            Component: VerificationView,
        },
        {
            name: "ResetPassword",
            path: "/reset-password",
            Component: ResetPassword,
        },

        {
            name: "OTP",
            path: "/otp",
            Component: OTP,
        },

        {
            name: "ForgotPassword",
            path: "/forgotpassword",
            Component: ForgotPassword,
        },
        {
            name: "profile",
            path: "/profile",
            Component: Profile,
        },
        {
            name: "UpiDetail",
            path: "/Upi-detail",
            Component: UpiDetail,
        },
        {
            name: "ChangePassword",
            path: "/changepassword",
            Component: ChangePassword,
        },
        {
            name: "kyc",
            path: "/kyc",
            Component: KYC,
        },
        {
            name: "2fa",
            path: "/2fa",
            Component: Authentication,
        },
        {
            name: "fees",
            path: "/fees",
            Component: Fees,
        },
        {
            name: "activity",
            path: "/activitylog",
            Component: Activity,
        },
        // {
        //     name: "tradingreport",
        //     path: "/tradingreport",
        //     Component: TradingReport,
        // },
        {
            name: "support",
            path: "/support",
            Component: Support,
        },
        {
            name: "contactus",
            path: "/contactus",
            Component: ContactUs,
        },
        {
            name: "ticketlist",
            path: "/ticketlist",
            Component: TicketList,
        },
        {
            name: "referrallink",
            path: "/referrallink",
            Component: Referral,
        },
        {
            name: "ticketmodal",
            path: "/ticketmodal/:id",
            Component: TicketModal,
        },
        {
            name: 'PortfolioPage',
            path: '/portfolio',
            Component: PortfolioPage
        },
        {
            name: 'WithdrawHistory',
            path: '/withdraw-history',
            Component: WithdrawHistory
        },
        {
            name: 'DepositHistory',
            path: '/deposit-history',
            Component: DepositHistory
        },
        {
            name: 'Sidenavbar',
            path: '/sidenavbar',
            Component: Sidenavbar
        },
        {
            name: 'WithdrawOtp',
            path: '/Otp-withdraw',
            Component: WithdrawOtp
        },
        {
            name: 'BuySell',
            path: '/Buy-Sell',
            Component: BuysellPage
        },
        {
            name: 'P2pHome',
            path: '/p2p-home',
            Component: P2pHome
        },
        {
            name: 'P2pChatPage',
            path: '/p2p-chat',
            Component: P2pChatPage
        },
        {
            name: 'P2pDashboard',
            path: '/p2p',
            Component: P2pDashboard
        },
        {
            name: 'P2pMyWallet',
            path: '/p2p-mywallet',
            Component: P2pMyWallet
        },
        {
            name: 'P2pOrderHistory',
            path: '/p2p-order',
            Component: P2pOrderHistory
        },

    ];



    // ROUTES MAPING
    const Routing = routes.map(({ name, path, Component }, i) => (
        <Route key={i} path={path} element={<Component />} />
    )
    );

    return (
        <div className="">
            <Routes>
                {Routing}
            </Routes>
        </div>
    );
};