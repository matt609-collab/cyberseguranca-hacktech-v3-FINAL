/**
 * Motor de Inferência Local do Robô Dolmayan (Zero API Key / 100% Offline)
 * Especializado na infraestrutura de segurança e monitoramento por drones de Pitanga - PR.
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export function generateDolmayanResponse(userPrompt: string): string {
  const query = userPrompt.toLowerCase().trim();

  // 1. Apresentação e Quem é PIT-AI / Dolmayan
  if (
    query.includes('quem é você') ||
    query.includes('quem e voce') ||
    query.includes('seu nome') ||
    query.includes('pit-ai') ||
    query.includes('pit ai') ||
    query.includes('pitai') ||
    query.includes('dolmayan') ||
    query.includes('o que você faz') ||
    query.includes('o que voce faz')
  ) {
    return (
      "Olá! Eu sou o **PIT-AI**, o assistente de inteligência artificial local da **VAI PITANGA**. " +
      "Minha arquitetura opera localmente no seu navegador (sem depender de conexões ou chaves de API externas) " +
      "para tirar dúvidas operacionais sobre nossa frota de drones solares, planos de monitoramento, procedimentos de segurança e a equipe de desenvolvimento de Pitanga."
    );
  }

  // 2. Drones e Hardware / VAI-PITANGA SOLAR V6
  if (
    query.includes('drone') ||
    query.includes('solar') ||
    query.includes('painel') ||
    query.includes('hardware') ||
    query.includes('mini 3') ||
    query.includes('especificação') ||
    query.includes('especificacao') ||
    query.includes('bateria') ||
    query.includes('lifepo4') ||
    query.includes('mppt') ||
    query.includes('ds18b20')
  ) {
    if (query.includes('bateria') || query.includes('recarga') || query.includes('carregar') || query.includes('autonomia')) {
      return (
        "🔋 **Sistema de Energia e Baterias dos Drones VAI:**\n\n" +
        "• **Bateria Principal:** Módulo LiFePO4 12V 20Ah com alta densidade energética e vida útil superior a 3.000 ciclos.\n" +
        "• **Recarga Solar em Voo:** Painel fotovoltaico Resun 100W montado no dorso, gerenciado por controlador inteligente Epower MPPT 20A.\n" +
        "• **Autonomia Híbrida:** Em dias ensolarados em Pitanga, a geração solar estende o tempo de patrulha contínua.\n" +
        "• **Segurança Automatizada:** Se a carga cair para **18%**, o drone aciona imediatamente o protocolo de retorno e pouso de emergência na base central."
      );
    }

    return (
      "🛸 **Modelo Operacional: VAI-PITANGA SOLAR V6**\n\n" +
      "Nossos drones foram projetados pelo time EPT para substituir o policiamento físico estático por rondas aéreas contínuas:\n\n" +
      "1. **Chassi Base:** DJI Mini 3 modificado com motores brushless de alta eficiência.\n" +
      "2. **Captação Fotovoltaica:** Painel solar Resun de 100W integrado.\n" +
      "3. **Armazenamento:** Bateria segura LiFePO4 12V 20Ah.\n" +
      "4. **Controlador:** Epower MPPT 20A com conversor USB-C PD 30W regulado.\n" +
      "5. **Termografia:** Sensor térmico interno DS18B20 para prevenção de sobreaquecimento.\n" +
      "6. **Câmeras:** FPV Infravermelho 256x192 para visão noturna e Câmera Térmica Dedicada FLIR para detecção de calor."
    );
  }

  // 3. Planos e Assinatura
  if (
    query.includes('plano') ||
    query.includes('preço') ||
    query.includes('preco') ||
    query.includes('valor') ||
    query.includes('quanto custa') ||
    query.includes('contratar') ||
    query.includes('mensal') ||
    query.includes('rural') ||
    query.includes('municipio') ||
    query.includes('município') ||
    query.includes('anac') ||
    query.includes('anvac') ||
    query.includes('privado')
  ) {
    if (query.includes('municipio') || query.includes('município') || query.includes('cidade') || query.includes('prefeitura') || query.includes('anac') || query.includes('anvac')) {
      return (
        "🏛️ **Plano Municipal (Eliminado do Projeto):**\n\n" +
        "O plano municipal foi **completamente eliminado**. A equipe EPT optou por essa pivotagem porque não possuímos conhecimento legislatório aprofundado sobre contratações públicas e não dispomos de licenças regulatórias da ANAC (como certificações BVLOS para voos sobre áreas urbanas densas).\n\n" +
        "Por isso, nosso **foco momentâneo e estratégico é 100% voltado ao Plano Rural**!"
      );
    }

    if (query.includes('privad') || query.includes('urbano') || query.includes('condominio')) {
      return (
        "🏢 **Planos para Área Privada / Urbana (Futuramente):**\n\n" +
        "Este módulo encontra-se **omitido e sem valores definidos**, com status **'Futuramente'**.\n" +
        "O atendimento a condomínios fechados e empresas urbanas será implementado futuramente, assim que o projeto expandir e consolidar as bases na área rural."
      );
    }

    // Explicação do Plano Rural e Estimativa
    return (
      "🌾 **Nosso Foco Atual: Plano e Estimativa Rural**\n\n" +
      "Os valores comerciais fixos foram substituídos por um modelo de **estimativa técnica dimensionada** para fazendas e lavouras:\n\n" +
      "• **Proporção:** 1 profissional técnico operador para cada 4 drones alocados (garantindo resposta e segurança).\n" +
      "• **Conectividade Wi-Fi:** Se a sede da fazenda tiver Wi-Fi, o serviço é isento. Caso contrário, incide uma taxa extra de link satélite/rádio 5.8 GHz.\n" +
      "• **Bases de Carregamento Solar:** Instalação física de docas autônomas Resun 100W + controladores MPPT na propriedade.\n" +
      "• **Manutenção Periódica:** Taxa mensal para revisão de motores, troca de baterias LiFePO4 e calibração das câmeras térmicas FLIR.\n\n" +
      "Você pode simular os custos exatos da sua propriedade no **Simulador Rural** na página de Planos!"
    );
  }

  // 4. Procedimentos de Alerta e Despacho
  if (
    query.includes('alerta') ||
    query.includes('emergencia') ||
    query.includes('emergência') ||
    query.includes('incendio') ||
    query.includes('incêndio') ||
    query.includes('fogo') ||
    query.includes('furto') ||
    query.includes('invasao') ||
    query.includes('invasão') ||
    query.includes('policia') ||
    query.includes('polícia') ||
    query.includes('bombeiro') ||
    query.includes('despachar')
  ) {
    return (
      "🚨 **Protocolo de Resposta a Incidentes da Central:**\n\n" +
      "Quando os sensores do drone detectam uma anomalia em Pitanga:\n" +
      "1. **Análise por IA:** O frame é examinado automaticamente identificando pontos de calor (>600°C) ou movimento de invasor no perímetro.\n" +
      "2. **Sinalização Instantânea:** Um pop-up ao vivo surge na tela com alarme visual piscante e anúncio de áudio acessível.\n" +
      "3. **Ação do Operador:**\n" +
      "   • **🚒 Acionar Bombeiros:** Despacha socorro com coordenadas GPS imediatas do foco térmico.\n" +
      "   • **🚓 Acionar Polícia:** Envia a viatura policial mais próxima para o setor rastreado.\n" +
      "   • **Descartar:** Finaliza o alerta caso seja comprovado falso positivo."
    );
  }

  // 5. Equipe e Desenvolvimento (EPT)
  if (
    query.includes('equipe') ||
    query.includes('time') ||
    query.includes('ept') ||
    query.includes('desenvolvedores') ||
    query.includes('criador') ||
    query.includes('jose') ||
    query.includes('josé') ||
    query.includes('emanuelly') ||
    query.includes('lorena') ||
    query.includes('matheus') ||
    query.includes('thassila')
  ) {
    return (
      "👥 **Equipe de Desenvolvimento EPT (Pitanga - PR):**\n\n" +
      "• **José:** Engenharia de Sistemas (barramento de telemetria e integração dos módulos LiFePO4).\n" +
      "• **Emanuelly:** Engenharia de Software (arquitetura da central em tempo real e rotas autônomas).\n" +
      "• **Lorena:** Gestão de Frota (ciclo de baterias e protocolos de despacho integrado).\n" +
      "• **Matheus C.:** Desenvolvimento Frontend (design tático do Centro de Comando v6.0).\n" +
      "• **Thassila:** Análise de Dados / IA (modelos de visão computacional para detecção de incêndios e furtos).\n" +
      "• **Matheus E.:** Operações de Campo (testes de voo e manutenção técnica dos drones em Pitanga)."
    );
  }

  // 6. Por que Drones em vez de pessoas físicas?
  if (
    query.includes('por que') ||
    query.includes('porque') ||
    query.includes('pessoa física') ||
    query.includes('vigia') ||
    query.includes('guarda') ||
    query.includes('vantagem') ||
    query.includes('vantagens') ||
    query.includes('beneficio') ||
    query.includes('benefício')
  ) {
    return (
      "🛡️ **Vantagens dos Drones sobre a Segurança Física Tradicional:**\n\n" +
      "1. **Risco Zero à Vida Humana:** O operador monitora tudo à distância, sem expor guardas ao perigo direto de assaltos ou focos de fogo.\n" +
      "2. **Velocidade e Alcance:** Um drone atinge velocidades de 45+ km/h em linha reta, cobrindo hectares em minutos sem obstáculos terrestres.\n" +
      "3. **Visão Térmica Noturna:** Enxerga no breu total através do infravermelho e detecta calor de intrusos e princípios de incêndio.\n" +
      "4. **Custo Reduzido e Sustentável:** A energia solar reduz custos de combustível e manutenção contínua."
    );
  }

  // 7. Localização e Pitanga - PR
  if (
    query.includes('pitanga') ||
    query.includes('paraná') ||
    query.includes('parana') ||
    query.includes('bairro') ||
    query.includes('setor') ||
    query.includes('local')
  ) {
    return (
      "📍 **Operação em Pitanga - PR:**\n\n" +
      "O Centro de Comando opera nas coordenadas centrais `-24.7572, -51.7600` e atende todos os setores:\n" +
      "• **Centro** (VAI-01)\n" +
      "• **Vila Nova** (VAI-02)\n" +
      "• **Vila Planalto** (VAI-03)\n" +
      "• **Bairro Industrial** (VAI-04)\n" +
      "• **Jardim Europa** e regiões rurais adjacentes."
    );
  }

  // 8. Como adicionar novos drones
  if (query.includes('adicionar drone') || query.includes('novo drone') || query.includes('adicionar novo')) {
    return (
      "➕ **Para adicionar um novo drone à frota:**\n\n" +
      "No painel lateral direito (**Monitoramento de Frota**), basta clicar no botão amarelo **'➕ ADICIONAR NOVO DRONE'**. " +
      "O sistema alocará automaticamente o próximo prefixo (ex: VAI-05), sorteará um setor patrulhado em Pitanga, inicializará a bateria em 100% e registrará o evento nos logs em tempo real!"
    );
  }

  // 9. Denúncia Física em Propriedades Rurais
  if (
    query.includes('denúncia') ||
    query.includes('denuncia') ||
    query.includes('denúncia física') ||
    query.includes('denuncia fisica') ||
    query.includes('cobertura') ||
    query.includes('fazenda') ||
    query.includes('gado') ||
    query.includes('trator')
  ) {
    return (
      "🚨 **Módulo de Denúncia Física em Propriedades Rurais:**\n\n" +
      "O botão **'🚨 DENÚNCIA FÍSICA'** permite que produtores rurais e operadores autenticados comuniquem ocorrências no campo (como furto de tratores/maquinários, abigeato de gado, invasões de galpão ou focos de queimada).\n\n" +
      "**Funcionamento do Despacho Rural:**\n" +
      "• **Foco Rural:** Atende fazendas cadastradas na malha de Pitanga e região.\n" +
      "• **Despacho Imediato:** O sistema localiza o drone solar com menor tempo de voo (ex: VAI-01), calcula a rota geodésica e envia o drone em velocidade de interceptação (52 km/h) para realizar varredura visual e térmica com câmera FLIR sobre o talhão indicado!"
    );
  }

  // 10. Resposta Geral / Fallback Inteligente
  return (
    `Entendido! Em relação à sua dúvida sobre "${userPrompt.slice(0, 45)}":\n\n` +
    "O sistema **VAI PITANGA** é focado no patrulhamento aéreo de propriedades rurais. Posso te orientar sobre:\n" +
    "• **Hardware:** DJI Mini 3, painel solar Resun 100W, bateria LiFePO4 e câmeras FLIR.\n" +
    "• **Modelo Rural:** Proporção de 1 profissional para 4 drones, taxa de Wi-Fi e bases solares.\n" +
    "• **Pivotagem:** Por que o plano municipal foi cancelado (requisitos ANAC e legislação pública).\n" +
    "• **Denúncia Rural:** Despacho autônomo do drone mais próximo para a fazenda.\n" +
    "• **Equipe EPT:** Papéis dos 6 desenvolvedores de Pitanga.\n\n" +
    "Como posso te orientar melhor?"
  );
}
