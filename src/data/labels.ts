import type { ServiceSlug, UnitType } from './types'

/**
 * PT-BR labels for the stable English slugs (project convention: code in
 * English, UI in Portuguese). Service labels transcribed from the
 * mapping report §6 — the taxonomy is data, not copy to be reworded.
 */
export const SERVICE_LABELS: Record<ServiceSlug, string> = {
  'primary-care': 'Consultas (clínico geral)',
  'family-health-strategy': 'Estratégia Saúde da Família (ESF)',
  pediatrics: 'Pediatria',
  'womens-health': 'Saúde da mulher (ginecologia/obstetrícia)',
  'prenatal-care': 'Pré-natal',
  dentistry: 'Dentista (atenção básica)',
  'dental-specialties': 'Especialidades odontológicas',
  'nursing-procedures': 'Curativos, injeções e enfermagem',
  vaccination: 'Vacinação',
  'lab-sample-collection': 'Coleta de exames',
  'rapid-testing': 'Testes rápidos (HIV, sífilis, hepatites, gravidez)',
  'cancer-screening': 'Preventivo e pedido de mamografia',
  'medication-dispensing': 'Retirada de medicamentos',
  'home-care': 'Atendimento domiciliar (ESF)',
  'specialty-consultations': 'Consultas com especialistas',
  'speech-therapy': 'Fonoaudiologia',
  nutrition: 'Nutrição',
  'social-work': 'Serviço social',
  'physiotherapy-rehab': 'Fisioterapia e reabilitação',
  'mental-health': 'Saúde mental (ambulatório)',
  'psychosocial-care-adult': 'CAPS adulto',
  'psychosocial-care-alcohol-drugs': 'CAPS álcool e outras drogas',
  'psychosocial-care-children': 'CAPS infantojuvenil',
  'sti-hiv-care': 'IST/HIV/Aids',
  'chronic-wound-care': 'Feridas crônicas',
  'urgent-care': 'Pronto atendimento (urgência leve)',
  'hospital-emergency': 'Pronto-socorro 24h',
  'hospital-admission': 'Internação',
  surgery: 'Cirurgias',
  maternity: 'Maternidade / centro obstétrico',
  oncology: 'Oncologia (quimio/radioterapia)',
  dialysis: 'Hemodiálise',
  imaging: 'Exames de imagem',
  'lab-tests': 'Laboratório (análises)',
  'mobile-emergency': 'SAMU (atendimento móvel)',
  'epidemiological-surveillance': 'Vigilância epidemiológica',
  'health-surveillance': 'Vigilância sanitária',
  'workers-health': 'Saúde do trabalhador',
  'health-promotion': 'Promoção da saúde',
  'regulation-administration': 'Gestão e regulação',
}

/**
 * Unit-type labels. First-mention jargon gets a plain-language gloss
 * (briefing §3: "UBS (posto de saúde)").
 */
export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  ubs: 'UBS (posto de saúde)',
  'prison-health-unit': 'Unidade de saúde prisional',
  'health-post': 'Ponto de atendimento',
  'urgent-care': 'Pronto atendimento',
  'mobile-emergency': 'Atendimento móvel de urgência (SAMU)',
  hospital: 'Hospital',
  'specialty-center': 'Centro de especialidades',
  'dental-specialty-center': 'Centro de especialidades odontológicas',
  caps: 'CAPS (Centro de Atenção Psicossocial)',
  'rehab-center': 'Centro de reabilitação',
  'public-pharmacy': 'Farmácia pública',
  surveillance: 'Vigilância em saúde',
  'health-promotion': 'Promoção da saúde',
  administration: 'Órgão de gestão',
}
