/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

// example to extract annotations
// cd to pdf.js folder
// python -m SimpleHTTPServer 8888
// http://localhost:8888/examples/extract/index.html

out = [];
// 'use strict';
var SUPPORTED_ANNOTS = ['Text','Highlight','Underline'];

// PDFJS.getDocument('/examples/extract/pdf/Lee-2010.pdf').then(function(pdf) {
// PDFJS.getDocument('/examples/extract/pdf/legewie-dissertation-2.pdf').then(function(pdf) {
// PDFJS.getDocument('/examples/extract/pdf/test.pdf').then(function(pdf) {
// PDFJS.getDocument('/examples/extract/pdf/Topic 4JoelsTiCSfinal.pdf').then(function(pdf) {
// PDFJS.getDocument('/examples/extract/pdf/Bertrand et al-2005-Implicit Discrimination.pdf').then(function(pdf) {
PDFJS.getDocument('/examples/extract/pdf/R-News.pdf').then(function(pdf) {
// PDFJS.getDocument('/examples/extract/pdf/Heise_1975_Causal Analysis.pdf').then(function(pdf) {
// PDFJS.getDocument("/examples/extract/pdf/Zuberi-2012.pdf").then(function(pdf) {
  // get table of content for pdfs
  pdf.getOutline().then(function(outline) {
    if(outline===null) {
      console.log('No toc in pdf');  
      return;
    }
    console.log(outline);
    
    // build page index
    var pageIndex = [],
        pageMap = {};
    var buildIndex = function(obj) {
      if(obj['dest'] && obj['dest'][0])
        pageIndex.push(obj['dest']);
      obj['items'].forEach(buildIndex);
    };
    outline.forEach(buildIndex);

    // create page map
    pdf.getDestinations().then(function(dest) {
      var sequence = Promise.resolve();
      pageIndex.reduce(function(sequence, ref) {
        // Add these actions to the end of the sequence
        return sequence.then(function() {
          return typeof ref =='string' ?
            ((ref in dest && dest[ref]!==null) ? pdf.getPageIndex(dest[ref][0]) : 0) :
             pdf.getPageIndex(ref[0]);
        }).then(function(page) {
          var key = typeof ref =='string' ? ref : JSON.stringify(ref[0]);
          pageMap[key] = page;
        });
      }, Promise.resolve()).then(function() {
        var toc = function(obj) {
          var key, page;
          if(obj['dest']) {
            key = typeof obj['dest'] =='string' ? obj['dest'] : JSON.stringify(obj['dest'][0]);
            page = pageMap[key];
          }
          return {
            'page': page,
            'title': obj['title'],
            'items': obj['items'].map(toc)
          };
        };
        outline = outline.map(toc);
        // remove toc items with undefined page
        
        // remove highest level if it just has one item
        if(outline.length==1)
          if(outline[0]['items'].length>0)
            outline = outline[0]['items'];
        console.log('outline');
        console.log(outline);
        out = outline;
      });
    });



    // get page for dest object
    // pdf.getPageIndex({"num":1816,"gen":0}).then(function(p) {console.log(p);});
    /*pdf.getDestinations().then(function(dest) {
      console.log('dest');
      console.log(dest);});*/
  });
},
function(err) {
  console.log('unable to open pdf: ' + err);
});

// var li = '<li style="padding-top:4px"><a href="zotero://open-pdf/%(key)/%(page)">%(title)</a></li>';


// var when = Function.prototype.apply.bind( jQuery.when, null );


// Fetch the PDF document from the URL using promices
/*PDFJS.getDocument('/examples/extract/pdf/test.pdf').then(function(pdf) {
  var n_annos = 0,
      numPages = pdf.numPages;

  // function to handle page (render and extract annotations)
  var getAnnotationsFromPage = function(page) {
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
      // error handler
      var errorHandler = function(error) {
        console.log(error);
        // continue with next page
        if(numPages>page.pageNumber)
          pdf.getPage(page.pageNumber+1).then(
            getAnnotationsFromPage,
            function(err) {console.log('error getting the page:' + err);}
          );
      };
      // get annotations
      var annotations;
      page.getAnnotations().then(function extractAnno(annos) {
          // filter for supported annotations
          annos.map(function(a) {
            if (a.subtype===undefined) a.subtype=a.type;
            return a;
          });
          annotations = annos.filter(function(anno) {
            return SUPPORTED_ANNOTS.indexOf(anno.subtype) >= 0;
          });
          // skip page if there is nothing interesting
          if (annotations.length===0) {
            if(numPages>page.pageNumber)
              pdf.getPage(page.pageNumber+1).then(
                getAnnotationsFromPage,
                function(err) {console.log('error getting the page:' + err);}
              );
            return;
          }
          var render = page.render(renderContext, annotations);
          if (render.promise!==undefined) render = render.promise;
          render.then(function() {
            // clean markup
            var markup = annotations
              .filter(function(anno) {return typeof anno.markup !== 'undefined';})
              .map(function(anno) {
                anno.markup = anno.markup.map(function(part) {return part.trim();});
                return anno.markup.join(' ').trim()
                  .replace('\ufb00','ff').replace('\ufb01','fi').replace('\ufb02','fl')
                  .replace(/\ufb03/g,'ffi').replace(/\ufb04/g,'ffl').replace(/\ufb05/g,'ft')
                  .replace(/\ufb06/g,'st').replace(/\uFB00/g,'ff').replace(/\uFB01/g,'fi')
                  .replace(/\uFB02/g,'fl').replace(/\uFB03/g,'ffi').replace(/\uFB04/g,'ffl')
                  .replace(/\uFB05/g,'ft').replace(/\uFB06/g,'st')
                  .replace(/\u201D/g,'"').replace(/\u201C/g,'"').replace(/\u2019/g,"'").replace(/\u2018/g,"'")
                  .replace(/\u2013/g,'-').replace(/''/g,'"');
            });
            // show results
            console.log('PAGE ' + page.pageNumber);
            console.log(annotations);
            for (var i = 0; i < markup.length; i++)
              console.log(markup[i]);

            // render next page
            if(numPages>page.pageNumber)
              pdf.getPage(page.pageNumber+1).then(
                getAnnotationsFromPage,
                function(err) {console.log('error getting the page:' + err);}
              );
          }, errorHandler);
      }, errorHandler);
  };

  // Using promise to fetch the page
  pdf.getPage(1).then(
    getAnnotationsFromPage,
    function(err) {console.log('error getting the page:' + err);}
  );

},
function(err) {
  console.log('unable to open pdf: ' + err);
});*/

