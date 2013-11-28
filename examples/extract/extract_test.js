/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

// example to extract annotations
// cd to pdf.js folder
// python -m SimpleHTTPServer 8888
// http://localhost:8888/examples/extract/index.html

const SUPPORTED_ANNOTS = ["Text", "Highlight", "Underline"]

// Fetch the PDF document from the URL using promices
var examples = [{
    'pdf':'/examples/extract/pdf/test2.pdf',
    'annos':['one-standard-deviation gap has']
  },{
    'pdf':'/examples/extract/pdf/dip buch test copy.pdf',
    'annos':['A key ingredient in this formula is the academic climate of the school. As we have already noted, the most obvious source of strong academic climate is a classroom with', 
             'The male deficit in college completion points to four strategies for social policy that would arguably raise the achievement and attainment of boys and also be of benefit to girls.']
  },
  {
    'pdf': '/examples/extract/pdf/Baldwin copy.pdf',
    'annos':['A straightforward and easily interpretable measure of group-based income differences is BGI. This measure is based on the familiar Gini index, but instead of calculating inequality based on each individ- ual\'s income, it assigns each group\'s mean income to every member of that group. It can be interpreted as the expected difference in the mean income of the ethnic groups of any two randomly selected individuals. The differences in the mean incomes are weighted by (two times) the mean income of the society, a normalization that allows comparisons of BGI scores across countries']
  },
  // {
  //   'pdf':'/examples/extract/pdf/Baldwin_Huber_2010_Economic Versus Cultural Differences.pdf',
  //   'annos':['This article addresses this question by focusing on the nature of substantive differences between groups. The vast majority of cross-national evidence about ethnic diversity and governance uses the standard measure of ELF (e.g., Alesina et al. 2003; Alesina and La Ferrara 2005; Collier 2000; Easterly and Levine 1997; La Porta et al. 1999). This measure contains information about the identity and size of groups but incorporates no other information about groups\' substantive charac- teristics',
  //       'article examines two important types of differ- ences between groups—cultural and economic.',
  //       'This article',
  //       'Which measure of ethnic diversity shows the strongest association with public goods provision? We do not find a robust empirical relationship between either the standard ELF measure or measures of cul- tural difference and public goods provision. However, the tests do reveal that between-group inequality has a large, robust negative relationship with public goods provision. Countries with higher levels of inequality between groups have lower levels of public goods, a finding that has important implications for understand- ing the pathways by which ethnic diversity creates gov- ernance problems.',
  //       'This article demonstrates that it is possible to mea- sure differences in the economic well-being of groups using existing cross-national surveys of citizens. Specif- ically, we use between-group inequality (BGI), which is a weighted average of the differences in mean in- comes across groups in a country, as a measure of economic differences between groups.',
  //       'A straightforward and easily interpretable measure of group-based income differences is BGI. This measure is based on the familiar Gini index, but instead of calculating inequality based on each individ- ual\'s income, it assigns each group\'s mean income to every member of that group. It can be interpreted as the expected difference in the mean income of the ethnic groups of any two randomly selected individuals. The differences in the mean incomes are weighted by (two times) the mean income of the society, a normalization that allows comparisons of BGI scores across countries',        
  //       'with different income scales. The formula is',
  //       'Like the Gini, BGI ranges from 0 to 1. It takes on its minimum value of 0 when the average incomes of all groups in society are the same, and it takes on its',
  //       'maximum value of 1 when one infinitely small group controls all the income in society.',        
  //       'The empirical analysis tells a clear story. First, and most important, we find a strong and robust relation- ship between the level of public goods provision and between-group inequality. In contrast, neither tradi- tional measures of ELF nor cultural differences be- tween groups (measured using information about the languages groups speak) has such a relationship. Sec- ond, although there are clear limits on how hard we can push our data, we have suggestive evidence that between-group economic differences lead to lower public goods provision, particularly in the less estab- lished democracies. Third, we find that when control- ling for group economic differences, the overall level of inequality itself has no impact on public goods provi- sion. The analysis therefore strongly suggests that pay- ing more attention to group economic differences will yield strong dividends in efforts to understand the im- pacts of ethnic diversity and inequality on governance.']
  // },
  {
    'pdf':'/examples/extract/pdf/Golder_Macy_2011_Diurnal and Seasonal Mood Vary with Work, Sleep, and Daylength Across Diverse.pdf',
    'annos':[
        'Using Twitter.com\'s data access protocol, we collected up to 400 public messages from each user in the sample, excluding users with fewer',
        'Our study also uses data from Twitter, whose 140-character limit on message length allows conversation-like exchanges. Text analysis of these messages provides a detailed measure of individ- uals\' spontaneous affective expressions across the globe. We measured PA and NA using Lin- guistic Inquiry and Word Count (LIWC), a prom- inent lexicon for text analysis (17). The LIWC lexicon was designed to analyze diverse genres of text, such as "e-mails, speeches, poems, or transcribed daily speech." LIWC contains lists of words or word stems that measure 64 behavioral and psychological dimensions, including PA and NA, as well as "anxiousness," "anger," and "in- hibition." These lists were created using emotion rating scales and thesauruses and validated by independent judges. Bantum and Owen (18) found that for all emotional expression words, LIWC\'s sensitivity and specificity values were 0.88 and 0.97, respectively. We used a lexicon containing only English words, and all reported results in- clude only English speakers; the English profi- ciency measure is described in (19) and its distribution is shown in fig. S5.',
        'Several recent studies have examined the af- fective and semantic content of messages from online sources such as Twitter, a microblog- ging site that records brief, time-stamped public comments from hundreds of millions of people worldwide (12-15). Using data from Twitter, O\'Connor et al. (13) found that opinions about specific issues and political candidates varied',
        'from day to day. Dodds and Danforth (14)showed how the affective valence of songs, musicians, and blog posts depends on the day of week, especially holidays. In an unpublished study, Mislove et al. (16) used Twitter messages to examine what they refer to as the "pulse of the nation" as it varies across the week and moves across time zones.',
        'than 25 messages. The resulting corpus contained about 2.4 million individuals from across the globe and 509 million messages authored between February 2008 and January 2010 (tables S1 to S4).',
        'D. Lazer et al., Science 323, 721 (2009).']
  }]



