import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/authentication/ProtectedRoute";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Navbar from "../components/layouts/Navbar";
import Group from "../pages/Group";
import User from "../pages/User";
import Task from "../pages/Task";
import Target from "../pages/Target";
import EnrollmentRequestForm from "../pages/EnrollmentRequestForm";
import FilterGroups from "../pages/FilterGroups";
import EmployeeProfile from "../pages/EmployeeProfile";
import Staff from "../pages/Staff";
import Employee from "../pages/Employee";
import WeekGroup from "../pages/WeekGroup";
import Enroll from "../pages/Enroll";
import Loan from "../pages/Loan";
import Pigme from "../pages/Pigme";
import Auction from "../pages/Auction";
import Payment from "../pages/Payment";
import CollectionArea from "../pages/CollectionArea";
import Agent from "../pages/Agent";
import Lead from "../pages/Lead";
import LeadSetting from "../pages/LeadSetting";
import AppSettings from "../pages/AppSettings";
import GroupSettings from "../pages/GroupSettings";
import AdministrativePrivileges from "../pages/AdministrativePrivileges";
import AdminAccessRights from "../pages/AdminAccessRights";
import Marketing from "../pages/Marketing";
import Profile from "../pages/Profile";
import Daybook from "../pages/Daybook";
import SalesReport from "../pages/SalesReport";
import Receipt from "../pages/Receipt";
import GroupReport from "../pages/GroupReport";
import AllGroupReport from "../pages/AllGroupReport";
import AuctionReport from "../pages/AuctionReport";
import LeadReport from "../pages/LeadReport";
import UserReport from "../pages/UserReport";
import AllUserReport from "../pages/AllUserReport";
import LoanReport from "../pages/LoanReport";
import PigmeReport from "../pages/PigmeReport";
import EmployeeReport from "../pages/EmployeeReport";
import CommissionReport from "../pages/CommissionReport";
import EnrollmentReport from "../pages/EnrollmentReport";
import PaymentSummary from "../pages/PaymentSummary";
import WhatsappAdd from "../pages/WhatsappAdd";
import WhatsappFailed from "../pages/WhatsappFailed";
import DueMessage from "../pages/DueMessage";
import Reports from "../pages/Reports";
import LeadSettings from "../pages/LeadSettings";
import Designation from "../pages/Designation";
import PayOutMenu from "../pages/PayOutMenu";
import GeneralPaymentOut from "../pages/GeneralPaymentOut";
import Print from "../pages/Print";
import PayOutCommission from "../pages/PayOutCommission";
import PayOutPettyCash from "../pages/PayOutPettyCash";
import PayOutSalary from "../pages/PayOutSalary";
import PayOutReport from "../pages/PayoutReport";
import ErrorPage from "./error/ErrorPage";
import Guarantor from "../pages/Guarantor";
import DreamAsset from "../pages/DreamAsset";
import BecomeAgent from "../pages/BecomeAgent";
import PayOutOthers from "../pages/PayOutOthers";
import PayInMenu from "../pages/PayInMenu";
import RegistrationFee from "../pages/RegistrationFees";
import PrintPaymentOut from "../pages/PrintPaymentOut";
import RegistrationReceipt from "../pages/RegistrationReceipt";
import AuctionIntemationMessage from "../pages/AuctionIntemationMessage";
import OverDueMessage from "../pages/OverDueMessage";
import DueEmail from "../pages/DueEmail";
import OverDueEmail from "../pages/OverDueEmail";
import WhatsappPromo from "../pages/WhatsappPromo";
import QuickSearch from "../pages/QuickSearch";
import BidWinner from "../pages/BidWinner";
import TransferCustomer from "../pages/SoftTransferCustomer";
import SoftTransferCustomer from "../pages/SoftTransferCustomer";
import HardTransferCustomer from "../pages/HardTransfer";
import UnApprovedCustomer from "../pages/UnApprovedCustomer";
import CustomerView from "../pages/CustomerView";
import MobileAppEnroll from "../pages/MobileAppEnroll";
import PaymentLink from "../pages/PaymentLink";
import PaymentLinkMenu from "../pages/PaymentLinkMenu";
import ChitBulkPaymentLink from "../pages/BulkChitPaymentLink";
import Analytics from "../pages/Analytics";

