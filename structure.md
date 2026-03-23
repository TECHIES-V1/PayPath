PayPath — Repository Structure


```
paypath/
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── transactions/
│   │   │   └── page.tsx
│   │   ├── goals/
│   │   │   └── page.tsx
│   │   ├── ai/
│   │   │   └── page.tsx
│   │   ├── passport/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Badge.tsx
│   │   ├── dashboard/
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── SpendingChart.tsx
│   │   │   └── AITipCard.tsx
│   │   ├── transactions/
│   │   │   ├── TransactionList.tsx
│   │   │   └── TransactionModal.tsx
│   │   ├── goals/
│   │   │   ├── GoalCard.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── ai/
│   │   │   ├── ChatBubble.tsx
│   │   │   └── AffordabilityWidget.tsx
│   │   ├── passport/
│   │   │   ├── PassportCard.tsx
│   │   │   ├── ScoreBreakdown.tsx
│   │   │   └── BadgeGrid.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       ├── BottomNav.tsx
│   │       └── Header.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useGoals.ts
│   │   └── usePassport.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── transactionStore.ts
│   │   └── chatStore.ts
│   ├── public/
│   │   └── icons/
│   ├── .env.local
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── transaction.routes.ts
│   │   │   ├── goal.routes.ts
│   │   │   ├── ai.routes.ts
│   │   │   └── passport.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── transaction.controller.ts
│   │   │   ├── goal.controller.ts
│   │   │   ├── ai.controller.ts
│   │   │   └── passport.controller.ts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rateLimit.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── goal.service.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── passport.service.ts
│   │   │   └── context.service.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy-frontend.yml
│   │   └── deploy-backend.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│
└── README.md
```
