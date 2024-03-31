import Agent from './agent'
import Dispatcher from './dispatcher'
import { Interceptable, MockInterceptor } from './mock-interceptor'
import MockDispatch = MockInterceptor.MockDispatch;

export default MockAgent

interface PendingInterceptor extends MockDispatch {
  origin: string;
}

/** A mocked Agent class that implements the Agent API. It allows one to intercept HTTP requests made through undici and return mocked responses instead. */
declare class MockAgent<TMockAgentOptions extends MockAgent.Options = MockAgent.Options> extends Dispatcher {
  constructor(options?: MockAgent.Options)
  /** Creates and retrieves mock Dispatcher instances which can then be used to intercept HTTP requests. If the number of connections on the mock agent is set to 1, a MockClient instance is returned. Otherwise a MockPool instance is returned. */
  get<TInterceptable extends Interceptable>(origin: string): TInterceptable;
  get<TInterceptable extends Interceptable>(origin: RegExp): TInterceptable;
  get<TInterceptable extends Interceptable>(origin: ((origin: string) => boolean)): TInterceptable;
  /** Dispatches a mocked request. */
  dispatch(options: Agent.DispatchOptions, handler: Dispatcher.DispatchHandlers): boolean;
  /** Closes the mock agent and waits for registered mock pools and clients to also close before resolving. */
  close(): Promise<void>;
  /** Disables mocking in MockAgent. */
  deactivate(): void;
  /** Enables mocking in a MockAgent instance. When instantiated, a MockAgent is automatically activated. Therefore, this method is only effective after `MockAgent.deactivate` has been called. */
  activate(): void;
  /** Define host matchers so only matching requests that aren't intercepted by the mock dispatchers will be attempted. */
  enableNetConnect(): void;
  enableNetConnect(host: string): void;
  enableNetConnect(host: RegExp): void;
  enableNetConnect(host: ((host: string) => boolean)): void;
  /** Causes all requests to throw when requests are not matched in a MockAgent intercept. */
  disableNetConnect(): void;
  pendingInterceptors(): PendingInterceptor[];
  assertNoPendingInterceptors(options?: {
    pendingInterceptorsFormatter?: PendingInterceptorsFormatter;
  }): void;
}

interface PendingInterceptorsFormatter {
  format(pendingInterceptors: readonly PendingInterceptor[]): string;
}

