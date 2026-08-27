const DATA_FILES = [
  'data/site.json', 'data/research.json', 'data/projects.json',
  'data/publications.json', 'data/career.json', 'data/teaching.json', 'data/service.json', 'data/resources.json'
];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (value = '') => String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
const linkAttrs = url => url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : '';

function icon(name) {
  const icons = {
    github:'<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.84a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/>',
    linkedin:'<path d="M6.5 8.4H3.2V19h3.3V8.4ZM4.85 3A1.92 1.92 0 1 0 4.85 6.84 1.92 1.92 0 0 0 4.85 3ZM19.5 12.92c0-3.2-1.7-4.69-3.98-4.69-1.83 0-2.65 1.01-3.11 1.72V8.4H9.1V19h3.31v-5.25c0-1.38.26-2.72 1.97-2.72 1.68 0 1.7 1.58 1.7 2.81V19h3.32l.1-6.08Z"/>',
    youtube:'<path d="M21.58 7.19a2.83 2.83 0 0 0-1.99-2C17.84 4.72 12 4.72 12 4.72s-5.84 0-7.59.47a2.83 2.83 0 0 0-1.99 2A29.4 29.4 0 0 0 1.95 12c0 1.62.16 3.23.47 4.81a2.83 2.83 0 0 0 1.99 2c1.75.47 7.59.47 7.59.47s5.84 0 7.59-.47a2.83 2.83 0 0 0 1.99-2c.31-1.58.47-3.19.47-4.81s-.16-3.23-.47-4.81ZM10 15.5v-7l6 3.5-6 3.5Z"/>',
    mail:'<path d="M3 5h18v14H3V5Zm9 7 9-5H3l9 5Zm0 2.3L5 10.4V17h14v-6.6l-7 3.9Z"/>',
    scholar:'<path d="m12 3-10 6 10 6 8-4.8V17h2V9L12 3Zm-6 9.4V17c2.1 2.4 9.9 2.4 12 0v-4.6L12 16l-6-3.6Z"/>',
    orcid:'<circle cx="12" cy="12" r="10"/><path fill="var(--surface)" d="M8.3 7.1h1.5v9.8H8.3V7.1Zm.75-2.3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm3.2 2.3h3c3.6 0 5.2 2.1 5.2 4.9s-1.6 4.9-5.2 4.9h-3V7.1Zm1.5 1.35v7.1h1.38c2.64 0 3.77-1.35 3.77-3.55s-1.13-3.55-3.77-3.55h-1.38Z"/>'
  };
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">${icons[name] || icons.scholar}</svg>`;
}

function sectionHead(target, section) {
  $(target).innerHTML = `<p class="eyebrow">${esc(section.eyebrow)}</p><h2>${esc(section.title)}</h2><p>${esc(section.intro)}</p>`;
}

async function loadData() {
  const responses = await Promise.all(DATA_FILES.map(url => fetch(url).then(r => {
    if (!r.ok) throw new Error(`${url}: ${r.status}`);
    return r.json();
  })));
  return Object.fromEntries(DATA_FILES.map((url, i) => [url.split('/').pop().replace('.json',''), responses[i]]));
}

function renderSite(site, research) {
  document.title = site.meta.title;
  $('meta[name="description"]').content = site.meta.description;
  $('#brand-name').textContent = site.profile.name.replace('Dr. ', '');
  $('#hero-role').innerHTML = `
    ${esc(site.profile.role)}<br>
    ${esc(site.profile.affiliation)}
  `;
  $('#hero-name').textContent = site.profile.name;
  $('#hero-headline').textContent = site.profile.headline;
  $('#hero-subheadline').textContent = site.profile.subheadline;

  $('#site-nav').innerHTML = site.navigation.map(item => `<a href="#${esc(item.target)}">${esc(item.label)}</a>`).join('') + `<a href="#contact">Contact</a>`;

  $('#social-row').innerHTML = site.social.map(s => `<a class="social-link" href="${esc(s.url)}" ${linkAttrs(s.url)}>${icon(s.icon)}<span>${esc(s.label)}</span></a>`).join('');

  research.modalities.slice(0, 6).forEach((m, i) => {
    const node = $(`[data-orb="${i}"]`);

    if (node) {
      node.textContent = m;
    }
  });

  $('#footer-copy').textContent = `© ${new Date().getFullYear()} ${site.profile.name}`;
  $('#footer-update').textContent = `Last updated: ${site.meta.lastUpdated}`;

  $('#top-button').addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  const structured = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.profile.name,
  jobTitle: site.profile.role,
  affiliation: {
    '@type': 'Organization',
    name: 'Texas State University'
  },
  email: `mailto:${site.profile.email}`,
  url: 'https://sanalmgr.github.io/',
  sameAs: [
    ...site.social,
    ...site.contactLinks
  ].filter(x => x.url.startsWith('http')).map(x => x.url),
  knowsAbout: site.profile.researchInterests
};
  $('#structured-data').textContent = JSON.stringify(structured);
}

