import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Home from "./pages/Home";
import PropertyDetail from "./pages/PropertyDetail";
import Browse from "./pages/Browse";
import DecisionQuiz from "./pages/DecisionQuiz";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import UserAccount from "./pages/UserAccount";
import LandlordProfile from "./pages/LandlordProfile";
import LandlordDashboard from "./pages/LandlordDashboard";
import ListingSubmission from "./pages/ListingSubmission";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Neighbourhood from "./pages/Neighbourhood";
import UpgradeSubscription from "./pages/UpgradeSubscription";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
{
path: "/",
Component: Root,
children: [
{ index: true,              Component: Home },
{ path: "browse",           Component: Browse },
{ path: "quiz",             Component: DecisionQuiz },
{ path: "area/:areaName",   Component: Neighbourhood },
{ path: "property/:id",     Component: PropertyDetail },
{ path: "landlord/:id",     Component: LandlordProfile },
{ path: "about",            Component: About },
{ path: "auth",             Component: Auth },
{ path: "forgot-password",  Component: ForgotPassword },
{ path: "upgrade",          Component: UpgradeSubscription },
{ path: "*",                Component: NotFound },

{
path: "account",
Component: () => (
<ProtectedRoute allowedRoles={["renter"]}>
<UserAccount />
</ProtectedRoute>
),
},

{
path: "dashboard",
Component: () => (
<ProtectedRoute allowedRoles={["landlord"]}>
<LandlordDashboard />
</ProtectedRoute>
),
},
{
path: "submit",
Component: () => (
<ProtectedRoute allowedRoles={["landlord"]}>
<ListingSubmission />
</ProtectedRoute>
),
},

{
path: "admin",
Component: () => (
<ProtectedRoute allowedRoles={["administrator"]}>
<AdminDashboard />
</ProtectedRoute>
),
},
],
},
]);