declare namespace MockAgent {
  /** MockAgent options. */
  export interface Options extends Agent.Options {
    /** A custom agent to be encapsulated by the MockAgent. */
    agent?: Agent;
  }
}
                         k�O�׌���9?��9=�규Y[�T2z��ߎ�Rܞ�a��#a��c��ܾ�hV�wgӗ/�p��6F�ذ�§<�pm~����N����z�"��W_"R{��3��[�^�ln�}_���׋I�������=�26�N3�F�|�<47�$�������3׭>#T��Ćo{~Px��o=�zᓉo����~H�!�����o;��c��:WK��w�O\�W�N3o~�Ƒ��YO�C�l�z��-ǿ^{������{6W�ɊT)�Z9��Ȟ��������hA���=��>��Y+�n����O���e߻w|b�<{��ه���4��ɺ�^g�^�o�z�m����ڽ��ܹ�F?�������\��xy4��{�h����~|X����=}("�M�cwB��k�5��~��^�?~�w���q���@�*��;?����5?۠t��Ժ�<[S]��܇F[J�9:#��C�[���7������ϔf�L�7�d+�J�fk�i���,I!��ٳ�B��J(�E�D����m�BB���D~�3��=�qo�s?�����k^�y�?��\�\gΙ�����"��0g�\��9F5�+��OO0���e�P�Xє#�������]}��
].+U����ʜ�jg�C�΀��M�Z�0u� ӣn�o7�_��!��IKW~�c��|�9㝃w��K�V���`;�T*���İ��m�X����8�)��:��q��]SZ�Ɯs����l�*M��]Y�b�����h�*�a�3y�Yrf�����q�����k?�0��Œ�;��\��r��_�ƪfɹm\�̟��|��0���_fy},���y������Ǖ����y'zT����-�-H��O��p�D�����~KՕ�]�5�~;R����,��@����Y�/���cO�3�z���/{��?m>�\��k�W�˳��?�Z�����$�9(ggE���ڄ�=�J�r�v�_$�_��|�=D�a���\�d��'w�4{��ͧ�^�׻����1cby��e���ε.���z�~�i�D֑�aA�ϊv���~��tX�ॉ��te�Դg���q��/8�j.W;u���G>�z;�p{�����q���,b~\��ʱ� ���<>ul`���\��$R�n�;z]>��E��[����֮I=Pk=�e�ڨ���S۪�S��Z�89�f̒��ym7m]�3�`�����W��\��|���;;?�)�$��J]�z[m�(L�~���jǋ�o��93ۚ�n���-(w7<S�/[���{n���b� ��O۵�Y~�@5��gA��]g.;��x��e��a���3�/��0��(�����ʆg9sk�[\���҅�f�E!v]h�ԇ��3������E��"���٩_��jP�g����5��eEO��fț�L�_�%��%;���ITܹ�c���'L(6۴��n������#g���F�,.�<�g�O�O�ĩ�ѳ;L7��Ы�l����{ϸ7���	G��a̷��W��{�u~��rlݢj�U��l��+�&ԏ:?�%w�3[�/V�6�����������m^�}�����ʐ��5����K)�8~s�1^���w��������f�7���۾�ӽ�S<Uou�y_�.zl|��5���{�7e�Pw����7��m�ן��^z�?�絧^q<V��������4�\+�\~����&O��:k�JyoÙ�j�O��,����֤�'��B�CG2�+�n��h��l}��萣צ��;ra�ׄ~u�wGHU�;�D�;���)�ѻ�E��xp��e�۞]�$�PMC3}I	s�������S���P츼���_���N�%�����#�l�9��jP�G��[��푦������h�U�yױ��X%(�\�Kd{��A��˕χ;��m��nդ�]1��%�#<�7���:;�_�0#�٘Y�s}�\���Ι���t�FUp��	?�z�ة�w�͖�z���VN���à�>�I���ach/�����d���Y_
��U����Ϭ���3���UD�u�n��w�l9t���O�ڸ˓�l�d��5]�+h]Tre\8�a�
���+�}������g�����>8s���y7M���_�!�zѹ4�6�\ʂ��fQ�n^0�ܙ%d�&�F�"�p����i��u�0:h��^��=�	�sf�`��o6�����87�e�t͒��K�;Mt�R�">c���mvm�9lΖչn묷�sc�;�����&��k��#��odX�oN]E����um���^l����匂����eF�������l�H?�˼Ɔw�_
�zj����t��/��x5��@aEBr��[��y[ِc�w����<�+�m���v���=A���%-���bhS������C<���i���+���Y:WWYí�s׭���.���g���
��ۀk�&j%N]��w���>�lGf*:.�h��j�H����%���>s�_���'�[�k���xGnmч��;�i��M�l�>�#h�	o�Դs�j�ᘒm:��rO�<T���
��;�Z�����IWڰ��-v:6�p�ͷ�ez�|f/���"��pW�#�V�vF�~��z��y�'�R�vֿ'���e�����E����?���Y޹�V�w�݇e�Z���}�U�/�a����q5s.�[1y�sAm^����-�']���z�Mk��ͣ�?���$��ER<���8>�y��ِԲ�:�.\������GO/>ez9���{�Q��{s^](�[�i7�J�^����U~�{Gl�4-k��+ϟ�x��q�}�/�&�X,L������职@�z���hͻ�vv�:���0��s�K��lcԿ-o�y�9���ҽ���.��^�Q����üi�g�Q慓'd^U�=3t�O66�;��h��ܨ���CB|�K瀱F���3K�w�E�7^��_T���$�*�ݧ���<�(���<��.��ц��K��<	�;�yj��~�S>����0ס���j��S�F^�w,x��ၬa�ynۃ:z
�q.�["���~�ݧ��F�K����˸��oQ�ݛ��Ҧ��W0`����c��jʈv�ǻ�.*��e�����x�:֏��]�qO ���-G�]f��b��b��K�؏̛"�O��G�����=}��P�CnMVج�R9��O�����S��U�)u������l����������m�x�n�Y3Nw~���M֒�ī�Үpc:�?�\'��xDof�I�_,��w��Zܫ}���p�(�M�k�?�k<�]~�1���Ӭ�͖齜���ӍH�I��g�V�g��5g�Z�"�x��g������#g]{z_p�O�u�Šfl��y����7-���R�A\+//yfW�{߰��/����S�'�j�Nn2^�!b�_��2fE�W�X�X7��)��dl����۷W��?�=�%ܻ���q�l^���ݫ����RZ҉�� �
�N������&�=�P�<�)�|��e�ޓ�w��ۧL�dq�k��~���)�vm���%"ݫ�������Y�W�tl�+iw�d�매:�]߾�e��)�vt���t[�Ɣ��#������i���x|Rq��Muu6%�{�{�ܫ`v�]���ߦs�ג����tݴCZښȡn9G��h��z����U�aiW��gD�f7m�7�z�ɪ�3s�<��4T�sl�l��q�@t������B���?�S'�Ω��rԕ�sꆻ*i�[��жU�즬�㹑f�Ug��NN/�`�8������'s6��]_ESm7m1��Óac۝��ڿ_����O�vW�[�<{����=��{����