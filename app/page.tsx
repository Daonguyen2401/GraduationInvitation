"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { GraduationCap, Download, Globe, ChevronLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MultiImageCarousel, type MultiImageCarouselHandle } from "@/components/multi-image-carousel"
import { getBackgroundImages } from "@/lib/image-utils"

interface FormData {
  fullName: string
  nickname: string
  phone: string
  email: string
  attendanceTime: string
}

interface FormErrors {
  phone?: string
  email?: string
}

const translations = {
  vi: {
    languageToggle: "English",
    classOf: "Class of 2025",
    graduationCelebration: "Graduation Celebration",
    shareMemory: "Hãy cùng chia sẻ khoảnh khắc đáng nhớ này với tôi!",
    graduationOf: "Lễ tốt nghiệp của Trần Đức Đào Nguyên",
    graduationTitle: "Lễ tốt nghiệp của Trần Đức Đào Nguyên",
    pleaseJoin: "THƯ MỜI THAM GIA",
    graduationParty: "LỄ TỐT NGHIỆP",
    inHonorOf: "Tân cử nhân",
    graduateName: "TRẦN ĐỨC ĐÀO NGUYÊN",
    university: "TRƯỜNG ĐẠI HỌC BÁCH KHOA HÀ NỘI",
    sunday: "CHỦ NHẬT",
    december: "THÁNG 9",
    timeRange: "9:30 SÁNG ĐẾN 12:00 TRƯA",
    venue: "ĐẠI HỌC BÁCH KHOA HÀ NỘI",
    address1: "Tòa nhà C2, số 1 Đại Cồ Việt",
    address2: "Phường Bạch Mai, TP. Hà Nội",
    pleaseConfirm: "VUI LÒNG XÁC NHẬN THAM DỰ BÊN DƯỚI",
    confirmAttendance: "Xác nhận tham dự",
    fillInfo: "Vui lòng điền thông tin để nhận thiệp mời cá nhân",
    gratitudeQuote: "Xin được gửi lời cảm ơn chân thành đến gia đĩnh, và những ngươì bạn của con/mình - những người đã cho con/mình cơ hội được trưởng thành, luôn đồng hành và cứu con/mình khỏi những khó khăn đã trải qua. Nếu không có mọi người, con/mình không thể tới được ngày hôm nay. Con/mình rất mong được chia sẻ khoảnh khắc tốt nghiệp cùng mọi người.",
    gratitudeQuoteEn: "My heartfelt thanks to my family and friends — those who gave me the chance to grow, stood by me, and helped me through the hardest moments. Without you, I wouldn’t be here today. I would be honored to share this graduation moment with you.",
    fullName: "Họ và tên",
    fullNamePlaceholder: "Nhập họ và tên đầy đủ",
    nickname: "Tên tôi thường gọi bạn",
    nicknamePlaceholder: "Nickname (không bắt buộc)",
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
    contactInfo: "Thông tin liên hệ",
    contactName: "Trần Đức Đào Nguyên",
    contactPhone: "0906605877",
    contactEmail: "tranducdaonguyen@gmail.com",
    contactFacebook: "Facebook: Trần Đức Đào Nguyên",
    copyright: "© Made by Daonguyen and Vibecoding AI. Made with ❤️",
    fillAllFields: "Vui lòng điền đầy đủ thông tin",
    requiredFields: "Họ tên, email và giờ tham dự là bắt buộc.",
    confirmSuccess: "Xác nhận thành công!",
    confirmSuccessDesc: "Cảm ơn bạn đã xác nhận tham dự. Thiệp mời cá nhân đã được tạo.",
    downloadSuccess: "Tải xuống thành công!",
    downloadSuccessDesc: "Thiệp mời đã được tải về máy của bạn.",
    invalidPhone: "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10-11 chữ số).",
    invalidEmail: "Email không hợp lệ. Vui lòng nhập địa chỉ email đúng định dạng.",
  },
  en: {
    languageToggle: "Tiếng Việt",
    classOf: "Class of 2025",
    graduationCelebration: "Graduation Celebration",
    shareMemory: "Let's share this memorable moment together with me!",
    graduationOf: "Graduation of Tran Duc Dao Nguyen",
    graduationTitle: "Graduation of Tran Duc Dao Nguyen",
    pleaseJoin: "PLEASE JOIN US FOR A",
    graduationParty: "GRADUATION PARTY",
    inHonorOf: "IN HONOR OF",
    graduateName: "TRAN DUC DAO NGUYEN",
    university: "HANOI UNIVERSITY OF SCIENCE AND TECHNOLOGY",
    sunday: "SUNDAY",
    december: "SEPTEMBER",
    timeRange: "9:30 AM TO 12:00 PM",
    venue: "HANOI UNIVERSITY OF SCIENCE AND TECHNOLOGY",
    address1: "Building C2, No. 1 Dai Co Viet",
    address2: "Bach Mai Ward, Hanoi City",
    pleaseConfirm: "PLEASE CONFIRM YOUR ATTENDANCE BELOW",
    confirmAttendance: "Confirm Attendance",
    fillInfo: "Please fill in your information to receive a personalized invitation",
    gratitudeQuote: "Cảm ơn gia đình, thầy cô và bạn bè đã đồng hành cùng tôi trong suốt chặng đường học tập. Nhờ có sự ủng hộ và động viên của mọi người, tôi mới có thể đạt được thành tựu ngày hôm nay. Tôi rất mong được chia sẻ khoảnh khắc đặc biệt này cùng tất cả mọi người!",
    gratitudeQuoteEn: "Thank you to my family, teachers, and friends who have accompanied me throughout my learning journey. Thanks to everyone's support and encouragement, I was able to achieve today's success. I would be honored to share this special moment with all of you!",
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
    contactInfo: "Contact Information",
    contactName: "Tran Duc Dao Nguyen",
    contactPhone: "0906605877",
    contactEmail: "tranducdaonguyen@gmail.com",
    contactFacebook: "Facebook: Tran Duc Dao Nguyen",
    copyright: "© Made by Daonguyen and Vibecoding AI. Made with ❤️",
    fillAllFields: "Please fill in all required information",
    requiredFields: "Full name, email and attendance time are required.",
    confirmSuccess: "Confirmation Successful!",
    confirmSuccessDesc: "Thank you for confirming your attendance. A personalized invitation has been created.",
    downloadSuccess: "Download Successful!",
    downloadSuccessDesc: "The invitation has been downloaded to your device.",
    invalidPhone: "Invalid phone number. Please enter a valid Vietnamese phone number (10-11 digits).",
    invalidEmail: "Invalid email format. Please enter a valid email address.",
  },
}

