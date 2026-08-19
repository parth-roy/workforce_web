# 09. Payment and Wallet Architecture

This document provides a comprehensive overview of the payment, wallet, ledger, and payout architecture in the Parther Logistics Platform based on the `server/` codebase audit.

## 1. Wallet Ecosystem
The platform maintains isolated wallets for different participant roles, ensuring clear separation of funds and ledger rules.

- **Customer Wallet (`Wallet`)**: 
  - **Purpose**: Holds prepaid balances, refunds, and cashbacks.
  - **Transactions**: Tracked via `WalletTransaction` (CREDIT/DEBIT). Reasons include `TOP_UP`, `BOOKING_PAYMENT`, `REFUND`, `CASHBACK`, `ADMIN_CREDIT/DEBIT`.
- **Driver Wallet (`DriverWallet`)**:
  - **Purpose**: Holds driver trip earnings and liabilities.
  - **Negative Balances**: `cachedBalance` CAN BE NEGATIVE. Cash trips deduct platform commission directly, acting as a liability/debt.
  - **Debt Tracking**: Uses `commissionDue` and `commissionDeadline` (typically 24 hours). 
  - **Transactions**: `DriverWalletTransaction`. Reasons include `TRIP_EARNING`, `COMMISSION_DEDUCTED`, `COMMISSION_PAID`, `WITHDRAWAL`, `FLEET_SALARY`, `SUBSCRIPTION`.
- **Worker Wallet (`WorkerWallet`)**:
  - **Purpose**: Holds gig/worker job earnings and commission liabilities. Similar float rules to drivers.
- **Fleet Wallet (`FleetWallet`)**:
  - **Purpose**: Holds earnings for fleet owners. Fleet trips credit the net driver amount to the fleet wallet, leaving the fleet owner responsible for paying their drivers.

## 2. Inbound Payments & Settlements (Razorpay)
Inbound customer payments and commission dues are settled via Razorpay standard collections.

- **Booking Payments**: Handled via `secureCapturedBookingPayment`. Includes replay attack protection by strictly asserting the `razorpayOrderId` and verifying the exact expected `grandTotal` or private bid `customerTotal` in INR paise.
- **Commission Settlement**: Drivers can clear negative wallet balances through the app. `createCommissionPaymentOrder` creates a Razorpay order matching the exact `commissionDue`.
- **Idempotency**: All webhook events (payment captures, refunds) are guarded against double-processing using the `ProcessedWebhook` model based on `x-razorpay-event-id`.

## 3. The Ledger & Commission Debt Lifecycle
Every financial change utilizes Prisma `$transaction` blocks to ensure atomic updates to the cached balances alongside an immutable transaction log.

1. **Online Trips**: Customer pays via Razorpay. The driver's wallet is credited the net amount (`gross - commission`). If the driver had any `commissionDue`, the incoming net earnings automatically offset the debt.
2. **Cash Trips**: Customer pays the driver in cash. The platform's commission is immediately debited from the driver's wallet via `debitDriverWallet`, often pushing the balance into the negative.
3. **Debt Monitoring**: A cron job (`auditCommissionDebts`) actively scans wallets with `commissionDue`. 
   - **Soft Block**: Notifies drivers when nearing the limit or when the 24h deadline is close.
   - **Hard Block**: If the balance crosses `COMMISSION_HARD_BLOCK_THRESHOLD` (e.g. -2000 INR) or exceeds the 24h `commissionDeadline`, the driver's status is forcefully set to `BREAK`, preventing them from receiving new bookings until settled.

## 4. Outbound Payouts & Withdrawals (RazorpayX)
The platform facilitates outbound bank transfers via RazorpayX, tracked via the `WithdrawalRequest` table.

- **Flow**: 
  1. A withdrawal request deducts the requested amount from the participant's wallet immediately (reserving funds) and creates a `PENDING` request.
  2. `processWithdrawalViaRazorpayX` retrieves or creates a RazorpayX `Contact` and `Fund Account` using stored bank details (`bankAccountNo`, `bankIfsc`).
  3. A `Payout` is created. IMPS is used for amounts < ₹2 Lakhs, RTGS for amounts >= ₹2 Lakhs.
- **Failure Handling**: If the API call fails or RazorpayX later rejects the payout, `refundFailedWithdrawal()` securely restores the exact amount back to the appropriate wallet and sets the request to `FAILED` or `ADMIN_PENDING`.
- **CURRENT STATUS**: RazorpayX withdrawals are **fail-closed/paused**. Execution is blocked globally by `paymentCapabilities.razorpayXPayoutsEnabled` returning false. Calling withdrawal routes throws a `503 RAZORPAYX_PAYOUTS_DISABLED` error. Earnings remain securely recorded on the ledger.

## 5. Multi-Party Transfers & Cash Auditing
- **Fleet-to-Driver Transfers**: Fleet owners can digitally transfer salaries (`transferToDriver`) from their `FleetWallet` to a `DriverWallet`. **CURRENT STATUS**: Temporarily paused via `paymentCapabilities.multiPartyTransfersEnabled` throwing `503`.
- **Offline Cash Salary**: Fleet owners can record offline cash payments paid to drivers. This is strictly audit-only (`CashCollectionRecord`) and does not alter digital wallet balances to prevent liability duplication.
- **Admin Cash Collection**: Admins can physically collect commission debts from drivers/workers at the office via `recordCashCollection()`, which creates an audit record and credits the user's wallet to offset their debt.
