"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AttendanceConfirmation {
  id: string
  full_name: string
  nickname?: string
  phone: string
  email: string
  attendance_time: string
  created_at: string
}

export default function AdminPage() {
  const [attendances, setAttendances] = useState<AttendanceConfirmation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchAttendances = async () => {
    try {
      const response = await fetch('/api/attendance')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch attendances')
      }

      setAttendances(result.data || [])
    } catch (error) {
      console.error('Error fetching attendances:', error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tham dự. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAttendances()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAttendances()
  }

  const exportToCSV = () => {
    const headers = ['Tên đầy đủ', 'Biệt danh', 'Số điện thoại', 'Email', 'Giờ tham dự', 'Ngày đăng ký']
    const csvContent = [
      headers.join(','),
      ...attendances.map(att => [
        `"${att.full_name}"`,
        `"${att.nickname || ''}"`,
        `"${att.phone}"`,
        `"${att.email}"`,
        `"${att.attendance_time}"`,
        `"${new Date(att.created_at).toLocaleString('vi-VN')}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `graduation-attendances-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Xuất file thành công",
      description: "Danh sách tham dự đã được xuất ra file CSV.",
    })
  }

  const getAttendanceTimeStats = () => {
    const stats = attendances.reduce((acc, att) => {
      acc[att.attendance_time] = (acc[att.attendance_time] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return stats
  }

  const stats = getAttendanceTimeStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2 flex items-center">
                <GraduationCap className="w-10 h-10 mr-3" />
                Quản lý tham dự
              </h1>
              <p className="text-muted-foreground">Danh sách người xác nhận tham dự lễ tốt nghiệp</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button onClick={exportToCSV} disabled={attendances.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Xuất CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">{attendances.length}</p>
                  <p className="text-sm text-muted-foreground">Tổng số người tham dự</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {Object.entries(stats).map(([time, count]) => (
            <Card key={time}>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{count}</p>
                  <p className="text-sm text-muted-foreground">Lúc {time}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Attendance List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách tham dự</CardTitle>
          </CardHeader>
          <CardContent>
            {attendances.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Chưa có ai xác nhận tham dự</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attendances.map((attendance) => (
                  <div
                    key={attendance.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{attendance.full_name}</h3>
                        {attendance.nickname && (
                          <span className="text-sm text-muted-foreground">
                            ({attendance.nickname})
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <p>📧 {attendance.email}</p>
                        <p>📱 {attendance.phone}</p>
                        <p>⏰ {attendance.attendance_time}</p>
                        <p>📅 {new Date(attendance.created_at).toLocaleString('vi-VN')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
