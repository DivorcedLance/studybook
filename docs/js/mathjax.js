window.MathJax={
  tex:{inlineMath:[['\\(','\\)']],displayMath:[['\\[','\\]']],
    macros:{
      az:['{\\color{blue}{#1}}',1], na:['{\\color{darkorange}{#1}}',1], mo:['{\\color{purple}{#1}}',1],
      ve:['{\\color{green}{#1}}',1], ma:['{\\color{magenta}{#1}}',1],
      am:['{\\bbox[yellow,2px]{#1}}',1], ce:['{\\bbox[cyan,2px]{#1}}',1]
    }},
  svg:{fontCache:'global'},
  startup:{typeset:false,ready(){MathJax.startup.defaultReady();MathJax.startup.promise.then(()=>{window.__mj=true;window.__onMJ&&window.__onMJ()})}}
};
