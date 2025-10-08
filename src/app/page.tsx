"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { useBannerRotation } from '@/hooks/useBannerRotation'
import WhatsAppButton from '@/components/WhatsAppButton'
import ImpactoHigienizacao from '@/components/ImpactoHigienizacao'
import { sendServiceRequest, type ServiceFormData } from '@/lib/emailjs'
import { toast } from 'sonner'

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
} from 'lucide-react'

export default function LimpsZoneApp() {
  const [selectedService, setSelectedService] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    user_email: '', // Campo de e-mail adicionado
    address: '',
    services: [] as string[], // Mudança para array de serviços
    material: '',
    dirtLevel: '',
    distance: '',
    quantity: 1,
    observations: '',
    posObraCompartments: 1, // Novo campo para Pós-Obra
    limpezaGeralQuartos: 1 // Novo campo para Limpeza Geral de Casa Mobilada
  })
  const [calculatedFormPrice, setCalculatedFormPrice] = useState(0)
  const [formDiscount, setFormDiscount] = useState(0)
  const [formDiscountAmount, setFormDiscountAmount] = useState(0)

  // Estados para o sistema de orçamento dinâmico
  const [budgetData, setBudgetData] = useState({
    serviceTypes: [] as string[], // Mudança para array de serviços
    materialType: '',
    dirtLevel: '',
    address: '',
    neighborhood: '',
    quantity: 1,
    observations: '',
    posObraCompartments: 1, // Novo campo para Pós-Obra
    limpezaGeralQuartos: 1 // Novo campo para Limpeza Geral de Casa Mobilada
  })
  const [calculatedPrice, setCalculatedPrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)

  const services = [
    {
      id: 'residencial',
      title: 'Limpeza Residencial',
      description: 'Limpeza completa de casas e apartamentos',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      materials: ['Aspirador profissional', 'Produtos biodegradáveis', 'Panos de microfibra', 'Equipamentos de segurança'],
      areas: ['Quartos', 'Salas', 'Cozinhas', 'Casas de banho', 'Áreas externas']
    },
    {
      id: 'comercial',
      title: 'Limpeza Comercial',
      description: 'Higienização de escritórios e estabelecimentos comerciais',
      icon: Building2,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
      materials: ['Máquinas industriais', 'Desinfetantes profissionais', 'Equipamentos de limpeza', 'Produtos especializados'],
      areas: ['Escritórios', 'Recepções', 'Casas de banho', 'Corredores', 'Áreas comuns']
    },
    {
      id: 'restaurantes',
      title: 'Restaurantes & Hotéis',
      description: 'Limpeza especializada para sector alimentício e hoteleiro',
      icon: UtensilsCrossed,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      materials: ['Sanitizantes alimentares', 'Equipamentos industriais', 'Produtos anti-bacterianos', 'Materiais certificados'],
      areas: ['Cozinhas', 'Salões', 'Quartos', 'Casas de banho', 'Áreas de serviço']
    },
    {
      id: 'vidros',
      title: 'Limpeza de Vidros',
      description: 'Limpeza profissional de vidros e fachadas',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=300&fit=crop',
      materials: ['Rodos profissionais', 'Produtos específicos', 'Equipamentos de altura', 'Panos especiais'],
      areas: ['Janelas', 'Fachadas', 'Montras', 'Divisórias', 'Espelhos']
    },
    {
      id: 'pos-obra',
      title: 'Pós-Obra',
      description: 'Limpeza pesada após construções e remodelações',
      icon: Shield,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
      materials: ['Equipamentos pesados', 'Produtos específicos', 'Ferramentas especializadas', 'EPIs completos'],
      areas: ['Remoção de entulho', 'Limpeza de paredes', 'Pavimentos', 'Acabamentos', 'Detalhamento']
    },
    {
      id: 'manutencao',
      title: 'Manutenção Predial',
      description: 'Limpeza e manutenção de condomínios e edifícios',
      icon: Award,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      materials: ['Máquinas industriais', 'Produtos profissionais', 'Equipamentos de segurança', 'Ferramentas especializadas'],
      areas: ['Áreas comuns', 'Garagens', 'Elevadores', 'Escadas', 'Fachadas']
    }
  ]

  // Preços atualizados conforme solicitação
  const serviceTypes = [
    { id: 'sofa', name: 'Limpeza de Sofá', basePrice: 45 },
    { id: 'hipermeabilizacao-sofa', name: 'Hipermeabilização de Sofá', basePrice: 160 },
    { id: 'colchao-solteiro', name: 'Colchão de Solteiro', basePrice: 40 },
    { id: 'colchao-casal', name: 'Colchão de Casal', basePrice: 50 },
    { id: 'tapetes', name: 'Tapete', basePrice: 10 }, // 10 € por m²
    { id: 'pos-obra', name: 'Limpeza Pós-Obras', basePrice: 125 }, // a partir de 125 €
    { id: 'cadeiras', name: 'Limpeza de Cadeiras', basePrice: 8 },
    { id: 'armarios', name: 'Limpeza de Armários', basePrice: 13 },
    { id: 'cortinas', name: 'Limpeza de Cortinas', basePrice: 15 },
    { id: 'vidros', name: 'Limpeza de Vidros', basePrice: 12 },
    { id: 'escritorios', name: 'Higienização de Escritórios/Hotéis', basePrice: 30 },
    { id: 'wc-sanitarios', name: 'Limpeza de WC / Sanitários / Lavatórios', basePrice: 11 },
    { id: 'fogoes-fornos', name: 'Limpeza de Fogões / Fornos', basePrice: 15 },
    { id: 'limpeza-geral', name: 'Limpeza Geral de Casa Mobilada', basePrice: 50 }
  ]

  const materialTypes = [
    { id: 'tecido', name: 'Tecido comum', multiplier: 1.0 },
    { id: 'couro', name: 'Couro natural', multiplier: 1.15 },
    { id: 'napa', name: 'Napa', multiplier: 1.20 },
    { id: 'camurca', name: 'Camurça', multiplier: 1.20 },
    { id: 'madeira', name: 'Madeira', multiplier: 1.10 },
    { id: 'aluminio', name: 'Alumínio', multiplier: 1.0 },
    { id: 'vidro', name: 'Vidro', multiplier: 1.0 },
    { id: 'azulejo', name: 'Azulejo', multiplier: 1.0 },
    { id: 'aco', name: 'Aço inox', multiplier: 1.10 }
  ]

  const dirtLevels = [
    { id: 'leve', name: 'Leve', multiplier: 1.0 },
    { id: 'media', name: 'Média', multiplier: 1.15 },
    { id: 'pesada', name: 'Pesada', multiplier: 1.30 },
    { id: 'manchas', name: 'Com manchas difíceis', multiplier: 1.30 }
  ]

  const distanceOptions = [
    { id: 'centro', name: 'Centro', multiplier: 1.0 },
    { id: 'fora-centro', name: 'Fora do Centro', multiplier: 1.10 },
    { id: 'periferia', name: 'Periferia', multiplier: 1.20 }
  ]

  const neighborhoods = [
    { id: 'centro', name: 'Centro', multiplier: 1.0 },
    { id: 'lisboa', name: 'Lisboa', multiplier: 1.0 },
    { id: 'porto', name: 'Porto', multiplier: 1.0 },
    { id: 'cascais', name: 'Cascais', multiplier: 1.05 },
    { id: 'sintra', name: 'Sintra', multiplier: 1.05 },
    { id: 'oeiras', name: 'Oeiras', multiplier: 1.10 },
    { id: 'almada', name: 'Almada', multiplier: 1.15 },
    { id: 'setubal', name: 'Setúbal', multiplier: 1.20 },
    { id: 'braga', name: 'Braga', multiplier: 1.20 },
    { id: 'outro', name: 'Outra localidade', multiplier: 1.10 }
  ]

  const banners = [
    {
      title: 'Limpeza Profissional em Portugal',
      subtitle: 'Transformamos o seu espaço com qualidade e confiança',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=600&fit=crop',
      cta: 'Solicitar Orçamento'
    },
    {
      title: 'Higienização Completa',
      subtitle: 'Equipamentos modernos e produtos certificados',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop',
      cta: 'Ver Serviços'
    },
    {
      title: 'Atendimento 24/7',
      subtitle: 'Estamos sempre prontos para o atender',
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1200&h=600&fit=crop',
      cta: 'Falar no WhatsApp'
    }
  ]

  const { currentBanner, setCurrentBanner } = useBannerRotation(banners.length, 5000)

  // Função para calcular desconto baseado na quantidade de serviços (NOVA ESTRUTURA)
  const calculateDiscount = (servicesCount: number) => {
    if (servicesCount >= 4) return 20 // 20% para 4 ou mais serviços
    if (servicesCount >= 3) return 15 // 15% para 3 serviços
    if (servicesCount >= 2) return 10 // 10% para 2 serviços
    return 0 // Sem desconto para 1 serviço
  }

  // Função para calcular preço do Pós-Obra com compartimentos
  const calculatePosObraPrice = (basePrice: number, compartments: number) => {
    // Valor base mínimo: 125€ (para 1 compartimento)
    // +15€ por compartimento adicional
    const additionalCompartments = Math.max(0, compartments - 1)
    return basePrice + (additionalCompartments * 15)
  }

  // Função para calcular preço da Limpeza Geral com quartos
  const calculateLimpezaGeralPrice = (basePrice: number, quartos: number) => {
    // Valor base: 50€ (para 1 quarto - já inclui sala, cozinha, 1 WC e varanda)
    // +15€ por quarto adicional
    const additionalQuartos = Math.max(0, quartos - 1)
    return basePrice + (additionalQuartos * 15)
  }

  // Função para calcular o preço do formulário em tempo real (múltiplos serviços)
  const calculateFormPrice = () => {
    if (!formData.services.length || !formData.material || !formData.dirtLevel || !formData.distance) {
      setCalculatedFormPrice(0)
      setFormDiscount(0)
      setFormDiscountAmount(0)
      return
    }

    const material = materialTypes.find(m => m.name === formData.material)
    const dirt = dirtLevels.find(d => d.name === formData.dirtLevel)
    const distance = distanceOptions.find(d => d.name === formData.distance)

    if (material && dirt && distance) {
      let totalPrice = 0
      
      // Somar preços de todos os serviços selecionados
      formData.services.forEach(serviceName => {
        const service = serviceTypes.find(s => s.name === serviceName)
        if (service) {
          let servicePrice = service.basePrice
          
          // Aplicar precificação especial para Pós-Obra
          if (service.id === 'pos-obra') {
            servicePrice = calculatePosObraPrice(service.basePrice, formData.posObraCompartments)
          } 
          // Aplicar precificação especial para Limpeza Geral
          else if (service.id === 'limpeza-geral') {
            servicePrice = calculateLimpezaGeralPrice(service.basePrice, formData.limpezaGeralQuartos)
          } 
          else {
            servicePrice = servicePrice * formData.quantity
          }
          
          servicePrice = servicePrice * material.multiplier * dirt.multiplier * distance.multiplier
          totalPrice += servicePrice
        }
      })
      
      // Calcular desconto baseado na quantidade de serviços
      const discountPercentage = calculateDiscount(formData.services.length)
      const discountValue = (totalPrice * discountPercentage) / 100
      const finalPrice = totalPrice - discountValue
      
      setCalculatedFormPrice(Math.round(finalPrice * 100) / 100)
      setFormDiscount(discountPercentage)
      setFormDiscountAmount(Math.round(discountValue * 100) / 100)
    }
  }

  // Função para calcular o preço em tempo real (múltiplos serviços)
  const calculatePrice = () => {
    if (!budgetData.serviceTypes.length || !budgetData.materialType || !budgetData.dirtLevel) {
      setCalculatedPrice(0)
      setDiscount(0)
      setDiscountAmount(0)
      return
    }

    const material = materialTypes.find(m => m.id === budgetData.materialType)
    const dirt = dirtLevels.find(d => d.id === budgetData.dirtLevel)
    const neighborhood = neighborhoods.find(n => n.id === budgetData.neighborhood) || { multiplier: 1.0 }

    if (material && dirt) {
      let totalPrice = 0
      
      // Somar preços de todos os serviços selecionados
      budgetData.serviceTypes.forEach(serviceId => {
        const service = serviceTypes.find(s => s.id === serviceId)
        if (service) {
          let servicePrice = service.basePrice
          
          // Aplicar precificação especial para Pós-Obra
          if (service.id === 'pos-obra') {
            servicePrice = calculatePosObraPrice(service.basePrice, budgetData.posObraCompartments)
          } 
          // Aplicar precificação especial para Limpeza Geral
          else if (service.id === 'limpeza-geral') {
            servicePrice = calculateLimpezaGeralPrice(service.basePrice, budgetData.limpezaGeralQuartos)
          } 
          else {
            servicePrice = servicePrice * budgetData.quantity
          }
          
          servicePrice = servicePrice * material.multiplier * dirt.multiplier * neighborhood.multiplier
          totalPrice += servicePrice
        }
      })
      
      // Calcular desconto baseado na quantidade de serviços
      const discountPercentage = calculateDiscount(budgetData.serviceTypes.length)
      const discountValue = (totalPrice * discountPercentage) / 100
      const finalPrice = totalPrice - discountValue
      
      setCalculatedPrice(Math.round(finalPrice * 100) / 100)
      setDiscount(discountPercentage)
      setDiscountAmount(Math.round(discountValue * 100) / 100)
    }
  }

  // Recalcular preço sempre que os dados mudarem
  useEffect(() => {
    calculatePrice()
  }, [budgetData])

  // Recalcular preço do formulário sempre que os dados mudarem
  useEffect(() => {
    calculateFormPrice()
  }, [formData.services, formData.material, formData.dirtLevel, formData.distance, formData.quantity, formData.posObraCompartments, formData.limpezaGeralQuartos])

  // Atualizar dados do orçamento
  const updateBudgetData = (field: string, value: string | number | string[]) => {
    setBudgetData(prev => ({ ...prev, [field]: value }))
  }

  // Função para lidar com seleção múltipla de serviços (budget)
  const handleServiceToggle = (serviceId: string) => {
    setBudgetData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(serviceId)
        ? prev.serviceTypes.filter(id => id !== serviceId)
        : [...prev.serviceTypes, serviceId]
    }))
  }

  // Função para lidar com seleção múltipla de serviços (form)
  const handleFormServiceToggle = (serviceName: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceName)
        ? prev.services.filter(name => name !== serviceName)
        : [...prev.services, serviceName]
    }))
  }

  // Função para enviar orçamento por email
  const handleBudgetSubmit = async () => {
    if (!budgetData.serviceTypes.length || !budgetData.materialType || !budgetData.dirtLevel || !budgetData.address) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    try {
      const material = materialTypes.find(m => m.id === budgetData.materialType)
      const dirt = dirtLevels.find(d => d.id === budgetData.dirtLevel)
      const neighborhood = neighborhoods.find(n => n.id === budgetData.neighborhood)

      // Calcular preço total antes do desconto
      let totalBeforeDiscount = 0
      budgetData.serviceTypes.forEach(serviceId => {
        const service = serviceTypes.find(s => s.id === serviceId)
        if (service) {
          let servicePrice = service.basePrice
          
          // Aplicar precificação especial para Pós-Obra
          if (service.id === 'pos-obra') {
            servicePrice = calculatePosObraPrice(service.basePrice, budgetData.posObraCompartments)
          } 
          // Aplicar precificação especial para Limpeza Geral
          else if (service.id === 'limpeza-geral') {
            servicePrice = calculateLimpezaGeralPrice(service.basePrice, budgetData.limpezaGeralQuartos)
          } 
          else {
            servicePrice = servicePrice * budgetData.quantity
          }
          
          servicePrice = servicePrice * (material?.multiplier || 1) * (dirt?.multiplier || 1) * (neighborhood?.multiplier || 1)
          totalBeforeDiscount += servicePrice
        }
      })

      // Criar resumo detalhado dos serviços
      const selectedServices = budgetData.serviceTypes.map(serviceId => {
        const service = serviceTypes.find(s => s.id === serviceId)
        if (service) {
          let servicePrice = service.basePrice
          
          // Aplicar precificação especial para Pós-Obra
          if (service.id === 'pos-obra') {
            servicePrice = calculatePosObraPrice(service.basePrice, budgetData.posObraCompartments)
            const compartmentInfo = budgetData.posObraCompartments > 1 ? ` (${budgetData.posObraCompartments} compartimentos)` : ' (1 compartimento)'
            servicePrice = servicePrice * (material?.multiplier || 1) * (dirt?.multiplier || 1) * (neighborhood?.multiplier || 1)
            return `• ${service.name}${compartmentInfo}: ${(Math.round(servicePrice * 100) / 100).toFixed(2)} €`
          } 
          // Aplicar precificação especial para Limpeza Geral
          else if (service.id === 'limpeza-geral') {
            servicePrice = calculateLimpezaGeralPrice(service.basePrice, budgetData.limpezaGeralQuartos)
            const quartosInfo = budgetData.limpezaGeralQuartos > 1 ? ` (${budgetData.limpezaGeralQuartos} quartos)` : ' (1 quarto)'
            servicePrice = servicePrice * (material?.multiplier || 1) * (dirt?.multiplier || 1) * (neighborhood?.multiplier || 1)
            return `• ${service.name}${quartosInfo}: ${(Math.round(servicePrice * 100) / 100).toFixed(2)} €`
          } 
          else {
            servicePrice = servicePrice * budgetData.quantity * (material?.multiplier || 1) * (dirt?.multiplier || 1) * (neighborhood?.multiplier || 1)
            return `• ${service.name}: ${(Math.round(servicePrice * 100) / 100).toFixed(2)} €`
          }
        }
        return ''
      }).filter(Boolean).join('\n')

      const resumo = `\nRESUMO DO SERVIÇO:\n• Serviços Selecionados:\n${selectedServices}\n• Quantidade: ${budgetData.quantity} ${budgetData.quantity === 1 ? 'item' : 'itens'} (por serviço)\n• Material: ${material?.name}\n• Nível de Sujidade: ${dirt?.name}\n• Endereço: ${budgetData.address}\n${budgetData.neighborhood ? `• Localidade: ${neighborhood?.name}` : ''}\n${budgetData.observations ? `• Observações: ${budgetData.observations}` : ''}\n\nCÁLCULO DE PREÇOS:\n• Subtotal (sem desconto): ${(Math.round(totalBeforeDiscount * 100) / 100).toFixed(2)} €\n${discount > 0 ? `• Desconto aplicado (-${discount}%): -${discountAmount.toFixed(2)} €` : ''}\n• VALOR FINAL COM DESCONTO: ${calculatedPrice.toFixed(2)} €\n\n${discount > 0 ? 'Observação: Descontos válidos apenas para pedidos combinados de múltiplos serviços.' : ''}\n      `

      // Criar link mailto com todos os dados
      const subject = encodeURIComponent('Nova Solicitação de Serviço - Limpszone')
      const body = encodeURIComponent(`\nNOVA SOLICITAÇÃO DE SERVIÇO\n\n${resumo}\n\n---\nEnviado através do sistema de orçamento da Limpszone\n      `.trim())

      const mailtoLink = `mailto:suportelimpszone@gmail.com?subject=${subject}&body=${body}`
      
      // Abrir cliente de email
      window.location.href = mailtoLink
      
      setShowSuccessMessage(true)
      
      // Limpar formulário
      setBudgetData({
        serviceTypes: [],
        materialType: '',
        dirtLevel: '',
        address: '',
        neighborhood: '',
        quantity: 1,
        observations: '',
        posObraCompartments: 1,
        limpezaGeralQuartos: 1
      })
      setCalculatedPrice(0)
      setDiscount(0)
      setDiscountAmount(0)

      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)

    } catch (error) {
      console.error('Erro ao enviar orçamento:', error)
      alert('Erro ao enviar orçamento. Tente novamente.')
    }
  }

  // Função para enviar formulário por email
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone || !formData.user_email || !formData.address || !formData.services.length || !formData.material || !formData.dirtLevel || !formData.distance) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    try {
      // Preparar dados para EmailJS
      const emailData: ServiceFormData = {
        name: formData.name,
        phone: formData.phone,
        user_email: formData.user_email, // Usar o e-mail do usuário
        address: formData.address,
        services: formData.services,
        material: formData.material,
        dirtLevel: formData.dirtLevel,
        distance: formData.distance,
        totalPrice: `${calculatedFormPrice.toFixed(2)}`
      }

      // Enviar via EmailJS
      await sendServiceRequest(emailData)

      // Mostrar toast de sucesso
      toast.success('✅ Solicitação enviada com sucesso! Entraremos em contacto em breve.')
      
      // Mostrar mensagem de sucesso
      setShowSuccessMessage(true)
      setIsFormOpen(false)
      
      // Limpar formulário
      setFormData({
        name: '',
        phone: '',
        user_email: '', // Limpar campo de e-mail
        address: '',
        services: [],
        material: '',
        dirtLevel: '',
        distance: '',
        quantity: 1,
        observations: '',
        posObraCompartments: 1,
        limpezaGeralQuartos: 1
      })
      setCalculatedFormPrice(0)
      setFormDiscount(0)
      setFormDiscountAmount(0)

      // Esconder mensagem após 5 segundos
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)

    } catch (error) {
      console.error('Erro ao enviar email:', error)
      toast.error('❌ Erro ao enviar solicitação. Tente novamente.')
    }
  }

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const openServiceForm = (serviceTitle: string) => {
    setFormData(prev => ({ ...prev, services: [serviceTitle] }))
    setIsFormOpen(true)
  }

  // Função para abrir o formulário de solicitação de serviço
  const handleSolicitarServico = () => {
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Mensagem de Sucesso */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>✅ Solicitação enviada com sucesso! Em breve entraremos em contacto.</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Limpszone</h1>
                <p className="text-sm text-gray-600">Limpeza Profissional Portugal</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <a href="tel:+351920000000" className="hover:text-blue-600">+351 920 000 000</a>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <a href="mailto:suportelimpszone@gmail.com" className="hover:text-blue-600">suportelimpszone@gmail.com</a>
              </div>
              <WhatsAppButton className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-4 py-2 rounded-md inline-flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </header>

      {/* Banner Carousel */}
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
              <div className="absolute inset-0 bg-black/50" style={{ pointerEvents: "none" }} />
              <div className="relative h-full flex items-center justify-center text-center text-white px-4">
                <div className="max-w-4xl">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">{banner.title}</h2>
                  <p className="text-xl md:text-2xl mb-8">{banner.subtitle}</p>
                  {banner.cta === 'Falar no WhatsApp' ? (
                    <div className="relative z-50 pointer-events-auto">
                      <WhatsAppButton className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-lg px-8 py-3 rounded-md">
                        {banner.cta}
                      </WhatsAppButton>
                    </div>
                  ) : (
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-3"
                      onClick={() => {
                        if (banner.cta === 'Solicitar Orçamento') {
                          document.getElementById('budget-calculator')?.scrollIntoView({ behavior: 'smooth' })
                        } else {
                          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                    >
                      {banner.cta}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Banner Navigation */}
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

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Clientes Satisfeitos</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">5</div>
              <div className="text-gray-600">Anos de Experiência</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Atendimento</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Garantia</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Os Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos soluções completas de limpeza e higienização para todos os tipos de ambientes em Portugal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">{service.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Materiais Utilizados:</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.materials.map((material, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Áreas Atendidas:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {service.areas.map((area, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                        onClick={() => openServiceForm(service.title)}
                      >
                        Solicitar Serviço
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Por que higienizar é essencial? */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                🧼 Por que higienizar é essencial?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-l-4 border-red-500 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Riscos da Falta de Higienização</h3>
                      <p className="text-gray-600">
                        A falta de higienização adequada pode causar ácaros, fungos e maus odores, 
                        comprometendo a saúde e o bem-estar da sua família ou funcionários.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-green-500 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Heart className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Benefícios da Limpeza</h3>
                      <p className="text-gray-600">
                        Ambientes limpos e cheirosos reduzem alergias e aumentam o conforto e o bem-estar, 
                        criando um espaço mais saudável para todos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-blue-500 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Serviços Profissionais</h3>
                      <p className="text-gray-600">
                        Com os nossos serviços profissionais, a sua casa ou negócio mantém-se sempre limpo, 
                        higienizado e com aparência de luxo, impressionando clientes e visitantes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-yellow-500 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Zap className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Economia Garantida</h3>
                      <p className="text-gray-600">
                        Clientes que realizam higienizações completas economizam até 20% nos serviços, 
                        aproveitando os nossos descontos progressivos automáticos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Nova Seção: Riscos e Benefícios da Higienização do Seu Espaço */}
      <ImpactoHigienizacao onSolicitarServico={handleSolicitarServico} />

      {/* Budget Calculator Section */}
      <section id="budget-calculator" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="h-12 w-12 text-blue-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Calculadora de Orçamento
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Obtenha um orçamento instantâneo para o seu serviço de limpeza. Selecione as opções abaixo e veja o preço em tempo real.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <CardTitle className="text-2xl flex items-center">
                  <DollarSign className="h-6 w-6 mr-2" />
                  Configure o seu Orçamento
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Preencha os campos abaixo para calcular o preço do seu serviço
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tipos de Serviço - Seleção Múltipla */}
                  <div className="md:col-span-2">
                    <Label className="text-lg font-semibold text-gray-800 mb-3 block">
                      1️⃣ Tipos de Serviço * (Selecione um ou mais)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {serviceTypes.map((service) => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={service.id}
                            checked={budgetData.serviceTypes.includes(service.id)}
                            onCheckedChange={() => handleServiceToggle(service.id)}
                          />
                          <Label htmlFor={service.id} className="text-sm cursor-pointer">
                            {service.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {budgetData.serviceTypes.length >= 2 && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Zap className="h-5 w-5 text-green-600" />
                          <span className="text-green-700 font-semibold">
                            🎉 Promoção Ativa: {budgetData.serviceTypes.length >= 4 ? '20%' : budgetData.serviceTypes.length >= 3 ? '15%' : '10%'} de desconto por múltiplos serviços!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Campo especial para Pós-Obra */}
                  {budgetData.serviceTypes.includes('pos-obra') && (
                    <div className="md:col-span-2">
                      <Label htmlFor="posObraCompartments" className="text-lg font-semibold text-gray-800 mb-3 block">
                        🏠 Número de Compartimentos (Pós-Obra) *
                      </Label>
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateBudgetData('posObraCompartments', Math.max(1, budgetData.posObraCompartments - 1))}
                          className="h-12 w-12"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={budgetData.posObraCompartments}
                          onChange={(e) => updateBudgetData('posObraCompartments', Math.max(1, parseInt(e.target.value) || 1))}
                          className="h-12 text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateBudgetData('posObraCompartments', budgetData.posObraCompartments + 1)}
                          className="h-12 w-12"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Valor base: 125,00 € (1 compartimento) + 15,00 € por compartimento adicional
                      </p>
                    </div>
                  )}

                  {/* Campo especial para Limpeza Geral de Casa Mobilada */}
                  {budgetData.serviceTypes.includes('limpeza-geral') && (
                    <div className="md:col-span-2">
                      <Label htmlFor="limpezaGeralQuartos" className="text-lg font-semibold text-gray-800 mb-3 block">
                        🏡 Número de Quartos (Limpeza Geral) *
                      </Label>
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateBudgetData('limpezaGeralQuartos', Math.max(1, budgetData.limpezaGeralQuartos - 1))}
                          className="h-12 w-12"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={budgetData.limpezaGeralQuartos}
                          onChange={(e) => updateBudgetData('limpezaGeralQuartos', Math.max(1, parseInt(e.target.value) || 1))}
                          className="h-12 text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateBudgetData('limpezaGeralQuartos', budgetData.limpezaGeralQuartos + 1)}
                          className="h-12 w-12"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                          💡 <strong>Observação:</strong> O valor da Limpeza Geral considera automaticamente sala, cozinha, WC e varanda. O preço final varia apenas pelo número de quartos adicionais informados.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Quantidade de Itens (não aplicável para Pós-Obra e Limpeza Geral) */}
                  {!budgetData.serviceTypes.includes('pos-obra') && !budgetData.serviceTypes.includes('limpeza-geral') && (
                    <div>
                      <Label htmlFor="quantity" className="text-lg font-semibold text-gray-800 mb-3 block">
                        2️⃣ Quantidade *
                      </Label>
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateBudgetData('quantity', Math.max(1, budgetData.quantity - 1))}
                          className="h-12 w-12"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={budgetData.quantity}
                          onChange={(e) => updateBudgetData('quantity', Math.max(1, parseInt(e.target.value) || 1))}
                          className="h-12 text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateBudgetData('quantity', budgetData.quantity + 1)}
                          className="h-12 w-12"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Tipo de Material */}
                  <div>
                    <Label htmlFor="materialType" className="text-lg font-semibold text-gray-800 mb-3 block">
                      3️⃣ Tipo de Material *
                    </Label>
                    <Select 
                      value={budgetData.materialType}
                      onValueChange={(value) => updateBudgetData('materialType', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione o tipo de material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materialTypes.map((material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nível de Sujidade */}
                  <div>
                    <Label htmlFor="dirtLevel" className="text-lg font-semibold text-gray-800 mb-3 block">
                      4️⃣ Nível de Sujidade *
                    </Label>
                    <Select 
                      value={budgetData.dirtLevel}
                      onValueChange={(value) => updateBudgetData('dirtLevel', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione o nível de sujidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {dirtLevels.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Distância */}
                  <div>
                    <Label htmlFor="neighborhood" className="text-lg font-semibold text-gray-800 mb-3 block">
                      5️⃣ Localidade *
                    </Label>
                    <Select 
                      value={budgetData.neighborhood}
                      onValueChange={(value) => updateBudgetData('neighborhood', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione a localidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {neighborhoods.map((neighborhood) => (
                          <SelectItem key={neighborhood.id} value={neighborhood.id}>
                            {neighborhood.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Endereço Completo */}
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-lg font-semibold text-gray-800 mb-3 block">
                      📍 Endereço Completo *
                    </Label>
                    <Input
                      id="address"
                      value={budgetData.address}
                      onChange={(e) => updateBudgetData('address', e.target.value)}
                      placeholder="Digite o seu endereço completo"
                      className="h-12"
                    />
                  </div>

                  {/* Observações Adicionais */}
                  <div className="md:col-span-2">
                    <Label htmlFor="observations" className="text-lg font-semibold text-gray-800 mb-3 block">
                      📝 Observações Adicionais (opcional)
                    </Label>
                    <Textarea
                      id="observations"
                      value={budgetData.observations}
                      onChange={(e) => updateBudgetData('observations', e.target.value)}
                      placeholder="Descreva manchas, áreas com bolor, danos ou outras informações importantes..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Preço Calculado em Tempo Real */}
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Preço Total Estimado</h3>
                    
                    {/* Mostrar cálculo detalhado quando há preço */}
                    {calculatedPrice > 0 && (
                      <div className="space-y-3 mb-4">
                        {/* Subtotal (sem desconto) */}
                        <div className="text-lg text-gray-600">
                          Subtotal (sem desconto): <span className="font-semibold">{(calculatedPrice + discountAmount).toFixed(2)} €</span>
                        </div>
                        
                        {/* Desconto aplicado */}
                        {discount > 0 && (
                          <div className="text-lg text-red-600">
                            Desconto aplicado (-{discount}%): <span className="font-semibold">-{discountAmount.toFixed(2)} €</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                      {calculatedPrice > 0 ? `${calculatedPrice.toFixed(2)} €` : '0,00 €'}
                    </div>
                    <p className="text-gray-600">
                      {calculatedPrice > 0 ? 'Valor final com desconto' : 'Selecione as opções acima para ver o preço'}
                    </p>
                    
                    {calculatedPrice > 0 && (
                      <div className="mt-4 text-sm text-gray-500">
                        <p>💡 Descontos automáticos: 10% para 2 serviços, 15% para 3 serviços, 20% para 4+ serviços</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botão de Solicitar Serviço */}
                <div className="mt-8 text-center">
                  <Button 
                    onClick={handleBudgetSubmit}
                    disabled={!budgetData.serviceTypes.length || !budgetData.materialType || !budgetData.dirtLevel || !budgetData.address}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-lg px-12 py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Solicitar Serviço
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    As suas informações serão enviadas para suportelimpszone@gmail.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modal do Formulário com Sistema de Cálculo Dinâmico */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Solicitar Serviço</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para solicitar o seu serviço de limpeza com cálculo automático de preço.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Campos obrigatórios básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="O seu nome completo"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+351 920 000 000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="user_email">E-mail *</Label>
              <Input
                id="user_email"
                type="email"
                required
                value={formData.user_email}
                onChange={(e) => handleInputChange('user_email', e.target.value)}
                placeholder="Digite o seu e-mail"
              />
            </div>

            <div>
              <Label htmlFor="address">Endereço Completo *</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Rua, número, localidade, cidade"
              />
            </div>

            {/* Tipos de Serviço - Seleção Múltipla */}
            <div>
              <Label className="text-base font-semibold text-gray-800 mb-3 block">
                Tipos de Serviço * (Selecione um ou mais)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto border rounded-lg p-3">
                {serviceTypes.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`form-${service.id}`}
                      checked={formData.services.includes(service.name)}
                      onCheckedChange={() => handleFormServiceToggle(service.name)}
                    />
                    <Label htmlFor={`form-${service.id}`} className="text-sm cursor-pointer">
                      {service.name}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.services.length >= 2 && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    <span className="text-green-700 font-semibold">
                      🎉 Promoção Ativa: {formData.services.length >= 4 ? '20%' : formData.services.length >= 3 ? '15%' : '10%'} de desconto por múltiplos serviços!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Campo especial para Pós-Obra */}
            {formData.services.includes('Limpeza Pós-Obras') && (
              <div>
                <Label htmlFor="posObraCompartments">Número de Compartimentos (Pós-Obra) *</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('posObraCompartments', Math.max(1, formData.posObraCompartments - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={formData.posObraCompartments}
                    onChange={(e) => handleInputChange('posObraCompartments', Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('posObraCompartments', formData.posObraCompartments + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Valor base: 125,00 € (1 compartimento) + 15,00 € por compartimento adicional
                </p>
              </div>
            )}

            {/* Campo especial para Limpeza Geral de Casa Mobilada */}
            {formData.services.includes('Limpeza Geral de Casa Mobilada') && (
              <div>
                <Label htmlFor="limpezaGeralQuartos">Número de Quartos (Limpeza Geral) *</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('limpezaGeralQuartos', Math.max(1, formData.limpezaGeralQuartos - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={formData.limpezaGeralQuartos}
                    onChange={(e) => handleInputChange('limpezaGeralQuartos', Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('limpezaGeralQuartos', formData.limpezaGeralQuartos + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Observação:</strong> O valor da Limpeza Geral considera automaticamente sala, cozinha, WC e varanda. O preço final varia apenas pelo número de quartos adicionais informados.
                  </p>
                </div>
              </div>
            )}

            {/* Campos para cálculo dinâmico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quantidade (não aplicável para Pós-Obra e Limpeza Geral) */}
              {!formData.services.includes('Limpeza Pós-Obras') && !formData.services.includes('Limpeza Geral de Casa Mobilada') && (
                <div>
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('quantity', Math.max(1, formData.quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('quantity', formData.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="material">Tipo de Material *</Label>
                <Select 
                  required
                  value={formData.material}
                  onValueChange={(value) => handleInputChange('material', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialTypes.map((material) => (
                      <SelectItem key={material.id} value={material.name}>
                        {material.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dirtLevel">Nível de Sujidade *</Label>
                <Select 
                  required
                  value={formData.dirtLevel}
                  onValueChange={(value) => handleInputChange('dirtLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    {dirtLevels.map((level) => (
                      <SelectItem key={level.id} value={level.name}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="distance">Distância *</Label>
                <Select 
                  required
                  value={formData.distance}
                  onValueChange={(value) => handleInputChange('distance', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a distância" />
                  </SelectTrigger>
                  <SelectContent>
                    {distanceOptions.map((distance) => (
                      <SelectItem key={distance.id} value={distance.name}>
                        {distance.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Observações Adicionais */}
            <div>
              <Label htmlFor="observations">Observações Adicionais (opcional)</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                placeholder="Descreva manchas, áreas com bolor, danos ou outras informações importantes..."
                className="min-h-[80px]"
              />
            </div>

            {/* Exibição do preço calculado */}
            {calculatedFormPrice > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-center mb-3">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Preço Total</h4>
                  
                  {/* Mostrar cálculo detalhado */}
                  <div className="space-y-2 mb-3">
                    {/* Subtotal (sem desconto) */}
                    <div className="text-sm text-gray-600">
                      Subtotal (sem desconto): <span className="font-semibold">{(calculatedFormPrice + formDiscountAmount).toFixed(2)} €</span>
                    </div>
                    
                    {/* Desconto aplicado */}
                    {formDiscount > 0 && (
                      <div className="text-sm text-red-600">
                        Desconto aplicado (-{formDiscount}%): <span className="font-semibold">-{formDiscountAmount.toFixed(2)} €</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-3xl font-bold text-green-600">
                    {calculatedFormPrice.toFixed(2)} €
                  </div>
                  <p className="text-sm text-gray-600">Valor final com desconto</p>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              disabled={!formData.name || !formData.phone || !formData.user_email || !formData.address || !formData.services.length || !formData.material || !formData.dirtLevel || !formData.distance}
            >
              Solicitar Serviço
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              O que os nossos clientes dizem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                role: "Proprietária de Restaurante",
                comment: "Excelente serviço! A Limpszone transformou o nosso restaurante. Equipa profissional e pontual.",
                rating: 5
              },
              {
                name: "João Santos",
                role: "Gerente de Hotel",
                comment: "Trabalho impecável na limpeza do nosso hotel. Clientes sempre elogiam a limpeza dos quartos.",
                rating: 5
              },
              {
                name: "Ana Costa",
                role: "Dona de Casa",
                comment: "Serviço residencial perfeito! A minha casa ficou a brilhar. Super recomendo a Limpszone.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Limpszone</h3>
                  <p className="text-sm text-gray-400">Limpeza Profissional</p>
                </div>
              </div>
              <p className="text-gray-400">
                A melhor empresa de limpeza profissional em Portugal. 
                Qualidade, confiança e excelência em cada serviço.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Limpeza Residencial</li>
                <li>Limpeza Comercial</li>
                <li>Restaurantes & Hotéis</li>
                <li>Limpeza de Vidros</li>
                <li>Pós-Obra</li>
                <li>Manutenção Predial</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+351920000000" className="hover:text-white">+351 920 000 000</a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:suportelimpszone@gmail.com" className="hover:text-white">suportelimpszone@gmail.com</a>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Portugal, União Europeia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>24/7 Atendimento</span>
                </div>
              </div>
              <WhatsAppButton className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md inline-flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Falar no WhatsApp
              </WhatsAppButton>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Horário de Funcionamento</h4>
              <div className="space-y-2 text-gray-400">
                <div>Segunda - Sexta: 7:00 - 19:00</div>
                <div>Sábado: 8:00 - 17:00</div>
                <div>Domingo: 9:00 - 15:00</div>
                <div className="text-green-400 font-semibold mt-2">
                  Emergências: 24/7
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Limpszone - Limpeza Profissional Portugal. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}