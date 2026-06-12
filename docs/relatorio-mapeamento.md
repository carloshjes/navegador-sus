# Relatório de Mapeamento — Rede Pública de Saúde de Erechim/RS

> **Etapa 0 do projeto `navegador-sus`** · Pesquisa realizada em **11/06/2026**.
> Entregável-irmão: `unidades-saude-erechim.json` (39 unidades, com proveniência campo a campo).
> Regra seguida à risca: **nenhum dado foi deduzido ou inventado**; lacuna marcada vale mais que dado chutado.

---

## 1. Sumário executivo

A rede pública de Erechim (~100 mil habitantes, conforme briefing) é maior e mais estruturada do que a faixa esperada de 15–25 unidades sugeria: foram inventariadas **35 unidades públicas ativas**, mais 1 em construção, 2 com status a verificar e 1 desativada (registro histórico). O número fica acima da faixa porque o município mantém uma rede especializada própria incomum para o porte — três CAPS, CEO, CRE, SAE, ambulatórios temáticos — além de **13 UBSs** e **dois hospitais filantrópicos que atendem SUS**.

Os dados de melhor qualidade vêm do CNES, cujas fichas de Erechim estão **surpreendentemente frescas** (a maioria atualizada entre 26/05 e 10/06/2026, com alvarás sanitários de março/2026). Os pontos fracos são: **horários** das UBSs sem extensão noturna (não publicados), a situação cadastral do **Pronto Atendimento municipal** (a prefeitura afirma que existe; o CNES não tem registro municipal com esse nome) e a **territorialização ESF** (só fragmentos foram encontrados — é a principal lacuna para a proposta de valor do app).

## 2. Como a rede de Erechim se organiza (em linguagem simples)

O SUS local funciona em camadas, e o app deve refletir exatamente esse fluxo:

**1ª camada — porta de entrada (atenção básica).** São as **13 UBSs** — "postos de saúde" — espalhadas pelos bairros (11 urbanas, incluindo a UBS Centro dentro da UMRS e a UBS Prisional, + 2 nos distritos de Capoerê e Jaguaretê). É onde o morador resolve a maior parte: consultas com clínico geral, pediatria e ginecologia/obstetrícia, dentista, curativos e injeções, vacinas, coleta de exames, testes rápidos (HIV, sífilis, hepatites, gravidez), preventivo, pedido de mamografia, retirada de medicamentos e acompanhamento de gestantes. As UBSs com **Estratégia Saúde da Família (ESF)** têm equipes responsáveis por um território definido (bairros) e fazem atendimento domiciliar agendado, com prioridade para idosos e gestantes. Uma **14ª UBS (Novo Atlântico/Demoliner)** foi anunciada em março/2026 e está em fase de obra.

**2ª camada — especialidades (por encaminhamento).** Quando o caso precisa de especialista, a UBS encaminha para a rede própria: **CRE** (traumato/ortopedia, pneumologia, fonoaudiologia, nutrição, serviço social), **CEO** (especialidades odontológicas), **SAE** (IST/HIV/Aids), **Centro de Referência da Mulher**, **Ambulatório de Feridas Crônicas**, **Ambulatório de Saúde Mental** e **Unidade Municipal de Reabilitação**. A saúde mental de maior intensidade tem porta própria nos três **CAPS** (CAPS II adultos, CAPS AD álcool/drogas, CAPSi crianças e adolescentes). A **Farmácia Central** dispensa medicamentos no prédio da Secretaria.

**3ª camada — urgência e hospital.** Para urgências que não são emergência com risco de vida, a prefeitura mantém o **Pronto Atendimento na UMRS** (Rua Alemanha, 985 — o mesmo complexo da UBS Centro). Emergências graves: **SAMU 192** (e a municipal **Ambulância Cidadã, 160**). A retaguarda hospitalar são dois filantrópicos que atendem SUS: o **Hospital Santa Terezinha (FHSTE)**, com pronto-socorro 24h, 180 leitos, UTIs e alta complexidade (oncologia, traumato, vascular, hemodiálise, transplante de córnea) — referência para ~600 mil habitantes de três regiões de saúde — e o **Hospital de Caridade de Erechim** (hospital geral, ativo no CNES com atualização de 10/06/2026; carteira de serviços a detalhar).

