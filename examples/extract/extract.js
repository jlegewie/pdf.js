/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

// example to extract annotations
// cd to pdf.js folder
// python -m SimpleHTTPServer 8888
// http://localhost:8888/examples/extract/index.html

const SUPPORTED_ANNOTS = ["Text", "Highlight", "Underline"]

// Fetch the PDF document from the URL using promices
PDFJS.getDocument('/examples/extract/pdf/test2.pdf').then(function(pdf) {
  var annotations = [],
      numPages = pdf.numPages;

  // function to handle page (render and extract annotations)
  var extract = function(page) {    
      var scale = 1;
      var viewport = page.getViewport(scale);

      // Prepare canvas using PDF page dimensions
      var canvas = document.getElementById('the-canvas');
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      // get annotations
      var annotations;
      page.getAnnotations().then(function extractAnno(annos) {
        // filter for supported annotations
        annotations = annos.filter(function(anno) {return SUPPORTED_ANNOTS.indexOf(anno.type) >= 0;});
        // skip page if there is nothing interesting
        if (annotations.length==0) return;
        // render page
        page.render(renderContext).then(function() {
          // show annotations
          // console.log(annos.map(function(anno) {return anno;}));
          console.log(annotations.map(function(anno) {return anno.markup;}));
          console.log(annotations.map(function(anno) {return anno.content;}));
          // render next page
          if(numPages>page.pageNumber) pdf.getPage(page.pageNumber+1).then(extract);
        },
        // error handler for page
        function(error) {          
          // render next page
          if(numPages>page.pageNumber) pdf.getPage(page.pageNumber+1).then(extract);
        });

      });
    };

  // Using promise to fetch the page
  pdf.getPage(1).then(extract);

});



