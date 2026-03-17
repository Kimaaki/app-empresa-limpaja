"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import WhatsAppButton from '@/components/WhatsAppButton'
import ImpactoHigienizacao from '@/components/ImpactoHigienizacao'
import { sendServiceRequest, type ServiceFormData } from '@/lib/emailjs'
import { toast } from 'sonner'
import {
  CheckCircle, Star, Building2, Home, UtensilsCrossed, Sparkles, Shield,
  MessageCircle, Calculator, DollarSign, Plus, Minus, Zap, Award,
  ChevronDown, ChevronUp, ArrowRight, Phone, Mail, MapPin, Clock,
  ChevronLeft, ChevronRight
} from 'lucide-react'

type Lang = 'pt' | 'es'

const LOCALES: Record<Lang, Record<string, string>> = {
  pt: {
    headerSubtitle: 'Limpeza Profissional',
    navServicos: 'Serviços', navPorqueNos: 'Por que Nós', navTestemunhos: 'Testemunhos',
    navCalc: 'Calculadora', navContacto: 'Contacto', navCta: 'Orçamento Grátis',
    heroBadge: 'Serviços de Limpeza Profissional',
    heroTitle: 'O Seu Espaço Impecável, Onde Quer que Esteja',
    heroDesc: 'Serviços de limpeza profissional para residências, hotéis e espaços comerciais em toda a Europa. Qualidade garantida, equipa de confiança.',
    heroStat1Num: '500+', heroStat1Label: 'Clientes Satisfeitos',
    heroStat2Num: '4.9/5', heroStat2Label: 'Avaliação',
    heroCta: 'Solicitar Orçamento Grátis',
    howTitle: 'Como Funciona', howSub: 'Limpo em 3 passos simples',
    how1Title: 'Solicite um orçamento', how1Desc: 'Preencha o formulário ou ligue-nos. Resposta garantida em menos de 1 hora.',
    how2Title: 'Agendamos a visita', how2Desc: 'Escolha o dia e hora mais conveniente. A nossa equipa chega pontualmente.',
    how3Title: 'Espaço impecável', how3Desc: 'Deixamos o seu espaço a brilhar. Satisfação garantida ou voltamos de graça.',
    servicesTitle: 'Os Nossos Serviços',
    servicesSub: 'Soluções completas de limpeza para todos os tipos de espaços. Sem contratos, sem complicações.',
    servicesCta: 'Ver Todos os Serviços e Preços',
    learnMore: 'Saber mais', requestService: 'Solicitar Serviço',
    materialsTitle: 'Materiais Utilizados:', areasTitle: 'Áreas Atendidas:',
    s1Title: 'Limpeza Residencial', s1Desc: 'Limpeza completa de casas e apartamentos',
    s2Title: 'Limpeza Comercial', s2Desc: 'Higienização de escritórios e espaços comerciais',
    s3Title: 'Restaurantes & Hotéis', s3Desc: 'Limpeza especializada para hotelaria e restauração',
    s4Title: 'Limpeza de Vidros', s4Desc: 'Limpeza profissional de vidros e fachadas',
    s5Title: 'Pós-Obra', s5Desc: 'Limpeza pesada após construções e remodelações',
    s6Title: 'Manutenção Predial', s6Desc: 'Limpeza contínua de condomínios e edifícios',
    whyTitle: 'Por que Escolher a Limpszone?',
    why1Title: 'Garantia de Satisfação Total', why1Desc: 'Se o serviço não estiver ao seu gosto, voltamos sem custo adicional. A sua satisfação é a nossa prioridade.',
    why2Title: 'Equipa Verificada e Treinada', why2Desc: 'Todos os profissionais passam por verificação de antecedentes e formação especializada.',
    why3Title: 'Limpeza Personalizada', why3Desc: 'Criamos um plano adaptado ao seu espaço, rotina e orçamento. Sem soluções genéricas.',
    why4Title: 'Agendamento Fácil', why4Desc: 'Orçamento em menos de 1 hora. Marque online ou por telefone com total flexibilidade.',
    whyCta: 'Solicitar Orçamento Gratuito',
    promiseTitle: 'A Nossa Promessa de Qualidade',
    promiseDesc: 'Utilizamos um checklist de 40 pontos em cada visita para garantir que nada fica por fazer. Se algo não estiver perfeito, corrigimos sem qualquer custo adicional. Confiança e excelência em cada serviço.',
    promiseCta: 'Saber Mais',
    reviewsTitle: 'O que Dizem os Nossos Clientes',
    reviewsSeeAll: 'Ver Todas as Avaliações',
    bannerTitle: 'Pronto para um espaço verdadeiramente limpo?',
    bannerSub: 'Orçamento gratuito em menos de 1 hora. Sem contratos, sem compromissos.',
    bannerCta: 'Solicitar Orçamento Grátis',
    calcTitle: 'Calculadora de Orçamento',
    calcSub: 'Obtenha um orçamento instantâneo. Selecione as opções abaixo e veja o preço em tempo real.',
    calcCardTitle: 'Configure o seu Orçamento', calcCardDesc: 'Preencha os campos para calcular o preço do seu serviço',
    step1: '1️⃣ Tipos de Serviço * (Selecione um ou mais)', step2: '2️⃣ Quantidade *',
    step3: '3️⃣ Tipo de Material *', step4: '4️⃣ Nível de Sujidade *', step5: '5️⃣ Localidade *',
    stepAddr: '📍 Endereço Completo *', stepObs: '📝 Observações Adicionais (opcional)',
    selectMaterial: 'Selecione o tipo de material', selectDirt: 'Selecione o nível de sujidade',
    selectLocal: 'Selecione a localidade', selectAddr: 'Digite o seu endereço completo',
    selectObsPlaceholder: 'Descreva manchas, áreas com bolor, danos ou outras informações...',
    promoActive: '🎉 Promoção Ativa:', promoDesc: 'de desconto por múltiplos serviços!',
    priceTitle: 'Preço Total Estimado', subtotal: 'Subtotal (sem desconto):',
    discountApplied: 'Desconto aplicado', finalPrice: 'Valor final com desconto',
    selectOptions: 'Selecione as opções acima para ver o preço',
    discountTip: '💡 Descontos: 10% para 2 serviços, 15% para 3, 20% para 4+',
    submitBtn: 'Solicitar Serviço', submitNote: 'As suas informações serão enviadas para suportelimpszone@gmail.com',
    fillRequired: 'Por favor, preencha todos os campos obrigatórios.',
    posObraLabel: '🏠 Número de Compartimentos (Pós-Obra) *',
    posObraNote: 'Valor base: 125,00 € (1 compartimento) + 15,00 € por compartimento adicional',
    limpezaGeralLabel: '🏡 Número de Quartos (Limpeza Geral) *',
    limpezaGeralNote: '💡 Inclui automaticamente sala, cozinha, WC e varanda.',
    modalTitle: 'Solicitar Serviço', modalDesc: 'Preencha os dados para solicitar o seu serviço com cálculo automático de preço.',
    fieldName: 'Nome *', fieldPhone: 'Telefone *', fieldEmail: 'E-mail *',
    fieldAddress: 'Endereço Completo *', fieldServices: 'Tipos de Serviço * (Selecione um ou mais)',
    fieldMaterial: 'Tipo de Material *', fieldDirt: 'Nível de Sujidade *', fieldDistance: 'Distância *',
    fieldObs: 'Observações (opcional)',
    namePlaceholder: 'O seu nome completo', phonePlaceholder: '+351 920 000 000',
    emailPlaceholder: 'O seu e-mail', addressPlaceholder: 'Rua, número, localidade, cidade',
    selectMaterialPlaceholder: 'Selecione o material', selectDirtPlaceholder: 'Selecione o nível',
    selectDistancePlaceholder: 'Selecione a distância', priceTotal: 'Preço Total',
    successMsg: '✅ Solicitação enviada! Entraremos em contacto em breve.',
    errorMsg: '❌ Erro ao enviar. Tente novamente.',
    successBanner: '✅ Solicitação enviada com sucesso! Em breve entraremos em contacto.',
    faqTitle: 'Perguntas Frequentes',
    faq1Q: 'O que garante a qualidade do serviço?', faq1A: 'Utilizamos um checklist de 40 pontos. Se algo não estiver perfeito, voltamos em 24h sem custo adicional.',
    faq2Q: 'Há quanto tempo a Limpszone está em atividade?', faq2A: 'Estamos no mercado há 5 anos com mais de 500 clientes satisfeitos em Portugal e Europa.',
    faq3Q: 'Preciso de estar presente durante a limpeza?', faq3A: 'Não. Todos os profissionais passam por verificação de antecedentes. Pode sair tranquilamente.',
    faq4Q: 'Com que frequência posso contratar?', faq4A: 'Pontual, semanal, quinzenal ou mensal. Sem contratos de longo prazo nem penalizações.',
    footerDesc: 'Limpeza profissional para toda a Europa. Qualidade, confiança e excelência em cada serviço.',
    footerTagline: 'Uma limpeza em que pode confiar.®',
    footerServices: 'Serviços', footerCompany: 'Empresa', footerContact: 'Contacto',
    footerMonFri: 'Segunda - Sexta: 7:00 - 19:00', footerSat: 'Sábado: 8:00 - 17:00',
    footerSun: 'Domingo: 9:00 - 15:00', footerEmergency: 'Emergências: 24/7',
    footerCopy: '© 2024 Limpszone. Todos os direitos reservados.',
    footerWhatsApp: 'Falar no WhatsApp',
  },
  es: {
    headerSubtitle: 'Limpieza Profesional',
    navServicos: 'Servicios', navPorqueNos: 'Por qué Nosotros', navTestemunhos: 'Testimonios',
    navCalc: 'Calculadora', navContacto: 'Contacto', navCta: 'Presupuesto Gratis',
    heroBadge: 'Servicios de Limpieza Profesional',
    heroTitle: 'Su Espacio Impecable, Donde Quiera que Esté',
    heroDesc: 'Servicios de limpieza profesional para residencias, hoteles y espacios comerciales en toda Europa. Calidad garantizada, equipo de confianza.',
    heroStat1Num: '500+', heroStat1Label: 'Clientes Satisfechos',
    heroStat2Num: '4.9/5', heroStat2Label: 'Valoración',
    heroCta: 'Solicitar Presupuesto Gratis',
    howTitle: 'Cómo Funciona', howSub: 'Limpio en 3 pasos simples',
    how1Title: 'Solicite un presupuesto', how1Desc: 'Rellene el formulario o llámenos. Respuesta garantizada en menos de 1 hora.',
    how2Title: 'Programamos la visita', how2Desc: 'Elija el día y hora más conveniente. Nuestro equipo llega puntualmente.',
    how3Title: 'Espacio impecable', how3Desc: 'Dejamos su espacio brillando. Satisfacción garantizada o volvemos gratis.',
    servicesTitle: 'Nuestros Servicios',
    servicesSub: 'Soluciones completas de limpieza para todo tipo de espacios. Sin contratos, sin complicaciones.',
    servicesCta: 'Ver Todos los Servicios y Precios',
    learnMore: 'Saber más', requestService: 'Solicitar Servicio',
    materialsTitle: 'Materiales Utilizados:', areasTitle: 'Áreas Atendidas:',
    s1Title: 'Limpieza Residencial', s1Desc: 'Limpieza completa de casas y apartamentos',
    s2Title: 'Limpieza Comercial', s2Desc: 'Higienización de oficinas y espacios comerciales',
    s3Title: 'Restaurantes y Hoteles', s3Desc: 'Limpieza especializada para hostelería y restauración',
    s4Title: 'Limpieza de Cristales', s4Desc: 'Limpieza profesional de cristales y fachadas',
    s5Title: 'Post-Obra', s5Desc: 'Limpieza pesada después de construcciones y reformas',
    s6Title: 'Mantenimiento de Edificios', s6Desc: 'Limpieza continua de condominios y edificios',
    whyTitle: '¿Por qué Elegir Limpszone?',
    why1Title: 'Garantía de Satisfacción Total', why1Desc: 'Si el servicio no es de su agrado, volvemos sin coste adicional. Su satisfacción es nuestra prioridad.',
    why2Title: 'Equipo Verificado y Entrenado', why2Desc: 'Todos los profesionales pasan por verificación de antecedentes y formación especializada.',
    why3Title: 'Limpieza Personalizada', why3Desc: 'Creamos un plan adaptado a su espacio, rutina y presupuesto. Sin soluciones genéricas.',
    why4Title: 'Programación Fácil', why4Desc: 'Presupuesto en menos de 1 hora. Reserve online o por teléfono con total flexibilidad.',
    whyCta: 'Solicitar Presupuesto Gratuito',
    promiseTitle: 'Nuestra Promesa de Calidad',
    promiseDesc: 'Utilizamos una lista de verificación de 40 puntos en cada visita para garantizar que nada quede sin hacer. Si algo no está perfecto, lo corregimos sin ningún coste adicional.',
    promiseCta: 'Saber Más',
    reviewsTitle: 'Lo que Dicen Nuestros Clientes',
    reviewsSeeAll: 'Ver Todas las Valoraciones',
    bannerTitle: '¿Listo para un espacio verdaderamente limpio?',
    bannerSub: 'Presupuesto gratuito en menos de 1 hora. Sin contratos, sin compromisos.',
    bannerCta: 'Solicitar Presupuesto Gratis',
    calcTitle: 'Calculadora de Presupuesto',
    calcSub: 'Obtenga un presupuesto instantáneo. Seleccione las opciones y vea el precio en tiempo real.',
    calcCardTitle: 'Configure su Presupuesto', calcCardDesc: 'Rellene los campos para calcular el precio de su servicio',
    step1: '1️⃣ Tipos de Servicio * (Seleccione uno o más)', step2: '2️⃣ Cantidad *',
    step3: '3️⃣ Tipo de Material *', step4: '4️⃣ Nivel de Suciedad *', step5: '5️⃣ Localidad *',
    stepAddr: '📍 Dirección Completa *', stepObs: '📝 Observaciones Adicionales (opcional)',
    selectMaterial: 'Seleccione el tipo de material', selectDirt: 'Seleccione el nivel de suciedad',
    selectLocal: 'Seleccione la localidad', selectAddr: 'Escriba su dirección completa',
    selectObsPlaceholder: 'Describa manchas, áreas con moho, daños u otra información...',
    promoActive: '🎉 Promoción Activa:', promoDesc: 'de descuento por múltiples servicios!',
    priceTitle: 'Precio Total Estimado', subtotal: 'Subtotal (sin descuento):',
    discountApplied: 'Descuento aplicado', finalPrice: 'Valor final con descuento',
    selectOptions: 'Seleccione las opciones para ver el precio',
    discountTip: '💡 Descuentos: 10% para 2 servicios, 15% para 3, 20% para 4+',
    submitBtn: 'Solicitar Servicio', submitNote: 'Su información será enviada a suportelimpszone@gmail.com',
    fillRequired: 'Por favor, rellene todos los campos obligatorios.',
    posObraLabel: '🏠 Número de Habitaciones (Post-Obra) *',
    posObraNote: 'Valor base: 125,00 € (1 habitación) + 15,00 € por habitación adicional',
    limpezaGeralLabel: '🏡 Número de Dormitorios (Limpieza General) *',
    limpezaGeralNote: '💡 Incluye automáticamente salón, cocina, baño y terraza.',
    modalTitle: 'Solicitar Servicio', modalDesc: 'Rellene los datos para solicitar su servicio con cálculo automático de precio.',
    fieldName: 'Nombre *', fieldPhone: 'Teléfono *', fieldEmail: 'E-mail *',
    fieldAddress: 'Dirección Completa *', fieldServices: 'Tipos de Servicio * (Seleccione uno o más)',
    fieldMaterial: 'Tipo de Material *', fieldDirt: 'Nivel de Suciedad *', fieldDistance: 'Distancia *',
    fieldObs: 'Observaciones (opcional)',
    namePlaceholder: 'Su nombre completo', phonePlaceholder: '+351 920 000 000',
    emailPlaceholder: 'Su e-mail', addressPlaceholder: 'Calle, número, localidad, ciudad',
    selectMaterialPlaceholder: 'Seleccione el material', selectDirtPlaceholder: 'Seleccione el nivel',
    selectDistancePlaceholder: 'Seleccione la distancia', priceTotal: 'Precio Total',
    successMsg: '✅ ¡Solicitud enviada! Nos pondremos en contacto pronto.',
    errorMsg: '❌ Error al enviar. Inténtelo de nuevo.',
    successBanner: '✅ ¡Solicitud enviada con éxito! Pronto nos pondremos en contacto.',
    faqTitle: 'Preguntas Frecuentes',
    faq1Q: '¿Qué garantiza la calidad del servicio?', faq1A: 'Utilizamos una lista de 40 puntos. Si algo no está perfecto, volvemos en 24h sin coste adicional.',
    faq2Q: '¿Cuánto tiempo lleva Limpszone en actividad?', faq2A: 'Llevamos 5 años con más de 500 clientes satisfechos en Portugal y Europa.',
    faq3Q: '¿Necesito estar presente durante la limpieza?', faq3A: 'No. Todos los profesionales pasan por verificación de antecedentes. Puede salir tranquilamente.',
    faq4Q: '¿Con qué frecuencia puedo contratar?', faq4A: 'Puntual, semanal, quincenal o mensual. Sin contratos a largo plazo ni penalizaciones.',
    footerDesc: 'Limpieza profesional para toda Europa. Calidad, confianza y excelencia en cada servicio.',
    footerTagline: 'Una limpieza en la que puede confiar.®',
    footerServices: 'Servicios', footerCompany: 'Empresa', footerContact: 'Contacto',
    footerMonFri: 'Lunes - Viernes: 7:00 - 19:00', footerSat: 'Sábado: 8:00 - 17:00',
    footerSun: 'Domingo: 9:00 - 15:00', footerEmergency: 'Emergencias: 24/7',
    footerCopy: '© 2024 Limpszone. Todos los derechos reservados.',
    footerWhatsApp: 'Hablar por WhatsApp',
  }
}