function renderResearch(data) {
  sectionHead('#research-head', data.section);
  $('#research-content').innerHTML = `
    <div class="research-layout">
      <aside class="question-card reveal"><div class="label">Central research question</div><blockquote>${esc(data.centralQuestion)}</blockquote><p>${esc(data.vision)}</p></aside>
      <div class="theme-grid">${data.themes.map(t => `<article class="theme-card reveal"><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p><p>${esc(t.details)}</p><div class="tags">${t.tags.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div></article>`).join('')}</div>
    </div>`;
}

let pubState = {type:'all', query:''};
function renderPublications(data) {
  sectionHead('#publications-head', data.section);
  const types = [...new Set(data.items.map(p=>p.type))];
  $('#publications-content').innerHTML = `<div class="pub-toolbar"><div class="search-box"><input id="pub-search" type="search" placeholder="Search titles, authors, venues…" aria-label="Search publications"></div><div class="filter-group" id="pub-filters"><button class="filter-btn active" data-type="all">All</button>${types.map(t=>`<button class="filter-btn" data-type="${esc(t)}">${esc(t[0].toUpperCase()+t.slice(1))}</button>`).join('')}</div><div class="pub-count" id="pub-count"></div></div><div class="pub-list" id="pub-list"></div>`;
  const draw = () => {
    const q=pubState.query.toLowerCase();
    const items=data.items.filter(p => (pubState.type==='all'||p.type===pubState.type) && (!q || `${p.title} ${p.authors} ${p.venue} ${p.year}`.toLowerCase().includes(q)));
    $('#pub-count').textContent = `${items.length} of ${data.items.length}`;
    $('#pub-list').innerHTML = items.length ? items.map(p => `<article class="pub-item"><div class="pub-year">${p.year}</div><div><div class="pub-title">${esc(p.title)}${p.selected?'<span class="pub-badge">selected</span>':''}</div><div class="pub-authors">${highlightName(esc(p.authors))}</div><div class="pub-venue">${esc(p.venue)}</div></div><div class="pub-links">${p.links.map(l=>`<a class="pub-link" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>`).join('')}</div></article>`).join('') : '<div class="empty-state">No publications match this filter.</div>';
  };
  $('#pub-search').addEventListener('input', e=>{pubState.query=e.target.value;draw();});
  $$('.filter-btn', $('#pub-filters')).forEach(btn=>btn.addEventListener('click',()=>{pubState.type=btn.dataset.type;$$('.filter-btn', $('#pub-filters')).forEach(x=>x.classList.toggle('active',x===btn));draw();}));
  draw();
}
function highlightName(authors) { return authors.replace(/Sana Alamgeer/g,'<strong>Sana Alamgeer</strong>'); }

function renderProjects(data) {
  sectionHead('#projects-head', data.section);

  $('#project-grid').innerHTML = data.items.map(p => `
    <article class="project-card reveal">

      <div class="project-meta">
        <span>${esc(p.status)}</span>
        ${p.featured ? '<span class="featured-badge">Featured</span>' : ''}
      </div>

      <h3>${esc(p.title)}</h3>

      <p class="subtitle">${esc(p.subtitle)}</p>

      <p>${esc(p.description)}</p>

      <div class="tags">
        ${p.areas.map(x => `<span class="tag">${esc(x)}</span>`).join('')}
      </div>

      <div class="card-links">
        ${p.links.map(l => `
          <a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">
            ${esc(l.label)} ↗
          </a>
        `).join('')}
      </div>

    </article>
  `).join('');
}

function renderCareer(data, site) {
  sectionHead('#career-head',data.section);
  const exp = data.experience.map(x=>`<article class="timeline-item reveal"><div class="timeline-meta">${esc(x.period)} · ${esc(x.location)}</div><h3>${esc(x.role)}</h3><div>${esc(x.organization)}</div><ul>${x.highlights.map(h=>`<li>${esc(h)}</li>`).join('')}</ul></article>`).join('');
  const edu = data.education.map(x=>`<div class="edu-item"><div class="edu-title">${esc(x.degree)}</div><div>${esc(x.institution)}</div><div class="edu-meta">${esc(x.period)} · ${esc(x.location)}</div><div class="edu-meta">${esc(x.details)}</div></div>`).join('');
  const awards = data.awards.map(x=>`<div class="award-item"><strong>${esc(x.year)} · ${esc(x.title)}</strong><div class="edu-meta">${esc(x.context)}</div></div>`).join('');

  const skills = site.skills.map(g=>`<div class="edu-item"><div class="edu-title">${esc(g.group)}</div><div class="chip-list">${g.items.map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div></div>`).join('');
  $('#career-content').innerHTML = `<div class="career-grid"><div class="timeline">${exp}</div><div class="side-stack"><div class="mini-card reveal"><h3>Education</h3>${edu}</div><div class="mini-card reveal"><h3>Awards</h3>${awards}</div>
  <div class="mini-card reveal"><h3>Skills & tools</h3>${skills}</div></div></div>`;
}

function renderTeaching(data) {
  sectionHead('#teaching-head', data.section);

  const interests = data.interests && data.interests.length
    ? `
      <div class="teaching-interests reveal">
        <div class="teaching-interests-title">Teaching Interests</div>

        <ul>
          ${data.interests.map(x => `
            <li>${esc(x)}</li>
          `).join('')}
        </ul>
      </div>
    `
    : '';

  $('#teaching-content').innerHTML = `
    <div class="teaching-layout">

      <div>
        <div class="philosophy-card reveal">
          <p>${esc(data.philosophy)}</p>
        </div>
      </div>

      <div>
        <div class="teaching-grid">
          ${data.approach.map(a => `
            <article class="teaching-card reveal">
              <h3>${esc(a.title)}</h3>
              <p>${esc(a.description)}</p>
            </article>
          `).join('')}
        </div>
      </div>

    </div>

    ${interests}
  `;
}

function renderService(data) {
  sectionHead('#service-head', data.section);

  const editorial = data.editorial.map(x =>
    `<li>
      <a class="editorial-link"
         href="${esc(x.url)}"
         target="_blank"
         rel="noopener noreferrer">
         ${esc(x.role)}
      </a>
      <br>${esc(x.venue)} · ${esc(x.period)}
    </li>`
  ).join('');

  const activities = data.activities.map(x =>
    `<li>
      <strong>${esc(x.year)}</strong> · ${esc(x.title)}
      <br>${esc(x.role)}
    </li>`
  ).join('');

  const talks = data.talks.map(x =>
    `<li>
      <strong>${esc(x.year)}</strong> · ${esc(x.title)}
      <br>${esc(x.venue)}
    </li>`
  ).join('');

  $('#service-content').innerHTML = `
  

    <div class="service-columns">
      <div class="mini-card reveal">
        <h3>Editorial Service</h3>
        <ul class="clean-list">
          ${editorial}
        </ul>
      </div>

      <div class="mini-card reveal">
        <h3>Community Activities</h3>
        <ul class="clean-list">
          ${activities}
        </ul>
      </div>

      <div class="mini-card reveal">
        <h3>Invited Talks</h3>
        <ul class="clean-list">
          ${talks}
        </ul>
      </div>
    </div>
  `;
}

function renderResources(data) {
  sectionHead('#resources-head', data.section);
  $('#resources-content').innerHTML = data.groups.map(g => `<article class="mini-card reveal"><h3>${esc(g.title)}</h3><ul class="resource-list">${g.items.map(x=>`<li><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.label)} <span>↗</span></a></li>`).join('')}</ul></article>`).join('');
}

