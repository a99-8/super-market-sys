import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export type DenominationCount = CashDenomination;

export interface DrawerSession {
  id: string;
  userId: string;
  openedAt: string;
  startTime?: string;
  closedAt?: string;
  endTime?: string;
  status: DrawerStatus;
  initialBalance: number;
  currentBalance: number;
  denominations: CashDenomination[];
  totalAmount: number;
}

export interface CartItem extends InvoiceItem {}

export type UserRole =
  | "CASHIER"
  | "STORE_KEEPER"
  | "INVENTORY_MANAGER"
  | "REPORTS_SUPERVISOR"
  | "REPORTS_VIEWER"
  | "USERS_SUPERVISOR"
  | "USER_SUPERVISOR"
  | "ADMIN";

export interface User {
  id: string;
  username: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  creditLimit: number;
  creditBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  salePrice: number;
  discountPrice?: number;
  discountQuantity: number;
  stockQuantity: number;
  reservedQuantity: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export type CashDenominationValue = 200 | 100 | 50 | 20 | 10 | 5 | 1 | 0.5;

export interface CashDenomination {
  value: CashDenominationValue;
  denomination: number;
  count: number;
}

export type DrawerStatus = "OPEN" | "CLOSED";

export interface CashDrawer {
  id: string;
  status: DrawerStatus;
  denominations: CashDenomination[];
  totalAmount: number;
  lastOpenedAt?: string;
  lastClosedAt?: string;
}

export type DrawerTransactionType =
  | "FILL"
  | "CLEAR"
  | "EXPENSE"
  | "DEPOSIT"
  | "WITHDRAW"
  | "SALE"
  | "REFUND"
  | "SALE_CASH";

export interface DrawerTransaction {
  id: string;
  sessionId?: string;
  type: DrawerTransactionType;
  amount: number;
  reason?: string;
  denominations?: CashDenomination[];
  notes?: string;
  performedByUserId?: string;
  timestamp: string;
}

export type PaymentMethod = "CASH" | "CARD" | "CREDIT";

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  isDiscountApplied: boolean;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  customerId?: string;
  paidAmount?: number;
  changeAmount?: number;
  cashDenominationsGiven?: CashDenomination[];
  cashDenominationsReturned?: CashDenomination[];
  cashierId: string;
  createdAt: string;
}

export interface TabbedInvoice {
  tabId: string;
  tabTitle: string;
  invoice: Partial<Invoice> & { items: InvoiceItem[] };
  isActive: boolean;
}

export interface DailyReportSummary {
  date: string;
  totalSales: number;
  cashSales: number;
  cardSales: number;
  creditSales: number;
  totalInvoicesCount: number;
  totalProfit: number;
}

export interface UserCreditReport {
  userId: string;
  username: string;
  phone: string;
  remainingCredit: number;
  totalDebt: number;
}

export interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
}

export interface CashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  invoiceTotal?: number;
  drawerDenominations?: CashDenomination[];
  onConfirm?: () => Promise<void>;
  onPaymentSuccess?: (
    given: CashDenomination[],
    returned: CashDenomination[],
  ) => void;
  onDepositNewCash?: (amountNeeded: number) => void;
  onChangePaymentMethod?: () => void;
}

export interface ChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  paidAmount: number;
  totalAmount: number;
  changeDue: number;
  changeBreakdown: DenominationCount[];
  onConfirm: () => void;
}

export interface DenominationInputProps {
  denominations: DenominationCount[];
  onChange: (updatedDenominations: DenominationCount[]) => void;
}

export interface JsonImportExportProps {
  onDataRefresh: () => void;
}

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSave: (productData: Omit<Product, "id"> | Product) => Promise<void>;
}

export interface CartSummaryProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (method: "CASH" | "CARD" | "CREDIT") => void;
}

export interface CreditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  users: User[];
  onConfirm: (customerId: string) => Promise<void>;
}

export interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export interface PrintTemplateProps {
  title: string;
  subtitle?: string;
  dataHeaders: string[];
  dataRows: (string | number)[][];
  summaryItems?: { label: string; value: string | number }[];
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export interface TabItem {
  key: string;
  label: React.ReactNode;
  content?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUserBalance: (newBalance: number) => void;
}

export interface DrawerState {
  currentSession: DrawerSession | null;
  isOpen: boolean;
  setCurrentSession: (session: DrawerSession | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  updateDenominations: (denominations: DenominationCount[]) => void;
}

export interface TabInvoice {
  id: string;
  tabId: string;
  tabTitle: string;
  cart: InvoiceItem[];
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  customerId?: string;
  notes?: string;
}

export interface InvoiceTabsState {
  tabs: TabInvoice[];
  activeTabId: string;
  setActiveTab: (tabId: string) => void;
  addNewTab: () => boolean;
  createTab: () => void;
  closeTab: (tabId: string) => Promise<void>;
  addProductToActiveTab: (
    product: Product,
    quantityToAdd?: number,
  ) => Promise<void>;
  updateItemQuantity: (productId: string, newQuantity: number) => Promise<void>;
  removeItemFromActiveTab: (productId: string) => Promise<void>;
  setPaymentMethod: (method: PaymentMethod, customerId?: string) => void;
  clearActiveTab: () => Promise<void>;
}
export interface ChangeCalculationResult {
  success: boolean;
  reason?:
    | "INSUFFICIENT_TOTAL_CASH"
    | "UNAVAILABLE_DENOMINATIONS"
    | "EXACT_AMOUNT";
  returnedDenominations: CashDenomination[];
  totalReturned: number;
  remainingShortage: number;
}

export interface ExchangeValidationResult {
  isValid: boolean;
  takenTotal: number;
  addedTotal: number;
  difference: number;
}

export interface NavLink {
  href: string;
  label: string;
  icon: string;
  roles?: UserRole[];
}
