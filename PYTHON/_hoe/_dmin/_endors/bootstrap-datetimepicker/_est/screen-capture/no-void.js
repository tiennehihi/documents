/*   
  SmartWizard 2.0 plugin 
  jQuery Wizard control Plugin
  by Dipu
  
  http://www.techlaboratory.net
  http://tech-laboratory.blogspot.com
*/
.swMain {
  position:relative;
  display:block;
  margin:0;
  padding:0;
  border: 0px solid #CCC;
  overflow:visible;
  float:left;
  width:980px;
}
.swMain .stepContainer {
  display:block;
  position: relative;
  margin: 0;
  padding:0;    
  border: 0px solid #CCC;    
  overflow:hidden;
  clear:both;
  height:300px;
}

.swMain .stepContainer div.content {
  display:block;
  position: absolute;  
  float:left;
  margin: 0;
  padding:5px;    
  border: 1px solid #CCC; 
  font: normal 12px Verdana, Arial, Helvetica, sans-serif; 
  color:#5A5655;   
  background-color:#F8F8F8;  
  height:300px;
  text-align:left;
  overflow:visible;    
  z-index:88; 
  -webkit-border-radius: 5px;
  -moz-border-radius  : 5px;
  width:968px;
  clear:both;
}

.swMain div.actionBar {
  display:block;
  position: relative; 
  clear:both;
  margin:             3px 0 0 0;   
  border:             1px solid #CCC;
  padding:            0;    
  color:              #5A5655;   
  background-color:   #F8F8F8;
  height:40px;
  text-align:left;
  overflow:auto;    
  z-index:88; 

  -webkit-border-radius: 5px;
  -moz-border-radius  : 5px;
  left:0;
}

.swMain .stepContainer .StepTitle {
  display:block;
  position: relative;
  margin:0;   
  border:1px solid #E0E0E0;
  padding:5px;   
  font: bold 16px Verdana, Arial, Helvetica, sans-serif; 
  color:#5A5655;   
  background-color:#E0E0E0;
  clear:both;
  text-align:left; 
  z-index:88;
  -webkit-border-radius: 5px;
  -moz-border-radius  : 5px;    
}
.swMain ul.anchor {
  position: rela