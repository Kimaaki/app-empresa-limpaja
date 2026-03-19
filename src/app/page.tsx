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
type Lang = 'pt' | 'es' | 'en' | 'de' | 'fr' | 'ar' | 'ru' | 'it' | 'zh' | 'ro'
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
    r1i:'MS', r1n:'Maria Silva',    r1r:'Proprietária de Restaurante', r1t:'A equipa fez um trabalho fantástico no nosso restaurante. Profissional, pontual e resultados impecáveis.',    r1p:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&fp-y=0.3',
    r2i:'JS', r2n:'João Santos',    r2r:'Gerente de Hotel',            r2t:'Trabalho impecável no hotel. Os clientes elogiam sempre a qualidade da limpeza dos quartos.',               r2p:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&fp-y=0.2',
    r3i:'AC', r3n:'Ana Costa',      r3r:'Dona de Casa',                r3t:'A minha casa ficou a brilhar! Muito atenciosas com todos os detalhes. Recomendo sem hesitar.',               r3p:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&fp-y=0.2',
    r4i:'RM', r4n:'Rui Mendes',     r4r:'Empresário',                  r4t:'Pós-obra excelente. O escritório ficou pronto para inaugurar no próprio dia. Muito eficiente.',              r4p:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&fp-y=0.2',
    r5i:'CF', r5n:'Carla Ferreira', r5r:'Cliente Residencial',         r5t:'Contratei o serviço semanal. As senhoras são fantásticas, cuidadosas e sempre pontuais.',                   r5p:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&fp-y=0.2',
    r6i:'PN', r6n:'Pedro Nunes',    r6r:'Administrador de Condomínio', r6t:'Manutenção do condomínio impecável. Áreas comuns sempre limpas. Moradores muito satisfeitos!',              r6p:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&fp-y=0.2',
    r7i:'LG', r7n:'Lena Garcia',    r7r:'Diretora de Hotel',           r7t:'Qualidade excecional na limpeza das nossas instalações. Parceria de total confiança.',                       r7p:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&fp-y=0.2',
    r8i:'TR', r8n:'Tiago Rocha',    r8r:'Proprietário de Café',        r8t:'Sempre impecável e pontual. Os clientes adoram a limpeza do espaço. Totalmente recomendado.',               r8p:'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&fp-y=0.2',
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
    r1i:'MS', r1n:'Maria Silva',    r1r:'Propietaria de Restaurante', r1t:'¡El equipo hizo un trabajo fantástico en nuestro restaurante! Muy profesional y puntual.',    r1p:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&fp-y=0.3',
    r2i:'JS', r2n:'João Santos',    r2r:'Gerente de Hotel',           r2t:'Trabajo impecable en el hotel. Los clientes siempre elogian la calidad de las habitaciones.',          r2p:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&fp-y=0.2',
    r3i:'AC', r3n:'Ana Costa',      r3r:'Ama de Casa',                r3t:'¡Mi casa quedó brillando! Muy atentas con todos los detalles. Lo recomiendo sin dudarlo.',            r3p:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&fp-y=0.2',
    r4i:'RM', r4n:'Rui Mendes',     r4r:'Empresario',                 r4t:'Post-obra excelente. La oficina quedó lista para inaugurar el mismo día.',                             r4p:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&fp-y=0.2',
    r5i:'CF', r5n:'Carla Ferreira', r5r:'Cliente Residencial',        r5t:'Contraté el servicio semanal. Las señoras son fantásticas, cuidadosas y siempre puntuales.',           r5p:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&fp-y=0.2',
    r6i:'PN', r6n:'Pedro Nunes',    r6r:'Administrador de Finca',     r6t:'Mantenimiento del edificio impecable. Áreas comunes siempre limpias. Residentes muy satisfechos.',    r6p:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&fp-y=0.2',
    r7i:'LG', r7n:'Lena Garcia',    r7r:'Directora de Hotel',         r7t:'Calidad excepcional en la limpieza de nuestras instalaciones. Socio de total confianza.',              r7p:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&fp-y=0.2',
    r8i:'TR', r8n:'Tiago Rocha',    r8r:'Propietario de Café',        r8t:'Siempre impecable y puntual. Los clientes adoran la limpieza del local. Totalmente recomendado.',      r8p:'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&fp-y=0.2',
  },
  en: {
    sub:'Professional Cleaning',
    n1:'Services', n2:'Why Us', n3:'Testimonials', n4:'Calculator', n5:'Contact', nCta:'Free Quote',
    hBadge:'Professional Cleaning Services',
    hT1:'Your Space', hT2:'Impeccable,', hT3:'Wherever You Are',
    hDesc:'Professional cleaning for homes, hotels and commercial spaces across Europe. Quality guaranteed, trusted team.',
    hS1n:'500+', hS1l:'Happy Clients', hS2n:'4.9/5', hS2l:'Rating',
    hCta:'Request Free Quote',
    howBadge:'How It Works', howT1:'Clean in', howT2:'3 Simple Steps',
    hw1t:'Request a quote', hw1d:'Fill in the form or call us. Response in less than 1 hour.',
    hw2t:'We schedule the visit', hw2d:'Choose the most convenient day and time. We arrive on time.',
    hw3t:'Impeccable space', hw3d:'100% satisfaction guaranteed — if you are not happy, we return for free.',
    svcBadge:'Our Services', svcT1:'Solutions for', svcT2:'Every Space',
    svcS:'Professional cleaning for all types of spaces. No contracts, no complications.',
    svcCta:'View All Services & Prices',
    lm:'Learn more', rs:'Request Service',
    matT:'Materials Used:', arT:'Areas Covered:',
    s1t:'Residential Cleaning', s1d:'Complete cleaning of houses and apartments',
    s2t:'Commercial Cleaning', s2d:'Sanitisation of offices and commercial spaces',
    s3t:'Restaurants & Hotels', s3d:'Specialised cleaning for hospitality and catering',
    s4t:'Window Cleaning', s4d:'Professional cleaning of windows and facades',
    s5t:'Post-Construction', s5d:'Heavy cleaning after construction and renovations',
    s6t:'Building Maintenance', s6d:'Continuous cleaning of condominiums and buildings',
    whyBadge:'Why Us', whyT1:'The Choice of', whyT2:'Those Who Demand Quality',
    w1t:'Total Satisfaction Guarantee', w1d:'If the service is not to your liking, we return at no extra cost.',
    w2t:'Verified & Trained Team', w2d:'All staff undergo background checks and specialist training.',
    w3t:'Personalised Cleaning', w3d:'A plan tailored to your space, routine and budget.',
    w4t:'Easy Scheduling', w4d:'Quote in less than 1 hour. Book online or by phone.',
    wCta:'Request Free Quote',
    pmBadge:'Quality Guaranteed', pmT1:'Our Promise', pmT2:'of Excellence',
    pmD:'We use a 40-point checklist on every visit. If something is not perfect, we fix it at no extra cost.',
    pmCta:'Learn More',
    rvBadge:'Testimonials', rvT1:'What Our', rvT2:'Clients Say',
    rvAll:'View All Reviews',
    bnT1:'Ready for a Truly', bnT2:'Clean Space?',
    bnS:'Free quote in less than 1 hour. No contracts, no commitments.',
    bnCta:'Request Free Quote',
    calcBadge:'Calculator', calcT1:'Calculate Your', calcT2:'Quote Now',
    cS:'Instant quote. Select options and see the price in real time.',
    cCardT:'Configure Your Quote', cCardS:'Fill in the fields to calculate the price of your service',
    st1:'1️⃣ Service Types * (Select one or more)', st2:'2️⃣ Quantity *',
    st3:'3️⃣ Material Type *', st4:'4️⃣ Dirt Level *', st5:'5️⃣ Location *',
    stA:'📍 Full Address *', stO:'📝 Additional Notes (optional)',
    selMat:'Select material type', selDirt:'Select dirt level',
    selLoc:'Select location', selAddr:'Enter your full address',
    selObsPh:'Describe stains, mould areas, damage or other information...',
    promoA:'🎉 Active Promotion:', promoD:'discount for multiple services!',
    priceT:'Estimated Total Price', subT:'Subtotal (before discount):',
    discA:'Discount applied', finalP:'Final value with discount',
    selOpt:'Select options above to see price',
    discTip:'💡 Discounts: 10% for 2 services · 15% for 3 · 20% for 4+',
    sbBtn:'Request Service', sbNote:'Your information will be sent to suportelimpszone@gmail.com',
    fillReq:'Please fill in all required fields.',
    posL:'🏠 Number of Rooms (Post-Construction) *',
    posN:'Base value: €125.00 (1 room) + €15.00 per additional room',
    lgL:'🏡 Number of Bedrooms (General Cleaning) *',
    lgN:'💡 Automatically includes living room, kitchen, bathroom and balcony.',
    modT:'Request Service', modD:'Fill in the details to request your service with automatic price calculation.',
    fName:'Name *', fPhone:'Phone *', fEmail:'E-mail *',
    fAddr:'Full Address *', fSvc:'Service Types * (Select one or more)',
    fMat:'Material Type *', fDirt:'Dirt Level *', fDist:'Distance *', fObs:'Notes (optional)',
    phName:'Your full name', phPhone:'+351 920 000 000', phEmail:'Your e-mail',
    phAddr:'Street, number, locality, city',
    phMatSel:'Select material', phDirtSel:'Select level', phDistSel:'Select distance',
    priceTotal:'Total Price',
    ok:'✅ Request sent! We will be in touch soon.',
    err:'❌ Error sending. Please try again.',
    okBanner:'✅ Request sent successfully! We will be in touch soon.',
    faqBadge:'FAQ', faqT1:'Frequently', faqT2:'Asked Questions',
    q1:'What guarantees the quality of the service?', a1:'40-point checklist on every visit. If something is not perfect, we return within 24h at no extra cost.',
    q2:'How long has Limpszone been operating?', a2:'5 years in the market, with over 500 satisfied clients across Portugal and Europe.',
    q3:'Do I need to be present during cleaning?', a3:'No. All professionals undergo background checks. You can leave without worry.',
    q4:'How often can I book?', a4:'One-off, weekly, fortnightly or monthly. No long-term contracts or penalties.',
    ftDesc:'Professional cleaning across Europe. Quality, trust and excellence.',
    ftTag:'Cleaning you can count on.®',
    ftSvc:'Services', ftCo:'Company', ftCtc:'Contact',
    ftMF:'Monday - Friday: 7:00 - 19:00', ftSa:'Saturday: 8:00 - 17:00',
    ftSu:'Sunday: 9:00 - 15:00', ftEm:'Emergencies: 24/7',
    ftCopy:'© 2024 Limpszone. All rights reserved.',
    ftWA:'Chat on WhatsApp',
    r1i:'MS', r1n:'Maria Silva', r1r:'Restaurant Owner', r1t:'The team did a fantastic job at our restaurant. Professional, punctual and impeccable results.', r1p:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&fp-y=0.3',
    r2i:'JS', r2n:'João Santos', r2r:'Hotel Manager', r2t:'Impeccable work at the hotel. Guests always compliment the quality of the room cleaning.', r2p:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&fp-y=0.2',
    r3i:'AC', r3n:'Ana Costa', r3r:'Homeowner', r3t:'My house was left sparkling! Very attentive to all details. I recommend without hesitation.', r3p:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&fp-y=0.2',
    r4i:'RM', r4n:'Rui Mendes', r4r:'Business Owner', r4t:'Excellent post-construction clean. The office was ready to open on the same day.', r4p:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&fp-y=0.2',
    r5i:'CF', r5n:'Carla Ferreira', r5r:'Residential Client', r5t:'I hired the weekly service. The ladies are fantastic, careful and always punctual.', r5p:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&fp-y=0.2',
    r6i:'PN', r6n:'Pedro Nunes', r6r:'Building Manager', r6t:'Impeccable building maintenance. Common areas always clean. Residents very satisfied!', r6p:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&fp-y=0.2',
    r7i:'LG', r7n:'Lena Garcia', r7r:'Hotel Director', r7t:'Exceptional quality in cleaning our facilities. A partnership of total trust.', r7p:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&fp-y=0.2',
    r8i:'TR', r8n:'Tiago Rocha', r8r:'Café Owner', r8t:'Always impeccable and punctual. Customers love the cleanliness of the space. Totally recommended.', r8p:'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&fp-y=0.2',
  },
  de: {
    sub:'Professionelle Reinigung',
    n1:'Leistungen', n2:'Warum Wir', n3:'Referenzen', n4:'Kalkulator', n5:'Kontakt', nCta:'Kostenloses Angebot',
    hBadge:'Professionelle Reinigungsleistungen',
    hT1:'Ihr Raum', hT2:'Makellos,', hT3:'Wo Immer Sie Sind',
    hDesc:'Professionelle Reinigung für Wohnungen, Hotels und Gewerberäume in ganz Europa. Qualität garantiert, vertrauenswürdiges Team.',
    hS1n:'500+', hS1l:'Zufriedene Kunden', hS2n:'4.9/5', hS2l:'Bewertung',
    hCta:'Kostenloses Angebot anfordern',
    howBadge:'So Funktioniert Es', howT1:'Sauber in', howT2:'3 Einfachen Schritten',
    hw1t:'Angebot anfordern', hw1d:'Formular ausfüllen oder anrufen. Antwort in weniger als 1 Stunde.',
    hw2t:'Wir planen den Besuch', hw2d:'Wählen Sie den günstigsten Tag und die Uhrzeit. Wir kommen pünktlich.',
    hw3t:'Makelloser Raum', hw3d:'100% Zufriedenheitsgarantie — wenn Sie nicht zufrieden sind, kommen wir kostenlos zurück.',
    svcBadge:'Unsere Leistungen', svcT1:'Lösungen für', svcT2:'Jeden Raum',
    svcS:'Professionelle Reinigung für alle Raumtypen. Keine Verträge, keine Komplikationen.',
    svcCta:'Alle Leistungen & Preise ansehen',
    lm:'Mehr erfahren', rs:'Dienst anfordern',
    matT:'Verwendete Materialien:', arT:'Abgedeckte Bereiche:',
    s1t:'Haushaltsreinigung', s1d:'Komplette Reinigung von Häusern und Wohnungen',
    s2t:'Gewerbereinigung', s2d:'Desinfektion von Büros und Geschäftsräumen',
    s3t:'Restaurants & Hotels', s3d:'Spezialisierte Reinigung für Gastronomie und Hotellerie',
    s4t:'Fensterreinigung', s4d:'Professionelle Reinigung von Fenstern und Fassaden',
    s5t:'Baureinigung', s5d:'Schwere Reinigung nach Bau und Renovierungen',
    s6t:'Gebäudepflege', s6d:'Kontinuierliche Reinigung von Wohnanlagen und Gebäuden',
    whyBadge:'Warum Wir', whyT1:'Die Wahl von', whyT2:'Anspruchsvollen Kunden',
    w1t:'Vollständige Zufriedenheitsgarantie', w1d:'Wenn der Service nicht Ihren Vorstellungen entspricht, kommen wir kostenlos zurück.',
    w2t:'Geprüftes & geschultes Team', w2d:'Alle Mitarbeiter werden überprüft und speziell geschult.',
    w3t:'Personalisierte Reinigung', w3d:'Ein auf Ihren Raum, Ihre Routine und Ihr Budget zugeschnittener Plan.',
    w4t:'Einfache Terminplanung', w4d:'Angebot in weniger als 1 Stunde. Online oder telefonisch buchen.',
    wCta:'Kostenloses Angebot anfordern',
    pmBadge:'Qualität Garantiert', pmT1:'Unser Versprechen', pmT2:'der Exzellenz',
    pmD:'Wir verwenden bei jedem Besuch eine 40-Punkte-Checkliste. Wenn etwas nicht perfekt ist, korrigieren wir es kostenlos.',
    pmCta:'Mehr erfahren',
    rvBadge:'Referenzen', rvT1:'Was Unsere', rvT2:'Kunden Sagen',
    rvAll:'Alle Bewertungen ansehen',
    bnT1:'Bereit für einen Wirklich', bnT2:'Sauberen Raum?',
    bnS:'Kostenloses Angebot in weniger als 1 Stunde. Keine Verträge, keine Verpflichtungen.',
    bnCta:'Kostenloses Angebot anfordern',
    calcBadge:'Kalkulator', calcT1:'Ihr Angebot', calcT2:'Jetzt Berechnen',
    cS:'Sofortangebot. Optionen auswählen und Preis in Echtzeit sehen.',
    cCardT:'Ihr Angebot konfigurieren', cCardS:'Felder ausfüllen, um den Preis Ihres Dienstes zu berechnen',
    st1:'1️⃣ Dienstarten * (Eine oder mehrere auswählen)', st2:'2️⃣ Menge *',
    st3:'3️⃣ Materialtyp *', st4:'4️⃣ Verschmutzungsgrad *', st5:'5️⃣ Standort *',
    stA:'📍 Vollständige Adresse *', stO:'📝 Zusätzliche Hinweise (optional)',
    selMat:'Materialtyp auswählen', selDirt:'Verschmutzungsgrad auswählen',
    selLoc:'Standort auswählen', selAddr:'Vollständige Adresse eingeben',
    selObsPh:'Flecken, Schimmel, Schäden oder andere Informationen beschreiben...',
    promoA:'🎉 Aktive Aktion:', promoD:'Rabatt für mehrere Dienste!',
    priceT:'Geschätzter Gesamtpreis', subT:'Zwischensumme (ohne Rabatt):',
    discA:'Rabatt angewendet', finalP:'Endpreis mit Rabatt',
    selOpt:'Optionen auswählen, um den Preis zu sehen',
    discTip:'💡 Rabatte: 10% für 2 Dienste · 15% für 3 · 20% für 4+',
    sbBtn:'Dienst anfordern', sbNote:'Ihre Daten werden an suportelimpszone@gmail.com gesendet',
    fillReq:'Bitte alle Pflichtfelder ausfüllen.',
    posL:'🏠 Anzahl der Räume (Baureinigung) *',
    posN:'Grundpreis: 125,00€ (1 Raum) + 15,00€ pro zusätzlichem Raum',
    lgL:'🏡 Anzahl der Schlafzimmer (Generalreinigung) *',
    lgN:'💡 Beinhaltet automatisch Wohnzimmer, Küche, Bad und Balkon.',
    modT:'Dienst anfordern', modD:'Details ausfüllen, um Ihren Dienst mit automatischer Preisberechnung anzufordern.',
    fName:'Name *', fPhone:'Telefon *', fEmail:'E-Mail *',
    fAddr:'Vollständige Adresse *', fSvc:'Dienstarten * (Eine oder mehrere auswählen)',
    fMat:'Materialtyp *', fDirt:'Verschmutzungsgrad *', fDist:'Entfernung *', fObs:'Hinweise (optional)',
    phName:'Ihr vollständiger Name', phPhone:'+351 920 000 000', phEmail:'Ihre E-Mail',
    phAddr:'Straße, Nummer, Ort, Stadt',
    phMatSel:'Material auswählen', phDirtSel:'Grad auswählen', phDistSel:'Entfernung auswählen',
    priceTotal:'Gesamtpreis',
    ok:'✅ Anfrage gesendet! Wir werden uns bald melden.',
    err:'❌ Fehler beim Senden. Bitte erneut versuchen.',
    okBanner:'✅ Anfrage erfolgreich gesendet! Wir melden uns bald.',
    faqBadge:'FAQ', faqT1:'Häufig Gestellte', faqT2:'Fragen',
    q1:'Was garantiert die Qualität des Dienstes?', a1:'40-Punkte-Checkliste bei jedem Besuch. Wenn etwas nicht stimmt, kommen wir innerhalb von 24h kostenlos zurück.',
    q2:'Wie lange ist Limpszone schon tätig?', a2:'5 Jahre auf dem Markt, mit über 500 zufriedenen Kunden in Portugal und Europa.',
    q3:'Muss ich während der Reinigung anwesend sein?', a3:'Nein. Alle Mitarbeiter werden überprüft. Sie können beruhigt weggehen.',
    q4:'Wie oft kann ich buchen?', a4:'Einmalig, wöchentlich, vierzehntäglich oder monatlich. Keine Langzeitverträge.',
    ftDesc:'Professionelle Reinigung in ganz Europa. Qualität, Vertrauen und Exzellenz.',
    ftTag:'Reinigung, der Sie vertrauen können.®',
    ftSvc:'Leistungen', ftCo:'Unternehmen', ftCtc:'Kontakt',
    ftMF:'Montag - Freitag: 7:00 - 19:00', ftSa:'Samstag: 8:00 - 17:00',
    ftSu:'Sonntag: 9:00 - 15:00', ftEm:'Notfälle: 24/7',
    ftCopy:'© 2024 Limpszone. Alle Rechte vorbehalten.',
    ftWA:'Per WhatsApp chatten',
    r1i:'MS', r1n:'Maria Silva', r1r:'Restaurantbesitzerin', r1t:'Das Team hat in unserem Restaurant fantastische Arbeit geleistet. Professionell, pünktlich und makellose Ergebnisse.', r1p:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&fp-y=0.3',
    r2i:'JS', r2n:'João Santos', r2r:'Hotelmanager', r2t:'Makellose Arbeit im Hotel. Gäste loben immer die Qualität der Zimmerreinigung.', r2p:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&fp-y=0.2',
    r3i:'AC', r3n:'Ana Costa', r3r:'Hausbesitzerin', r3t:'Mein Haus glänzt! Sehr aufmerksam für alle Details. Uneingeschränkt empfohlen.', r3p:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&fp-y=0.2',
    r4i:'RM', r4n:'Rui Mendes', r4r:'Unternehmer', r4t:'Ausgezeichnete Baureinigung. Das Büro war am selben Tag eröffnungsbereit.', r4p:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&fp-y=0.2',
    r5i:'CF', r5n:'Carla Ferreira', r5r:'Privatkunde', r5t:'Ich habe den wöchentlichen Service gebucht. Die Damen sind fantastisch, sorgfältig und immer pünktlich.', r5p:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&fp-y=0.2',
    r6i:'PN', r6n:'Pedro Nunes', r6r:'Hausverwalter', r6t:'Makellose Gebäudepflege. Gemeinschaftsbereiche immer sauber. Bewohner sehr zufrieden!', r6p:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&fp-y=0.2',
    r7i:'LG', r7n:'Lena Garcia', r7r:'Hoteldirektorin', r7t:'Außergewöhnliche Qualität bei der Reinigung unserer Einrichtungen. Eine Partnerschaft voller Vertrauen.', r7p:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&fp-y=0.2',
    r8i:'TR', r8n:'Tiago Rocha', r8r:'Cafébesitzer', r8t:'Immer makellos und pünktlich. Kunden lieben die Sauberkeit des Lokals. Absolut empfohlen.', r8p:'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&fp-y=0.2',
  },
  fr: {
    sub:'Nettoyage Professionnel',
    n1:'Services', n2:'Pourquoi Nous', n3:'Témoignages', n4:'Calculateur', n5:'Contact', nCta:'Devis Gratuit',
    hBadge:'Services de Nettoyage Professionnel',
    hT1:'Votre Espace', hT2:'Impeccable,', hT3:'Où Que Vous Soyez',
    hDesc:"Nettoyage professionnel pour résidences, hôtels et espaces commerciaux dans toute l'Europe. Qualité garantie, équipe de confiance.",
    hS1n:'500+', hS1l:'Clients Satisfaits', hS2n:'4.9/5', hS2l:'Évaluation',
    hCta:'Demander un Devis Gratuit',
    howBadge:'Comment Ça Marche', howT1:'Propre en', howT2:'3 Étapes Simples',
    hw1t:'Demandez un devis', hw1d:'Remplissez le formulaire ou appelez-nous. Réponse en moins d'1 heure.',
    hw2t:'Nous planifions la visite', hw2d:"Choisissez le jour et l'heure les plus pratiques. Nous arrivons à l"heure.',
    hw3t:'Espace impeccable', hw3d:"Satisfaction 100% garantie — si vous n'êtes pas satisfait, nous revenons gratuitement.",
    svcBadge:'Nos Services', svcT1:'Solutions pour', svcT2:'Chaque Espace',
    svcS:"Nettoyage professionnel pour tous les types d'espaces. Sans contrats, sans complications.",
    svcCta:'Voir Tous les Services et Tarifs',
    lm:'En savoir plus', rs:'Demander le Service',
    matT:'Matériaux Utilisés:', arT:'Zones Couvertes:',
    s1t:'Nettoyage Résidentiel', s1d:'Nettoyage complet de maisons et appartements',
    s2t:'Nettoyage Commercial', s2d:'Désinfection de bureaux et espaces commerciaux',
    s3t:'Restaurants & Hôtels', s3d:"Nettoyage spécialisé pour l'hôtellerie et la restauration",
    s4t:'Nettoyage de Vitres', s4d:'Nettoyage professionnel de vitres et façades',
    s5t:'Après Travaux', s5d:'Nettoyage lourd après constructions et rénovations',
    s6t:"Entretien d'Immeubles", s6d:'Nettoyage continu de copropriétés et immeubles',
    whyBadge:'Pourquoi Nous', whyT1:'Le Choix de', whyT2:'Ceux Qui Exigent la Qualité',
    w1t:'Garantie de Satisfaction Totale', w1d:"Si le service ne vous convient pas, nous revenons sans frais supplémentaires.",
    w2t:'Équipe Vérifiée et Formée', w2d:'Tout le personnel passe des vérifications et une formation spécialisée.',
    w3t:'Nettoyage Personnalisé', w3d:'Un plan adapté à votre espace, routine et budget.',
    w4t:'Planification Facile', w4d:'Devis en moins d'1 heure. Réservez en ligne ou par téléphone.',
    wCta:'Demander un Devis Gratuit',
    pmBadge:'Qualité Garantie', pmT1:'Notre Promesse', pmT2:"d'Excellence",
    pmD:"Nous utilisons une liste de contrôle de 40 points à chaque visite. Si quelque chose n'est pas parfait, nous le corrigeons sans frais.",
    pmCta:'En Savoir Plus',
    rvBadge:'Témoignages', rvT1:'Ce que Disent', rvT2:'Nos Clients',
    rvAll:'Voir Tous les Avis',
    bnT1:'Prêt pour un Espace', bnT2:'Vraiment Propre?',
    bnS:'Devis gratuit en moins d'1 heure. Sans contrats, sans engagements.',
    bnCta:'Demander un Devis Gratuit',
    calcBadge:'Calculateur', calcT1:'Calculez Votre', calcT2:'Devis Maintenant',
    cS:'Devis instantané. Sélectionnez les options et voyez le prix en temps réel.',
    cCardT:'Configurez Votre Devis', cCardS:'Remplissez les champs pour calculer le prix de votre service',
    st1:'1️⃣ Types de Service * (Sélectionnez un ou plusieurs)', st2:'2️⃣ Quantité *',
    st3:'3️⃣ Type de Matériau *', st4:'4️⃣ Niveau de Saleté *', st5:'5️⃣ Localité *',
    stA:'📍 Adresse Complète *', stO:'📝 Notes Supplémentaires (facultatif)',
    selMat:'Sélectionnez le type de matériau', selDirt:'Sélectionnez le niveau de saleté',
    selLoc:'Sélectionnez la localité', selAddr:'Entrez votre adresse complète',
    selObsPh:'Décrivez les taches, zones de moisissures, dommages ou autres informations...',
    promoA:'🎉 Promotion Active:', promoD:'de réduction pour plusieurs services!',
    priceT:'Prix Total Estimé', subT:'Sous-total (sans réduction):',
    discA:'Réduction appliquée', finalP:'Valeur finale avec réduction',
    selOpt:'Sélectionnez les options pour voir le prix',
    discTip:'💡 Réductions: 10% pour 2 services · 15% pour 3 · 20% pour 4+',
    sbBtn:'Demander le Service', sbNote:'Vos informations seront envoyées à suportelimpszone@gmail.com',
    fillReq:'Veuillez remplir tous les champs obligatoires.',
    posL:'🏠 Nombre de Pièces (Après Travaux) *',
    posN:'Valeur de base: 125,00€ (1 pièce) + 15,00€ par pièce supplémentaire',
    lgL:'🏡 Nombre de Chambres (Nettoyage Général) *',
    lgN:'💡 Inclut automatiquement salon, cuisine, salle de bain et balcon.',
    modT:'Demander le Service', modD:'Remplissez les détails pour demander votre service avec calcul automatique du prix.',
    fName:'Nom *', fPhone:'Téléphone *', fEmail:'E-mail *',
    fAddr:'Adresse Complète *', fSvc:'Types de Service * (Sélectionnez un ou plusieurs)',
    fMat:'Type de Matériau *', fDirt:'Niveau de Saleté *', fDist:'Distance *', fObs:'Notes (facultatif)',
    phName:'Votre nom complet', phPhone:'+351 920 000 000', phEmail:'Votre e-mail',
    phAddr:'Rue, numéro, localité, ville',
    phMatSel:'Sélectionner le matériau', phDirtSel:'Sélectionner le niveau', phDistSel:'Sélectionner la distance',
    priceTotal:'Prix Total',
    ok:'✅ Demande envoyée! Nous vous contacterons bientôt.',
    err:"❌ Erreur d'envoi. Veuillez réessayer.",
    okBanner:'✅ Demande envoyée avec succès! Nous vous contacterons bientôt.',
    faqBadge:'FAQ', faqT1:'Questions', faqT2:'Fréquentes',
    q1:"Qu'est-ce qui garantit la qualité du service?", a1:"Liste de contrôle de 40 points à chaque visite. Si quelque chose n'est pas parfait, nous revenons sous 24h sans frais.",
    q2:'Depuis combien de temps Limpszone est-il en activité?', a2:'5 ans sur le marché, avec plus de 500 clients satisfaits au Portugal et en Europe.',
    q3:'Dois-je être présent pendant le nettoyage?', a3:"Non. Tout le personnel passe des vérifications d'antécédents. Vous pouvez partir tranquillement.",
    q4:'À quelle fréquence puis-je réserver?', a4:'Ponctuel, hebdomadaire, bimensuel ou mensuel. Sans contrats à long terme ni pénalités.',
    ftDesc:"Nettoyage professionnel dans toute l'Europe. Qualité, confiance et excellence.",
    ftTag:"Un nettoyage sur lequel vous pouvez compter.®",
    ftSvc:'Services', ftCo:'Entreprise', ftCtc:'Contact',
    ftMF:'Lundi - Vendredi: 7h00 - 19h00', ftSa:'Samedi: 8h00 - 17h00',
    ftSu:'Dimanche: 9h00 - 15h00', ftEm:'Urgences: 24/7',
    ftCopy:'© 2024 Limpszone. Tous droits réservés.',
    ftWA:'Chatter sur WhatsApp',
    r1i:'MS', r1n:'Maria Silva', r1r:'Propriétaire de Restaurant', r1t:"L'équipe a fait un travail fantastique dans notre restaurant. Professionnel, ponctuel et résultats impeccables.", r1p:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&fp-y=0.3',
    r2i:'JS', r2n:'João Santos', r2r:"Directeur d'Hôtel", r2t:"Travail impeccable à l'hôtel. Les clients louent toujours la qualité du nettoyage des chambres.", r2p:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&fp-y=0.2',
    r3i:'AC', r3n:'Ana Costa', r3r:'Propriétaire', r3t:'Ma maison brille! Très attentifs à tous les détails. Je recommande sans hésiter.', r3p:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&fp-y=0.2',
    r4i:'RM', r4n:'Rui Mendes', r4r:'Entrepreneur', r4t:"Excellent nettoyage après travaux. Le bureau était prêt à inaugurer le jour même.", r4p:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&fp-y=0.2',
    r5i:'CF', r5n:'Carla Ferreira', r5r:'Client Résidentiel', r5t:"J'ai souscrit au service hebdomadaire. Les dames sont fantastiques, soigneuses et toujours ponctuelles.", r5p:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&fp-y=0.2',
    r6i:'PN', r6n:'Pedro Nunes', r6r:"Gestionnaire d'Immeuble", r6t:"Entretien de l'immeuble impeccable. Parties communes toujours propres. Résidents très satisfaits!", r6p:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&fp-y=0.2',
    r7i:'LG', r7n:'Lena Garcia', r7r:"Directrice d'Hôtel", r7t:"Qualité exceptionnelle dans le nettoyage de nos installations. Un partenariat de totale confiance.", r7p:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&fp-y=0.2',
    r8i:'TR', r8n:'Tiago Rocha', r8r:'Propriétaire de Café', r8t:"Toujours impeccable et ponctuel. Les clients adorent la propreté de l'espace. Totalement recommandé.", r8p:'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&fp-y=0.2',
  },
  ar: {
    sub:'تنظيف احترافي',
    n1:'الخدمات', n2:'لماذا نحن', n3:'آراء العملاء', n4:'الحاسبة', n5:'التواصل', nCta:'عرض مجاني',
    hBadge:'خدمات التنظيف الاحترافي',
    hT1:'مساحتك', hT2:'لا تشوبها شائبة،', hT3:'أينما كنت',
    hDesc:'تنظيف احترافي للمنازل والفنادق والمساحات التجارية في جميع أنحاء أوروبا. جودة مضمونة، فريق موثوق.',
    hS1n:'+500', hS1l:'عميل راضٍ', hS2n:'4.9/5', hS2l:'تقييم',
    hCta:'طلب عرض مجاني',
    howBadge:'كيف يعمل', howT1:'نظيف في', howT2:'3 خطوات بسيطة',
    hw1t:'طلب عرض سعر', hw1d:'املأ النموذج أو اتصل بنا. رد في أقل من ساعة واحدة.',
    hw2t:'نحدد موعد الزيارة', hw2d:'اختر اليوم والوقت الأنسب. نصل في الموعد.',
    hw3t:'مساحة لا تشوبها شائبة', hw3d:'ضمان رضا 100٪ — إذا لم تكن راضياً، نعود مجاناً.',
    svcBadge:'خدماتنا', svcT1:'حلول لكل', svcT2:'مساحة',
    svcS:'تنظيف احترافي لجميع أنواع المساحات. بدون عقود، بدون تعقيدات.',
    svcCta:'عرض جميع الخدمات والأسعار',
    lm:'معرفة المزيد', rs:'طلب الخدمة',
    matT:'المواد المستخدمة:', arT:'المناطق المغطاة:',
    s1t:'تنظيف سكني', s1d:'تنظيف شامل للمنازل والشقق',
    s2t:'تنظيف تجاري', s2d:'تعقيم المكاتب والمساحات التجارية',
    s3t:'المطاعم والفنادق', s3d:'تنظيف متخصص لقطاع الضيافة والمطاعم',
    s4t:'تنظيف الزجاج', s4d:'تنظيف احترافي للنوافذ والواجهات',
    s5t:'تنظيف ما بعد البناء', s5d:'تنظيف مكثف بعد البناء والتجديد',
    s6t:'صيانة المباني', s6d:'تنظيف مستمر للمجمعات السكنية والمباني',
    whyBadge:'لماذا نحن', whyT1:'خيار من', whyT2:'يطلب الجودة',
    w1t:'ضمان الرضا الكامل', w1d:'إذا لم تكن راضياً عن الخدمة، نعود بدون تكلفة إضافية.',
    w2t:'فريق موثق ومدرب', w2d:'جميع الموظفين يخضعون لفحص الخلفيات والتدريب المتخصص.',
    w3t:'تنظيف مخصص', w3d:'خطة مصممة خصيصاً لمساحتك وروتينك وميزانيتك.',
    w4t:'جدولة سهلة', w4d:'عرض سعر في أقل من ساعة. احجز عبر الإنترنت أو الهاتف.',
    wCta:'طلب عرض مجاني',
    pmBadge:'جودة مضمونة', pmT1:'وعدنا', pmT2:'بالتميز',
    pmD:'نستخدم قائمة تحقق من 40 نقطة في كل زيارة. إذا لم يكن شيء مثالياً، نصلحه بدون تكلفة إضافية.',
    pmCta:'معرفة المزيد',
    rvBadge:'آراء العملاء', rvT1:'ما يقوله', rvT2:'عملاؤنا',
    rvAll:'عرض جميع التقييمات',
    bnT1:'هل أنت مستعد لمساحة', bnT2:'نظيفة حقاً؟',
    bnS:'عرض مجاني في أقل من ساعة. بدون عقود، بدون التزامات.',
    bnCta:'طلب عرض مجاني',
    calcBadge:'الحاسبة', calcT1:'احسب', calcT2:'عرضك الآن',
    cS:'عرض فوري. اختر الخيارات وشاهد السعر في الوقت الفعلي.',
    cCardT:'تكوين عرضك', cCardS:'املأ الحقول لحساب سعر خدمتك',
    st1:'1️⃣ أنواع الخدمة * (اختر واحدة أو أكثر)', st2:'2️⃣ الكمية *',
    st3:'3️⃣ نوع المادة *', st4:'4️⃣ مستوى الاتساخ *', st5:'5️⃣ الموقع *',
    stA:'📍 العنوان الكامل *', stO:'📝 ملاحظات إضافية (اختياري)',
    selMat:'اختر نوع المادة', selDirt:'اختر مستوى الاتساخ',
    selLoc:'اختر الموقع', selAddr:'أدخل عنوانك الكامل',
    selObsPh:'صف البقع أو مناطق العفن أو الأضرار أو معلومات أخرى...',
    promoA:'🎉 عرض نشط:', promoD:'خصم للخدمات المتعددة!',
    priceT:'إجمالي السعر المقدر', subT:'المجموع (قبل الخصم):',
    discA:'الخصم المطبق', finalP:'القيمة النهائية مع الخصم',
    selOpt:'اختر الخيارات أعلاه لرؤية السعر',
    discTip:'💡 خصومات: 10٪ لخدمتين · 15٪ لـ 3 · 20٪ لـ 4 أو أكثر',
    sbBtn:'طلب الخدمة', sbNote:'سيتم إرسال معلوماتك إلى suportelimpszone@gmail.com',
    fillReq:'يرجى ملء جميع الحقول المطلوبة.',
    posL:'🏠 عدد الغرف (تنظيف ما بعد البناء) *',
    posN:'القيمة الأساسية: 125.00€ (غرفة واحدة) + 15.00€ لكل غرفة إضافية',
    lgL:'🏡 عدد غرف النوم (التنظيف العام) *',
    lgN:'💡 يشمل تلقائياً غرفة المعيشة والمطبخ والحمام والشرفة.',
    modT:'طلب الخدمة', modD:'املأ التفاصيل لطلب خدمتك مع حساب تلقائي للسعر.',
    fName:'الاسم *', fPhone:'الهاتف *', fEmail:'البريد الإلكتروني *',
    fAddr:'العنوان الكامل *', fSvc:'أنواع الخدمة * (اختر واحدة أو أكثر)',
    fMat:'نوع المادة *', fDirt:'مستوى الاتساخ *', fDist:'المسافة *', fObs:'ملاحظات (اختياري)',
    phName:'اسمك الكامل', phPhone:'+351 920 000 000', phEmail:'بريدك الإلكتروني',
    phAddr:'الشارع، الرقم، المنطقة، المدينة',
    phMatSel:'اختر المادة', phDirtSel:'اختر المستوى', phDistSel:'اختر المسافة',
    priceTotal:'إجمالي السعر',
    ok:'✅ تم إرسال الطلب! سنتواصل معك قريباً.',
    err:'❌ خطأ في الإرسال. يرجى المحاولة مرة أخرى.',
    okBanner:'✅ تم إرسال الطلب بنجاح! سنتواصل معك قريباً.',
    faqBadge:'الأسئلة الشائعة', faqT1:'أسئلة', faqT2:'مكررة',
    q1:'ما الذي يضمن جودة الخدمة؟', a1:'قائمة تحقق من 40 نقطة في كل زيارة. إذا لم يكن شيء مثالياً، نعود خلال 24 ساعة بدون تكلفة.',
    q2:'كم من الوقت Limpszone في السوق؟', a2:'5 سنوات في السوق، مع أكثر من 500 عميل راضٍ في البرتغال وأوروبا.',
    q3:'هل أحتاج إلى التواجد أثناء التنظيف؟', a3:'لا. جميع الموظفين يخضعون لفحص الخلفيات. يمكنك المغادرة بأمان.',
    q4:'كم مرة يمكنني الحجز؟', a4:'مرة واحدة، أسبوعياً، كل أسبوعين أو شهرياً. بدون عقود طويلة الأجل.',
    ftDesc:'تنظيف احترافي في جميع أنحاء أوروبا. جودة، ثقة وتميز.',
    ftTag:'.تنظيف يمكنك الاعتماد عليه®',
    ftSvc:'الخدمات', ftCo:'الشركة', ftCtc:'التواصل',
    ftMF:'الاثنين - الجمعة: 7:00 - 19:00', ftSa:'السبت: 8:00 - 17:00',
    ftSu:'الأحد: 9:00 - 15:00', ftEm:'الطوارئ: 24/7',
    ftCopy:'.© 2024 Limpszone. جميع الحقوق محفوظة',
    ftWA:'الدردشة على واتساب',
    r1i:'م س', r1n:'Maria Silva', r1r:'صاحبة مطعم', r1t:'قام الفريق بعمل رائع في مطعمنا. محترف، دقيق في المواعيد ونتائج لا تشوبها شائبة.', r1p:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&fp-y=0.3',
    r2i:'ج س', r2n:'João Santos', r2r:'مدير فندق', r2t:'عمل لا تشوبه شائبة في الفندق. يثني الضيوف دائماً على جودة تنظيف الغرف.', r2p:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&fp-y=0.2',
    r3i:'أ ك', r3n:'Ana Costa', r3r:'ربة منزل', r3t:'منزلي يتألق! مهتمون جداً بكل التفاصيل. أوصي به دون تردد.', r3p:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&fp-y=0.2',
    r4i:'ر م', r4n:'Rui Mendes', r4r:'رجل أعمال', r4t:'تنظيف ممتاز بعد البناء. كان المكتب جاهزاً للافتتاح في نفس اليوم.', r4p:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&fp-y=0.2',
    r5i:'ك ف', r5n:'Carla Ferreira', r5r:'عميلة سكنية', r5t:'اشتركت في الخدمة الأسبوعية. السيدات رائعات، دقيقات ودائماً في الموعد.', r5p:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&fp-y=0.2',
    r6i:'ب ن', r6n:'Pedro Nunes', r6r:'مدير مبنى', r6t:'صيانة المبنى لا تشوبها شائبة. المناطق المشتركة نظيفة دائماً. السكان راضون جداً!', r6p:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&fp-y=0.2',
    r7i:'ل غ', r7n:'Lena Garcia', r7r:'مديرة فندق', r7t:'جودة استثنائية في تنظيف مرافقنا. شراكة من الثقة الكاملة.', r7p:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&fp-y=0.2',
    r8i:'ت ر', r8n:'Tiago Rocha', r8r:'صاحب مقهى', r8t:'دائماً لا تشوبه شائبة وفي الموعد. يحب العملاء نظافة المكان. موصى به تماماً.', r8p:'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&fp-y=0.2',
  },
  ru: {
    sub:'Профессиональная уборка',
    n1:'Услуги', n2:'Почему мы', n3:'Отзывы', n4:'Калькулятор', n5:'Контакты', nCta:'Бесплатный расчёт',
    hBadge:'Профессиональные услуги по уборке',
    hT1:'Ваше пространство', hT2:'Безупречно,', hT3:'Где бы вы ни были',
    hDesc:'Профессиональная уборка для домов, отелей и коммерческих помещений по всей Европе. Качество гарантировано, надёжная команда.',
    hS1n:'500+', hS1l:'Довольных клиентов', hS2n:'4.9/5', hS2l:'Оценка',
    hCta:'Запросить бесплатный расчёт',
    howBadge:'Как это работает', howT1:'Чисто за', howT2:'3 простых шага',
    hw1t:'Запросите расчёт', hw1d:'Заполните форму или позвоните нам. Ответ менее чем за 1 час.',
    hw2t:'Планируем визит', hw2d:'Выберите удобный день и время. Мы приедем вовремя.',
    hw3t:'Безупречное пространство', hw3d:'Гарантия удовлетворённости 100% — если вы не довольны, мы вернёмся бесплатно.',
    svcBadge:'Наши услуги', svcT1:'Решения для', svcT2:'Любого пространства',
    svcS:'Профессиональная уборка для всех типов помещений. Без контрактов, без сложностей.',
    svcCta:'Все услуги и цены',
    lm:'Узнать больше', rs:'Заказать услугу',
    matT:'Используемые материалы:', arT:'Охватываемые зоны:',
    s1t:'Уборка жилых помещений', s1d:'Полная уборка домов и квартир',
    s2t:'Уборка коммерческих помещений', s2d:'Дезинфекция офисов и коммерческих пространств',
    s3t:'Рестораны и отели', s3d:'Специализированная уборка для гостиничного и ресторанного бизнеса',
    s4t:'Мойка окон', s4d:'Профессиональная мойка окон и фасадов',
    s5t:'Уборка после строительства', s5d:'Тяжёлая уборка после строительных и ремонтных работ',
    s6t:'Обслуживание зданий', s6d:'Постоянная уборка жилых комплексов и зданий',
    whyBadge:'Почему мы', whyT1:'Выбор тех,', whyT2:'Кто ценит качество',
    w1t:'Полная гарантия удовлетворённости', w1d:'Если услуга вас не устроила, мы вернёмся без дополнительной оплаты.',
    w2t:'Проверенная и обученная команда', w2d:'Все сотрудники проходят проверку биографических данных и специальную подготовку.',
    w3t:'Персонализированная уборка', w3d:'План, адаптированный под ваше пространство, распорядок и бюджет.',
    w4t:'Простое планирование', w4d:'Расчёт менее чем за 1 час. Бронируйте онлайн или по телефону.',
    wCta:'Запросить бесплатный расчёт',
    pmBadge:'Качество гарантировано', pmT1:'Наше обещание', pmT2:'совершенства',
    pmD:'Мы используем чек-лист из 40 пунктов при каждом визите. Если что-то не идеально, мы исправим это бесплатно.',
    pmCta:'Узнать больше',
    rvBadge:'Отзывы', rvT1:'Что говорят', rvT2:'наши клиенты',
    rvAll:'Все отзывы',
    bnT1:'Готовы к по-настоящему', bnT2:'чистому пространству?',
    bnS:'Бесплатный расчёт менее чем за 1 час. Без контрактов, без обязательств.',
    bnCta:'Запросить бесплатный расчёт',
    calcBadge:'Калькулятор', calcT1:'Рассчитайте', calcT2:'стоимость сейчас',
    cS:'Мгновенный расчёт. Выберите параметры и узнайте цену в реальном времени.',
    cCardT:'Настройте расчёт', cCardS:'Заполните поля для расчёта стоимости услуги',
    st1:'1️⃣ Виды услуг * (выберите один или несколько)', st2:'2️⃣ Количество *',
    st3:'3️⃣ Тип материала *', st4:'4️⃣ Степень загрязнения *', st5:'5️⃣ Местоположение *',
    stA:'📍 Полный адрес *', stO:'📝 Дополнительные заметки (необязательно)',
    selMat:'Выберите тип материала', selDirt:'Выберите степень загрязнения',
    selLoc:'Выберите местоположение', selAddr:'Введите полный адрес',
    selObsPh:'Опишите пятна, плесень, повреждения или другую информацию...',
    promoA:'🎉 Активная акция:', promoD:'скидка на несколько услуг!',
    priceT:'Предполагаемая общая стоимость', subT:'Итого (без скидки):',
    discA:'Применённая скидка', finalP:'Итоговая стоимость со скидкой',
    selOpt:'Выберите параметры выше, чтобы увидеть цену',
    discTip:'💡 Скидки: 10% на 2 услуги · 15% на 3 · 20% на 4+',
    sbBtn:'Заказать услугу', sbNote:'Ваша информация будет отправлена на suportelimpszone@gmail.com',
    fillReq:'Пожалуйста, заполните все обязательные поля.',
    posL:'🏠 Количество комнат (уборка после строительства) *',
    posN:'Базовая стоимость: 125,00€ (1 комната) + 15,00€ за каждую дополнительную комнату',
    lgL:'🏡 Количество спален (общая уборка) *',
    lgN:'💡 Автоматически включает гостиную, кухню, ванную и балкон.',
    modT:'Заказать услугу', modD:'Заполните данные для заказа услуги с автоматическим расчётом цены.',
    fName:'Имя *', fPhone:'Телефон *', fEmail:'Эл. почта *',
    fAddr:'Полный адрес *', fSvc:'Виды услуг * (выберите один или несколько)',
    fMat:'Тип материала *', fDirt:'Степень загрязнения *', fDist:'Расстояние *', fObs:'Заметки (необязательно)',
    phName:'Ваше полное имя', phPhone:'+351 920 000 000', phEmail:'Ваш адрес эл. почты',
    phAddr:'Улица, номер, населённый пункт, город',
    phMatSel:'Выбрать материал', phDirtSel:'Выбрать уровень', phDistSel:'Выбрать расстояние',
    priceTotal:'Общая стоимость',
    ok:'✅ Запрос отправлен! Мы свяжемся с вами в ближайшее время.',
    err:'❌ Ошибка отправки. Пожалуйста, попробуйте снова.',
    okBanner:'✅ Запрос успешно отправлен! Скоро свяжемся с вами.',
    faqBadge:'FAQ', faqT1:'Часто задаваемые', faqT2:'вопросы',
    q1:'Что гарантирует качество услуги?', a1:'Чек-лист из 40 пунктов при каждом визите. Если что-то не идеально, вернёмся в течение 24 часов бесплатно.',
    q2:'Как долго Limpszone работает?', a2:'5 лет на рынке, более 500 довольных клиентов в Португалии и Европе.',
    q3:'Нужно ли мне присутствовать во время уборки?', a3:'Нет. Все сотрудники проходят проверку биографических данных. Вы можете спокойно уйти.',
    q4:'Как часто я могу заказывать?', a4:'Разово, еженедельно, раз в две недели или ежемесячно. Без долгосрочных контрактов.',
    ftDesc:'Профессиональная уборка по всей Европе. Качество, доверие и совершенство.',
    ftTag:'Уборка, которой можно доверять.®',
    ftSvc:'Услуги', ftCo:'Компания', ftCtc:'Контакты',
    ftMF:'Понедельник - Пятница: 7:00 - 19:00', ftSa:'Суббота: 8:00 - 17:00',
    ftSu:'Воскресенье: 9:00 - 15:00', ftEm:'Экстренные случаи: 24/7',
    ftCopy:'© 2024 Limpszone. Все права защищены.',
    ftWA:'Написать в WhatsApp',
    r1i:'МС', r1n:'Maria Silva', r1r:'Владелица ресторана', r1t:'Команда проделала фантастическую работу в нашем ресторане. Профессионально, пунктуально и безупречные результаты.', r1p:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&fp-y=0.3',
    r2i:'ЖС', r2n:'João Santos', r2r:'Управляющий отелем', r2t:'Безупречная работа в отеле. Гости всегда хвалят качество уборки номеров.', r2p:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&fp-y=0.2',
    r3i:'АК', r3n:'Ana Costa', r3r:'Домовладелица', r3t:'Мой дом сияет! Очень внимательны ко всем деталям. Рекомендую без колебаний.', r3p:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&fp-y=0.2',
    r4i:'РМ', r4n:'Rui Mendes', r4r:'Предприниматель', r4t:'Отличная уборка после строительства. Офис был готов к открытию в тот же день.', r4p:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&fp-y=0.2',
    r5i:'КФ', r5n:'Carla Ferreira', r5r:'Жилой клиент', r5t:'Я подписалась на еженедельный сервис. Дамы фантастические, внимательные и всегда пунктуальные.', r5p:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&fp-y=0.2',
    r6i:'ПН', r6n:'Pedro Nunes', r6r:'Управляющий зданием', r6t:'Безупречное обслуживание здания. Общие зоны всегда чистые. Жильцы очень довольны!', r6p:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&fp-y=0.2',
    r7i:'ЛГ', r7n:'Lena Garcia', r7r:'Директор отеля', r7t:'Исключительное качество уборки наших помещений. Партнёрство, которому полностью доверяем.', r7p:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&fp-y=0.2',
    r8i:'ТР', r8n:'Tiago Rocha', r8r:'Владелец кафе', r8t:'Всегда безупречно и пунктуально. Клиенты обожают чистоту заведения. Полностью рекомендую.', r8p:'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&fp-y=0.2',
  },
  it: {
    sub:'Pulizia Professionale',
    n1:'Servizi', n2:'Perché Noi', n3:'Testimonianze', n4:'Calcolatore', n5:'Contatti', nCta:'Preventivo Gratuito',
    hBadge:'Servizi di Pulizia Professionale',
    hT1:'Il Tuo Spazio', hT2:'Impeccabile,', hT3:'Dovunque Tu Sia',
    hDesc:'Pulizia professionale per abitazioni, hotel e spazi commerciali in tutta Europa. Qualità garantita, team affidabile.',
    hS1n:'500+', hS1l:'Clienti Soddisfatti', hS2n:'4.9/5', hS2l:'Valutazione',
    hCta:'Richiedi Preventivo Gratuito',
    howBadge:'Come Funziona', howT1:'Pulito in', howT2:'3 Semplici Passi',
    hw1t:'Richiedi un preventivo', hw1d:'Compila il modulo o chiamaci. Risposta in meno di 1 ora.',
    hw2t:'Pianifichiamo la visita', hw2d:"Scegli il giorno e l'ora più convenienti. Arriviamo puntuali.",
    hw3t:'Spazio impeccabile', hw3d:'Soddisfazione 100% garantita — se non sei soddisfatto, torniamo gratuitamente.',
    svcBadge:'I Nostri Servizi', svcT1:'Soluzioni per', svcT2:'Ogni Spazio',
    svcS:'Pulizia professionale per tutti i tipi di spazi. Senza contratti, senza complicazioni.',
    svcCta:'Vedi Tutti i Servizi e i Prezzi',
    lm:'Scopri di più', rs:'Richiedi Servizio',
    matT:'Materiali Utilizzati:', arT:'Aree Coperte:',
    s1t:'Pulizia Residenziale', s1d:'Pulizia completa di case e appartamenti',
    s2t:'Pulizia Commerciale', s2d:'Igienizzazione di uffici e spazi commerciali',
    s3t:'Ristoranti & Hotel', s3d:'Pulizia specializzata per ospitalità e ristorazione',
    s4t:'Pulizia Vetri', s4d:'Pulizia professionale di vetri e facciate',
    s5t:'Post-Costruzione', s5d:'Pulizia pesante dopo costruzioni e ristrutturazioni',
    s6t:'Manutenzione Edifici', s6d:'Pulizia continua di condomini ed edifici',
    whyBadge:'Perché Noi', whyT1:'La Scelta di Chi', whyT2:'Esige Qualità',
    w1t:'Garanzia di Soddisfazione Totale', w1d:'Se il servizio non è di suo gradimento, torniamo senza costi aggiuntivi.',
    w2t:'Team Verificato e Formato', w2d:'Tutto il personale viene verificato e riceve formazione specializzata.',
    w3t:'Pulizia Personalizzata', w3d:'Un piano adattato al tuo spazio, routine e budget.',
    w4t:'Pianificazione Facile', w4d:'Preventivo in meno di 1 ora. Prenota online o per telefono.',
    wCta:'Richiedi Preventivo Gratuito',
    pmBadge:'Qualità Garantita', pmT1:'La Nostra Promessa', pmT2:'di Eccellenza',
    pmD:'Utilizziamo una checklist di 40 punti ad ogni visita. Se qualcosa non è perfetto, lo correggiamo senza costi aggiuntivi.',
    pmCta:'Scopri di Più',
    rvBadge:'Testimonianze', rvT1:'Cosa Dicono', rvT2:'i Nostri Clienti',
    rvAll:'Vedi Tutte le Recensioni',
    bnT1:'Pronto per uno Spazio', bnT2:'Veramente Pulito?',
    bnS:'Preventivo gratuito in meno di 1 ora. Senza contratti, senza impegni.',
    bnCta:'Richiedi Preventivo Gratuito',
    calcBadge:'Calcolatore', calcT1:'Calcola il Tuo', calcT2:'Preventivo Ora',
    cS:'Preventivo istantaneo. Seleziona le opzioni e vedi il prezzo in tempo reale.',
    cCardT:'Configura il Tuo Preventivo', cCardS:'Compila i campi per calcolare il prezzo del tuo servizio',
    st1:'1️⃣ Tipi di Servizio * (Seleziona uno o più)', st2:'2️⃣ Quantità *',
    st3:'3️⃣ Tipo di Materiale *', st4:'4️⃣ Livello di Sporco *', st5:'5️⃣ Località *',
    stA:'📍 Indirizzo Completo *', stO:'📝 Note Aggiuntive (opzionale)',
    selMat:'Seleziona il tipo di materiale', selDirt:'Seleziona il livello di sporco',
    selLoc:'Seleziona la località', selAddr:'Inserisci il tuo indirizzo completo',
    selObsPh:'Descrivi macchie, zone di muffa, danni o altre informazioni...',
    promoA:'🎉 Promozione Attiva:', promoD:'di sconto per servizi multipli!',
    priceT:'Prezzo Totale Stimato', subT:'Subtotale (senza sconto):',
    discA:'Sconto applicato', finalP:'Valore finale con sconto',
    selOpt:'Seleziona le opzioni per vedere il prezzo',
    discTip:'💡 Sconti: 10% per 2 servizi · 15% per 3 · 20% per 4+',
    sbBtn:'Richiedi Servizio', sbNote:'Le tue informazioni saranno inviate a suportelimpszone@gmail.com',
    fillReq:'Si prega di compilare tutti i campi obbligatori.',
    posL:'🏠 Numero di Vani (Post-Costruzione) *',
    posN:'Valore base: 125,00€ (1 vano) + 15,00€ per ogni vano aggiuntivo',
    lgL:'🏡 Numero di Camere da Letto (Pulizia Generale) *',
    lgN:'💡 Include automaticamente soggiorno, cucina, bagno e balcone.',
    modT:'Richiedi Servizio', modD:'Compila i dettagli per richiedere il tuo servizio con calcolo automatico del prezzo.',
    fName:'Nome *', fPhone:'Telefono *', fEmail:'E-mail *',
    fAddr:'Indirizzo Completo *', fSvc:'Tipi di Servizio * (Seleziona uno o più)',
    fMat:'Tipo di Materiale *', fDirt:'Livello di Sporco *', fDist:'Distanza *', fObs:'Note (opzionale)',
    phName:'Il tuo nome completo', phPhone:'+351 920 000 000', phEmail:'La tua e-mail',
    phAddr:'Via, numero, località, città',
    phMatSel:'Seleziona materiale', phDirtSel:'Seleziona livello', phDistSel:'Seleziona distanza',
    priceTotal:'Prezzo Totale',
    ok:'✅ Richiesta inviata! Ti contatteremo presto.',
    err:'❌ Errore di invio. Riprova.',
    okBanner:'✅ Richiesta inviata con successo! Ti contatteremo presto.',
    faqBadge:'FAQ', faqT1:'Domande', faqT2:'Frequenti',
    q1:'Cosa garantisce la qualità del servizio?', a1:'Checklist di 40 punti ad ogni visita. Se qualcosa non è perfetto, torniamo entro 24h senza costi aggiuntivi.',
    q2:'Da quanto tempo è attivo Limpszone?', a2:'5 anni sul mercato, con oltre 500 clienti soddisfatti in Portogallo e in Europa.',
    q3:'Devo essere presente durante la pulizia?', a3:'No. Tutto il personale viene verificato. Puoi andare tranquillamente.',
    q4:'Con quale frequenza posso prenotare?', a4:'Occasionalmente, settimanalmente, quindicinalmente o mensilmente. Senza contratti a lungo termine.',
    ftDesc:'Pulizia professionale in tutta Europa. Qualità, fiducia ed eccellenza.',
    ftTag:'Una pulizia su cui puoi contare.®',
    ftSvc:'Servizi', ftCo:'Azienda', ftCtc:'Contatti',
    ftMF:'Lunedì - Venerdì: 7:00 - 19:00', ftSa:'Sabato: 8:00 - 17:00',
    ftSu:'Domenica: 9:00 - 15:00', ftEm:'Emergenze: 24/7',
    ftCopy:'© 2024 Limpszone. Tutti i diritti riservati.',
    ftWA:'Chatta su WhatsApp',
    r1i:'MS', r1n:'Maria Silva', r1r:'Proprietaria di Ristorante', r1t:'Il team ha fatto un lavoro fantastico nel nostro ristorante. Professionale, puntuale e risultati impeccabili.', r1p:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&fp-y=0.3',
    r2i:'JS', r2n:'João Santos', r2r:'Direttore di Hotel', r2t:"Lavoro impeccabile nell'hotel. Gli ospiti lodano sempre la qualità della pulizia delle camere.", r2p:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&fp-y=0.2',
    r3i:'AC', r3n:'Ana Costa', r3r:'Proprietaria di Casa', r3t:'La mia casa brilla! Molto attenti a tutti i dettagli. Raccomando senza esitazione.', r3p:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&fp-y=0.2',
    r4i:'RM', r4n:'Rui Mendes', r4r:'Imprenditore', r4t:'Eccellente pulizia post-costruzione. Lo studio era pronto per inaugurare lo stesso giorno.', r4p:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&fp-y=0.2',
    r5i:'CF', r5n:'Carla Ferreira', r5r:'Cliente Residenziale', r5t:'Ho sottoscritto il servizio settimanale. Le signore sono fantastiche, attente e sempre puntuali.', r5p:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&fp-y=0.2',
    r6i:'PN', r6n:'Pedro Nunes', r6r:'Amministratore di Condominio', r6t:'Manutenzione del condominio impeccabile. Aree comuni sempre pulite. Residenti molto soddisfatti!', r6p:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&fp-y=0.2',
    r7i:'LG', r7n:'Lena Garcia', r7r:'Direttrice di Hotel', r7t:'Qualità eccezionale nella pulizia delle nostre strutture. Una partnership di totale fiducia.', r7p:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&fp-y=0.2',
    r8i:'TR', r8n:'Tiago Rocha', r8r:'Proprietario di Bar', r8t:'Sempre impeccabile e puntuale. I clienti adorano la pulizia del locale. Assolutamente raccomandato.', r8p:'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&fp-y=0.2',
  },
  zh: {
    sub:'专业清洁服务',
    n1:'服务', n2:'为何选择我们', n3:'客户评价', n4:'报价计算器', n5:'联系我们', nCta:'免费报价',
    hBadge:'专业清洁服务',
    hT1:'您的空间', hT2:'一尘不染，', hT3:'无论您身在何处',
    hDesc:'为整个欧洲的住宅、酒店和商业空间提供专业清洁服务。质量保证，值得信赖的团队。',
    hS1n:'500+', hS1l:'满意客户', hS2n:'4.9/5', hS2l:'评分',
    hCta:'申请免费报价',
    howBadge:'工作流程', howT1:'简单', howT2:'3步完成清洁',
    hw1t:'申请报价', hw1d:'填写表格或致电我们。1小时内回复。',
    hw2t:'安排上门服务', hw2d:'选择最方便的日期和时间。我们准时到达。',
    hw3t:'完美清洁空间', hw3d:'100%满意保证 — 如果您不满意，我们免费返工。',
    svcBadge:'我们的服务', svcT1:'适合', svcT2:'各类空间的解决方案',
    svcS:'为所有类型空间提供专业清洁。无需合同，无任何复杂手续。',
    svcCta:'查看所有服务和价格',
    lm:'了解更多', rs:'申请服务',
    matT:'使用材料：', arT:'服务区域：',
    s1t:'住宅清洁', s1d:'房屋和公寓的全面清洁',
    s2t:'商业清洁', s2d:'办公室和商业空间的消毒清洁',
    s3t:'餐厅和酒店', s3d:'为餐饮和酒店业提供专业清洁',
    s4t:'玻璃清洁', s4d:'专业清洁窗户和外立面',
    s5t:'施工后清洁', s5d:'建筑和装修后的深度清洁',
    s6t:'楼宇维护', s6d:'公寓楼和建筑物的持续清洁',
    whyBadge:'为何选择我们', whyT1:'追求品质者', whyT2:'的首选',
    w1t:'完全满意保证', w1d:'如果服务不符合您的期望，我们将免费返工。',
    w2t:'经过验证的专业团队', w2d:'所有员工均经过背景调查和专业培训。',
    w3t:'个性化清洁方案', w3d:'根据您的空间、日程和预算定制方案。',
    w4t:'轻松预约', w4d:'1小时内提供报价。在线或电话预约。',
    wCta:'申请免费报价',
    pmBadge:'质量保证', pmT1:'我们的承诺', pmT2:'追求卓越',
    pmD:'每次上门服务使用40点检查清单。如有任何不完美之处，我们将免费修正。',
    pmCta:'了解更多',
    rvBadge:'客户评价', rvT1:'客户', rvT2:'怎么说',
    rvAll:'查看所有评价',
    bnT1:'准备好迎接真正', bnT2:'干净的空间了吗？',
    bnS:'1小时内免费报价。无合同，无承诺。',
    bnCta:'申请免费报价',
    calcBadge:'报价计算器', calcT1:'立即计算', calcT2:'您的报价',
    cS:'即时报价。选择选项，实时查看价格。',
    cCardT:'配置您的报价', cCardS:'填写字段以计算您服务的价格',
    st1:'1️⃣ 服务类型 *（选择一项或多项）', st2:'2️⃣ 数量 *',
    st3:'3️⃣ 材料类型 *', st4:'4️⃣ 污染程度 *', st5:'5️⃣ 位置 *',
    stA:'📍 完整地址 *', stO:'📝 其他备注（可选）',
    selMat:'选择材料类型', selDirt:'选择污染程度',
    selLoc:'选择位置', selAddr:'输入您的完整地址',
    selObsPh:'描述污渍、霉菌区域、损坏或其他信息...',
    promoA:'🎉 当前优惠：', promoD:'多项服务折扣！',
    priceT:'预估总价', subT:'小计（折扣前）：',
    discA:'已应用折扣', finalP:'折扣后最终价格',
    selOpt:'请选择以上选项以查看价格',
    discTip:'💡 折扣：2项服务9折 · 3项8.5折 · 4项及以上8折',
    sbBtn:'申请服务', sbNote:'您的信息将发送至 suportelimpszone@gmail.com',
    fillReq:'请填写所有必填字段。',
    posL:'🏠 房间数量（施工后清洁）*',
    posN:'基础价格：125.00€（1间）+ 每间额外15.00€',
    lgL:'🏡 卧室数量（全面清洁）*',
    lgN:'💡 自动包含客厅、厨房、浴室和阳台。',
    modT:'申请服务', modD:'填写详情以申请服务并自动计算价格。',
    fName:'姓名 *', fPhone:'电话 *', fEmail:'电子邮件 *',
    fAddr:'完整地址 *', fSvc:'服务类型 *（选择一项或多项）',
    fMat:'材料类型 *', fDirt:'污染程度 *', fDist:'距离 *', fObs:'备注（可选）',
    phName:'您的全名', phPhone:'+351 920 000 000', phEmail:'您的电子邮件',
    phAddr:'街道、门牌号、地区、城市',
    phMatSel:'选择材料', phDirtSel:'选择级别', phDistSel:'选择距离',
    priceTotal:'总价',
    ok:'✅ 申请已发送！我们很快会与您联系。',
    err:'❌ 发送错误。请重试。',
    okBanner:'✅ 申请发送成功！我们很快会与您联系。',
    faqBadge:'常见问题', faqT1:'常见', faqT2:'问题解答',
    q1:'什么保证服务质量？', a1:'每次上门使用40点检查清单。如有不完美之处，24小时内免费返工。',
    q2:'Limpszone经营多久了？', a2:'已在市场经营5年，在葡萄牙和欧洲拥有500多名满意客户。',
    q3:'清洁期间需要在场吗？', a3:'不需要。所有员工均经过背景调查。您可以放心离开。',
    q4:'我可以多久预约一次？', a4:'一次性、每周、每两周或每月。无长期合同或违约金。',
    ftDesc:'为整个欧洲提供专业清洁服务。品质、信任与卓越。',
    ftTag:'值得信赖的清洁服务。®',
    ftSvc:'服务', ftCo:'公司', ftCtc:'联系方式',
    ftMF:'周一至周五：7:00 - 19:00', ftSa:'周六：8:00 - 17:00',
    ftSu:'周日：9:00 - 15:00', ftEm:'紧急情况：24/7',
    ftCopy:'© 2024 Limpszone. 版权所有。',
    ftWA:'WhatsApp联系',
    r1i:'MS', r1n:'Maria Silva', r1r:'餐厅老板', r1t:'团队在我们餐厅做了出色的工作。专业、守时、结果无可挑剔。', r1p:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&fp-y=0.3',
    r2i:'JS', r2n:'João Santos', r2r:'酒店经理', r2t:'在酒店的工作无可挑剔。客人总是称赞客房清洁的质量。', r2p:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&fp-y=0.2',
    r3i:'AC', r3n:'Ana Costa', r3r:'房主', r3t:'我的房子闪闪发亮！非常注重每个细节。毫不犹豫地推荐。', r3p:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&fp-y=0.2',
    r4i:'RM', r4n:'Rui Mendes', r4r:'企业家', r4t:'优秀的施工后清洁。办公室当天就准备好开业了。', r4p:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&fp-y=0.2',
    r5i:'CF', r5n:'Carla Ferreira', r5r:'住宅客户', r5t:'订阅了每周服务。女士们非常棒，细心且总是准时。', r5p:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&fp-y=0.2',
    r6i:'PN', r6n:'Pedro Nunes', r6r:'楼宇管理员', r6t:'楼宇维护无可挑剔。公共区域始终整洁。住户非常满意！', r6p:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&fp-y=0.2',
    r7i:'LG', r7n:'Lena Garcia', r7r:'酒店总监', r7t:'我们设施清洁质量卓越。完全信赖的合作伙伴关系。', r7p:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&fp-y=0.2',
    r8i:'TR', r8n:'Tiago Rocha', r8r:'咖啡馆老板', r8t:'始终无可挑剔且守时。客人喜欢这里的整洁。完全推荐。', r8p:'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&fp-y=0.2',
  },
  ro: {
    sub:'Curățenie Profesională',
    n1:'Servicii', n2:'De ce Noi', n3:'Testimoniale', n4:'Calculator', n5:'Contact', nCta:'Ofertă Gratuită',
    hBadge:'Servicii de Curățenie Profesională',
    hT1:'Spațiul Tău', hT2:'Impecabil,', hT3:'Oriunde Te-ai Afla',
    hDesc:'Curățenie profesională pentru locuințe, hoteluri și spații comerciale din toată Europa. Calitate garantată, echipă de încredere.',
    hS1n:'500+', hS1l:'Clienți Mulțumiți', hS2n:'4.9/5', hS2l:'Evaluare',
    hCta:'Solicită Ofertă Gratuită',
    howBadge:'Cum Funcționează', howT1:'Curat în', howT2:'3 Pași Simpli',
    hw1t:'Solicită o ofertă', hw1d:'Completează formularul sau sună-ne. Răspuns în mai puțin de 1 oră.',
    hw2t:'Programăm vizita', hw2d:'Alege ziua și ora cea mai convenabilă. Ajungem punctual.',
    hw3t:'Spațiu impecabil', hw3d:'Satisfacție 100% garantată — dacă nu ești mulțumit, revenim gratuit.',
    svcBadge:'Serviciile Noastre', svcT1:'Soluții pentru', svcT2:'Orice Spațiu',
    svcS:'Curățenie profesională pentru toate tipurile de spații. Fără contracte, fără complicații.',
    svcCta:'Vezi Toate Serviciile și Prețurile',
    lm:'Află mai multe', rs:'Solicită Serviciu',
    matT:'Materiale Utilizate:', arT:'Zone Acoperite:',
    s1t:'Curățenie Rezidențială', s1d:'Curățenie completă a caselor și apartamentelor',
    s2t:'Curățenie Comercială', s2d:'Igienizarea birourilor și spațiilor comerciale',
    s3t:'Restaurante & Hoteluri', s3d:'Curățenie specializată pentru ospitalitate și restaurație',
    s4t:'Curățenie Geamuri', s4d:'Curățenie profesională a geamurilor și fațadelor',
    s5t:'Post-Construcție', s5d:'Curățenie grea după construcții și renovări',
    s6t:'Întreținere Clădiri', s6d:'Curățenie continuă a condominiilor și clădirilor',
    whyBadge:'De ce Noi', whyT1:'Alegerea Celor', whyT2:'Care Cer Calitate',
    w1t:'Garanție Totală de Satisfacție', w1d:'Dacă serviciul nu este pe placul tău, revenim fără costuri suplimentare.',
    w2t:'Echipă Verificată și Instruită', w2d:'Toți angajații trec prin verificări de antecedente și formare specializată.',
    w3t:'Curățenie Personalizată', w3d:'Un plan adaptat spațiului, rutinei și bugetului tău.',
    w4t:'Programare Ușoară', w4d:'Ofertă în mai puțin de 1 oră. Rezervă online sau telefonic.',
    wCta:'Solicită Ofertă Gratuită',
    pmBadge:'Calitate Garantată', pmT1:'Promisiunea', pmT2:'Noastră de Excelență',
    pmD:'Folosim o listă de verificare de 40 de puncte la fiecare vizită. Dacă ceva nu este perfect, corectăm fără costuri suplimentare.',
    pmCta:'Află Mai Multe',
    rvBadge:'Testimoniale', rvT1:'Ce Spun', rvT2:'Clienții Noștri',
    rvAll:'Vezi Toate Recenziile',
    bnT1:'Pregătit pentru un Spațiu', bnT2:'Cu Adevărat Curat?',
    bnS:'Ofertă gratuită în mai puțin de 1 oră. Fără contracte, fără angajamente.',
    bnCta:'Solicită Ofertă Gratuită',
    calcBadge:'Calculator', calcT1:'Calculează', calcT2:'Oferta Ta Acum',
    cS:'Ofertă instantanee. Selectează opțiunile și vezi prețul în timp real.',
    cCardT:'Configurează Oferta Ta', cCardS:'Completează câmpurile pentru a calcula prețul serviciului tău',
    st1:'1️⃣ Tipuri de Servicii * (Selectează unul sau mai multe)', st2:'2️⃣ Cantitate *',
    st3:'3️⃣ Tip de Material *', st4:'4️⃣ Nivel de Murdărie *', st5:'5️⃣ Localitate *',
    stA:'📍 Adresă Completă *', stO:'📝 Note Suplimentare (opțional)',
    selMat:'Selectează tipul de material', selDirt:'Selectează nivelul de murdărie',
    selLoc:'Selectează localitatea', selAddr:'Introdu adresa completă',
    selObsPh:'Descrie pete, zone cu mucegai, daune sau alte informații...',
    promoA:'🎉 Promoție Activă:', promoD:'reducere pentru servicii multiple!',
    priceT:'Preț Total Estimat', subT:'Subtotal (fără reducere):',
    discA:'Reducere aplicată', finalP:'Valoare finală cu reducere',
    selOpt:'Selectează opțiunile de mai sus pentru a vedea prețul',
    discTip:'💡 Reduceri: 10% pentru 2 servicii · 15% pentru 3 · 20% pentru 4+',
    sbBtn:'Solicită Serviciu', sbNote:'Informațiile tale vor fi trimise la suportelimpszone@gmail.com',
    fillReq:'Te rugăm să completezi toate câmpurile obligatorii.',
    posL:'🏠 Număr de Camere (Post-Construcție) *',
    posN:'Valoare de bază: 125,00€ (1 cameră) + 15,00€ per cameră suplimentară',
    lgL:'🏡 Număr de Dormitoare (Curățenie Generală) *',
    lgN:'💡 Include automat sufrageria, bucătăria, baia și balconul.',
    modT:'Solicită Serviciu', modD:'Completează detaliile pentru a solicita serviciul cu calcul automat al prețului.',
    fName:'Nume *', fPhone:'Telefon *', fEmail:'E-mail *',
    fAddr:'Adresă Completă *', fSvc:'Tipuri de Servicii * (Selectează unul sau mai multe)',
    fMat:'Tip de Material *', fDirt:'Nivel de Murdărie *', fDist:'Distanță *', fObs:'Note (opțional)',
    phName:'Numele tău complet', phPhone:'+351 920 000 000', phEmail:'E-mailul tău',
    phAddr:'Stradă, număr, localitate, oraș',
    phMatSel:'Selectează materialul', phDirtSel:'Selectează nivelul', phDistSel:'Selectează distanța',
    priceTotal:'Preț Total',
    ok:'✅ Solicitare trimisă! Te vom contacta în curând.',
    err:'❌ Eroare la trimitere. Te rugăm să încerci din nou.',
    okBanner:'✅ Solicitare trimisă cu succes! Te vom contacta în curând.',
    faqBadge:'FAQ', faqT1:'Întrebări', faqT2:'Frecvente',
    q1:'Ce garantează calitatea serviciului?', a1:'Listă de verificare de 40 de puncte la fiecare vizită. Dacă ceva nu este perfect, revenim în 24h fără costuri.',
    q2:'De cât timp activează Limpszone?', a2:'5 ani pe piață, cu peste 500 de clienți mulțumiți în Portugalia și Europa.',
    q3:'Trebuie să fiu prezent în timpul curățeniei?', a3:'Nu. Toți profesioniștii trec prin verificări de antecedente. Poți pleca liniștit.',
    q4:'Cât de des pot rezerva?', a4:'Ocazional, săptămânal, bilunar sau lunar. Fără contracte pe termen lung.',
    ftDesc:'Curățenie profesională în toată Europa. Calitate, încredere și excelență.',
    ftTag:'O curățenie în care poți avea încredere.®',
    ftSvc:'Servicii', ftCo:'Companie', ftCtc:'Contact',
    ftMF:'Luni - Vineri: 7:00 - 19:00', ftSa:'Sâmbătă: 8:00 - 17:00',
    ftSu:'Duminică: 9:00 - 15:00', ftEm:'Urgențe: 24/7',
    ftCopy:'© 2024 Limpszone. Toate drepturile rezervate.',
    ftWA:'Scrie pe WhatsApp',
    r1i:'MS', r1n:'Maria Silva', r1r:'Proprietară de Restaurant', r1t:'Echipa a făcut o treabă fantastică în restaurantul nostru. Profesionistă, punctuală și rezultate impecabile.', r1p:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&fp-y=0.3',
    r2i:'JS', r2n:'João Santos', r2r:'Manager de Hotel', r2t:'Muncă impecabilă la hotel. Clienții laudă mereu calitatea curățeniei camerelor.', r2p:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&fp-y=0.2',
    r3i:'AC', r3n:'Ana Costa', r3r:'Proprietară de Casă', r3t:'Casa mea strălucește! Foarte atenți la toate detaliile. Recomand fără ezitare.', r3p:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&fp-y=0.2',
    r4i:'RM', r4n:'Rui Mendes', r4r:'Antreprenor', r4t:'Curățenie excelentă post-construcție. Biroul era gata de inaugurare în aceeași zi.', r4p:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&fp-y=0.2',
    r5i:'CF', r5n:'Carla Ferreira', r5r:'Client Rezidențial', r5t:'Am contractat serviciul săptămânal. Doamnele sunt fantastice, grijulii și mereu punctuale.', r5p:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&fp-y=0.2',
    r6i:'PN', r6n:'Pedro Nunes', r6r:'Administrator de Bloc', r6t:'Întreținerea blocului impecabilă. Zone comune mereu curate. Locatari foarte mulțumiți!', r6p:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&fp-y=0.2',
    r7i:'LG', r7n:'Lena Garcia', r7r:'Director de Hotel', r7t:'Calitate excepțională în curățenia instalațiilor noastre. Un parteneriat de totală încredere.', r7p:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&fp-y=0.2',
    r8i:'TR', r8n:'Tiago Rocha', r8r:'Proprietar de Cafenea', r8t:'Mereu impecabil și punctual. Clienții adoră curățenia spațiului. Complet recomandat.', r8p:'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&fp-y=0.2',
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
      const nl = navigator.language?.toLowerCase() || 'pt'
      if (nl.startsWith('es')) setLang('es')
      else if (nl.startsWith('en')) setLang('en')
      else if (nl.startsWith('de')) setLang('de')
      else if (nl.startsWith('fr')) setLang('fr')
      else if (nl.startsWith('ar')) setLang('ar')
      else if (nl.startsWith('ru')) setLang('ru')
      else if (nl.startsWith('it')) setLang('it')
      else if (nl.startsWith('zh')) setLang('zh')
      else if (nl.startsWith('ro')) setLang('ro')
      else setLang('pt')
  }, [])

  // Close lang menu on outside click
  useEffect(() => {
    const handler = () => setShowLangMenu(false)
    if (showLangMenu) document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [showLangMenu])

  // Inject global CSS
  useEffect(() => {
    if (document.getElementById('lz-g')) return
    const s = document.createElement('style')
    s.id = 'lz-g'; s.textContent = GLOBAL_CSS
    document.head.appendChild(s)
  }, [])

  const T = TR[lang]
  const es = lang === 'es'
  const isRTL = lang === 'ar'
  const LANG_FLAGS: Record<string, string> = {
    pt:'🇵🇹', es:'🇪🇸', en:'🇬🇧', de:'🇩🇪', fr:'🇫🇷',
    ar:'🇸🇦', ru:'🇷🇺', it:'🇮🇹', zh:'🇨🇳', ro:'🇷🇴'
  }
  const LANG_NAMES: Record<string, string> = {
    pt:'PT', es:'ES', en:'EN', de:'DE', fr:'FR',
    ar:'AR', ru:'RU', it:'IT', zh:'ZH', ro:'RO'
  }
  const ALL_LANGS: Lang[] = ['pt','es','en','de','fr','ar','ru','it','zh','ro']
  const [showLangMenu, setShowLangMenu] = useState(false)

  // Reviews
  const reviews = [1,2,3,4,5,6,7,8].map(i => ({
    init:T[`r${i}i`], name:T[`r${i}n`], role:T[`r${i}r`], text:T[`r${i}t`], photo:T[`r${i}p`]
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
  const neighborhoods = lang !== 'pt' ? [
    { id:'centro',    name:'Centro ciudad',  multiplier:1.0  },
    { id:'madrid',    name:'Madrid',         multiplier:1.0  },
    { id:'barcelona', name:'Barcelona',      multiplier:1.0  },
    { id:'valencia',  name:'Valencia',       multiplier:1.05 },
    { id:'sevilla',   name:'Sevilla',        multiplier:1.05 },
    { id:'bilbao',    name:'Bilbao',         multiplier:1.10 },
    { id:'malaga',    name:'Málaga',         multiplier:1.10 },
    { id:'zaragoza',  name:'Zaragoza',       multiplier:1.15 },
    { id:'alicante',  name:'Alicante',       multiplier:1.15 },
    { id:'murcia',    name:'Murcia',         multiplier:1.15 },
    { id:'otro',      name:'Otra localidad', multiplier:1.10 },
  ] : [
    { id:'centro',  name:'Centro',           multiplier:1.0  },
    { id:'lisboa',  name:'Lisboa',           multiplier:1.0  },
    { id:'porto',   name:'Porto',            multiplier:1.0  },
    { id:'cascais', name:'Cascais',          multiplier:1.05 },
    { id:'sintra',  name:'Sintra',           multiplier:1.05 },
    { id:'oeiras',  name:'Oeiras',           multiplier:1.10 },
    { id:'almada',  name:'Almada',           multiplier:1.15 },
    { id:'setubal', name:'Setúbal',          multiplier:1.20 },
    { id:'braga',   name:'Braga',            multiplier:1.20 },
    { id:'outro',   name:'Outra localidade', multiplier:1.10 },
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
    <div className="min-h-screen" style={{background:C.iceBg,fontFamily:"'Nunito Sans','Inter',sans-serif",color:C.text,direction:isRTL?'rtl':'ltr'}}>

      {showOk&&(
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle className="h-5 w-5"/><span className="font-semibold">{T.okBanner}</span>
        </div>
      )}

      {/* ══ HEADER ══ */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50" style={{borderColor:C.border}}>
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <img src="/logo.png" alt="Limpszone" style={{height:'50px',width:'180px',objectFit:'contain',mixBlendMode:'multiply'}}/>
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
            <a href="tel:+351934071930" className="text-base font-black hidden md:block" style={{color:C.blue}}>+351 934 071 930</a>
            {/* Language Selector */}
            <div className="relative">
              <button onClick={()=>setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-bold transition-all hover:shadow-sm"
                style={{borderColor:C.border,background:C.iceBg,color:C.navy}}>
                <span style={{fontSize:'16px'}}>{LANG_FLAGS[lang]}</span>
                <span>{LANG_NAMES[lang]}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{transform:showLangMenu?'rotate(180deg)':'none',transition:'0.2s'}}>
                  <path d="M2 4l4 4 4-4" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {showLangMenu&&(
                <div className="absolute right-0 top-full mt-1 rounded-xl shadow-xl border overflow-hidden z-50"
                  style={{background:'#fff',borderColor:C.border,minWidth:'140px'}}>
                  {ALL_LANGS.map(l=>(
                    <button key={l} onClick={()=>{setLang(l);setShowLangMenu(false)}}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors text-left"
                      style={{background:l===lang?C.iceMid:'#fff',fontWeight:l===lang?700:400,color:C.navy}}>
                      <span style={{fontSize:'16px'}}>{LANG_FLAGS[l]}</span>
                      <span>{LANG_NAMES[l]}</span>
                      {l===lang&&<span className="ml-auto text-xs" style={{color:C.blue}}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
              <img src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&h=500&fit=crop&fp-y=0.2"
                alt="Equipa de limpeza profissional" className="w-full object-cover rounded-2xl shadow-xl" style={{maxHeight:440}}/>
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

      {/* ══ TRUST & SOCIAL PROOF ══ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">

          {/* Google Reviews bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border mb-14" style={{background:'#f8faff',borderColor:C.border}}>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl shadow-md" style={{background:'#fff',border:`1.5px solid ${C.border}`}}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M29.09 16.32c0-1.01-.09-1.98-.25-2.91H16v5.51h7.35a6.28 6.28 0 0 1-2.72 4.12v3.42h4.4c2.58-2.37 4.06-5.87 4.06-10.14z" fill="#4285F4"/>
                  <path d="M16 30c3.69 0 6.79-1.22 9.05-3.31l-4.4-3.42c-1.22.82-2.79 1.31-4.65 1.31-3.57 0-6.6-2.41-7.68-5.65H3.77v3.53A13.99 13.99 0 0 0 16 30z" fill="#34A853"/>
                  <path d="M8.32 18.93A8.39 8.39 0 0 1 7.88 16c0-1.02.17-2 .44-2.93V9.54H3.77A14 14 0 0 0 2 16c0 2.26.54 4.4 1.77 6.46l4.55-3.53z" fill="#FBBC05"/>
                  <path d="M16 6.41c2.01 0 3.82.69 5.24 2.05l3.93-3.93C22.78 2.37 19.68 1 16 1A13.99 13.99 0 0 0 3.77 9.54l4.55 3.53C9.4 9.82 12.43 6.41 16 6.41z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{color:C.muted}}>Google Reviews</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">{[...Array(5)].map((_,j)=><Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400"/>)}</div>
                  <span className="text-2xl font-black" style={{color:C.navy}}>4.9</span>
                  <span className="text-sm font-semibold" style={{color:C.muted}}>(127 avaliações)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-black" style={{color:C.blue}}>500+</p>
                <p className="text-xs font-semibold" style={{color:C.muted}}>Clientes</p>
              </div>
              <div className="w-px h-10" style={{background:C.border}}/>
              <div className="text-center">
                <p className="text-3xl font-black" style={{color:C.blue}}>5★</p>
                <p className="text-xs font-semibold" style={{color:C.muted}}>Avaliação Média</p>
              </div>
              <div className="w-px h-10" style={{background:C.border}}/>
              <div className="text-center">
                <p className="text-3xl font-black" style={{color:C.blue}}>98%</p>
                <p className="text-xs font-semibold" style={{color:C.muted}}>Satisfação</p>
              </div>
            </div>
          </div>

          {/* Premium icon trust items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {[
              {
                icon: (
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="17" stroke={C.blue} strokeWidth="1.5"/>
                    <path d="M12 18.5L16 22.5L24 14" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: es ? 'Garantía Total' : 'Garantia Total',
                desc: es ? 'Si no queda perfecto, volvemos gratis' : 'Se não ficar perfeito, voltamos de graça'
              },
              {
                icon: (
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <path d="M18 4L21.5 13.5H32L23.5 19.5L27 29L18 23L9 29L12.5 19.5L4 13.5H14.5L18 4Z" stroke={C.blue} strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                ),
                title: es ? 'Profesionales Certificados' : 'Profissionais Certificados',
                desc: es ? 'Equipo seleccionado y formado' : 'Equipa selecionada e treinada'
              },
              {
                icon: (
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <rect x="4" y="8" width="28" height="20" rx="4" stroke={C.blue} strokeWidth="1.5"/>
                    <path d="M4 14H32" stroke={C.blue} strokeWidth="1.5"/>
                    <path d="M10 20H16M10 24H20" stroke={C.blue} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                title: es ? 'Sin Contratos' : 'Sem Contratos',
                desc: es ? 'Flexibilidad total, cancele cuando quiera' : 'Total flexibilidade, cancele quando quiser'
              },
              {
                icon: (
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="14" stroke={C.blue} strokeWidth="1.5"/>
                    <path d="M18 10V18L23 21" stroke={C.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: es ? 'Respuesta en 1h' : 'Resposta em 1h',
                desc: es ? 'Presupuesto inmediato, sin esperas' : 'Orçamento imediato, sem esperas'
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-1" style={{background:C.iceBg,borderColor:C.border}}>
                <div className="mb-4 p-3 rounded-2xl" style={{background:'#dbeafe'}}>
                  {item.icon}
                </div>
                <p className="font-black text-base mb-2" style={{color:C.navy}}>{item.title}</p>
                <p className="text-xs leading-relaxed" style={{color:C.muted}}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Mini screenshots / SEO proof */}
          <div className="rounded-2xl p-8 border" style={{background:C.iceMid,borderColor:C.border}}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:C.blue}}>
                  {es ? 'Presencia Online Verificada' : 'Presença Online Verificada'}
                </p>
                <p className="text-2xl font-black mb-3" style={{color:C.navy}}>
                  {es ? 'Encontre-nos no Google' : 'Encontre-nos no Google'}
                </p>
                <p className="text-sm leading-relaxed mb-4" style={{color:C.muted}}>
                  {es
                    ? 'Limpszone aparece en los primeros resultados de Google. Más de 127 reseñas verificadas con una puntuación de 4.9 estrellas.'
                    : 'A Limpszone aparece nos primeiros resultados do Google. Mais de 127 avaliações verificadas com pontuação de 4.9 estrelas.'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">{[...Array(5)].map((_,j)=><Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400"/>)}</div>
                  <span className="text-sm font-black" style={{color:C.navy}}>4.9/5</span>
                  <span className="text-xs" style={{color:C.muted}}>· 127 {es?'reseñas':'avaliações'}</span>
                </div>
              </div>
              {/* Fake Google search result card */}
              <div className="flex-1 bg-white rounded-2xl p-5 shadow-xl border" style={{borderColor:C.border,maxWidth:380}}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full" style={{background:'linear-gradient(135deg,#4285F4,#34A853)'}}/>
                  <div>
                    <p className="text-xs font-semibold" style={{color:C.navy}}>limpszone.solutions</p>
                    <p className="text-xs" style={{color:C.muted}}>https://www.limpszone.solutions</p>
                  </div>
                </div>
                <p className="text-sm font-black mb-1" style={{color:'#1a0dab'}}>
                  Limpszone – {es?'Limpieza Profesional':'Limpeza Profissional'}
                </p>
                <p className="text-xs leading-relaxed mb-3" style={{color:C.muted}}>
                  {es
                    ? 'Servicios de limpieza profesional para toda Europa. Presupuesto gratis en 1h. Equipo certificado. ⭐ 4.9/5 · +500 clientes satisfechos.'
                    : 'Serviços de limpeza profissional para toda a Europa. Orçamento grátis em 1h. Equipa certificada. ⭐ 4.9/5 · +500 clientes satisfeitos.'}
                </p>
                <div className="flex items-center gap-2 p-2 rounded-lg" style={{background:'#f8f9fa'}}>
                  <div className="flex gap-0.5">{[...Array(5)].map((_,j)=><Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400"/>)}</div>
                  <span className="text-xs font-bold" style={{color:'#202124'}}>4,9</span>
                  <span className="text-xs" style={{color:C.muted}}>·</span>
                  <span className="text-xs" style={{color:'#4285F4'}}>127 {es?'reseñas en Google':'avaliações no Google'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

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
                    {r.photo ? (
                      <img src={r.photo} alt={r.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-sm" style={{border:`2px solid ${C.border}`}}/>
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0 shadow-sm" style={{background:`linear-gradient(135deg,${C.navy},${C.blue})`}}>{r.init}</div>
                    )}
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
      <footer id="footer" className="pt-14 pb-0" style={{background:`linear-gradient(180deg,${C.navy} 0%,#071322 100%)`,position:'relative',overflow:'hidden'}}>
        {/* Decorative background icons */}
        <div style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden'}}>
          <svg style={{position:'absolute',top:'8%',left:'3%',opacity:0.04}} width="120" height="120" viewBox="0 0 60 60" fill="none">
            <path d="M22 10h10v6h-4v34H18V16h-4v-3l8-3zM32 16h8v4h-8zM36 12l4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg style={{position:'absolute',top:'20%',right:'2%',opacity:0.05}} width="160" height="160" viewBox="0 0 80 80" fill="none">
            <circle cx="20" cy="20" r="12" stroke="white" strokeWidth="1.5"/>
            <circle cx="50" cy="15" r="8" stroke="white" strokeWidth="1.5"/>
            <circle cx="60" cy="45" r="14" stroke="white" strokeWidth="1.5"/>
            <circle cx="25" cy="55" r="10" stroke="white" strokeWidth="1.5"/>
            <circle cx="45" cy="60" r="6" stroke="white" strokeWidth="1.5"/>
          </svg>
          <svg style={{position:'absolute',bottom:'30%',left:'8%',opacity:0.04}} width="100" height="100" viewBox="0 0 50 50" fill="none">
            <path d="M10 5L40 35" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M32 27L44 42H20L32 27z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <svg style={{position:'absolute',top:'55%',left:'25%',opacity:0.03}} width="110" height="110" viewBox="0 0 55 55" fill="none">
            <path d="M27.5 46S8 33 8 19a11 11 0 0 1 19.5-7A11 11 0 0 1 47 19C47 33 27.5 46 27.5 46z" stroke="white" strokeWidth="2"/>
            <path d="M22 27h11M27.5 21.5v11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <svg style={{position:'absolute',bottom:'8%',right:'12%',opacity:0.05}} width="80" height="80" viewBox="0 0 40 40" fill="none">
            <path d="M20 5C20 5 8 18 8 26a12 12 0 0 0 24 0C32 18 20 5 20 5z" stroke="white" strokeWidth="1.8"/>
          </svg>
          <svg style={{position:'absolute',bottom:'30%',right:'28%',opacity:0.04}} width="100" height="100" viewBox="0 0 50 50" fill="none">
            <path d="M10 40C10 40 12 20 30 15C45 10 44 10 44 10C44 10 42 28 28 35C18 40 10 40 10 40z" stroke="white" strokeWidth="1.8"/>
          </svg>
          <svg style={{position:'absolute',top:'35%',right:'18%',opacity:0.04}} width="90" height="90" viewBox="0 0 45 45" fill="none">
            <path d="M22.5 4L6 11v12c0 10 7.5 18.5 16.5 20C31.5 41.5 39 33 39 23V11L22.5 4z" stroke="white" strokeWidth="1.8"/>
            <path d="M14 22l6 6 11-11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="container mx-auto px-6" style={{position:'relative',zIndex:1}}>

          {/* Main footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 pt-2">

            {/* Brand + socials */}
            <div>
              <div className="mb-5">
                <span style={{fontSize:'32px',fontWeight:900,letterSpacing:'-1px'}}>
                  <span style={{color:'#60a5fa'}}>Limps</span><span style={{color:'#ffffff'}}>Zone</span>
                </span>
              </div>
              <a href="tel:+351934071930" className="text-base font-black block mb-1" style={{color:'#60a5fa'}}>
                📞 +351 934 071 930
              </a>
              <p className="text-xs mb-5" style={{color:'#64748b'}}>suportelimpszone@gmail.com</p>
              {/* Social icons */}
              <div className="flex items-center gap-3 mb-5">
                <a href="https://www.facebook.com/share/1Dtx6cbZmc/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                  style={{background:'#1877f2'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/limpszone?igsh=Z2M5M2J0ZDdiMDVs" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                  style={{background:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
                  </svg>
                </a>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                  style={{background:'#25d366'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.524 5.843L.057 23.571a.5.5 0 0 0 .614.614l5.728-1.467A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.929 0-3.73-.518-5.276-1.422l-.378-.223-3.927 1.006 1.006-3.927-.223-.378A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </a>
              </div>
              <div className="space-y-1">
                <p className="text-xs" style={{color:'#64748b'}}>{T.ftMF}</p>
                <p className="text-xs" style={{color:'#64748b'}}>{T.ftSa}</p>
                <p className="text-xs" style={{color:'#64748b'}}>{T.ftSu}</p>
                <p className="text-xs font-bold text-green-400">{T.ftEm}</p>
              </div>
            </div>

            {/* Services */}
            <div>
              <p className="text-sm font-black uppercase tracking-widest mb-5 text-white pb-2 border-b" style={{borderColor:C.blue}}>{T.ftSvc}</p>
              {[T.s1t,T.s2t,T.s3t,T.s4t,T.s5t,T.s6t].map(s=>(
                <a key={s} href="#services" onClick={e=>{e.preventDefault();go('services')}}
                  className="block text-sm mb-3 transition-colors hover:text-blue-400 cursor-pointer" style={{color:'#94a3b8'}}>{s}</a>
              ))}
            </div>

            {/* Company */}
            <div>
              <p className="text-sm font-black uppercase tracking-widest mb-5 text-white pb-2 border-b" style={{borderColor:C.blue}}>{T.ftCo}</p>
              {[[T.n2,'why-us'],[T.n3,'reviews'],[T.n4,'budget-calculator'],['FAQ','budget-calculator']].map(([label,id])=>(
                <a key={label} href={`#${id}`} onClick={e=>{e.preventDefault();go(id)}}
                  className="block text-sm mb-3 transition-colors hover:text-blue-400 cursor-pointer" style={{color:'#94a3b8'}}>{label}</a>
              ))}
            </div>

            {/* Contact */}
            <div>
              <p className="text-sm font-black uppercase tracking-widest mb-5 text-white pb-2 border-b" style={{borderColor:C.blue}}>{T.ftCtc}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" style={{color:'#60a5fa'}}/>
                  <a href="tel:+351934071930" className="text-sm hover:text-blue-400 transition-colors" style={{color:'#94a3b8'}}>+351 934 071 930</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" style={{color:'#60a5fa'}}/>
                  <a href="mailto:suportelimpszone@gmail.com" className="text-sm hover:text-blue-400 transition-colors" style={{color:'#94a3b8'}}>suportelimpszone@gmail.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" style={{color:'#60a5fa'}}/>
                  <span className="text-sm" style={{color:'#94a3b8'}}>Portugal & Europa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0 text-green-400"/>
                  <span className="text-sm font-bold text-green-400">24/7</span>
                </div>
              </div>
              <WhatsAppButton className="mt-5 inline-flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-xl" style={{background:'#25d366'}}>
                <MessageCircle className="h-4 w-4"/>{T.ftWA}
              </WhatsAppButton>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{borderColor:'rgba(255,255,255,0.08)'}}/>

          {/* Legal text */}
          <div className="py-6 text-center space-y-2">
            <p className="text-xs leading-relaxed mx-auto" style={{color:'#475569',maxWidth:'720px'}}>
              {es
                ? 'La información presentada es indicativa. La disponibilidad de los servicios y los detalles finales, incluido el precio y la programación, siempre serán confirmados antes de la realización del servicio.'
                : 'As informações apresentadas são indicativas. A disponibilidade dos serviços e os detalhes finais, incluindo preço e agendamento, serão sempre confirmados antes da realização do serviço.'}
            </p>
            <p className="text-xs font-semibold" style={{color:'#334155'}}>
              {es ? 'Cuidamos de su espacio como si fuera nuestro.' : 'Cuidamos do seu espaço como se fosse nosso.'}
            </p>
            <p className="text-xs" style={{color:'#334155'}}>{T.ftCopy}</p>
          </div>

        </div>
      </footer>

    </div>
  )
}
