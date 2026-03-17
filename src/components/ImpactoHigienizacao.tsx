"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImpactoHigienizacaoProps {
  onSolicitarServico: () => void
}

type Lang = 'pt' | 'es'

const LOCALES: Record<Lang, Record<string, string>> = {
  pt: {
    sectionTitle: '🧼 Riscos e Benefícios da Higienização do Seu Espaço',
    sectionSubtitle: 'Veja a diferença que a higienização profissional pode fazer no seu ambiente e na sua qualidade de vida',
    badTitle: '⚠️ Ambiente Mal Higienizado',
    badCta: 'Não deixe a sua família ou negócio em risco!',
    goodTitle: '✨ Ambiente Limpo e Saudável',
    goodCta: 'Invista na qualidade de vida do seu espaço!',
    quote1: '"⚠️ Não deixe para depois: o seu lar é o seu primeiro conforto."',
    quote2: '"✨ Viver num ambiente limpo é viver com saúde e tranquilidade."',
    quote3: '"🚿 O conforto e a higiene que o seu espaço merece — cuide hoje!"',
    quote4: '"💚 Mais saúde, mais bem-estar, mais confiança."',
    urgencyTitle: '🚨 Não deixe para depois! O seu lar é o seu primeiro conforto.',
    urgencyDesc: 'Cuide dele com quem entende de limpeza profissional.',
    urgencyNote: '⏰ Cada dia sem higienização é um risco à sua saúde',
    ctaBtn: 'Solicitar Higienização Agora',
    ctaNote: 'Transforme o seu espaço num ambiente saudável e acolhedor hoje mesmo!',
    prevLabel: 'Slide anterior',
    nextLabel: 'Próximo slide',
    goToSlide: 'Ir para slide',

    // Slide texts PT
    slide1antes: '⚠️ Não deixe para depois: o seu lar é o seu primeiro conforto.',
    slide1depois: '✨ Viver num ambiente limpo é viver com saúde e tranquilidade.',
    slide2antes: '🚿 O conforto e a higiene que o seu espaço merece — cuide hoje!',
    slide2depois: '💚 Mais saúde, mais bem-estar, mais confiança.',
    slide3antes: '⚠️ Ambientes sujos afetam a sua energia e disposição diária.',
    slide3depois: '✨ Desperte renovado num ambiente limpo e harmonioso.',
    slide4antes: '🚨 Casas de banho mal higienizadas são focos de bactérias e doenças.',
    slide4depois: '💚 Higiene completa para a sua família se sentir protegida.',
    slide5antes: '⚠️ Ambientes de trabalho sujos reduzem produtividade e motivação.',
    slide5depois: '✨ Espaços profissionais limpos inspiram sucesso e bem-estar.',
    slide6antes: '🚨 Estabelecimentos sujos afastam clientes e prejudicam negócios.',
    slide6depois: '💚 Ambientes higienizados atraem mais clientes e confiança.',
  },
  es: {
    sectionTitle: '🧼 Riesgos y Beneficios de la Higienización de tu Espacio',
    sectionSubtitle: 'Mira la diferencia que la higienización profesional puede hacer en tu ambiente y calidad de vida',
    badTitle: '⚠️ Ambiente Mal Higienizado',
    badCta: '¡No dejes a tu familia o negocio en riesgo!',
    goodTitle: '✨ Ambiente Limpio y Saludable',
    goodCta: '¡Invierte en la calidad de vida de tu espacio!',
    quote1: '"⚠️ No lo dejes para después: tu hogar es tu primer confort."',
    quote2: '"✨ Vivir en un ambiente limpio es vivir con salud y tranquilidad."',
    quote3: '"🚿 La comodidad y la higiene que tu espacio merece — cuídalo hoy!"',
    quote4: '"💚 Más salud, más bienestar, más confianza."',
    urgencyTitle: '🚨 ¡No lo dejes para después! Tu hogar es tu primer confort.',
    urgencyDesc: 'Cuídalo con quien entiende de limpieza profesional.',
    urgencyNote: '⏰ Cada día sin higienización es un riesgo para tu salud',
    ctaBtn: 'Solicitar Higienización Ahora',
    ctaNote: '¡Transforma tu espacio en un ambiente saludable y acogedor hoy mismo!',
    prevLabel: 'Diapositiva anterior',
    nextLabel: 'Siguiente diapositiva',
    goToSlide: 'Ir a diapositiva',

    // Slide texts ES
    slide1antes: '⚠️ No lo dejes para después: tu hogar es tu primer confort.',
    slide1depois: '✨ Vivir en un ambiente limpio es vivir con salud y tranquilidad.',
    slide2antes: '🚿 La comodidad y la higiene que tu espacio merece — ¡cuídalo hoy!',
    slide2depois: '💚 Más salud, más bienestar, más confianza.',
    slide3antes: '⚠️ Los ambientes sucios afectan tu energía y disposición diaria.',
    slide3depois: '✨ Despierta renovado en un ambiente limpio y armonioso.',
    slide4antes: '🚨 Los baños mal higienizados son focos de bacterias y enfermedades.',
    slide4depois: '💚 Higiene completa para que tu familia se sienta protegida.',
    slide5antes: '⚠️ Los ambientes de trabajo sucios reducen la productividad y motivación.',
    slide5depois: '✨ Los espacios profesionales limpios inspiran éxito y bienestar.',
    slide6antes: '🚨 Los establecimientos sucios alejan clientes y perjudican negocios.',
    slide6depois: '💚 Los ambientes higienizados atraen más clientes y confianza.',
  }
}

