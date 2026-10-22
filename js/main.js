// ---------- Données modifiables ----------
const SKILLS = {
  "Administration Windows Server": ["Active Directory", "GPO", "DNS / DHCP", "FSMO", "PowerShell"],
  "Administration Linux": ["Debian / Ubuntu", "Bash", "SSH", "Apache / Nginx", "Cron"],
  "Réseaux": ["Mikrotik", "Cisco", "pfSense", "VLAN", "RIP / Routage", "VPN"],
  "Virtualisation": ["Proxmox", "VMware", "Hyper-V", "VirtualBox", "GNS3"],
  "Supervision": ["Zabbix", "GLPI", "Centreon"],
  "Automatisation & IA": ["n8n", "Scripts Bash / CSV", "NTLite", "IA appliquée à l'IT"],
  "Sécurité": ["Firewalling", "VPN Mikrotik", "Durcissement serveurs", "Sauvegardes"]
};

const STACK = {
  "Systèmes": [["Windows Server","AD · GPO"],["Debian","Linux"],["Ubuntu","Linux"],["PowerShell","Scripts"],["Bash","Scripts"]],
  "Réseau": [["Mikrotik","RouterOS"],["Cisco","Switching"],["pfSense","Firewall"],["VLAN","Segmentation"],["VPN","Accès distant"]],
  "Virtualisation": [["Proxmox","Hyperviseur"],["VMware","ESXi"],["Hyper-V","Microsoft"],["GNS3","Simulation"]],
  "Téléphonie": [["3CX","VoIP"],["Asterisk","VoIP"],["SIP","Protocole"]],
  "Automatisation": [["n8n","Workflows"],["Zabbix","Supervision"],["GLPI","Parc IT"],["NTLite","Déploiement"]]
};

// ---------- Utilitaires ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Menu mobile
const burger = $('#burger'), links = $('#links');
burger?.addEventListener('click', () => links.classList.toggle('open'));
$$('#links a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

// Compteurs animés
function animateCount(el) {
  const target = +el.dataset.count; let n = 0;
  const step = () => { n += 1; el.textContent = n; if (n < target) setTimeout(step, 120); };
  step();
}
$$('[data-count]').forEach(animateCount);

// Apparition au scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));

// Lien actif dans la nav
const sections = $$('section[id]');
window.addEventListener('scroll', () => {
  const y = scrollY + 120;
  sections.forEach(s => {
    const a = $(`.links a[href="#${s.id}"]`);
    if (a) a.classList.toggle('active', y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
  });
});

// Compétences cliquables
const chips = $('#skillChips'), detail = $('#skillDetail');
if (chips) {
  Object.keys(SKILLS).forEach(name => {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = name;
    b.onclick = () => {
      $$('.chip', chips).forEach(c => c.classList.remove('on'));
      b.classList.add('on');
      detail.innerHTML = `<b>Compétence technique</b> — ${name}<div class="tools">${SKILLS[name].map(t => `<span>${t}</span>`).join('')}</div><div style="margin-top:10px;font-size:.85rem">Outils & technologies :</div>`;
    };
    chips.appendChild(b);
  });
}

// Stack par onglets
const tabs = $('#stackTabs'), grid = $('#stackGrid');
if (tabs) {
  const show = cat => {
    $$('.chip', tabs).forEach(c => c.classList.toggle('on', c.textContent === cat));
    grid.innerHTML = STACK[cat].map(([n, s]) => `<div class="tech">${n}<small>${s}</small></div>`).join('');
  };
  Object.keys(STACK).forEach(cat => {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = cat; b.onclick = () => show(cat);
    tabs.appendChild(b);
  });
  show(Object.keys(STACK)[0]);
}

// Formulaire de contact (envoi via mailto)
const form = $('#contactForm');
if (form) {
  const msg = $('#message'), count = $('#count');
  msg.addEventListener('input', () => count.textContent = msg.value.length);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#email').value.trim(), message = msg.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email) || !message) {
      alert('Merci de renseigner un email valide et un message.');
      return;
    }
    const subject = encodeURIComponent($('#subject').value || 'Contact depuis le portfolio');
    const body = encodeURIComponent(`${message}\n\n— ${$('#name').value || 'Anonyme'} (${email})`);
    window.location.href = `mailto:contact@mwindjou.fr?subject=${subject}&body=${body}`;
    $('#success').classList.add('show');
    form.reset(); count.textContent = 0;
  });
}

// Filtres page projets
const filterBar = $('#filters');
if (filterBar) {
  $$('.chip', filterBar).forEach(btn => btn.addEventListener('click', () => {
    $$('.chip', filterBar).forEach(c => c.classList.remove('on'));
    btn.classList.add('on');
    const f = btn.dataset.filter;
    $$('[data-cat]').forEach(el => el.classList.toggle('hidden', f !== 'all' && el.dataset.cat !== f));
  }));
}
