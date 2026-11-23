"""Arma una página de repaso (por ejemplo, docs/mate-nive/final.html) copiando artículos de las páginas de unidad.

Así las soluciones son siempre las mismas que en la unidad: no se editan aquí, se editan en la unidad y se vuelve a
correr tools/sync.py (que llama a build()). La configuración está en tools/catalog.json, en la unidad con «build»:
  skeleton  página de unidad de la que se toma la cabecera, la barra de pestañas y la tarjeta de teoría
  topics    temas de la página: o un panel completo de ejemplos («from» + «panel»), o una lista de artículos («items»)
  scripts   gráficos que hay que cargar (los de las unidades de donde vienen los artículos)
Los artículos propios de la página (que no están en ninguna unidad) van en tools/final-extra.html.
"""
import os, re, html as H

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXTRA = os.path.join(ROOT, 'tools', 'final-extra.html')


def read(p): return open(p, encoding='utf-8').read()


def build(course, unit, web):
    cfg = unit['build']
    cdir = os.path.join(web, course['id'])
    pages = {}
    def page(name):
        if name not in pages:
            pages[name] = read(EXTRA) if name == 'final-extra' else read(os.path.join(cdir, name))
        return pages[name]
    def where(tid):
        """Página de unidad que tiene la caja de teoría tid."""
        for u in course['units']:
            if u.get('page') and not u.get('build') and ('id="%s"' % tid) in page(u['page']):
                return u['page']
        return None
    def clean(s):
        # sin «Parecido al ejercicio N de la unidad» ni «Ver la teoría ↑»: aquí no llevarían a nada
        s = re.sub(r'<button class="sim-btn[^"]*" type="button" data-goto="[^"]*">.*?</button>', '', s)
        # «Teoría» abre la teoría en la página de la unidad
        def teo(m):
            first = m.group(1).split()[0]; pg = where(first)
            return '<a class="teo-link" href="%s#%s">Teoría</a>' % (pg, first) if pg else ''
        s = re.sub(r'<button class="teo-btn" type="button" data-teo="([^"]+)" aria-expanded="false">Teoría</button>', teo, s)
        return s.replace('<span class="head-btns"></span>', '')
    def article(src, aid):
        m = re.search(r'\n  <article class="ej[^"]*" id="%s">.*?</article>' % re.escape(aid), page(src), re.S)
        if not m: raise SystemExit('final.py: no encuentro %s en %s' % (aid, src))
        return m.group(0)

    sk = page(cfg['skeleton'])
    head_end = sk.index('</div>', sk.index('<div class="tabs"')) + len('</div>')
    top = sk[:head_end]
    url = course_url = None
    # cabecera: título, descripción y direcciones de esta página
    title = '%s · %s | Studybook' % (unit['label'], course['name'])
    desc = cfg['description']
    top = re.sub(r'<title>.*?</title>', '<title>%s</title>' % H.escape(title), top)
    top = re.sub(r'(<meta (?:name|property)="(?:og:|twitter:)?title" content=")[^"]*', lambda m: m.group(1) + H.escape(title), top)
    top = re.sub(r'(<meta (?:name|property)="(?:og:|twitter:)?description" content=")[^"]*', lambda m: m.group(1) + H.escape(desc), top)
    top = re.sub(r'(<meta name="keywords" content=")[^"]*', lambda m: m.group(1) + H.escape(cfg['keywords']), top)
    top = re.sub(r'(%s/)%s' % (re.escape(course['id']), re.escape(cfg['skeleton'])), lambda m: m.group(1) + unit['page'], top)
    top = re.sub(r'<span aria-current="page">[^<]*</span>', '<span aria-current="page">%s</span>' % H.escape(unit['label']), top)
    top = re.sub(r'<h1>.*?</h1>', '<h1>%s</h1>' % H.escape(unit['label']), top)
    top = re.sub(r'<p class="lead">.*?</p>', '<p class="lead">%s</p>' % cfg['lead'], top, flags=re.S)
    top = re.sub(r'<!-- sb:units -->.*?<!-- /sb:units -->', '<!-- sb:units --><!-- /sb:units -->', top, flags=re.S)

    buttons, panels = [], []
    for i, t in enumerate(cfg['topics']):
        if 'panel' in t:
            src = page(t['from'])
            m = re.search(r'<div class="panel" id="%s"[^>]*>.*?\n</div>\n' % re.escape(t['panel']), src, re.S)
            if not m: raise SystemExit('final.py: no encuentro el panel ' + t['panel'])
            p = clean(m.group(0))
            p = re.sub(r'<div class="box"><h3>Ejemplos de práctica</h3><p>.*?</p></div>',
                       '<div class="box"><h3>Ejemplos de práctica</h3><p>%s</p></div>' % cfg['examples_note'], p, count=1)
            p = p.replace('>Ejemplos parecidos a los ejercicios de la unidad<', '>Ejemplos por tipo de ejercicio<')
            p = re.sub(r'<div class="panel" id="[^"]+"', '<div class="panel" id="pn-%s-ejemplos"' % t['id'], p, count=1)
            n = len(re.findall(r'<article class="ej ex[ "]', p))
            name = t.get('name') or re.search(r'data-topic="%s"[^>]*><span class="t-name">(.*?)</span>' % re.escape(t['id']), src).group(1)
            sub = t.get('sub', '').replace('{n}', str(n))
            panels.append('\n<!-- ===================== %s ===================== -->\n\n%s' % (H.unescape(name).upper(), p.rstrip('\n') + '\n'))
        else:
            arts = []
            for k, (src, aid) in enumerate(t['items'], 1):
                a = clean(article(src, aid))
                a = re.sub(r'<span class="num">[^<]*</span>', '<span class="num">%d</span>' % k, a, count=1)
                arts.append(a)
            n = len(arts)
            name, sub = t['name'], t.get('sub', '').replace('{n}', str(n))
            jump = '<div class="jump" aria-label="Ir al problema">' + ''.join(
                '<button data-go="%s">%d</button>' % (aid, k) for k, (_, aid) in enumerate(t['items'], 1)) + '</div>'
            panels.append('\n<!-- ===================== %s ===================== -->\n\n<div class="panel" id="pn-%s-solucionarios" role="tabpanel" hidden>\n'
                          '  <div class="box"><h3>%s</h3><p>%s</p></div>\n  %s\n%s\n</div>\n'
                          % (name.upper(), t['id'], H.escape(name), t['note'], jump, ''.join(arts)))
        buttons.append('  <button class="topic" data-topic="%s" aria-pressed="%s"><span class="t-name">%s</span><span class="t-sub">%s</span></button>'
                       % (t['id'], 'true' if i == 0 else 'false', name, sub))
    top = re.sub(r'<div class="topics" role="group" aria-label="Tema">.*?\n</div>',
                 '<div class="topics" role="group" aria-label="Tema">\n' + '\n'.join(buttons) + '\n</div>', top, flags=re.S)

    card = re.search(r'<div class="teo-card" id="teo-card".*?</div>\n', sk[head_end:], re.S)
    card_line = sk[head_end:][card.start():].split('\n', 1)[0]
    scripts = ''.join('<script src="../js/%s"></script>\n' % s for s in ['search-index.js', 'search.js', 'study.js'] + cfg['scripts'])
    out = (top + '\n' + ''.join(panels) + '\n</div>\n\n' + card_line + '\n' + scripts + '</body>\n</html>\n')
    path = os.path.join(cdir, unit['page'])
    old = read(path) if os.path.exists(path) else None
    # conserva la barra de unidades ya generada (sync.py la vuelve a escribir después)
    if old:
        mu = re.search(r'<!-- sb:units -->.*?<!-- /sb:units -->', old, re.S)
        if mu: out = out.replace('<!-- sb:units --><!-- /sb:units -->', mu.group(0), 1)
    if out != old:
        open(path, 'w', encoding='utf-8', newline='\n').write(out)
        return True
    return False