export default function ImpactoHigienizacao({ onSolicitarServico }: ImpactoHigienizacaoProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [lang, setLang] = useState<Lang>('pt')

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setLang(navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'pt')
    }
  }, [])

  const T = LOCALES[lang]

  const slidesPairs = [
    {
      antes: {
        url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
        alt: T.slide1antes,
        texto: T.slide1antes
      },
      depois: {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        alt: T.slide1depois,
        texto: T.slide1depois
      }
    },
    {
      antes: {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        alt: T.slide2antes,
        texto: T.slide2antes
      },
      depois: {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        alt: T.slide2depois,
        texto: T.slide2depois
      }
    },
    {
      antes: {
        url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
        alt: T.slide3antes,
        texto: T.slide3antes
      },
      depois: {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        alt: T.slide3depois,
        texto: T.slide3depois
      }
    },
    {
      antes: {
        url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop',
        alt: T.slide4antes,
        texto: T.slide4antes
      },
      depois: {
        url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
        alt: T.slide4depois,
        texto: T.slide4depois
      }
    },
    {
      antes: {
        url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
        alt: T.slide5antes,
        texto: T.slide5antes
      },
      depois: {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        alt: T.slide5depois,
        texto: T.slide5depois
      }
    },
    {
      antes: {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        alt: T.slide6antes,
        texto: T.slide6antes
      },
      depois: {
        url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
        alt: T.slide6depois,
        texto: T.slide6depois
      }
    }
  ]

  const allSlides: { url: string; alt: string; texto: string; type: string }[] = []
  slidesPairs.forEach(pair => {
    allSlides.push({ ...pair.antes, type: 'antes' })
    allSlides.push({ ...pair.depois, type: 'depois' })
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [allSlides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % allSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + allSlides.length) % allSlides.length)

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          {/* Título */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              {T.sectionTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {T.sectionSubtitle}
            </p>
          </div>

          {/* Carrossel */}
          <div className="relative mb-12">
            <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
              {allSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                    index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                >
                  <div className="h-full bg-cover bg-center relative" style={{ backgroundImage: `url(${slide.url})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
                    <div className="relative h-full flex items-center justify-center text-center text-white px-6">
                      <div className="max-w-4xl">
                        {slide.type === 'antes' ? (
                          <div className="animate-fade-in">
                            <h3 className="text-2xl md:text-4xl font-bold mb-4 text-red-100">{T.badTitle}</h3>
                            <p className="text-lg md:text-xl text-white mb-6">{slide.texto}</p>
                            <div className="bg-red-600/80 backdrop-blur-sm rounded-lg p-4 inline-block">
                              <p className="text-white font-semibold">{T.badCta}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="animate-fade-in">
                            <h3 className="text-2xl md:text-4xl font-bold mb-4 text-green-100">{T.goodTitle}</h3>
                            <p className="text-lg md:text-xl text-white mb-6">{slide.texto}</p>
                            <div className="bg-green-600/80 backdrop-blur-sm rounded-lg p-4 inline-block">
                              <p className="text-white font-semibold">{T.goodCta}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controlos */}
            <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110" aria-label={T.prevLabel}>
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110" aria-label={T.nextLabel}>
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {allSlides.map((_, index) => (
                <button key={index} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`} onClick={() => setCurrentSlide(index)} aria-label={`${T.goToSlide} ${index + 1}`} />
              ))}
            </div>
          </div>

          {/* Frases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[T.quote1, T.quote2, T.quote3, T.quote4].map((quote, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <p className="text-gray-700 text-lg leading-relaxed italic">{quote}</p>
              </div>
            ))}
          </div>

          {/* Urgência */}
          <div className="text-center bg-gradient-to-r from-red-500 to-orange-500 text-white p-8 rounded-2xl shadow-2xl mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{T.urgencyTitle}</h3>
            <p className="text-xl mb-6">{T.urgencyDesc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-lg font-semibold">{T.urgencyNote}</div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              onClick={onSolicitarServico}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-xl px-12 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 transform"
            >
              <span className="mr-3">🧼</span>
              {T.ctaBtn}
              <span className="ml-3">✨</span>
            </Button>
            <p className="text-gray-600 mt-4 text-lg">{T.ctaNote}</p>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
      `}</style>
    </section>
  )
}
