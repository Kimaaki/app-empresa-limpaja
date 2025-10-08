"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useBannerRotation } from "@/hooks/useBannerRotation"
import WhatsAppButton from "@/components/WhatsAppButton"
import ImpactoHigienizacao from "@/components/ImpactoHigienizacao"
import { sendServiceRequest, type ServiceFormData } from "@/lib/emailjs"
import { toast } from "sonner"

import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  Star,
  Users,
  Building2,
  Home,
  UtensilsCrossed,
  Sparkles,
  Shield,
  Trophy,
  MessageCircle,
  Calculator,
  DollarSign,
  Plus,
  Minus,
  AlertTriangle,
  Heart,
  Zap,
  Award
} from "lucide-react"

// 🧩 Importa o sistema de tradução
import i18n from "@/lib/i18n"

// ✅ Detecta o idioma do navegador (pt ou es)
type Lang = "pt" | "es"
const userLang: Lang =
  typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("es")
    ? "es"
    : "pt"

// 🔥 Pega o JSON de tradução correto
const t: any =
  (i18n.hasResourceBundle(userLang, "translation") && i18n.getResourceBundle(userLang, "translation")) ||
  i18n.getResourceBundle("pt", "translation")

export default function LimpsZoneApp() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Banner simples com base no idioma
  const banners = [
    {
      title: t.heroTitle || "Limpeza Profissional em Portugal",
      subtitle: t.heroSubtitle || "Transformamos o seu espaço com qualidade e confiança",
      cta: t.cta || "Solicitar Orçamento",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=600&fit=crop"
    }
  ]

  const { currentBanner } = useBannerRotation(banners.length, 5000)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Cabeçalho */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Limpszone</h1>
                <p className="text-sm text-gray-600">
                  {userLang === "es" ? "Limpieza Profesional en Portugal" : "Limpeza Profissional Portugal"}
                </p>
              </div>
            </div>
            <WhatsAppButton className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-4 py-2 rounded-md inline-flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </header>

      {/* Banner */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBanner ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative h-full flex items-center justify-center text-center text-white px-4">
                <div className="max-w-4xl">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">{banner.title}</h2>
                  <p className="text-xl md:text-2xl mb-8">{banner.subtitle}</p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-3"
                    onClick={() => setIsFormOpen(true)}
                  >
                    {banner.cta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Mensagem de sucesso */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>
              {userLang === "es"
                ? "✅ Solicitud enviada con éxito. Nos pondremos en contacto pronto."
                : "✅ Solicitação enviada com sucesso! Entraremos em contacto em breve."}
            </span>
          </div>
        </div>
      )}

      {/* Conteúdo de exemplo */}
      <section className="py-20 text-center bg-white">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {userLang === "es" ? "Servicios Profesionales de Limpieza" : "Serviços Profissionais de Limpeza"}
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 text-lg">
          {userLang === "es"
            ? "Transformamos tu hogar o negocio con calidad, confianza y productos ecológicos."
            : "Transformamos o seu lar ou empresa com qualidade, confiança e produtos ecológicos."}
        </p>
        <Button
          className="mt-8 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-3 rounded-lg"
          onClick={() => setIsFormOpen(true)}
        >
          {userLang === "es" ? "Solicitar Presupuesto" : "Solicitar Orçamento"}
        </Button>
      </section>

      {/* Rodapé */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p className="text-gray-400">
          {userLang === "es"
            ? "© 2024 Limpszone - Limpieza Profesional en Portugal."
            : "© 2024 Limpszone - Limpeza Profissional em Portugal."}
        </p>
      </footer>
    </div>
  )
}

