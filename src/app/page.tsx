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

/* ─── COLOURS ─── */
const C = {
  navy:    '#0f2a5e',
  blue:    '#1d4ed8',
  sky:     '#2e86de',
  iceBg:   '#f0f7ff',
  iceMid:  '#e3f0ff',
  iceCard: '#ffffff',
  border:  '#c7deff',
  text:    '#1e3a5f',
  muted:   '#5a7fa8',
}

/* ─── GLOBAL CSS ─── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&display=swap');

/* Floating animation — continuous, elegant */
@keyframes lzFloat {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-8px); }
}
@keyframes lzFloat2 {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-6px); }
}
@keyframes lzFloat3 {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-10px); }
}

/* Scroll reveal for non-title elements */
@keyframes lzFadeUp {
  from { opacity:0; transform:translateY(30px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes lzFadeUpSm {
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
}

/* Reveal + float combined — titles fade in then float FOREVER */
@keyframes lzFadeUpThenFloat {
  0%   { opacity:0; transform:translateY(30px); }
  40%  { opacity:1; transform:translateY(0px); }
  70%  { transform:translateY(0px); }
  85%  { transform:translateY(-8px); }
  100% { transform:translateY(0px); }
}

/* Base hidden state */
.lz-r  { opacity:0; }
.lz-rs { opacity:0; }

/* Regular reveal (cards, images, buttons) */
.lz-r.on  { animation: lzFadeUp 0.7s cubic-bezier(.22,1,.36,1) forwards; }
.lz-rs.on { animation: lzFadeUpSm 0.55s cubic-bezier(.22,1,.36,1) forwards; }

/* Title reveal — fades up then immediately starts floating loop */
.lz-title {
  opacity: 0;
  display: inline-block;
}
.lz-title.on {
  animation: lzFadeUp 0.7s cubic-bezier(.22,1,.36,1) forwards;
}
/* After reveal, float class is added by JS — overrides with infinite float */
.lz-title.floating {
  opacity: 1;
  animation: lzFloat 4s ease-in-out infinite !important;
}
.lz-title.floating2 {
  opacity: 1;
  animation: lzFloat2 4.8s ease-in-out infinite !important;
}
.lz-title.floating3 {
  opacity: 1;
  animation: lzFloat3 5.5s ease-in-out infinite !important;
}

/* Title styles — big, black, impactful */
.lz-h1 {
  font-family: 'Nunito Sans', 'Inter', sans-serif;
  font-weight: 900;
  font-size: clamp(38px, 5vw, 54px);
  line-height: 1.05;
  letter-spacing: -2px;
  color: #0f2a5e;
  display: inline-block;
}
.lz-h2 {
  font-family: 'Nunito Sans', 'Inter', sans-serif;
  font-weight: 900;
  font-size: clamp(32px, 4vw, 46px);
  line-height: 1.08;
  letter-spacing: -1.5px;
  color: #0f2a5e;
  display: inline-block;
}
.lz-h3 {
  font-family: 'Nunito Sans', 'Inter', sans-serif;
  font-weight: 900;
  font-size: clamp(26px, 3.5vw, 38px);
  line-height: 1.1;
  letter-spacing: -1px;
  color: #0f2a5e;
  display: inline-block;
}
.lz-accent {
  background: linear-gradient(135deg, #1d4ed8, #2e86de);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.lz-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #1d4ed8;
  margin-bottom: 10px;
  display: block;
}
`

/* ─── HOOKS ─── */
function useReveal(delay = 0, float: false | 'float' | 'float2' | 'float3' = false) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          el.classList.add('on')
          if (float) {
            // Wait for fade-up to finish (700ms), then switch to infinite float
            setTimeout(() => {
              el.classList.remove('on')
              el.classList.add(float === 'float2' ? 'floating2' : float === 'float3' ? 'floating3' : 'floating')
            }, 720)
          }
        }, delay)
        ob.disconnect()
      }
    }, { threshold: 0.12 })
    ob.observe(el)
    return () => ob.disconnect()
  }, [delay, float])
  return ref
}

/* ─── i18n ─── */
type Lang = 'pt' | 'es'
const TR: Record<Lang, Record<string, string>> = {
  pt: {
    sub:'Limpeza Profissional',
    n1:'Serviços', n2:'Por que Nós', n3:'Testemunhos', n4:'Calculadora', n5:'Contacto', nCta:'Orçamento Grátis',
    hBadge:'Serviços de Limpeza Profissional',
    hT1:'O Seu Espaço', hT2:'Impecável,', hT3:'Onde Quer que Esteja',
    hDesc:'Limpeza profissional para residências, hotéis e espaços comerciais em toda a Europa. Qualidade garantida, equipa de confiança.',
    hS1n:'500+', hS1l:'Clientes Satisfeitos', hS2n:'4.9/5', hS2l:'Avaliação',
    hCta:'Solicitar Orçamento Grátis',
    howBadge:'Como Funciona',
    howT1:'Limpo em', howT2:'3 Passos Simples',
    hw1t:'Solicite um orçamento', hw1d:'Preencha o formulário ou ligue-nos. Resposta em menos de 1 hora.',
    hw2t:'Agendamos a visita', hw2d:'Escolha o dia e hora mais conveniente. Chegamos pontualmente.',
    hw3t:'Espaço impecável', hw3d:'Satisfação 100% garantida — se não gostar, voltamos de graça.',
    svcBadge:'Os Nossos Serviços',
    svcT1:'Soluções para', svcT2:'Cada Espaço',
    svcS:'Limpeza profissional para todos os tipos de espaços. Sem contratos, sem complicações.',
    svcCta:'Ver Todos os Serviços e Preços',
    lm:'Saber mais', rs:'Solicitar Serviço',
    matT:'Materiais Utilizados:', arT:'Áreas Atendidas:',
    s1t:'Limpeza Residencial', s1d:'Limpeza completa de casas e apartamentos',
    s2t:'Limpeza Comercial', s2d:'Higienização de escritórios e espaços comerciais',
    s3t:'Restaurantes & Hotéis', s3d:'Limpeza especializada para hotelaria e restauração',
    s4t:'Limpeza de Vidros', s4d:'Limpeza profissional de vidros e fachadas',
    s5t:'Pós-Obra', s5d:'Limpeza pesada após construções e remodelações',
    s6t:'Manutenção Predial', s6d:'Limpeza contínua de condomínios e edifícios',
    whyBadge:'Por que Nós',
    whyT1:'A Escolha de', whyT2:'Quem Exige Qualidade',
    w1t:'Garantia de Satisfação Total', w1d:'Se o serviço não estiver ao seu gosto, voltamos sem custo adicional.',
    w2t:'Equipa Verificada e Treinada', w2d:'Todos passam por verificação de antecedentes e formação especializada.',
    w3t:'Limpeza Personalizada', w3d:'Um plano adaptado ao seu espaço, rotina e orçamento. Sem soluções genéricas.',
    w4t:'Agendamento Fácil', w4d:'Orçamento em menos de 1 hora. Marque online ou por telefone.',
    wCta:'Solicitar Orçamento Gratuito',
    pmBadge:'Qualidade Garantida',
    pmT1:'A Nossa Promessa', pmT2:'de Excelência',
    pmD:'Utilizamos um checklist de 40 pontos em cada visita. Se algo não estiver perfeito, corrigimos sem qualquer custo adicional. Confiança e excelência em cada serviço.',
    pmCta:'Saber Mais',
    rvBadge:'Testemunhos',
    rvT1:'O que Dizem', rvT2:'os Nossos Clientes',
    rvAll:'Ver Todas as Avaliações',
    bnT1:'Pronto para um Espaço', bnT2:'Verdadeiramente Limpo?',
    bnS:'Orçamento gratuito em menos de 1 hora. Sem contratos, sem compromissos.',
    bnCta:'Solicitar Orçamento Grátis',
    calcBadge:'Calculadora',
    calcT1:'Calcule o Seu', calcT2:'Orçamento Agora',
    cS:'Orçamento instantâneo. Selecione as opções e veja o preço em tempo real.',
    cCardT:'Configure o seu Orçamento', cCardS:'Preencha os campos para calcular o preço do seu serviço',
    st1:'1️⃣ Tipos de Serviço * (Selecione um ou mais)', st2:'2️⃣ Quantidade *',
    st3:'3️⃣ Tipo de Material *', st4:'4️⃣ Nível de Sujidade *', st5:'5️⃣ Localidade *',
    stA:'📍 Endereço Completo *', stO:'📝 Observações Adicionais (opcional)',
    selMat:'Selecione o tipo de material', selDirt:'Selecione o nível de sujidade',
    selLoc:'Selecione a localidade', selAddr:'Digite o seu endereço completo',
    selObsPh:'Descreva manchas, áreas com bolor, danos ou outras informações...',
    promoA:'🎉 Promoção Ativa:', promoD:'de desconto por múltiplos serviços!',
    priceT:'Preço Total Estimado', subT:'Subtotal (sem desconto):',
    discA:'Desconto aplicado', finalP:'Valor final com desconto',
    selOpt:'Selecione as opções acima para ver o preço',
    discTip:'💡 Descontos: 10% para 2 serviços · 15% para 3 · 20% para 4+',
    sbBtn:'Solicitar Serviço', sbNote:'As suas informações serão enviadas para suportelimpszone@gmail.com',
    fillReq:'Por favor, preencha todos os campos obrigatórios.',
    posL:'🏠 Número de Compartimentos (Pós-Obra) *',
    posN:'Valor base: 125,00€ (1 compartimento) + 15,00€ por compartimento adicional',
    lgL:'🏡 Número de Quartos (Limpeza Geral) *',
    lgN:'💡 Inclui automaticamente sala, cozinha, WC e varanda.',
    modT:'Solicitar Serviço', modD:'Preencha os dados para solicitar o seu serviço com cálculo automático de preço.',
    fName:'Nome *', fPhone:'Telefone *', fEmail:'E-mail *',
    fAddr:'Endereço Completo *', fSvc:'Tipos de Serviço * (Selecione um ou mais)',
    fMat:'Tipo de Material *', fDirt:'Nível de Sujidade *', fDist:'Distância *',
    fObs:'Observações (opcional)',
    phName:'O seu nome completo', phPhone:'+351 920 000 000',
    phEmail:'O seu e-mail', phAddr:'Rua, número, localidade, cidade',
    phMatSel:'Selecione o material', phDirtSel:'Selecione o nível', phDistSel:'Selecione a distância',
    priceTotal:'Preço Total',
    ok:'✅ Solicitação enviada! Entraremos em contacto em breve.',
    err:'❌ Erro ao enviar. Tente novamente.',
    okBanner:'✅ Solicitação enviada com sucesso! Em breve entraremos em contacto.',
    faqBadge:'FAQ',
    faqT1:'Perguntas', faqT2:'Frequentes',
    q1:'O que garante a qualidade do serviço?', a1:'Checklist de 40 pontos em cada visita. Se algo não estiver perfeito, voltamos em 24h sem custo adicional.',
    q2:'Há quanto tempo a Limpszone está em atividade?', a2:'5 anos no mercado, com mais de 500 clientes satisfeitos em Portugal e Europa.',
    q3:'Preciso de estar presente durante a limpeza?', a3:'Não. Todos os profissionais passam por verificação de antecedentes. Pode sair tranquilamente.',
    q4:'Com que frequência posso contratar?', a4:'Pontual, semanal, quinzenal ou mensal. Sem contratos de longo prazo nem penalizações.',
    ftDesc:'Limpeza profissional para toda a Europa. Qualidade, confiança e excelência.',
    ftTag:'Uma limpeza em que pode confiar.®',
    ftSvc:'Serviços', ftCo:'Empresa', ftCtc:'Contacto',
    ftMF:'Segunda - Sexta: 7:00 - 19:00', ftSa:'Sábado: 8:00 - 17:00',
    ftSu:'Domingo: 9:00 - 15:00', ftEm:'Emergências: 24/7',
    ftCopy:'© 2024 Limpszone. Todos os direitos reservados.',
    ftWA:'Falar no WhatsApp',
    r1i:'MS', r1n:'Maria Silva',    r1r:'Proprietária de Restaurante', r1t:'A equipa fez um trabalho fantástico no nosso restaurante. Profissional, pontual e resultados impecáveis.',
    r2i:'JS', r2n:'João Santos',    r2r:'Gerente de Hotel',            r2t:'Trabalho impecável no hotel. Os clientes elogiam sempre a qualidade da limpeza dos quartos.',
    r3i:'AC', r3n:'Ana Costa',      r3r:'Dona de Casa',                r3t:'A minha casa ficou a brilhar! Muito atenciosas com todos os detalhes. Recomendo sem hesitar.',
    r4i:'RM', r4n:'Rui Mendes',     r4r:'Empresário',                  r4t:'Pós-obra excelente. O escritório ficou pronto para inaugurar no próprio dia. Muito eficiente.',
    r5i:'CF', r5n:'Carla Ferreira', r5r:'Cliente Residencial',         r5t:'Contratei o serviço semanal. As senhoras são fantásticas, cuidadosas e sempre pontuais.',
    r6i:'PN', r6n:'Pedro Nunes',    r6r:'Administrador de Condomínio', r6t:'Manutenção do condomínio impecável. Áreas comuns sempre limpas. Moradores muito satisfeitos!',
    r7i:'LG', r7n:'Lena Garcia',    r7r:'Diretora de Hotel',           r7t:'Qualidade excecional na limpeza das nossas instalações. Parceria de total confiança.',
    r8i:'TR', r8n:'Tiago Rocha',    r8r:'Proprietário de Café',        r8t:'Sempre impecável e pontual. Os clientes adoram a limpeza do espaço. Totalmente recomendado.',
  },
  es: {
    sub:'Limpieza Profesional',
    n1:'Servicios', n2:'Por qué Nosotros', n3:'Testimonios', n4:'Calculadora', n5:'Contacto', nCta:'Presupuesto Gratis',
    hBadge:'Servicios de Limpieza Profesional',
    hT1:'Su Espacio', hT2:'Impecable,', hT3:'Donde Quiera que Esté',
    hDesc:'Limpieza profesional para residencias, hoteles y espacios comerciales en toda Europa. Calidad garantizada, equipo de confianza.',
    hS1n:'500+', hS1l:'Clientes Satisfechos', hS2n:'4.9/5', hS2l:'Valoración',
    hCta:'Solicitar Presupuesto Gratis',
    howBadge:'Cómo Funciona',
    howT1:'Limpio en', howT2:'3 Pasos Simples',
    hw1t:'Solicite un presupuesto', hw1d:'Rellene el formulario o llámenos. Respuesta en menos de 1 hora.',
    hw2t:'Programamos la visita', hw2d:'Elija el día y hora más conveniente. Llegamos puntualmente.',
    hw3t:'Espacio impecable', hw3d:'Satisfacción 100% garantizada — si no le gusta, volvemos gratis.',
    svcBadge:'Nuestros Servicios',
    svcT1:'Soluciones para', svcT2:'Cada Espacio',
    svcS:'Limpieza profesional para todo tipo de espacios. Sin contratos, sin complicaciones.',
    svcCta:'Ver Todos los Servicios y Precios',
    lm:'Saber más', rs:'Solicitar Servicio',
    matT:'Materiales Utilizados:', arT:'Áreas Atendidas:',
    s1t:'Limpieza Residencial', s1d:'Limpieza completa de casas y apartamentos',
    s2t:'Limpieza Comercial', s2d:'Higienización de oficinas y espacios comerciales',
    s3t:'Restaurantes y Hoteles', s3d:'Limpieza especializada para hostelería y restauración',
    s4t:'Limpieza de Cristales', s4d:'Limpieza profesional de cristales y fachadas',
    s5t:'Post-Obra', s5d:'Limpieza pesada después de construcciones y reformas',
    s6t:'Mantenimiento de Edificios', s6d:'Limpieza continua de condominios y edificios',
    whyBadge:'Por qué Nosotros',
    whyT1:'La Elección de', whyT2:'Quien Exige Calidad',
    w1t:'Garantía de Satisfacción Total', w1d:'Si el servicio no es de su agrado, volvemos sin coste adicional.',
    w2t:'Equipo Verificado y Entrenado', w2d:'Todos pasan por verificación de antecedentes y formación especializada.',
    w3t:'Limpieza Personalizada', w3d:'Un plan adaptado a su espacio, rutina y presupuesto. Sin soluciones genéricas.',
    w4t:'Programación Fácil', w4d:'Presupuesto en menos de 1 hora. Reserve online o por teléfono.',
    wCta:'Solicitar Presupuesto Gratuito',
    pmBadge:'Calidad Garantizada',
    pmT1:'Nuestra Promesa', pmT2:'de Excelencia',
    pmD:'Utilizamos una lista de verificación de 40 puntos en cada visita. Si algo no está perfecto, lo corregimos sin ningún coste adicional.',
    pmCta:'Saber Más',
    rvBadge:'Testimonios',
    rvT1:'Lo que Dicen', rvT2:'Nuestros Clientes',
    rvAll:'Ver Todas las Valoraciones',
    bnT1:'¿Listo para un Espacio', bnT2:'Verdaderamente Limpio?',
    bnS:'Presupuesto gratuito en menos de 1 hora. Sin contratos, sin compromisos.',
    bnCta:'Solicitar Presupuesto Gratis',
    calcBadge:'Calculadora',
    calcT1:'Calcule su', calcT2:'Presupuesto Ahora',
    cS:'Presupuesto instantáneo. Seleccione las opciones y vea el precio en tiempo real.',
    cCardT:'Configure su Presupuesto', cCardS:'Rellene los campos para calcular el precio de su servicio',
    st1:'1️⃣ Tipos de Servicio * (Seleccione uno o más)', st2:'2️⃣ Cantidad *',
    st3:'3️⃣ Tipo de Material *', st4:'4️⃣ Nivel de Suciedad *', st5:'5️⃣ Localidad *',
    stA:'📍 Dirección Completa *', stO:'📝 Observaciones Adicionales (opcional)',
    selMat:'Seleccione el tipo de material', selDirt:'Seleccione el nivel de suciedad',
    selLoc:'Seleccione la localidad', selAddr:'Escriba su dirección completa',
    selObsPh:'Describa manchas, áreas con moho, daños u otra información...',
    promoA:'🎉 Promoción Activa:', promoD:'de descuento por múltiples servicios!',
    priceT:'Precio Total Estimado', subT:'Subtotal (sin descuento):',
    discA:'Descuento aplicado', finalP:'Valor final con descuento',
    selOpt:'Seleccione las opciones para ver el precio',
    discTip:'💡 Descuentos: 10% para 2 servicios · 15% para 3 · 20% para 4+',
    sbBtn:'Solicitar Servicio', sbNote:'Su información será enviada a suportelimpszone@gmail.com',
    fillReq:'Por favor, rellene todos los campos obligatorios.',
    posL:'🏠 Número de Habitaciones (Post-Obra) *',
    posN:'Valor base: 125,00€ (1 habitación) + 15,00€ por habitación adicional',
    lgL:'🏡 Número de Dormitorios (Limpieza General) *',
    lgN:'💡 Incluye automáticamente salón, cocina, baño y terraza.',
    modT:'Solicitar Servicio', modD:'Rellene los datos para solicitar su servicio con cálculo automático de precio.',
    fName:'Nombre *', fPhone:'Teléfono *', fEmail:'E-mail *',
    fAddr:'Dirección Completa *', fSvc:'Tipos de Servicio * (Seleccione uno o más)',
    fMat:'Tipo de Material *', fDirt:'Nivel de Suciedad *', fDist:'Distancia *',
    fObs:'Observaciones (opcional)',
    phName:'Su nombre completo', phPhone:'+351 920 000 000',
    phEmail:'Su e-mail', phAddr:'Calle, número, localidad, ciudad',
    phMatSel:'Seleccione el material', phDirtSel:'Seleccione el nivel', phDistSel:'Seleccione la distancia',
    priceTotal:'Precio Total',
    ok:'✅ ¡Solicitud enviada! Nos pondremos en contacto pronto.',
    err:'❌ Error al enviar. Inténtelo de nuevo.',
    okBanner:'✅ ¡Solicitud enviada con éxito! Pronto nos pondremos en contacto.',
    faqBadge:'FAQ',
    faqT1:'Preguntas', faqT2:'Frecuentes',
    q1:'¿Qué garantiza la calidad del servicio?', a1:'Lista de 40 puntos en cada visita. Si algo no está perfecto, volvemos en 24h sin coste adicional.',
    q2:'¿Cuánto tiempo lleva Limpszone en actividad?', a2:'5 años en el mercado con más de 500 clientes satisfechos en Portugal y Europa.',
    q3:'¿Necesito estar presente durante la limpieza?', a3:'No. Todos los profesionales pasan por verificación de antecedentes.',
    q4:'¿Con qué frecuencia puedo contratar?', a4:'Puntual, semanal, quincenal o mensual. Sin contratos a largo plazo ni penalizaciones.',
    ftDesc:'Limpieza profesional para toda Europa. Calidad, confianza y excelencia.',
    ftTag:'Una limpieza en la que puede confiar.®',
    ftSvc:'Servicios', ftCo:'Empresa', ftCtc:'Contacto',
    ftMF:'Lunes - Viernes: 7:00 - 19:00', ftSa:'Sábado: 8:00 - 17:00',
    ftSu:'Domingo: 9:00 - 15:00', ftEm:'Emergencias: 24/7',
    ftCopy:'© 2024 Limpszone. Todos los derechos reservados.',
    ftWA:'Hablar por WhatsApp',
    r1i:'MS', r1n:'Maria Silva',    r1r:'Propietaria de Restaurante', r1t:'¡El equipo hizo un trabajo fantástico en nuestro restaurante! Muy profesional y puntual.',
    r2i:'JS', r2n:'João Santos',    r2r:'Gerente de Hotel',           r2t:'Trabajo impecable en el hotel. Los clientes siempre elogian la calidad de las habitaciones.',
    r3i:'AC', r3n:'Ana Costa',      r3r:'Ama de Casa',                r3t:'¡Mi casa quedó brillando! Muy atentas con todos los detalles. Lo recomiendo sin dudarlo.',
    r4i:'RM', r4n:'Rui Mendes',     r4r:'Empresario',                 r4t:'Post-obra excelente. La oficina quedó lista para inaugurar el mismo día.',
    r5i:'CF', r5n:'Carla Ferreira', r5r:'Cliente Residencial',        r5t:'Contraté el servicio semanal. Las señoras son fantásticas, cuidadosas y siempre puntuales.',
    r6i:'PN', r6n:'Pedro Nunes',    r6r:'Administrador de Finca',     r6t:'Mantenimiento del edificio impecable. Áreas comunes siempre limpias. Residentes muy satisfechos.',
    r7i:'LG', r7n:'Lena Garcia',    r7r:'Directora de Hotel',         r7t:'Calidad excepcional en la limpieza de nuestras instalaciones. Socio de total confianza.',
    r8i:'TR', r8n:'Tiago Rocha',    r8r:'Propietario de Café',        r8t:'Siempre impecable y puntual. Los clientes adoran la limpieza del local. Totalmente recomendado.',
  }
}

export default function LimpsZoneApp() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showOk, setShowOk] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [rvIdx, setRvIdx] = useState(0)
  const rvTimer = useRef<any>(null)
  const [lang, setLang] = useState<Lang>('pt')

  const [formData, setFormData] = useState({
    name:'', phone:'', user_email:'', address:'',
    services:[] as string[], material:'', dirtLevel:'', distance:'',
    quantity:1, observations:'', posObraCompartments:1, limpezaGeralQuartos:1
  })
  const [fPrice, setFPrice] = useState(0)
  const [fDisc, setFDisc] = useState(0)
  const [fDiscAmt, setFDiscAmt] = useState(0)

  const [budgetData, setBudgetData] = useState({
    serviceTypes:[] as string[], materialType:'', dirtLevel:'', address:'',
    neighborhood:'', quantity:1, observations:'', posObraCompartments:1, limpezaGeralQuartos:1
  })
  const [calcP, setCalcP] = useState(0)
  const [disc, setDisc] = useState(0)
  const [discAmt, setDiscAmt] = useState(0)

  useEffect(() => {
    if (typeof navigator !== 'undefined')
      setLang(navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'pt')
  }, [])

  // Inject global CSS
  useEffect(() => {
    if (document.getElementById('lz-g')) return
    const s = document.createElement('style')
    s.id = 'lz-g'; s.textContent = GLOBAL_CSS
    document.head.appendChild(s)
  }, [])

  const T = TR[lang]
  const es = lang === 'es'

  // Reviews
  const reviews = [1,2,3,4,5,6,7,8].map(i => ({
    init:T[`r${i}i`], name:T[`r${i}n`], role:T[`r${i}r`], text:T[`r${i}t`]
  }))
  useEffect(() => {
    rvTimer.current = setInterval(() => setRvIdx(p => (p+1)%reviews.length), 4000)
    return () => clearInterval(rvTimer.current)
  }, [reviews.length])
  const prevRv = () => { clearInterval(rvTimer.current); setRvIdx(p => (p-1+reviews.length)%reviews.length) }
  const nextRv = () => { clearInterval(rvTimer.current); setRvIdx(p => (p+1)%reviews.length) }
  const visRv = [0,1,2].map(i => reviews[(rvIdx+i)%reviews.length])

  // Reveal refs — titles get float:true for continuous animation after reveal
  const rHero   = useReveal(0, 'float')
  const rHow    = useReveal(0, 'float2');  const rH1 = useReveal(0);   const rH2 = useReveal(140); const rH3 = useReveal(280)
  const rSvcT   = useReveal(0, 'float3');  const rSvcG = useReveal(80)
  const rWhyT   = useReveal(0, 'float');   const rWhyL = useReveal(60); const rWhyR = useReveal(160)
  const rPmL    = useReveal(0);            const rPmR  = useReveal(0, 'float2')
  const rRvT    = useReveal(0, 'float3');  const rRvG  = useReveal(80)
  const rBnT    = useReveal(0, 'float');   const rBnB  = useReveal(150)
  const rCalcT  = useReveal(0, 'float2');  const rCalcC = useReveal(80)
  const rFaqT   = useReveal(0, 'float3');  const rFaqL = useReveal(60)

  // Service data
  const services = [
    { id:'residencial', t:T.s1t, d:T.s1d, icon:Home,          img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=260&fit=crop',
      mats:es?['Aspirador profesional','Productos biodegradables','Paños de microfibra','Equipos de seguridad']:['Aspirador profissional','Produtos biodegradáveis','Panos de microfibra','Equipamentos de segurança'],
      areas:es?['Dormitorios','Salones','Cocinas','Baños','Áreas externas']:['Quartos','Salas','Cozinhas','Casas de banho','Áreas externas'] },
    { id:'comercial',   t:T.s2t, d:T.s2d, icon:Building2,     img:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=260&fit=crop',
      mats:es?['Máquinas industriales','Desinfectantes profesionales','Equipos de limpieza','Productos especializados']:['Máquinas industriais','Desinfetantes profissionais','Equipamentos de limpeza','Produtos especializados'],
      areas:es?['Oficinas','Recepciones','Baños','Pasillos','Áreas comunes']:['Escritórios','Recepções','Casas de banho','Corredores','Áreas comuns'] },
    { id:'restaurantes',t:T.s3t, d:T.s3d, icon:UtensilsCrossed,img:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=260&fit=crop',
      mats:es?['Sanitizantes alimentarios','Equipos industriales','Productos antibacterianos','Materiales certificados']:['Sanitizantes alimentares','Equipamentos industriais','Produtos anti-bacterianos','Materiais certificados'],
      areas:es?['Cocinas','Salones','Habitaciones','Baños','Áreas de servicio']:['Cozinhas','Salões','Quartos','Casas de banho','Áreas de serviço'] },
    { id:'vidros',      t:T.s4t, d:T.s4d, icon:Sparkles,      img:'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=260&fit=crop',
      mats:es?['Rastrillos profesionales','Productos específicos','Equipos de altura','Paños especiales']:['Rodos profissionais','Produtos específicos','Equipamentos de altura','Panos especiais'],
      areas:es?['Ventanas','Fachadas','Escaparates','Divisorias','Espejos']:['Janelas','Fachadas','Montras','Divisórias','Espelhos'] },
    { id:'pos-obra',    t:T.s5t, d:T.s5d, icon:Shield,        img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=260&fit=crop',
      mats:es?['Equipos pesados','Productos específicos','Herramientas especializadas','EPIs completos']:['Equipamentos pesados','Produtos específicos','Ferramentas especializadas','EPIs completos'],
      areas:es?['Retirada de escombros','Limpieza de paredes','Pavimentos','Acabados','Detallado']:['Remoção de entulho','Limpeza de paredes','Pavimentos','Acabamentos','Detalhamento'] },
    { id:'manutencao',  t:T.s6t, d:T.s6d, icon:Award,         img:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=260&fit=crop',
      mats:es?['Máquinas industriales','Productos profesionales','Equipos de seguridad','Herramientas especializadas']:['Máquinas industriais','Produtos profissionais','Equipamentos de segurança','Ferramentas especializadas'],
      areas:es?['Áreas comunes','Garajes','Ascensores','Escaleras','Fachadas']:['Áreas comuns','Garagens','Elevadores','Escadas','Fachadas'] },
  ]

  const serviceTypes = [
    { id:'sofa',name:es?'Limpieza de Sofá':'Limpeza de Sofá',basePrice:45 },
    { id:'hipermeabilizacao-sofa',name:es?'Hipermeabilización de Sofá':'Hipermeabilização de Sofá',basePrice:160 },
    { id:'colchao-solteiro',name:es?'Colchón Individual':'Colchão de Solteiro',basePrice:40 },
    { id:'colchao-casal',name:es?'Colchón de Matrimonio':'Colchão de Casal',basePrice:50 },
    { id:'tapetes',name:es?'Alfombra':'Tapete',basePrice:10 },
    { id:'pos-obra',name:es?'Limpieza Post-Obra':'Limpeza Pós-Obras',basePrice:125 },
    { id:'cadeiras',name:es?'Limpieza de Sillas':'Limpeza de Cadeiras',basePrice:8 },
    { id:'armarios',name:es?'Limpieza de Armarios':'Limpeza de Armários',basePrice:13 },
    { id:'cortinas',name:es?'Limpieza de Cortinas':'Limpeza de Cortinas',basePrice:15 },
    { id:'vidros',name:es?'Limpieza de Cristales':'Limpeza de Vidros',basePrice:12 },
    { id:'escritorios',name:es?'Higienización de Oficinas/Hoteles':'Higienização de Escritórios/Hotéis',basePrice:30 },
    { id:'wc-sanitarios',name:es?'Limpieza de Baños':'Limpeza de WC / Sanitários / Lavatórios',basePrice:11 },
    { id:'fogoes-fornos',name:es?'Limpieza de Cocinas / Hornos':'Limpeza de Fogões / Fornos',basePrice:15 },
    { id:'limpeza-geral',name:es?'Limpieza General de Casa Amueblada':'Limpeza Geral de Casa Mobilada',basePrice:50 },
  ]
  const materialTypes = [
    { id:'tecido',name:es?'Tela común':'Tecido comum',multiplier:1.0 },
    { id:'couro',name:es?'Cuero natural':'Couro natural',multiplier:1.15 },
    { id:'napa',name:'Napa',multiplier:1.20 },
    { id:'camurca',name:es?'Ante':'Camurça',multiplier:1.20 },
    { id:'madeira',name:es?'Madera':'Madeira',multiplier:1.10 },
    { id:'aluminio',name:es?'Aluminio':'Alumínio',multiplier:1.0 },
    { id:'vidro',name:es?'Cristal':'Vidro',multiplier:1.0 },
    { id:'azulejo',name:'Azulejo',multiplier:1.0 },
    { id:'aco',name:es?'Acero inox':'Aço inox',multiplier:1.10 },
  ]
  const dirtLevels = [
    { id:'leve',name:es?'Leve':'Leve',multiplier:1.0 },
    { id:'media',name:es?'Media':'Média',multiplier:1.15 },
    { id:'pesada',name:es?'Pesada':'Pesada',multiplier:1.30 },
    { id:'manchas',name:es?'Con manchas difíciles':'Com manchas difíceis',multiplier:1.30 },
  ]
  const distanceOptions = [
    { id:'centro',name:es?'Centro':'Centro',multiplier:1.0 },
    { id:'fora-centro',name:es?'Fuera del Centro':'Fora do Centro',multiplier:1.10 },
    { id:'periferia',name:es?'Periferia':'Periferia',multiplier:1.20 },
  ]
  const neighborhoods = [
    { id:'centro',name:'Centro',multiplier:1.0 },{ id:'lisboa',name:'Lisboa',multiplier:1.0 },
    { id:'porto',name:'Porto',multiplier:1.0 },{ id:'cascais',name:'Cascais',multiplier:1.05 },
    { id:'sintra',name:'Sintra',multiplier:1.05 },{ id:'oeiras',name:'Oeiras',multiplier:1.10 },
    { id:'almada',name:'Almada',multiplier:1.15 },{ id:'setubal',name:'Setúbal',multiplier:1.20 },
    { id:'braga',name:'Braga',multiplier:1.20 },
    { id:'outro',name:es?'Otra localidad':'Outra localidade',multiplier:1.10 },
  ]

  const calcDisc=(n:number)=>n>=4?20:n>=3?15:n>=2?10:0
  const posP=(b:number,c:number)=>b+Math.max(0,c-1)*15
  const lgP=(b:number,q:number)=>b+Math.max(0,q-1)*15

  const runFormCalc=()=>{
    if(!formData.services.length||!formData.material||!formData.dirtLevel||!formData.distance){setFPrice(0);setFDisc(0);setFDiscAmt(0);return}
    const mat=materialTypes.find(m=>m.name===formData.material),dirt=dirtLevels.find(d=>d.name===formData.dirtLevel),dist=distanceOptions.find(d=>d.name===formData.distance)
    if(mat&&dirt&&dist){
      let t=0;formData.services.forEach(sn=>{const s=serviceTypes.find(st=>st.name===sn);if(s){let p=s.id==='pos-obra'?posP(s.basePrice,formData.posObraCompartments):s.id==='limpeza-geral'?lgP(s.basePrice,formData.limpezaGeralQuartos):s.basePrice*formData.quantity;t+=p*mat.multiplier*dirt.multiplier*dist.multiplier}})
      const dp=calcDisc(formData.services.length),dv=t*dp/100
      setFPrice(Math.round((t-dv)*100)/100);setFDisc(dp);setFDiscAmt(Math.round(dv*100)/100)
    }
  }
  const runBudgetCalc=()=>{
    if(!budgetData.serviceTypes.length||!budgetData.materialType||!budgetData.dirtLevel){setCalcP(0);setDisc(0);setDiscAmt(0);return}
    const mat=materialTypes.find(m=>m.id===budgetData.materialType),dirt=dirtLevels.find(d=>d.id===budgetData.dirtLevel),nb=neighborhoods.find(n=>n.id===budgetData.neighborhood)||{multiplier:1.0}
    if(mat&&dirt){
      let t=0;budgetData.serviceTypes.forEach(sid=>{const s=serviceTypes.find(st=>st.id===sid);if(s){let p=s.id==='pos-obra'?posP(s.basePrice,budgetData.posObraCompartments):s.id==='limpeza-geral'?lgP(s.basePrice,budgetData.limpezaGeralQuartos):s.basePrice*budgetData.quantity;t+=p*mat.multiplier*dirt.multiplier*nb.multiplier}})
      const dp=calcDisc(budgetData.serviceTypes.length),dv=t*dp/100
      setCalcP(Math.round((t-dv)*100)/100);setDisc(dp);setDiscAmt(Math.round(dv*100)/100)
    }
  }

  useEffect(()=>{runBudgetCalc()},[budgetData])
  useEffect(()=>{runFormCalc()},[formData.services,formData.material,formData.dirtLevel,formData.distance,formData.quantity,formData.posObraCompartments,formData.limpezaGeralQuartos])

  const updB=(f:string,v:any)=>setBudgetData(p=>({...p,[f]:v}))
  const togSvc=(id:string)=>setBudgetData(p=>({...p,serviceTypes:p.serviceTypes.includes(id)?p.serviceTypes.filter(x=>x!==id):[...p.serviceTypes,id]}))
  const togFSvc=(n:string)=>setFormData(p=>({...p,services:p.services.includes(n)?p.services.filter(x=>x!==n):[...p.services,n]}))
  const setF=(f:string,v:any)=>setFormData(p=>({...p,[f]:v}))
  const openSvcForm=(title:string)=>{setFormData(p=>({...p,services:[title]}));setIsFormOpen(true)}
  const go=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'})

  const handleBudgetSubmit=async()=>{
    if(!budgetData.serviceTypes.length||!budgetData.materialType||!budgetData.dirtLevel||!budgetData.address){alert(T.fillReq);return}
    try{
      const mat=materialTypes.find(m=>m.id===budgetData.materialType)
      const dirt=dirtLevels.find(d=>d.id===budgetData.dirtLevel)
      const nb=neighborhoods.find(n=>n.id===budgetData.neighborhood)
      const emailData:ServiceFormData={
        name:'Orçamento via Calculadora',
        phone:'Não informado',
        user_email:'suportelimpszone@gmail.com',
        address:budgetData.address,
        services:budgetData.serviceTypes.map(sid=>serviceTypes.find(st=>st.id===sid)?.name||sid),
        material:mat?.name||budgetData.materialType,
        dirtLevel:dirt?.name||budgetData.dirtLevel,
        distance:nb?.name||'Não informado',
        totalPrice:calcP.toFixed(2),
      }
      await sendServiceRequest(emailData)
      toast.success(T.ok)
      setShowOk(true)
      setBudgetData({serviceTypes:[],materialType:'',dirtLevel:'',address:'',neighborhood:'',quantity:1,observations:'',posObraCompartments:1,limpezaGeralQuartos:1})
      setCalcP(0);setDisc(0);setDiscAmt(0)
      setTimeout(()=>setShowOk(false),5000)
    }catch(e){console.error(e);toast.error(T.err)}
  }
  const handleFormSubmit=async(e:React.FormEvent)=>{
    e.preventDefault()
    if(!formData.name||!formData.phone||!formData.user_email||!formData.address||!formData.services.length||!formData.material||!formData.dirtLevel||!formData.distance){alert(T.fillReq);return}
    try{
      const ed:ServiceFormData={name:formData.name,phone:formData.phone,user_email:formData.user_email,address:formData.address,services:formData.services,material:formData.material,dirtLevel:formData.dirtLevel,distance:formData.distance,totalPrice:`${fPrice.toFixed(2)}`}
      await sendServiceRequest(ed);toast.success(T.ok);setShowOk(true);setIsFormOpen(false)
      setFormData({name:'',phone:'',user_email:'',address:'',services:[],material:'',dirtLevel:'',distance:'',quantity:1,observations:'',posObraCompartments:1,limpezaGeralQuartos:1});setFPrice(0);setFDisc(0);setFDiscAmt(0)
      setTimeout(()=>setShowOk(false),5000)
    }catch(e){toast.error(T.err)}
  }

  const btnN={background:C.navy,color:'#fff'} as React.CSSProperties
  const btnB={background:C.blue,color:'#fff'} as React.CSSProperties
  const WA_NUM = '351934071930'
  const WA_URL = `https://wa.me/${WA_NUM}?text=${encodeURIComponent(es ? '¡Hola! Me gustaría solicitar un presupuesto de limpieza.' : 'Olá! Gostaria de solicitar um orçamento de limpeza.')}`

  // ── FloatTitle helper component
  const FTitle = ({r, lines, size='h2', center=false}: {r:React.RefObject<HTMLDivElement>, lines:string[], size?:'h1'|'h2'|'h3', center?:boolean}) => (
    <div ref={r} className={`lz-r ${size === 'h1' ? 'lz-h1' : size === 'h3' ? 'lz-h3' : 'lz-h2'}`} style={{textAlign: center ? 'center' : 'left'}}>
      {lines.map((line, i) => (
        <span key={i} style={{display:'block'}}>{line}</span>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen" style={{background:C.iceBg,fontFamily:"'Nunito Sans','Inter',sans-serif",color:C.text}}>

      {showOk&&(
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle className="h-5 w-5"/><span className="font-semibold">{T.okBanner}</span>
        </div>
      )}

      {/* ══ HEADER ══ */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50" style={{borderColor:C.border}}>
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{background:`linear-gradient(135deg,${C.blue},${C.sky})`}}>
              <Sparkles className="h-5 w-5 text-white"/>
            </div>
            <div>
              <div><span className="text-xl font-black" style={{color:C.navy}}>LIMPS</span><span className="text-xl font-black" style={{color:C.blue}}>ZONE</span></div>
              <p className="text-xs leading-none" style={{color:C.muted}}>{T.sub}</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-5">
            {[[T.n1,'services'],[T.n2,'why-us'],[T.n3,'reviews'],[T.n4,'budget-calculator'],[T.n5,'footer']].map(([label,id])=>(
              <a key={id} href={`#${id}`} onClick={e=>{e.preventDefault();go(id)}}
                className="text-sm font-semibold transition-colors hover:text-blue-600 cursor-pointer" style={{color:C.text}}>{label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={()=>go('budget-calculator')} className="hidden md:flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm" style={btnN}>
              <Calculator className="h-4 w-4"/>{T.nCta}
            </button>
            <a href="tel:+351934071930" className="text-base font-black" style={{color:C.blue}}>+351 934 071 930</a>
          </div>
        </div>
      </header>

      {/* ══ HERO ══ */}
      <section id="hero" className="relative overflow-hidden" style={{minHeight:520}}>
        <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&h=580&fit=crop&fp-y=0.35"
          alt="Limpeza" className="w-full object-cover absolute inset-0" style={{minHeight:520,height:'100%'}}/>
        <div className="absolute inset-0" style={{background:'linear-gradient(120deg,rgba(15,42,94,0.38) 0%,rgba(224,240,255,0.1) 70%)'}}/>
        <div className="relative container mx-auto px-6 py-20 flex items-center" style={{minHeight:520}}>
          <div className="rounded-2xl p-8 max-w-[560px] shadow-2xl border" style={{background:'rgba(255,255,255,0.95)',borderColor:C.border}}>
            <span className="lz-eyebrow">{T.hBadge}</span>
            {/* BIG floating hero title */}
            <div ref={rHero} className="lz-title lz-h1 mb-5" style={{fontSize:'clamp(40px,5vw,58px)'}}>
              <span style={{display:'block'}}>{T.hT1}</span>
              <span style={{display:'block',background:`linear-gradient(135deg,${C.blue},${C.sky})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{T.hT2}</span>
              <span style={{display:'block'}}>{T.hT3}</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{color:C.muted}}>{T.hDesc}</p>
            <div className="flex items-center gap-6 mb-7">
              <div className="flex items-center gap-3">
                <span style={{fontSize:28}}>💬💬💬</span>
                <div>
                  <p className="text-2xl font-black leading-none" style={{color:C.navy}}>{T.hS1n}</p>
                  <p className="text-xs font-semibold" style={{color:C.muted}}>{T.hS1l}</p>
                </div>
              </div>
              <div className="w-px h-10" style={{background:C.border}}/>
              <div>
                <p className="text-2xl font-black leading-none" style={{color:C.navy}}>{T.hS2n}</p>
                <p className="text-xs font-semibold" style={{color:C.muted}}>⭐⭐⭐⭐⭐ {T.hS2l}</p>
              </div>
            </div>
            <button onClick={()=>go('budget-calculator')} className="flex items-center gap-2 font-bold px-7 py-3 rounded-xl text-sm shadow-md" style={btnB}>
              <Calculator className="h-4 w-4"/>{T.hCta}
            </button>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="lz-eyebrow" style={{display:'block',textAlign:'center'}}>{T.howBadge}</span>
            <div ref={rHow} className="lz-title lz-h2" style={{display:'block',textAlign:'center'}}>
              <span style={{display:'block'}}>{T.howT1}</span>
              <span style={{display:'block',background:`linear-gradient(135deg,${C.blue},${C.sky})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{T.howT2}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[[rH1,T.hw1t,T.hw1d,'1',0],[rH2,T.hw2t,T.hw2d,'2',1],[rH3,T.hw3t,T.hw3d,'3',2]].map(([ref,title,desc,num,idx])=>(
              <div key={idx as number} ref={ref as React.RefObject<HTMLDivElement>} className="lz-rs text-center relative">
                {(idx as number)<2&&<div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 border-t-2 border-dashed" style={{borderColor:C.border}}/>}
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black text-white mx-auto mb-4 relative z-10 shadow-md" style={{background:`linear-gradient(135deg,${C.blue},${C.sky})`}}>{num as string}</div>
                <p className="font-black text-lg text-gray-800 mb-1">{title as string}</p>
                <p className="text-sm leading-relaxed" style={{color:C.muted}}>{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="services" className="py-16" style={{background:C.iceMid}}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <span className="lz-eyebrow" style={{display:'block',textAlign:'center'}}>{T.svcBadge}</span>
            <div ref={rSvcT} className="lz-title lz-h2" style={{display:'block',textAlign:'center'}}>
              <span style={{display:'block'}}>{T.svcT1}</span>
              <span style={{display:'block',background:`linear-gradient(135deg,${C.blue},${C.sky})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{T.svcT2}</span>
            </div>
            <p className="text-sm mt-3 max-w-2xl mx-auto leading-relaxed" style={{color:C.muted}}>{T.svcS}</p>
          </div>
          <div ref={rSvcG} className="lz-r grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(svc=>{
              const Icon=svc.icon
              return(
                <div key={svc.id} className="rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border" style={{background:C.iceCard,borderColor:C.border}}>
                  <div className="relative">
                    <img src={svc.img} alt={svc.t} className="w-full h-48 object-cover"/>
                    <div className="absolute top-3 left-3 bg-white/90 p-2 rounded-lg shadow-sm">
                      <Icon className="h-4 w-4" style={{color:C.blue}}/>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-black mb-1" style={{color:C.navy}}>{svc.t}</h3>
                    <p className="text-xs mb-3" style={{color:C.muted}}>{svc.d}</p>
                    <div className="mb-3">
                      <p className="text-xs font-bold mb-1.5" style={{color:C.text}}>{T.matT}</p>
                      <div className="flex flex-wrap gap-1">{svc.mats.map((m,i)=><span key={i} className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{background:C.iceMid,color:C.blue}}>{m}</span>)}</div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-bold mb-1.5" style={{color:C.text}}>{T.arT}</p>
                      <div className="space-y-1">{svc.areas.map((a,i)=><div key={i} className="flex items-center gap-2 text-xs" style={{color:C.muted}}><CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0"/>{a}</div>)}</div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t" style={{borderColor:C.border}}>
                      <button onClick={()=>openSvcForm(svc.t)} className="text-xs font-bold text-white px-4 py-2 rounded-lg flex items-center gap-1" style={btnB}>
                        {T.rs}<ArrowRight className="h-3 w-3"/>
                      </button>
                      <button onClick={()=>openSvcForm(svc.t)} className="text-xs font-semibold flex items-center gap-1 hover:text-blue-600 transition-colors" style={{color:C.muted}}>
                        {T.lm}<ArrowRight className="h-3 w-3"/>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-10">
            <button onClick={()=>go('budget-calculator')} className="inline-flex items-center gap-2 font-bold px-8 py-3 rounded-xl text-sm shadow-md" style={btnN}>
              <Calculator className="h-4 w-4"/>{T.svcCta}
            </button>
          </div>
        </div>
      </section>

      {/* ══ WHATSAPP CTA 1 — MIDDLE ══ */}
      <div className="py-10 text-center" style={{background:'#f0fdf4'}}>
        <p className="text-sm font-semibold mb-3" style={{color:'#166534'}}>
          {es ? '¿Prefiere hablar directamente? ¡Estamos en WhatsApp!' : 'Prefere falar diretamente? Estamos no WhatsApp!'}
        </p>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 font-black px-8 py-4 rounded-2xl text-white shadow-xl transition-all hover:scale-105"
          style={{background:'#25d366',fontSize:'16px',boxShadow:'0 8px 24px rgba(37,211,102,0.4)'}}>
          <MessageCircle className="h-6 w-6"/>
          {es ? '💬 Hablar por WhatsApp Ahora' : '💬 Falar no WhatsApp Agora'}
        </a>
      </div>

      {/* ══ WHY CHOOSE US ══ */}
      <section id="why-us" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="lz-eyebrow">{T.whyBadge}</span>
              <div ref={rWhyT} className="lz-title lz-h2 mb-6">
                <span style={{display:'block'}}>{T.whyT1}</span>
                <span style={{display:'block',background:`linear-gradient(135deg,${C.blue},${C.sky})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{T.whyT2}</span>
              </div>
              <div ref={rWhyL} className="lz-r">
                {[[T.w1t,T.w1d],[T.w2t,T.w2d],[T.w3t,T.w3d],[T.w4t,T.w4d]].map((item,i)=>(
                  <div key={i} className="rounded-xl p-4 mb-3 border-l-4" style={{background:C.iceBg,border:`1px solid ${C.border}`,borderLeft:`4px solid ${C.blue}`}}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{background:C.blue}}>
                        <CheckCircle className="h-3 w-3 text-white"/>
                      </div>
                      <p className="text-sm font-black" style={{color:C.navy}}>{item[0]}</p>
                    </div>
                    <p className="text-xs leading-relaxed ml-7" style={{color:C.muted}}>{item[1]}</p>
                  </div>
                ))}
                <button onClick={()=>go('budget-calculator')} className="mt-4 flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-sm shadow-md" style={btnN}>
                  {T.wCta}<ArrowRight className="h-4 w-4"/>
                </button>
              </div>
            </div>
            <div ref={rWhyR} className="lz-r">
              <img src="https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=600&h=500&fit=crop&fp-y=0.3"
                alt="Equipa" className="w-full object-cover rounded-2xl shadow-xl" style={{maxHeight:440}}/>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROMISE ══ */}
      <section className="py-16" style={{background:C.iceMid}}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={rPmL} className="lz-r">
              <img src="https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=400&fit=crop"
                alt="Qualidade" className="w-full h-72 object-cover rounded-2xl shadow-xl"/>
            </div>
            <div>
              <span className="lz-eyebrow">{T.pmBadge}</span>
              <div ref={rPmR} className="lz-title lz-h2 mb-5">
                <span style={{display:'block'}}>{T.pmT1}</span>
                <span style={{display:'block',background:`linear-gradient(135deg,${C.blue},${C.sky})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{T.pmT2}</span>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{color:C.muted}}>{T.pmD}</p>
              <button onClick={()=>go('budget-calculator')} className="flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-sm shadow-md" style={btnN}>
                {T.pmCta}<ArrowRight className="h-4 w-4"/>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ IMPACTO ══ */}
      <ImpactoHigienizacao onSolicitarServico={()=>setIsFormOpen(true)}/>

      {/* ══ REVIEWS ══ */}
      <section id="reviews" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <span className="lz-eyebrow" style={{display:'block',textAlign:'center'}}>{T.rvBadge}</span>
            <div ref={rRvT} className="lz-title lz-h2" style={{display:'block',textAlign:'center'}}>
              <span style={{display:'block'}}>{T.rvT1}</span>
              <span style={{display:'block',background:`linear-gradient(135deg,${C.blue},${C.sky})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{T.rvT2}</span>
            </div>
          </div>
          <div ref={rRvG} className="lz-r">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {visRv.map((r,i)=>(
                <div key={i} className="rounded-xl p-6 border shadow-sm transition-all duration-500" style={{background:C.iceCard,borderColor:C.border}}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0 shadow-sm" style={{background:`linear-gradient(135deg,${C.navy},${C.blue})`}}>{r.init}</div>
                    <div>
                      <p className="text-sm font-black" style={{color:C.navy}}>{r.name}</p>
                      <p className="text-xs" style={{color:C.muted}}>{r.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_,j)=><Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400"/>)}</div>
                  <p className="text-xs leading-relaxed italic" style={{color:C.muted}}>"{r.text}"</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4">
              <button onClick={prevRv} className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-blue-50 transition-colors" style={{borderColor:C.blue}}>
                <ChevronLeft className="h-5 w-5" style={{color:C.blue}}/>
              </button>
              <div className="flex gap-2">
                {reviews.map((_,i)=>(
                  <button key={i} onClick={()=>setRvIdx(i)} className="w-2.5 h-2.5 rounded-full transition-all" style={{background:i===rvIdx?C.blue:C.border}}/>
                ))}
              </div>
              <button onClick={nextRv} className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-blue-50 transition-colors" style={{borderColor:C.blue}}>
                <ChevronRight className="h-5 w-5" style={{color:C.blue}}/>
              </button>
            </div>
          </div>
          <div className="text-center mt-8">
            <button onClick={()=>go('budget-calculator')} className="font-bold px-8 py-3 rounded-xl text-sm shadow-md" style={btnN}>{T.rvAll}</button>
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="py-16" style={{background:`linear-gradient(135deg,${C.navy} 0%,${C.blue} 100%)`}}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div ref={rBnT} className="lz-title lz-h2 text-white" style={{WebkitTextFillColor:'white'}}>
            <span style={{display:'block'}}>{T.bnT1}</span>
            <span style={{display:'block',opacity:0.85}}>{T.bnT2}</span>
            <p className="text-sm font-normal mt-3" style={{color:'#93c5fd',WebkitTextFillColor:'#93c5fd',letterSpacing:'0',fontSize:'14px',fontWeight:400}}>{T.bnS}</p>
          </div>
          <div ref={rBnB} className="lz-r flex-shrink-0">
            <button onClick={()=>go('budget-calculator')} className="flex items-center gap-2 font-bold px-9 py-4 rounded-xl text-sm shadow-xl" style={{background:'#fff',color:C.navy}}>
              <Calculator className="h-4 w-4"/>{T.bnCta}
            </button>
          </div>
        </div>
      </section>

      {/* ══ BUDGET CALCULATOR ══ */}
      <section id="budget-calculator" className="py-16" style={{background:C.iceBg}}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <span className="lz-eyebrow" style={{display:'block',textAlign:'center'}}>{T.calcBadge}</span>
            <div ref={rCalcT} className="lz-title lz-h2" style={{display:'block',textAlign:'center'}}>
              <span style={{display:'block'}}>{T.calcT1}</span>
              <span style={{display:'block',background:`linear-gradient(135deg,${C.blue},${C.sky})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{T.calcT2}</span>
            </div>
            <p className="text-sm mt-3 max-w-2xl mx-auto" style={{color:C.muted}}>{T.cS}</p>
          </div>
          <div ref={rCalcC} className="lz-r max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl border" style={{borderColor:C.border}}>
              <div className="p-6 text-white" style={{background:`linear-gradient(135deg,${C.navy},${C.blue})`}}>
                <h3 className="text-xl font-black flex items-center gap-2"><DollarSign className="h-5 w-5"/>{T.cCardT}</h3>
                <p className="text-sm mt-1" style={{color:'#93c5fd'}}>{T.cCardS}</p>
              </div>
              <div className="p-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label className="text-sm font-black text-gray-700 mb-3 block">{T.st1}</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {serviceTypes.map(s=>(
                        <div key={s.id} className="flex items-center gap-2">
                          <Checkbox id={s.id} checked={budgetData.serviceTypes.includes(s.id)} onCheckedChange={()=>togSvc(s.id)}/>
                          <Label htmlFor={s.id} className="text-sm cursor-pointer" style={{color:C.text}}>{s.name}</Label>
                        </div>
                      ))}
                    </div>
                    {budgetData.serviceTypes.length>=2&&(
                      <div className="mt-3 p-3 rounded-xl border flex items-center gap-2" style={{background:'#f0fdf4',borderColor:'#bbf7d0'}}>
                        <Zap className="h-4 w-4 text-green-600"/>
                        <span className="text-green-700 font-bold text-sm">{T.promoA} {budgetData.serviceTypes.length>=4?'20%':budgetData.serviceTypes.length>=3?'15%':'10%'} {T.promoD}</span>
                      </div>
                    )}
                  </div>
                  {budgetData.serviceTypes.includes('pos-obra')&&(
                    <div className="md:col-span-2">
                      <Label className="text-sm font-black text-gray-700 mb-3 block">{T.posL}</Label>
                      <div className="flex items-center gap-3">
                        <Button type="button" variant="outline" size="sm" onClick={()=>updB('posObraCompartments',Math.max(1,budgetData.posObraCompartments-1))} className="h-10 w-10"><Minus className="h-4 w-4"/></Button>
                        <Input type="number" min="1" value={budgetData.posObraCompartments} onChange={e=>updB('posObraCompartments',Math.max(1,parseInt(e.target.value)||1))} className="h-10 text-center w-20"/>
                        <Button type="button" variant="outline" size="sm" onClick={()=>updB('posObraCompartments',budgetData.posObraCompartments+1)} className="h-10 w-10"><Plus className="h-4 w-4"/></Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{T.posN}</p>
                    </div>
                  )}
                  {budgetData.serviceTypes.includes('limpeza-geral')&&(
                    <div className="md:col-span-2">
                      <Label className="text-sm font-black text-gray-700 mb-3 block">{T.lgL}</Label>
                      <div className="flex items-center gap-3">
                        <Button type="button" variant="outline" size="sm" onClick={()=>updB('limpezaGeralQuartos',Math.max(1,budgetData.limpezaGeralQuartos-1))} className="h-10 w-10"><Minus className="h-4 w-4"/></Button>
                        <Input type="number" min="1" value={budgetData.limpezaGeralQuartos} onChange={e=>updB('limpezaGeralQuartos',Math.max(1,parseInt(e.target.value)||1))} className="h-10 text-center w-20"/>
                        <Button type="button" variant="outline" size="sm" onClick={()=>updB('limpezaGeralQuartos',budgetData.limpezaGeralQuartos+1)} className="h-10 w-10"><Plus className="h-4 w-4"/></Button>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">{T.lgN}</p>
                    </div>
                  )}
                  {!budgetData.serviceTypes.includes('pos-obra')&&!budgetData.serviceTypes.includes('limpeza-geral')&&(
                    <div>
                      <Label className="text-sm font-black text-gray-700 mb-3 block">{T.st2}</Label>
                      <div className="flex items-center gap-3">
                        <Button type="button" variant="outline" size="sm" onClick={()=>updB('quantity',Math.max(1,budgetData.quantity-1))} className="h-10 w-10"><Minus className="h-4 w-4"/></Button>
                        <Input type="number" min="1" value={budgetData.quantity} onChange={e=>updB('quantity',Math.max(1,parseInt(e.target.value)||1))} className="h-10 text-center w-20"/>
                        <Button type="button" variant="outline" size="sm" onClick={()=>updB('quantity',budgetData.quantity+1)} className="h-10 w-10"><Plus className="h-4 w-4"/></Button>
                      </div>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-black text-gray-700 mb-3 block">{T.st3}</Label>
                    <Select value={budgetData.materialType} onValueChange={v=>updB('materialType',v)}>
                      <SelectTrigger className="h-10"><SelectValue placeholder={T.selMat}/></SelectTrigger>
                      <SelectContent>{materialTypes.map(m=><SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-black text-gray-700 mb-3 block">{T.st4}</Label>
                    <Select value={budgetData.dirtLevel} onValueChange={v=>updB('dirtLevel',v)}>
                      <SelectTrigger className="h-10"><SelectValue placeholder={T.selDirt}/></SelectTrigger>
                      <SelectContent>{dirtLevels.map(d=><SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-black text-gray-700 mb-3 block">{T.st5}</Label>
                    <Select value={budgetData.neighborhood} onValueChange={v=>updB('neighborhood',v)}>
                      <SelectTrigger className="h-10"><SelectValue placeholder={T.selLoc}/></SelectTrigger>
                      <SelectContent>{neighborhoods.map(n=><SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-black text-gray-700 mb-3 block">{T.stA}</Label>
                    <Input value={budgetData.address} onChange={e=>updB('address',e.target.value)} placeholder={T.selAddr} className="h-10"/>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-black text-gray-700 mb-3 block">{T.stO}</Label>
                    <Textarea value={budgetData.observations} onChange={e=>updB('observations',e.target.value)} placeholder={T.selObsPh} className="min-h-[80px]"/>
                  </div>
                </div>
                <div className="mt-8 p-6 rounded-2xl border-2 text-center" style={{background:'#f0fdf4',borderColor:'#bbf7d0'}}>
                  <h3 className="text-xl font-black text-gray-800 mb-2">{T.priceT}</h3>
                  {calcP>0&&(
                    <div className="mb-3 space-y-1">
                      <p className="text-sm text-gray-500">{T.subT} <span className="font-bold">{(calcP+discAmt).toFixed(2)} €</span></p>
                      {disc>0&&<p className="text-sm text-red-500">{T.discA} (-{disc}%): <span className="font-bold">-{discAmt.toFixed(2)} €</span></p>}
                    </div>
                  )}
                  <div className="text-5xl font-black text-green-600 mb-1">{calcP>0?`${calcP.toFixed(2)} €`:'0,00 €'}</div>
                  <p className="text-sm text-gray-400">{calcP>0?T.finalP:T.selOpt}</p>
                  {calcP>0&&<p className="text-xs text-gray-400 mt-2">{T.discTip}</p>}
                </div>
                <div className="mt-6 text-center">
                  <button onClick={handleBudgetSubmit} disabled={!budgetData.serviceTypes.length||!budgetData.materialType||!budgetData.dirtLevel||!budgetData.address}
                    className="inline-flex items-center gap-2 font-bold px-10 py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md" style={btnB}>
                    <Mail className="h-4 w-4"/>{T.sbBtn}
                  </button>
                  <p className="text-xs text-gray-400 mt-2">{T.sbNote}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHATSAPP CTA 2 — NEAR END ══ */}
      <div className="py-12" style={{background:`linear-gradient(135deg,#dcfce7,#d1fae5)`}}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-2xl font-black mb-1" style={{color:'#14532d'}}>
              {es ? '¿Respuesta inmediata? ¡WhatsApp!' : 'Resposta imediata? WhatsApp!'}
            </p>
            <p className="text-sm" style={{color:'#166534'}}>
              {es ? 'Nuestro equipo responde en minutos. Sin esperas.' : 'A nossa equipa responde em minutos. Sem esperas.'}
            </p>
          </div>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-3 font-black px-10 py-5 rounded-2xl text-white shadow-2xl transition-all hover:scale-105"
            style={{background:'#25d366',fontSize:'16px',boxShadow:'0 8px 32px rgba(37,211,102,0.45)'}}>
            <MessageCircle className="h-7 w-7"/>
            {es ? '📲 Contactar Ahora' : '📲 Contactar Agora'}
          </a>
        </div>
      </div>

      {/* ══ FAQ ══ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-8">
            <span className="lz-eyebrow" style={{display:'block',textAlign:'center'}}>{T.faqBadge}</span>
            <div ref={rFaqT} className="lz-title lz-h2" style={{display:'block',textAlign:'center'}}>
              <span style={{display:'block'}}>{T.faqT1}</span>
              <span style={{display:'block',background:`linear-gradient(135deg,${C.blue},${C.sky})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{T.faqT2}</span>
            </div>
          </div>
          <div ref={rFaqL} className="lz-r space-y-3">
            {[[T.q1,T.a1],[T.q2,T.a2],[T.q3,T.a3],[T.q4,T.a4]].map((item,i)=>(
              <div key={i} className="bg-white rounded-xl overflow-hidden border" style={{borderColor:C.border,borderLeft:`4px solid ${C.blue}`}}>
                <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-blue-50 transition-colors" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <span className="text-sm font-black" style={{color:C.navy}}>{item[0]}</span>
                  {openFaq===i?<ChevronUp className="h-4 w-4 flex-shrink-0" style={{color:C.blue}}/>:<ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400"/>}
                </button>
                {openFaq===i&&<div className="px-5 pb-4 text-sm leading-relaxed" style={{color:C.muted}}>{item[1]}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MODAL FORM ══ */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black" style={{color:C.navy}}>{T.modT}</DialogTitle>
            <DialogDescription className="text-sm" style={{color:C.muted}}>{T.modD}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label className="text-xs font-bold">{T.fName}</Label><Input required value={formData.name} onChange={e=>setF('name',e.target.value)} placeholder={T.phName} className="mt-1"/></div>
              <div><Label className="text-xs font-bold">{T.fPhone}</Label><Input required value={formData.phone} onChange={e=>setF('phone',e.target.value)} placeholder={T.phPhone} className="mt-1"/></div>
            </div>
            <div><Label className="text-xs font-bold">{T.fEmail}</Label><Input type="email" required value={formData.user_email} onChange={e=>setF('user_email',e.target.value)} placeholder={T.phEmail} className="mt-1"/></div>
            <div><Label className="text-xs font-bold">{T.fAddr}</Label><Input required value={formData.address} onChange={e=>setF('address',e.target.value)} placeholder={T.phAddr} className="mt-1"/></div>
            <div>
              <Label className="text-xs font-bold block mb-2">{T.fSvc}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-xl p-3" style={{borderColor:C.border}}>
                {serviceTypes.map(s=>(
                  <div key={s.id} className="flex items-center gap-2">
                    <Checkbox id={`fm-${s.id}`} checked={formData.services.includes(s.name)} onCheckedChange={()=>togFSvc(s.name)}/>
                    <Label htmlFor={`fm-${s.id}`} className="text-xs cursor-pointer">{s.name}</Label>
                  </div>
                ))}
              </div>
              {formData.services.length>=2&&(
                <div className="mt-2 p-2 rounded-lg border text-xs font-bold text-green-700 flex items-center gap-2" style={{background:'#f0fdf4',borderColor:'#bbf7d0'}}>
                  <Zap className="h-3 w-3"/>{T.promoA} {formData.services.length>=4?'20%':formData.services.length>=3?'15%':'10%'} {T.promoD}
                </div>
              )}
            </div>
            {formData.services.some(s=>s.includes('Pós-Obras')||s.includes('Post-Obra'))&&(
              <div>
                <Label className="text-xs font-bold">{T.posL}</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button type="button" variant="outline" size="sm" onClick={()=>setF('posObraCompartments',Math.max(1,formData.posObraCompartments-1))}><Minus className="h-3 w-3"/></Button>
                  <Input type="number" min="1" value={formData.posObraCompartments} onChange={e=>setF('posObraCompartments',Math.max(1,parseInt(e.target.value)||1))} className="text-center w-16"/>
                  <Button type="button" variant="outline" size="sm" onClick={()=>setF('posObraCompartments',formData.posObraCompartments+1)}><Plus className="h-3 w-3"/></Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">{T.posN}</p>
              </div>
            )}
            {formData.services.some(s=>s.includes('Limpeza Geral')||s.includes('Limpieza General'))&&(
              <div>
                <Label className="text-xs font-bold">{T.lgL}</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button type="button" variant="outline" size="sm" onClick={()=>setF('limpezaGeralQuartos',Math.max(1,formData.limpezaGeralQuartos-1))}><Minus className="h-3 w-3"/></Button>
                  <Input type="number" min="1" value={formData.limpezaGeralQuartos} onChange={e=>setF('limpezaGeralQuartos',Math.max(1,parseInt(e.target.value)||1))} className="text-center w-16"/>
                  <Button type="button" variant="outline" size="sm" onClick={()=>setF('limpezaGeralQuartos',formData.limpezaGeralQuartos+1)}><Plus className="h-3 w-3"/></Button>
                </div>
                <p className="text-xs text-blue-600 mt-1">{T.lgN}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!formData.services.some(s=>s.includes('Pós-Obras')||s.includes('Post-Obra')||s.includes('Limpeza Geral')||s.includes('Limpieza General'))&&(
                <div>
                  <Label className="text-xs font-bold">{T.st2}</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button type="button" variant="outline" size="sm" onClick={()=>setF('quantity',Math.max(1,formData.quantity-1))}><Minus className="h-3 w-3"/></Button>
                    <Input type="number" min="1" value={formData.quantity} onChange={e=>setF('quantity',Math.max(1,parseInt(e.target.value)||1))} className="text-center w-16"/>
                    <Button type="button" variant="outline" size="sm" onClick={()=>setF('quantity',formData.quantity+1)}><Plus className="h-3 w-3"/></Button>
                  </div>
                </div>
              )}
              <div>
                <Label className="text-xs font-bold">{T.fMat}</Label>
                <Select required value={formData.material} onValueChange={v=>setF('material',v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={T.phMatSel}/></SelectTrigger>
                  <SelectContent>{materialTypes.map(m=><SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold">{T.fDirt}</Label>
                <Select required value={formData.dirtLevel} onValueChange={v=>setF('dirtLevel',v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={T.phDirtSel}/></SelectTrigger>
                  <SelectContent>{dirtLevels.map(d=><SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-bold">{T.fDist}</Label>
                <Select required value={formData.distance} onValueChange={v=>setF('distance',v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={T.phDistSel}/></SelectTrigger>
                  <SelectContent>{distanceOptions.map(d=><SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold">{T.fObs}</Label>
              <Textarea value={formData.observations} onChange={e=>setF('observations',e.target.value)} placeholder={T.selObsPh} className="min-h-[60px] mt-1"/>
            </div>
            {fPrice>0&&(
              <div className="p-4 rounded-xl border-2 text-center" style={{background:'#f0fdf4',borderColor:'#bbf7d0'}}>
                <p className="text-sm font-black text-gray-700 mb-1">{T.priceTotal}</p>
                <p className="text-xs text-gray-400">{T.subT} <span className="font-bold">{(fPrice+fDiscAmt).toFixed(2)} €</span></p>
                {fDisc>0&&<p className="text-xs text-red-500">{T.discA} (-{fDisc}%): -{fDiscAmt.toFixed(2)} €</p>}
                <p className="text-3xl font-black text-green-600">{fPrice.toFixed(2)} €</p>
                <p className="text-xs text-gray-400">{T.finalP}</p>
              </div>
            )}
            <button type="submit" disabled={!formData.name||!formData.phone||!formData.user_email||!formData.address||!formData.services.length||!formData.material||!formData.dirtLevel||!formData.distance}
              className="w-full font-bold py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-white" style={btnB}>
              {T.sbBtn}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ══ FIXED WHATSAPP BUTTON ══ */}
      <a href={WA_URL} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 font-bold px-5 py-4 rounded-2xl shadow-2xl text-white transition-transform hover:scale-105"
        style={{background:'#25d366',boxShadow:'0 8px 32px rgba(37,211,102,0.45)'}}>
        <MessageCircle className="h-6 w-6"/>
        <span className="text-sm font-black">WhatsApp</span>
      </a>

      {/* ══ FOOTER ══ */}
      <footer id="footer" style={{background:`linear-gradient(180deg,${C.navy} 0%,#071322 100%)`}} className="pt-14 pb-6">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 pb-10 border-b" style={{borderColor:'rgba(255,255,255,0.08)'}}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow" style={{background:`linear-gradient(135deg,${C.blue},${C.sky})`}}>
                  <Sparkles className="h-4 w-4 text-white"/>
                </div>
                <span className="text-lg font-black text-white">LIMPS<span style={{color:'#60a5fa'}}>ZONE</span></span>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{color:'#94a3b8'}}>{T.ftDesc}</p>
              <a href="tel:+351934071930" className="text-base font-black block mb-1" style={{color:'#60a5fa'}}>📞 +351 934 071 930</a>
              <p className="text-xs" style={{color:'#64748b'}}>suportelimpszone@gmail.com</p>
              <div className="mt-4 space-y-1">
                <p className="text-xs" style={{color:'#64748b'}}>{T.ftMF}</p>
                <p className="text-xs" style={{color:'#64748b'}}>{T.ftSa}</p>
                <p className="text-xs" style={{color:'#64748b'}}>{T.ftSu}</p>
                <p className="text-xs font-bold text-green-400">{T.ftEm}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-4 text-white pb-2 border-b inline-block" style={{borderColor:C.blue}}>{T.ftSvc}</p>
              {[T.s1t,T.s2t,T.s3t,T.s4t,T.s5t,T.s6t].map(s=>(
                <a key={s} href="#services" onClick={e=>{e.preventDefault();go('services')}} className="block text-xs mb-2 transition-colors hover:text-blue-400 cursor-pointer" style={{color:'#94a3b8'}}>{s}</a>
              ))}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-4 text-white pb-2 border-b inline-block" style={{borderColor:C.blue}}>{T.ftCo}</p>
              {[[T.n2,'why-us'],[T.n3,'reviews'],[T.n4,'budget-calculator'],['FAQ','budget-calculator']].map(([label,id])=>(
                <a key={label} href={`#${id}`} onClick={e=>{e.preventDefault();go(id)}} className="block text-xs mb-2 transition-colors hover:text-blue-400 cursor-pointer" style={{color:'#94a3b8'}}>{label}</a>
              ))}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-4 text-white pb-2 border-b inline-block" style={{borderColor:C.blue}}>{T.ftCtc}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2"><Phone className="h-3 w-3" style={{color:'#60a5fa'}}/><a href="tel:+351934071930" className="text-xs hover:text-blue-400 transition-colors" style={{color:'#94a3b8'}}>+351 934 071 930</a></div>
                <div className="flex items-center gap-2"><Mail className="h-3 w-3" style={{color:'#60a5fa'}}/><a href="mailto:suportelimpszone@gmail.com" className="text-xs hover:text-blue-400 transition-colors" style={{color:'#94a3b8'}}>suportelimpszone@gmail.com</a></div>
                <div className="flex items-center gap-2"><MapPin className="h-3 w-3" style={{color:'#60a5fa'}}/><span className="text-xs" style={{color:'#94a3b8'}}>Portugal, Europa</span></div>
                <div className="flex items-center gap-2"><Clock className="h-3 w-3 text-green-400"/><span className="text-xs font-bold text-green-400">24/7</span></div>
              </div>
              <WhatsAppButton className="mt-4 inline-flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-xl" style={{background:'#25d366'}}>
                <MessageCircle className="h-3 w-3"/>{T.ftWA}
              </WhatsAppButton>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{color:'#475569'}}>{T.ftCopy}</p>
            <p className="text-xs italic mt-1" style={{color:'#334155'}}>{T.ftTag}</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