import TotalRevenue from "../pages/TotalRevenue";
import MonthlyRevenue from "../pages/MonthlyRevenue";

import AuctionBidStatus from "../pages/AuctionBidStatus"
import AuctionWinnerDocuments from "../pages/AuctionWinnerDocuments";
import AuctionInformation from "../pages/AuctionInformation";
import AuctionTermsandCondition from "../pages/AuctionTermsandCondition";
import CollectionExecutiveReport from "../pages/CollectionExecutiveReport";
import CustomerWelcomeWhatsappMessage from "../pages/CustomerWelcomeWhatsappMessage";
import CustomerChitPlanWhatsappMessage from "../pages/CustomerChitPlanWhatsappMessage";
import Insurance from "../pages/Insurance";
import CustomerRewards from "../pages/CustomerRewards";
import EmployeeAttendance from "../pages/EmployeeAttendanceReport"
import EmployeeMonthlyReport from "../pages/EmployeeMonthlyReport";
import EmployeeMenu from "../pages/EmployeeMenu"
import HoldedCustomerReport from "../pages/HoldedCustomerReport"
import LeadWhatsappWelcomeMessage from "../pages/LeadWhatsappWelcomeMessage";
import LeadReferredByWhatsappMessage from "../pages/LeadReferredByWhatsappMessage";
import PayInOutMenu from "../pages/PayInOutMenu";
import RegistrationFeeReport from "../pages/RegistrationFeeReport";
import StaffMenu from "../pages/StaffMenu";

import TargetIncentiveReport from "../pages/TargetIncentive";
import TargetPayOutSalary from "../pages/TargetPayoutSalary";
import TargetPayOutCommissionIncentive from "../pages/TargetPayOutCommissionIncentive";
import TargetCommission from "../pages/TargetCommission";
import TargetPayOutMenu from "../pages/TargetPayOutMenu";

import MonthlyInstallmentTurnoverReport from "../pages/MonthlyInstallmentTurnoverReport";

import CustomerLoanReport from "../pages/CustomerLoanReport";
import CollectionAreaReport from "../pages/CollectionAreaReport";
import EnrollmentMenu from "../pages/EnrollmentView";
import OtherServicesMenu from "../pages/OtherServicesMenu";
import LegalsMenu from "../pages/LegalsMenu";
import OutstandingReport from "../pages/OutstandingReport";
import PaymentMenu from "../pages/PaymentMenu";
import PayoutSalaryReport from "../pages/PayoutSalaryReport";
import PenaltySettings from "../pages/PenaltySettings";
import PenaltyMonitor from "../pages/PenaltyMonitor";
import TargetMenu from "../pages/TargetMenu";
import UserMenu from "../pages/UserMenu"

import Register from "../pages/Register";
import IndividualChitPaymentLink from "../pages/IndividualChitPaymentLink";
import IndividualRegistrationChitPaymentLink from "../pages/IndividualRegistrationChitPaymentLink";

import UnApprovedCustomerReport from "../pages/UnApprovedCustomerReport";
import PaymentReport from "../pages/PaymentReport";
import PigmySummaryReport from "../pages/PigmySummaryReport";

import ChitAskingMonthReport from "../pages/ChitAskingMonthReport";
import  SalaryRemainingReport from "../pages/SalaryRemainingReport";
import AdminApprovalMenu from "../pages/AdminApprovalsMenu";
import SuspensePayments from "../pages/SuspensePayments";
import InActiveUserReport from "../pages/InActiveUserReport";
import NonConvertedLead from "../pages/NonConvertedLead";
import ConvertedLead from "../pages/ConvertedLead";

// import DueReport from "../pages/DueReport";