var example = examples[0];


var getPDF = function(pdf) {

// /* ? */ PDFJS.getDocument('/examples/extract/pdf/Dobbie_Fryer_2011_Getting Beneath the Veil of Effective Schools.pdf').then(function(pdf) {
// /* + */ PDFJS.getDocument('/examples/extract/pdf/dip buch test copy3.pdf').then(function(pdf) {
// /* + */ PDFJS.getDocument('/examples/extract/pdf/test2.pdf').then(function(pdf) {
// /* + */ PDFJS.getDocument('/examples/extract/pdf/Golder_Macy copy.pdf').then(function(pdf) {
// /* + */ PDFJS.getDocument('/examples/extract/pdf/Golder_Macy_2011_Diurnal and Seasonal Mood Vary with Work, Sleep, and Daylength Across Diverse.pdf').then(function(pdf) {
// /* ? */ PDFJS.getDocument('/examples/extract/pdf/Ristanovic_Protic_2012_Once Upon a Pocket.pdf').then(function(pdf) {

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
        // console.log('Page: '+page.pageNumber + " ("+annos.length+" annotations [" + JSON.stringify(annos.map(function(a) {return a.type;})) + "])");
        // filter for supported annotations
        annotations = annos.filter(function(anno) {return SUPPORTED_ANNOTS.indexOf(anno.type) >= 0;});
        // skip page if there is nothing interesting
        if (annotations.length==0) {
          if(numPages>page.pageNumber) pdf.getPage(page.pageNumber+1).then(extract,function(err) {console.log('error getting the page:' + err)});
          else {
            // get next document
            if (n_pdfs<examples.length)
              PDFJS.getDocument(examples[n_pdfs++].pdf).then(getPDF);
          }
          return;
        }
        // render page
        page.render(renderContext).then(function() {
          // console.log('Page: '+page.pageNumber + " (page rendered)");
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
              
          for (var i = 0; i < markup.length; i++){
            var same = examples[n_pdfs-1].annos[n_annos++]==markup[i];
            console.log(same ? 'VALID! (' + examples[n_pdfs-1].pdf+ ')' : 'INVALID(' + examples[n_pdfs-1].pdf+ ')');
            if(!same) console.log(markup[i]);
          }

          // var same = examples[n_pdfs-1].annos[n_annos++]==markup;
          // console.log(same ? 'VALID! (' + examples[n_pdfs-1].pdf+ ')' : 'INVALID(' + examples[n_pdfs-1].pdf+ ')');
          // if(!same) console.log(markup);

          // console.log(annotations.map(function(anno) {return anno.content;}));

          // get criteria from canvas.js
          // get width of all spaced in []
          // include spaces based on width of all spaces

          // render next page
          if(numPages>page.pageNumber) pdf.getPage(page.pageNumber+1).then(extract,function(err) {console.log('error getting the page:' + err)});
          else {
            // get next document
            if (n_pdfs<examples.length)
              PDFJS.getDocument(examples[n_pdfs++].pdf).then(getPDF);
          }
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

}/*,
function(err) {
  console.log('unable to open pdf: ' + err);
})*/;
// });


//examples.forEach(function(example){
var n_pdfs=0;
PDFJS.getDocument(examples[n_pdfs++].pdf).then(getPDF);