function renderContact(site) {

  const contactLinks = site.contactLinks.map(link => `
    <a class="contact-link"
       href="${esc(link.url)}"
       ${linkAttrs(link.url)}>
      ${icon(link.icon)}
      <span>${esc(link.label)}</span>
    </a>
  `).join('');

  $('#contact-content').innerHTML = `
    <div class="contact-main">

      <p class="eyebrow" style="color:var(--accent-2)">
        Contact
      </p>

      <h2>
        Interested in multimodal AI, synthetic data, or healthcare AI?
      </h2>

      <p>
        I welcome conversations about research collaborations,
        academic opportunities, student mentoring, and
        interdisciplinary AI projects.
      </p>

      <div class="contact-links">
        ${contactLinks}
      </div>

    </div>
  `;
}

function setupInteractions() {
  const header=$('#site-header');
  window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>10),{passive:true});
  $('#menu-toggle').addEventListener('click',e=>{const nav=$('#site-nav');const open=nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open));});
  $$('#site-nav a').forEach(a=>a.addEventListener('click',()=>{$('#site-nav').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');}));

  const stored=localStorage.getItem('theme');
  const preferred=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  const apply=t=>{document.documentElement.dataset.theme=t;localStorage.setItem('theme',t);};
  apply(stored||preferred);
  $('#theme-toggle').addEventListener('click',()=>apply(document.documentElement.dataset.theme==='dark'?'light':'dark'));

  const revealObs = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObs.unobserve(e.target);}}),{threshold:.12});
  $$('.reveal').forEach(el=>revealObs.observe(el));

  const sections=$$('main section[id]');
  const navLinks=$$('#site-nav a');
  const navObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${e.target.id}`));}}),{rootMargin:'-35% 0px -55%',threshold:0});
  sections.forEach(s=>navObs.observe(s));
}

(async function init(){
  try {
    const d=await loadData();
    renderSite(d.site,d.research); renderResearch(d.research); renderPublications(d.publications); renderProjects(d.projects); renderCareer(d.career,d.site); renderTeaching(d.teaching); renderService(d.service); renderResources(d.resources); renderContact(d.site); setupInteractions();
  } catch(err) {
    console.error(err);
    const message = location.protocol === 'file:'
      ? 'This site loads JSON files and must be opened through a web server (GitHub Pages or python3 -m http.server), not directly with file://.'
      : `The website could not initialize: ${esc(err && err.message ? err.message : 'Unknown error')}`;
    document.body.insertAdjacentHTML('beforeend', `<div class="noscript">${message}</div>`);
  }
})();
