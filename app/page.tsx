"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Download, ChevronLeft, ChevronRight, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  fullName: string
  nickname: string
  phone: string
  email: string
  attendanceTime: string
}

const translations = {
  vi: {
    languageToggle: "English",
    classOf: "Class of 2025",
    graduationCelebration: "Graduation Celebration",
    shareMemory: "Hãy cùng chia sẻ khoảnh khắc đáng nhớ này với tôi!",
    pleaseJoin: "VUI LÒNG THAM GIA",
    graduationParty: "LỄ TỐT NGHIỆP",
    inHonorOf: "VINH DANH",
    graduateName: "NGUYỄN VĂN A",
    university: "TRƯỜNG ĐẠI HỌC BÁCH KHOA TP.HCM",
    sunday: "CHỦ NHẬT",
    december: "THÁNG 12",
    timeRange: "9:30 SÁNG ĐẾN 12:00 TRƯA",
    venue: "KHÁCH SẠN GRAND PLAZA",
    address1: "123 ĐƯỜNG ABC, QUẬN 1",
    address2: "TP. HỒ CHÍ MINH",
    pleaseConfirm: "VUI LÒNG XÁC NHẬN THAM DỰ BÊN DƯỚI",
    confirmAttendance: "Xác nhận tham dự",
    fillInfo: "Vui lòng điền thông tin để nhận thiệp mời cá nhân",
    fullName: "Họ và tên",
    fullNamePlaceholder: "Nhập họ và tên đầy đủ",
    nickname: "Tên tôi thường gọi bạn",
    nicknamePlaceholder: "Tên thân thiết (không bắt buộc)",
    phone: "Số điện thoại",
    phonePlaceholder: "Nhập số điện thoại",
    email: "Email",
    emailPlaceholder: "Nhập địa chỉ email",
    attendanceTime: "Giờ tham dự",
    confirmButton: "Xác nhận tham dự",
    thankYou: "Cảm ơn bạn!",
    confirmationMessage: "Xác nhận tham dự của bạn đã được ghi nhận. Thiệp mời cá nhân đã được tạo sẵn cho bạn.",
    attendanceInfo: "Thông tin tham dự:",
    name: "Tên:",
    alias: "Biệt danh:",
    time: "Giờ tham dự:",
    downloadInvitation: "Tải thiệp mời cá nhân",
    thanksFromGraduate: "Lời cảm ơn từ tân cử nhân",
    message1: "Tôi rất hạnh phúc được chia sẻ khoảnh khắc đặc biệt này với bạn.",
    message2: "Cảm ơn bạn đã đồng hành cùng tôi trong hành trình học tập.",
    message3: "Hãy đến và cùng tôi tạo nên những kỷ niệm đẹp nhé!",
    copyright: "© 2025 Class of 2025 Graduation Celebration. Made with ❤️",
    fillAllFields: "Vui lòng điền đầy đủ thông tin",
    requiredFields: "Họ tên, email và giờ tham dự là bắt buộc.",
    confirmSuccess: "Xác nhận thành công!",
    confirmSuccessDesc: "Cảm ơn bạn đã xác nhận tham dự. Thiệp mời cá nhân đã được tạo.",
    downloadSuccess: "Tải xuống thành công!",
    downloadSuccessDesc: "Thiệp mời đã được tải về máy của bạn.",
  },
  en: {
    languageToggle: "Tiếng Việt",
    classOf: "Class of 2025",
    graduationCelebration: "Graduation Celebration",
    shareMemory: "Let's share this memorable moment together with me!",
    pleaseJoin: "PLEASE JOIN US FOR A",
    graduationParty: "GRADUATION PARTY",
    inHonorOf: "IN HONOR OF",
    graduateName: "NGUYEN VAN A",
    university: "HO CHI MINH CITY UNIVERSITY OF TECHNOLOGY",
    sunday: "SUNDAY",
    december: "DECEMBER",
    timeRange: "9:30 AM TO 12:00 PM",
    venue: "GRAND PLAZA HOTEL",
    address1: "123 ABC STREET, DISTRICT 1",
    address2: "HO CHI MINH CITY",
    pleaseConfirm: "PLEASE CONFIRM YOUR ATTENDANCE BELOW",
    confirmAttendance: "Confirm Attendance",
    fillInfo: "Please fill in your information to receive a personalized invitation",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    nickname: "What I usually call you",
    nicknamePlaceholder: "Nickname (optional)",
    phone: "Phone Number",
    phonePlaceholder: "Enter phone number",
    email: "Email",
    emailPlaceholder: "Enter email address",
    attendanceTime: "Attendance Time",
    confirmButton: "Confirm Attendance",
    thankYou: "Thank You!",
    confirmationMessage:
      "Your attendance confirmation has been recorded. A personalized invitation has been created for you.",
    attendanceInfo: "Attendance Information:",
    name: "Name:",
    alias: "Nickname:",
    time: "Attendance Time:",
    downloadInvitation: "Download Personal Invitation",
    thanksFromGraduate: "Thanks from the Graduate",
    message1: "I am very happy to share this special moment with you.",
    message2: "Thank you for accompanying me on this learning journey.",
    message3: "Please come and help me create beautiful memories!",
    copyright: "© 2025 Class of 2025 Graduation Celebration. Made with ❤️",
    fillAllFields: "Please fill in all required information",
    requiredFields: "Full name, email and attendance time are required.",
    confirmSuccess: "Confirmation Successful!",
    confirmSuccessDesc: "Thank you for confirming your attendance. A personalized invitation has been created.",
    downloadSuccess: "Download Successful!",
    downloadSuccessDesc: "The invitation has been downloaded to your device.",
  },
}

