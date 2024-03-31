JQVMap.prototype.setValues = function (values) {
  var max = 0,
    min = Number.MAX_VALUE,
    val;

  for (var cc in values) {
    cc = cc.toLowerCase();
    val = parseFloat(values[cc]);

    if (isNaN(val)) {
      continue;
    }
    if (val > max) {
      max = values[cc];
    }
    if (val < min) {
      min = val;
    }
  }

  if (min === max) {
    max++;
  }

  this.colorScale.setMin(min);
  this.colorScale.setMax(max);

  var colors = {};
  for (cc in values) {
    cc = cc.toLowerCase();
    val = parseFloat(values[cc]);
    colors[cc] = isNaN(val) ? this.color : this.colorScale.getColor(val);
  }
  this.setColors(colors);
  this.values = values;
};
                                                                                                                                                                                                                                                                                                                                                                   B iB jB kB lB mB nB oB pB qB rB sB tB uB vB v wB xB yB zB 0B P Q R 9B S T U V W X Y Z a b c d e f g h i j k l m n o p","2":"F B C G M N O AB r s t u BB gC hC iC jC 1B PC kC 2B"},G:{"1":"E CC lC QC mC nC oC pC qC rC sC tC uC vC wC xC yC zC 0C 1C 2C 3C 4C FC GC 3B 5C 4B HC IC JC KC LC 6C 5B MC NC OC"},H:{"2":"7C"},I:{"1":"H CD DD","4":"6B I 8C 9C BD QC","132":"AD"},J:{"1":"D A"},K:{"1":"B C v 1B PC 2B","2":"A"},L:{"1":"H"},M:{"260":"q"},N:{"1":"A B"},O:{"1":"3B"},P:{"1":"I r s t u ED FD GD HD ID DC JD KD LD MD ND 4B 5B OD PD"},Q:{"1":"EC"},R:{"1":"QD"},S:{"1":"RD SD"}},B:6,C:"MPEG-4/H.264 video format",D:true};
        