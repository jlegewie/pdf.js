/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

//
// See README for overview
//

'use strict';

// PROBLEM: hard3, hard4, hard6

// https://github.com/mozilla/pdf.js/pull/1119
// cd '/Users/jlegewie/Documents/coding/pdf.js'
// python -m SimpleHTTPServer 8888
// http://localhost:8888/examples/extract/index.html
// http://localhost:8888/zotfile/chrome/content/zotfile/pdfextract/extract.html

// Fetch the PDF document from the URL using promices
//
// PDFJS.getDocument('test2.pdf').then(function(pdf) {
PDFJS.getDocument('/examples/helloworld/pdf/zotfile-test.pdf').then(function(pdf) {
  var annotations = [];
  // Using promise to fetch the page

  var extract = function(page) {    
      var scale = 1;
      var viewport = page.getViewport(scale);

      //
      // Prepare canvas using PDF page dimensions
      //
      var canvas = document.getElementById('the-canvas');
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      //
      // Render PDF page into canvas context
      //
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      page.render(renderContext).then(function(x) {
        // annotations
        page.getAnnotations().then(function extractAnno(annotations) {        
          var annos = annotations.filter(function(anno) {return anno.type!="Link";});
          console.log("PAGE: " + page.pageNumber);
          console.log(annos.map(function(anno) {return anno.markup;}));
          console.log(annos.map(function(anno) {return anno.content;}));
          //console.log(annotations.filter(function(anno) {return anno.type=="Highlight";}));

          if(numPages>page.pageNumber) return pdf.getPage(page.pageNumber+1).then(extract);
          else {
            return ;
          }
          
        });
        
      });
      /*page.getTextContent().then(function test(content) {
        console.log(content);
      });*/

    };
  var numPages = pdf.numPages;
  pdf.getPage(1).then(extract);
  // for (var i = 1; i <= numPages; i++) {
  //   pdf.getPage(i).then(action);
  // }
});