const BLUE = '#1a2744'
const BLUE2 = '#2563eb'
const LIGHT = '#eff6ff'

export default function LimpsZoneApp() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [reviewIndex, setReviewIndex] = useState(0)
  const reviewTimer = useRef<any>(null)

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

  // ── Reviews data ──
  const allReviews = [
    { init: 'MS', name: 'Maria Silva', role: lang==='es'?'Propietaria de Restaurante':'Proprietária de Restaurante', text: lang==='es'?'¡El equipo hizo un trabajo fantástico en nuestro restaurante! Muy profesional y puntual.':'A equipa fez um trabalho fantástico no nosso restaurante. Muito profissional e pontual.' },
    { init: 'JS', name: 'João Santos', role: lang==='es'?'Gerente de Hotel':'Gerente de Hotel', text: lang==='es'?'Trabajo impecable en la limpieza del hotel. Los clientes siempre elogian la calidad de las habitaciones.':'Trabalho impecável na limpeza do hotel. Os clientes elogiam sempre a qualidade dos quartos.' },
    { init: 'AC', name: 'Ana Costa', role: lang==='es'?'Ama de Casa':'Dona de Casa', text: lang==='es'?'¡Servicio residencial perfecto! Mi casa quedó brillando. Muy atentas con todos los detalles.':'Serviço residencial perfeito! A minha casa ficou a brilhar. Muito atenciosas com todos os detalhes.' },
    { init: 'RM', name: 'Rui Mendes', role: lang==='es'?'Empresario':'Empresário', text: lang==='es'?'Limpieza post-obra excelente. La oficina quedó lista para inaugurar el mismo día.':'Limpeza pós-obra excelente. O escritório ficou pronto para inaugurar no próprio dia.' },
    { init: 'CF', name: 'Carla Ferreira', role: lang==='es'?'Cliente Residencial':'Cliente Residencial', text: lang==='es'?'Contrato el servicio semanal. Las señoras son fantásticas, cuidadosas y siempre puntuales.':'Contratei serviço semanal. As senhoras são fantásticas, cuidadosas e sempre pontuais.' },
    { init: 'PN', name: 'Pedro Nunes', role: lang==='es'?'Administrador de Finca':'Administrador de Condomínio', text: lang==='es'?'Mantenimiento del edificio impecable. Las áreas comunes siempre limpias. Los residentes muy satisfechos.':'Manutenção do condomínio impecável. Áreas comuns sempre limpas. Os moradores estão muito satisfeitos.' },
    { init: 'LG', name: 'Lena Garcia', role: lang==='es'?'Directora de Hotel':'Diretora de Hotel', text: lang==='es'?'Calidad excepcional en la limpieza de nuestras instalaciones. Totalmente recomendable.':'Qualidade excecional na limpeza das nossas instalações. Totalmente recomendável.' },
    { init: 'TR', name: 'Tiago Rocha', role: lang==='es'?'Propietario de Café':'Proprietário de Café', text: lang==='es'?'Servicio de limpieza para mi café. Siempre impecable y puntual. Clientes siempre contentos.':'Serviço de limpeza para o meu café. Sempre impecável e pontual. Clientes sempre satisfeitos.' },
  ]

  // Auto-advance reviews every 4s
  useEffect(() => {
    reviewTimer.current = setInterval(() => {
      setReviewIndex(prev => (prev + 1) % allReviews.length)
    }, 4000)
    return () => clearInterval(reviewTimer.current)
  }, [allReviews.length])

  const prevReview = () => { clearInterval(reviewTimer.current); setReviewIndex(prev => (prev - 1 + allReviews.length) % allReviews.length) }
  const nextReview = () => { clearInterval(reviewTimer.current); setReviewIndex(prev => (prev + 1) % allReviews.length) }

  // visible 3 reviews at a time
  const visibleReviews = [0,1,2].map(i => allReviews[(reviewIndex + i) % allReviews.length])

  const services = [
    { id:'residencial', title:T.s1Title, description:T.s1Desc, icon:Home, image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=260&fit=crop', materials:lang==='es'?['Aspirador profesional','Productos biodegradables','Paños de microfibra','Equipos de seguridad']:['Aspirador profissional','Produtos biodegradáveis','Panos de microfibra','Equipamentos de segurança'], areas:lang==='es'?['Dormitorios','Salones','Cocinas','Baños','Áreas externas']:['Quartos','Salas','Cozinhas','Casas de banho','Áreas externas'] },
    { id:'comercial', title:T.s2Title, description:T.s2Desc, icon:Building2, image:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=260&fit=crop', materials:lang==='es'?['Máquinas industriales','Desinfectantes profesionales','Equipos de limpieza','Productos especializados']:['Máquinas industriais','Desinfetantes profissionais','Equipamentos de limpeza','Produtos especializados'], areas:lang==='es'?['Oficinas','Recepciones','Baños','Pasillos','Áreas comunes']:['Escritórios','Recepções','Casas de banho','Corredores','Áreas comuns'] },
    { id:'restaurantes', title:T.s3Title, description:T.s3Desc, icon:UtensilsCrossed, image:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=260&fit=crop', materials:lang==='es'?['Sanitizantes alimentarios','Equipos industriales','Productos antibacterianos','Materiales certificados']:['Sanitizantes alimentares','Equipamentos industriais','Produtos anti-bacterianos','Materiais certificados'], areas:lang==='es'?['Cocinas','Salones','Habitaciones','Baños','Áreas de servicio']:['Cozinhas','Salões','Quartos','Casas de banho','Áreas de serviço'] },
    { id:'vidros', title:T.s4Title, description:T.s4Desc, icon:Sparkles, image:'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=260&fit=crop', materials:lang==='es'?['Rastrillos profesionales','Productos específicos','Equipos de altura','Paños especiales']:['Rodos profissionais','Produtos específicos','Equipamentos de altura','Panos especiais'], areas:lang==='es'?['Ventanas','Fachadas','Escaparates','Divisorias','Espejos']:['Janelas','Fachadas','Montras','Divisórias','Espelhos'] },
    { id:'pos-obra', title:T.s5Title, description:T.s5Desc, icon:Shield, image:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=260&fit=crop', materials:lang==='es'?['Equipos pesados','Productos específicos','Herramientas especializadas','EPIs completos']:['Equipamentos pesados','Produtos específicos','Ferramentas especializadas','EPIs completos'], areas:lang==='es'?['Retirada de escombros','Limpieza de paredes','Pavimentos','Acabados','Detallado']:['Remoção de entulho','Limpeza de paredes','Pavimentos','Acabamentos','Detalhamento'] },
    { id:'manutencao', title:T.s6Title, description:T.s6Desc, icon:Award, image:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=260&fit=crop', materials:lang==='es'?['Máquinas industriales','Productos profesionales','Equipos de seguridad','Herramientas especializadas']:['Máquinas industriais','Produtos profissionais','Equipamentos de segurança','Ferramentas especializadas'], areas:lang==='es'?['Áreas comunes','Garajes','Ascensores','Escaleras','Fachadas']:['Áreas comuns','Garagens','Elevadores','Escadas','Fachadas'] },
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
    { id:'wc-sanitarios', name:lang==='es'?'Limpieza de Baños':'Limpeza de WC / Sanitários / Lavatórios', basePrice:11 },
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
    const mat=materialTypes.find(m=>m.name===formData.material), dirt=dirtLevels.find(d=>d.name===formData.dirtLevel), dist=distanceOptions.find(d=>d.name===formData.distance)
    if(mat&&dirt&&dist){
      let t=0; formData.services.forEach(sn=>{const s=serviceTypes.find(st=>st.name===sn);if(s){let p=s.id==='pos-obra'?posObraPrice(s.basePrice,formData.posObraCompartments):s.id==='limpeza-geral'?limpezaGeralPrice(s.basePrice,formData.limpezaGeralQuartos):s.basePrice*formData.quantity;t+=p*mat.multiplier*dirt.multiplier*dist.multiplier}})
      const dp=calcDiscount(formData.services.length),dv=(t*dp)/100
      setCalculatedFormPrice(Math.round((t-dv)*100)/100);setFormDiscount(dp);setFormDiscountAmount(Math.round(dv*100)/100)
    }
  }

  const calcPrice = () => {
    if(!budgetData.serviceTypes.length||!budgetData.materialType||!budgetData.dirtLevel){setCalculatedPrice(0);setDiscount(0);setDiscountAmount(0);return}
    const mat=materialTypes.find(m=>m.id===budgetData.materialType), dirt=dirtLevels.find(d=>d.id===budgetData.dirtLevel), nb=neighborhoods.find(n=>n.id===budgetData.neighborhood)||{multiplier:1.0}
    if(mat&&dirt){
      let t=0; budgetData.serviceTypes.forEach(sid=>{const s=serviceTypes.find(st=>st.id===sid);if(s){let p=s.id==='pos-obra'?posObraPrice(s.basePrice,budgetData.posObraCompartments):s.id==='limpeza-geral'?limpezaGeralPrice(s.basePrice,budgetData.limpezaGeralQuartos):s.basePrice*budgetData.quantity;t+=p*mat.multiplier*dirt.multiplier*nb.multiplier}})
      const dp=calcDiscount(budgetData.serviceTypes.length),dv=(t*dp)/100
      setCalculatedPrice(Math.round((t-dv)*100)/100);setDiscount(dp);setDiscountAmount(Math.round(dv*100)/100)
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
      const mat=materialTypes.find(m=>m.id===budgetData.materialType),dirt=dirtLevels.find(d=>d.id===budgetData.dirtLevel),nb=neighborhoods.find(n=>n.id===budgetData.neighborhood)
      const lines=budgetData.serviceTypes.map(sid=>{const s=serviceTypes.find(st=>st.id===sid);if(!s)return'';let p=s.id==='pos-obra'?posObraPrice(s.basePrice,budgetData.posObraCompartments):s.id==='limpeza-geral'?limpezaGeralPrice(s.basePrice,budgetData.limpezaGeralQuartos):s.basePrice*budgetData.quantity;p=p*(mat?.multiplier||1)*(dirt?.multiplier||1)*(nb?.multiplier||1);return`• ${s.name}: ${(Math.round(p*100)/100).toFixed(2)} €`}).filter(Boolean).join('\n')
      const subj=encodeURIComponent('Nova Solicitação - Limpszone'),body=encodeURIComponent(`NOVA SOLICITAÇÃO\n\n${lines}\n\nTOTAL: ${calculatedPrice.toFixed(2)} €\n\nEndereço: ${budgetData.address}`)
      window.location.href=`mailto:suportelimpszone@gmail.com?subject=${subj}&body=${body}`
      setShowSuccessMessage(true);setBudgetData({serviceTypes:[],materialType:'',dirtLevel:'',address:'',neighborhood:'',quantity:1,observations:'',posObraCompartments:1,limpezaGeralQuartos:1});setCalculatedPrice(0);setDiscount(0);setDiscountAmount(0)
      setTimeout(()=>setShowSuccessMessage(false),5000)
    }catch(e){console.error(e)}
  }

  const handleFormSubmit=async(e:React.FormEvent)=>{
    e.preventDefault()
    if(!formData.name||!formData.phone||!formData.user_email||!formData.address||!formData.services.length||!formData.material||!formData.dirtLevel||!formData.distance){alert(T.fillRequired);return}
    try{
      const emailData:ServiceFormData={name:formData.name,phone:formData.phone,user_email:formData.user_email,address:formData.address,services:formData.services,material:formData.material,dirtLevel:formData.dirtLevel,distance:formData.distance,totalPrice:`${calculatedFormPrice.toFixed(2)}`}
      await sendServiceRequest(emailData);toast.success(T.successMsg);setShowSuccessMessage(true);setIsFormOpen(false)
      setFormData({name:'',phone:'',user_email:'',address:'',services:[],material:'',dirtLevel:'',distance:'',quantity:1,observations:'',posObraCompartments:1,limpezaGeralQuartos:1});setCalculatedFormPrice(0);setFormDiscount(0);setFormDiscountAmount(0)
      setTimeout(()=>setShowSuccessMessage(false),5000)
    }catch(e){toast.error(T.errorMsg)}
  }

  const setField=(f:string,v:any)=>setFormData(p=>({...p,[f]:v}))
  const openServiceForm=(title:string)=>{setFormData(p=>({...p,services:[title]}));setIsFormOpen(true)}
  const scrollTo=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'})

  const faqItems=[{q:T.faq1Q,a:T.faq1A},{q:T.faq2Q,a:T.faq2A},{q:T.faq3Q,a:T.faq3A},{q:T.faq4Q,a:T.faq4A}]

  const btnBlue={background:BLUE,color:'#fff'} as React.CSSProperties
  const btnBlue2={background:BLUE2,color:'#fff'} as React.CSSProperties

  return (
    <div className="min-h-screen bg-white" style={{fontFamily:"'Nunito Sans','Inter',sans-serif"}}>

      {showSuccessMessage&&(
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5"/><span>{T.successBanner}</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:BLUE2}}>
              <Sparkles className="h-5 w-5 text-white"/>
            </div>
            <div>
              <div><span className="text-xl font-black" style={{color:BLUE}}>LIMPS</span><span className="text-xl font-black" style={{color:BLUE2}}>ZONE</span></div>
              <p className="text-xs text-gray-400 leading-none">{T.headerSubtitle}</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-5">
            <a href="#services" onClick={e=>{e.preventDefault();scrollTo('services')}} className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">{T.navServicos}</a>
            <a href="#why-us" onClick={e=>{e.preventDefault();scrollTo('why-us')}} className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">{T.navPorqueNos}</a>
            <a href="#reviews" onClick={e=>{e.preventDefault();scrollTo('reviews')}} className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">{T.navTestemunhos}</a>
            <a href="#budget-calculator" onClick={e=>{e.preventDefault();scrollTo('budget-calculator')}} className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">{T.navCalc}</a>
            <a href="#footer" onClick={e=>{e.preventDefault();scrollTo('footer')}} className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">{T.navContacto}</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={()=>scrollTo('budget-calculator')} className="hidden md:flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg" style={btnBlue}>
              <Calculator className="h-4 w-4"/>{T.navCta}
            </button>
            <a href="tel:+351934071930" className="text-lg font-black" style={{color:BLUE2}}>+351 934 071 930</a>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="hero" className="relative overflow-hidden" style={{minHeight:500}}>
        <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&h=580&fit=crop&fp-y=0.35" alt="Limpeza profissional" className="w-full object-cover absolute inset-0" style={{minHeight:500,height:'100%'}}/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to right,rgba(0,0,0,0.25) 0%,rgba(0,0,0,0.05) 65%)'}}/>
        <div className="relative container mx-auto px-6 py-16 flex items-center" style={{minHeight:500}}>
          <div className="bg-white/94 backdrop-blur-sm rounded-2xl p-8 max-w-[540px] shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:BLUE2}}>{T.heroBadge}</p>
            <h1 className="text-3xl font-black leading-tight mb-4" style={{color:BLUE,letterSpacing:'-0.5px'}}>{T.heroTitle}</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{T.heroDesc}</p>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬💬💬</span>
                <div>
                  <p className="text-2xl font-black leading-none" style={{color:BLUE}}>{T.heroStat1Num}</p>
                  <p className="text-xs text-gray-400 font-semibold">{T.heroStat1Label}</p>
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200"/>
              <div>
                <p className="text-2xl font-black leading-none" style={{color:BLUE}}>{T.heroStat2Num}</p>
                <p className="text-xs text-gray-400 font-semibold">⭐⭐⭐⭐⭐ {T.heroStat2Label}</p>
              </div>
            </div>
            {/* CTA 1 */}
            <button onClick={()=>scrollTo('budget-calculator')} className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-lg text-sm" style={btnBlue2}>
              <Calculator className="h-4 w-4"/>{T.heroCta}
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-2" style={{color:BLUE2}}>{T.howTitle}</p>
          <h2 className="text-2xl font-black text-center mb-10" style={{color:BLUE}}>{T.howSub}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[{n:'1',t:T.how1Title,d:T.how1Desc},{n:'2',t:T.how2Title,d:T.how2Desc},{n:'3',t:T.how3Title,d:T.how3Desc}].map((step,i)=>(
              <div key={i} className="text-center relative">
                {i<2&&<div className="hidden md:block absolute top-5 left-1/2 w-full h-0.5 border-t-2 border-dashed" style={{borderColor:'#bfdbfe'}}/>}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-white mx-auto mb-4 relative z-10" style={{background:BLUE2}}>{step.n}</div>
                <p className="font-black text-gray-800 mb-2">{step.t}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-16" style={{background:LIGHT}}>
        <div className="container mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-2" style={{color:BLUE2}}>{T.navServicos}</p>
          <h2 className="text-3xl font-black text-center mb-3" style={{color:BLUE}}>{T.servicesTitle}</h2>
          <p className="text-gray-400 text-sm text-center max-w-2xl mx-auto mb-10 leading-relaxed">{T.servicesSub}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(service=>{
              const Icon=service.icon
              return(
                <div key={service.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="relative">
                    <img src={service.image} alt={service.title} className="w-full h-48 object-cover"/>
                    <div className="absolute top-3 left-3 bg-white/90 p-2 rounded-lg shadow-sm">
                      <Icon className="h-4 w-4" style={{color:BLUE}}/>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-black mb-1" style={{color:BLUE}}>{service.title}</h3>
                    <p className="text-xs text-gray-400 mb-3">{service.description}</p>
                    <div className="mb-3">
                      <p className="text-xs font-bold text-gray-600 mb-1.5">{T.materialsTitle}</p>
                      <div className="flex flex-wrap gap-1">{service.materials.map((m,i)=><span key={i} className="text-xs px-2 py-0.5 rounded-full text-blue-700" style={{background:'#dbeafe'}}>{m}</span>)}</div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-600 mb-1.5">{T.areasTitle}</p>
                      <div className="space-y-1">{service.areas.map((a,i)=><div key={i} className="flex items-center gap-2 text-xs text-gray-500"><CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0"/>{a}</div>)}</div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <button onClick={()=>openServiceForm(service.title)} className="text-xs font-bold text-white px-4 py-2 rounded-lg flex items-center gap-1" style={btnBlue2}>
                        {T.requestService}<ArrowRight className="h-3 w-3"/>
                      </button>
                      <button onClick={()=>openServiceForm(service.title)} className="text-xs font-semibold text-gray-400 hover:text-blue-600 flex items-center gap-1">
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
            <button onClick={()=>scrollTo('budget-calculator')} className="inline-flex items-center gap-2 text-white font-bold px-8 py-3 rounded-lg text-sm" style={btnBlue}>
              <Calculator className="h-4 w-4"/>{T.servicesCta}
            </button>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section id="why-us" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:BLUE2}}>{T.navPorqueNos}</p>
              <h2 className="text-2xl font-black mb-5" style={{color:BLUE}}>{T.whyTitle}</h2>
              {[{t:T.why1Title,d:T.why1Desc},{t:T.why2Title,d:T.why2Desc},{t:T.why3Title,d:T.why3Desc},{t:T.why4Title,d:T.why4Desc}].map((item,i)=>(
                <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-3" style={{borderLeft:`4px solid ${BLUE2}`}}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{background:BLUE2}}>
                      <CheckCircle className="h-3 w-3 text-white"/>
                    </div>
                    <p className="text-sm font-black text-gray-800">{item.t}</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed ml-7">{item.d}</p>
                </div>
              ))}
              {/* CTA 3 */}
              <button onClick={()=>scrollTo('budget-calculator')} className="mt-4 flex items-center gap-2 text-white font-bold px-6 py-3 rounded-lg text-sm" style={btnBlue}>
                {T.whyCta}<ArrowRight className="h-4 w-4"/>
              </button>
            </div>
            <img src="https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=600&h=500&fit=crop&fp-y=0.3" alt="Equipa" className="w-full object-cover rounded-2xl shadow-lg" style={{maxHeight:440}}/>
          </div>
        </div>
      </section>

      {/* ── PROMISE ── */}
      <section className="py-16" style={{background:LIGHT}}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <img src="https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=400&fit=crop" alt="Qualidade" className="w-full h-72 object-cover rounded-2xl shadow-lg"/>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:BLUE2}}>Qualidade Garantida</p>
              <h2 className="text-2xl font-black mb-4" style={{color:BLUE}}>{T.promiseTitle}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{T.promiseDesc}</p>
              {/* CTA 4 */}
              <button onClick={()=>scrollTo('budget-calculator')} className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-lg text-sm" style={btnBlue}>
                {T.promiseCta}<ArrowRight className="h-4 w-4"/>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACTO ── */}
      <ImpactoHigienizacao onSolicitarServico={()=>setIsFormOpen(true)}/>

      {/* ── REVIEWS CAROUSEL ── */}
      <section id="reviews" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-2" style={{color:BLUE2}}>{T.navTestemunhos}</p>
          <h2 className="text-3xl font-black text-center mb-10" style={{color:BLUE}}>{T.reviewsTitle}</h2>

          <div className="relative">
            {/* Carousel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {visibleReviews.map((r,i)=>(
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0" style={{background:BLUE}}>{r.init}</div>
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

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button onClick={prevReview} className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-blue-50 transition-colors" style={{borderColor:BLUE2}}>
                <ChevronLeft className="h-5 w-5" style={{color:BLUE2}}/>
              </button>
              <div className="flex gap-2">
                {allReviews.map((_,i)=>(
                  <button key={i} onClick={()=>setReviewIndex(i)} className="w-2.5 h-2.5 rounded-full transition-all" style={{background:i===reviewIndex?BLUE2:'#bfdbfe'}}/>
                ))}
              </div>
              <button onClick={nextReview} className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-blue-50 transition-colors" style={{borderColor:BLUE2}}>
                <ChevronRight className="h-5 w-5" style={{color:BLUE2}}/>
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <button onClick={()=>scrollTo('budget-calculator')} className="text-white font-bold px-8 py-3 rounded-lg text-sm" style={btnBlue}>{T.reviewsSeeAll}</button>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-14" style={{background:BLUE}}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">{T.bannerTitle}</h2>
            <p className="text-blue-200 text-sm">{T.bannerSub}</p>
          </div>
          {/* CTA 5 */}
          <button onClick={()=>scrollTo('budget-calculator')} className="flex-shrink-0 flex items-center gap-2 font-bold px-8 py-4 rounded-lg text-sm" style={btnBlue2}>
            <Calculator className="h-4 w-4"/>{T.bannerCta}
          </button>
        </div>
      </section>

      {/* ── BUDGET CALCULATOR ── */}
      <section id="budget-calculator" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calculator className="h-8 w-8" style={{color:BLUE}}/>
            <h2 className="text-3xl font-black" style={{color:BLUE}}>{T.calcTitle}</h2>
          </div>
          <p className="text-gray-400 text-sm text-center max-w-2xl mx-auto mb-10">{T.calcSub}</p>
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <div className="p-6 text-white" style={{background:BLUE}}>
                <h3 className="text-xl font-black flex items-center gap-2"><DollarSign className="h-5 w-5"/>{T.calcCardTitle}</h3>
                <p className="text-blue-200 text-sm mt-1">{T.calcCardDesc}</p>
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
                    className="inline-flex items-center gap-2 text-white font-bold px-10 py-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed" style={btnBlue2}>
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
      <section className="py-16" style={{background:LIGHT}}>
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-black text-center mb-2" style={{color:BLUE}}>{T.faqTitle}</h2>
          <div className="space-y-3 mt-8">
            {faqItems.map((item,i)=>(
              <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden" style={{borderLeft:`4px solid ${BLUE2}`}}>
                <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-blue-50 transition-colors" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <span className="text-sm font-black text-gray-800">{item.q}</span>
                  {openFaq===i?<ChevronUp className="h-4 w-4 flex-shrink-0 text-blue-500"/>:<ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400"/>}
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
            <DialogTitle className="text-lg font-black" style={{color:BLUE}}>{T.modalTitle}</DialogTitle>
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
              className="w-full text-white font-bold py-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed" style={btnBlue2}>
              {T.submitBtn}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── FOOTER ── */}
      <footer id="footer" style={{background:'#0f172a'}} className="pt-14 pb-6">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 pb-10 border-b border-white/10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:BLUE2}}>
                  <Sparkles className="h-4 w-4 text-white"/>
                </div>
                <span className="text-lg font-black text-white">LIMPS<span style={{color:'#60a5fa'}}>ZONE</span></span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{T.footerDesc}</p>
              <a href="tel:+351934071930" className="text-base font-black block mb-1" style={{color:'#60a5fa'}}>📞 +351 934 071 930</a>
              <p className="text-xs text-gray-500">suportelimpszone@gmail.com</p>
              <div className="mt-4 space-y-1">
                <p className="text-xs text-gray-500">{T.footerMonFri}</p>
                <p className="text-xs text-gray-500">{T.footerSat}</p>
                <p className="text-xs text-gray-500">{T.footerSun}</p>
                <p className="text-xs font-bold text-green-400">{T.footerEmergency}</p>
              </div>
            </div>
            {/* Services */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-4 text-white border-b border-blue-500 pb-2 inline-block">{T.footerServices}</p>
              {[T.s1Title,T.s2Title,T.s3Title,T.s4Title,T.s5Title,T.s6Title].map(s=>(
                <a key={s} href="#services" onClick={e=>{e.preventDefault();scrollTo('services')}} className="block text-xs text-gray-400 hover:text-blue-400 mb-2 transition-colors cursor-pointer">{s}</a>
              ))}
            </div>
            {/* Company */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-4 text-white border-b border-blue-500 pb-2 inline-block">{T.footerCompany}</p>
              {[
                {label:T.navPorqueNos,id:'why-us'},
                {label:T.navTestemunhos,id:'reviews'},
                {label:T.navCalc,id:'budget-calculator'},
                {label:'FAQ',id:'faq'},
              ].map(item=>(
                <a key={item.label} href={`#${item.id}`} onClick={e=>{e.preventDefault();scrollTo(item.id)}} className="block text-xs text-gray-400 hover:text-blue-400 mb-2 transition-colors cursor-pointer">{item.label}</a>
              ))}
            </div>
            {/* Contact */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-4 text-white border-b border-blue-500 pb-2 inline-block">{T.footerContact}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-blue-400"/><a href="tel:+351934071930" className="text-xs text-gray-400 hover:text-blue-400">+351 934 071 930</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-blue-400"/><a href="mailto:suportelimpszone@gmail.com" className="text-xs text-gray-400 hover:text-blue-400">suportelimpszone@gmail.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-blue-400"/><span className="text-xs text-gray-400">Portugal, Europa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-green-400"/><span className="text-xs text-green-400 font-bold">24/7</span>
                </div>
              </div>
              <WhatsAppButton className="mt-4 inline-flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-lg" style={{background:'#25d366'}}>
                <MessageCircle className="h-3 w-3"/>{T.footerWhatsApp}
              </WhatsAppButton>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">{T.footerCopy}</p>
            <p className="text-xs text-gray-600 italic mt-1">{T.footerTagline}</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
