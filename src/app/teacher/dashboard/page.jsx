"use client"
import Image from "next/image";
import Infobar_top from "@/components/teacher_compo/Infobar_top";
import Active_test from "@/components/teacher_compo/Active_test";
import Recent_activity from "@/components/teacher_compo/Recent_activity";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Bell, Settings, LogOut, User } from 'lucide-react';

export default function Dashboard() {
    const [teacher, setTeacher] = useState(null); // Initialize with null
    const router = useRouter();

    useEffect(() => {
        const teacherData = localStorage.getItem('Authteachers');
        if (teacherData) {  
            const parsedData = JSON.parse(teacherData);
            console.log('teacher data from localStorage:', parsedData);
            setTeacher(parsedData);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('Authteachers'); // Remove teacher data from localStorage
        setTeacher(null); // Clear teacher state
        router.push('/'); // Redirect to login page
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
            {/* Main Content */}
            <div className="flex-1">
                {/* Enhanced Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Dashboard
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Welcome back, manage your exams and track progress
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {teacher && (
                                <>
                                    {/* Notification Bell */}
                                    <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200">
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </button>

                                    {/* Settings */}
                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200">
                                        <Settings className="w-5 h-5" />
                                    </button>

                                    {/* Profile Section */}
                                    <div className="flex items-center space-x-3 bg-gray-50 rounded-full pl-3 pr-1 py-1 hover:bg-gray-100 transition-all duration-200">
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-800">{teacher.full_name}</p>
                                            <p className="text-xs text-gray-500">Examiner</p>
                                        </div>
                                        <div className="w-10 h-10 overflow-hidden rounded-full ring-2 ring-indigo-100">
                                            <Image
                                                src="https://media.licdn.com/dms/image/v2/D5603AQEsnkbsu4SOOQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1703611781428?e=1746662400&v=beta&t=vRjNdVVL9Wd4w1FBBIdKa2Lg4Y3Occyc_-SF9XhBhlI"
                                                alt="Profile"
                                                width={40}
                                                height={40}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Enhanced Main Content */}
                <main className="p-6 space-y-8">
                    {/* Welcome Card */}
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">
                                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {teacher?.full_name?.split(' ')[0] || 'Examiner'}! 👋
                                </h2>
                                <p className="text-indigo-100 text-lg">
                                    Ready to create amazing exam experiences today?
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                                    <User className="w-12 h-12 text-white/80" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Overview Statistics</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>Live Data</span>
                            </div>
                        </div>
                        <Infobar_top />
                    </div>

                    {/* Content Grid - Full Width Layout */}
                    <div className="space-y-8">
                        {/* Active Exams - Full Width */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                            <svg className="w-6 h-6 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                            Active Exam Sessions
                                        </h3>
                                        <p className="text-gray-600 mt-1">Monitor ongoing examinations and manage exam sessions</p>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span>2 Active</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <Active_test />
                            </div>
                        </div>

                        {/* Bottom Grid - Recent Activity and Quick Actions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Activity */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                        <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Recent Activity
                                    </h3>
                                    <p className="text-gray-600 mt-1">Latest updates and notifications</p>
                                </div>
                                <div className="p-6">
                                    <Recent_activity />
                                </div>
                            </div>

                            {/* Quick Actions Panel */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                        <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Quick Actions
                                    </h3>
                                    <p className="text-gray-600 mt-1">Frequently used tools and shortcuts</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-gray-800">Create New Exam</p>
                                                <p className="text-sm text-gray-600">Design questions and settings</p>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-gray-800">View Reports</p>
                                                <p className="text-sm text-gray-600">Analyze exam performance</p>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100 hover:from-orange-100 hover:to-red-100 transition-all duration-200 group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-gray-800">Manage Examinees</p>
                                                <p className="text-sm text-gray-600">Add or edit examinee profiles</p>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
