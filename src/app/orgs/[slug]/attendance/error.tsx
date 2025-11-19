// /[org]/attendance/error.tsx
"use client"
import React from 'react'

type Props = {
  error: Error & { digest?: string }
}

const AttendanceError: React.FC<Props> = (props) => {
  console.log({error: props.error})
  return (
    <div>AttendanceError</div>
  )
}

export default AttendanceError