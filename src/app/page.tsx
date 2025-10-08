"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { useBannerRotation } from '@/hooks/useBannerRotation'
import WhatsAppButton from '@/components/WhatsAppButton'
import ImpactoHigienizacao from '@/components/ImpactoHigienizacao'
import { sendServiceRequest, type ServiceFormData } from '@/lib/emailjs'
import { toast } from 'sonner'
import { Phone, Mail, MapPin, Clock, CheckCircle, Star, Users, Building2, Home, UtensilsCrossed, Sparkles, Shield, Trophy, MessageCircle, Calculator, DollarSign, Plus, Minus, AlertTriangle, Heart, Zap, Award } from 'lucide-react'

// 🔥 Importa o sistema de tradução
import i18n from '@/lib/i18n'

// ✅ Detecta o idioma do navegador (pt ou es)
const userLang = typeof navigator !== "undefined" && navigator.language.startsWith("es") ? "es" : "pt"

// 🔥 Usa o JSON correto de acordo com o idioma
const t = i18n.getDataByLanguage(userLang)?.translation || {
  heroTitle: "Limpeza Profissional em Portugal",
  heroSubtitle: "Transformamos o seu espaço com qualidade e confiança",
  cta: "Solicitar Orçamento"
}

export default function LimpsZoneApp() {
  const [selectedService, setSelectedService] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const { currentBanner, setCurrentBanner } = useBannerRotation(3, 5000)

  // 👉 Aqui, usamos os textos traduzidos dinamicamente
  const banners = [
    {
      title: t.heroTitle,
      subtitle: t.heroSubtitle,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=600&fit=crop',
      cta: t.cta
    },
    {
      title: "Higienização Completa",
      subtitle: "Equipamentos modernos e produtos certificados",
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop',
      cta: userLang === "es" ? "Ver Servicios" : "Ver Serviços"
    },
    {
      title: "Atendimento 24/7",
      subtitle: userLang === "es" ? "Siempre listos para atenderle" : "Estamos sempre prontos para o atender",
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1200&h=600&fit=crop',
      cta: userLang === "es" ? "Hablar por WhatsApp" : "Falar no WhatsApp"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* ✅ Banner multilíngue */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBanner ? 'opacity-100' : 'opacity-0'
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

                  {banner.cta === (userLang === "es" ? "Hablar por WhatsApp" : "Falar no WhatsApp") ? (
                    <WhatsAppButton className="bg-gradient-to-r from-blue-600 to-green-600 text-white text-lg px-8 py-3 rounded-md">
                      {banner.cta}
                    </WhatsAppButton>
                  ) : (
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-3"
                    >
                      {banner.cta}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navegação do banner */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentBanner ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </section>

      {/* ✨ Exemplo de título multilíngue */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          {userLang === "es" ? "Nuestros Servicios" : "Os Nossos Serviços"}
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          {userLang === "es"
            ? "Ofrecemos soluciones integrales de limpieza y desinfección para todos los espacios en España y Portugal."
            : "Oferecemos soluções completas de limpeza e higienização para todos os tipos de ambientes em Portugal."}
        </p>
      </section>
    </div>
  )
}
