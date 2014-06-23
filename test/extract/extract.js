

// testing framework for extracting annotations
// cd to pdf.js folder
// python -m SimpleHTTPServer 8000
// http://localhost:8000/test/extract/index.html
// http://localhost:8000/test/extract/index.html?version=0
// http://localhost:8000/test/extract/index.html?branch=e7afce5549f3d1dcf052c4b23d1590bbfc2c338f

// for debugging
// http://localhost:8000/test/extract/index.html?version=0&file=/test/extract/pdf/Okihiro-2010.pdf&debug=1

'use strict';

var url = 'http://localhost:8000/{0}/{1}',
    script = 'http://localhost:8000/src/getPDFAnnotations.js',
    tooltips = {},
    getPDFAnnotations,
    pdfExtract = [{
            // introducted in zotfile version 3.3
            'version': '3.1dev',
            'name': 'v3_1dev',
            'branch': 'local',
            'scripts': ['/src/shared/util.js', '/src/shared/colorspace.js', '/src/display/pattern_helper.js', '/src/shared/function.js', '/src/shared/annotation.js', '/src/display/api.js', '/src/display/metadata.js', '/src/display/canvas.js', '/src/display/font_loader.js', '/src/getPDFAnnotations.js'],
            'worker': '/src/worker_loader.js'
        },
        {
            // introducted in zotfile version 3.3
            'version': '3.1',
            'name': 'v3_1',
            'branch': 'extract-v3.1',
            'scripts': ['src/shared/util.js', 'src/shared/colorspace.js', 'src/display/pattern_helper.js', 'src/shared/function.js', 'src/shared/annotation.js', 'src/display/api.js', 'src/display/metadata.js', 'src/display/canvas.js', 'src/display/font_loader.js', script],
            'worker': 'src/worker_loader.js'
            },
        {
            // introducted in zotfile version 3.2
            'version': '3',
            'name': 'v3',
            'branch': 'extract-v3',
            'scripts': ['src/shared/util.js', 'src/shared/colorspace.js', 'src/display/pattern_helper.js', 'src/shared/function.js', 'src/shared/annotation.js', 'src/display/api.js', 'src/display/metadata.js', 'src/display/canvas.js', 'src/display/font_loader.js', script],
            'worker': 'src/worker_loader.js'
            },
        {
            // introducted in zotfile version 3.0
            /* (Zou 2006 fix introduced in 3.1)*/
            'version': '2',
            'name': 'v2',
            'branch': 'extract-v2',
            'scripts': ['src/network.js', 'src/chunked_stream.js', 'src/pdf_manager.js', 'src/core.js', 'src/util.js', 'src/api.js', 'src/canvas.js', 'src/obj.js', 'src/function.js', 'src/charsets.js', 'src/cidmaps.js', 'src/colorspace.js', 'src/crypto.js', 'src/evaluator.js', 'src/fonts.js', 'src/glyphlist.js', 'src/image.js', 'src/metrics.js', 'src/parser.js', 'src/pattern.js', 'src/stream.js', 'src/worker.js', 'external/jpgjs/jpg.js', 'src/jpx.js', 'src/jbig2.js', script],
            'worker': 'src/worker_loader.js'
        }];

// get url arguments
var arg = getQueryParams(document.location.search),
    idx = arg.version ? arg.version : 0,
    compare = arg.version ? false : true;
arg.debug = arg.debug ? Number(arg.debug) : 0;

