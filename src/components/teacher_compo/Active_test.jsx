"use client"

import React from 'react'
import { Plus } from "lucide-react"
import { useRouter } from 'next/navigation';



export default function Active_test() {

  const router = useRouter();

  return (
    <div>
      {/* Create Exam Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push('/teacher/createTest')}
          className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Create New Exam
        </button>
      </div>

      {/* Exam Sessions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              <th className="px-6 py-4">Exam Title</th>
              <th className="px-6 py-4">Class</th>
              <th className="px-6 py-4">Examinees</th>
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <QuizSessionRow title="Physics Mid-Term" className="SYBCA-C" students="45/50" progress={45 / 50 * 100} />
            <QuizSessionRow title="Chemistry Exam" className="FYBCA-A" students="38/40" progress={38 / 40 * 100} />
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {/* You can uncomment this when there are no active exams */}
      {/* 
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Exams</h3>
        <p className="text-gray-500 mb-6">Create your first exam to get started</p>
        <button
          onClick={() => router.push('/teacher/createTest')}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Create Exam
        </button>
      </div>
      */}
    </div>
  )
}



function QuizSessionRow({ title, className, students, progress }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{title}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{className}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{students}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 py-1 text-xs font-medium text-emerald-800 bg-emerald-100 rounded-full">Active</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a href="#" className="text-emerald-500 hover:text-emerald-700">
          View Details
        </a>
      </td>
    </tr>
  )
}


