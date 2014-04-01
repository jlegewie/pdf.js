

// testing framework for extracting annotations
// cd to pdf.js folder
// python -m SimpleHTTPServer 8000
// http://localhost:8000/test/extract/index.html
// http://localhost:8000/test/extract/index.html?version=0
// http://localhost:8000/test/extract/index.html?branch=e7afce5549f3d1dcf052c4b23d1590bbfc2c338f

// for debugging
// http://localhost:8000/test/extract/index.html?version=0&file=/test/extract/pdf/Okihiro-2010.pdf&debug=1

'use strict';

// define versions
var pdfs = [
    {
        'file': '/test/extract/pdf/test-1.pdf',
        'annotations': [
            {
                'content': '',
                // 'markup': 'Dreams are not invented by human beings, they just "happen." The dream is the purest product of the unconscious­---of the true and authentic psyche. Dreams point directly to the unconscious. They disclose the unconscious to us with the greatest faithfulness possible. Being a spontaneous, unprejudiced expres­ sion of the unconscious psyche, which Jung considered to be "the mother of all the sciences," a dream may be our most "objective" criterion by which to judge the true nature of death.'
                'markup': 'Dreams are not invented by human beings, they just "happen." The dream is the purest product of the unconscious­-of the true and authentic psyche. Dreams point directly to the unconscious. They disclose the unconscious to us with the greatest faithfulness possible. Being a spontaneous, unprejudiced expres­sion of the unconscious psyche, which Jung considered to be "the mother of all the sciences," a dream may be our most "objective" criterion by which to judge the true nature of death.'
            }
        ]
    },
    {
        'file': '/test/extract/pdf/Zou-2013.pdf',
        'annotations': [
            {
                'content': '',
                'markup': 'oracle properties; namely, it performs as well as if the true underlying model were given in advance.'
            },
            {
                'content': '',
                'markup': 'the lasso shrinkage produces biased estimates for the large coefficients, and thus it could be suboptimal in terms of estimation risk.'
            },
            {
                'content': '',
                'markup': 'Whether the lasso is an oracle procedure is an important question demanding a definite answer, because the lasso has been used widely in practice. In this article we attempt to provide an answer.'},
            {
                'content': '',
                'markup': 'we can use ˆβ (ols'
            },
            {
                'content': 'all this boils down to is using Weights on the penalized-coefficients B such that the weights are the inverse of the coefficients estimated during an initial OLS regression',
                'markup': ''
            }
        ]
    },
    {
        'file': '/test/extract/pdf/Abrell-2010.pdf',
        'annotations': [
            {
                'content': '',
                'markup': "Package 'RCol"
            },
            {
                'content': '',
                'markup': 'BrBG PiYG PRGn PuOr RdBu RdGy RdYlBu RdYlGn Spectral'
            },
            {
                'content': '',
                'markup': "For qualitative palettes, the lowest number of distinct values available always is 3, but the largest number is different for different palettes. It is given together with the palette names in the following table."
            },
            {
                'content': '',
                'markup': 'display.brewer.all(n=5,type="div",exact.n=TRUE)'
            }
        ]
    },
    {
        'file': '/test/extract/pdf/Gal-2009.pdf',
        'annotations': [
            {
                'markup': 'mpilation technique for dynamically-typed languages that identifies frequently executed loop traces at run-time and then generates machine code on the fly that is specialized for the actual dynamic types occurring on each path through the loop. Our method provides cheap inter-procedural type specialization, and an elegant and efficient way',
                'content':''
            },  
            {
                'markup': 'sed on the expectation that programs spend most of their time in hot loops. Even in dynamically typed languages, we expect hot loops to be mostly type-stable , meaning that the types of values are in variant. (12) For example, we would expect loop counters that start as i',
                'content':''
            },
            {
                'markup': 'different, or a value of a different type is generated), the trace exits. If an exit becomes hot, the VM can record a branch trace starting at the exit to cover the new path. In this way, the VM records a trace tree covering all the hot paths through the loop. Nested loops can',
                'content':''
            },
            {
                'markup': 'header, but the outer loop header. At this point, the VM could continue tracing until it reaches the inner loop header again, thus tracing the outer',
                'content':''
            },
            {
                'markup': 'ed to any depth without causing excessive tail duplication. These techniques allow a VM to dynamically translate a program to nested, type-specializ',
                'content':''
            },
            {
                'markup': 'Sometimes these stores can be optimized a way as the stack locations are live only on exits to the interpreter. Finally, the LIR records',
                'content':''
            },
            {
                'markup': 'the top, but may have many exits. In contrast to an extended basic block, a trace can contain join nodes. Since a trace always only follows one single path through the original program, however, join nodes are not recognizable as such in a trace and have a single predecessor node like  regular nodes. A typed trace is a trace annotated with a type for every variable (including temporaries) on the trace. A typed trace also has an entry type map giving the required types for variables used on the trace before they are defined.',
                'content':''
            },
            {
                'markup': 'In certain cases the trace might reach the loop header with a different type map. This scenario is sometime observed for the first iteration of a loop. Some variables inside the loop might initially be undefined, before they are set to a concrete type during the first loop iteration. When recording such an iteration, the recorder cannot link the trace back to its own loop header since it is type-unstable. Instead, the iteration is terminated with a side exit that will always fail and return to the interpreter. At the same time a new trace is recorded with the new type map. Every time an additional typeunstable trace is added to a region, its exit type map is compared to the entry map of all existing traces in case they complement each other. With this approach we are able to cover type-unstable loop iterations as long they eventually form a stable equilibrium.',
                'content':''
            },
            {
                'markup': 'Extending a tree. Side exits lead to different paths through the loop, or paths with different types or representations. Thus, to completely cover the loop, the VM must record traces starting at all side exits. These traces are recorded much like root traces: there is a counter for each side exit, and when the counter reaches a hotness threshold, recording starts. Recording stops exactly as for the root trace, using the loop header of the root trace as the tar get to reach.',
                'content':''
            },
            {
                'markup': 'to the currently running interpreter bytecode trace. A good implementation should have low impact on non-tracing interpreter performance and a convenient way for implementers to maintain semantic equivalence. In our implementation, the only direct modification to the interpreter is a call to the trace monitor at loop edges. In our benchmark results (see Figure 12) the total time spent in the monitor (for all activities) is usually less than',
                'content':''
            },
            {
                'markup': 'SpiderMonky, like many VMs, needs to preempt the user program periodically. The main reasons are to prevent infinitely looping scripts from locking up the host system and to schedule GC. In the interpreter, this had been implemented by setting a "preempt now" flag that was checked on every backward jump. This strategy carried over into TraceMonkey: the VM inserts a guard on the preemption flag at every loop edge. We measured less than a 1% increase in runtime on most benchmarks for this extra guard. In practice, the cost is detectable only for programs with very short loops. We tested and rejected a solution that a voided the guards by compiling the loop edge as an unconditional jump, and patching the jump tar get to an exit routine when preemption is required. This solution can make th',
                'content':''
            },
            {
                'markup': 'for crypto-md5, where fully 3% of bytecodes are executed while recording. In most of the tests, almost all the bytecodes are executed by compiled traces. Three of the benchmarks are not traced at all and run in the interpreter.',
                'content':''
            },
            {
                'markup': "Speedup vs. a baseline JavaScript interpreter (SpiderMonkey) for our trace-based JIT compiler, Apple's SquirrelFish Extreme inline threading interpreter and Google's V8 JS compiler. Our system generates particularly efficient code for programs that benefit most from type specialization, which includes SunSpider Benchmark programs that perform bit manipulation. We type-specialize the code in question to use integer arithmetic, which substantially improves performance. For one of the benchmark programs we execute 25 times faster than the SpiderMonkey interpreter , and almost 5 times faster than V8 and SFX. For a large number of benchmarks all three VMs produce similar results. We perform worst on benchmark programs that we do not trace and instead fall back onto the interpreter. This includes the recursive benchmarks access-binary-trees and control-flow-recursive, for which we currently don't generate any native code.",
                'content':''
            },
            {
                'markup': '[13] J. Ha, M. R. Haghighat, S. Cong, and K. S. McKinley. A concurrent trace-based just-in-time compiler for javascript. Dept.of Computer Sciences, The University of Texas at Austin, TR-09-06, 2009.',
                'content':''
            }
        ]
    },
    {
        'file': '/test/extract/pdf/Borjas-2003.pdf',
        'annotations': [
            {
                'markup': 'This paper introduces a new approach for estimating the labor market impact of immigration. The analysis builds on the assumption that similarly educated workers who have different levels of experience are not perfect substitutes. Defining skill groups in terms of educational attainment and work experience',
                'content': ''
            },
            {
                'markup': 'introduces a great deal of variation in the data. In some years, the influx of immigrants with a particular level of schooling mainly affects younger workers; in other years it mainly affects older workers. In contrast to the existing literature, the evidence reported in this paper consistently indicates that immigration reduces the wage and labor supply of competing native workers, as suggested by the simplest textbook model of a competitive labor market. Moreover, the evidence indicates that spatial correlations conceal around two-thirds of the national impact of immigration on wages.',
                'content': ''
            }
        ]
    },
    {
        'file': '/test/extract/pdf/Okihiro-2010.pdf',
        'annotations': [
            {
                'markup': 'Latitudes of climates and constitutions, like the allied myth of continents and races, have a deep and persistent past within European and US imperial discourses both as language and ideology.',
                'content': ''
            }
        ]
    },
    {
        'file': '/test/extract/pdf/Ridgeway-2007.pdf',
        'annotations': [
            {
                'markup': "These figures raise critical questions: first, whether they point to racial bias in police officers' decisions to stop particular pedestrians, and, further, whether they indicate that officers are particularly intrusive when stopping nonwhites.",
                'content': ''
            },
            {
                'markup': "Second, we compared each individual officer's stopping patterns with a benchmark constructed from stops in similar circumstances made by other officers. This process, known as",
                'content': ''
            }
        ]
    },
    {
        'file': '/test/extract/pdf/Connell-2005.pdf',
        'annotations': [
            {
                'markup': "niversity of Sydney, Australia",
                'content': ''
            },
            {
                'markup': "masculinity studies and critical studies of men), popular anxieties about men and boys, feminist accounts of patriarchy, and sociological models of gender. It has found uses in applied fields ranging from education and antiviolence work to health and counseling.",
                'content': ''
            }
        ]
    },
    {
        'file': '/test/extract/pdf/Thrupp-2002.pdf',
        'annotations': [
            {
                'markup': 'First brought to prominence by Coleman et al. (1966), school compositional effects were at that time conceived as an hypothesis about the impact of peers on motivation, aspirations, and attitudes towards education. Almost two decades later, Barr and Dreeben (1983) published their influential study of elementary schools, which showed that the characteristics of a student group significantly influenced the teacher\'s work. In a more recent review of research of high school organisation and its effects on students and teachers, Bryk, Lee, and Smith (1990) reported that, "the overall distribution of student characteristics shapes the curricular offerings of a school and the policies which map students into courses" (p. 147). What these extensions of the original school compositional effects hypothesis suggest is that the effects can have a far wider effect on school organisation and performance than originally conceived by Coleman et al. (1966) and by much of the quantitative literature on this subject since that date. Indeed a qualitative study undertaken by the first author and discussed later suggests that compositional effects involve not only "peer group processes" (in the form of student reference',
                'content': ''
            },
            {
                'markup': 'group processes), but also "instructional" and "school organisational and management processes" (Thrupp, 1999).',
                'content': ''
            }
        ]
    },
    {
        'file': '/test/extract/pdf/Durna-2011.pdf',
        'annotations': [
            {
                markup: "Results provide strong and consistent evidence that probability of using force and the amount of force used by the police mostly depend on what the suspect does as opposed to who the suspect is, even after controlling for other factors.",
                content: ''
            },
            {
                markup: "Previous research on police use of force indicates that police use force infrequently (Adams, 1999; Friedrich, 1980; Garner, Buchanan, Schade, & Hepburn, 1996; Garner & Maxwell, 1999; Worden, 1996). Whether measured by official use of force records (Alpert & Dunham, 1999), citizen complaints (Pate, Fridell, & Hamilton, 1993), surveys of officers, arrestees, or citizens (Garner, Schade, Hepburn, & Buchanan, 1995; Garner et al., 1996; Greenfield, Langan, & Smith, 1999), or observational methods (Friedrick, 1980; Worden, 1996) the data consistently indicate that only a small percentage of police-public interactions involve use of force.",
                content: ''
            },
            {
                markup: "Among various theoretical orientations to explain police use of force, Terrill and Mastrofski (2002) point out particular sociological and psychological perspectives that have guided previous research. The sociological perspective focuses on the personal and behavioral characteristics of the suspect and the impacts of those characteristics on the nature of police citizen encounters; whereas, the psychological perspective stresses the police officers' characteristics, experiences, and views.",
                content: ''
            },
            {
                markup: "In a broader sense, the sociological perspective or the situational approach focuses on the specific characteristics of the suspects and the situations in which the police encounter citizens. Terrill and Mastrofski (2002, p. 217) identify two distinct explanations within this domain: one being that force varies by who the citizen is the other focusing on what the citizen does . We expect that the behavior of the police officers should not be affected by the characteristics of the citizens such as race, gender, age, or social class.",
                content: ''
            },
            {
                markup: "Applying force disproportionally based on who the suspect is rather than what the suspect does will substantially undermine the police legitimacy in the society.",
                content: ''
            },
            {
                markup: "As Geller and Toch (1996) indicate, a considerable amount of previous literature on police use of force has focused on whether the police used force in encounters with citizens and the attitudes and demographic characteristics of both officers and suspects. However, there is still a lack of information on whether 'who the suspect is' or 'what the suspect does' is a more decisive factor in police behavior toward the suspects.",
                content: ''
            },
            {
                markup: "We should realize that use of force is not a static concept but a continuum of responses ranging from verbal commands to deadly force. Therefore, not only whether the police use force or not, but the amount of force used also merits investigation. In order to address these issues, first, the present study uses a force definition that combines actual physical force with threatened force to examine the presence of force. Second, another measure -maximum force- is used to examine the extent of force used under different circumstances.",
                content: ''
            },
            {
                markup: "Garner et al. (1996, p. 6) found in their Phoenix , Arizona stud y that in 918 (57.9 percent) of a total of 1,585 cases involving some form of force, the high est level of force used b y the polic e was so me form of restr aint; in another 350 (22.1 percent), no restraint was needed. Terrill's (2003) observational study of the police in Indianap olis, Indiana, and St. Petersbur g, Flo rida yi elded similar results. Afte r ex amining 3,544 police -suspect encounters, h e concluded that if verbal force is included , then most force falls into this categor y of behavior.",
                content: "Confirms my data about the prevalence of a milder form of force"
            },
            {
                markup: "Defining force as acts that threaten or inflict physical harm on suspects, Terrill and Mastrofski (2002) and Terrill (2003) make a strong case to include verbal coercion such as commands and threats into definition of force.",
                content: ''
            },
            {
                markup: "since most of the police force occurs at low er levels, or starts at lower levels and escalades, more emphasis should be given to different levels of force rather than solely focusing on extreme levels of force.",
                content: ''
            },
            {
                markup: 'As mentioned earlier, sociological and psychological theoretical orientations have mostly been used to explain police use of force. The sociological approach centers on the suspects\' personal and behavioral characteristics and situational characteristics of the police citizen encounters. The psychological approach, on the other hand, seeks to explain police use of force based on the individual characteristics of the officers. Friedrich (1980) calls these perspectives situational and individual approaches, respectively. Yet, there is a third approach to police use of force which sees use of force as a product of the organizational setting (Friedrich, 1980). This line of research has mostly focused on the organizational culture and the environment in which the police perform their duties. An occupational subculture or "police culture" which stems from a set of shared values and attitudes to cope with the strain and ambiguity of police work is used',
                content: ''
            },
            {
                markup: "to explain use of force (Brown, 1988; Herbert, 1 996, 1998; Lester, 1996; Paoline, Myers, & Worden, 2000; Skolnick & Fyfe, 1993; Smith, 1994; Terrill, Paoline, & Manning, 2003 ).",
                content: ''
            },
            {
                markup: "Previous research has frequently addressed characteristics of the suspects in police use of force incidents. Suspect's demo graphic characteristics (who the suspect is) and suspect's behavior and demeanor (what the suspect does) are often found to be correlated with the prevalence and the extent of police force. Several studies report suspect's age, sex, ethnicity, and intoxication as statistically significant predictors of police force (Alpert & Dunham, 1999; Alpert & Fridell, 1992; Friedrich, 1980; Garner et al., 1995; Garner et al. 2002; Terrill & Mastrofski, 2002; Worden, 1996).",
                content: ''
            },
            {
                markup: "Issue of race in police-citizen encounters is believed to be a common denominator in numerous use of force incidents, especially ones including deadly force. For example, Alpert and Fridell (1992) noted that blacks are disproportionately the opponents in police shootings relative to their representation in the whole population. Smith (1986), Terrill and Mastrofski (2002), and Worden (1996) also reported that suspect's race is associated with increased use of force by the police: racial minorities, especially blacks, faced more police force than whites.",
                content: ''
            },
            {
                markup: "Some other studies, on the other hand, reported that race of the suspect was not associated with inc reased use of force (Friedrich, 1980; Fyfe, 1988; Garner et al., 1995; Garner et al., 2002). Among these studies, Friedrich (1980) noted that not",
                content: ''
            },
            {
                markup: "only race but sex and gender of the citizen also did not affect police use of force. In his research on police shootings in New York City, Fyfe (1988) reported that the subject's race made little difference in the percentages of subjects wounded or killed among racial groups. Similarly, Garner et al. (2002) reported that they found little evidence to support racial concerns that police use more force against African Americans. Although their analysis showed that more physical force was used against African American suspects than white suspects, that effect was no longer statistically significant when controlled for the suspect's resistance.",
                content: ''
            },
            {
                markup: "Analyzing the data gathered in the observational study undertaken in 1966 by Reiss for the President's Commission on Law Enforcement, Friedrich (1980) reported that the context and characteristics of police-citizen encounters -among personal characteristics and organizational factors accounted the strongest relationship for use of force. According to his findings, police were more likely to use force when the suspect is antagonistic, agitated, or intoxicated; when the offense is a felony, or other citizens are present at the scene. Worden's (1996) findings confirms earlier findings of Friedrich that drunkenness, a hostile behavior, and especially physical resistance all make the use of force more likely.",
                content: ''
            },
            {
                markup: "Some other studies also support the hypothesis that the police are more likely to use force against suspects who are antagonistic or intoxicated, (Garner et al., 1995; Garner et al., 2002; Smith, 1986; Terrill & Mastrofski, 2002).",
                content: ''
            },
            {
                markup: '',
                content: "My approach... With this approach, this study makes important contributions to the literature aside from the substantive contribution. contributes to the literature on profiling and the use if force by developing... Lacking I this literature. But also important for the broader li on discrimination, which benefits from approaches that supplement the... Audit studies..."
            },
            {
                markup: "The psychological or individual approach centers on the impacts of officers' characteristics on use of force behavior. Those characteristics range from demographic factors and experiences to attitudes toward people. Like situational",
                content: ''
            },
            {
                markup: "factors, many studies have focused on individual characteristics of police officers; however, unlike the former one, research on the effects of officer-based factors has yielded to less consistent results. Evaluating prior research results, Adams (1999) notes that although use of force appears to be unrelated to an officer's personal characteristics such as age, gender, and ethnicity, more studies are needed in this area.",
                content: ''
            },
            {
                markup: 'In summary, previous studies show that situational factors are more consistent determinants of police use of force than characteristics of the officers. Among the situational factors, suspect\'s behavior and demeanor toward the police (what the suspect does) gain more explanatory power than demographic characteristics of the suspect (who the suspect is). As Friedrich (1980, p. 95) notes, "police use of force depends primarily on two types of factors: how the offender behaves and',
                content: ''
            },
            {
                markup: 'whether or not other citizens and police are present." However, there is still support that suspect\'s characteristics such as gender, age, and -to a lesser extent- race are associated with police force.',
                content: ''
            },
            {
                markup: "Effects of the officer's characteristics on the use of force are generally mixed in previous research. Race and gender of the officer are often not related to use of force behavior while age has been identified a significant predictor.",
                content: ''
            },
            {
                markup: "Garner and Maxwell (2002) developed four measures of the amount of force used by police officers in order to organize, present, and understand the nature and characteristics of the force used in representative samples of arrests: Physical Force, Physical Force Plus Threats, Continuum of Force, and Maximum Force. The first measure is a traditional conceptual dichotomy of arrests in which physical force is or is not used. The second measure, physical force plus threats, is similar to physical force but adds the use of threats and displays of weapons. The continuum of force measure captures the levels of force commonly used in official policies by the participating law enforcement agencies. The fourth measure, maximum force, is constructed at interval level by the researchers to rank the amount of force used by the police in making arrests. This study will use two of the above measures as dependent variables: physical force plus threats, and maximum force. The first measure will allow us to understand the role of different factors affecting the decision of the police to use or not to use force to make an arrest. The second measure, on the other hand, will help us evaluate the effects of the same factors on the amount of force used in arrest situations.",
                content: ''
            },
            {
                markup: "The second dependent variable is the maximum force me asure constructed by Garner and Maxwell (2001) to rank the amount of force used by the police. This variable is measured at interval level, which ranges from 1 to 100 with a ranking score of 1 being the least forceful and 100 being the most forceful. The researchers constructed this measure in a two-step process. In five of six participating agencies, 503 experienced officers were asked to rank more than 60 hypothetical types of force on a scale from 1 to 100 based, not on departmental",
                content: ''
            },
            {
                markup: "policy, but on their own personal experience. The exercise resulted in a measure that makes reasonable distinctions between different types of force. Officer presence, conversation and verbal commands are ranked near the bottom and the use of weapons especially firearms, are ranked at the top. The second step in developing the maximum force measure is to determine if such behaviors occurred in the sample of 7,152 arrests, and if so, to weigh them according to the rankings made by police officers. When officers reported that they engaged in two or more forceful acts, the one with the highest rank is recorded -hence the name is Maximum Force. This measure provid es a scale which helps us identify how the amount of force can be measured in away that approximates our understanding of variation in the use of force.",
                content: ''
            },
            {
                markup: "By using these two measures, this study attempts to overcome the limitations of depending solely on dichotomous variables which measure if physical force was used or not. Although those dichotomous measures are applied consistently across law enforcement agencies and capture the elements of force, they do not allow researchers to measure the amount of force used since they group together all uses of force from a push to use of deadly weapons .",
                content: ''
            },
            {
                markup: "Suspect's race has been a central concern in the research on police use of force. Although previous studies did not provide consistent evidence, the general",
                content: ''
            },
            {
                markup: "concern is that the police tend to use more force against African American or Hispanic suspects than white suspects. As noted earlier, findings from the original study of Garner et al. (2002) provided little evidence on the role of race. The present study finds a similar result. Although African American suspects seem more likely to be the subject of police force than whites, the p-value is .071 which is close to the statistical significance level but does not meet the traditional criterion of p < .05. Likewise, amount of force used against African American suspects increases compared to the level of force used against white suspects, but the p-value (.059) does not meet the traditional significance criterion, even though it is closer. On the other hand, neither the prevalence nor the level of force for African American suspects significantly differs than Hispanic suspects or suspects of other races.",
                content: ''
            },
            {
                markup: "The present analysis provides consistent evidence that the suspect's demeanor and threat or use of force have a substantial impact on both the prevalence and amount of police force. In other words, both prevalence and amount of police force are mostly driven by what the suspect does rather than who the suspect is. However, other factors also come into play, including gender of the suspect and officer, and various characteristics of the arrest situation.",
                content: ''
            },
            {
                markup: "As noted earlier, use of force is a necessary tool for the police to perform their duties. However, when applied improperly, it can have serious repercussions for",
                content: ''
            },
            {
                markup: "police officers, departments, and the public. When the police disproportionately target citizens of a particular gender or race, it undermines legitimacy of the police within the society.",
                content: ''
            },
            {
                markup: "One promising result of the current analysis is that the race of the suspect is not a decisive factor in police force to complete an arrest. However, the fact that the police used more force on suspects on the basis of the suspect's gender suggests the need for an emphasis on the distinction between citizens' behavior and citizens' traits, departmental values, and accountability to the society and law in police training.",
                content: ''
            },
            {
                markup: "Garner, J .H., Max well, C.D., & Heraux , C.G. (2002). Characteristics associated with the prevalence and severity of force used by the police. Justice Quarterly, 19(4), 705-74 6.",
                content: ''
            },
            {
                markup: "Geller, W.A., and Toch H. (1996). Understanding and controlling police abuse of force. In W.A. Geller & Toch, H. (Eds.), Police Violence: Understanding and Controlling Police Abuse of Force (pp. 292-328). New Haven, CT: Yale Universit y Press.",
                content: ''
            },
            {
                markup: "Terrill, W ., & Mastrofski , S.D. (2002). Situational and officer-based determinants of police coercion. Justice Quarterly, 19(2), 2002.",
                content: ''
            },
            {
                markup: "Terril, W. 2003. Police use of force and suspect resistance: the micro process of the police-suspect encounter. Police Quarterly, 6 (1), 51-83.",
                content: ''
            }
        ]
    }
];

