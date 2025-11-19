// [org]/sports-members/[id]/edit/page.tsx
import prisma from '@/lib/prisma'
import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, User, Phone, School, IdCard, MapPin, Droplet } from 'lucide-react'
import Link from 'next/link'

type Props = {
  params: Promise<{
    org: string
    id: string
  }>
}

const EditMemberPage: React.FC<Props> = async ({ params }) => {
  const { org, id } = await params
  console.log(org, id)
  const [organization, member] = await Promise.all([
    prisma.organization.findUnique({
        where: {
            slug: org
        }
    }),
    prisma.sports_member.findUnique({
      where: { id },
      include: {
        groupMembers: {
          include: {
            group: true
          }
        }
      }
    })
  ])

  if (!organization) {
    throw new Error("No organization found")
  }

  if (!member || member.organizationId !== organization.id) {
    notFound()
  }

  // Get all groups for this organization
  const groups = await prisma.group.findMany({
    where: {
      organizationId: organization.id
    },
    orderBy: {
      name: 'asc'
    }
  })

  const categories = [
    'Football',
    'Basketball',
    'Athletics',
    'Swimming',
    'Volleyball',
    'Handball',
    'Tennis',
    'Martial Arts',
    'Gymnastics',
    'Other'
  ]

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  
  const educationLevels = [
    'Preschool',
    'Primary',
    'Middle School',
    'High School',
    'University',
    'Graduate'
  ]

  async function updateMember(formData: FormData) {
    'use server'
    
    const memberId = formData.get('memberId') as string
    const organizationSlug = formData.get('organizationSlug') as string

    try {
      await prisma.sports_member.update({
        where: { id: memberId },
        data: {
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          fatherName: formData.get('fatherName') as string,
          motherFullName: formData.get('motherFullName') as string,
          bloodType: formData.get('bloodType') as string,
          educationLevel: formData.get('educationLevel') as string,
          schoolName: formData.get('schoolName') as string,
          fatherPhone: formData.get('fatherPhone') as string,
          category: formData.get('category') as string,
          nationalId: formData.get('nationalId') as string,
          idCardNumber: formData.get('idCardNumber') as string,
          address: formData.get('address') as string,
          photoUrl: formData.get('photoUrl') as string || null,
        }
      })

      redirect(`/${organizationSlug}/sports-members/${memberId}`)
    } catch (error) {
      console.error('Error updating member:', error)
      throw error
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/${org}/sports-members/${member.id}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Member
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Member</h1>
        <p className="text-muted-foreground mt-1">
          Update {member.firstName} {member.lastName}&rsquo;s information
        </p>
      </div>

      {/* Form */}
      <form action={updateMember}>
        <input type="hidden" name="memberId" value={member.id} />
        <input type="hidden" name="organizationSlug" value={org} />

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Basic details about the member</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={member.firstName}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={member.lastName}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father&rsquo;s Name *</Label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    defaultValue={member.fatherName}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherFullName">Mother&rsquo;s Full Name *</Label>
                  <Input
                    id="motherFullName"
                    name="motherFullName"
                    defaultValue={member.motherFullName}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photoUrl">Photo URL</Label>
                <Input
                  id="photoUrl"
                  name="photoUrl"
                  type="url"
                  defaultValue={member.photoUrl || ''}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Medical & Physical */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5" />
                Medical Information
              </CardTitle>
              <CardDescription>Health and physical details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type *</Label>
                  <Select name="bloodType" defaultValue={member.bloodType} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Sport Category *</Label>
                  <Select name="category" defaultValue={member.category} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Education
              </CardTitle>
              <CardDescription>Academic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Education Level *</Label>
                  <Select name="educationLevel" defaultValue={member.educationLevel} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input
                    id="schoolName"
                    name="schoolName"
                    defaultValue={member.schoolName}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact & Identification
              </CardTitle>
              <CardDescription>Contact details and official documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fatherPhone">Father&rsquo;s Phone *</Label>
                <Input
                  id="fatherPhone"
                  name="fatherPhone"
                  type="tel"
                  defaultValue={member.fatherPhone}
                  placeholder="+213555123456"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationalId">National ID *</Label>
                  <Input
                    id="nationalId"
                    name="nationalId"
                    defaultValue={member.nationalId}
                    placeholder="123456789012"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idCardNumber">ID Card Number *</Label>
                  <Input
                    id="idCardNumber"
                    name="idCardNumber"
                    defaultValue={member.idCardNumber}
                    placeholder="ID001234"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address
              </CardTitle>
              <CardDescription>Residential information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                {/* @ts-ignore */}
                <Textarea
                  id="address"
                  name="address"
                  defaultValue={member.address}
                  placeholder="Street address, city, postal code"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Current Groups Info (Read-only) */}
          {member.groupMembers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Current Groups</CardTitle>
                <CardDescription>
                  Groups are managed separately. Go to the member&rsquo;s detail page to modify groups.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {member.groupMembers.map((gm) => (
                    <div
                      key={gm.groupId}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {gm.group.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Link href={`/${org}/sports-members/${member.id}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditMemberPage