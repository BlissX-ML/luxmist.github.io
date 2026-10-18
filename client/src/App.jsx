import './App.scss';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Footprint from './pages/footprint-page/Footprint.jsx';
import About from './pages/about-page/AboutPage.jsx';

import Loading from './components/feedback/Loading.jsx';

import Resources from './pages/resource-share-page/Resources.jsx';

// import MemoSidebarNavigate from './pages/memo-page/MemoSidebarNavigate';

import RenderInitialContent from './features/render-articles/RenderInitialContent';
import RenderMainContent from './features/render-articles/RenderMainContent';

import AppLayout from './layouts/app-layout/AppLayout';
import RepositorySidebarNavigate from './pages/repository-page/RepositorySidebarNavigate';
import Dashboard from './pages/dashboard-page/Dashboard';

import DashboardNestedLayout from './layouts/dashboard/nested-layout/DashboardNestedLayout';

import DashboardPersonalPlan from './layouts/dashboard/router/plan/DashboardPersonalPlan';
import DashboardLearnGrowth from './layouts/dashboard/router/learn-growth/DashboardLearnGrowth';
import DashboardBodyHealth from './layouts/dashboard/router/body-health/DashboardBodyHealth';
import DashboardExpenseStatus from './layouts/dashboard/router/expense-status/DashboardExpenseStatus';
import DashboardLifeLogs from './layouts/dashboard/router/life-logs/DashboardLifeLogs';
import CertificatesLayout from './layouts/dashboard/router/certificate/CertificatesLayout';

const Homepage = lazy(() => import('./pages/home-page/Homepage.jsx'));

const router = createBrowserRouter([
    { path: '/', element: <Navigate to="/home" replace /> },
    {
        element: <AppLayout />,
        children: [
            {
                path: 'home',
                element: <Homepage />
            },
            {
                path: 'dashboard',
                children: [
                    { index: true, element: <Dashboard /> },
                    {
                        element: <DashboardNestedLayout />,
                        children: [
                            {
                                path: 'personal-plan',
                                element: <DashboardPersonalPlan />
                            },
                            {
                                path: 'certificates',
                                element: <CertificatesLayout />
                            },
                            {
                                path: 'learn-growth',
                                element: <DashboardLearnGrowth />
                            },
                            {
                                path: 'body-health',
                                element: <DashboardBodyHealth />
                            },
                            {
                                path: 'expense-status',
                                element: <DashboardExpenseStatus />
                            },
                            {
                                path: 'life-logs',
                                element: <DashboardLifeLogs />
                            }
                        ]
                    }
                ]
            },
            {
                path: 'repository',
                element: <RepositorySidebarNavigate />,
                children: [
                    {
                        index: true,
                        element: <RenderInitialContent />
                    },
                    {
                        path: ':routeId',
                        element: <Outlet />, // 只渲染占位，避免内容叠加
                        children: [
                            {
                                index: true,
                                element: <RenderInitialContent />
                            },
                            {
                                path: ':secondRouteId',
                                element: <RenderMainContent />
                            }
                        ]
                    }
                ]
            },
            {
                path: 'footprint',
                element: <Footprint />
            },
            {
                path: 'resources',
                element: <Resources />
            },
            {
                path: 'about',
                element: <About />
            }
        ]
    }
]);

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <RouterProvider router={router} />
        </Suspense>
    );
}

export default App;