const mainRoutes = createBrowserRouter([
  {
    path: "/",

    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quick-search",
    element: (
      <ProtectedRoute>
        <Navbar />
        <QuickSearch />
      </ProtectedRoute>
    ),
  },

  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reg-fee-print/:id",

    element: <RegistrationReceipt />,
  },

  {
    path: "/group",
    element: (
      <ProtectedRoute>
        <Group />
      </ProtectedRoute>
    ),
  },

  {
    path: "/customer-menu/user",
    element: (
      <ProtectedRoute>
        <User />
      </ProtectedRoute>
    ),
  },
 {
    path: "/approval-menu",
    element: (<ProtectedRoute>
      <AdminApprovalMenu/>
      </ProtectedRoute>
      ),

  },
  {
    path: "/customer-menu/un-approved-customer",
    element: (
      <ProtectedRoute>
        <UnApprovedCustomer />
      </ProtectedRoute>
    ),
  },
   {
    path: "/approval-menu/un-approved-customer",
    element: (
      <ProtectedRoute>
        <UnApprovedCustomer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/target-menu",
    element: (
      <ProtectedRoute>
        <TargetMenu />
      </ProtectedRoute>
    ),
  },



  {
    path: "/penalty-settings",
    element: <PenaltySettings />
  },

  {
    path: "/penalty-monitor",
    element: <PenaltyMonitor />
  },


  {
    path: "/other-service-menu/",
    element: (
      <ProtectedRoute>
        <OtherServicesMenu />
      </ProtectedRoute>
    ),
  },

  {
    path: "/other-service-menu/loan",
    element: (
      <ProtectedRoute>
        <Loan />
      </ProtectedRoute>
    ),
  },
  {
    path: "/other-service-menu/pigme",
    element: (
      <ProtectedRoute>
        <Pigme />
      </ProtectedRoute>
    ),
  },

  {
    path: "/enroll-menu/mobile-app-enroll",
    element: (
      <ProtectedRoute>
        <MobileAppEnroll />
      </ProtectedRoute>
    ),
  },
     {
    path: "/approval-menu/mobile-app-enroll",
    element: (
      <ProtectedRoute>
        <MobileAppEnroll />
      </ProtectedRoute>
    ),
  },
  {
    path: "/enroll-menu/enrollment",
    element: (
      <ProtectedRoute>
        <Enroll />
      </ProtectedRoute>
    ),
  },

  {
    path: "/enroll-menu",
    element: (<ProtectedRoute>
      <EnrollmentMenu />
    </ProtectedRoute>),
  },

  {
    path: "/target-menu/target",
    element: (
      <ProtectedRoute>
        <Target />
      </ProtectedRoute>
    ),
  },



  {
    path: "/legals-menu",
    element: <LegalsMenu />,
  },

  {
    path: "/legals-menu/guarantor",
    element: <Guarantor />,
  },




  {
    path: "/payment-menu",
    element: (
      <ProtectedRoute>
        <PaymentMenu />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-menu/payment",
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-menu/payment-in-out-menu/pay-out-menu",
    element: (
      <ProtectedRoute>
        <PayOutMenu />
      </ProtectedRoute>
    ),
  },

  {
    path: "/payment-menu/payment-in-out-menu/pay-in-menu",
    element: (
      <ProtectedRoute>
        <PayInMenu />
      </ProtectedRoute>
    ),
  },

  {
    path: "/payment-menu/payment-in-out-menu",
    element: (
      <ProtectedRoute>
        <PayInOutMenu />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-menu/payment-in-out-menu/pay-in-menu/payment",
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-menu/payment-in-out-menu/pay-in-menu/registration-fee",
    element: (
      <ProtectedRoute>
        <RegistrationFee />
      </ProtectedRoute>
    ),
  },
     {
    path: "/payment-menu/payment-in-out-menu/pay-in-menu/suspense-payments",
    element: (
      <ProtectedRoute>
        <SuspensePayments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-menu/payment-in-out-menu/pay-in-menu/payment-link-menu",
    element: (
      <ProtectedRoute>
        <PaymentLinkMenu />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-menu/payment-in-out-menu/general-payment-out/:paymentType",
    element: (
      <ProtectedRoute>
        <GeneralPaymentOut />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-menu/payment-in-out-menu/payment-out/commission",
    element: (
      <ProtectedRoute>
        <PayOutCommission />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-menu/payment-in-out-menu/payment-out/salary",
    element: (
      <ProtectedRoute>
        <PayOutSalary />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-menu/payment-in-out-menu/payment-out/petty-Cash",
    element: (
      <ProtectedRoute>
        <PayOutPettyCash />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-menu/payment-in-out-menu/payment-out/others",
    element: (
      <ProtectedRoute>
        <PayOutOthers />
      </ProtectedRoute>
    ),
  },


  {
    path: "/payment-menu/payment-in-out-menu/pay-in-menu/payment-link-menu/chit-payment",
    element: (
      <ProtectedRoute>
        <IndividualChitPaymentLink />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-menu/payment-in-out-menu/pay-in-menu/payment-link-menu/registration-chit-payment",
    element: (
      <ProtectedRoute>
        <IndividualRegistrationChitPaymentLink />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-menu/payment-in-out-menu/pay-in-menu/payment-link-menu/chit-bulk-payment",
    element: (
      <ProtectedRoute>
        <ChitBulkPaymentLink />
      </ProtectedRoute>
    ),
  },

  {
    path: "/print-payment-out/:id",
    element: (
      <ProtectedRoute>
        <PrintPaymentOut />
      </ProtectedRoute>
    ),
  },

  {
    path: "/mobile-app-enroll",
    element: (
      <ProtectedRoute>
        <MobileAppEnroll />
      </ProtectedRoute>
    ),
  },

  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <User />
      </ProtectedRoute>
    ),
  },
  ,
  {
    path: "/un-approved-customer",
    element: (
      <ProtectedRoute>
        <UnApprovedCustomer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/task",
    element: (
      <ProtectedRoute>
        <Task />
      </ProtectedRoute>
    ),
  },

  {
    path: "/target",
    element: (
      <ProtectedRoute>
        <Target />
      </ProtectedRoute>
    ),
  },

  {
    path: "/target-commission",
    element: <TargetCommission />,
  },
  {
    path: "/target-commission-incentive",
    element: <TargetPayOutCommissionIncentive />,
  },
  {
    path: "/target-payout-menu",
    element: <TargetPayOutMenu />,
  },
  {
    path: "/target-payout-salary",
    element: <TargetPayOutSalary />,
  },
  {
    path: "/target-incentive",
    element: <TargetIncentiveReport />,
  },


  {
    path: "/enrollment-request-form",
    element: <EnrollmentRequestForm />,
  },
  {
    path: "/guarantor",
    element: <Guarantor />,
  },
  {
    path: "/filter-groups",
    element: (
      <ProtectedRoute>
        <FilterGroups />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employee-profile",
    element: (
      <ProtectedRoute>
        <EmployeeProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/staff-menu",
    element: (
      <ProtectedRoute>
        <StaffMenu />
      </ProtectedRoute>
    ),
  },
  {
    path: "/staff-menu/employee-menu",
    element: (
      <ProtectedRoute>
        <EmployeeMenu />
      </ProtectedRoute>
    ),
  },
  {
    path: "/staff-menu/employee-menu/employee",
    element: (
      <ProtectedRoute>
        <Employee />
      </ProtectedRoute>
    ),
  },
  {
    path: "/staff-menu/employee-menu/add-employee-attendance",
    element: (
      <ProtectedRoute>
        <EmployeeAttendance />
      </ProtectedRoute>
    ),
  },
  {
    path: "/week-group",
    element: (
      <ProtectedRoute>
        <WeekGroup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <User />
      </ProtectedRoute>
    ),
  },
  {
    path: "/enrollment",
    element: (
      <ProtectedRoute>
        <Enroll />
      </ProtectedRoute>
    ),
  },
  {
    path: "/loan",
    element: (
      <ProtectedRoute>
        <Loan />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pigme",
    element: (
      <ProtectedRoute>
        <Pigme />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auction",
    element: (
      <ProtectedRoute>
        <Auction />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment",
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    ),
  },

  {
    path: "/payment-in-out-menu/pay-out-menu",
    element: (
      <ProtectedRoute>
        <PayOutMenu />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-in-out-menu/general-payment-out/:paymentType",
    element: (
      <ProtectedRoute>
        <GeneralPaymentOut />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-in-out-menu/payment-out/commission",
    element: (
      <ProtectedRoute>
        <PayOutCommission />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-in-out-menu/payment-out/salary",
    element: (
      <ProtectedRoute>
        <PayOutSalary />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-in-out-menu/payment-out/petty-Cash",
    element: (
      <ProtectedRoute>
        <PayOutPettyCash />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-in-out-menu/payment-out/others",
    element: (
      <ProtectedRoute>
        <PayOutOthers />
      </ProtectedRoute>
    ),
  },
  {
    path: "/collection-area-request",
    element: (
      <ProtectedRoute>
        <CollectionArea />
      </ProtectedRoute>
    ),
  },
  {
    path: "/staff-menu/agent",
    element: (
      <ProtectedRoute>
        <Agent />
      </ProtectedRoute>
    ),
  },

  {
    path: "/lead",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Lead />
      </ProtectedRoute>
    ),
  },

  { path: "/total-revenue", element: <TotalRevenue /> },
  { path: "/monthly-revenue", element: <MonthlyRevenue /> },

  {
    path: "/lead-setting",
    element: <LeadSetting />,
    children: [
      {
        index: true,
        element: <LeadSettings />,
      },
      {
        path: "app-settings",
        element: <AppSettings />,
        children: [
          {
            path: "groups/mobile-access",
            element: <GroupSettings />,
          },
          {
            path: "groups/asset",
            element: <DreamAsset />,
          },
          {
            path: "groups/become-agent",
            element: <BecomeAgent />,
          },
        ],
      },
    ],
  },

  {
    path: "/designation",
    element: (
      <ProtectedRoute>
        <Designation />
      </ProtectedRoute>
    ),
  },

  ,
  {
    path: "soft-transfer",
    element: (
      <ProtectedRoute>
        <SoftTransferCustomer />
      </ProtectedRoute>
    ),
  },
  ,
  {
    path: "hard-transfer",
    element: (
      <ProtectedRoute>
        <HardTransferCustomer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/administrative-privileges",
    element: (
      <ProtectedRoute>
        <Navbar />
        <AdministrativePrivileges />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin-access-rights",
    element: (
      <ProtectedRoute>
        <Navbar />
        <AdminAccessRights />
      </ProtectedRoute>
    ),
  },
  {
    path: "/marketing",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Marketing />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Profile />
      </ProtectedRoute>
    ),
  },

  {
    path: "/customer-menu",
    element: (
      <ProtectedRoute>
        <UserMenu />
      </ProtectedRoute>
    ),
  },
  {
    path: "/gift-received",
    element: <CustomerRewards />
  },

  { path: "customer-view", element: <CustomerView /> },

  {
    path: "/reports",
    element: <Reports />,
    children: [
      { path: "daybook", element: <Daybook /> },
      { path: "payout", element: <PayOutReport /> },
      { path: "sales-report", element: <SalesReport /> },
      { path: "receipt", element: <Receipt /> },
      { path: "group-report", element: <GroupReport /> },
      { path: "all-group-report", element: <AllGroupReport /> },
      { path: "auction-report", element: <AuctionReport /> },
      { path: "lead-report", element: <LeadReport /> },
      { path: "user-report", element: <UserReport /> },
      { path: "inactive-user-report", element: <InActiveUserReport /> },
      { path: "all-user-report", element: <AllUserReport /> },
      { path: "loan-report", element: <LoanReport /> },
      { path: "pigme-report", element: <PigmeReport /> },
      { path: "employee-report", element: <EmployeeReport /> },
      { path: "commission-report", element: <CommissionReport /> },
      { path: "enrollment-report", element: <EnrollmentReport /> },
      { path: "payment-summary", element: <PaymentSummary /> },
      { path: "monthly-install-turnover", element: <MonthlyInstallmentTurnoverReport /> },

      { path: "employee-monthly-report", element: <EmployeeMonthlyReport /> },
      { path: "holded-customer-report", element: <HoldedCustomerReport /> },
      { path: "registration-fee-receipt", element: <RegistrationFeeReport /> },
      { path: "collection-executive", element: <CollectionExecutiveReport /> },
      { path: "collection-area-report", element: <CollectionAreaReport /> },

      { path: "pigmy-summary-report", element: <PigmySummaryReport /> },
      { path: "unverified-customer-report", element: <UnApprovedCustomerReport /> },
      { path: "payment-report", element: <PaymentReport /> },

      { path: "payout-salary-report", element: <PayoutSalaryReport /> },

      { path: "customer-loan-report", element: <CustomerLoanReport /> },
      {
        path: "outstanding-report",
        element: <OutstandingReport />,
      },
 {path: "chit-asking-month-report", element: <ChitAskingMonthReport/>},
      {
        path: "target-incentive",
        element: <TargetIncentiveReport />,
      },
      {
        path: "target-commission",
        element: <TargetCommission />,
      },
 {path: "salary-remaining", element: <SalaryRemainingReport/>},
    {path: "non-converted-lead-report", element: <NonConvertedLead/>},
   {path: "converted-lead-report", element: <ConvertedLead/>},

      // {
      //   path: "due-report",
      //   element: <DueReport />,
      // },

      { path: "customer-view", element: <CustomerView /> },

    ],
  },


  {
    path: "/target-commission",
    element: <TargetCommission />,
  },
  {
    path: "/target-commission-incentive",
    element: <TargetPayOutCommissionIncentive />,
  },
  {
    path: "/target-payout-menu",
    element: <TargetPayOutMenu />,
  },
  {
    path: "/target-payout-salary",
    element: <TargetPayOutSalary />,
  },
  {
    path: "/target-incentive",
    element: <TargetIncentiveReport />,
  },

  {
    path: "/insurance",
    element: <Insurance />
  },
  {
    path: "/print/:id",

    element: <Print />,
  },
  {
    path: "/marketing",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Marketing />
      </ProtectedRoute>
    ),
    children: [
      { path: "what-add", element: <WhatsappAdd /> },
      { path: "failed-whatuser", element: <WhatsappFailed /> },
      { path: "due-message", element: <DueMessage /> },
      {
        path: "auction-intimation-message",
        element: <AuctionIntemationMessage />,
      },
      { path: "over-due-message", element: <OverDueMessage /> },
      { path: "due-email", element: <DueEmail /> },
      { path: "over-due-email", element: <OverDueEmail /> },
      { path: "what-promo", element: <WhatsappPromo /> },
      { path: "bid-winner", element: <BidWinner /> },
      { path: "payment-link", element: <PaymentLink /> },
      { path: "bid-status", element: <AuctionBidStatus /> },
      { path: "auction-info", element: <AuctionInformation /> },
      { path: "winner-document", element: <AuctionWinnerDocuments /> },
      { path: "auction-terms-condition", element: <AuctionTermsandCondition /> },
      { path: "lead-welcome-message", element: <LeadWhatsappWelcomeMessage /> },
      { path: "lead-referredby-message", element: <LeadReferredByWhatsappMessage /> },
      { path: "customer-welcome-message", element: <CustomerWelcomeWhatsappMessage /> },
      { path: "customer-chitplan-message", element: <CustomerChitPlanWhatsappMessage /> },
    ],
  },
]);
export default mainRoutes;
