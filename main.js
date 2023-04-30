// JavaScript
function changeColor() { 
  var elem = document.getElementById('the-title'); // Get element 
  let white = 0xFFFFFF; // White Color
  let num = Math.random() * white; // Using Math Library/ Functions
  num = Math.floor(num);
  num = num.toString(16); // Hexadecimal Language
  let randColor = num.padStart(6, 0);  // Únicos numeros que puede tener 
  newColor= `#${randColor.toUpperCase()}` // New Color saved
  elem.style.color = newColor; // Change to new color
}
// Implementation AJJAX
function loadReturn() { // To return to the main page
  const xhttp = new XMLHttpRequest(); // New Request
  xhttp.onload = function() { 
    document.getElementById("demo").innerHTML =
    this.responseText; // Gets the element and replaces the old website with the new website 
  }
  xhttp.open("GET", "Index.html"); // Get name of the old website, in this case our menu
  xhttp.send(); // Sends the request
}


