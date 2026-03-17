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

import {
  Phone, Mail, MapPin, Clock, CheckCircle, Star, Building2, Home,
  UtensilsCrossed, Sparkles, Shield, MessageCircle, Calculator,
  DollarSign, Plus, Minus, Zap, Award, ChevronDown, ChevronUp, ArrowRight
} from 'lucide-react'

type Lang = 'pt' | 'es'

const LOCALES: Record<Lang, Record<string, string>> = {
  pt: {
    headerSubtitle: 'Limpeza Profissional Portugal',
    navResidencial: 'Residencial', navComercial: 'Comercial', navPorqueNos: 'Por que Nós',
    navSobre: 'Sobre', navTestemunhos: 'Testemunhos', navCta: 'Orçamento Grátis',
    heroBadge: 'Os nossos serviços de limpeza',
    heroTitle: 'Limpeza Profissional de Confiança em Portugal',
    heroDesc: 'Quer uma casa impecável e recuperar o seu tempo livre? Contacte a Limpszone e aproveite os nossos serviços de limpeza especializados.',
    heroStat1Num: '500+', heroStat1Label: 'Clientes Satisfeitos',
    heroStat2Num: '4.9/5', heroStat2Label: 'Avaliação',
    heroCta: 'Solicitar Orçamento Grátis',
    servicesTitle: 'Como a Limpszone Pode Ajudá-lo',
    servicesSub: 'Os nossos serviços de limpeza são adaptados às suas necessidades. Sem contratos, sem complicações. Os nossos profissionais não perdem um único detalhe.',
    servicesCta: 'Ver Todos os Serviços e Preços',
    learnMore: 'Saber mais', requestService: 'Solicitar Serviço',
    materialsTitle: 'Materiais Utilizados:', areasTitle: 'Áreas Atendidas:',
    s1Title: 'Limpeza Residencial', s1Desc: 'Limpeza completa de casas e apartamentos',
    s2Title: 'Limpeza Comercial', s2Desc: 'Higienização de escritórios e estabelecimentos comerciais',
    s3Title: 'Restaurantes & Hotéis', s3Desc: 'Limpeza especializada para sector alimentício e hoteleiro',
    s4Title: 'Limpeza de Vidros', s4Desc: 'Limpeza profissional de vidros e fachadas',
    s5Title: 'Pós-Obra', s5Desc: 'Limpeza pesada após construções e remodelações',
    s6Title: 'Manutenção Predial', s6Desc: 'Limpeza e manutenção de condomínios e edifícios',
    whyTitle: 'Por que Escolher a Limpszone?',
    why1Title: 'Garantia de Satisfação Total', why1Desc: 'Se o serviço não estiver ao seu gosto, voltamos sem custo adicional.',
    why2Title: 'Equipa Verificada e Treinada', why2Desc: 'Todos os profissionais passam por verificação de antecedentes e formação especializada.',
    why3Title: 'Limpeza Personalizada', why3Desc: 'Criamos um plano de limpeza adaptado ao seu espaço, rotina e orçamento.',
    why4Title: 'Agendamento Fácil e Rápido', why4Desc: 'Orçamento em menos de 1 hora. Marque online ou por telefone com total flexibilidade.',
    whyCta: 'Solicitar Orçamento Gratuito',
    promiseTitle: 'A Nossa Promessa de Qualidade',
    promiseDesc: 'Na Limpszone temos muito orgulho em prestar os serviços de limpeza de mais alta qualidade. Utilizamos um checklist de 40 pontos em cada visita para garantir que nada fica por fazer. Se algo não estiver perfeito, corrigimos sem qualquer custo adicional.',
    promiseCta: 'Saber Mais',
    reviewsTitle: 'Avaliações dos Clientes', reviewsCta: 'Ver Todas as Avaliações',
    bannerTitle: 'Pronto para um espaço verdadeiramente limpo?',
    bannerSub: 'Orçamento gratuito em menos de 1 hora. Sem contratos, sem compromissos.',
    bannerCta: 'Solicitar Orçamento Grátis',
    calcTitle: 'Calculadora de Orçamento',
    calcSub: 'Obtenha um orçamento instantâneo para o seu serviço de limpeza. Selecione as opções abaixo e veja o preço em tempo real.',
    calcCardTitle: 'Configure o seu Orçamento', calcCardDesc: 'Preencha os campos abaixo para calcular o preço do seu serviço',
    step1: '1️⃣ Tipos de Serviço * (Selecione um ou mais)', step2: '2️⃣ Quantidade *',
    step3: '3️⃣ Tipo de Material *', step4: '4️⃣ Nível de Sujidade *', step5: '5️⃣ Localidade *',
    stepAddr: '📍 Endereço Completo *', stepObs: '📝 Observações Adicionais (opcional)',
    selectMaterial: 'Selecione o tipo de material', selectDirt: 'Selecione o nível de sujidade',
    selectLocal: 'Selecione a localidade', selectAddr: 'Digite o seu endereço completo',
    selectObsPlaceholder: 'Descreva manchas, áreas com bolor, danos ou outras informações importantes...',
    promoActive: '🎉 Promoção Ativa:', promoDesc: 'de desconto por múltiplos serviços!',
    priceTitle: 'Preço Total Estimado', subtotal: 'Subtotal (sem desconto):',
    discountApplied: 'Desconto aplicado', finalPrice: 'Valor final com desconto',
    selectOptions: 'Selecione as opções acima para ver o preço',
    discountTip: '💡 Descontos automáticos: 10% para 2 serviços, 15% para 3 serviços, 20% para 4+ serviços',
    submitBtn: 'Solicitar Serviço', submitNote: 'As suas informações serão enviadas para suportelimpszone@gmail.com',
    fillRequired: 'Por favor, preencha todos os campos obrigatórios.',
    posObraLabel: '🏠 Número de Compartimentos (Pós-Obra) *',
    posObraNote: 'Valor base: 125,00 € (1 compartimento) + 15,00 € por compartimento adicional',
    limpezaGeralLabel: '🏡 Número de Quartos (Limpeza Geral) *',
    limpezaGeralNote: '💡 O valor considera automaticamente sala, cozinha, WC e varanda.',
    modalTitle: 'Solicitar Serviço', modalDesc: 'Preencha os dados abaixo para solicitar o seu serviço com cálculo automático de preço.',
    fieldName: 'Nome *', fieldPhone: 'Telefone *', fieldEmail: 'E-mail *',
    fieldAddress: 'Endereço Completo *', fieldServices: 'Tipos de Serviço * (Selecione um ou mais)',
    fieldMaterial: 'Tipo de Material *', fieldDirt: 'Nível de Sujidade *', fieldDistance: 'Distância *',
    fieldObs: 'Observações Adicionais (opcional)',
    namePlaceholder: 'O seu nome completo', phonePlaceholder: '+351 920 000 000',
    emailPlaceholder: 'Digite o seu e-mail', addressPlaceholder: 'Rua, número, localidade, cidade',
    selectMaterialPlaceholder: 'Selecione o material', selectDirtPlaceholder: 'Selecione o nível',
    selectDistancePlaceholder: 'Selecione a distância', priceTotal: 'Preço Total',
    successMsg: '✅ Solicitação enviada com sucesso! Entraremos em contacto em breve.',
    errorMsg: '❌ Erro ao enviar solicitação. Tente novamente.',
    successBanner: '✅ Solicitação enviada com sucesso! Em breve entraremos em contacto.',
    faqTitle: 'Respostas às Perguntas Mais Frequentes', faqSub: 'Tem mais dúvidas sobre os nossos serviços? Consulte abaixo.',
    faq1Q: 'O que garante a qualidade do serviço da Limpszone?',
    faq1A: 'A Limpszone garante um serviço de excelência com um checklist de 40 pontos. Se algo não estiver ao seu agrado, a nossa equipa regressa em 24h para corrigir, sem qualquer custo adicional.',
    faq2Q: 'Há quanto tempo a Limpszone está em atividade?',
    faq2A: 'A Limpszone está no mercado há 5 anos, tendo prestado serviços a mais de 500 clientes satisfeitos em Portugal.',
    faq3Q: 'Preciso de estar presente durante a limpeza?',
    faq3A: 'Não é necessário. A nossa equipa é de total confiança e todos os profissionais passam por verificação de antecedentes.',
    faq4Q: 'Com que frequência posso contratar o serviço?',
    faq4A: 'Oferecemos serviços pontuais, semanais, quinzenais ou mensais, sem contratos de longo prazo nem penalizações.',
    footerDesc: 'Uma limpeza em que pode confiar.', footerTagline: 'Uma limpeza em que pode confiar.®',
    footerServices: 'Serviços', footerCompany: 'Empresa', footerResources: 'Recursos',
    footerMonFri: 'Segunda - Sexta: 7:00 - 19:00', footerSat: 'Sábado: 8:00 - 17:00',
    footerSun: 'Domingo: 9:00 - 15:00', footerEmergency: 'Emergências: 24/7',
    footerCopy: '© 2024 Limpszone — Limpeza Profissional Portugal. Todos os direitos reservados.',
    footerWhatsApp: 'WhatsApp', footerLocation: 'Portugal, União Europeia',
    r1Init: 'MS', r1Name: 'Maria Silva', r1Role: 'Proprietária de Restaurante',
    r1Text: 'A equipa fez um trabalho fantástico no nosso restaurante. Muito profissional e pontual. Recomendo sem hesitar.',
    r2Init: 'JS', r2Name: 'João Santos', r2Role: 'Gerente de Hotel',
    r2Text: 'Trabalho impecável na limpeza do hotel. Os clientes elogiam sempre a qualidade dos quartos. Parceria de confiança.',
    r3Init: 'AC', r3Name: 'Ana Costa', r3Role: 'Dona de Casa',
    r3Text: 'Serviço residencial perfeito! A minha casa ficou a brilhar. Muito atenciosas com todos os detalhes.',
  },
  es: {
    headerSubtitle: 'Limpieza Profesional Portugal',
    navResidencial: 'Residencial', navComercial: 'Comercial', navPorqueNos: 'Por qué Nosotros',
    navSobre: 'Sobre', navTestemunhos: 'Testimonios', navCta: 'Presupuesto Gratis',
    heroBadge: 'Nuestros servicios de limpieza',
    heroTitle: 'Limpieza Profesional de Confianza en Portugal',
    heroDesc: '¿Quieres una casa impecable y recuperar tu tiempo libre? Contacta con Limpszone y aprovecha nuestros servicios de limpieza especializados.',
    heroStat1Num: '500+', heroStat1Label: 'Clientes Satisfechos',
    heroStat2Num: '4.9/5', heroStat2Label: 'Valoración',
    heroCta: 'Solicitar Presupuesto Gratis',
    servicesTitle: 'Cómo Limpszone Puede Ayudarte',
    servicesSub: 'Nuestros servicios de limpieza se adaptan a tus necesidades. Sin contratos, sin complicaciones.',
    servicesCta: 'Ver Todos los Servicios y Precios',
    learnMore: 'Saber más', requestService: 'Solicitar Servicio',
    materialsTitle: 'Materiales Utilizados:', areasTitle: 'Áreas Atendidas:',
    s1Title: 'Limpieza Residencial', s1Desc: 'Limpieza completa de casas y apartamentos',
    s2Title: 'Limpieza Comercial', s2Desc: 'Higienización de oficinas y establecimientos comerciales',
    s3Title: 'Restaurantes y Hoteles', s3Desc: 'Limpieza especializada para el sector alimenticio y hotelero',
    s4Title: 'Limpieza de Cristales', s4Desc: 'Limpieza profesional de cristales y fachadas',
    s5Title: 'Post-Obra', s5Desc: 'Limpieza pesada después de construcciones y reformas',
    s6Title: 'Mantenimiento de Edificios', s6Desc: 'Limpieza y mantenimiento de condominios y edificios',
    whyTitle: '¿Por qué Elegir Limpszone?',
    why1Title: 'Garantía de Satisfacción Total', why1Desc: 'Si el servicio no es de tu agrado, volvemos sin coste adicional.',
    why2Title: 'Equipo Verificado y Entrenado', why2Desc: 'Todos los profesionales pasan por verificación de antecedentes y formación especializada.',
    why3Title: 'Limpieza Personalizada', why3Desc: 'Creamos un plan de limpieza adaptado a tu espacio, rutina y presupuesto.',
    why4Title: 'Programación Fácil y Rápida', why4Desc: 'Presupuesto en menos de 1 hora. Reserva online o por teléfono con total flexibilidad.',
    whyCta: 'Solicitar Presupuesto Gratuito',
    promiseTitle: 'Nuestra Promesa de Calidad',
    promiseDesc: 'En Limpszone nos enorgullecemos de prestar servicios de limpieza de la más alta calidad. Utilizamos una lista de verificación de 40 puntos en cada visita para garantizar que nada quede sin hacer.',
    promiseCta: 'Saber Más',
    reviewsTitle: 'Valoraciones de Clientes', reviewsCta: 'Ver Todas las Valoraciones',
    bannerTitle: '¿Listo para un espacio verdaderamente limpio?',
    bannerSub: 'Presupuesto gratuito en menos de 1 hora. Sin contratos, sin compromisos.',
    bannerCta: 'Solicitar Presupuesto Gratis',
    calcTitle: 'Calculadora de Presupuesto',
    calcSub: 'Obtenga un presupuesto instantáneo para su servicio de limpieza.',
    calcCardTitle: 'Configure su Presupuesto', calcCardDesc: 'Rellene los campos para calcular el precio de su servicio',
    step1: '1️⃣ Tipos de Servicio * (Seleccione uno o más)', step2: '2️⃣ Cantidad *',
    step3: '3️⃣ Tipo de Material *', step4: '4️⃣ Nivel de Suciedad *', step5: '5️⃣ Localidad *',
    stepAddr: '📍 Dirección Completa *', stepObs: '📝 Observaciones Adicionales (opcional)',
    selectMaterial: 'Seleccione el tipo de material', selectDirt: 'Seleccione el nivel de suciedad',
    selectLocal: 'Seleccione la localidad', selectAddr: 'Escriba su dirección completa',
    selectObsPlaceholder: 'Describa manchas, áreas con moho, daños u otra información importante...',
    promoActive: '🎉 Promoción Activa:', promoDesc: 'de descuento por múltiples servicios!',
    priceTitle: 'Precio Total Estimado', subtotal: 'Subtotal (sin descuento):',
    discountApplied: 'Descuento aplicado', finalPrice: 'Valor final con descuento',
    selectOptions: 'Seleccione las opciones anteriores para ver el precio',
    discountTip: '💡 Descuentos automáticos: 10% para 2 servicios, 15% para 3 servicios, 20% para 4+ servicios',
    submitBtn: 'Solicitar Servicio', submitNote: 'Su información será enviada a suportelimpszone@gmail.com',
    fillRequired: 'Por favor, rellene todos los campos obligatorios.',
    posObraLabel: '🏠 Número de Habitaciones (Post-Obra) *',
    posObraNote: 'Valor base: 125,00 € (1 habitación) + 15,00 € por habitación adicional',
    limpezaGeralLabel: '🏡 Número de Dormitorios (Limpieza General) *',
    limpezaGeralNote: '💡 El valor incluye automáticamente salón, cocina, baño y terraza.',
    modalTitle: 'Solicitar Servicio', modalDesc: 'Rellene los datos para solicitar su servicio con cálculo automático de precio.',
    fieldName: 'Nombre *', fieldPhone: 'Teléfono *', fieldEmail: 'E-mail *',
    fieldAddress: 'Dirección Completa *', fieldServices: 'Tipos de Servicio * (Seleccione uno o más)',
    fieldMaterial: 'Tipo de Material *', fieldDirt: 'Nivel de Suciedad *', fieldDistance: 'Distancia *',
    fieldObs: 'Observaciones Adicionales (opcional)',
    namePlaceholder: 'Su nombre completo', phonePlaceholder: '+351 920 000 000',
    emailPlaceholder: 'Escriba su e-mail', addressPlaceholder: 'Calle, número, localidad, ciudad',
    selectMaterialPlaceholder: 'Seleccione el material', selectDirtPlaceholder: 'Seleccione el nivel',
    selectDistancePlaceholder: 'Seleccione la distancia', priceTotal: 'Precio Total',
    successMsg: '✅ ¡Solicitud enviada con éxito! Nos pondremos en contacto pronto.',
    errorMsg: '❌ Error al enviar la solicitud. Inténtelo de nuevo.',
    successBanner: '✅ ¡Solicitud enviada con éxito! Pronto nos pondremos en contacto.',
    faqTitle: 'Respuestas a las Preguntas Más Frecuentes', faqSub: '¿Tiene más dudas sobre nuestros servicios? Consulte abajo.',
    faq1Q: '¿Qué garantiza la calidad del servicio de Limpszone?',
    faq1A: 'Limpszone garantiza un servicio de excelencia con una lista de 40 puntos. Si algo no está a su gusto, nuestro equipo regresa en 24h para corregir, sin ningún coste adicional.',
    faq2Q: '¿Cuánto tiempo lleva Limpszone en actividad?',
    faq2A: 'Limpszone lleva 5 años en el mercado, habiendo prestado servicios a más de 500 clientes satisfechos en Portugal.',
    faq3Q: '¿Necesito estar presente durante la limpieza?',
    faq3A: 'No es necesario. Nuestro equipo es de total confianza y todos los profesionales pasan por verificación de antecedentes.',
    faq4Q: '¿Con qué frecuencia puedo contratar el servicio?',
    faq4A: 'Ofrecemos servicios puntuales, semanales, quincenales o mensuales, sin contratos a largo plazo ni penalizaciones.',
    footerDesc: 'Una limpieza en la que puede confiar.', footerTagline: 'Una limpieza en la que puede confiar.®',
    footerServices: 'Servicios', footerCompany: 'Empresa', footerResources: 'Recursos',
    footerMonFri: 'Lunes - Viernes: 7:00 - 19:00', footerSat: 'Sábado: 8:00 - 17:00',
    footerSun: 'Domingo: 9:00 - 15:00', footerEmergency: 'Emergencias: 24/7',
    footerCopy: '© 2024 Limpszone — Limpieza Profesional Portugal. Todos los derechos reservados.',
    footerWhatsApp: 'WhatsApp', footerLocation: 'Portugal, Unión Europea',
    r1Init: 'MS', r1Name: 'Maria Silva', r1Role: 'Propietaria de Restaurante',
    r1Text: '¡El equipo hizo un trabajo fantástico en nuestro restaurante! Muy profesional y puntual.',
    r2Init: 'JS', r2Name: 'João Santos', r2Role: 'Gerente de Hotel',
    r2Text: 'Trabajo impecable en la limpieza del hotel. Los clientes siempre elogian la calidad de las habitaciones.',
    r3Init: 'AC', r3Name: 'Ana Costa', r3Role: 'Ama de Casa',
    r3Text: '¡Servicio residencial perfecto! Mi casa quedó brillando. Muy atentas con todos los detalles.',
  }
}

