# Studybook

Material de estudio de mis clases, publicado como sitio estático: https://divorcedlance.github.io/studybook/

Cada curso tiene sus unidades; cada unidad, sus temas; y cada tema, cuatro pestañas:

- **Teoría**: lo que hay que saber, con pasos cortos y "lo que hay que entender".
- **Ejercicios**: los de la unidad, resueltos paso a paso con los colores de clase y con los errores de la unidad señalados.
- **Ejemplos**: ejemplos de la teoría y dos ejemplos de práctica por cada ejercicio, con resultados exactos.
- **Solucionarios**: preguntas de PC y exámenes de ciclos anteriores, resueltas paso a paso.

Cada ejercicio indica su dificultad: básico, intermedio o avanzado.

## Cursos

- **Mate Nive** (propedéutico en matemáticas, Universidad del Pacífico, 2026-0): Unidad 4 (parábolas, circunferencias, oferta y demanda) y Unidad 5 (magnitudes proporcionales, interés, progresiones y sumatorias).

## Estructura

```
docs/                        sitio estático (lo que se publica)
  index.html                 portada: lista de cursos
  <curso>/index.html         página del curso: lista de unidades
  <curso>/unidad-N.html      una página por unidad (temas y pestañas)
  css/study.css              estilos compartidos
  js/study.js                motor: pestañas, gráficos (SB.plot), tarjeta de teoría, modo oscuro
  js/mathjax.js              configuración de MathJax y macros de colores (\az, \na, \mo, \ve, \ma)
  js/<curso>/uN.js           gráficos de cada unidad
  js/home.js                 modo oscuro de la portada y del curso
tools/catalog.json           cursos y unidades (títulos, temas de las unidades sin página)
tools/sync.py                regenera la navegación y los conteos a partir del catálogo y de las páginas
material/                    PDF de unidades, apuntes y compendios (solo local, no se sube)
                             GitHub Pages publica docs/ de la rama main
```

Después de agregar una unidad o un tema, correr `python tools/sync.py` para actualizar la barra de unidades, las tarjetas del curso y los conteos.

Para verla en local basta abrir `docs/index.html` en el navegador.
