🛒 Trackly SOS – Share of Shelf Management Platform
Trackly SOS is a full-stack application designed for field merchandisers and admin teams to manage and analyze Share of Shelf (SOS) data. It offers powerful tools for creating, submitting, reviewing, and analyzing merchandising reports across outlets.

🚀 Features

✅ Merchandiser Portal
🔐 Secure login with JWT
📝 Create and edit SOS forms per outlet
📊 Auto-calculating beverage totals (beer, wine, juice)
📦 form validation
✅ Submit confirmation page before final submission

🛠️ Admin Dashboard

🔐 Admin login & role-based access
👤 View and manage users (roles, soft-delete)
📁 View submitted forms by outlet, merchandiser, or date
📈 Analytics: Pie charts for beverage breakdowns
🧭 Filters for outlet, merchandiser, date
🔍 Responsive DataGrid tables (MUI)

🧱 Tech Stack

🖥️ Frontend

Next.js (App Router)
React + Zustand for state management
TailwindCSS + shadcn/ui + Lucide icons for UI
Axios + TanStack Query for API and data fetching
MUI DataGrid for tabular views
JWT Auth for session handling

🛠️ Backend

Express.js API with RESTful endpoints
Prisma ORM with PostgreSQL
Custom role and user access logic
