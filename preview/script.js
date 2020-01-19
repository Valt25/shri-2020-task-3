function toggleAccordion(event) {
    const findNode = node => {
      if (!node || !node.className) {
        return;
      }
  
      if (node.className.includes('history__transaction')) {
        const additionalElement = node.querySelector(`.history__hide`);
  
        if (window.getComputedStyle(additionalElement).display === "none") {
          additionalElement.style.display = "flex";
        } else {
          additionalElement.style.display = "none";
        }
  
        return;
      }
  
      return findNode(node.parentNode);
    };
  
    findNode(event.target);
}
  
function switchTheme() {
    const def = document.querySelectorAll('.theme_color_project-default')
    const inverse = document.querySelectorAll('.theme_color_project-inverse')

    if (def.length > 0) {
        for (let theme of def) {
            theme.classList.remove('theme_color_project-default');
            theme.classList.add('theme_color_project-inverse');    
        }
    }
    if (inverse.length > 0) {
        for (let theme of inverse) {
            theme.classList.remove('theme_color_project-inverse');
            theme.classList.add('theme_color_project-default');    
        }
    }
}

function router(event) {
    toggleAccordion(event);
  
    if (event.target.className === "onoffswitch__button") {
        switchTheme();
    }
}
  
  
document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body");

    body.addEventListener("click", router);
});
