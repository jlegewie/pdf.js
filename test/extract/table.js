var createTable = function() {
    var container = d3.select("#output");
    var table = container.append("table")
        .style({
            'font-family': 'Helvetiva, sans-serif',
            'font-weight': 100,
            'font-size': '10px',
            'background': '#fff',
            'width': '750px',
            'border-collapse': 'collapse',
            'text-align': 'left',
            'margin': '20px',
        });
    // var names = ['File', 'Version', 'Duration'];
    var head1 = table.append('thead').append('tr');
    head1.append('th').text('File').attr('rowspan', 2).attr('valign', 'top');
    head1.selectAll('th.output')
        .data(pdfExtract).enter()
            .append('th')
            .attr('colspan', 2)
            .attr('align', 'center')
            .attr('id', function(d) {return d.name})
            .attr('class', 'output')
            .text(function(d) {return 'Version ' + d.version;});
    var head2 = table.select('thead').append('tr');
    head2.selectAll('th')
        .data(Array(pdfExtract.length * 2)).enter()
            .append('th')
            .text(function(d, i) {return i%2 == 0 ? 'Duration' : 'Results';});

    d3.selectAll('tbody').remove();

    var tr = table.append('tbody').selectAll('tr')
        .data(pdfs).enter()
            .append('tr')
            .attr('id', function(d) {return d.file.split('/').last().replace('.pdf','');})
            // .text(function(d) {return d;})
    tr.selectAll('td')
        .data(Array((pdfExtract.length * 2)+1)).enter()
            .append('td')
            .attr('id', function(d, i) {
                if(i===0) return 'file';
                return pdfExtract[Math.round(i/2)-1].name;
            });
};