// load json file
$.getJSON('/test/extract/pdf-annotations.json', function(pdfs) {
    if(arg.file) {
        pdfs = pdfs.filter(function(pdf) {
            return pdf.file==arg.file;
        });
        pdfs = pdfs.length==1 ? pdfs : [{'file': arg.file}];
    }
    // create table
    createTable(pdfs, pdfExtract);
    // get files for extraction
    var loadExtractionScript = function(j) {
        var v = pdfExtract[j];
        console.log('getting files...');
        yepnope({
            // get files from github or locally
            load: v.scripts.map(function(src) {
                return (src.indexOf('http')===0 || v.branch=='local') ? src : url.format(v.branch, src);
            }),
            // get annotations
            complete: function () {
                var name = pdfExtract[j].name;
                console.log('extracting annotations (' + name + ')...');
                if(PDFJS.getPDFAnnotations)
                    getPDFAnnotations = PDFJS.getPDFAnnotations;
                else
                    PDFJS.getPDFAnnotations = getPDFAnnotations;
                // get annotations
                PDFJS.workerSrc = v.branch=='local' ? v.worker : url.format(v.branch, v.worker);
                // PDFJS.workerSrc = '/src/worker_loader.js';
                // var progress = function(x,y) {console.log('Pages ' + x + ' out of ' + y);},
                var progress = function(x,y) {};
                var getAnnos = function(i) {
                    var id = pdfs[i].file.split('/').last().replace('.pdf','');
                    // add filename to table
                    d3.select('tbody').select('tr#' + id)
                        .select('td#file').text(pdfs[i].file);
                    // gett annotations                    
                    PDFJS.getPDFAnnotations(pdfs[i].file, true, progress, arg.debug).then(function(annos) {
                        annos.version = pdfExtract[j].version;
                        console.log(annos);
                        var distance = [];
                        if(pdfs[i].annotations) {
                            // use string distance to determine quality of extraction
                            for (var k = 0; k < pdfs[i].annotations.length; k++) {
                                var anno = pdfs[i].annotations[k];
                                if(anno.markup==='')
                                    continue;
                                if(!annos.annotations[k].markup || annos.annotations[k].markup==='') {
                                    distance.push(0);
                                    continue;
                                }
                                var dist = 1-strDistance(anno.markup, annos.annotations[k].markup);
                                distance.push(dist);
                            }
                            // add results to table
                            var id = annos.url.split('/').last().replace('.pdf',''),
                                rows = [
                                    Math.round(annos.time*100)/100 + ' ms',
                                    100*Math.round(distance.min()*10000)/10000 + '%'
                                ];
                            var ver = annos.version.replace('.','_');
                            d3.select('tbody').select('tr#' + id).selectAll('#v' + ver)
                                .attr('id', function(d, ii) {
                                    var tip = id + '-tooltip-v' + ver + '-' + ii;
                                    if(ii==1) tooltips[tip] = {'original': annos.annotations, 'changed': pdfs[i].annotations};
                                    return tip;
                                })
                                .text(function(d, i) {return rows[i];});
                        }
                        // extract annotations from next file
                        if((i+1)<pdfs.length) {
                            getAnnos(i+1);
                        }
                        else {
                            if(compare && (j+1)<pdfExtract.length) {
                                PDFJS = undefined;
                                loadExtractionScript(j+1);
                            }
                            else {
                                console.log('Postprocessing...')
                                Object.keys(tooltips).forEach(function(key) {
                                    var head = '<div id="wrapper"> <table class="table table-striped table-bordered table-hover"> <thead> <tr> <th>Extracted</th> <th>Original</th> <th>Diff</th> </tr> </thead> <tbody>',
                                        row = '<tr> <td class="original">{0}</td> <td class="changed">{1}</td> <td class="diff"></td> </tr>',
                                        footer = '</tbody> </table> </div>',
                                        content = head,
                                        content_tt = head,
                                        idBox = key.replace('tooltip','fancybox');
                                    for (var l = 0; l < tooltips[key].changed.length; l++) {
                                        content += row.format(tooltips[key].original[l].markup, tooltips[key].changed[l].markup);
                                        if(l<4) content_tt += row.format(tooltips[key].original[l].markup, tooltips[key].changed[l].markup);
                                    };
                                    // add hidden div for fancybox
                                    d3.select('#fancybox-divs')
                                        .append('div')
                                        .attr('id', idBox);
                                    $('#' + idBox).html(content);
                                    $('#' + idBox).children('#wrapper tr')
                                        .prettyTextDiff({cleanup:true});
                                    // add tooltip
                                    $('#' + key).tooltipster({
                                        content: $(content_tt),
                                        theme: 'tooltipster-my',
                                        functionReady: function() {
                                            $('#wrapper tr').prettyTextDiff({cleanup:true});
                                        }
                                    });
                                    // change to fancybox link
                                    var el = d3.select('#' + key),
                                        p = el.text();
                                    el.text('');
                                    el.append('a')
                                        .attr('class', 'fancyBox')
                                        .attr('href', '#' + idBox)
                                        .text(p);
                                    $('.fancyBox').fancybox({});
                                });
                            }
                        }

                    }, function(error) {
                        console.error("Failed!!!!");
                        console.error("Failed!!!!", error);
                    });
                };
                getAnnos(0);
            }
        });
    };
    loadExtractionScript(idx);
});
