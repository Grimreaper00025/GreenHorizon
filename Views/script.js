function typeWriter(text, i, elem) {
    if (i < text.length) {
      document.getElementById(elem).innerHTML += text.charAt(i);
      i++;
      setTimeout(function() { typeWriter(text, i, elem) }, 20);
    }
  }
  var text=" Re-empowering individuals,businesses and communities to embrace green energy solutions"
  typeWriter(text, 0, 'message');

  