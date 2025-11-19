// [org]/sessions/loading.tsx
"use client"
import React from 'react'

type Props = {}


const SessionsLoading: React.FC<Props> = () => {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8" dir="rtl">
        <p> ... جاري تحميل البيانات</p>
    </div>
  )
}

export default SessionsLoading