**Bastidores.** A **Secretaria Municipal de Saúde** (Av. Santo Dal Bosco, 200) concentra gestão, regulação e vigilâncias (NUVEPI — epidemiológica/imunização — e Vigilância Sanitária). A **11ª Coordenadoria Regional de Saúde**, órgão estadual sediado em Erechim, coordena 33 municípios da região.

Um detalhe de UX importante descoberto na pesquisa: **a UMRS (Rua Alemanha, 985) é um "hub"** que abriga cinco serviços diferentes (UBS Centro, PA, Feridas Crônicas, CRM e Ambulatório de Saúde Mental), e **a Av. Santo Dal Bosco concentra outros cinco** (Secretaria e CRE no nº 200; SAE, NUVEPI e Farmácia Central no nº 160). O app precisa deixar claro que "endereço igual ≠ serviço igual".

## 3. Inventário em números

| Categoria | Qtde | Observação |
|---|---|---|
| UBS (atenção básica) | 13 | 12 abertas ao público + UBS Prisional (acesso restrito) |
| Pontos de atendimento municipais | 2 | Dom Pedro II e CAIC (ativos no CNES, ausentes da lista oficial de UBSs — conflito nº 3) |
| UBS em construção | 1 | Novo Atlântico/Demoliner (anúncio 06/03/2026) |
| Urgência | 2 | PA municipal (UMRS, status cadastral a verificar) + SAMU 192 |
| Hospitais SUS | 2 | FHSTE e Hospital de Caridade (filantrópicos, gestão dupla) |
| Especialidades e apoio | 11 | CRE, CEO, 3 CAPS, SAE, CRM, Amb. Feridas, Amb. Saúde Mental, Reabilitação, Farmácia Central |
| Vigilância / promoção / gestão | 6 | NUVEPI, VISA, CEREST, Academia da Saúde, SMS, 11ª CRS |
| Desativada / a verificar | 2 | SAMI (desativado 12/2021) e Ambulatório COVID-19 (verificar) |
| **Total no JSON** | **39** | 37 com código CNES |

## 4. Fontes consultadas e avaliação de qualidade

Todas consultadas em **11/06/2026**.