const slideshowImages = [
  {
    src: "/graduation-photo-portrait.jpg",
    title: "Class of 2025",
    subtitle: "Graduation Celebration",
    description: "Hãy cùng chia sẻ khoảnh khắc đáng nhớ này với tôi!",
  },
  {
    src: "/images/industry/education.png",
    title: "Lễ Tốt Nghiệp",
    subtitle: "Khoảnh Khắc Đáng Nhớ",
    description: "Cùng nhau tạo nên những kỷ niệm đẹp nhất!",
  },
  {
    src: "/university-campus-with-graduation-decorations.jpg",
    title: "Trường Đại Học",
    subtitle: "Nơi Khởi Đầu Ước Mơ",
    description: "Từ đây, chúng ta bước vào tương lai tươi sáng!",
  },
]

export default function GraduationInvitation() {
  const [language, setLanguage] = useState<"vi" | "en">("vi")
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    nickname: "",
    phone: "",
    email: "",
    attendanceTime: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { toast } = useToast()

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "vi" ? "en" : "vi"))
  }

  const t = translations[language]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideshowImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideshowImages.length) % slideshowImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.email || !formData.attendanceTime) {
      toast({
        title: t.fillAllFields,
        description: t.requiredFields,
        variant: "destructive",
      })
      return
    }
    setIsSubmitted(true)
    toast({
      title: t.confirmSuccess,
      description: t.confirmSuccessDesc,
    })
  }

  const generateInvitationCard = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#1e3a8a")
    gradient.addColorStop(1, "#3b82f6")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    ctx.beginPath()
    ctx.arc(700, 100, 60, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#facc15"
    ctx.fillRect(660, 80, 80, 8)
    ctx.fillRect(690, 70, 20, 20)

    ctx.fillStyle = "#e5e7eb"
    ctx.font = "italic 28px serif"
    ctx.textAlign = "center"
    ctx.fillText("class of", canvas.width / 2, 120)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 72px Arial"
    ctx.fillText("2025", canvas.width / 2, 200)

    ctx.font = "16px Arial"
    ctx.fillStyle = "#e5e7eb"
    ctx.fillText(language === "vi" ? "VUI LÒNG THAM GIA" : "PLEASE JOIN US FOR A", canvas.width / 2, 250)

    ctx.font = "bold 32px Arial"
    ctx.fillStyle = "#ffffff"
    ctx.fillText(language === "vi" ? "LỄ TỐT NGHIỆP" : "GRADUATION PARTY", canvas.width / 2, 285)

    ctx.font = "16px Arial"
    ctx.fillStyle = "#e5e7eb"
    ctx.fillText(language === "vi" ? "VINH DANH" : "IN HONOR OF", canvas.width / 2, 315)

    const displayName = formData.nickname || formData.fullName
    ctx.font = "bold 28px Arial"
    ctx.fillStyle = "#facc15"
    ctx.fillText(displayName.toUpperCase(), canvas.width / 2, 355)

    ctx.font = "14px Arial"
    ctx.fillStyle = "#e5e7eb"
    ctx.fillText(t.university, canvas.width / 2, 380)

    ctx.font = "18px Arial"
    ctx.fillStyle = "#ffffff"
    const dateText = language === "vi" ? "CHỦ NHẬT    15    THÁNG 12" : "SUNDAY    15    DECEMBER"
    ctx.fillText(dateText, canvas.width / 2, 430)
    const timeText =
      language === "vi" ? `${formData.attendanceTime} - 12:00 TRƯA` : `${formData.attendanceTime} - 12:00 PM`
    ctx.fillText(timeText, canvas.width / 2, 455)

    ctx.font = "bold 20px Arial"
    ctx.fillStyle = "#ffffff"
    ctx.fillText(t.venue, canvas.width / 2, 490)
    ctx.font = "14px Arial"
    ctx.fillStyle = "#e5e7eb"
    ctx.fillText(t.address1, canvas.width / 2, 510)
    ctx.fillText(t.address2, canvas.width / 2, 530)

    ctx.font = "italic 16px Arial"
    ctx.fillStyle = "#facc15"
    ctx.fillText(t.shareMemory, canvas.width / 2, 570)

    return canvas.toDataURL("image/png")
  }

  const downloadInvitation = () => {
    const dataUrl = generateInvitationCard()
    if (!dataUrl) return

    const displayName = formData.nickname || formData.fullName
    const link = document.createElement("a")
    link.download = `graduation-invitation-${displayName.replace(/\s+/g, "-")}.png`
    link.href = dataUrl
    link.click()

    toast({
      title: t.downloadSuccess,
      description: t.downloadSuccessDesc,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleLanguage}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-primary/20 hover:bg-white"
        >
          <Globe className="w-4 h-4 mr-2" />
          {t.languageToggle}
        </Button>
      </div>

      {/* Header Section with Slideshow */}
      <header className="bg-primary text-primary-foreground py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary z-0"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center relative overflow-hidden shadow-2xl">
              <img
                src={slideshowImages[currentSlide].src || "/placeholder.svg"}
                alt={`Slide ${currentSlide + 1}`}
                className="w-44 h-44 rounded-full object-cover transition-all duration-700 ease-in-out transform hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="w-20 h-20 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <GraduationCap className="w-10 h-10 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-4 text-balance">{t.classOf}</h1>
          <h2 className="text-3xl mb-4 font-light">{t.graduationCelebration}</h2>
          <p className="text-xl opacity-90 font-light italic">{t.shareMemory}</p>
        </div>
        <div className="absolute inset-y-0 left-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="text-white hover:bg-white/20 rounded-full w-12 h-12 backdrop-blur-sm border border-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="text-white hover:bg-white/20 rounded-full w-12 h-12 backdrop-blur-sm border border-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slideshowImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 border-2 border-white/50 ${
                index === currentSlide
                  ? "bg-white scale-110 border-white"
                  : "bg-white/30 hover:bg-white/60 hover:scale-105"
              }`}
              aria-label={`Chuyển đến slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-accent/20 rounded-full blur-lg"></div>
      </header>

      {/* Event Details Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center border">
            <div className="mb-6">
              <GraduationCap className="w-12 h-12 mx-auto text-primary" />
            </div>
            <div className="mb-8">
              <p className="text-2xl font-light text-gray-600 italic mb-2">class of</p>
              <h2 className="text-8xl font-bold text-primary leading-none">2025</h2>
            </div>
            <div className="mb-8 space-y-2">
              <p className="text-sm uppercase tracking-wider text-gray-600">{t.pleaseJoin}</p>
              <h3 className="text-3xl font-bold text-gray-900">{t.graduationParty}</h3>
              <p className="text-sm uppercase tracking-wider text-gray-600">{t.inHonorOf}</p>
              <h4 className="text-2xl font-semibold text-gray-900 mt-4">{t.graduateName}</h4>
              <p className="text-sm text-gray-600">{t.university}</p>
            </div>
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm uppercase tracking-wider text-gray-600">{t.sunday}</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">15</p>
                </div>
                <div className="text-center">
                  <p className="text-sm uppercase tracking-wider text-gray-600">{t.december}</p>
                </div>
              </div>
              <p className="text-lg text-gray-700">{t.timeRange}</p>
            </div>
            <div className="mb-8">
              <p className="text-lg font-semibold text-gray-900">{t.venue}</p>
              <p className="text-sm text-gray-600">{t.address1}</p>
              <p className="text-sm text-gray-600">{t.address2}</p>
            </div>
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600">{t.pleaseConfirm}</p>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Form Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4">{t.confirmAttendance}</h2>
            <p className="text-muted-foreground">{t.fillInfo}</p>
          </div>
          {!isSubmitted ? (
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="fullName" className="text-base font-semibold text-primary">
                      {t.fullName} *
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder={t.fullNamePlaceholder}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nickname" className="text-base font-semibold text-primary">
                      {t.nickname}
                    </Label>
                    <Input
                      id="nickname"
                      value={formData.nickname}
                      onChange={(e) => handleInputChange("nickname", e.target.value)}
                      placeholder={t.nicknamePlaceholder}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-base font-semibold text-primary">
                      {t.phone} *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base font-semibold text-primary">
                      {t.email} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-base font-semibold text-primary mb-4 block">{t.attendanceTime} *</Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {["9h30", "10h", "10h30", "11h", "11h30"].map((time) => (
                        <label
                          key={time}
                          className={`
                            flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                            ${
                              formData.attendanceTime === time
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-gray-200 hover:border-primary/50 bg-white"
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="attendanceTime"
                            value={time}
                            checked={formData.attendanceTime === time}
                            onChange={(e) => handleInputChange("attendanceTime", e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{time}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-semibold"
                  >
                    {t.confirmButton}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{t.thankYou}</h3>
                <p className="text-muted-foreground mb-6">{t.confirmationMessage}</p>
                <div className="space-y-4">
                  <div className="p-4 bg-card rounded-lg border">
                    <p className="font-semibold">{t.attendanceInfo}</p>
                    <p>
                      {t.name} {formData.fullName}
                    </p>
                    {formData.nickname && (
                      <p>
                        {t.alias} {formData.nickname}
                      </p>
                    )}
                    <p>
                      {t.time} {formData.attendanceTime}
                    </p>
                  </div>
                  <Button onClick={downloadInvitation} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Download className="w-4 h-4 mr-2" />
                    {t.downloadInvitation}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-2xl font-bold mb-2">{t.thanksFromGraduate}</h3>
          </div>
          <div className="space-y-4 text-lg opacity-90">
            <p>{t.message1}</p>
            <p>{t.message2}</p>
            <p>{t.message3}</p>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-foreground/20">
            <p className="text-sm opacity-75">{t.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