// Pink & Navy — Molly Maid inspired palette
const PINK = '#c41e5b'
const NAVY = '#1a2744'

export default function LimpsZoneApp() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '', phone: '', user_email: '', address: '',
    services: [] as string[], material: '', dirtLevel: '', distance: '',
    quantity: 1, observations: '', posObraCompartments: 1, limpezaGeralQuartos: 1
  })
  const [calculatedFormPrice, setCalculatedFormPrice] = useState(0)
  const [formDiscount, setFormDiscount] = useState(0)
  const [formDiscountAmount, setFormDiscountAmount] = useState(0)

  const [lang, setLang] = useState<Lang>('pt')
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setLang(navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'pt')
    }
  }, [])
  const T = LOCALES[lang]

  const [budgetData, setBudgetData] = useState({
    serviceTypes: [] as string[], materialType: '', dirtLevel: '', address: '',
    neighborhood: '', quantity: 1, observations: '', posObraCompartments: 1, limpezaGeralQuartos: 1
  })
  const [calculatedPrice, setCalculatedPrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)

  const services = [
    { id: 'residencial', title: T.s1Title, description: T.s1Desc, icon: Home,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=260&fit=crop',
      materials: lang==='es'?['Aspirador profesional','Productos biodegradables','Paños de microfibra','Equipos de seguridad']:['Aspirador profissional','Produtos biodegradáveis','Panos de microfibra','Equipamentos de segurança'],
      areas: lang==='es'?['Dormitorios','Salones','Cocinas','Baños','Áreas externas']:['Quartos','Salas','Cozinhas','Casas de banho','Áreas externas'] },
    { id: 'comercial', title: T.s2Title, description: T.s2Desc, icon: Building2,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=260&fit=crop',
      materials: lang==='es'?['Máquinas industriales','Desinfectantes profesionales','Equipos de limpieza','Productos especializados']:['Máquinas industriais','Desinfetantes profissionais','Equipamentos de limpeza','Produtos especializados'],
      areas: lang==='es'?['Oficinas','Recepciones','Baños','Pasillos','Áreas comunes']:['Escritórios','Recepções','Casas de banho','Corredores','Áreas comuns'] },
    { id: 'restaurantes', title: T.s3Title, description: T.s3Desc, icon: UtensilsCrossed,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=260&fit=crop',
      materials: lang==='es'?['Sanitizantes alimentarios','Equipos industriales','Productos antibacterianos','Materiales certificados']:['Sanitizantes alimentares','Equipamentos industriais','Produtos anti-bacterianos','Materiais certificados'],
      areas: lang==='es'?['Cocinas','Salones','Habitaciones','Baños','Áreas de servicio']:['Cozinhas','Salões','Quartos','Casas de banho','Áreas de serviço'] },
    { id: 'vidros', title: T.s4Title, description: T.s4Desc, icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=260&fit=crop',
      materials: lang==='es'?['Rastrillos profesionales','Productos específicos','Equipos de altura','Paños especiales']:['Rodos profissionais','Produtos específicos','Equipamentos de altura','Panos especiais'],
      areas: lang==='es'?['Ventanas','Fachadas','Escaparates','Divisorias','Espejos']:['Janelas','Fachadas','Montras','Divisórias','Espelhos'] },
    { id: 'pos-obra', title: T.s5Title, description: T.s5Desc, icon: Shield,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=260&fit=crop',
      materials: lang==='es'?['Equipos pesados','Productos específicos','Herramientas especializadas','EPIs completos']:['Equipamentos pesados','Produtos específicos','Ferramentas especializadas','EPIs completos'],
      areas: lang==='es'?['Retirada de escombros','Limpieza de paredes','Pavimentos','Acabados','Detallado']:['Remoção de entulho','Limpeza de paredes','Pavimentos','Acabamentos','Detalhamento'] },
    { id: 'manutencao', title: T.s6Title, description: T.s6Desc, icon: Award,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=260&fit=crop',
      materials: lang==='es'?['Máquinas industriales','Productos profesionales','Equipos de seguridad','Herramientas especializadas']:['Máquinas industriais','Produtos profissionais','Equipamentos de segurança','Ferramentas especializadas'],
      areas: lang==='es'?['Áreas comunes','Garajes','Ascensores','Escaleras','Fachadas']:['Áreas comuns','Garagens','Elevadores','Escadas','Fachadas'] },
  ]

  const serviceTypes = [
    { id:'sofa', name:lang==='es'?'Limpieza de Sofá':'Limpeza de Sofá', basePrice:45 },
    { id:'hipermeabilizacao-sofa', name:lang==='es'?'Hipermeabilización de Sofá':'Hipermeabilização de Sofá', basePrice:160 },
    { id:'colchao-solteiro', name:lang==='es'?'Colchón Individual':'Colchão de Solteiro', basePrice:40 },
    { id:'colchao-casal', name:lang==='es'?'Colchón de Matrimonio':'Colchão de Casal', basePrice:50 },
    { id:'tapetes', name:lang==='es'?'Alfombra':'Tapete', basePrice:10 },
    { id:'pos-obra', name:lang==='es'?'Limpieza Post-Obra':'Limpeza Pós-Obras', basePrice:125 },
    { id:'cadeiras', name:lang==='es'?'Limpieza de Sillas':'Limpeza de Cadeiras', basePrice:8 },
    { id:'armarios', name:lang==='es'?'Limpieza de Armarios':'Limpeza de Armários', basePrice:13 },
    { id:'cortinas', name:lang==='es'?'Limpieza de Cortinas':'Limpeza de Cortinas', basePrice:15 },
    { id:'vidros', name:lang==='es'?'Limpieza de Cristales':'Limpeza de Vidros', basePrice:12 },
    { id:'escritorios', name:lang==='es'?'Higienización de Oficinas/Hoteles':'Higienização de Escritórios/Hotéis', basePrice:30 },
    { id:'wc-sanitarios', name:lang==='es'?'Limpieza de Baños / Sanitarios':'Limpeza de WC / Sanitários / Lavatórios', basePrice:11 },
    { id:'fogoes-fornos', name:lang==='es'?'Limpieza de Cocinas / Hornos':'Limpeza de Fogões / Fornos', basePrice:15 },
    { id:'limpeza-geral', name:lang==='es'?'Limpieza General de Casa Amueblada':'Limpeza Geral de Casa Mobilada', basePrice:50 },
  ]

  const materialTypes = [
    { id:'tecido', name:lang==='es'?'Tela común':'Tecido comum', multiplier:1.0 },
    { id:'couro', name:lang==='es'?'Cuero natural':'Couro natural', multiplier:1.15 },
    { id:'napa', name:'Napa', multiplier:1.20 },
    { id:'camurca', name:lang==='es'?'Ante':'Camurça', multiplier:1.20 },
    { id:'madeira', name:lang==='es'?'Madera':'Madeira', multiplier:1.10 },
    { id:'aluminio', name:lang==='es'?'Aluminio':'Alumínio', multiplier:1.0 },
    { id:'vidro', name:lang==='es'?'Cristal':'Vidro', multiplier:1.0 },
    { id:'azulejo', name:'Azulejo', multiplier:1.0 },
    { id:'aco', name:lang==='es'?'Acero inox':'Aço inox', multiplier:1.10 },
  ]

  const dirtLevels = [
    { id:'leve', name:lang==='es'?'Leve':'Leve', multiplier:1.0 },
    { id:'media', name:lang==='es'?'Media':'Média', multiplier:1.15 },
    { id:'pesada', name:lang==='es'?'Pesada':'Pesada', multiplier:1.30 },
    { id:'manchas', name:lang==='es'?'Con manchas difíciles':'Com manchas difíceis', multiplier:1.30 },
  ]

  const distanceOptions = [
    { id:'centro', name:lang==='es'?'Centro':'Centro', multiplier:1.0 },
    { id:'fora-centro', name:lang==='es'?'Fuera del Centro':'Fora do Centro', multiplier:1.10 },
    { id:'periferia', name:lang==='es'?'Periferia':'Periferia', multiplier:1.20 },
  ]

  const neighborhoods = [
    { id:'centro', name:'Centro', multiplier:1.0 }, { id:'lisboa', name:'Lisboa', multiplier:1.0 },
    { id:'porto', name:'Porto', multiplier:1.0 }, { id:'cascais', name:'Cascais', multiplier:1.05 },
    { id:'sintra', name:'Sintra', multiplier:1.05 }, { id:'oeiras', name:'Oeiras', multiplier:1.10 },
    { id:'almada', name:'Almada', multiplier:1.15 }, { id:'setubal', name:'Setúbal', multiplier:1.20 },
    { id:'braga', name:'Braga', multiplier:1.20 },
    { id:'outro', name:lang==='es'?'Otra localidad':'Outra localidade', multiplier:1.10 },
  ]

  const calcDiscount = (n:number) => n>=4?20:n>=3?15:n>=2?10:0
  const posObraPrice = (b:number,c:number) => b+(Math.max(0,c-1)*15)
  const limpezaGeralPrice = (b:number,q:number) => b+(Math.max(0,q-1)*15)

  const calcFormPrice = () => {
    if(!formData.services.length||!formData.material||!formData.dirtLevel||!formData.distance){setCalculatedFormPrice(0);setFormDiscount(0);setFormDiscountAmount(0);return}
    const mat=materialTypes.find(m=>m.name===formData.material)
    const dirt=dirtLevels.find(d=>d.name===formData.dirtLevel)
    const dist=distanceOptions.find(d=>d.name===formData.distance)
    if(mat&&dirt&&dist){
      let total=0
      formData.services.forEach(sName=>{const s=serviceTypes.find(st=>st.name===sName);if(s){let p=s.id==='pos-obra'?posObraPrice(s.basePrice,formData.posObraCompartments):s.id==='limpeza-geral'?limpezaGeralPrice(s.basePrice,formData.limpezaGeralQuartos):s.basePrice*formData.quantity;total+=p*mat.multiplier*dirt.multiplier*dist.multiplier}})
      const dp=calcDiscount(formData.services.length);const dv=(total*dp)/100
      setCalculatedFormPrice(Math.round((total-dv)*100)/100);setFormDiscount(dp);setFormDiscountAmount(Math.round(dv*100)/100)
    }
  }

  const calcPrice = () => {
    if(!budgetData.serviceTypes.length||!budgetData.materialType||!budgetData.dirtLevel){setCalculatedPrice(0);setDiscount(0);setDiscountAmount(0);return}
    const mat=materialTypes.find(m=>m.id===budgetData.materialType)
    const dirt=dirtLevels.find(d=>d.id===budgetData.dirtLevel)
    const nb=neighborhoods.find(n=>n.id===budgetData.neighborhood)||{multiplier:1.0}
    if(mat&&dirt){
      let total=0
      budgetData.serviceTypes.forEach(sid=>{const s=serviceTypes.find(st=>st.id===sid);if(s){let p=s.id==='pos-obra'?posObraPrice(s.basePrice,budgetData.posObraCompartments):s.id==='limpeza-geral'?limpezaGeralPrice(s.basePrice,budgetData.limpezaGeralQuartos):s.basePrice*budgetData.quantity;total+=p*mat.multiplier*dirt.multiplier*nb.multiplier}})
      const dp=calcDiscount(budgetData.serviceTypes.length);const dv=(total*dp)/100
      setCalculatedPrice(Math.round((total-dv)*100)/100);setDiscount(dp);setDiscountAmount(Math.round(dv*100)/100)
    }
  }

  useEffect(()=>{calcPrice()},[budgetData])
  useEffect(()=>{calcFormPrice()},[formData.services,formData.material,formData.dirtLevel,formData.distance,formData.quantity,formData.posObraCompartments,formData.limpezaGeralQuartos])

  const updBudget=(f:string,v:any)=>setBudgetData(p=>({...p,[f]:v}))
  const toggleSvc=(id:string)=>setBudgetData(p=>({...p,serviceTypes:p.serviceTypes.includes(id)?p.serviceTypes.filter(x=>x!==id):[...p.serviceTypes,id]}))
  const toggleFormSvc=(name:string)=>setFormData(p=>({...p,services:p.services.includes(name)?p.services.filter(x=>x!==name):[...p.services,name]}))

  const handleBudgetSubmit=async()=>{
    if(!budgetData.serviceTypes.length||!budgetData.materialType||!budgetData.dirtLevel||!budgetData.address){alert(T.fillRequired);return}
    try{
      const mat=materialTypes.find(m=>m.id===budgetData.materialType)
      const dirt=dirtLevels.find(d=>d.id===budgetData.dirtLevel)
      const nb=neighborhoods.find(n=>n.id===budgetData.neighborhood)
      const lines=budgetData.serviceTypes.map(sid=>{const s=serviceTypes.find(st=>st.id===sid);if(!s)return'';let p=s.id==='pos-obra'?posObraPrice(s.basePrice,budgetData.posObraCompartments):s.id==='limpeza-geral'?limpezaGeralPrice(s.basePrice,budgetData.limpezaGeralQuartos):s.basePrice*budgetData.quantity;p=p*(mat?.multiplier||1)*(dirt?.multiplier||1)*(nb?.multiplier||1);return`• ${s.name}: ${(Math.round(p*100)/100).toFixed(2)} €`}).filter(Boolean).join('\n')
      const subj=encodeURIComponent('Nova Solicitação de Serviço - Limpszone')
      const body=encodeURIComponent(`NOVA SOLICITAÇÃO\n\n${lines}\n\nTOTAL: ${calculatedPrice.toFixed(2)} €\n\nEndereço: ${budgetData.address}`)
      window.location.href=`mailto:suportelimpszone@gmail.com?subject=${subj}&body=${body}`
      setShowSuccessMessage(true)
      setBudgetData({serviceTypes:[],materialType:'',dirtLevel:'',address:'',neighborhood:'',quantity:1,observations:'',posObraCompartments:1,limpezaGeralQuartos:1})
      setCalculatedPrice(0);setDiscount(0);setDiscountAmount(0)
      setTimeout(()=>setShowSuccessMessage(false),5000)
    }catch(e){console.error(e)}
  }

  const handleFormSubmit=async(e:React.FormEvent)=>{
    e.preventDefault()
    if(!formData.name||!formData.phone||!formData.user_email||!formData.address||!formData.services.length||!formData.material||!formData.dirtLevel||!formData.distance){alert(T.fillRequired);return}
    try{
      const emailData:ServiceFormData={name:formData.name,phone:formData.phone,user_email:formData.user_email,address:formData.address,services:formData.services,material:formData.material,dirtLevel:formData.dirtLevel,distance:formData.distance,totalPrice:`${calculatedFormPrice.toFixed(2)}`}
      await sendServiceRequest(emailData)
      toast.success(T.successMsg)
      setShowSuccessMessage(true);setIsFormOpen(false)
      setFormData({name:'',phone:'',user_email:'',address:'',services:[],material:'',dirtLevel:'',distance:'',quantity:1,observations:'',posObraCompartments:1,limpezaGeralQuartos:1})
      setCalculatedFormPrice(0);setFormDiscount(0);setFormDiscountAmount(0)
      setTimeout(()=>setShowSuccessMessage(false),5000)
    }catch(e){toast.error(T.errorMsg)}
  }

  const setField=(f:string,v:any)=>setFormData(p=>({...p,[f]:v}))
  const openServiceForm=(title:string)=>{setFormData(p=>({...p,services:[title]}));setIsFormOpen(true)}
  const scrollToCalc=()=>document.getElementById('budget-calculator')?.scrollIntoView({behavior:'smooth'})

  const faqItems=[{q:T.faq1Q,a:T.faq1A},{q:T.faq2Q,a:T.faq2A},{q:T.faq3Q,a:T.faq3A},{q:T.faq4Q,a:T.faq4A}]

  const reviews=[
    {init:T.r1Init,name:T.r1Name,role:T.r1Role,text:T.r1Text},
    {init:T.r2Init,name:T.r2Name,role:T.r2Role,text:T.r2Text},
    {init:T.r3Init,name:T.r3Name,role:T.r3Role,text:T.r3Text},
  ]

  // Shared button styles
  const btnPink={background:PINK,color:'#fff'}
  const btnNavy={background:NAVY,color:'#fff'}

  return (
    <div className="min-h-screen bg-white" style={{fontFamily:"'Nunito Sans','Inter',sans-serif"}}>

      {/* SUCCESS TOAST */}
      {showSuccessMessage&&(
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5"/><span>{T.successBanner}</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:PINK}}>
              <Sparkles className="h-5 w-5 text-white"/>
            </div>
            <div>
              <div><span className="text-xl font-black tracking-tight" style={{color:NAVY}}>LIMPS</span><span className="text-xl font-black tracking-tight" style={{color:PINK}}>ZONE</span></div>
              <p className="text-xs text-gray-400 leading-none">{T.headerSubtitle}</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-5">
            {[T.navResidencial,T.navComercial,T.navPorqueNos,T.navSobre,T.navTestemunhos].map(item=>(
              <a key={item} href="#" className="text-sm font-semibold text-gray-600 hover:text-pink-600 transition-colors">{item}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={scrollToCalc} className="hidden md:flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg" style={btnNavy}>
              <Calculator className="h-4 w-4"/>{T.navCta}
            </button>
            <a href="tel:+351934071930" className="text-lg font-black" style={{color:PINK}}>+351 934 071 930</a>
          </div>
        </div>
      </header>

      {/* ── HERO — full width photo + overlaid card ── */}
      <section className="relative overflow-hidden" style={{minHeight:500}}>
        <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&h=580&fit=crop&fp-y=0.35" alt="Limpeza profissional" className="w-full object-cover absolute inset-0" style={{minHeight:500,height:'100%'}}/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to right,rgba(0,0,0,0.22) 0%,rgba(0,0,0,0) 65%)'}}/>
        <div className="relative container mx-auto px-6 py-16 flex items-center" style={{minHeight:500}}>
          <div className="bg-white/93 backdrop-blur-sm rounded-2xl p-8 max-w-[520px] shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:PINK}}>{T.heroBadge}</p>
            <h1 className="text-3xl font-black leading-tight mb-4" style={{color:PINK,letterSpacing:'-0.5px'}}>{T.heroTitle}</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{T.heroDesc}</p>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬💬💬</span>
                <div>
                  <p className="text-2xl font-black text-gray-800 leading-none">{T.heroStat1Num}</p>
                  <p className="text-xs text-gray-400 font-semibold">{T.heroStat1Label}</p>
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200"/>
              <div>
                <p className="text-2xl font-black text-gray-800 leading-none">{T.heroStat2Num}</p>
                <p className="text-xs text-gray-400 font-semibold">⭐⭐⭐⭐⭐ {T.heroStat2Label}</p>
              </div>
            </div>
            {/* CTA 1 */}
            <button onClick={scrollToCalc} className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-lg text-sm" style={btnPink}>
              <Calculator className="h-4 w-4"/>{T.heroCta}
            </button>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-3" style={{color:PINK}}>{T.servicesTitle}</h2>
          <p className="text-gray-400 text-sm text-center max-w-2xl mx-auto mb-10 leading-relaxed">{T.servicesSub}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(service=>{
              const Icon=service.icon
              return(
                <div key={service.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img src={service.image} alt={service.title} className="w-full h-48 object-cover"/>
                    <div className="absolute top-3 left-3 bg-white/90 p-2 rounded-lg">
                      <Icon className="h-4 w-4" style={{color:NAVY}}/>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-black text-gray-800 mb-1">{service.title}</h3>
                    <p className="text-xs text-gray-400 mb-3">{service.description}</p>
                    <div className="mb-3">
                      <p className="text-xs font-bold text-gray-600 mb-1.5">{T.materialsTitle}</p>
                      <div className="flex flex-wrap gap-1">
                        {service.materials.map((m,i)=><span key={i} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{m}</span>)}
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-600 mb-1.5">{T.areasTitle}</p>
                      <div className="space-y-1">
                        {service.areas.map((a,i)=>(
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0"/>{a}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <button onClick={()=>openServiceForm(service.title)} className="text-xs font-bold text-white px-4 py-2 rounded-lg flex items-center gap-1" style={btnPink}>
                        {T.requestService}<ArrowRight className="h-3 w-3"/>
                      </button>
                      <button onClick={()=>openServiceForm(service.title)} className="text-xs font-semibold text-gray-400 hover:text-gray-600 flex items-center gap-1">
                        {T.learnMore}<ArrowRight className="h-3 w-3"/>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {/* CTA 2 */}
          <div className="text-center mt-10">
            <button onClick={scrollToCalc} className="inline-flex items-center gap-2 text-white font-bold px-8 py-3 rounded-lg text-sm" style={btnNavy}>
              <Calculator className="h-4 w-4"/>{T.servicesCta}
            </button>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-black mb-5" style={{color:NAVY}}>{T.whyTitle}</h2>
              {[{t:T.why1Title,d:T.why1Desc},{t:T.why2Title,d:T.why2Desc},{t:T.why3Title,d:T.why3Desc},{t:T.why4Title,d:T.why4Desc}].map((item,i)=>(
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 mb-3" style={{borderLeft:`4px solid ${NAVY}`}}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{background:NAVY}}>
                      <CheckCircle className="h-3 w-3 text-white"/>
                    </div>
                    <p className="text-sm font-black text-gray-800">{item.t}</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed ml-7">{item.d}</p>
                </div>
              ))}
              {/* CTA 3 */}
              <button onClick={scrollToCalc} className="mt-4 flex items-center gap-2 text-white font-bold px-6 py-3 rounded-lg text-sm" style={btnNavy}>
                {T.whyCta}<ArrowRight className="h-4 w-4"/>
              </button>
            </div>
            <img src="https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=600&h=500&fit=crop&fp-y=0.3" alt="Equipa" className="w-full object-cover rounded-2xl" style={{maxHeight:440}}/>
          </div>
        </div>
      </section>

      {/* ── PROMISE ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <img src="https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=400&fit=crop" alt="Qualidade" className="w-full h-72 object-cover rounded-2xl"/>
            <div>
              <h2 className="text-2xl font-black mb-4" style={{color:PINK}}>{T.promiseTitle}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{T.promiseDesc}</p>
              {/* CTA 4 */}
              <button onClick={scrollToCalc} className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-lg text-sm" style={btnNavy}>
                {T.promiseCta}<ArrowRight className="h-4 w-4"/>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACTO ── */}
      <ImpactoHigienizacao onSolicitarServico={()=>setIsFormOpen(true)}/>

      {/* ── REVIEWS ── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-10" style={{color:PINK}}>{T.reviewsTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {reviews.map((r,i)=>(
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white" style={{background:NAVY}}>{r.init}</div>
                  <div>
                    <p className="text-sm font-black text-gray-800">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_,j)=><Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400"/>)}</div>
                <p className="text-xs text-gray-500 leading-relaxed italic">"{r.text}"</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={scrollToCalc} className="text-white font-bold px-8 py-3 rounded-lg text-sm" style={btnNavy}>{T.reviewsCta}</button>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-14" style={{background:NAVY}}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">{T.bannerTitle}</h2>
            <p className="text-gray-400 text-sm">{T.bannerSub}</p>
          </div>
          {/* CTA 5 */}
          <button onClick={scrollToCalc} className="flex-shrink-0 flex items-center gap-2 font-bold px-8 py-4 rounded-lg text-sm" style={btnPink}>
            <Calculator className="h-4 w-4"/>{T.bannerCta}
          </button>
        </div>
      </section>

      {/* ── BUDGET CALCULATOR ── */}
      <section id="budget-calculator" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calculator className="h-8 w-8" style={{color:NAVY}}/>
            <h2 className="text-3xl font-black" style={{color:NAVY}}>{T.calcTitle}</h2>
          </div>
          <p className="text-gray-400 text-sm text-center max-w-2xl mx-auto mb-10">{T.calcSub}</p>
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <div className="p-6 text-white" style={{background:NAVY}}>
                <h3 className="text-xl font-black flex items-center gap-2"><DollarSign className="h-5 w-5"/>{T.calcCardTitle}</h3>
                <p className="text-gray-300 text-sm mt-1">{T.calcCardDesc}</p>
              </div>
              <div className="p-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label className="text-sm font-black text-gray-700 mb-3 block">{T.step1}</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {serviceTypes.map(s=>(
                        <div key={s.id} className="flex items-center gap-2">
                          <Checkbox id={s.id} checked={budgetData.serviceTypes.includes(s.id)} onCheckedChange={()=>toggleSvc(s.id)}/>
                          <Label htmlFor={s.id} className="text-sm cursor-pointer text-gray-600">{s.name}</Label>
                        </div>
                      ))}
                    </div>
                    {budgetData.serviceTypes.length>=2&&(
                      <div className="mt-3 p-3 rounded-lg border flex items-center gap-2" style={{background:'#f0fdf4',borderColor:'#bbf7d0'}}>
                        <Zap className="h-4 w-4 text-green-600"/>
                        <span className="text-green-700 font-bold text-sm">{T.promoActive} {budgetData.serviceTypes.length>=4?'20%':budgetData.serviceTypes.length>=3?'15%':'10%'} {T.promoDesc}</span>
                      </div>
                    )}
                  </div>
                  {budgetData.serviceTypes.includes('pos-obra')&&(
                    <div className="md:col-span-2">
                      <Label className="text-sm font-black text-gray-700 mb-3 block">{T.posObraLabel}</Label>
                      <div className="flex items-center gap-3">
                        <Button type="button" variant="outline" size="sm" onClick={()=>updBudget('posObraCompartments',Math.max(1,budgetData.posObraCompartments-1))} className="h-10 w-10"><Minus className="h-4 w-4"/></Button>
                        <Input type="number" min="1" value={budgetData.posObraCompartments} onChange={e=>updBudget('posObraCompartments',Math.max(1,parseInt(e.target.value)||1))} className="h-10 text-center w-20"/>
                        <Button type="button" variant="outline" size="sm" onClick={()=>updBudget('posObraCompartments',budgetData.posObraCompartments+1)} className="h-10 w-10"><Plus className="h-4 w-4"/></Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{T.posObraNote}</p>
                    </div>
                  )}
                  {budgetData.serviceTypes.includes('limpeza-geral')&&(
                    <div className="md:col-span-2">
                      <Label className="text-sm font-black text-gray-700 mb-3 block">{T.limpezaGeralLabel}</Label>
                      <div className="flex items-center gap-3">
                        <Button type="button" variant="outline" size="sm" onClick={()=>updBudget('limpezaGeralQuartos',Math.max(1,budgetData.limpezaGeralQuartos-1))} className="h-10 w-10"><Minus className="h-4 w-4"/></Button>
                        <Input type="number" min="1" value={budgetData.limpezaGeralQuartos} onChange={e=>updBudget('limpezaGeralQuartos',Math.max(1,parseInt(e.target.value)||1))} className="h-10 text-center w-20"/>
                        <Button type="button" variant="outline" size="sm" onClick={()=>updBudget('limpezaGeralQuartos',budgetData.limpezaGeralQuartos+1)} className="h-10 w-10"><Plus className="h-4 w-4"/></Button>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">{T.limpezaGeralNote}</p>
                    </div>
                  )}
                  {!budgetData.serviceTypes.includes('pos-obra')&&!budgetData.serviceTypes.includes('limpeza-geral')&&(
                    <div>
                      <Label className="text-sm font-black text-gray-700 mb-3 block">{T.step2}</Label>
                      <div className="flex items-center gap-3">
                        <Button type="button" variant="outline" size="sm" onClick={()=>updBudget('quantity',Math.max(1,budgetData.quantity-1))} className="h-10 w-10"><Minus className="h-4 w-4"/></Button>
                        <Input type="number" min="1" value={budgetData.quantity} onChange={e=>updBudget('quantity',Math.max(1,parseInt(e.target.value)||1))} className="h-10 text-center w-20"/>
                        <Button type="button" variant="outline" size="sm" onClick={()=>updBudget('quantity',budgetData.quantity+1)} className="h-10 w-10"><Plus className="h-4 w-4"/></Button>
                      </div>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-black text-gray-700 mb-3 block">{T.step3}</Label>
                    <Select value={budgetData.materialType} onValueChange={v=>updBudget('materialType',v)}>
                      <SelectTrigger className="h-10"><SelectValue placeholder={T.selectMaterial}/></SelectTrigger>
                      <SelectContent>{materialTypes.map(m=><SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-black text-gray-700 mb-3 block">{T.step4}</Label>
                    <Select value={budgetData.dirtLevel} onValueChange={v=>updBudget('dirtLevel',v)}>
                      <SelectTrigger className="h-10"><SelectValue placeholder={T.selectDirt}/></SelectTrigger>
                      <SelectContent>{dirtLevels.map(d=><SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-black text-gray-700 mb-3 block">{T.step5}</Label>
                    <Select value={budgetData.neighborhood} onValueChange={v=>updBudget('neighborhood',v)}>
                      <SelectTrigger className="h-10"><SelectValue placeholder={T.selectLocal}/></SelectTrigger>
                      <SelectContent>{neighborhoods.map(n=><SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-black text-gray-700 mb-3 block">{T.stepAddr}</Label>
                    <Input value={budgetData.address} onChange={e=>updBudget('address',e.target.value)} placeholder={T.selectAddr} className="h-10"/>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-black text-gray-700 mb-3 block">{T.stepObs}</Label>
                    <Textarea value={budgetData.observations} onChange={e=>updBudget('observations',e.target.value)} placeholder={T.selectObsPlaceholder} className="min-h-[80px]"/>
                  </div>
                </div>
                <div className="mt-8 p-6 rounded-xl border-2 text-center" style={{background:'#f0fdf4',borderColor:'#bbf7d0'}}>
                  <h3 className="text-xl font-black text-gray-800 mb-2">{T.priceTitle}</h3>
                  {calculatedPrice>0&&(
                    <div className="mb-3 space-y-1">
                      <p className="text-sm text-gray-500">{T.subtotal} <span className="font-bold">{(calculatedPrice+discountAmount).toFixed(2)} €</span></p>
                      {discount>0&&<p className="text-sm text-red-500">{T.discountApplied} (-{discount}%): <span className="font-bold">-{discountAmount.toFixed(2)} €</span></p>}
                    </div>
                  )}
                  <div className="text-5xl font-black text-green-600 mb-1">{calculatedPrice>0?`${calculatedPrice.toFixed(2)} €`:'0,00 €'}</div>
                  <p className="text-sm text-gray-400">{calculatedPrice>0?T.finalPrice:T.selectOptions}</p>
                  {calculatedPrice>0&&<p className="text-xs text-gray-400 mt-2">{T.discountTip}</p>}
                </div>
                <div className="mt-6 text-center">
                  {/* CTA 6 */}
                  <button onClick={handleBudgetSubmit} disabled={!budgetData.serviceTypes.length||!budgetData.materialType||!budgetData.dirtLevel||!budgetData.address}
                    className="inline-flex items-center gap-2 text-white font-bold px-10 py-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed" style={btnPink}>
                    <Mail className="h-4 w-4"/>{T.submitBtn}
                  </button>
                  <p className="text-xs text-gray-400 mt-2">{T.submitNote}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-black text-center mb-2" style={{color:PINK}}>{T.faqTitle}</h2>
          <p className="text-gray-400 text-sm text-center mb-10">{T.faqSub}</p>
          <div className="space-y-3">
            {faqItems.map((item,i)=>(
              <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden" style={{borderLeft:`4px solid ${NAVY}`}}>
                <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <span className="text-sm font-black text-gray-800">{item.q}</span>
                  {openFaq===i?<ChevronUp className="h-4 w-4 flex-shrink-0 text-gray-400"/>:<ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400"/>}
                </button>
                {openFaq===i&&<div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODAL FORM ── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black" style={{color:NAVY}}>{T.modalTitle}</DialogTitle>
            <DialogDescription className="text-sm text-gray-400">{T.modalDesc}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label className="text-xs font-bold">{T.fieldName}</Label><Input required value={formData.name} onChange={e=>setField('name',e.target.value)} placeholder={T.namePlaceholder} className="mt-1"/></div>
              <div><Label className="text-xs font-bold">{T.fieldPhone}</Label><Input required value={formData.phone} onChange={e=>setField('phone',e.target.value)} placeholder={T.phonePlaceholder} className="mt-1"/></div>
            </div>
            <div><Label className="text-xs font-bold">{T.fieldEmail}</Label><Input type="email" required value={formData.user_email} onChange={e=>setField('user_email',e.target.value)} placeholder={T.emailPlaceholder} className="mt-1"/></div>
            <div><Label className="text-xs font-bold">{T.fieldAddress}</Label><Input required value={formData.address} onChange={e=>setField('address',e.target.value)} placeholder={T.addressPlaceholder} className="mt-1"/></div>
            <div>
              <Label className="text-xs font-bold block mb-2">{T.fieldServices}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                {serviceTypes.map(s=>(
                  <div key={s.id} className="flex items-center gap-2">
                    <Checkbox id={`form-${s.id}`} checked={formData.services.includes(s.name)} onCheckedChange={()=>toggleFormSvc(s.name)}/>
                    <Label htmlFor={`form-${s.id}`} className="text-xs cursor-pointer">{s.name}</Label>
                  </div>
                ))}
              </div>
              {formData.services.length>=2&&(
                <div className="mt-2 p-2 rounded-lg border text-xs font-bold text-green-700 flex items-center gap-2" style={{background:'#f0fdf4',borderColor:'#bbf7d0'}}>
                  <Zap className="h-3 w-3"/>{T.promoActive} {formData.services.length>=4?'20%':formData.services.length>=3?'15%':'10%'} {T.promoDesc}
                </div>
              )}
            </div>
            {formData.services.some(s=>s.includes('Pós-Obras')||s.includes('Post-Obra'))&&(
              <div>
                <Label className="text-xs font-bold">{T.posObraLabel}</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button type="button" variant="outline" size="sm" onClick={()=>setField('posObraCompartments',Math.max(1,formData.posObraCompartments-1))}><Minus className="h-3 w-3"/></Button>
                  <Input type="number" min="1" value={formData.posObraCompartments} onChange={e=>setField('posObraCompartments',Math.max(1,parseInt(e.target.value)||1))} className="text-center w-16"/>
                  <Button type="button" variant="outline" size="sm" onClick={()=>setField('posObraCompartments',formData.posObraCompartments+1)}><Plus className="h-3 w-3"/></Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">{T.posObraNote}</p>
              </div>
            )}
            {formData.services.some(s=>s.includes('Limpeza Geral')||s.includes('Limpieza General'))&&(
              <div>
                <Label className="text-xs font-bold">{T.limpezaGeralLabel}</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button type="button" variant="outline" size="sm" onClick={()=>setField('limpezaGeralQuartos',Math.max(1,formData.limpezaGeralQuartos-1))}><Minus className="h-3 w-3"/></Button>
                  <Input type="number" min="1" value={formData.limpezaGeralQuartos} onChange={e=>setField('limpezaGeralQuartos',Math.max(1,parseInt(e.target.value)||1))} className="text-center w-16"/>
                  <Button type="button" variant="outline" size="sm" onClick={()=>setField('limpezaGeralQuartos',formData.limpezaGeralQuartos+1)}><Plus className="h-3 w-3"/></Button>
                </div>
                <p className="text-xs text-blue-600 mt-1">{T.limpezaGeralNote}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!formData.services.some(s=>s.includes('Pós-Obras')||s.includes('Post-Obra')||s.includes('Limpeza Geral')||s.includes('Limpieza General'))&&(
                <div>
                  <Label className="text-xs font-bold">{T.step2}</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button type="button" variant="outline" size="sm" onClick={()=>setField('quantity',Math.max(1,formData.quantity-1))}><Minus className="h-3 w-3"/></Button>
                    <Input type="number" min="1" value={formData.quantity} onChange={e=>setField('quantity',Math.max(1,parseInt(e.target.value)||1))} className="text-center w-16"/>
                    <Button type="button" variant="outline" size="sm" onClick={()=>setField('quantity',formData.quantity+1)}><Plus className="h-3 w-3"/></Button>
                  </div>
                </div>
              )}
              <div>
                <Label className="text-xs font-bold">{T.fieldMaterial}</Label>
                <Select required value={formData.material} onValueChange={v=>setField('material',v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={T.selectMaterialPlaceholder}/></SelectTrigger>
                  <SelectContent>{materialTypes.map(m=><SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold">{T.fieldDirt}</Label>
                <Select required value={formData.dirtLevel} onValueChange={v=>setField('dirtLevel',v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={T.selectDirtPlaceholder}/></SelectTrigger>
                  <SelectContent>{dirtLevels.map(d=><SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-bold">{T.fieldDistance}</Label>
                <Select required value={formData.distance} onValueChange={v=>setField('distance',v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={T.selectDistancePlaceholder}/></SelectTrigger>
                  <SelectContent>{distanceOptions.map(d=><SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold">{T.fieldObs}</Label>
              <Textarea value={formData.observations} onChange={e=>setField('observations',e.target.value)} placeholder={T.selectObsPlaceholder} className="min-h-[60px] mt-1"/>
            </div>
            {calculatedFormPrice>0&&(
              <div className="p-4 rounded-xl border-2 text-center" style={{background:'#f0fdf4',borderColor:'#bbf7d0'}}>
                <p className="text-sm font-black text-gray-700 mb-1">{T.priceTotal}</p>
                <p className="text-xs text-gray-400">{T.subtotal} <span className="font-bold">{(calculatedFormPrice+formDiscountAmount).toFixed(2)} €</span></p>
                {formDiscount>0&&<p className="text-xs text-red-500">{T.discountApplied} (-{formDiscount}%): -{formDiscountAmount.toFixed(2)} €</p>}
                <p className="text-3xl font-black text-green-600">{calculatedFormPrice.toFixed(2)} €</p>
                <p className="text-xs text-gray-400">{T.finalPrice}</p>
              </div>
            )}
            <button type="submit" disabled={!formData.name||!formData.phone||!formData.user_email||!formData.address||!formData.services.length||!formData.material||!formData.dirtLevel||!formData.distance}
              className="w-full text-white font-bold py-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed" style={btnPink}>
              {T.submitBtn}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── FOOTER ── */}
      <footer style={{background:'#f4f4f4'}} className="pt-12 pb-6">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:PINK}}>
                  <Sparkles className="h-4 w-4 text-white"/>
                </div>
                <span className="text-lg font-black" style={{color:NAVY}}>LIMPS<span style={{color:PINK}}>ZONE</span></span>
              </div>
              <p className="text-xs text-gray-400 italic mb-3">{T.footerDesc}</p>
              <a href="tel:+351934071930" className="text-base font-black block mb-1" style={{color:PINK}}>📞 +351 934 071 930</a>
              <p className="text-xs text-gray-400">suportelimpszone@gmail.com</p>
              <div className="mt-3 space-y-0.5">
                <p className="text-xs text-gray-400">{T.footerMonFri}</p>
                <p className="text-xs text-gray-400">{T.footerSat}</p>
                <p className="text-xs text-gray-400">{T.footerSun}</p>
                <p className="text-xs font-bold text-green-600">{T.footerEmergency}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b-2 inline-block" style={{color:NAVY,borderColor:PINK}}>{T.footerServices}</p>
              {[T.s1Title,T.s2Title,T.s3Title,T.s4Title,T.s5Title,T.s6Title].map(s=>(
                <a key={s} href="#" className="block text-xs text-gray-500 hover:text-pink-600 mb-2 transition-colors">{s}</a>
              ))}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b-2 inline-block" style={{color:NAVY,borderColor:PINK}}>{T.footerCompany}</p>
              {[T.navPorqueNos,T.navSobre,'Contacte-nos',T.navTestemunhos].map(s=>(
                <a key={s} href="#" className="block text-xs text-gray-500 hover:text-pink-600 mb-2 transition-colors">{s}</a>
              ))}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b-2 inline-block" style={{color:NAVY,borderColor:PINK}}>{T.footerResources}</p>
              <a href="#budget-calculator" className="block text-xs text-gray-500 hover:text-pink-600 mb-2 transition-colors">{T.calcTitle}</a>
              <a href="#" className="block text-xs text-gray-500 hover:text-pink-600 mb-2 transition-colors">FAQ</a>
              <WhatsAppButton className="mt-3 inline-flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-lg" style={{background:'#25d366'}}>
                <MessageCircle className="h-3 w-3"/>{T.footerWhatsApp}
              </WhatsAppButton>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">{T.footerCopy}</p>
            <p className="text-xs text-gray-300 italic mt-1">{T.footerTagline}</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
