/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

// example to extract annotations
// cd to pdf.js folder
// python -m SimpleHTTPServer 8888
// http://localhost:8888/examples/extract/index.html

const SUPPORTED_ANNOTS = ["Text", "Highlight", "Underline"]

// Fetch the PDF document from the URL using promices
PDFJS.getDocument('/examples/extract/pdf/test.pdf').then(function(pdf) {

  var n_annos = 0,
      numPages = pdf.numPages;
      // console.log('PDF' + example.pdf + ' (pages: '+numPages+')');
      // console.log('Info: '+JSON.stringify(pdf.pdfInfo));
      // console.log('Encrypted: '+JSON.stringify(pdf.isEncrypted()));
      // pdf.getMetadata().then(function(meta) {console.log('Metadata: ' + JSON.stringify(meta));});

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

      // page.getTextContent().then(function(content){console.log(content);});

      // get annotations
      var annotations;
      page.getAnnotations().then(function extractAnno(annos) {
        console.log('Page: '+page.pageNumber + " ("+annos.length+" annotations [" + JSON.stringify(annos.map(function(a) {return a.type;})) + "])");
        // filter for supported annotations
        annotations = annos.filter(function(anno) {return SUPPORTED_ANNOTS.indexOf(anno.type) >= 0;});
        // skip page if there is nothing interesting
        if (annotations.length==0) {
          if(numPages>page.pageNumber) pdf.getPage(page.pageNumber+1).then(extract,function(err) {console.log('error getting the page:' + err)});
          return;
        }
        // render page
        page.render(renderContext).then(function() {
          console.log('Page: '+page.pageNumber + " (page rendered)");
          // show annotations
          // console.log(annos.map(function(anno) {return anno;}));
          var markup = annotations
            // .filter(function(anno) {return typeof anno.markup !== 'undefined';})
            .map(function(anno) {return anno.markup.join(' ').trim()
            .replace('\ufb00','ff').replace('\ufb01','fi').replace('\ufb02','fl')
            .replace(/\ufb03/g,'ffi').replace(/\ufb04/g,'ffl').replace(/\ufb05/g,'ft')
            .replace(/\ufb06/g,'st').replace(/\uFB00/g,'ff').replace(/\uFB01/g,'fi')
            .replace(/\uFB02/g,'fl').replace(/\uFB03/g,'ffi').replace(/\uFB04/g,'ffl')
            .replace(/\uFB05/g,'ft').replace(/\uFB06/g,'st')
            .replace(/\u201D/g,'"').replace(/\u201C/g,'"').replace(/\u2019/g,"'")
            .replace(/\u2013/g,"-");});

          // var markup = markup.replace(/[\uE000-\uF8FF]/g, '');
          // console.log(examples[n_pdfs].annos[n_annos]);
          for (var i = 0; i < markup.length; i++)
            console.log(markup[i]);

          // console.log(annotations.map(function(anno) {return anno.content;}));

          // get criteria from canvas.js
          // get width of all spaced in []
          // include spaces based on width of all spaces

          // render next page
          if(numPages>page.pageNumber) pdf.getPage(page.pageNumber+1).then(extract,function(err) {console.log('error getting the page:' + err)});
        },
        // error handler for page
        function(error) {
          console.log('Error rendering the page: ', error);
          // continue with next page
          if(numPages>page.pageNumber) pdf.getPage(page.pageNumber+1).then(extract,function(err) {console.log('error getting the page:' + err)});
        });

      },
      // error handler for page
      function(error) {
        console.log(error);
        // continue with next page
        if(numPages>page.pageNumber) pdf.getPage(page.pageNumber+1).then(extract,function(err) {console.log('error getting the page:' + err)});
      });
    };

  // Using promise to fetch the page
  pdf.getPage(1).then(extract,function(err) {console.log('error getting the page:' + err)});

},
function(err) {
  console.log('unable to open pdf: ' + err);
});


