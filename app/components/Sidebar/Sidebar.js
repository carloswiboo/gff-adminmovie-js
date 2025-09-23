'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    HiMenu,
    HiX,
    HiChevronDown,
    HiHome,
    HiDocumentText,
    HiPhotograph,
    HiOutlineDocumentDownload,
    HiInbox,
    HiCog,
    HiQuestionMarkCircle,
} from 'react-icons/hi';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';

export default function Sidebar({ className = '' }) {
    const [open, setOpen] = useState(false);
    const [pagesOpen, setPagesOpen] = useState(false);
    const [salesOpen, setSalesOpen] = useState(false);
    const router = useRouter();

    return (
        <>
            {/* Mobile top bar with hamburger */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <button
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        onClick={() => setOpen(!open)}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        {open ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </button>
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">G</div>
                        <span className="text-lg font-semibold text-primary">Flowbite</span>
                    </Link>
                </div>
                <div className="flex items-center space-x-2">
                    <DarkModeToggle />
                </div>
            </div>

            <div className={`flex ${className}`}>
                {/* Sidebar for md+ */}
                <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-r dark:border-gray-700">


                    {/* Grouped nav */}
                    <nav className="px-4">
                        <ul className="space-y-1 pt-6">
                            <li>
                                <Link
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.refresh();
                                    }}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <HiHome className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                    <span className="flex-1">Overview</span>
                                </Link>
                            </li>
                            {/* Pages group 
                            <li>
                                <button
                                    onClick={() => setPagesOpen(!pagesOpen)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <HiDocumentText className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                    <span className="flex-1 text-left">Pages</span>
                                    <HiChevronDown className={`w-4 h-4 transition-transform ${pagesOpen ? 'transform rotate-180' : ''}`} />
                                </button>

                                {pagesOpen && (
                                    <ul className="mt-1 ml-8 space-y-1 text-sm text-gray-300">
                                        <li>
                                            <Link href="#" className="block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">All pages</Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Add new</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            {/* Sales group 
                            <li>
                                <button
                                    onClick={() => setSalesOpen(!salesOpen)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <HiPhotograph className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                    <span className="flex-1 text-left">Sales</span>
                                    <HiChevronDown className={`w-4 h-4 transition-transform ${salesOpen ? 'transform rotate-180' : ''}`} />
                                </button>

                                {salesOpen && (
                                    <ul className="mt-1 ml-8 space-y-1 text-sm text-gray-300">
                                        <li>
                                            <Link href="#" className="block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Overview</Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Reports</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
*/}
                            {/* Messages with badge 
                            <li>
                                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <HiInbox className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                    <span className="flex-1">Messages</span>
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs dark:bg-slate-700 dark:text-white">6</span>
                                </Link>
                            </li>

                            <li>
                                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700">
                                    <HiCog className="w-5 h-5 text-gray-300" />
                                    <span className="flex-1">Authentication</span>
                                </Link>
                            </li>
*/}
                        </ul>
                    </nav>

                    <div className="mt-6 border-t border-gray-700 px-4 pt-6">
                        <ul className="space-y-1">
                            <li>
                                <Link href="https://www.gironafilmfestival.com/" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <HiDocumentText className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                    <span>GFF Main Site</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="https://app.gironafilmfestival.com/hoteles" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <HiDocumentText className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                    <span>Hotels</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="https://app.gironafilmfestival.com/transparencia" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <HiPhotograph className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                    <span>Transparency</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="https://app.gironafilmfestival.com/donacion" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <HiPhotograph className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                    <span>Donations</span>
                                </Link>
                            </li>

                        </ul>

                        {/* Promo card */}
                        <div className="mt-6 bg-gradient-to-br from-red-700 to-gray-900 rounded-lg p-4 text-white">
                            <div className="flex items-start justify-between">
                                <div className="text-xs bg-white/20 px-2 py-1 rounded-full">GFF 37</div>

                            </div>
                            <div className="mt-3 text-xs font-bold text-justify">
                                In this portal you can manage your movie submission for the Girona Film Festival (GFF). Please ensure all your details are up to date and monitor the status of your submissions regularly.
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Mobile slide-over menu */}
                {open && (
                    <div className="fixed inset-0 z-40 md:hidden">
                        <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
                        <aside className="fixed left-0 top-0 w-72 h-full bg-white dark:bg-gray-900 border-r dark:border-gray-700 p-4">
                            <div className="flex items-center justify-between mb-6">
                                <Link href="/" className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">P</div>
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Flowbite</span>
                                </Link>
                                <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <HiX className="w-6 h-6 text-gray-900 dark:text-white" />
                                </button>
                            </div>

                            <nav className="space-y-2">
                                <Link
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setOpen(false);
                                        router.refresh();
                                    }}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <HiHome className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span>Overview</span>
                                </Link>

                                <button onClick={() => setPagesOpen(!pagesOpen)} className="w-full flex items-center justify-between px-3 py-2 rounded-md text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <div className="flex items-center gap-3">
                                        <HiDocumentText className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                        <span>Pages</span>
                                    </div>
                                    <HiChevronDown className={`${pagesOpen ? 'transform rotate-180' : ''}`} />
                                </button>
                                {pagesOpen && (
                                    <div className="pl-8 space-y-1">
                                        <Link href="#" onClick={() => setOpen(false)} className="block px-2 py-1 rounded hover:bg-gray-100">All pages</Link>
                                    </div>
                                )}

                                <button onClick={() => setSalesOpen(!salesOpen)} className="w-full flex items-center justify-between px-3 py-2 rounded-md text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <div className="flex items-center gap-3">
                                        <HiPhotograph className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                        <span>Sales</span>
                                    </div>
                                    <HiChevronDown className={`${salesOpen ? 'transform rotate-180' : ''}`} />
                                </button>
                                {salesOpen && (
                                    <div className="pl-8 space-y-1">
                                        <Link href="#" onClick={() => setOpen(false)} className="block px-2 py-1 rounded hover:bg-gray-100">Overview</Link>
                                    </div>
                                )}

                                <Link href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <HiInbox className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span>Messages</span>
                                    <span className="ml-auto inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs dark:bg-slate-700 dark:text-white">6</span>
                                </Link>

                                <Link href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <HiCog className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span>Authentication</span>
                                </Link>
                            </nav>

                            <div className="mt-6">
                                <DarkModeToggle />
                            </div>
                        </aside>
                    </div>
                )}

                {/* Main content wrapper - will be provided by layout */}
                <main className="flex-1">
                    {/* The layout will render children next to the sidebar */}
                </main>
            </div>
        </>
    );
}
