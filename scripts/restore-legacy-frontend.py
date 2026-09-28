"""Copy the original styles/assets and extract trusted, versioned HTML templates."""
import json
import re
import shutil
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'index.html'
PUBLIC = ROOT / 'public/legacy'
PUBLIC.mkdir(parents=True, exist_ok=True)
routes = {'index.html': '/', 'introduction.html': '/introduction', 'courses.html': '/courses',
          'Download.html': '/downloads', 'Contact Us.html': '/contact', 'Simulations.html': '/simulations',
          'Objectives.html': '/objectives'}


def rewrite_url(value):
    clean = value.removeprefix('./')
    name, sep, fragment = clean.partition('#')
    if name in routes:
        return routes[name] + (sep + fragment if sep else '')
    if clean.startswith(('Images/', 'Fichiers/', 'Telechargement/')):
        return '/legacy/' + quote(clean, safe='/%')
    if 'sitescours.monportail.ulaval.ca' in clean:
        return '/downloads'
    return value


def adapt(html):
    account_menu = '''<details class="account-menu">
        <summary>Account <span aria-hidden="true">▾</span></summary>
        <div class="account-menu-links">
            <a href="/connexion">Sign in</a>
            <a href="/inscription">Create an account</a>
            <a href="/mon-compte">My account &amp; settings</a>
        </div>
    </details>'''
    html = re.sub(r'<a\b[^>]*class="bouton bouton-navigation"[^>]*>\s*Get Started\s*</a>', account_menu, html)
    html = re.sub(r'<!--[\s\S]*?-->', '', html)
    html = re.sub(r'\b(href|src)="([^"]+)"', lambda m: f'{m[1]}="{rewrite_url(m[2])}"', html)
    html = html.replace("url('./Images/", "url('/legacy/Images/")
    # Correct the original Downloads tile, which mistakenly linked to Simulations.
    html = re.sub(r'href="/simulations"(\s+class="carte-lien"[^>]*>\s*<[^>]+>[^<]*</[^>]+>\s*<h3>Downloads)', r'href="/downloads"\1', html)
    return html


templates = {}
for name, filename in [('home', 'index.html'), ('contact', 'Contact Us.html'), ('objectives', 'Objectives.html')]:
    source = (SOURCE / filename).read_text(encoding='utf-8')
    templates[name] = adapt(re.search(r'<main[^>]*>([\s\S]*?)(?:</main>|<footer)', source)[1])

home = (SOURCE / 'index.html').read_text(encoding='utf-8')
header = adapt(re.search(r'<header class="header">([\s\S]*?)</header>', home)[1])
header = header.replace(' class="lien-actif"', '')
templates['headers'] = {}
for key, route in [('home', '/'), ('introduction', '/introduction'), ('courses', '/courses'), ('downloads', '/downloads'), ('contact', '/contact')]:
    # Only mark the navigation link, never the logo or call-to-action.
    templates['headers'][key] = re.sub(r'(<nav[^>]*>)([\s\S]*?)(</nav>)',
        lambda m: m[1] + m[2].replace(f'href="{route}"', f'href="{route}" class="lien-actif" aria-current="page"', 1) + m[3], header)
templates['headers']['default'] = header
templates['footer'] = adapt(re.search(r'<footer class="footer">([\s\S]*?)</footer>', home)[1])
(ROOT / 'src/content/legacy-templates.json').write_text(json.dumps(templates, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

for filename in ['style.css', 'simulations.css', 'simulations.js', 'SOL.py']:
    shutil.copyfile(SOURCE / filename, PUBLIC / filename)
for directory in ['Images', 'SOL_Tools']:
    shutil.copytree(SOURCE / directory, PUBLIC / directory, dirs_exist_ok=True, ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
shutil.copyfile(ROOT / 'favicon.png', ROOT / 'public/favicon.png')
simulation = adapt((SOURCE / 'Simulations.html').read_text(encoding='utf-8'))
simulation = simulation.replace('</head>', '<link rel="stylesheet" href="/account-menu.css" /></head>')
for asset in ['style.css', 'simulations.css', 'simulations.js']:
    simulation = simulation.replace(f'"{asset}"', f'"/legacy/{asset}"')
(PUBLIC / 'Simulations.html').write_text(simulation, encoding='utf-8')
print('Original CSS copied byte-for-byte; home/contact/objectives templates and simulation assets restored.')
