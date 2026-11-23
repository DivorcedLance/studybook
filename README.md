# Studybook

Material de estudio de mis clases, publicado como sitio estático: https://divorcedlance.github.io/studybook/

Cada curso tiene sus unidades; cada unidad, sus temas; y cada tema, cuatro pestañas:

- **Teoría**: lo que hay que saber, con pasos cortos y "lo que hay que entender".
- **Ejercicios**: los de la unidad, resueltos paso a paso con los colores de clase y con los errores de la unidad señalados.
- **Ejemplos**: ejemplos de la teoría y dos ejemplos de práctica por cada ejercicio, con resultados exactos.
- **Solucionarios**: preguntas de PC y exámenes de ciclos anteriores, resueltas paso a paso.
- **Interactivo**: gráficos con controles para explorar el tema y práctica con preguntas que se generan solas.

Además: buscador de ejercicios, ejemplos, solucionarios, teoría e interactivos; botón «Hecho» en cada ejercicio (el avance se guarda en el navegador y se ve en la portada y en el curso); «Continuar donde te quedaste»; enlaces directos a un ejercicio (por ejemplo `mate-nive/unidad-5.html#pr10`).

Cada ejercicio indica su dificultad: básico, intermedio o avanzado.

## Cursos

- **Mate Nive** (propedéutico en matemáticas, Universidad del Pacífico, 2026-0): Unidad 4 (parábolas, circunferencias, oferta y demanda), Unidad 5 (magnitudes proporcionales, interés, progresiones y sumatorias) y **Final**, una página de repaso con todos los ejemplos de la Unidad 5 agrupados por tema y las preguntas del repaso de clase.

## Estructura

```
docs/                        sitio estático (lo que se publica)
  index.html                 portada: lista de cursos
  <curso>/index.html         página del curso: lista de unidades
  <curso>/unidad-N.html      una página por unidad (temas y pestañas)
  css/study.css              estilos compartidos
  js/study.js                motor: pestañas, gráficos (SB.plot), tarjeta de teoría, «Hecho», enlaces directos, modo oscuro
  js/iw.js                   piezas de los elementos interactivos (deslizadores, práctica, formato de números)
  js/<curso>/uN-int.js       elementos interactivos de cada unidad (SB.widget)
  js/search.js               buscador
  js/search-index.js         índice de búsqueda (lo genera tools/sync.py)
  js/mathjax.js              configuración de MathJax y macros de colores (\az, \na, \mo, \ve, \ma)
  js/<curso>/uN.js           gráficos de cada unidad
  js/home.js                 modo oscuro de la portada y del curso
tools/catalog.json           cursos y unidades (títulos, temas de las unidades sin página)
tools/sync.py                regenera la navegación y los conteos a partir del catálogo y de las páginas
tools/final.py               arma la página Final copiando los ejemplos de las unidades (lo llama sync.py)
tools/final-extra.html       artículos propios de la página Final (los que no están en ninguna unidad)
material/                    PDF de unidades, apuntes y compendios (solo local, no se sube)
                             GitHub Pages publica docs/ de la rama main
```

Después de agregar o cambiar una unidad, un tema o un ejercicio, correr `python tools/sync.py` para actualizar la barra de unidades, las tarjetas del curso, los conteos, el índice de búsqueda y la página Final. La página Final no se edita a mano: sus soluciones se cambian en la unidad y se vuelve a correr `sync.py`.

Para verla en local basta abrir `docs/index.html` en el navegador.