var url = 'https://raw2.github.com/jlegewie/pdf.js/{0}/{1}',
    script = 'https://raw2.github.com/jlegewie/pdf.js/809ed55841b0643892f7d6aac6999cca34f31db7/src/getPDFAnnotations.js',
    tooltips = {},
    getPDFAnnotations,
    pdfExtract = [{
            // introducted in zotfile version 3.3
            'version': '3.1dev',
            'name': 'v3_1dev',
            'branch': 'local',
            'scripts': ['/src/shared/util.js', '/src/shared/colorspace.js', '/src/display/pattern_helper.js', '/src/shared/function.js', '/src/shared/annotation.js', '/src/display/api.js', '/src/display/metadata.js', '/src/display/canvas.js', '/src/display/font_loader.js', script],
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
    compare = arg.version ? false : true,
    pdfs = arg.file ? [{'file': arg.file}] : pdfs;
arg.debug = arg.debug ? Number(arg.debug) : 0;

$(document).ready(function() {
    // create table
    createTable();
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
                                console.log(j+1);
                                loadExtractionScript(j+1);
                            }
                            else {
                                console.log('Postprocessing...')
                                Object.keys(tooltips).forEach(function(key) {
                                    var head = '<div id="wrapper"> <table class="table table-striped table-bordered table-hover"> <thead> <tr> <th>Extracted</th> <th>Original</th> <th>Diff</th> </tr> </thead> <tbody>',
                                        row = '<tr> <td class="original">{0}</td> <td class="changed">{1}</td> <td class="diff"></td> </tr>',
                                        footer = '</tbody> </table> </div>';
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

/*
annoStr = annos.annotations.map(function(a) {
    return '<p>' + a.markup + '</p>';
}).join('');
*/