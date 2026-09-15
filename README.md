# LeadEase CRM

A simple and secure **Client Lead Management System (Mini CRM)** built for **Future Interns — Full Stack Web Development Internship, Task 2**.

LeadEase helps businesses collect, organize, track, and follow up with customer enquiries from a single dashboard.

## 🚀 Live Demo

Coming soon.

## 📌 Project Overview

LeadEase CRM provides a centralized workspace for managing customer leads submitted through a public contact form.

The system allows an administrator to:

* View all incoming leads
* Search leads by name or email
* Filter leads by status
* Update lead status
* View detailed lead information
* Add follow-up notes and dates
* Track upcoming follow-ups
* Monitor lead conversion performance
* Secure the CRM dashboard with authentication

### Lead Workflow

```text
Customer
   ↓
Public Contact Form
   ↓
Supabase Database
   ↓
Admin Login
   ↓
LeadEase Dashboard
   ↓
New → Contacted → Converted
   ↓
Follow-up Notes & Actions
```

## ✨ Features

### Public Contact Form

Visitors can submit their enquiries without accessing the admin dashboard.

The form collects:

* Name
* Email
* Phone number
* Source
* Message

### 🔐 Secure Admin Access

The CRM dashboard is protected using **Supabase Authentication**.

Only authenticated users can access and manage lead information.

### 📊 Dashboard

The dashboard provides an overview of:

* Total leads
* New leads
* Contacted leads
* Converted leads
* Conversion rate
* Recent leads
* Upcoming follow-ups

### 👥 Lead Management

Administrators can:

* Search leads
* Filter leads by status
* View lead details
* Update lead status
* Contact leads through email or phone

### 📝 Follow-up Management

Each lead can have multiple follow-up records containing:

* Follow-up notes
* Follow-up dates
* Communication history

### 📱 Responsive Design

The application is designed to work across:

* Desktop
* Tablet
* Mobile devices

## 🛠️ Tech Stack

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| React              | Frontend UI                     |
| Vite               | Development and build tool      |
| Supabase           | Backend and PostgreSQL database |
| Supabase Auth      | Admin authentication            |
| PostgreSQL         | Lead and follow-up data         |
| Row Level Security | Database access control         |
| CSS                | Responsive interface            |
| Git & GitHub       | Version control                 |
| Vercel             | Deployment                      |

## 🗄️ Database Structure

### `leads`

Stores customer enquiry information.

```text
id
name
email
phone
message
source
status
created_at
```

Lead statuses:

```text
New
Contacted
Converted
```

### `follow_ups`

Stores communication and follow-up information.

```text
id
lead_id
note
follow_up_date
created_at
```

Relationship:

```text
One Lead
   ↓
Many Follow-ups
```

## 🔒 Security

LeadEase uses **Supabase Row Level Security (RLS)**.

Public visitors are allowed to submit enquiries, while lead data can only be viewed and managed by authenticated users.

The frontend environment variables are stored locally in:

```text
.env.local
```

Environment files are excluded from Git using `.gitignore`.

> Never expose a Supabase service-role key in the frontend application.

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ashwithkumar404-glitch/FUTURE_FS_Task2.git
```

### 2. Enter the project

```bash
cd FUTURE_FS_Task2
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Start the development server

```bash
npm run dev
```

The application will run locally using the Vite development server.

### 6. Build for production

```bash
npm run build
```

## 🧪 Testing the Application

### Public Contact Flow

1. Open the public contact page.
2. Enter customer details.
3. Submit the enquiry.
4. Confirm the success message.
5. Log in to the admin dashboard.
6. Verify that the lead appears in the Leads section.

### Lead Management Flow

1. Login as an administrator.
2. Open Leads.
3. Search or filter a lead.
4. Change the lead status.
5. Open the lead details.
6. Add a follow-up note and date.
7. Verify the follow-up appears on the dashboard.

## 📁 Project Structure

```text
lead-ease-crm/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── LeadStatus.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   └── Topbar.jsx
│   │
│   ├── lib/
│   │   └── supabase.js
│   │
│   ├── pages/
│   │   ├── Contact.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LeadDetails.jsx
│   │   ├── Leads.jsx
│   │   └── Login.jsx
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Future Improvements

Possible future enhancements include:

* Advanced lead analytics
* Lead activity timeline
* Email notifications
* Automated follow-up reminders
* Multiple administrator roles
* Export leads to CSV
* Pagination for large lead datasets
* More advanced filtering
* Automated lead assignment

## 👨‍💻 Developed For

**Future Interns — Full Stack Web Development Internship**

**Task 2: Client Lead Management System (Mini CRM)**
