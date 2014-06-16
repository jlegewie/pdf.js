/**
 * PDF.js extension that extracts highlighted text and annotations from pdf files.
 * Based on modified version of pdf.js available here https://github.com/jlegewie/pdf.js
 * (see various extract branches). See 'PDF Reference Manual 1.7' section 8.4 for details on 
 * annotations in pdf files.
 */

'use strict';

/**
 * @return {Promise} A promise that is resolved with an Object
 * that includes elements for path, time, and annotations.
 */
PDFJS.getPDFAnnotations = function(url, removeHyphens, useColor, progress, debug) {
    // set default values
    removeHyphens = typeof removeHyphens !== 'undefined' ? removeHyphens : true;
	useColor = typeof useColor !== 'undefined' ? useColor : true;
    progress = typeof progress !== 'undefined' ? progress : function(x, y) {};
    debug = typeof debug !== 'undefined' ? debug : false;
    var legacyPromise = PDFJS.Promise!==undefined;
    // Return a new promise (with support for legacy pdf.js promises)
    /* http://www.html5rocks.com/en/tutorials/es6/promises*/
    var extract = function(resolve, reject) {
        var SUPPORTED_ANNOTS = ['Text','Highlight','Underline'],
            obj = {
				annotationsAll: [],
                annotationsRed: [],
				annotationsGreen: [],
				annotationsBlue: [],
				annotationsYellow: [],
				annotationsOrange: [],
				annotationsMagenta: [],
				annotationsCyan: [],
				annotationsGray: [],
				annotationsBlack: [],
				annotationsWhite: [],
				time:null,
                url: typeof url=='string' ? url : ''
            };
        // Fetch the PDF document from the URL using promices
        PDFJS.getDocument(url).then(function(pdf) {
            var n_annos = 0,
                numPages = pdf.numPages,
                time_start = performance.now();

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
                    progress(page.pageNumber, numPages);
                    console.log(error);
                    // continue with next page
                    if(numPages>page.pageNumber)
                        pdf.getPage(page.pageNumber+1).then(
                          getAnnotationsFromPage,
                          function(err) {legacyPromise ? promise.reject(obj) : reject(err);});
                    else {
                        var end = performance.now();
                        obj.time = end-time_start;
                        legacyPromise ? promise.resolve(obj) : resolve(obj);
                    }
                };
                // get annotations
                page.getAnnotations().then(function extractAnno(annos) {
                    // compatibility for old pdf.js version and filter for supported annotations
                    annos = annos
                        .map(function(anno) {
                            if (anno.subtype===undefined) anno.subtype=anno.type;
                            return anno;
                        })
                        .filter(function(anno) {
                            return SUPPORTED_ANNOTS.indexOf(anno.subtype) >= 0;
                        });
                    // skip page if there is nothing interesting
                    if (annos.length===0) {
                        progress(page.pageNumber,numPages);
                        if(numPages>page.pageNumber)
                            pdf.getPage(page.pageNumber+1).then(
                              getAnnotationsFromPage,
                              function(err) {legacyPromise ? promise.reject(obj) : reject(err);});
                        else {
                            var end = performance.now();
                            obj.time = end-time_start;
                            legacyPromise ? promise.resolve(obj) : resolve(obj);
                        }
                        return;
                    }
                    // render page
                    var render = page.render(renderContext, annos);
                    if (render.promise!==undefined) render = render.promise;
                    render.then(function() {                    	   
						// function to convert RGB to HSL, modified from http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
						function convertRGBtoHSL(r, g, b){
						    var max = Math.max(r, g, b), min = Math.min(r, g, b);
						    var h, s, l = (max + min) / 2;
						    if(max == min){
						        h = s = 0; // achromatic
						    }
							else{
						        var d = max - min;
						        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
						        switch(max){
						            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
						            case g: h = (b - r) / d + 2; break;
						            case b: h = (r - g) / d + 4; break;
						        }
						        h /= 6;
						    }
						    return [h, s, l];
						}
						// function to add color classes, modified from http://stackoverflow.com/questions/8457601/how-can-i-classify-some-color-to-color-ranges
						function addColorClass (h, s, l) {    
							if (l < 0.15)  {
								return "Black";
							}
							else {
								if (l > 0.98) {
								return "White";
								}
								else {
									if (s < 0.2) {
									return "Gray";
									}
									else {
										if (h < 0.08) {
										return "Red";
										}
										else {
											if (h < 0.12) {
											return "Orange";
											}
											else {
												if (h < 0.25) {
												return "Yellow";
												}
												else {
													if (h < 0.42) {
													return "Green";
													}
													else {
														if (h < 0.58)  {
														return "Cyan";
														}
														else {
															if (h < 0.75) {
															return "Blue";
															}
															else {
																if (h < 0.92) {
																return "Magenta";
																}
																else {
																	return "Red";
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
						// clean markup and modify color information
                        annos = annos.map(function(anno) {
                            anno.page = page.pageNumber;
							//convert embedded dRGB color into HSL and add color class
							anno.color = convertRGBtoHSL(anno.color[0],anno.color[1],anno.color[2]);
							anno.colorClass = addColorClass(anno.color[0],anno.color[1],anno.color[2]);
                            // clean markup
                            if(anno.markup) {
                                anno.markup = anno.markup
                                  .map(function(part) {return part.trim();})
                                  .join(' ').trim()
                                  // translate ligatures (e.g. 'ﬁ')
                                  .replace('\ufb00','ff').replace('\ufb01','fi').replace('\ufb02','fl')
                                  .replace(/\ufb03/g,'ffi').replace(/\ufb04/g,'ffl').replace(/\ufb05/g,'ft')
                                  .replace(/\ufb06/g,'st').replace(/\uFB00/g,'ff').replace(/\uFB01/g,'fi')
                                  .replace(/\uFB02/g,'fl').replace(/\u201D/g,'"').replace(/\u201C/g,'"')
                                  .replace(/\u2019/g,"'").replace(/\u2018/g,"'").replace(/\u2013/g,'-').
                                  replace(/''/g,'"').replace(/`/g,"'");
                                if(removeHyphens)
                                    anno.markup = anno.markup.replace(/([a-zA-Z])- ([a-zA-Z])/g, '$1$2');								
							}
                            // clean anno
                            if(!debug) {
                                delete anno.annotationFlags;
                                delete anno.borderWidth;
                                delete anno.chars;
                                delete anno.hasAppearance;
                                delete anno.markupGeom;
                                delete anno.quadPoints;
                                delete anno.rect;
                                delete anno.rect;
                                delete anno.spaceSize;
                                delete anno.name;
								if (anno.colorClass) {
									delete anno.color;
								}
                            }
                            // return
                            return anno;
                        });
                        // separate annotations by color
						if (useColor) {
							var annosRed = [];
							var annosGreen = [];
							var annosBlue = [];
							var annosYellow = [];
							var annosOrange = [];
							var annosMagenta = [];
							var annosCyan = [];
							var annosGray = [];
							var annosBlack = [];
							var annosWhite = [];
							for (var i=0; i<annos.length; i++) {
								var colorClass = annos[i].colorClass;
								switch (colorClass) {
									case 'Red':
										annosRed.push(annos[i]);
										break;
									case 'Green':
										annosGreen.push(annos[i]);
										break;
									case 'Blue':
										annosBlue.push(annos[i]);
										break;
									case 'Yellow':
										annosYellow.push(annos[i]);
										break;
									case 'Orange':
										annosOrange.push(annos[i]);
										break;
									case 'Magenta':
										annosMagenta.push(annos[i]);
										break;
									case 'Cyan':
										annosCyan.push(annos[i]);
										break;
									case 'Gray':
										annosGray.push(annos[i]);
										break;
									case 'Black':
										annosBlack.push(annos[i]);
										break;
									case 'White':
										annosWhite.push(annos[i]);
										break;
									default:
										console.log("unknown color class: "+colorClass);
								};
							};
							// add color-separated annotations to return object
							obj.annotationsRed.push.apply(obj.annotationsRed, annosRed);
							obj.annotationsGreen.push.apply(obj.annotationsGreen, annosGreen);
							obj.annotationsBlue.push.apply(obj.annotationsBlue, annosBlue);
							obj.annotationsYellow.push.apply(obj.annotationsYellow, annosYellow);
							obj.annotationsOrange.push.apply(obj.annotationsOrange, annosOrange);
							obj.annotationsMagenta.push.apply(obj.annotationsMagenta, annosMagenta);
							obj.annotationsCyan.push.apply(obj.annotationsCyan, annosCyan);
							obj.annotationsGray.push.apply(obj.annotationsGray, annosGray);
							obj.annotationsBlack.push.apply(obj.annotationsBlack, annosBlack);
							obj.annotationsWhite.push.apply(obj.annotationsWhite, annosWhite);
							// delete empty annotationsAll key
							delete obj.annotationsAll;
						}
						else {
													
							// add annotations to return object
	                        obj.annotationsAll.push.apply(obj.annotationsAll, annos);
						};
                        // render next page
                        progress(page.pageNumber, numPages);
                        if(numPages>page.pageNumber)
                            pdf.getPage(page.pageNumber+1).then(
                              getAnnotationsFromPage,
                              function(err) {legacyPromise ? promise.reject(obj) : reject(err);} );
                        else {                     
							var end = performance.now();
                            obj.time = end-time_start;
                            legacyPromise ? promise.resolve(obj) : resolve(obj);
                        }
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
            legacyPromise ? promise.reject(obj) : reject(err);
        });
    };
    if (legacyPromise) {
        var promise = new PDFJS.Promise();
        extract();
        return promise;
    }
    else
        return new Promise(extract);
};