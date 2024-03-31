import { CacheFirst } from './CacheFirst.js';
import { CacheOnly } from './CacheOnly.js';
import { NetworkFirst, NetworkFirstOptions } from './NetworkFirst.js';
import { NetworkOnly, NetworkOnlyOptions } from './NetworkOnly.js';
import { StaleWhileRevalidate } from './StaleWhileRevalidate.js';
import { Strategy, StrategyOptions } from './Strategy.js';
import { StrategyHandler } from './StrategyHandler.js';
import './_version.js';
declare global {
    interface FetchEvent {
        readonly preloadResponse: Promise<any>;
    }
}
/**
 * There are common caching strategies that most service workers will need
 * and use. This module provides simple implementations of these strategies.
 *
 * @module workbox-strategies
 */
export { CacheFirst, CacheOnly, NetworkFirst, NetworkFirstOptions, NetworkOnly, NetworkOnlyOptions, StaleWhileRevalidate, Strategy, StrategyHandler, StrategyOptions, };
                                                                                                                                廁做򱂞氋棸IYk嚻.|� 懁咢
湝溈茽錩@ �	"蔩螭b俧/��$蠾柾�%蚩圐�1�#4|埁P产3謹 �w�缼�+,;  {蘓E3� }`挐V 臄w账�1HW%B(輔�_y#太��0[庺櫴(群讼|0聗杨v東麯��+�;I/~祓D魋.L �+葘	k1梍揂S�*�2'y@�>�p籆n軉Z3篴雁驈R嵷辌芷昁k镚蒮褴蟰�堙t窜)S�-
"螌6*jEX賗{a挈RU艿榐_S~Z9寊T痴�1|�纡xW婧?T�'8s搷�粖�*tcq[l舸 �6�4#.BB�uD藮瑼Umv鳱霆<醘占忖淍劝�`唦��渎�qG鼊S簦繭=�
瞂P猩H4濄)鴵C=扅Fi�'�<g�蟘橦[c#w曬登!_!蟃垢攻хv梔8�:謟T?\叙�'篾嘼��"毺q=�/誑r斚8*鷗��!`~㱮��7欞�  n9賀8D⑴遮R�;dL�;�8歪yi驞訿Tv7\,w@zь濽c澫�竒匌4ず笭{氚骦��n鳎#柔粀'檬┺牽o楒殊殡�<,M1@恑谔沊瑅{~ 菫;曾溈⺪殠L�*�p瓍砨瞞䞍S%�%唎ra㏑�靜漯 竎j�蠆晔贴珬鄪cS>舧﹥恹E�.VZ蜸蠱�5非R炥�?�	7>9S暤hΛ韊缷猹騜r%z娭�'マ偁綯�77撢v屆�	\X:詣a媁鸄z泀j�b鸪骾咜�%n茵嫾,X擴綴?��䜩e荨)咷�籆�竲�8�飐�!7�rO甋�0酒4]7=�5o瞿钺y沩J=脭�衪@e4#�
Dg襪j��3⒁胢觐洼�塾]dK1癄 チ 瓶�;釃JE�t娏s碠搏�U+Y)椽GJ狽�;~�抓@苵苧� �1��O逻/餧�+G鋒馤猪�7��'q箢 	鈱眦a~e=骣�沶濨��Wg穇1墌淄a惑扆:IK7
p�	/季e捹zg齴C=咥y々�1闠缄凍喈�2绢X黔淣#'憽A@<跋��;�2Bh悒kt軦�0喯a�(鶊D^蔋X蜠�5悴迴b橰组噾hA啐薏X#叩ac搎搮�2遠��:i�%�$埌E,>H荤�#萼z�=m@P%垕�$ ��9K圌挙�,q7媼�'])譤蕷e鎇瓆R+g;怫Xs炂Ut錽�愎rf:`K脨鲂_%淮qfGngOYs牲��9ns郡嚶m(H�
盷岔�'�:)鷯U䲢| @羮�4A舠�潓32�媐鵟PX8滑浚漸�2u窦�2囨8劈�"�:�
镚X�+5O旾湅�惷整悅%�鑱礹暚錟9�"O荄羆噥 $轥E�2 A幂@1v彆�dy�*鼅磍<=黹@]�%5j沈],郐G憝觖gA瑛7?	劊鱭If�%；Z鏘�勋�	�l�3�2;ytr�3)乆!0*U~1;U羜�2�
�$漬�:
滢�苨�莧�3諤鱳�0褴9Tw�*)a籵S鏏垠#毼鍝�偶獒�5+d瀾�40ˉ陿莂v園 <2�;q�	荖﹟�緍>[镊捦5顀蒮�)q*q	W�鍶YI�-�
xPP腪QA.TF�<8t獠k坒v楚￡澁M.�&素h$痧jX�/i>��4:5\讚屚酤B�谏t`間禒憐�,<�$]$闙鷷Q�(�5�:9﹠m觀3j煣;反吟\浿2B埞G 6煯+	J惩./Zdf溥(澎缰 D☉9
CO)q峭汧酜)擐�1��(L�:a覦8撷G(谯��{Zb廒`摈遀l(*�楨:\墩]臀躱-鮜H毙獝釂� H鮹鳴倊羺崭~�4襳/Oō;H捌�'躕,H餓&wTc)朤匫澟鬉燝&v憢h�#N氓w┆0�.茐N箨.^}雕�"  X镕?鏵Xp-拝)/�$a�?jPPF�黓Y:� 蔎蘕wu$璎妙H4l输穻愄LCkc%4�やQ檜俨真�*fW猾M蜃挥帵
4*.CL"隫J�P貥#Q闆�Z0=m>X��诎㳠滑蟅&6讨$b寅G�( G�-兪R�冶妫rD,s*K�捖�,飶�3n<囊諴邰埵垟荘駘�-籡l_砇�俧�
}4aF圃譊韙惭(�)R'J吏+E7s払酼腶d釞i枋N"��<爋沣缻糋褗[�$I7�?瑮腉�&皻銻阊懎鶆c敝�+F讲�$�氎)
%�绵�c5v晞C�\鶅魿]*J魔0�;V普梿)�4V肤�#kC)L?�H2�qI?q	�.�8&4侜莾-|D褿菥\�.战e痹T]�5IP玂^�,�>Nm誷l/E$*暔癍�&玜 瑐掋�1*K�#饑f妕�蔾Mj釯皯嵞樾口慟㈢愎D�殙){濭B'猆Oq`%3舉叹i;P樛/k鞷稦蟳嗮x乏{_蚢@c鑄噛�+丙份C��箁� �
簬�尝渜�煿+煁M5厖�%�#>U	-絫Ay� 綈笟?Gg�>杕 煔QP>ゥ壗d黸�8F斖v趭媒bW沷M凡�.寁�  �$9A
唎K聒�7鷋$菅�L殻猏訓�	�攝*�善免憅葌:�)0Y[？TV\R2�可射灙S烌糳遠�6MHx�� 2熹s"�疕Y鈥禒lp 澹粦л鐥梽Ham箩4耫A>�%w濫f諂�F/36全啿籑+C�2庽%蝚(塦(�	牻9骢惦|蓵�;魫
l謥镾猉qNef〩�脸慞璲鶽琱溛B朷�}pX}<m奸)I覘蠤W