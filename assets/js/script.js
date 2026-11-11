// 🚨 Função Auto-Invocada (IIFE)
(function () {
    // ==========================================
    // AUDIO ENGINE - SONS SUAVES E MODERNOS (CORRIGIDO)
    // ==========================================
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function initAudio() {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    // ==========================================
    // ESTADOS GLOBAIS E CONFIGURAÇÕES SALVAS (LocalStorage)
    // ==========================================
    const CONFIG_KEY = "lstechinfo_infosec_config";
    let config = { sound: true, effects: false, theme: 'dark' };

    try {
        const savedConfig = localStorage.getItem(CONFIG_KEY);
        if (savedConfig) config = JSON.parse(savedConfig);
    } catch (e) { console.warn("Aviso: LocalStorage indisponível.", e); }

    let isSoundEnabled = config.sound;
    let isEffectsEnabled = config.effects;

    if (config.theme === 'light') {
        document.body.removeAttribute("data-theme");
        document.getElementById("theme-toggle").querySelector('.icon').textContent = "🌙";
    }

    if (!isEffectsEnabled) {
        document.body.classList.add("no-effects");
        document.getElementById("effects-toggle").classList.add("muted");
    } else {
        document.body.classList.remove("no-effects");
        document.getElementById("effects-toggle").classList.remove("muted");
    }

    if (!isSoundEnabled) {
        document.getElementById("sound-toggle").classList.add("muted");
    }

    function saveConfig() {
        try {
            config.sound = isSoundEnabled;
            config.effects = isEffectsEnabled;
            config.theme = document.body.hasAttribute("data-theme") ? 'dark' : 'light';
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        } catch (e) { }
    }

    // ==========================================
    // SISTEMA DE TOAST E MODAL (CRIADOR)
    // ==========================================
    const toastContainer = document.getElementById("toast-container");
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = `>_ ${message}`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("hide");
            toast.addEventListener("animationend", () => toast.remove());
        }, 2500);
    }

    const aboutBtn = document.getElementById("about-creator-btn");
    const creatorModal = document.getElementById("creator-modal");
    const closeModalBtn = document.getElementById("close-creator-modal");

    if (aboutBtn && creatorModal && closeModalBtn) {
        aboutBtn.addEventListener("click", () => {
            playSound('pop');
            creatorModal.classList.add("active");
            if (headerActions.classList.contains("open")) {
                headerActions.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            }
        });

        closeModalBtn.addEventListener("click", () => {
            playSound('pop');
            creatorModal.classList.remove("active");
        });

        creatorModal.addEventListener("click", (e) => {
            if (e.target === creatorModal) {
                playSound('pop');
                creatorModal.classList.remove("active");
            }
        });
    }

    // ==========================================
    // MENU HAMBÚRGUER (MOBILE)
    // ==========================================
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const headerActions = document.getElementById("header-actions");

    if (mobileMenuBtn && headerActions) {
        mobileMenuBtn.addEventListener("click", () => {
            const isOpen = headerActions.classList.contains("open");
            if (isOpen) {
                headerActions.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            } else {
                headerActions.classList.add("open");
                mobileMenuBtn.setAttribute("aria-expanded", "true");
            }
            playSound('pop');
        });

        document.addEventListener("click", (e) => {
            if (headerActions.classList.contains("open") && !headerActions.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                headerActions.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // ==========================================
    // CONTROLES DE INTERFACE E AUDIO (SUAVE)
    // ==========================================
    function playSound(type) {
        if (!isSoundEnabled) return;
        initAudio();
        const now = audioCtx.currentTime;

        if (type === 'pop') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.05);
        } else if (type === 'correct') {
            [800, 1200].forEach((freq, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.type = 'triangle';
                o.frequency.value = freq;
                g.gain.setValueAtTime(0, now + i * 0.1);
                g.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.02);
                g.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.15);
                o.connect(g); g.connect(audioCtx.destination);
                o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.15);
            });
        } else if (type === 'wrong') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(150, now + 0.3);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'victory') {
            [440, 554, 659, 880].forEach((freq, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.type = 'sine';
                o.frequency.value = freq;
                g.gain.setValueAtTime(0, now + i * 0.1);
                g.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.03);
                g.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.3);
                o.connect(g); g.connect(audioCtx.destination);
                o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.3);
            });
        }
    }

    const soundToggleBtn = document.getElementById("sound-toggle");
    const effectsToggleBtn = document.getElementById("effects-toggle");
    const themeToggleBtn = document.getElementById("theme-toggle");

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener("click", () => {
            isSoundEnabled = !isSoundEnabled;
            if (isSoundEnabled) {
                soundToggleBtn.classList.remove("muted");
                showToast("Áudio: ONLINE");
                playSound('pop');
            } else {
                soundToggleBtn.classList.add("muted");
                showToast("Áudio: OFFLINE");
            }
            saveConfig();
        });
    }

    if (effectsToggleBtn) {
        effectsToggleBtn.addEventListener("click", () => {
            isEffectsEnabled = !isEffectsEnabled;
            if (isEffectsEnabled) {
                effectsToggleBtn.classList.remove("muted");
                document.body.classList.remove("no-effects");
                showToast("Efeitos Visuais: ONLINE");
                playSound('pop');
            } else {
                effectsToggleBtn.classList.add("muted");
                document.body.classList.add("no-effects");
                showToast("Efeitos Visuais: OFFLINE");
                playSound('pop');
            }
            saveConfig();
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            playSound('pop');
            const icon = themeToggleBtn.querySelector('.icon') || themeToggleBtn;
            icon.classList.add("spin-icon");
            setTimeout(() => icon.classList.remove("spin-icon"), 400);

            if (document.body.hasAttribute("data-theme")) {
                document.body.removeAttribute("data-theme");
                setTimeout(() => icon.textContent = "🌙", 150);
                showToast("Modo Claro Ativado");
            } else {
                document.body.setAttribute("data-theme", "dark");
                setTimeout(() => icon.textContent = "☀️", 150);
                showToast("Modo Escuro Ativado");
            }
            saveConfig();
        });
    }

    // ==========================================
    // DETECÇÃO INTELIGENTE DE TECLADO FÍSICO
    // ==========================================
    window.addEventListener('keydown', function detectKeyboard(e) {
        if (e.key !== 'Unidentified' && !document.body.classList.contains('keyboard-active')) {
            document.body.classList.add('keyboard-active');
            window.removeEventListener('keydown', detectKeyboard);
        }
    });

    // ==========================================
    // SISTEMA ANTI-CHEAT (REFINADO)
    // ==========================================
    document.addEventListener('contextmenu', event => event.preventDefault());

    document.addEventListener('copy', event => {
        event.preventDefault();
        showToast("ACESSO NEGADO: Cópia restrita.");
    });
    document.addEventListener('cut', event => event.preventDefault());
    document.addEventListener('paste', event => event.preventDefault());
    document.addEventListener('dragstart', event => event.preventDefault());

    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
            (e.ctrlKey && (e.key === 'S' || e.key === 's')) ||
            (e.ctrlKey && (e.key === 'P' || e.key === 'p'))
        ) {
            e.preventDefault();
        }
    });

    // ==========================================
    // BANCO DE QUESTÕES - ENGENHARIA DE SOFTWARE (OUTPUTS TÉCNICOS AVANÇADOS)
    // ==========================================
    const questions = [
        {
            question: "1. Uma empresa de desenvolvimento utiliza um repositório Git compartilhado. Os programadores realizam alterações frequentes e precisam identificar rapidamente problemas de integração. Qual prática atende melhor a essa necessidade?",
            options: [
                "Integração contínua com execução automatizada de verificações.",
                "Integração exclusiva ao final de cada semestre.",
                "Eliminação do controle de versões.",
                "Publicação direta sem testes.",
                "Substituição do repositório por arquivos locais."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG DE ARQUITETURA]</b> A alternativa correta é a <b>A</b>. A <i>Continuous Integration</i> (CI) foi concebida para mitigar o clássico 'Integration Hell'. Ao forçar commits frequentes para a branch principal (trunk-based development) aliados a pipelines automatizados de build e teste, a equipe detecta regressões e conflitos de merge de forma precoce, reduzindo drasticamente o ciclo de feedback técnico."
        },
        {
            question: "2. Uma equipe responsável pela qualidade de software deve realizar um teste de validação com usuários finais em seus ambientes reais de utilização, sem a presença constante dos desenvolvedores. Os problemas encontrados serão posteriormente comunicados à equipe técnica. O procedimento descrito caracteriza:",
            options: [
                "Teste unitário.",
                "Teste de integração.",
                "Teste alfa.",
                "Teste de regressão.",
                "Teste beta."
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE QUALIDADE]</b> A alternativa correta é a <b>E</b>. Os Testes Beta operam como avaliações 'Black Box' no ambiente de produção real (wild environment). Diferente do Teste Alfa (laboratório in-house), o Beta expõe o software à variabilidade de hardware, redes e comportamentos reais dos usuários (crowdsourcing de QA) antes do lançamento oficial (General Availability)."
        },
        {
            question: "3. Uma empresa desenvolve um sistema bancário cujos requisitos são conhecidos, estáveis e formalmente documentados. A instituição exige a conclusão de cada etapa antes do início da próxima. Qual modelo de desenvolvimento apresenta maior compatibilidade com esse cenário?",
            options: [
                "Modelo evolucionário.",
                "Modelo em Cascata.",
                "Scrum.",
                "Prototipação descartável.",
                "Extreme Programming."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE METODOLOGIA]</b> A alternativa correta é a <b>B</b>. O modelo em Cascata (Waterfall) impõe um ciclo de vida estritamente preditivo e sequencial, baseando-se no conceito de BDUF (Big Design Up Front). Ele é altamente eficaz apenas em domínios de escopo engessado, criticidade regulatória (como bancos tradicionais) e requisitos imutáveis, onde o custo de alteração tardia não é um problema frequente."
        },
        {
            question: "4. Considere as afirmativas sobre um plano de gerenciamento de configurações.\n\nI. Deve identificar os itens de configuração que serão controlados.\nII. Deve estabelecer procedimentos e responsabilidades para o controle de mudanças.\nIII. Deve definir ferramentas e procedimentos para registrar e acompanhar versões.",
            options: [
                "I, apenas.",
                "II, apenas.",
                "I e III, apenas.",
                "I, II e III.",
                "II e III, apenas."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE SCM]</b> A alternativa correta é a <b>D</b>. O Gerenciamento de Configuração de Software (SCM) atua como o alicerce da governança técnica de um projeto. Ele exige a definição dos CIs (Configuration Items), a instituição de um CCB (Change Control Board) para avaliar impactos e a padronização de ferramentas (ex: Git, Jira) para garantir a integridade da baseline e auditoria completa."
        },
        {
            question: "5. Uma organização desenvolve um sistema de atendimento ao público. Apesar de executar corretamente suas funcionalidades, os usuários enfrentam dificuldades para compreender mensagens e localizar informações. O atributo de qualidade mais diretamente comprometido é:",
            options: [
                "Portabilidade.",
                "Confiabilidade.",
                "Usabilidade.",
                "Interoperabilidade.",
                "Eficiência energética."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE UX/QA]</b> A alternativa correta é a <b>C</b>. Pela norma ISO/IEC 25010 (Modelos de Qualidade), a Usabilidade mede o grau em que um produto pode ser usado para atingir metas com eficácia, eficiência e satisfação. Uma interface opaca com alta fricção cognitiva compromete a curva de aprendizado (Learnability) e a operabilidade sistêmica."
        },
        {
            question: "6. Uma equipe utiliza Scrum em Sprints de um mês. O gerente solicita que sejam respeitados os limites máximos de duração da Daily Scrum e da Sprint Retrospective. Quais são esses limites, respectivamente?",
            options: [
                "15 minutos e 3 horas.",
                "30 minutos e 8 horas.",
                "15 minutos e 8 horas.",
                "1 hora e 4 horas.",
                "5 minutos e 2 horas."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG AGILE]</b> A alternativa correta é a <b>A</b>. O framework Scrum utiliza <i>timeboxes</i> estritas para manter o foco e evitar o antipadrão de 'reuniões infinitas'. Segundo o Scrum Guide, a Daily Scrum dura fixamente 15 minutos (independentemente do tamanho da Sprint), enquanto a Sprint Retrospective recebe um limite proporcional de no máximo 3 horas para Sprints de 4 semanas."
        },
        {
            question: "7. Uma empresa pretende medir a confiabilidade de um software utilizado em operações financeiras. Entre os indicadores disponíveis, qual está mais diretamente relacionado a esse atributo?",
            options: [
                "Quantidade de telas.",
                "Tamanho dos arquivos-fonte.",
                "Quantidade de cores da interface.",
                "Número de classes do projeto.",
                "Frequência e severidade das falhas."
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE SRE]</b> A alternativa correta é a <b>E</b>. A Confiabilidade (Reliability) no contexto de Engenharia de Confiabilidade de Sites (SRE) é mensurada operacionalmente através do rastreio de incidentes. Métricas como MTBF (Tempo Médio Entre Falhas) baseadas na frequência dos erros, aliadas à análise de impacto técnico e financeiro (severidade), definem o SLA/SLO real do software financeiro."
        },
        {
            question: "8. Uma aplicação funciona corretamente no computador do desenvolvedor, mas apresenta problemas quando executada em outro ambiente devido a diferenças nas dependências instaladas. Qual prática contribui diretamente para reduzir esse problema?",
            options: [
                "Eliminar a documentação técnica.",
                "Utilizar imagens de contêineres com dependências definidas.",
                "Executar os testes apenas em produção.",
                "Impedir o versionamento do projeto.",
                "Remover os ambientes de homologação."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE INFRA]</b> A alternativa correta é a <b>B</b>. O cenário descreve a famosa anomalia 'Na minha máquina funciona'. A conteinerização (ex: Docker) soluciona isso encapsulando a aplicação, o runtime, as bibliotecas de sistema e as variáveis de ambiente em um artefato imutável, garantindo a paridade técnica entre os ambientes de Dev, Staging e Prod."
        },
        {
            question: "9. A Engenharia de Software é frequentemente representada como uma tecnologia em camadas, composta por qualidade, processos, métodos e ferramentas. Qual elemento constitui a base dessa representação?",
            options: [
                "Ferramentas.",
                "Métodos.",
                "Infraestrutura de hardware.",
                "Foco na qualidade.",
                "Linguagem de programação."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE FUNDAMENTOS]</b> A alternativa correta é a <b>D</b>. Na literatura canônica de Pressman, a Engenharia de Software repousa sobre o pilar fundamental do 'Foco na Qualidade' (TQM). Sem um compromisso cultural com a qualidade, de nada adianta implementar processos robustos (2ª camada), métodos técnicos (3ª camada) ou ferramentas tecnológicas avançadas (4ª camada)."
        },
        {
            question: "10. Uma equipe de desenvolvimento utiliza um sistema de gerenciamento de versões. Considere as afirmativas.\n\nI. O versionamento permite acompanhar diferentes versões dos componentes.\nII. Sistemas de versionamento impedem obrigatoriamente que desenvolvedores trabalhem simultaneamente no mesmo componente.\nIII. Alguns sistemas utilizam mecanismos de armazenamento de diferenças entre versões para otimizar espaço.",
            options: [
                "II, apenas.",
                "I e II, apenas.",
                "I e III, apenas.",
                "II e III, apenas.",
                "I, II e III."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE VERSIONAMENTO]</b> A alternativa correta é a <b>C</b>. Sistemas modernos de controle de versão (como Git) descartaram o antigo paradigma restritivo de 'File Locking' (exclusividade forçada), permitindo modelagem concorrente via branchs/merges (refutando a II). O uso de algoritmos de compressão de deltas (diffs) é padrão na indústria para preservar armazenamento eficiente (III)."
        },
        {
            question: "11. Uma empresa decidiu utilizar um pipeline para construir, testar e preparar automaticamente novas versões de seu software. A publicação em produção, entretanto, depende da autorização de um responsável. Essa prática corresponde predominantemente a:",
            options: [
                "Entrega contínua.",
                "Implantação contínua sem intervenção.",
                "Ausência de automação.",
                "Teste alfa.",
                "Prototipação evolutiva."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG DE DEVOPS]</b> A alternativa correta é a <b>A</b>. O processo descreve a <i>Continuous Delivery</i> (Entrega Contínua). O artefato de software passa automaticamente por build, testes e fica armazenado de forma estável, pronto para produção. O <i>deploy</i> real para os usuários aguarda um acionador manual (Release Gate), ao contrário da <i>Continuous Deployment</i>, que empurra diretamente para produção sem fricção humana."
        },
        {
            question: "12. A respeito das métricas de qualidade de software, considere um programa com diversos caminhos de execução e estruturas condicionais. A métrica de complexidade ciclomática é utilizada principalmente para:",
            options: [
                "Determinar a quantidade de usuários simultâneos.",
                "Medir a velocidade da rede.",
                "Calcular o custo de licenciamento.",
                "Contar os caracteres da documentação.",
                "Avaliar a complexidade do fluxo de controle e apoiar a definição de testes."
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE METRIFICAÇÃO]</b> A alternativa correta é a <b>E</b>. A Complexidade Ciclomática (métrica de McCabe) utiliza grafos matemáticos (nós e arestas) para contabilizar o número de caminhos lógicos independentes no código-fonte. Códigos com alta complexidade ciclomática têm alta densidade de bugs e são difíceis de manter. Ela baliza estrategicamente o planejamento de testes de caixa-branca (Basis Path Testing)."
        },
        {
            question: "13. Uma empresa mantém um sistema de gestão hospitalar que sofre alterações frequentes. A direção exige que cada modificação seja identificada, analisada e rastreada. O principal objetivo do gerenciamento de configurações é:",
            options: [
                "Impedir qualquer modificação após a implantação.",
                "Garantir controle, rastreabilidade e integridade das mudanças.",
                "Eliminar a necessidade de testes.",
                "Reduzir obrigatoriamente o número de requisitos.",
                "Substituir o planejamento do projeto."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE SCM]</b> A alternativa correta é a <b>B</b>. Sistemas críticos de missão (como o setor de saúde) demandam governança estrita. A Gestão de Configuração não paralisa as mudanças (o que mataria a evolução do produto), mas as orquestra ordenadamente. Ela fornece uma trilha de auditoria transparente ligando cada commit a uma issue formal (rastreabilidade end-to-end)."
        },
        {
            question: "14. Uma equipe adota um modelo de desenvolvimento sequencial. As atividades são organizadas em análise de requisitos, projeto, implementação, testes, implantação e manutenção. Essa organização corresponde predominantemente ao:",
            options: [
                "Scrum.",
                "Kanban.",
                "Modelo Espiral.",
                "Modelo Cascata.",
                "Desenvolvimento orientado a testes."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE METODOLOGIA]</b> A alternativa correta é a <b>D</b>. Apresentado inicialmente por Winston Royce, o Modelo Cascata define um processo linear guiado por documentos. Cada fase deve passar por revisões formais de aprovação (sign-offs) antes de despachar seus artefatos para a fase seguinte. É uma engenharia determinística pesada, oposta à iteratividade dos métodos ágeis."
        },
        {
            question: "15. Uma indústria utiliza sistemas computacionais para classificar produtos e controlar equipamentos robóticos de diferentes fabricantes. Após substituir um equipamento, a comunicação com o novo dispositivo permanece funcional. O atributo de qualidade diretamente evidenciado pela capacidade de comunicação entre sistemas diferentes é:",
            options: [
                "Usabilidade.",
                "Manutenibilidade.",
                "Interoperabilidade.",
                "Estética da interface.",
                "Testabilidade."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE ARQUITETURA]</b> A alternativa correta é a <b>C</b>. Interoperabilidade é a característica crucial de sistemas distribuídos heterogêneos. Por meio da adesão a protocolos de comunicação universais e contratos de APIs abertas (REST, gRPC, MQTT), diferentes hardwares e softwares conseguem interagir com baixo nível de acoplamento técnico."
        },
        {
            question: "16. Um projeto utiliza GitHub Actions para executar automaticamente testes sempre que um desenvolvedor envia alterações ao repositório. Qual elemento de um workflow define os eventos responsáveis pelo acionamento da automação?",
            options: [
                "on.",
                "runs-on.",
                "steps.",
                "name.",
                "permissions."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG DE CI/CD]</b> A alternativa correta é a <b>A</b>. No ecossistema YAML do GitHub Actions, a declaração de infraestrutura como código exige a chave `on:` para definir os triggers (gatilhos) que despertarão os runners computacionais. Esses eventos podem ser um `push` de branch, uma abertura de `pull_request` ou rotinas agendadas (CRON jobs)."
        },
        {
            question: "17. Uma equipe desenvolve um aplicativo utilizando Scrum. Durante a Sprint, os desenvolvedores identificam obstáculos que podem comprometer o Sprint Goal. Qual conduta está alinhada ao Scrum?",
            options: [
                "Cancelar obrigatoriamente a Sprint diante de qualquer obstáculo.",
                "Transferir toda a responsabilidade ao Product Owner.",
                "Aguardar a retrospectiva para discutir os problemas.",
                "Eliminar a Daily Scrum.",
                "Inspecionar o progresso e adaptar o plano de trabalho para alcançar o objetivo da Sprint."
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG AGILE]</b> A alternativa correta é a <b>E</b>. A Daily Scrum serve exatemente como fórum tático para a equipe inspecionar o andamento rumo ao Sprint Goal e adaptar o Sprint Backlog. Sendo auto-gerenciáveis (Self-Managing), os Developers realizam manobras contínuas de escopo diário para superar gargalos imediatos em vez de abdicar do ciclo."
        },
        {
            question: "18. Uma organização deseja avaliar a capacidade de manutenção de seu software. O sistema possui código altamente acoplado, funções extensas e documentação insuficiente. Qual iniciativa tende a melhorar sua manutenibilidade?",
            options: [
                "Aumentar as dependências entre módulos.",
                "Refatorar o código, melhorar a modularidade e manter documentação adequada.",
                "Eliminar os testes automatizados.",
                "Concentrar todas as funcionalidades em um único módulo.",
                "Impedir alterações futuras."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE ENGENHARIA]</b> A alternativa correta é a <b>B</b>. Códigos fortemente acoplados causam o 'efeito cascata' (mudanças simples geram bugs remotos). A adoção de práticas como Refatoração Clean Code e Design Patterns reduz o acoplamento sistêmico e eleva a coesão interna. Isso diminui a complexidade técnica e abaixa sensivelmente os custos de suporte."
        },
        {
            question: "19. Uma equipe pretende automatizar a verificação de um sistema de cadastro de pacientes. O objetivo é identificar se alterações recentes comprometeram funcionalidades anteriormente aprovadas. Qual modalidade de teste atende diretamente a essa necessidade?",
            options: [
                "Teste de instalação exclusivamente manual.",
                "Teste de aceitação sem critérios.",
                "Teste de carga apenas.",
                "Teste de regressão.",
                "Teste exploratório sem registro."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE QUALIDADE]</b> A alternativa correta é a <b>D</b>. Em pipelines modernos, o Teste de Regressão automatizado funciona como um escudo contra instabilidades colaterais geradas por refatorações ou novas features. Sua execução diária e completa revalida o comportamento basal (baseline), atestando que código novo não quebra comportamento legado."
        },
        {
            question: "20. Um sistema acadêmico foi desenvolvido com requisitos funcionais corretamente implementados. Entretanto, apresenta lentidão significativa quando centenas de estudantes acessam a plataforma simultaneamente. Qual atributo de qualidade está mais diretamente relacionado ao problema?",
            options: [
                "Portabilidade.",
                "Compatibilidade visual.",
                "Eficiência de desempenho.",
                "Rastreabilidade documental.",
                "Facilidade de instalação."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE SISTEMAS]</b> A alternativa correta é a <b>C</b>. O sistema cumpre as métricas de validação funcional, mas falha gravemente no cumprimento de requisitos não-funcionais (NFRs). A Eficiência de Desempenho monitora métricas sistêmicas críticas como <i>Throughput</i> (vazão de acesso), uso limpo de CPU/RAM e latência (Time-to-First-Byte) sob cargas simultâneas."
        },
        {
            question: "21. Uma equipe utiliza controle de versão, controle de mudanças e integração contínua como práticas de apoio ao desenvolvimento. Qual alternativa relaciona corretamente essas práticas?",
            options: [
                "O controle de versão acompanha versões; o controle de mudanças gerencia solicitações e alterações; a integração contínua verifica alterações integradas frequentemente.",
                "O controle de versão substitui os testes; o controle de mudanças elimina os requisitos; a integração contínua identifica usuários.",
                "O controle de versão publica automaticamente; o controle de mudanças impede alterações; a integração contínua substitui o Git.",
                "As três práticas possuem exatamente a mesma finalidade.",
                "A integração contínua ocorre exclusivamente após a implantação definitiva."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG AGILE CI]</b> A alternativa correta é a <b>A</b>. Elas formam a tríade da excelência em SCM: (1) VCS (ex: Git) cria os checkpoints técnicos. (2) Change Control (ex: Jira Issue) orquestra a justificativa e os metadados de negócios da tarefa. (3) O servidor de CI (Jenkins, GitHub Actions) faz a soldagem técnica e validação binária de todos os componentes unificados."
        },
        {
            question: "22. Uma equipe trabalha em um sistema de vendas utilizando Git. Dois desenvolvedores alteram a mesma região de um arquivo e, durante a integração, surge um conflito. Qual procedimento é mais adequado?",
            options: [
                "Excluir permanentemente uma das branches.",
                "Desativar o histórico do repositório.",
                "Publicar ambas as versões sem verificação.",
                "Remover o arquivo conflitante.",
                "Analisar as alterações, resolver o conflito e validar o resultado antes de concluir a integração."
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE VERSIONAMENTO]</b> A alternativa correta é a <b>E</b>. O `Merge Conflict` ocorre quando o algoritmo diferencial do Git não consegue sobrepor hashes automaticamente. É imperativo que os engenheiros abram o arquivo modificado localmente, executem a intervenção manual, discutam a lógica de sobreposição correta e executem o commit sintético de resolução após rodar os testes localmente."
        },
        {
            question: "23. Uma empresa pretende adotar práticas DevOps para reduzir atrasos nas entregas. A direção acredita que a instalação de uma ferramenta de automação será suficiente para alcançar esse objetivo. Essa interpretação é inadequada porque:",
            options: [
                "DevOps dispensa qualquer ferramenta tecnológica.",
                "DevOps também envolve colaboração, cultura organizacional, automação e melhoria contínua.",
                "DevOps é aplicável exclusivamente a projetos de pequeno porte.",
                "DevOps proíbe o uso de métodos ágeis.",
                "DevOps elimina a necessidade de profissionais de operações."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DEVOPS]</b> A alternativa correta é a <b>B</b>. DevOps é frequentemente mal compreendido como sendo apenas 'usar AWS e Kubernetes'. O movimento DevOps se sustenta no modelo conceitual C.A.L.M.S (Culture, Automation, Lean, Measurement, Sharing). Antes dos hard-skills, ele preza pela destruição dos silos corporativos entre o time de Desenvolvedores (Dev) e Infraestrutura/Operações (Ops)."
        },
        {
            question: "24. Um sistema de atendimento médico recebe novas funcionalidades mensalmente. Para reduzir falhas, a equipe implementa testes unitários e de integração. A principal diferença entre essas modalidades é:",
            options: [
                "Testes unitários são realizados somente pelos usuários finais.",
                "Testes de integração avaliam exclusivamente a interface visual.",
                "Testes unitários dispensam critérios de aceitação.",
                "Testes unitários verificam componentes isolados, enquanto testes de integração avaliam suas interações.",
                "Testes de integração substituem todas as demais verificações."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE QUALIDADE]</b> A alternativa correta é a <b>D</b>. Observando a Pirâmide de Testes (Mike Cohn), Testes Unitários formam a base granular: rápidos, independentes, isolados via Mocks/Stubs, cobrindo classes individuais. Ao subir a pirâmide, os Testes de Integração focam na camada de contato: avaliam como banco de dados, APIs e sub-sistemas conversam sem colapso estrutural."
        },
        {
            question: "25. Uma empresa deseja adotar uma metodologia que permita visualizar tarefas, limitar o trabalho em progresso e identificar gargalos, sem exigir Sprints com duração fixa. Qual abordagem é mais adequada?",
            options: [
                "Modelo Cascata.",
                "Prototipação descartável.",
                "Kanban.",
                "Modelo em V.",
                "Programação estruturada."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG AGILE]</b> A alternativa correta é a <b>C</b>. Importada da manufatura Lean (Toyota), o método Kanban oferece um fluxo de desenvolvimento tracionado focado em visualização global (Value Stream) e métricas enxutas (Lead Time e Cycle Time). O uso rígido do limite WIP (Work In Progress) paralisa novos gargalos imediatamente, operando como um modelo reativo e de iteração contínua (sem sprints engessados)."
        },
        {
            question: "26. Uma organização pretende integrar práticas de segurança ao desenvolvimento e à operação de sistemas, incluindo verificações automatizadas de vulnerabilidades no pipeline. Essa abordagem é conhecida como:",
            options: [
                "DevSecOps.",
                "Programação extrema exclusivamente.",
                "Teste beta.",
                "Modelo Cascata.",
                "Engenharia reversa."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG CYBERSEC]</b> A alternativa correta é a <b>A</b>. A filosofia DevSecOps defende a cultura técnica de 'Shift-Left Security'. Em vez de analisar segurança como uma barreira final cara, ferramentas de análise estática (SAST), análise dinâmica (DAST) e escaneamento ativo de dependências são inseridas dentro do processo diário de Continuous Integration da esteira de desenvolvimento."
        },
        {
            question: "27. Uma equipe está preparando a implantação de uma aplicação. Durante a construção do pipeline, um desenvolvedor insere uma credencial de acesso diretamente no arquivo YAML versionado. Qual medida é mais adequada?",
            options: [
                "Manter a credencial porque o repositório é privado.",
                "Publicar a credencial na documentação.",
                "Compartilhar a mesma credencial entre todos os projetos.",
                "Desativar o histórico de commits sem alterar a credencial.",
                "Revogar ou rotacionar a credencial exposta e utilizar gerenciamento seguro de segredos."
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE SEGURANÇA]</b> A alternativa correta é a <b>E</b>. Na Segurança da Informação, credenciais (Tokens, Keys) armazenadas via <i>hard-coded</i> no repositório (VCS) geram um vetor permanente de vazamento no histórico. Uma chave comprometida é tratada como perda total (compromise) e exige revogação forçada no provider. A arquitetura correta exige injeção dinâmica por serviços dedicados como Vault ou AWS Secrets Manager."
        },
        {
            question: "28. Um sistema de controle de estoque apresenta falhas após atualizações. A equipe deseja identificar a origem das alterações e restaurar uma versão anterior quando necessário. Qual prática contribui diretamente para essa necessidade?",
            options: [
                "Excluir versões antigas para economizar espaço.",
                "Manter histórico de commits, versões identificadas e procedimentos de reversão.",
                "Impedir a criação de branches.",
                "Eliminar registros de mudanças.",
                "Realizar alterações diretamente em produção sem registro."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE VERSIONAMENTO]</b> A alternativa correta é a <b>B</b>. Um fluxo profissional de controle de versão foca em Resiliência Operacional. Com tags identificadas semânticamente e históricos incrementais robustos, a engenharia garante um MTTR (Mean Time to Recovery) baixíssimo: uma reversão emergencial de branch via `git revert` reintegra o estado seguro do app rapidamente."
        },
        {
            question: "29. Uma empresa desenvolve um software de gestão escolar. A equipe precisa escolher entre modelos de desenvolvimento tradicionais e abordagens ágeis, considerando a possibilidade de alterações frequentes nos requisitos. Qual afirmação é correta?",
            options: [
                "O Cascata elimina completamente os riscos de mudanças.",
                "Métodos ágeis dispensam planejamento e documentação.",
                "Todo projeto deve obrigatoriamente utilizar Scrum.",
                "Abordagens iterativas e ágeis favorecem feedback frequente e adaptação a mudanças.",
                "Modelos tradicionais impedem a realização de testes."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE METODOLOGIA]</b> A alternativa correta é a <b>D</b>. Segundo o preceito mestre do Manifesto Ágil ('Responder a mudanças sobre seguir um plano formal'), as abordagens ágeis (XP, Scrum, Lean) baseiam-se num paradigma de inspeção e adaptação empírica. Dividir a complexidade em iterações orgânicas permite abraçar a inevitável flutuação dos requisitos ditados pelo negócio."
        },
        {
            question: "30. Uma equipe desenvolve um sistema de teleatendimento. O projeto utiliza Git, testes automatizados, pipelines CI/CD e monitoramento em produção. Qual sequência representa adequadamente a integração dessas práticas?",
            options: [
                "Publicar primeiro, registrar alterações depois e testar apenas quando surgirem reclamações.",
                "Eliminar testes para aumentar a frequência das entregas.",
                "Versionar alterações, executar verificações automatizadas, preparar o artefato, implantar conforme os critérios definidos e monitorar o sistema.",
                "Substituir o controle de versão por documentação manual.",
                "Realizar todas as verificações exclusivamente ao final do projeto."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE DEVOPS]</b> A alternativa correta é a <b>C</b>. O fluxo descreve uma <i>Deployment Pipeline</i> canônica e otimizada: Criação (Versionamento/Code) -> CI (Testes/Verificações Automatizadas) -> Delivery (Empacotamento do Artefato) -> Deployment (Implantação com Release Management) -> Operação (Monitoramento via Telemetria/Observability)."
        }
    ];

    const getAnswer = (q) => parseInt(atob(q._k));

    // ==========================================
    // VARIÁVEIS DE ESTADO E DOM PRINCIPAL
    // ==========================================
    const startScreen = document.getElementById("start-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultScreen = document.getElementById("result-screen");
    const startBtn = document.getElementById("start-btn");
    const nextBtn = document.getElementById("next-btn");
    const skipBtn = document.getElementById("skip-btn");
    const restartBtn = document.getElementById("restart-btn");
    const showReviewBtn = document.getElementById("show-review-btn");
    const shareBtn = document.getElementById("share-btn");
    const homeLink = document.getElementById("home-link");
    const questionAreaContainer = document.querySelector(".question-area");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const progressBar = document.getElementById("progress-bar");
    const questionTracker = document.getElementById("question-tracker");
    const quizActions = document.getElementById("quiz-actions");
    const explanationContainer = document.getElementById("explanation-container");
    const explanationText = document.getElementById("explanation-text");
    const scoreText = document.getElementById("score-text");
    const totalText = document.getElementById("total-text");
    const feedbackText = document.getElementById("feedback-text");
    const reviewContainer = document.getElementById("review-container");
    const reviewContent = document.getElementById("review-content");
    const historyContainer = document.getElementById("historico-container");
    const historyScoreText = document.getElementById("historico-acertos");
    const viewPastReviewBtn = document.getElementById("view-past-review-btn");
    const QUIZ_HISTORY_KEY = "lstechinfo_engsoft_simulado2";

    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let isReviewVisible = false;
    let timerInterval;
    let secondsElapsed = 0;
    let isTransitioning = false;

    const iconCheck = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const iconX = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    const iconArrow = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

    // ==========================================
    // LÓGICA DO QUIZ E TRANSIÇÕES SEGURAS
    // ==========================================
    function startTimer() {
        secondsElapsed = 0;
        const timerElement = document.getElementById('quiz-timer');
        if (timerElement) timerElement.textContent = "00:00";
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            secondsElapsed++;
            if (timerElement) {
                const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
                const s = (secondsElapsed % 60).toString().padStart(2, '0');
                timerElement.textContent = `${m}:${s}`;
            }
        }, 1000);
    }
    function stopTimer() { clearInterval(timerInterval); }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12') return;

        if (quizScreen.classList.contains('active')) {
            const key = e.key.toLowerCase();
            const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, '1': 0, '2': 1, '3': 2, '4': 3, '5': 4 };

            if (!quizActions.classList.contains('is-answered')) {
                if (keyMap[key] !== undefined && optionsContainer.children[keyMap[key]]) {
                    e.preventDefault();
                    initAudio();
                    optionsContainer.children[keyMap[key]].click();
                    return;
                }
                if (key === 's') {
                    e.preventDefault();
                    initAudio();
                    skipBtn.click();
                    return;
                }
            } else if (e.code === 'Enter' || e.code === 'ArrowRight') {
                e.preventDefault();
                initAudio();
                if (!nextBtn.classList.contains("hidden-btn")) {
                    nextBtn.click();
                }
                return;
            }
        } else if (startScreen.classList.contains('active') && e.code === 'Enter') {
            e.preventDefault();
            initAudio();
            startBtn.click();
        }
    });

    startBtn.addEventListener("click", () => { playSound('pop'); startQuiz(); });
    nextBtn.addEventListener("click", () => { playSound('pop'); loadNextQuestion(); });
    skipBtn.addEventListener("click", () => { playSound('pop'); skipQuestion(); });
    restartBtn.addEventListener("click", () => { playSound('pop'); resetQuiz(); });
    showReviewBtn.addEventListener("click", () => { playSound('pop'); toggleReview(); });
    if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            playSound('pop');
            exportReport();
        });
    }
    if (viewPastReviewBtn) {
        viewPastReviewBtn.addEventListener("click", () => {
            playSound('pop');
            openStoredReview();
        });
    }
    homeLink.addEventListener("click", () => window.location.reload());

    renderHistoryCard();

    function scrambleText(element, newText) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let iterations = 0;
        const step = Math.max(1, Math.floor(newText.length / 20));

        const interval = setInterval(() => {
            element.innerText = newText.split('').map((letter, index) => {
                if (index < iterations) return newText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');

            if (iterations >= newText.length) {
                element.innerText = newText;
                clearInterval(interval);
            }
            iterations += step;
        }, 30);
    }

    function startQuiz() {
        startScreen.classList.replace("active", "hidden");
        quizScreen.classList.replace("hidden", "active");
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = Array(questions.length).fill(null);
        isTransitioning = false;
        isReviewVisible = false;
        updateScoreUI(0, questions.length);
        progressBar.style.background = `linear-gradient(90deg, var(--primary), var(--accent))`;
        progressBar.style.boxShadow = `0 0 10px var(--primary-glow)`;
        scoreText.classList.remove("pop-success");
        reviewContainer.classList.add("hidden");
        showReviewBtn.textContent = "Ver logs detalhados";
        startTimer();
        renderQuestion();
    }

    function renderQuestion() {
        isTransitioning = false;
        questionAreaContainer.classList.remove("slide-out-left");
        questionAreaContainer.classList.add("slide-in-right");
        quizActions.classList.remove("is-answered");

        nextBtn.classList.add("hidden-btn");
        skipBtn.classList.remove("hidden-btn");

        nextBtn.disabled = false;
        skipBtn.disabled = false;

        explanationContainer.classList.add("hidden");
        explanationContainer.style.display = "none";
        explanationText.innerHTML = "";

        optionsContainer.innerHTML = "";

        const stamp = document.getElementById("access-stamp");
        if (stamp) {
            stamp.classList.remove("show-granted", "show-denied");
            stamp.classList.add("hidden");
        }

        const currentQuestion = questions[currentQuestionIndex];

        if (isEffectsEnabled) {
            scrambleText(questionText, currentQuestion.question);
        } else {
            questionText.innerText = currentQuestion.question;
        }

        questionTracker.textContent = `Varredura de Nó ${currentQuestionIndex + 1} de ${questions.length}`;
        progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;

        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement("button");

            button.setAttribute("role", "radio");
            button.setAttribute("aria-checked", "false");
            button.setAttribute("aria-label", `Opção ${String.fromCharCode(65 + index)}: ${option}`);

            button.innerHTML = `<strong class="opt-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</strong> <span>${option}</span>`;
            button.classList.add("option-btn");

            if (isEffectsEnabled) {
                button.style.opacity = "0";
                button.style.transform = "translateY(10px)";
                button.style.animation = `fadeIn 0.3s ease ${index * 0.08}s forwards`;
            } else {
                button.style.opacity = "1";
                button.style.transform = "none";
                button.style.animation = "none";
            }

            button.addEventListener("click", () => { playSound('pop'); selectAnswer(button, index); });
            optionsContainer.appendChild(button);
        });
    }

    function selectAnswer(selectedButton, selectedIndex) {
        if (isTransitioning || quizActions.classList.contains("is-answered")) return;
        quizActions.classList.add("is-answered");

        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        const correctIndex = getAnswer(currentQuestion);
        const isCorrect = selectedIndex === correctIndex;
        userAnswers[currentQuestionIndex] = selectedIndex;

        explanationText.innerHTML = currentQuestion.explanation;
        explanationContainer.classList.remove("hidden");
        explanationContainer.style.display = "block";

        Array.from(optionsContainer.children).forEach((btn) => {
            btn.disabled = true;
            btn.setAttribute("aria-disabled", "true");
        });
        selectedButton.setAttribute("aria-checked", "true");

        const stamp = document.getElementById("access-stamp");

        if (isCorrect) {
            playSound('correct');
            selectedButton.classList.add("correct");
            if (stamp && isEffectsEnabled) {
                stamp.textContent = "ACESSO CONCEDIDO";
                stamp.classList.remove("hidden");
                stamp.classList.add("show-granted");
                setTimeout(() => stamp.classList.remove("show-granted"), 1500);
            }
        } else {
            playSound('wrong');
            selectedButton.classList.add("wrong");
            if (optionsContainer.children[correctIndex]) {
                optionsContainer.children[correctIndex].classList.add("correct");
            }
            if (stamp && isEffectsEnabled) {
                stamp.textContent = "ACESSO NEGADO";
                stamp.classList.remove("hidden");
                stamp.classList.add("show-denied");
                setTimeout(() => stamp.classList.remove("show-denied"), 1500);
            }
        }

        score = calculateFinalScore();
        const answeredSoFar = userAnswers.filter(answer => answer !== null).length || 1;
        const accuracy = score / answeredSoFar;

        if (accuracy >= 0.8) {
            progressBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            progressBar.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
        } else if (accuracy >= 0.5) {
            progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            progressBar.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.5)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
            progressBar.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.5)';
        }

        skipBtn.classList.add("hidden-btn");
        nextBtn.classList.remove("hidden-btn");

        nextBtn.innerHTML = currentQuestionIndex < questions.length - 1 ? 'Próxima ➔ <span class="kbd-shortcut" aria-hidden="true">(Enter)</span>' : "Descriptografar Relatório";
        nextBtn.focus();
    }

    function skipQuestion() {
        if (isTransitioning || quizActions.classList.contains("is-answered")) return;
        quizActions.classList.add("is-answered");
        userAnswers[currentQuestionIndex] = -1;
        triggerNextAnimation();
    }

    function loadNextQuestion() {
        if (isTransitioning) return;
        triggerNextAnimation();
    }

    function triggerNextAnimation() {
        if (isTransitioning) return;
        isTransitioning = true;
        nextBtn.disabled = true;
        skipBtn.disabled = true;

        if (isEffectsEnabled) {
            questionAreaContainer.classList.remove("slide-in-right");
            questionAreaContainer.classList.add("slide-out-left");
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    renderQuestion();
                } else {
                    stopTimer();
                    showResults();
                }
            }, 300);
        } else {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                renderQuestion();
            } else {
                stopTimer();
                showResults();
            }
        }
    }

    function calculateFinalScore() {
        return questions.reduce((total, q, index) => {
            return total + (userAnswers[index] === getAnswer(q) ? 1 : 0);
        }, 0);
    }

    function updateScoreUI(finalScore, totalQuestions) {
        if (scoreText) scoreText.textContent = String(finalScore);
        if (totalText) totalText.textContent = String(totalQuestions);

        const totalWrapper = totalText ? totalText.parentElement : null;
        if (totalWrapper) {
            totalWrapper.style.whiteSpace = "nowrap";
            totalWrapper.style.display = "inline-flex";
            totalWrapper.style.alignItems = "baseline";
            totalWrapper.style.justifyContent = "center";
            totalWrapper.style.gap = "0.25rem";
        }
    }

    function showResults() {
        startScreen.classList.replace("active", "hidden");
        quizScreen.classList.replace("active", "hidden");
        resultScreen.classList.replace("hidden", "active");
        progressBar.style.width = "100%";

        score = calculateFinalScore();
        updateScoreUI(score, questions.length);

        const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const s = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById('time-total-text').textContent = `${m}m ${s}s`;
        const avg = secondsElapsed > 0 ? (secondsElapsed / questions.length).toFixed(1) : 0;
        document.getElementById('time-avg-text').textContent = `${avg}s`;

        const scoreCircleUI = document.getElementById("score-circle-ui");
        if (scoreCircleUI) scoreCircleUI.classList.remove("gold-glow");
        feedbackText.classList.remove("perfect-score-text");

        if (score === questions.length) {
            feedbackText.textContent = "🏆 Auditoria impecável! Domínio absoluto das metodologias e arquitetura de software!";
            feedbackText.classList.add("perfect-score-text");
            playSound('victory');
            if (scoreCircleUI) scoreCircleUI.classList.add("gold-glow");
            if (typeof confetti === 'function' && isEffectsEnabled) confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#10b981', '#00ff88', '#00cc6a'] });
        } else if (score >= questions.length * 0.7) {
            feedbackText.textContent = "Build resistente! Sua base teórica em Engenharia de Software está bem sólida. 👍";
        } else {
            feedbackText.textContent = "Foram detectadas vulnerabilidades nos seus conhecimentos. Recomendo repassar a matriz de testes. 📚";
        }

        saveQuizHistory();
        generateReviewContent();

        reviewContainer.classList.remove("hidden");
        isReviewVisible = true;
        showReviewBtn.textContent = "Ocultar logs";
        renderHistoryCard();
    }

    function generateReviewContent() {
        reviewContent.innerHTML = "";
        questions.forEach((q, index) => {
            const userAnswerIndex = userAnswers[index];
            const correctIndex = getAnswer(q);
            const isCorrect = userAnswerIndex === correctIndex;
            const skipped = userAnswerIndex === -1;
            const reviewBox = document.createElement("div");
            reviewBox.classList.add("review-item");

            let htmlContent = `<h4>${q.question}</h4><div class="review-ans-group">`;
            if (isCorrect) {
                htmlContent += `<div class="review-ans-text correct">${iconCheck} <span><b>Resposta enviada: ${String.fromCharCode(65 + userAnswerIndex)})</b> ${q.options[userAnswerIndex]}</span></div>`;
            } else if (skipped) {
                htmlContent += `<div class="review-ans-text wrong">${iconX} <span>Questão pulada.</span></div><div class="review-ans-text ref">${iconArrow} <span><b>Resposta correta: ${String.fromCharCode(65 + correctIndex)})</b> ${q.options[correctIndex]}</span></div>`;
            } else if (userAnswerIndex === null || userAnswerIndex === undefined || !q.options[userAnswerIndex]) {
                htmlContent += `<div class="review-ans-text wrong">${iconX} <span>Sem resposta registrada.</span></div><div class="review-ans-text ref">${iconArrow} <span><b>Resposta correta: ${String.fromCharCode(65 + correctIndex)})</b> ${q.options[correctIndex]}</span></div>`;
            } else {
                htmlContent += `<div class="review-ans-text wrong">${iconX} <span><b>Resposta enviada: ${String.fromCharCode(65 + userAnswerIndex)})</b> ${q.options[userAnswerIndex]}</span></div><div class="review-ans-text ref">${iconArrow} <span><b>Resposta correta: ${String.fromCharCode(65 + correctIndex)})</b> ${q.options[correctIndex]}</span></div>`;
            }
            htmlContent += `</div><div class="review-exp"><strong>💡 Output Técnico:</strong><p>${q.explanation}</p></div>`;
            reviewBox.innerHTML = htmlContent;
            reviewContent.appendChild(reviewBox);
        });
    }

    function getStoredHistory() {
        try {
            const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || !Array.isArray(data.answers)) return null;
            return data;
        } catch (error) {
            console.warn("Não foi possível ler o histórico do quiz.", error);
            return null;
        }
    }

    function saveQuizHistory() {
        try {
            const safeAnswers = questions.map((_, index) => {
                const value = userAnswers[index];
                return Number.isInteger(value) ? value : null;
            });

            const payload = {
                score: calculateFinalScore(),
                total: questions.length,
                answers: safeAnswers,
                secondsElapsed,
                completedAt: new Date().toISOString(),
                pageUrl: window.location.href
            };

            localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(payload));
        } catch (error) {
            console.warn("Não foi possível salvar o histórico do quiz.", error);
        }
    }

    function renderHistoryCard() {
        if (!historyContainer || !historyScoreText) return;

        const history = getStoredHistory();
        if (!history) {
            historyContainer.classList.add("hidden");
            return;
        }

        const storedScore = Number.isFinite(Number(history.score)) ? Number(history.score) : 0;
        historyScoreText.textContent = String(storedScore);
        historyContainer.classList.remove("hidden");
    }

    function fillResultScreenFromCurrentState() {
        score = calculateFinalScore();
        updateScoreUI(score, questions.length);

        const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const s = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById('time-total-text').textContent = `${m}m ${s}s`;
        const avg = secondsElapsed > 0 ? (secondsElapsed / questions.length).toFixed(1) : 0;
        document.getElementById('time-avg-text').textContent = `${avg}s`;

        const scoreCircleUI = document.getElementById("score-circle-ui");
        if (scoreCircleUI) scoreCircleUI.classList.remove("gold-glow");
        feedbackText.classList.remove("perfect-score-text");

        if (score === questions.length) {
            feedbackText.textContent = "🏆 Auditoria impecável! Domínio absoluto das metodologias e arquitetura de software!";
            feedbackText.classList.add("perfect-score-text");
            if (scoreCircleUI) scoreCircleUI.classList.add("gold-glow");
        } else if (score >= questions.length * 0.7) {
            feedbackText.textContent = "Build resistente! Sua base teórica em Engenharia de Software está bem sólida. 👍";
        } else {
            feedbackText.textContent = "Foram detectadas vulnerabilidades nos seus conhecimentos. Recomendo repassar a matriz de testes. 📚";
        }

        generateReviewContent();
    }

    function openStoredReview() {
        const history = getStoredHistory();
        if (!history) {
            alert("Ainda não existe um gabarito salvo. Finalize uma simulação primeiro.");
            renderHistoryCard();
            return;
        }

        stopTimer();
        secondsElapsed = Number.isFinite(Number(history.secondsElapsed)) ? Number(history.secondsElapsed) : 0;
        userAnswers = questions.map((_, index) => {
            const value = history.answers[index];
            return Number.isInteger(value) ? value : null;
        });
        currentQuestionIndex = questions.length;
        isTransitioning = false;

        startScreen.classList.replace("active", "hidden");
        quizScreen.classList.replace("active", "hidden");
        quizScreen.classList.add("hidden");
        resultScreen.classList.replace("hidden", "active");

        fillResultScreenFromCurrentState();
        reviewContainer.classList.remove("hidden");
        isReviewVisible = true;
        showReviewBtn.textContent = "Ocultar logs";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function toggleReview() {
        isReviewVisible = !isReviewVisible;
        if (isReviewVisible) {
            reviewContainer.classList.remove("hidden");
            showReviewBtn.textContent = "Ocultar logs";
        } else {
            reviewContainer.classList.add("hidden");
            showReviewBtn.textContent = "Ver logs detalhados";
        }
    }

    // ==========================================
    // EXPORTAÇÃO INTELIGENTE (WHATSAPP + TEXTO DINÂMICO)
    // ==========================================
    async function exportReport() {
        const reportArea = document.getElementById("print-area");
        if (!reportArea) {
            showToast("Erro: Área de relatório não encontrada.");
            return;
        }

        if (typeof html2canvas !== "function") {
            showToast("Erro: Biblioteca html2canvas offline.");
            return;
        }

        const originalHTML = shareBtn.innerHTML;
        shareBtn.disabled = true;
        shareBtn.innerHTML = "Processando pacote...";

        try {
            const finalScore = calculateFinalScore();
            updateScoreUI(finalScore, questions.length);

            const categories = {
                'Metodologias Ágeis e Tradicionais': [2, 5, 13, 16, 24, 28],
                'Controle de Versão e CI/CD': [0, 3, 7, 9, 10, 12, 15, 20, 21, 22, 25, 26, 27, 29],
                'Qualidade e Testes de Software': [1, 4, 6, 8, 11, 14, 17, 18, 19, 23]
            };

            let missedCats = new Set();
            userAnswers.forEach((ans, i) => {
                if (ans !== getAnswer(questions[i])) {
                    for (let cat in categories) {
                        if (categories[cat].includes(i)) missedCats.add(cat);
                    }
                }
            });

            let improvementText = "";
            if (missedCats.size > 0) {
                improvementText = `⚠️ *Identifiquei vulnerabilidades nos seguintes tópicos:*\n- ${Array.from(missedCats).join('\n- ')}\n\n`;
            } else {
                improvementText = `🏆 *Build de sucesso! Nenhuma vulnerabilidade detectada nos tópicos de ES.*\n\n`;
            }

            const pageUrl = window.location.href;
            const shareText = `🛡️ *Relatório de Qualidade | Engenharia de Software (LSTECHINFO TI)* 🛡️\n\n🎯 *Meu Desempenho:* ${finalScore} de ${questions.length} acertos!\n\n${improvementText}🔗 *Acesse o motor e teste seus conhecimentos:* ${pageUrl}`;

            const surfaceColor = getComputedStyle(document.body).getPropertyValue("--surface").trim() || null;
            const canvas = await html2canvas(reportArea, {
                backgroundColor: surfaceColor,
                scale: Math.min(2, window.devicePixelRatio || 1),
                useCORS: true
            });

            const fileName = `simulado-engsoft-${finalScore}-de-${questions.length}.png`;
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1));
            if (!blob) throw new Error("Falha ao renderizar a imagem.");

            const file = new File([blob], fileName, { type: "image/png" });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: "Relatório de Qualidade",
                    text: shareText,
                    files: [file]
                });
                return;
            }

            downloadCanvasImage(canvas, fileName);
            window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(shareText), '_blank');
            showToast("Relatório salvo e texto copiado para o Zap!");

        } catch (error) {
            if (error && (error.name === "AbortError" || error.name === "NotAllowedError")) {
                console.info("Compartilhamento cancelado.");
            } else {
                console.error("Erro no export:", error);
                showToast("Erro ao compartilhar o relatório.");
            }
        } finally {
            shareBtn.disabled = false;
            shareBtn.innerHTML = originalHTML;
        }
    }

    function downloadCanvasImage(canvas, fileName) {
        const imageUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    function resetQuiz() {
        resultScreen.classList.replace("active", "hidden");
        showReviewBtn.textContent = "Ver logs detalhados";
        isReviewVisible = false;
        reviewContainer.classList.add("hidden");
        startQuiz();
    }

    // ==========================================
    // ANIMAÇÃO DE FUNDO (CYBER TOPO)
    // ==========================================
    function initNetworkCanvas() {
        const canvas = document.getElementById('network-bg');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width, height, particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = document.body.hasAttribute('data-theme') ? '#00ff88' : '#94a3b8';
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        function animate() {
            if (!document.body.classList.contains('no-effects')) {
                ctx.clearRect(0, 0, width, height);
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                    for (let j = i; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 120) {
                            ctx.beginPath();
                            ctx.strokeStyle = document.body.hasAttribute('data-theme') ? `rgba(0, 255, 136, ${1 - distance / 120})` : `rgba(148, 163, 184, ${1 - distance / 120})`;
                            ctx.lineWidth = 1;
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            } else {
                ctx.clearRect(0, 0, width, height);
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    window.addEventListener('load', initNetworkCanvas);

})();