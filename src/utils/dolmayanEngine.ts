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
    query.includes('privado')
  ) {
    if (query.includes('rural')) {
      return (
        "🌾 **Planos para Área Rural de Pitanga:**\n\n" +
        "• **Rural Básico:** R$ 2.900/mês — Cobertura de até 1.000.000 m², 2 Drones, link 5G e alertas térmicos.\n" +
        "• **Rural Plus (Mais Popular):** R$ 3.900/mês — Até 2.000.000 m², 3 Drones, link híbrido 5G/Satélite e IA preditiva.\n" +
        "• **Rural Premium:** R$ 5.500/mês — Até 5.000.000 m², 4 Drones, rádio + satélite dedicado e suporte prioritário 24/7."
      );
    }
    if (query.includes('municipio') || query.includes('município') || query.includes('cidade') || query.includes('prefeitura')) {
      return (
        "🏙️ **Planos Municipais (Cobertura Pública):**\n\n" +
        "• **Município Essencial:** R$ 39.900/mês — Cobertura urbana com 16 Drones e integração com Bombeiros/Polícia.\n" +
        "• **Município Completo:** R$ 54.900/mês — Cobertura urbana + periurbana com 24 Drones e relatórios de IA diários.\n" +
        "• **Município Avançado:** R$ 69.900/mês — Cobertura territorial total com 32 Drones e suporte VIP contínuo."
      );
    }
    if (query.includes('privad') || query.includes('empresa') || query.includes('casa') || query.includes('condominio')) {
      return (
        "🏢 **Planos para Área Privada (Comércio/Residencial):**\n\n" +
        "• **Privado Básico:** R$ 390/mês — Até 50.000 m², 2 Drones e transmissão Full HD ao vivo.\n" +
        "• **Privado Plus:** R$ 690/mês — Até 100.000 m², 3 Drones, transmissão térmica + HD e gravação em nuvem.\n" +
        "• **Privado Premium:** R$ 990/mês — Até 200.000 m², 4 Drones, visão noturna IR e rondas agendadas."
      );
    }

    return (
      "💳 **Tabela Resumida de Planos da VAI PITANGA:**\n\n" +
      "• **Área Rural:** Planos de R$ 2.900 a R$ 5.500/mês (atendem de 1 a 5 milhões de m² com telemetria 5G/Satélite).\n" +
      "• **Área Privada:** Planos a partir de R$ 390 a R$ 990/mês para indústrias, comércios e propriedades.\n" +
      "• **Município Inteiro:** Planos municipais integrados de R$ 39.900 a R$ 69.900/mês.\n\n" +
      "Você pode consultar e migrar seu plano diretamente na página **'PLANOS E ASSINATURA'** do sistema!"
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

  // 9. Denúncia Física e Cobertura Municipal
  if (
    query.includes('denúncia') ||
    query.includes('denuncia') ||
    query.includes('denúncia física') ||
    query.includes('denuncia fisica') ||
    query.includes('foz') ||
    query.includes('foz do iguaçu') ||
    query.includes('cobertura') ||
    query.includes('municipio contratado') ||
    query.includes('município contratado')
  ) {
    return (
      "🚨 **Módulo de Denúncia Física Cidadã:**\n\n" +
      "O botão **'🚨 DENÚNCIA FÍSICA'** permite que usuários logados comuniquem flagrantes em tempo real (como furtos de bicicletas, invasões ou queimadas).\n\n" +
      "**Regras de Disponibilidade (O Tcham):**\n" +
      "• **Municípios com Convênio Integral:** Cidadãos em **Pitanga** e **Foz do Iguaçu** possuem cobertura total automática! A mensagem festiva *'Uhuul! Seu município já nos contratou e você pode usar nosso sistema de denúncia!'* é exibida.\n" +
      "• **Área Rural ou Urbana Particular:** Disponível para usuários com propriedades cadastradas no plano Rural ou Urbano.\n" +
      "• **Despacho Imediato:** O sistema calcula a distância de todos os drones em voo, seleciona o **drone mais próximo** e re-roteia sua trajetória de patrulha para sobrevoar o local em segundos!"
    );
  }

  // 10. Resposta Geral / Fallback Inteligente
  return (
    `Entendido! Em relação à sua dúvida sobre "${userPrompt.slice(0, 45)}":\n\n` +
    "O sistema **VAI PITANGA** é uma central autônoma de vigilância aérea. Posso te ajudar com detalhes sobre:\n" +
    "• **Hardware:** DJI Mini 3, painel solar Resun 100W, bateria LiFePO4 e câmeras FLIR.\n" +
    "• **Planos:** Valores para Área Rural (R$ 2.900 a R$ 5.500), Privada (R$ 390 a R$ 990) ou Municipal.\n" +
    "• **Operação:** Protocolo de pouso de emergência com bateria $\\le 18\\%$ e despacho de Bombeiros/Polícia.\n" +
    "• **Equipe EPT:** Papéis dos 6 desenvolvedores de Pitanga.\n\n" +
    "Como posso te orientar melhor?"
  );
}
