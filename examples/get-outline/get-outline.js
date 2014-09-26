/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

// example to extract annotations
// cd to pdf.js folder
// python -m SimpleHTTPServer 8888
// http://localhost:8888/examples/extract/index.html

out = [];
// 'use strict';
var SUPPORTED_ANNOTS = ['Text','Highlight','Underline'];

PDFJS.getDocument('/examples/extract/pdf/test.pdf').then(function(pdf) {
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
  });
},
function(err) {
  console.log('unable to open pdf: ' + err);
});