| Fonte | O que forneceu | Qualidade / observações |
|---|---|---|
| **CNES/CNESNet** — lista municipal ([Lista_Es_Municipio](http://cnes2.datasus.gov.br/Lista_Es_Municipio.asp?VEstado=43&VCodMunicipio=430700)) + 15 fichas individuais | Inventário completo (centenas de estabelecimentos, filtrado para a rede pública), código CNES, endereço, telefone, **horário por dia da semana**, gestão, tipo, datas de atualização e até status de desativação | **Excelente e atual**: fichas com "última atualização" entre 26/05 e 10/06/2026 e alvarás de 2025–2026. Limitações: nomes/telefones com erros de digitação (ex.: CAIC), CEPs genéricos (99700-970), e a interface acessível **não expõe lat/lng** (ver §7). Horário do CNES é declaração do gestor — validar na prática. |
| **Prefeitura — pág. Saúde** ([/pagina/164](https://www.pmerechim.rs.gov.br/pagina/164/saude)) | Endereços e telefones das UBSs; descrição da FHSTE, do Hospital de Caridade e do Hospital Unimed | Oficial, **sem data de publicação** → tratado como `official-stale`. Página com markup pesado (menu gigante). |
| **Prefeitura — pág. UBSs** ([/pagina/220](https://www.pmerechim.rs.gov.br/pagina/220/unidades-basicas-de-saude)) | Lista oficial das **13 UBSs**, horário estendido da UBS Centro (7h30–19h30), descrição dos serviços da atenção básica | Oficial, sem data → `official-stale`; coerente com notícias de 2026. |
| **Prefeitura — pág. UMRS** ([/pagina/221](https://www.pmerechim.rs.gov.br/pagina/221/umrs)) | Composição do complexo da Rua Alemanha, 985 (UBS Centro + PA + 3 ambulatórios) e telefone | Oficial, sem data → `official-stale`. Achado-chave para entender o "hub". |
| **Prefeitura — Carta de Serviços** ([/pagina/1086](https://www.pmerechim.rs.gov.br/pagina/1086/servicos-de-saude)) | Lista detalhada de serviços das UBSs e especialidades do CRE | Oficial; base da taxonomia (§6). |
| **Prefeitura — SAMU/Ambulância Cidadã** ([link](https://www.pmerechim.rs.gov.br/sem-fronteiras/34/ambulncia-cidad----samu)) | Telefones 192 (SAMU) e **160 (Ambulância Cidadã)** | Oficial. |
| **Prefeitura — notícia 06/03/2026** ([/noticia/22147](https://www.pmerechim.rs.gov.br/noticia/22147/ubs-novo-atlantico-vai-ampliar-acesso-a-saude-para-populacao-de-erechim)) | Nova UBS Novo Atlântico/Demoliner: local, projeto, investimento, capacidade | Oficial e datada → `official-recent`. |
| **SES-RS — 11ª CRS** ([saude.rs.gov.br/11-crs-erechim](https://saude.rs.gov.br/11-crs-erechim)) | Papel regional e lista dos 33 municípios | Oficial estadual. |
| **Quentuchas Notícias** (jan e fev/2026) | Estrutura "13 UBS = 11 urbanas + 2 distritais", abrangência parcial (Residencial Imigrante → UBS São Vicente de Paulo; bairros da futura UBS), pressão de cadastros na UBS S. Vicente | Imprensa local recente; corrobora e detalha a fonte oficial. |
| **Portal Notícias Erechim** (12/12/2024), **Jornal Bom Dia** (2023–2024), **AU Online / Rádio Difusão** (2023) | Reformas entregues (Bela Vista, Atlântico, Aldo Arioli; Paiol Grande em obra em 2024) e episódio de **alteração temporária de horário da UBS Progresso** (Decreto 5.587, mar/2023) | Imprensa local; útil para histórico e para sinalizar que **horário de UBS é dado volátil** em Erechim. |
| **servicos.blog.br** (2014) | Endereços antigos | **Stale por definição** — usado *apenas* para gerar flags de conflito, nunca como fonte primária. |
| **Espelhos de CNES** (infosaude.com.br, cebes.com.br) | Confirmação do CNES da Secretaria | Réplicas sem curadoria; uso mínimo. |
| **Indisponibilidades** | — | A API aberta `apidadosabertos.saude.gov.br` respondeu, porém **ignorando parâmetros de consulta** no ambiente de pesquisa (filtro por município inoperante via fetch); contornado com o CNESNet legado. Registrado conforme a regra "não substituir por dedução". |

## 5. Validação cruzada — conflitos e divergências registradas

Cada item abaixo também está no campo `conflicts` da unidade correspondente no JSON.

| # | Tema | Versão A | Versão B | Tratamento |
|---|---|---|---|---|
| 1 | **Pronto Atendimento municipal** | Prefeitura: PA funciona na UMRS (Rua Alemanha, 985) | CNES: único "PRONTO ATENDIMENTO" registrado (2248352) é **privado** (ortopedia, Rua Mal. Deodoro 121, 8h–18h) | Unidade criada no JSON com `status: verify`, sem CNES e **sem horário** (não há confirmação oficial de "24h" — não inventamos) |
| 2 | **Horário estendido das UBSs** | CNES: Centro, Paiol Grande, Pres. Vargas e Aldo Arioli com 7h30–**19h30** | Prefeitura publica horário estendido **só para a UBS Centro** | CNES registrado como `official-recent` + flag de conflito; demais UBSs ficaram `unverified` |
| 3 | **Dom Pedro II e CAIC** | CNES: ativos (atualizados em 26–27/05/2026), tipo "consultório isolado" municipal | Prefeitura: não constam na lista oficial de 13 UBSs | Incluídos como `health-post` com conflito; confirmar vínculo antes de exibir como unidades autônomas |
| 4 | **SAMI Erechim** | Aparece na lista municipal do CNES | Ficha individual: **DESATIVADO em 12/2021** | `status: deactivated`; mantido só como registro histórico |
| 5 | Grafia **Estevam/Estevão Carraro** | Prefeitura: "Estevam Carraro" | CNES: "ESTEVAO CARRARO" | Padronizado pela prefeitura; manter alias de busca |
| 6 | **UBS São Cristóvão — endereço** | Prefeitura (atual): Santos Dumont, 140 | Fonte de 2014: Rua Dr. José Bisognin | Prevalece a prefeitura; possível mudança de endereço — confirmar |
| 7 | **UBS Jaguaretê — telefone** | Prefeitura: (54) 3321-4846 | Fonte de 2014: (54) 3321-4266 | Prevalece a prefeitura |
| 8 | **Telefone da Secretaria** | Prefeitura: (54) 3522-7200 r. 8926 | CNES (espelho): (54) 3520-7200 | Ambos registrados; confirmar |
| 9 | **Investimento da nova UBS** | Notícia oficial (mar/2026): R$ 2.851.443,09 | Imprensa (jan/2026): R$ 3,4 mi | Valor oficial mais recente prevalece; divergência registrada |
| 10 | **Telefone do CAIC** | CNES: "(54) 3212922" — 7 dígitos | — | Aparenta dígito faltante no cadastro; registrado como está, com flag |

## 6. Taxonomia de serviços proposta (base dos filtros da Fase 2)

Slugs em inglês (chaves estáveis no código) + rótulo PT-BR (interface). Derivada do que as fontes efetivamente descrevem para Erechim — não é uma lista teórica do SUS.

| Slug | Rótulo PT-BR | Onde aparece |
|---|---|---|
| `primary-care` | Consultas (clínico geral) | UBSs |
| `family-health-strategy` | Estratégia Saúde da Família (ESF) | UBSs |
| `pediatrics` | Pediatria | UBSs |
| `womens-health` | Saúde da mulher (ginecologia/obstetrícia) | UBSs, CRM |
| `prenatal-care` | Pré-natal | UBSs |
| `dentistry` | Dentista (atenção básica) | UBSs |
| `dental-specialties` | Especialidades odontológicas | CEO |
| `nursing-procedures` | Curativos, injeções e enfermagem | UBSs |
| `vaccination` | Vacinação | UBSs (aplicação); NUVEPI (coordenação — confirmar) |
| `lab-sample-collection` | Coleta de exames | UBSs |
| `rapid-testing` | Testes rápidos (HIV, sífilis, hepatites, gravidez) | UBSs |
| `cancer-screening` | Preventivo e pedido de mamografia | UBSs |
| `medication-dispensing` | Retirada de medicamentos | UBSs, Farmácia Central |
| `home-care` | Atendimento domiciliar (ESF) | UBSs com ESF |
| `specialty-consultations` | Consultas com especialistas | CRE, FHSTE |
| `speech-therapy` | Fonoaudiologia | CRE |
| `nutrition` | Nutrição | CRE |
| `social-work` | Serviço social | CRE |
| `physiotherapy-rehab` | Fisioterapia e reabilitação | Unidade M. de Reabilitação |
| `mental-health` | Saúde mental (ambulatório) | Amb. Saúde Mental, CAPS |
| `psychosocial-care-adult` | CAPS adulto | CAPS II |
| `psychosocial-care-alcohol-drugs` | CAPS álcool e outras drogas | CAPS AD |
| `psychosocial-care-children` | CAPS infantojuvenil | CAPSi |
| `sti-hiv-care` | IST/HIV/Aids | SAE |
| `chronic-wound-care` | Feridas crônicas | Ambulatório de Feridas |
| `urgent-care` | Pronto atendimento (urgência leve) | PA/UMRS |
| `hospital-emergency` | Pronto-socorro 24h | FHSTE |
| `hospital-admission` | Internação | FHSTE, H. de Caridade |
| `surgery` | Cirurgias | FHSTE |
| `maternity` | Maternidade / centro obstétrico | FHSTE |
| `oncology` | Oncologia (quimio/radioterapia) | FHSTE |
| `dialysis` | Hemodiálise | FHSTE |
| `imaging` | Exames de imagem | FHSTE |
| `lab-tests` | Laboratório (análises) | FHSTE |
| `mobile-emergency` | SAMU (atendimento móvel) | SAMU 192 |
| `epidemiological-surveillance` | Vigilância epidemiológica | NUVEPI |
| `health-surveillance` | Vigilância sanitária | VISA |
| `workers-health` | Saúde do trabalhador | CEREST |
| `health-promotion` | Promoção da saúde | Academia da Saúde |
| `regulation-administration` | Gestão e regulação | SMS, 11ª CRS |

Decisões de modelagem: (a) "vacinação" é serviço de UBS, não unidade própria; (b) CAPS ganhou três slugs distintos porque o público-alvo muda a indicação; (c) `urgent-care` ≠ `hospital-emergency` — distinção central para orientar bem o usuário; (d) serviços marcados nas UBSs vêm da descrição **coletiva** da prefeitura — o campo `servicesNote` de cada UBS avisa que falta confirmação unidade a unidade.

## 7. Coordenadas geográficas — situação e plano de obtenção

**Nenhuma unidade tem lat/lng preenchida; todas estão `geocode-manually`.** Motivo técnico documentado: o CNES publica coordenadas, mas (i) a API aberta (`apidadosabertos.saude.gov.br/cnes/estabelecimentos`) ignorou parâmetros de filtro no ambiente desta pesquisa e (ii) o CNESNet legado não expõe o campo nas fichas HTML (apenas no botão "Exibir no Mapa", via JavaScript). Em vez de chutar coordenadas, ficou o **plano de extração para antes da Fase 3 (mapa)**:

1. **Caminho preferido (script local, ~5 min no Claude Code):** para cada `cnesCode` do JSON, `GET https://apidadosabertos.saude.gov.br/cnes/estabelecimentos/{codigo}` (código sem zeros à esquerda) e ler `latitude_estabelecimento_decimo_grau` / `longitude_estabelecimento_decimo_grau` — endpoint testado e funcional para consulta unitária. Gravar `source: "cnes"`.
2. **Conferência visual:** ficha do estabelecimento em `cnes.datasus.gov.br` (portal novo) mostra o mapa.
3. **Fallback:** geocodificar o endereço via Nominatim/OSM (respeitando o limite de 1 req/s), gravando `source: "osm-geocoding"` — qualidade inferior à do CNES; usar só onde o CNES não tiver o dado.

Os 37 códigos CNES já estão prontos no JSON, então essa tarefa é mecânica.

## 8. Benchmark — o que já existe e o que falta no nível hiperlocal

**Meu SUS Digital (Ministério da Saúde — app nacional).** Foco no *prontuário do cidadão*: carteira de vacinação nacional e internacional, caderneta da criança (2025), resultados de exames, histórico de medicamentos do Farmácia Popular, fila de transplantes, autorização do programa Dignidade Menstrual, e um localizador "Rede de Saúde" de estabelecimentos próximos com filtros. Limites para o nosso caso: quase tudo exige login gov.br; o localizador apresenta o cadastro CNES *cru* (sem curadoria de horários reais, sem áreas de abrangência, sem fluxos locais); nada responde "qual é a *minha* unidade em Erechim" nem "que documentos levar".

**Portal da Prefeitura de Erechim.** A informação oficial *existe* (foi a 2ª melhor fonte desta pesquisa), mas está espalhada em páginas institucionais sem data, com navegação pesada, sem busca por bairro, sem mapa e sem padronização — e versões antigas de endereços seguem circulando em agregadores.

**Agregadores privados de CNES** (infosaude, cebes, meupostinho, ubsbrasil e similares). Replicam o cadastro bruto com SEO agressivo; sem validação local, frequentemente desatualizados — ilustram o risco de "dados sem proveniência" que o briefing quer evitar.

**Posicionamento do `navegador-sus` (argumento para UFFS/Secretaria):** nenhuma das soluções acima entrega a camada **hiperlocal e curada** — unidade de referência por bairro, horários validados com data de verificação, distinção PA × pronto-socorro, documentos necessários, funcionamento offline e acessibilidade AA. O app não compete com o Meu SUS Digital (dados pessoais/prontuário): **complementa** com a camada territorial que falta, e pode inclusive apontar para ele.

## 9. Lacunas e perguntas em aberto (verificação local: ligação ou visita)

Consolidado dos campos `openQuestions` do JSON, por prioridade:

**Críticas (bloqueiam conteúdo central do app):**
1. **PA municipal (UMRS):** horário real (é 24h? *não há confirmação publicada*), CNES sob o qual opera e que casos atende. Uma ligação para (54) 3520-7221 resolve.
2. **Horários das UBSs** Progresso, S. Vicente, S. Cristóvão, E. Carraro, Atlântico, Bela Vista, Capoerê e Jaguaretê (não publicados) + confirmação prática do 19h30 de Paiol Grande, Pres. Vargas e Aldo Arioli.
3. **Territorialização ESF completa** (bairro → UBS). Só fragmentos públicos: Residencial Imigrante → UBS S. Vicente de Paulo; bairros previstos da futura UBS Novo Atlântico. Pedir o mapa/lista de abrangência à Secretaria — é o dado que destrava o "qual minha unidade" da Fase 3.
4. **Dom Pedro II e CAIC:** vínculo, serviços e se atendem demanda espontânea (telefone do CAIC aparenta estar incompleto no CNES).

**Importantes:**
5. Hospital de Caridade: carteira de serviços SUS (tem PS aberto ao público? maternidade?) e relação institucional com a FHSTE.
6. Endereços/telefones faltantes: Unidade M. de Reabilitação, Vigilância Sanitária, CEREST, Academia da Saúde, 11ª CRS, logradouros exatos das UBSs distritais e número da UBS Estevam Carraro; tipo de logradouro da "Santos Dumont, 140".
7. SAE: testagem por demanda espontânea? PrEP/PEP?
8. NUVEPI: aplica vacina ao público ou só coordena?
9. Farmácia Central × farmácias das UBSs: o que se retira onde; rede local credenciada do **Farmácia Popular** (programa federal que opera em farmácias privadas — fora do escopo v1, mas vale um aviso no app).
10. Status do Ambulatório COVID-19 (CNES 0199109) e do registro "Equipe de Saúde Mental" (2877465 — provável registro de equipe, não unidade física).
11. Ambulância Cidadã (160): escopo exato do serviço.

**Nota de exclusão:** o CNES de Erechim contém registros de escolas, creches e similares (ex.: EEEM Irany Jaime Farina, Escola Othelo Rosa, Creche Mãezinha do Céu) ligados a programas como o PSE — não são unidades de atendimento ao público e ficaram fora do inventário, assim como Hospital Unimed (privado), APAE e Banco de Sangue (conveniados — candidatos a versão futura, ver `outOfScopeButRelevant` no JSON).

## 10. Recomendação de escopo para a v1

**Dá para entregar hoje, com dados confiáveis (núcleo do diretório — Fase 2):**
- As **12 UBSs abertas ao público** com nome, endereço, telefone e código CNES (4 delas já com horário oficial CNES de 2026), + UBS Prisional listada com aviso de acesso restrito.
- A rede especializada com dados completos: **CRE, CEO, CAPS II, CAPS AD, CAPSi, SAE, Farmácia Central, NUVEPI** (endereço + telefone + horário, tudo `official-recent`).
- **FHSTE** e **Hospital de Caridade** com endereço/telefone.
- **Canais de emergência:** SAMU 192 em destaque permanente (briefing §2), 193, Ambulância Cidadã 160, Ouvidoria 136 e contato da Secretaria.
- O conceito de **"hub"** (UMRS e Santo Dal Bosco) como padrão de UI.

**Entregar com selo "confirmar antes de ir" (proveniência exposta na UI):** horários `unverified` das demais UBSs e do PA — exibir "horário não confirmado · ligue antes" em vez de omitir a unidade. Isso transforma a limitação em honestidade visível, que é o valor nº 1 do produto.

**Adiar:** "qual minha unidade por bairro" (depende da territorialização — item crítico nº 3), página da UBS Novo Atlântico como unidade ativa (está em obra; pode aparecer como "em breve"), e qualquer menção a serviços do Hospital de Caridade além de "hospital geral".

**Próximo passo sugerido antes da Fase 1:** uma rodada única de verificação por telefone (itens críticos 1–4) + extração das coordenadas (§7). Com isso, a Fase 1 (fundação técnica) começa sem retrabalho de pesquisa.

## 11. Critérios de conclusão da etapa — checagem

| Critério | Status |
|---|---|
| Toda unidade citada pela prefeitura ou pelo CNES (rede pública) presente no JSON | ✅ 39 unidades, incluindo desativada/incertas com status explícito |
| Cada campo volátil com fonte + confiança + data (ou `unverified`) | ✅ Padrão aplicado a telefone, horário, serviços e abrangência |
| Coordenadas presentes ou marcadas `geocode-manually` | ✅ Todas `geocode-manually`, com plano de extração documentado (§7) |
| Taxonomia de serviços documentada | ✅ §6 (40 slugs, com decisões de modelagem) |
| Benchmark documentado | ✅ §8 |
| Sem nomes de profissionais de saúde / sem dados pessoais | ✅ Nenhum nome coletado (fichas CNES exibem gerentes — campo deliberadamente ignorado) |
| Dois arquivos prontos para o conhecimento do projeto | ✅ `unidades-saude-erechim.json` + este relatório |

— Fim —
