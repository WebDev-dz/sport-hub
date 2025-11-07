// components/member-card-pdf.tsx
'use client'

import { Button } from '@/components/ui/button'
import { FileText, Download, Printer } from 'lucide-react'
import { useState } from 'react'

type MemberCardPDFProps = {
  member: {
    id: string
    firstName: string
    lastName: string
    nationalId: string
    category: string
    photoUrl: string | null
    bloodType: string
    educationLevel: string
    schoolName: string
    fatherName: string
    fatherPhone: string
  }
  organizationName: string
  organizationSlug: string
}

export function MemberCardPDF({ member, organizationName, organizationSlug }: MemberCardPDFProps) {
  const [loading, setLoading] = useState(false)

  const printCard = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/${organizationSlug}/players/${member.id}/card`, {
        method: 'GET',
      })

      if (!response.ok) throw new Error('Failed to generate card')

      const html = await response.text()
      
      // Open in new window and trigger print
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(html)
        printWindow.document.close()
        
        // Wait for content to load then print
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
          }, 250)
        }
      }
    } catch (error) {
      console.error('Error printing card:', error)
      alert('فشل في طباعة البطاقة')
    } finally {
      setLoading(false)
    }
  }

  const viewCard = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/${organizationSlug}/players/${member.id}/card`, {
        method: 'GET',
      })

      if (!response.ok) throw new Error('Failed to generate card')

      const html = await response.text()
      const blob = new Blob([html], { type: 'text/html' })
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error viewing card:', error)
      alert('فشل في عرض البطاقة')
    } finally {
      setLoading(false)
    }
  }

  const downloadCard = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/${organizationSlug}/players/${member.id}/card`, {
        method: 'GET',
      })

      if (!response.ok) throw new Error('Failed to generate card')

      const html = await response.text()
      const blob = new Blob([html], { type: 'text/html' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${member.firstName}-${member.lastName}-card.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading card:', error)
      alert('فشل في تحميل البطاقة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={viewCard}
        disabled={loading}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        عرض البطاقة
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={printCard}
        disabled={loading}
        className="gap-2"
      >
        <Printer className="h-4 w-4" />
        طباعة البطاقة
      </Button>
    </div>
  )
}