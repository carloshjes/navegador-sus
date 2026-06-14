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
 * Citizen-relevance order for the type filter chips (Etapa Visual 2 / B5).
 * The everyday doors come first; institutional/rare types (vigilância,
 * gestão, promoção, ponto de atend., saúde prisional, SAMU) sit under a
 * "Mais tipos ▾" disclosure on the directory. Coverage of the UnitType
 * union is enforced by labels.test.ts.
 */
export const TYPE_FILTER_PRIORITY: readonly UnitType[] = [
  'ubs',
  'urgent-care',
  'hospital',
  'caps',
  'specialty-center',
  'dental-specialty-center',
  'public-pharmacy',
  'rehab-center',
]

/**
 * Most-searched services shown as chips upfront (Etapa Visual 2 / B5). The
 * full list is reachable through "Mais serviços ▾"; the textual search box
 * already covers any service, so this set is a triage of the everyday ones.
 */
export const SERVICE_FILTER_PRIORITY: readonly ServiceSlug[] = [
  'vaccination',
  'primary-care',
  'dentistry',
  'womens-health',
  'pediatrics',
  'mental-health',
  'medication-dispensing',
  'urgent-care',
  'lab-tests',
]

/**
 * Short unit-type labels for the filter chips (kit §5). Chips are compact, so
 * the first-mention gloss of UNIT_TYPE_LABELS is dropped here; the full label
 * still appears on every card and detail page.
 */
export const UNIT_TYPE_SHORT_LABELS: Record<UnitType, string> = {
  ubs: 'UBS',
  'prison-health-unit': 'Saúde prisional',
  'health-post': 'Ponto de atend.',
  'urgent-care': 'Pronto atend.',
  'mobile-emergency': 'SAMU',
  hospital: 'Hospital',
  'specialty-center': 'Especialidades',
  'dental-specialty-center': 'Odonto (CEO)',
  caps: 'CAPS',
  'rehab-center': 'Reabilitação',
  'public-pharmacy': 'Farmácia',
  surveillance: 'Vigilância',
  'health-promotion': 'Promoção',
  administration: 'Gestão',
}

/** Short service labels for chips; same shortening logic as the type ones. */
export const SERVICE_SHORT_LABELS: Partial<Record<ServiceSlug, string>> = {
  'primary-care': 'Consultas',
  'womens-health': 'Saúde da mulher',
  dentistry: 'Dentista',
  'urgent-care': 'Urgência leve',
  'medication-dispensing': 'Medicamentos',
  'mental-health': 'Saúde mental',
  'lab-tests': 'Laboratório',
  'rapid-testing': 'Testes rápidos',
  'sti-hiv-care': 'IST/HIV/Aids',
  'cancer-screening': 'Preventivo',
  'hospital-emergency': 'Pronto-socorro',
  'hospital-admission': 'Internação',
  'physiotherapy-rehab': 'Fisioterapia',
  'epidemiological-surveillance': 'Vig. epidemiológica',
  'health-surveillance': 'Vig. sanitária',
  'regulation-administration': 'Gestão/regulação',
  'mobile-emergency': 'SAMU',
}

/** Return the short label if one exists, else fall back to the full one. */
export function serviceChipLabel(slug: ServiceSlug): string {
  return SERVICE_SHORT_LABELS[slug] ?? SERVICE_LABELS[slug]
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
