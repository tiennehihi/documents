# jQuery Smart Wizard

Version 3 and later at
http://mstratman.github.com/jQuery-Smart-Wizard/

Original version 2 and earlier are from
http://www.techlaboratory.net/products.php?product=smartwizard

Licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.
http://creativecommons.org/licenses/by-sa/3.0/

## Getting Started

Basic Usage:

```javascript
$('#wizard').smartWizard();
```

Using with option parameters:

```javascript
$('#wizard').smartWizard({
  // Properties
    selected: 0,  // Selected Step, 0 = first step   
    keyNavigation: true, // Enable/Disable key navigation(left and right keys are used if enabled)
    enableAllSteps: false,  // Enable/Disable all steps on first load
    transitionEffect: 'fade', // Effect on navigation, none/fade/slide/slideleft
    contentURL:null, // specifying content url enables ajax content loading
    contentURLData:null, // override ajax query parameters
    contentCache:true, // cache step contents, if false content is fetched always from ajax url
    cycleSteps: false, // cycle step navigation
    enableFinishButton: false, // makes finish button enabled always
	hideButtonsOnDisabled: false, // when the previous/next/finish buttons are disabled, hide them instead
    errorSteps:[],    // array of step numbers to highlighting as error steps
    labelNext:'Next', // label for Next button
    labelPrevious:'Previous', // label for Previous button
    labelFinish:'Finish',  // label for Finish button        
    noForwardJumping:false,
  // Events
    onLeaveStep: null, // triggers when leaving a step
    onShowStep: null,  // triggers when showing a step
    onFinish: null  // triggers when Finish button is clicked
}); 
```

Parameters and Events are describing on the table below.

## Installing Smart Wizard 3

### Step 1: Include Files

Include the following JavaScript and css files on your page. 

1. jQuery Library file (Don't include if you already have it on your page) 
2. CSS(Style Sheet) file for Smart Wizard 
3. JavaScript plug-in file for Smart Wizard

To include the files copy and paste the below lines inside the head tag (`<head> </head>`) of your page. 
Make sure the paths to the files are correct with your working environment.

```html
<script type="text/javascript" src="jquery-1.4.2.min.js"></script>
<link href="smart_wizard.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="jquery.smartWizard.js"></script>
```

### Step 2: The JavaScript

Inititialize the Smart Wizard, copy and paste the below lines inside the head tag (`<head> </head>`) of your page

```html
<script type="text/javascript">
  $(document).ready(function() {
      // Initialize Smart Wizard
        $('#wizard').smartWizard();
  }); 
</script>
```

### Step 3: The HTML

Finally the html, below shows the HTML markup for the Smart Wizard, You can customize it by including your on contents for each steps. 
Copy and paste the below html inside the body tag (`<body></body>`) of your page.

```html
<div id="wizard" class="swMain">
  <ul>
    <li><a href="#step-1">
          <label class="stepNumber">1</label>
          <span class="stepDesc">
             Step 1<br />
             <small>Step 1 description</small>
          </span>
      </a></li>
    <li><a href="#step-2">
          <label class="stepNumber">2</label>
          <span class="stepDesc">
             Step 2<br />
             <small>Step 2 description</small>
          </span>
      </a></li>
    <li><a href="#step-3">
          <label class="stepNumber">3</label>
          <span class="stepDesc">
             Step 3<br />
             <small>Step 3 description</small>
          </span>                   
       </a></li>
    <li><a href="#step-4">
          <label class="stepNumber">4</label>
          <span class="stepDesc">
             Step 4<br />
             <small>Step 4 description</small>
          </span>                   
      </a></li>
  </ul>
  <div id="step-1">   
      <h2 class="StepTitle">Step 1 Content</h2>
       <!-- step content -->
  </div>
  <div id="step-2">
      <h2 class="StepTitle">Step 2 Content</h2> 
       <!-- step content -->
  </div>                      
  <div id="step-3">
      <h2 class="StepTitle">Step 3 Title</h2>   
       <!-- step content -->
  </div>
  <div id="step-4">
      <h2 class="StepTitle">Step 4 Title</h2>   
       <!-- step content -->                         
  </div>
</div>
```

## More details & descriptions:

### Load ajax content

To load the content via ajax call you need to specify the property "*contentURL*". 

example:

```html
<script type="text/javascript">
  $(document).ready(function() {
      // Initialize Smart Wizard with ajax content load
        $('#wizard').smartWizard({contentURL:'services/ajaxcontents.php'});
  }); 
</script>
```

When a step got focus the SmartWizard will post the step number to this contentURL and so you can write server side logic to format the content with the step number to be shown next. The response to this call should be the content of that step in HTML format. 

To get the step number in php:

```php
$step_number = $_REQUEST["step_number"];
```

By default the SmartWizard will fetch the step content only on the first focus of the step, and cache the content and use it on the further focus of that step. But you can turn off the content cache by specifying the property "*contentCache*" to false. 

example:

```html
<script type="text/javascript">
  $(document).ready(function() {
      // Initialize Smart Wizard with ajax content load and cache disabled
        $('#wizard').smartWizard({contentURL:'services/ajaxcontents.php',contentCache:false});
  }); 
</script>
```

Please see the ajax contents demo and following files on the source code to know how ajax content loading is implemented.

1. *smartwizard2-ajax.htm*
2. *services/service.php*

### Input validation

Smart Wizard 3 does not have in-built form validation, but you can call you own validation function for each steps o