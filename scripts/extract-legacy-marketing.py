"""Rebuild the import manifest from the versioned legacy HTML (standard library only)."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class Element:
    def __init__(self, tag, attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def find(self, tag):
        return [child for child in self.children if isinstance(child, Element) and child.tag == tag]

    def all(self, tag):
        return [item for child in self.children if isinstance(child, Element)
                for item in ([child] if child.tag == tag else []) + child.all(tag)]

    def text(self):
        return re.sub(r'\s+', ' ', ''.join(c if isinstance(c, str) else c.text() for c in self.children)).strip()


class Parser(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Element('root')
        self.stack = [self.root]
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        element = Element(tag, attrs)
        self.stack[-1].children.append(element)
        if tag not in {'img', 'meta', 'link', 'br', 'hr', 'input', 'source'}:
            self.stack.append(element)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def text_node(text, bold=False):
    return dict(type='text', version=1, text=text, detail=0, format=1 if bold else 0, mode='normal', style='')


def block(element):
    base = dict(version=1, direction=None, format='', indent=0)
    if element.tag in {'ul', 'ol'}:
        return dict(base, type='list', listType='bullet' if element.tag == 'ul' else 'number',
                    tag=element.tag, start=1, children=[dict(base, type='listitem', value=i + 1,
                    children=[text_node(li.text())]) for i, li in enumerate(element.find('li'))])
    if element.tag in {'h3', 'h4'}:
        return dict(base, type='heading', tag=element.tag, children=[text_node(element.text())])
    return dict(base, type='paragraph', children=[text_node(element.text(), element.tag == 'strong')])


def blocks(element):
    result = []
    for child in element.children:
        if not isinstance(child, Element) or child.tag == 'h2':
            continue
        if child.tag == 'p' and 'surtitre' in child.attrs.get('class', ''):
            continue
        if child.tag in {'p', 'h3', 'h4', 'ul', 'ol', 'strong'}:
            result.append(block(child))
        else:
            result.extend(blocks(child))
    return result


def richtext(children):
    return dict(root=dict(type='root', version=1, direction=None, format='', indent=0, children=children))


def extract(filename, slug):
    source = (ROOT / 'index.html' / filename).read_text(encoding='utf-8')
    tree = Parser(source).root
    main = tree.all('main')[0]
    header = main.all('section')[0]
    article = main.all('article')[0]
    sections = []
    for i, section in enumerate(article.find('section')):
        sections.append(dict(title=section.find('h2')[0].text(), slug=section.attrs['id'],
                             order=(i + 1) * 10, content=richtext(blocks(section))))
    return dict(page=dict(title=header.all('h1')[0].text(), slug=slug, content=richtext(blocks(header))), sections=sections)


intro = extract('introduction.html', 'introduction')
courses = extract('courses.html', 'courses')
for course in courses['sections']:
    course['summary'] = course['content']['root']['children'].pop(0)['children'][0]['text']
manifest = dict(source='ThierryMar/site_web@ff40fd1', introduction=intro, courses=courses)
(ROOT / 'src/content/legacy-marketing.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f"Extracted {len(intro['sections'])} introduction sections and {len(courses['sections'])} course overviews.")
