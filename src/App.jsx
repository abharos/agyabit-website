import React, { useEffect, useRef, useState } from 'react';

// Brand palette (also configured in tailwind.config.js)
// bg #0D0D1A · primary #2F3E5C · accent #6B7FA0 · ink #E6E8F2

const WebGLBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const vertexShaderSource = `
      attribute vec2 position;
      void main() { gl_Position = vec4(position, 0.0, 1.0); }
    `;

    // Same fbm/beam composition as the template, recolored to electric blue.
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      float noise(vec2 st) {
        vec2 i = floor(st); vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      float fbm(vec2 st) {
        float value = 0.0; float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(st);
          st *= 2.0; amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;

        float beamX = -0.1;
        float dist = abs(p.x - beamX);

        float core = 0.001 / dist;
        core = smoothstep(0.0, 1.0, core);

        float glow = 0.02 / (dist + 0.05);

        vec2 smokeUV = vec2(p.x, p.y - u_time * 0.08);
        float smokeNoise = fbm(smokeUV * 3.0 + vec2(u_time * 0.04, 0.0));
        float smokeScatter = smoothstep(0.8, 0.0, dist);
        float smoke = smokeNoise * smokeScatter * 0.35;

        float pulse = sin(u_time * 1.5) * 0.1 + 0.9;

        vec3 beamColor  = vec3(0.42, 0.50, 0.63);  // accent #6B7FA0 anthracite-blue
        vec3 smokeColor = vec3(0.18, 0.24, 0.36);  // primary #2F3E5C anthracite-blue
        vec3 coreColor  = vec3(1.0, 1.0, 1.0);

        vec3 finalColor = core * coreColor + glow * beamColor * pulse + smoke * smokeColor;
        float edge = smoothstep(1.0, 0.4, abs(p.x)) * smoothstep(1.0, 0.2, abs(p.y));

        gl_FragColor = vec4(finalColor * edge, 1.0);
      }
    `;

    function compileShader(gl, source, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0, -1.0, 1.0, 1.0
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    let animationId;
    const startTime = performance.now();
    function render() {
      const currentTime = performance.now();
      gl.uniform1f(timeLocation, (currentTime - startTime) / 1000);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    }
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full opacity-60"
      width="1568"
      height="1021"
    />
  );
};

const services = [
  {
    icon: 'solar:cpu-bolt-linear',
    title: 'AI Agents',
    body: 'Slimme assistenten die mailen, plannen, opvolgen en informatie ophalen — 24/7 in jouw huisstijl en tone-of-voice.',
  },
  {
    icon: 'solar:routing-2-linear',
    title: 'Workflow Automatisering',
    body: 'Koppelingen tussen je CRM, mail, agenda en documenten. Repetitief werk verdwijnt; jij houdt tijd over voor klanten.',
  },
  {
    icon: 'solar:widget-add-linear',
    title: 'App Ontwikkeling',
    body: 'Maatwerk-tools en interne portals — snel gebouwd op moderne stack. Van prototype naar productie in weken, niet maanden.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Intake & analyse',
    body: 'We bekijken samen je werkproces en wijzen de plekken aan waar AI echt waarde toevoegt.',
  },
  {
    n: '02',
    title: 'Bouwen & integreren',
    body: 'In korte sprints leveren we een werkende oplossing — gekoppeld aan de tools die je al gebruikt.',
  },
  {
    n: '03',
    title: 'Opleveren & optimaliseren',
    body: 'Live gaan, meten, verbeteren. We blijven betrokken zodat de automatisering blijft renderen.',
  },
];

const cases = [
  {
    tag: 'Makelaars',
    title: 'Bezichtigingen op de automaat',
    body: 'AI-agent kwalificeert leads, plant bezichtigingen in en stuurt automatische opvolging na bezoek. Resultaat: meer afspraken, minder telefoontjes.',
  },
  {
    tag: 'Tandartspraktijken',
    title: 'Afspraakbeheer zonder gedoe',
    body: 'No-shows verlagen met slimme reminders en herinplanning. De assistente houdt tijd over voor de stoel, niet de telefoon.',
  },
  {
    tag: 'Rijscholen',
    title: 'Plannen, factureren, communiceren',
    body: 'Van proefles tot examen: alle stappen geautomatiseerd. Leerlingen krijgen sneller antwoord, jij krijgt overzicht.',
  },
];

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(true);

  useEffect(() => {
    setCookieAccepted(typeof window !== 'undefined' && localStorage.getItem('agyabit_cookie_consent') === '1');

    const revealObserver = new IntersectionObserver((entries) => {
      let delay = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('active'), delay);
          delay += 100;
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    const handleMouseMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };
    const cards = document.querySelectorAll('.glow-card');
    cards.forEach((card) => card.addEventListener('mousemove', handleMouseMove));

    const bootTimer = setTimeout(() => setIsBooted(true), 100);

    return () => {
      revealObserver.disconnect();
      cards.forEach((card) => card.removeEventListener('mousemove', handleMouseMove));
      clearTimeout(bootTimer);
    };
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('agyabit_cookie_consent', '1');
    setCookieAccepted(true);
  };

  // Brand mark — stylised "A" inside an anthracite frame. Used in nav + footer.
  const LogoMark = ({ size = 32 }) => (
    <span
      className="inline-flex items-center justify-center border border-[#6B7FA0]/70 bg-[#2F3E5C]/40 shadow-[inset_0_0_8px_rgba(107,127,160,0.25)]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none" stroke="#E6E8F2" strokeWidth="2.4" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M4 20 L12 4 L20 20" />
        <path d="M8 14 L16 14" />
      </svg>
    </span>
  );

  // Reusable CTA button (primary)
  const PrimaryCTA = ({ href, children, icon = 'solar:alt-arrow-right-linear', className = '' }) => (
    <a
      href={href}
      className={`group relative inline-flex items-center justify-center px-7 py-3.5 cursor-pointer overflow-hidden bg-[#2F3E5C]/15 border border-[#6B7FA0]/40 backdrop-blur-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] ${className}`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2F3E5C] transition-all group-hover:w-[6px] group-hover:bg-white shadow-[0_0_10px_rgba(107,127,160,0.6)]" />
      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#2F3E5C] transition-all group-hover:w-[6px] group-hover:bg-white shadow-[0_0_10px_rgba(107,127,160,0.6)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2F3E5C]/0 via-[#6B7FA0]/15 to-[#2F3E5C]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative z-10 text-white font-mono text-xs tracking-widest uppercase flex items-center gap-2">
        {children}
        <iconify-icon icon={icon} class="w-4 h-4" />
      </span>
    </a>
  );

  return (
    <div className={`app-container ${isBooted ? 'app-booted' : ''}`}>
      <WebGLBackground />

      {/* Background beams */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-[1] opacity-70"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="noodle-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path d="M 15,-10 C 15,30 85,70 85,110" fill="none" stroke="rgba(107,127,160,0.06)" strokeWidth="0.1" />
        <path d="M 15,-10 C 15,30 85,70 85,110" fill="none" stroke="#2F3E5C" strokeWidth="0.2" filter="url(#noodle-glow)" strokeDasharray="10 150">
          <animate attributeName="stroke-dashoffset" from="150" to="0" dur="6s" repeatCount="indefinite" />
        </path>
        <path d="M 85,-10 C 85,40 20,60 20,110" fill="none" stroke="rgba(107,127,160,0.06)" strokeWidth="0.1" />
        <path d="M 85,-10 C 85,40 20,60 20,110" fill="none" stroke="#6B7FA0" strokeWidth="0.2" filter="url(#noodle-glow)" strokeDasharray="15 150">
          <animate attributeName="stroke-dashoffset" from="150" to="0" dur="8.5s" repeatCount="indefinite" />
        </path>
        <path d="M 50,-10 C 65,30 35,60 50,110" fill="none" stroke="rgba(107,127,160,0.06)" strokeWidth="0.1" />
        <path d="M 50,-10 C 65,30 35,60 50,110" fill="none" stroke="#2F3E5C" strokeWidth="0.15" filter="url(#noodle-glow)" strokeDasharray="5 100">
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="4.2s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Subtle film grain + scanlines + vignette */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />
      <div className="fixed inset-0 z-[1] pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(107, 127, 160, 0.08) 2px, rgba(107, 127, 160, 0.08) 4px)', backgroundSize: '100% 4px' }} />
      <div className="fixed inset-0 z-[1] pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 0%, #0D0D1A 90%)' }} />

      {/* HUD geometry */}
      <div className="boot-anim-translate-xy fixed bottom-0 left-0 w-3/4 h-[75vh] bg-[#2F3E5C] z-[1] opacity-10 pointer-events-none" style={{ clipPath: 'polygon(0 100%, 0 20%, 80% 100%)', transitionDelay: '0.2s' }} />
      <div className="boot-anim-translate-xy fixed bottom-0 left-0 w-2/3 h-[66vh] bg-[#6B7FA0] z-[1] opacity-10 pointer-events-none" style={{ clipPath: 'polygon(0 100%, 0 40%, 60% 100%)', transitionDelay: '0.3s' }} />
      <div className="boot-anim-translate-x fixed top-0 left-0 w-64 h-full bg-[#2F3E5C] z-[1] opacity-5 pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 40% 100%, 0 100%)' }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[40] bg-[#0D0D1A]/80 backdrop-blur-md border-b border-[#6B7FA0]/15">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <LogoMark size={32} />
            <span className="text-xl font-semibold text-white tracking-tight font-display">agyabit</span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-ink/80">
            <a href="#diensten" className="hover:text-white transition-colors">Diensten</a>
            <a href="#hoe" className="hover:text-white transition-colors">Hoe het werkt</a>
            <a href="#cases" className="hover:text-white transition-colors">Cases</a>
            <a href="#complexe-projecten" className="hover:text-white transition-colors">Complexe projecten</a>
            <a href="#over" className="hover:text-white transition-colors">Over</a>
          </div>

          <div className="flex items-center gap-4">
            <PrimaryCTA href="#contact" icon="solar:calendar-linear" className="!px-5 !py-2.5">
              Demo aanvragen
            </PrimaryCTA>
          </div>
        </div>
      </nav>

      <main id="top" className="pt-32 relative z-10">
        {/* Hero */}
        <section className="min-h-[80vh] flex flex-col lg:flex-row max-w-7xl mx-auto px-6 relative items-center justify-center">
          <div className="lg:w-1/2 z-10 flex flex-col w-full pt-12 items-start">
            <div className="flex flex-col items-start mb-6 boot-anim-fade-y" style={{ transitionDelay: '1s' }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#6B7FA0]/30 bg-[#2F3E5C]/10 backdrop-blur-sm mb-4">
                <span className="text-xs font-mono text-white uppercase tracking-widest bg-[#2F3E5C]/60 px-2 py-0.5 border border-[#6B7FA0]/60">
                  Nieuw
                </span>
                <span className="text-xs font-mono text-[#B8C4D8] tracking-widest uppercase">
                  AI-automatisering voor het MKB
                </span>
              </div>
              <div className="flex gap-0.5 h-1 w-24 opacity-80">
                <div className="w-1 bg-[#6B7FA0]" />
                <div className="w-2 bg-[#6B7FA0]" />
                <div className="w-0.5 bg-[#6B7FA0]" />
                <div className="w-3 bg-[#6B7FA0]" />
                <div className="w-1 bg-[#6B7FA0]" />
              </div>
            </div>

            <div className="text-[#6B7FA0]/90 font-mono text-xs tracking-widest uppercase mb-4 boot-anim-pre-title" style={{ transitionDelay: '0.8s' }}>
              Agyabit · Den Haag
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[5rem] tracking-tight leading-[1.05] mb-6 text-metallic font-display font-bold boot-anim-title" style={{ transitionDelay: '1s' }}>
              AI-automatisering
              <br />
              die direct werkt.
            </h1>

            <p className="leading-relaxed text-base sm:text-lg max-w-xl mb-10 text-ink/85 boot-anim-fade-y" style={{ transitionDelay: '1.2s' }}>
              We bouwen AI-agents, workflows en apps die het MKB tijd besparen — van makelaars in Den Haag tot tandartspraktijken en rijscholen. Concrete tools, binnen weken live.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto boot-anim-fade-y" style={{ transitionDelay: '1.4s' }}>
              <PrimaryCTA href="#contact" icon="solar:calendar-linear">
                Vraag gratis demo aan
              </PrimaryCTA>
              <a href="#diensten" className="w-full sm:w-auto bg-[#0D0D1A]/50 backdrop-blur-sm border border-[#6B7FA0]/30 px-7 py-3.5 text-xs font-mono tracking-widest uppercase flex justify-center items-center hover:text-white hover:border-[#6B7FA0]/60 transition-colors text-ink/80">
                Bekijk diensten
              </a>
            </div>
          </div>

          {/* Hero side-graphic */}
          <div className="lg:w-1/2 aspect-square max-w-[500px] lg:max-w-[700px] mx-auto flex pointer-events-none w-full mt-16 lg:mt-0 relative items-center justify-center boot-anim-fade-y" style={{ transitionDelay: '1s' }}>
            <div className="absolute w-[120%] h-[120%] border border-[#6B7FA0]/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-[90%] h-[90%] border border-[#6B7FA0]/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed" />

            <div className="relative w-28 h-28 border-2 border-[#6B7FA0] rounded-full flex items-center justify-center bg-[#0D0D1A]">
              <div className="absolute inset-0 bg-[#2F3E5C] rounded-full blur-[30px] opacity-30" />
              <iconify-icon icon="solar:cpu-bolt-bold" class="w-10 h-10 text-white relative z-10" style={{ filter: 'drop-shadow(0 0 12px #6B7FA0)' }} />
            </div>

            <div className="absolute top-[20%] right-[28%] border border-[#6B7FA0]/30 bg-[#0D0D1A] p-3 shadow-[0_0_15px_rgba(107,127,160,0.15)]">
              <div className="w-4 h-4 bg-[#2F3E5C]/80 rounded-sm shadow-[0_0_10px_#6B7FA0]" />
              <div className="text-[10px] font-mono text-[#6B7FA0] mt-2 uppercase">Agent_01</div>
            </div>

            <div className="absolute bottom-[28%] right-[10%] border border-[#6B7FA0]/30 bg-[#0D0D1A] p-3 shadow-[0_0_15px_rgba(107,127,160,0.15)]">
              <iconify-icon icon="solar:routing-2-linear" class="w-6 h-6 text-[#6B7FA0]" />
              <div className="text-[10px] font-mono text-[#6B7FA0] mt-2 uppercase">Workflow</div>
            </div>

            <div className="absolute top-[30%] left-[15%] border border-[#6B7FA0]/30 bg-[#0D0D1A] p-3 rounded-full">
              <iconify-icon icon="solar:chat-round-dots-linear" class="w-5 h-5 text-[#B8C4D8]" />
            </div>

            <div className="absolute bottom-[10%] right-[12%] bg-[#0D0D1A]/90 backdrop-blur-xl border border-[#6B7FA0]/30 p-4 flex items-center gap-4 w-72 shadow-2xl">
              <div className="w-10 h-10 bg-[#0D0D1A] border border-[#6B7FA0]/30 flex items-center justify-center">
                <iconify-icon icon="solar:bolt-linear" class="w-5 h-5 text-[#6B7FA0]" />
              </div>
              <div>
                <p className="text-xs text-[#B8C4D8] font-mono uppercase tracking-widest">Live integratie</p>
                <p className="text-xs font-mono uppercase mt-1 text-ink/80">CRM · Mail · Agenda</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stat strip */}
        <section className="bg-[#080813] mt-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#6B7FA0]/50 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 pt-20 pb-20 text-center relative z-10">
            <div className="reveal inline-flex px-3 py-1 border border-[#6B7FA0]/20 bg-[#2F3E5C]/10 text-xs font-mono text-[#B8C4D8] uppercase tracking-widest mb-8">
              Waarom Agyabit
            </div>
            <h2 className="reveal text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white max-w-3xl mx-auto leading-tight mb-16 font-display font-semibold">
              Serieus over AI, praktisch over uitvoering.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-t border-b border-[#6B7FA0]/10 py-12">
              <div className="reveal text-center md:text-left">
                <p className="text-4xl tracking-tight mb-2 text-white font-display font-semibold">&lt; 4 weken</p>
                <p className="text-xs font-mono uppercase tracking-widest text-ink/70">Van intake tot live</p>
              </div>
              <div className="reveal text-center">
                <p className="text-4xl tracking-tight mb-2 text-white font-display font-semibold">100% NL</p>
                <p className="text-xs font-mono uppercase tracking-widest text-ink/70">Hosting in de EU</p>
              </div>
              <div className="reveal text-center md:text-right">
                <p className="text-4xl tracking-tight mb-2 text-white font-display font-semibold">Vast contact</p>
                <p className="text-xs font-mono uppercase tracking-widest text-ink/70">Geen call-center</p>
              </div>
            </div>
          </div>
        </section>

        {/* Wat wij doen — 3 services */}
        <section id="diensten" className="max-w-7xl mx-auto px-6 py-28">
          <div className="reveal mb-12 border-l-[6px] border-[#2F3E5C] pl-6 shadow-[inset_2px_0_10px_rgba(47,62,92,0.1)]">
            <div className="text-xs font-mono text-[#B8C4D8] uppercase tracking-widest mb-4">Wat wij doen</div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2 className="text-3xl sm:text-4xl tracking-tight max-w-md leading-tight font-display font-semibold">
                Drie kernservices. Eén partner.
              </h2>
              <p className="text-sm max-w-sm md:text-right text-ink/75">
                Geen abstracte AI-praatjes. We leveren tools die in jouw werkdag landen.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div
                key={i}
                className="glow-card reveal p-8 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 18, 36, 0.95) 0%, rgba(10, 12, 24, 0.98) 100%)',
                  boxShadow: '0 0 30px rgba(0,0,0,0.6), inset 0 0 20px rgba(107, 127, 160, 0.05)',
                  border: '1px solid rgba(107, 127, 160, 0.2)',
                }}
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#2F3E5C]/5 blur-[60px]" />
                <div className="relative z-10">
                  <div className="w-14 h-14 border border-[#6B7FA0]/40 flex items-center justify-center bg-[#0D0D1A] text-[#6B7FA0] mb-8 shadow-[0_0_15px_rgba(107,127,160,0.15)]">
                    <iconify-icon icon={s.icon} class="w-7 h-7" />
                  </div>
                  <h3 className="text-xl mb-3 text-white font-display font-semibold">{s.title}</h3>
                  <p className="text-sm text-ink/80 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hoe het werkt — 3 steps */}
        <section id="hoe" className="max-w-7xl mx-auto px-6 py-28 border-t border-[#6B7FA0]/10">
          <div className="reveal mb-16 text-center">
            <div className="inline-flex px-3 py-1 border border-[#6B7FA0]/20 bg-[#2F3E5C]/10 text-xs font-mono text-[#B8C4D8] uppercase tracking-widest mb-6">
              Hoe het werkt
            </div>
            <h2 className="text-3xl sm:text-4xl tracking-tight text-white font-display font-semibold max-w-2xl mx-auto">
              Van eerste gesprek naar werkende automatisering in drie stappen.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line on md+ */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#6B7FA0]/40 to-transparent" />
            {steps.map((step, i) => (
              <div
                key={i}
                className="glow-card reveal p-8 relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 18, 36, 0.95) 0%, rgba(10, 12, 24, 0.98) 100%)',
                  border: '1px solid rgba(107, 127, 160, 0.2)',
                }}
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 border border-[#6B7FA0] flex items-center justify-center bg-[#0D0D1A] font-mono text-[#6B7FA0] text-sm mb-6 shadow-[0_0_12px_rgba(107,127,160,0.25)]">
                    {step.n}
                  </div>
                  <h3 className="text-xl mb-3 text-white font-display font-semibold">{step.title}</h3>
                  <p className="text-sm text-ink/80 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cases */}
        <section id="cases" className="max-w-7xl mx-auto px-6 py-28 border-t border-[#6B7FA0]/10">
          <div className="reveal mb-12 border-l-[6px] border-[#2F3E5C] pl-6">
            <div className="text-xs font-mono text-[#B8C4D8] uppercase tracking-widest mb-4">Klantcases</div>
            <h2 className="text-3xl sm:text-4xl tracking-tight max-w-2xl leading-tight font-display font-semibold">
              Concrete voorbeelden uit het Nederlandse MKB.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cases.map((c, i) => (
              <div
                key={i}
                className="glow-card reveal p-8 relative overflow-hidden flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 18, 36, 0.95) 0%, rgba(10, 12, 24, 0.98) 100%)',
                  border: '1px solid rgba(107, 127, 160, 0.2)',
                  minHeight: 320,
                }}
              >
                <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, #ffffff 10px, #ffffff 11px)' }} />
                <div className="relative z-10 flex flex-col h-full">
                  <span className="inline-flex w-max text-[10px] font-mono uppercase tracking-widest text-[#6B7FA0] border border-[#6B7FA0]/30 px-2 py-1 mb-6">{c.tag}</span>
                  <h3 className="text-xl mb-3 text-white font-display font-semibold">{c.title}</h3>
                  <p className="text-sm text-ink/80 leading-relaxed">{c.body}</p>
                  <a href="#contact" className="mt-auto pt-8 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#6B7FA0] hover:text-white transition-colors">
                    Meer weten
                    <iconify-icon icon="solar:arrow-right-linear" class="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Complexe Projecten teaser → subpage */}
        <section id="complexe-projecten" className="max-w-7xl mx-auto px-6 py-24">
          <div
            className="p-8 md:p-14 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(13, 18, 36, 0.95) 0%, rgba(8, 10, 22, 0.98) 100%)',
              boxShadow: 'inset 0 0 30px rgba(107, 127, 160, 0.06)',
              border: '1px solid rgba(107, 127, 160, 0.25)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, #ffffff 10px, #ffffff 11px)' }} />

            <div className="reveal w-full lg:w-1/2 relative z-10 border-l-[6px] border-[#6B7FA0] pl-8">
              <div className="text-xs font-mono text-[#B8C4D8] uppercase tracking-widest mb-6">Complexe projecten</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-6 max-w-lg leading-tight text-white font-display font-semibold">
                Grip op complexiteit — van strategie tot uitvoering.
              </h2>
              <p className="text-base text-ink/85 max-w-lg mb-10 leading-relaxed">
                Voor defensie, overheid en kritieke infrastructuur. Integraal projectmanagement, procesmodellering en AI-gedreven beslissingsondersteuning, vertrouwelijk behandeld.
              </p>
              <PrimaryCTA href="#contact" icon="solar:lock-keyhole-linear">
                Vertrouwelijk gesprek
              </PrimaryCTA>
            </div>

            <div className="reveal w-full lg:w-1/2 grid grid-cols-2 gap-4 relative z-10">
              {[
                { icon: 'solar:diagram-up-linear', title: 'Projectmanagement', sub: 'Prince2 · MSP · Agile' },
                { icon: 'solar:branching-paths-up-linear', title: 'Procesmodellering', sub: 'BPMN · Archimate' },
                { icon: 'solar:users-group-rounded-linear', title: 'Stakeholders', sub: 'Multi-party coördinatie' },
                { icon: 'solar:shield-check-linear', title: 'Vertrouwelijk', sub: 'Defensie · Overheid' },
              ].map((k, i) => (
                <div key={i} className="border border-[#6B7FA0]/25 bg-[#0D0D1A]/60 p-5">
                  <iconify-icon icon={k.icon} class="w-6 h-6 text-[#6B7FA0] mb-4" />
                  <p className="text-sm text-white font-display font-medium">{k.title}</p>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-ink/60 mt-1">{k.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Over Agyabit */}
        <section id="over" className="max-w-5xl mx-auto px-6 py-28 border-t border-[#6B7FA0]/10">
          <div className="reveal mb-10">
            <div className="text-xs font-mono text-[#B8C4D8] uppercase tracking-widest mb-4">Over Agyabit</div>
            <h2 className="text-3xl sm:text-4xl tracking-tight text-white font-display font-semibold max-w-2xl leading-tight">
              Een nuchter AI-bureau uit Den Haag.
            </h2>
          </div>
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-10">
            <p className="md:col-span-2 text-base text-ink/85 leading-relaxed">
              Agyabit helpt MKB-bedrijven in Nederland om AI praktisch in te zetten. We zijn klein, direct bereikbaar en bouwen liever één werkende oplossing dan tien mooie slides. Onze klanten zitten in vastgoed, zorg, mobiliteit en onderwijs — én we begeleiden complexe programma's bij overheid en defensie.
            </p>
            <div className="border-l border-[#6B7FA0]/30 pl-6 space-y-3 text-sm text-ink/75">
              <p><span className="text-[#B8C4D8] font-mono uppercase tracking-widest text-[11px] block mb-1">Vestiging</span>Den Haag</p>
              <p><span className="text-[#B8C4D8] font-mono uppercase tracking-widest text-[11px] block mb-1">Taal</span>Nederlands · Engels op verzoek</p>
              <p><span className="text-[#B8C4D8] font-mono uppercase tracking-widest text-[11px] block mb-1">Werkwijze</span>Klein team. Vaste contactpersoon.</p>
            </div>
          </div>
        </section>

        {/* Contact / demo */}
        <section id="contact" className="py-28 relative overflow-hidden border-t border-[#6B7FA0]/10">
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="reveal text-center mb-12">
              <div className="inline-flex px-3 py-1 border border-[#6B7FA0]/20 bg-[#2F3E5C]/10 text-xs font-mono text-[#B8C4D8] uppercase tracking-widest mb-6">
                Contact
              </div>
              <h2 className="text-3xl sm:text-5xl tracking-tight text-white font-display font-semibold mb-6">
                Plan een gratis demo in.
              </h2>
              <p className="text-base text-ink/80 max-w-xl mx-auto">
                30 minuten kennismaken, zonder verplichtingen. We laten zien wat AI in jouw branche kan opleveren.
              </p>
            </div>

            {/* Calendly placeholder */}
            <div
              className="reveal mb-10 p-10 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 18, 36, 0.95) 0%, rgba(10, 12, 24, 0.98) 100%)',
                border: '1px dashed rgba(107, 127, 160, 0.4)',
              }}
            >
              {/* TODO: vervang door echte Calendly/Cal.com inline embed zodra de URL bekend is */}
              <iconify-icon icon="solar:calendar-linear" class="w-10 h-10 text-[#6B7FA0] mx-auto mb-4" />
              <p className="text-sm text-ink/80 mb-6">Hier komt straks de Calendly-embed. Tot die tijd:</p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <PrimaryCTA href="mailto:hallo@agyabit.com" icon="solar:letter-linear">
                  Mail ons direct
                </PrimaryCTA>
                <a href="https://wa.me/" className="bg-[#0D0D1A]/50 border border-[#6B7FA0]/30 px-7 py-3.5 text-xs font-mono tracking-widest uppercase flex items-center gap-2 hover:border-[#6B7FA0]/60 hover:text-white transition-colors text-ink/80">
                  <iconify-icon icon="solar:chat-round-dots-linear" class="w-4 h-4" />
                  Stuur WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-[#6B7FA0]/10 pt-20 pb-10 overflow-hidden bg-[#080813]">
          <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 text-[20vw] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#6B7FA0]/[0.06] to-transparent pointer-events-none select-none leading-none w-full text-center font-display font-bold">
            agyabit
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <LogoMark size={32} />
                  <span className="text-xl font-semibold text-white font-display">agyabit</span>
                </div>
                <p className="text-sm text-ink/75 max-w-sm mb-8 leading-relaxed">
                  AI-automatisering voor het MKB — gevestigd in Den Haag, werkend door heel Nederland.
                </p>
                <div className="flex gap-3">
                  <a href="https://www.linkedin.com/" aria-label="LinkedIn" className="w-10 h-10 border border-[#6B7FA0]/30 bg-[#0D0D1A] flex items-center justify-center hover:border-[#6B7FA0] hover:text-white transition-colors text-ink/80">
                    <iconify-icon icon="solar:link-linear" class="w-4 h-4" />
                  </a>
                  <a href="https://wa.me/" aria-label="WhatsApp" className="w-10 h-10 border border-[#6B7FA0]/30 bg-[#0D0D1A] flex items-center justify-center hover:border-[#6B7FA0] hover:text-white transition-colors text-ink/80">
                    <iconify-icon icon="solar:chat-round-dots-linear" class="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#B8C4D8] mb-4">Diensten</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#diensten" className="hover:text-white transition-colors text-ink/80">AI Agents</a></li>
                  <li><a href="#diensten" className="hover:text-white transition-colors text-ink/80">Workflow Automatisering</a></li>
                  <li><a href="#diensten" className="hover:text-white transition-colors text-ink/80">App Ontwikkeling</a></li>
                  <li><a href="#complexe-projecten" className="hover:text-white transition-colors text-ink/80">Complexe projecten</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#B8C4D8] mb-4">Bedrijf</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#over" className="hover:text-white transition-colors text-ink/80">Over ons</a></li>
                  <li><a href="#cases" className="hover:text-white transition-colors text-ink/80">Cases</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors text-ink/80">Contact</a></li>
                  <li><a href="/privacy" className="hover:text-white transition-colors text-ink/80">Privacy­verklaring</a></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-8 border-t border-[#6B7FA0]/10 gap-4 text-[11px] font-mono uppercase tracking-widest text-ink/60">
              <p>© {new Date().getFullYear()} Agyabit · Den Haag · KVK 00000000</p>
              <div className="flex gap-6">
                <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                <a href="/voorwaarden" className="hover:text-white transition-colors">Voorwaarden</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Sticky WhatsApp button */}
      <a
        href="https://wa.me/"
        aria-label="Stuur ons een WhatsApp"
        className="fixed bottom-6 right-6 z-[50] w-14 h-14 rounded-full bg-[#2F3E5C] border border-[#6B7FA0] flex items-center justify-center shadow-[0_0_20px_rgba(47,62,92,0.5)] hover:scale-105 transition-transform"
      >
        <iconify-icon icon="ri:whatsapp-fill" class="w-7 h-7 text-white" />
      </a>

      {/* Cookie banner (GDPR — NL) */}
      {!cookieAccepted && (
        <div className="fixed bottom-6 left-6 right-6 md:right-auto md:max-w-md z-[60] bg-[#0D0D1A]/95 backdrop-blur-md border border-[#6B7FA0]/30 p-5 shadow-2xl">
          <p className="text-sm text-ink/85 leading-relaxed mb-4">
            We gebruiken alleen functionele en geanonimiseerde analytics-cookies om de website te verbeteren. Door op &laquo;Akkoord&raquo; te klikken geef je hier toestemming voor.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={acceptCookies}
              className="bg-[#2F3E5C] hover:bg-[#6B7FA0] text-white px-5 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors"
            >
              Akkoord
            </button>
            <a href="/privacy" className="text-xs font-mono uppercase tracking-widest text-ink/70 hover:text-white">
              Meer info
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
