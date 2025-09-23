"use client";

import React from "react";
import Link from "next/link";
import { HiBell, HiSearch } from 'react-icons/hi';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';

export default function TopNavbar() {
    return (
        <header className="w-full bg-white dark:bg-gray-900 border-b dark:border-gray-800">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">
                    {/* Left: logo */}
                    <div className="flex items-center flex-shrink-0">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold">G</div>
                            <span className="hidden sm:inline-block text-lg font-semibold text-gray-900 dark:text-white">GFF - Movie Administration</span>
                        </Link>
                    </div>

                    {/* Center: search */}
                    <div className="flex-1 flex justify-center px-4">
                        <div className="w-full max-w-lg">
                            <div className="relative">
                                <input
                                    type="search"
                                    placeholder="Search"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 dark:text-white"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                    <HiSearch className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: icons + avatar + dark mode */}
                    <div className="flex items-center space-x-4">
                        <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
                            <HiBell className="w-5 h-5" />
                        </button>

                        {/* Dark mode toggle button */}
                        <div className="sm:ml-0">
                            <DarkModeToggle />
                        </div>

                        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img src="/templatediploma.png" alt="avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
