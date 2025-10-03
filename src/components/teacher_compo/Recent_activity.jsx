import React from 'react'
import { FileText, Plus, Users } from "lucide-react"
import Link from "next/link"



export default function Recent_activity() {
  return (
    <div>
      <div className="p-6 mt-6 bg-white rounded-lg shadow-sm">
           
            <div className="space-y-4">
              <ActivityItem
                icon={
                  <div className="p-1.5 bg-emerald-100 rounded-full">
                    <FileText className="w-4 h-4 text-emerald-500" />
                  </div>
                }
                title="Physics Exam completed by Class 10A"
                time="2 minutes ago"
              />
              <ActivityItem
                icon={
                  <div className="p-1.5 bg-emerald-100 rounded-full">
                    <Plus className="w-4 h-4 text-emerald-500" />
                  </div>
                }
                title="25 new Questions added to Chemistry"
                time="15 minutes ago"
              />
              <ActivityItem
                icon={
                  <div className="p-1.5 bg-emerald-100 rounded-full">
                    <Users className="w-4 h-4 text-emerald-500" />
                  </div>
                }
                title="New examinee group added: Class 11B"
                time="1 hour ago"
              />
            </div>
          </div>
    </div>
  )
}

function ActivityItem({ icon, title, time }) {
    return (
      <div className="flex items-start gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-gray-800">{title}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
    )
  }