// Get dynamic background images from utility function
const backgroundImages = getBackgroundImages()

// User's profile logo (center image)
const userProfileImage = "/graduation-photo-portrait.jpg"

// Validation functions
const validatePhone = (phone: string): boolean => {
  // Vietnamese phone number validation: 10-11 digits, can start with 0 or +84
  const phoneRegex = /^(\+84|0)[0-9]{9,10}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function GraduationInvitation() {
  const [language, setLanguage] = useState<"vi" | "en">("vi")
  const [showGratitudeImage, setShowGratitudeImage] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    nickname: "",
    phone: "",
    email: "",
    attendanceTime: "",
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "vi" ? "en" : "vi"))
  }

  const t = translations[language]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    
    // Real-time validation for phone and email
    if (field === 'phone' && value && !validatePhone(value)) {
      setFormErrors((prev) => ({ ...prev, phone: t.invalidPhone }))
    } else if (field === 'email' && value && !validateEmail(value)) {
      setFormErrors((prev) => ({ ...prev, email: t.invalidEmail }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check required fields
    if (!formData.fullName || !formData.email || !formData.attendanceTime) {
      toast({
        title: t.fillAllFields,
        description: t.requiredFields,
        variant: "destructive",
      })
      return
    }
    
    // Validate phone number
    if (formData.phone && !validatePhone(formData.phone)) {
      setFormErrors((prev) => ({ ...prev, phone: t.invalidPhone }))
      toast({
        title: t.fillAllFields,
        description: t.invalidPhone,
        variant: "destructive",
      })
      return
    }
    
    // Validate email
    if (!validateEmail(formData.email)) {
      setFormErrors((prev) => ({ ...prev, email: t.invalidEmail }))
      toast({
        title: t.fillAllFields,
        description: t.invalidEmail,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save attendance confirmation')
      }

      setIsSubmitted(true)
      
      // Generate and display invitation image
      setTimeout(async () => {
        const dataUrl = await generateInvitationCard()
        if (dataUrl) {
          const previewElement = document.getElementById('invitation-preview')
          if (previewElement) {
            previewElement.innerHTML = `<img src="${dataUrl}" alt="Generated Invitation" className="w-full h-auto" />`
          }
        }
      }, 500)
      
      toast({
        title: t.confirmSuccess,
        description: t.confirmSuccessDesc,
      })
    } catch (error) {
      console.error('Error saving attendance confirmation:', error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateInvitationCard = (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve("")
        return
      }

      // A6 format: 105mm x 148mm (portrait orientation)
      // Optimized size for better content distribution
      canvas.width = 600
      canvas.height = 700

      // White background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add simple border
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 2
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

      // Add university logo
      const logo = new Image()
      logo.onload = () => {
        ctx.drawImage(logo, (canvas.width - 100) / 2, 30, 100, 100)
        
        // Continue with the rest of the drawing
        ctx.fillStyle = "#6b7280"
        ctx.font = "italic 18px serif"
        ctx.textAlign = "center"
        ctx.fillText("class of", canvas.width / 2, 170)

        ctx.fillStyle = "#1e40af"
        ctx.font = "bold 42px Arial"
        ctx.fillText("2025", canvas.width / 2, 210)

        ctx.font = "16px Arial"
        ctx.fillStyle = "#6b7280"
        ctx.fillText(language === "vi" ? "THƯ MỜI THAM DỰ" : "INVITATION", canvas.width / 2, 240)

        ctx.font = "bold 28px Arial"
        ctx.fillStyle = "#1e40af"
        ctx.fillText(language === "vi" ? "LỄ TỐT NGHIỆP" : "GRADUATION PARTY", canvas.width / 2, 280)

        ctx.font = "16px Arial"
        ctx.fillStyle = "#6b7280"
        ctx.fillText(language === "vi" ? "XIN MỜI" : "INVITING", canvas.width / 2, 310)

        const displayName = formData.nickname || formData.fullName
        ctx.font = "bold 24px Arial"
        ctx.fillStyle = "#3b82f6"
        ctx.fillText(displayName.toUpperCase(), canvas.width / 2, 340)

        // Format graduate name with line break and bold
        ctx.font = "14px Arial"
        ctx.fillStyle = "#6b7280"
        const graduateText = language === "vi" ? "Tới tham dự lễ tốt nghiệp của cử nhân" : "To attend the graduation ceremony of graduate"
        ctx.fillText(graduateText, canvas.width / 2, 370)
        
        ctx.font = "bold 16px Arial"
        ctx.fillStyle = "#1e40af"
        const graduateName = language === "vi" ? "Trần Đức Đào Nguyên" : "Tran Duc Dao Nguyen"
        ctx.fillText(graduateName, canvas.width / 2, 395)

        ctx.font = "18px Arial"
        ctx.fillStyle = "#1e40af"
        const dateText = language === "vi" ? "CHỦ NHẬT NGÀY 28 THÁNG 9" : "SUNDAY 28 SEPTEMBER"
        ctx.fillText(dateText, canvas.width / 2, 430)
        const timeText =
          language === "vi" ? `${formData.attendanceTime} SÁNG` : `${formData.attendanceTime} AM`
        ctx.fillText(timeText, canvas.width / 2, 455)

        ctx.font = "bold 20px Arial"
        ctx.fillStyle = "#1e40af"
        ctx.fillText(t.venue, canvas.width / 2, 490)
        ctx.font = "14px Arial"
        ctx.fillStyle = "#6b7280"
        ctx.fillText(t.address1, canvas.width / 2, 515)
        ctx.fillText(t.address2, canvas.width / 2, 535)

        ctx.font = "italic 16px Arial"
        ctx.fillStyle = "#3b82f6"
        ctx.fillText(t.shareMemory, canvas.width / 2, 570)

        // Add contact information
        ctx.font = "14px Arial"
        ctx.fillStyle = "#6b7280"
        ctx.fillText(language === "vi" ? "Liên hệ: 0906605877" : "Contact: 0906605877", canvas.width / 2, 600)

        resolve(canvas.toDataURL("image/png"))
      }
      logo.src = "/R.png"
    })
  }

  const downloadInvitation = async () => {
    const dataUrl = await generateInvitationCard()
    if (!dataUrl) return

    // Display the generated image in the preview
    const previewElement = document.getElementById('invitation-preview')
    if (previewElement) {
      previewElement.innerHTML = `<img src="${dataUrl}" alt="Generated Invitation" className="w-full h-auto" />`
    }

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

  const carouselRef = useRef<MultiImageCarouselHandle | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Language Toggle Button */}
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

      {/* Full Screen Multi-Image Carousel */}
      <MultiImageCarousel
        ref={carouselRef as any}
        images={backgroundImages}
        autoPlay={true}
        autoPlayInterval={5000}
        showControls={false}
        showDots={true}
        className="fixed inset-0 z-0"
      />
      
      {/* Main Content Overlay removed per request */}
      
      {/* Decorative Elements */}
      <div className="fixed top-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-xl z-10"></div>
      <div className="fixed bottom-4 right-4 w-12 h-12 bg-accent/20 rounded-full blur-lg z-10"></div>
      
      {/* Page-level Carousel Controls */}
      <div className="fixed inset-y-0 left-0 right-0 pointer-events-none z-50">
        <button
          onClick={() => carouselRef?.current?.prev && carouselRef.current.prev()}
          className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-900 hover:bg-white rounded-full w-12 h-12 backdrop-blur-md border border-white/70 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => carouselRef?.current?.next && carouselRef.current.next()}
          className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-900 hover:bg-white rounded-full w-12 h-12 backdrop-blur-md border border-white/70 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
        >
          {/* using rotate-180 ChevronLeft as right arrow substitute not needed since ChevronRight exists elsewhere, but keep consistent icons */}
          <ChevronLeft className="w-6 h-6 rotate-180" />
        </button>
      </div>

      {/* Scroll Down Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <Button
          onClick={() => {
            document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' })
          }}
          variant="outline"
          size="lg"
          className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 text-white"
        >
          <ChevronLeft className="w-6 h-6 rotate-90" />
        </Button>
      </div>

      {/* Gratitude Quote Section */}
      <section className="py-8 px-4 bg-muted/30 relative z-30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 relative">
            {/* Top-right toggle control */}
            <div className="absolute top-3 right-3 z-10">
              <div className="flex items-center gap-1 bg-transparent px-2 py-1">
                <span className="text-[10px] uppercase text-gray-500">Quote</span>
                <Switch
                  checked={showGratitudeImage}
                  onCheckedChange={setShowGratitudeImage}
                  className="h-5 w-10 data-[state=checked]:bg-gray-800 data-[state=unchecked]:bg-gray-300"
                />
                <span className="text-[10px] uppercase text-gray-500">hust</span>
              </div>
            </div>
            <div className="mb-4">
              <GraduationCap className="w-12 h-12 mx-auto text-primary mb-2" />
              <h2 className="text-3xl font-bold text-primary mb-4">
                {language === "vi" ? "Lời Cảm Ơn" : "Words of Gratitude"}
              </h2>
            </div>
            {showGratitudeImage ? (
              <div className="mt-2">
                <img
                  src="/luubut.jpg"
                  alt={language === "vi" ? "Ảnh lưu bút" : "Guestbook image"}
                  className="mx-auto rounded-2xl shadow-lg w-full max-w-4xl max-h-[32rem] object-contain"
                />
              </div>
            ) : (
              <>
                <blockquote className="text-xl leading-relaxed text-gray-700 italic mb-4">
                  "{language === "vi" ? t.gratitudeQuote : t.gratitudeQuoteEn}"
                </blockquote>
                <div className="text-sm text-gray-500">
                  {language === "vi" ? "— Trần Đức Đào Nguyên —" : "— Tran Duc Dao Nguyen —"}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section id="main-content" className="py-16 px-4 bg-muted/30 relative z-30">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-white/20">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden bg-white shadow-md">
                <img
                  src="/R.png"
                  alt="HUST Logo"
                  className="w-full h-full object-contain p-3"
                />
              </div>
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
                  <p className="text-4xl font-bold text-primary">28</p>
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
      <section className="py-16 px-4 bg-background relative z-30">
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
                      className={`mt-2 ${formErrors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                    )}
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
                      className={`mt-2 ${formErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
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
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? "Đang xử lý..." : t.confirmButton}
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
                
                {/* Generated Invitation Image */}
                <div className="mb-6">
                  <div id="invitation-preview" className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden" style={{maxWidth: '850px'}}>
                    {/* This will be populated by the generated image */}
                  </div>
                </div>
                
                <Button onClick={downloadInvitation} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Download className="w-4 h-4 mr-2" />
                  Tải thiệp mời
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-primary text-primary-foreground py-12 px-4 relative z-30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information - Left Side */}
            <div className="text-left">
              <h4 className="text-2xl font-bold mb-6 text-accent">{t.contactInfo}</h4>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <h5 className="text-lg font-semibold text-white">{t.contactName}</h5>
                </div>
                
                {/* Phone */}
                <div>
                  <p className="text-sm text-primary-foreground/70">
                    {language === "vi" ? "Số điện thoại" : "Phone"}
                  </p>
                  <a 
                    href={`tel:${t.contactPhone}`}
                    className="text-base font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    {t.contactPhone}
                  </a>
                </div>
                
                {/* Email */}
                <div>
                  <p className="text-sm text-primary-foreground/70">
                    {language === "vi" ? "Email" : "Email"}
                  </p>
                  <a 
                    href={`mailto:${t.contactEmail}`}
                    className="text-base font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    {t.contactEmail}
                  </a>
                </div>
                
                {/* Facebook */}
                <div>
                  <p className="text-sm text-primary-foreground/70">
                    {language === "vi" ? "Facebook" : "Facebook"}
                  </p>
                  <a 
                    href="https://www.facebook.com/aonguyen.627730/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-base font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    {t.contactName}
                  </a>
                </div>
              </div>
            </div>
            
            {/* Google Maps - Right Side */}
            <div className="text-left">
              <h4 className="text-xl font-semibold mb-4">
                {language === "vi" ? (
                  <>
                    Vị trí sự kiện: {" "}
                    <a href="https://hustmap.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">hustmap.com</a>
                  </>
                ) : (
                  <>
                    Event Location: {" "}
                    <a href="https://hustmap.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">hustmap.com</a>
                  </>
                )}
              </h4>
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.123456789!2d105.8541234!3d21.0012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4b4c4c4c4c%3A0x4c4c4c4c4c4c4c4c!2zU+G7kSAxIMSQ4bqhaSBD4bu5IFZp4buHdCwgSMOgIE5vaQ!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Event Location Map"
                ></iframe>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center">
            <p className="text-sm opacity-75">{t.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
