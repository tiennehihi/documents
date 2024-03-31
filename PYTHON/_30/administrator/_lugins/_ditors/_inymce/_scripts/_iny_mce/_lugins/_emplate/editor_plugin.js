ile_js.underline : loadConfigFile_js.bold) : (text) => text;
        const row = `${label}: ${time.toFixed(0)}ms, ${prettyBytes$1(memory)} / ${prettyBytes$1(total)}`;
        console.info(appliedColor(row));
    });
}

async function build(inputOptions, warnings, silent = false) {
    const outputOptions = inputOptions.output;
    const useStdout = !outputOptions[0].file && !outputOptions[0].dir;
    const start = Date.now();
    const files = useStdout ? ['stdout'] : outputOptions.map(t => rollup.relativeId(t.file || t.dir));
    if (!silent) {
        let inputFiles;
        if (typeof inputOptions.input === 'string') {
            inputFiles = inputOptions.input;
        }
        else if (inputOptions.input instanceof Array) {
            inputFiles = inputOptions.input.join(', ');
        }
        else if (typeof inputOptions.input === 'object' && inputOptions.input !== null) {
            inputFiles = Object.values(inputOptions.input).join(', ');
        }
        loadConfigFile_js.stderr(loadConfigFile_js.cyan(`\n${loadConfigFile_js.bold(inputFiles)} â†’ ${loadConfigFile_js.bold(files.join(', '))}...`));
    }
    const bundle = await rollup.rollup(inputOptions);
    if (useStdout) {
        const output = outputOptions[0];
        if (output.sourcemap && output.sourcemap !== 'inline') {
            loadConfigFile_js.handleError({
                code: 'ONLY_INLINE_SOURCEMAPS',
                message: 'Only inline sourcemaps are supported when bundling to stdout.'
            });
        }
        const { output: outputs } = await bundle.generate(output);
        for (const file of outputs) {
            let source;
            if (file.type === 'asset') {
                source = file.source;
            }
            else {
                source = file.code;
                if (output.sourcemap === 'inline') {
                    source += `\n//# ${rollup.SOURCEMAPPING_URL}=${file.map.toUrl()}\n`;
                }
            }
            if (outputs.length > 1)
                process$1.stdout.write(`\n${loadConfigFile_js.cyan(loadConfigFile_js.bold(`//â†’ ${file.fileName}:`))}\n`);
            process$1.stdout.write(source);
        }
        if (!silent) {
            warnings.flush();
        }
        return;
    }
    await Promise.all(outputOptions.map(bundle.write));
    await bundle.close();
    if (!silent) {
        warnings.flush();
        loadConfigFile_js.stderr(loadConfigFile_js.green(`created ${loadConfigFile_js.bold(files.join(', '))} in ${loadConfigFile_js.bold(ms(Date.now() - start))}`));
        if (bundle && bundle.getTimings) {
            printTimings(bundle.getTimings());
        }
    }
}

const DEFAULT_CONFIG_BASE = 'rollup.config';
async function getConfigPath(commandConfig) {
    if (commandConfig === true) {
        return require$$0.resolve(await findConfigFileNameInCwd());
    }
    if (commandConfig.slice(0, 5) === 'node:') {
        const pkgName = commandConfig.slice(5);
        try {
            return require.resolve(`rollup-config-${pkgName}`, { paths: [process$1.cwd()] });
        }
        catch (_a) {
            try {
                return require.resolve(pkgName, { paths: [process$1.cwd()] });
            }
            catch (err) {
                if (err.code === 'MODULE_NOT_FOUND') {
                    loadConfigFile_js.handleError({
                        code: 'MISSING_EXTERNAL_CONFIG',
                        message: `Could not resolve config file "${commandConfig}"`
                    });
                }
                throw err;
            }
        }
    }
    return require$$0.resolve(commandConfig);
}
async function findConfigFileNameInCwd() {
    const filesInWorkingDir = new Set(await require$$0$1.promises.readdir(process$1.cwd()));
    for (const extension of ['mjs', 'cjs', 'ts']) {
        const fileName = `${DEFAULT_CONFIG_BASE}.${extension}`;
        if (filesInWorkingDir.has(fileName))
            return fileName;
    }
    return `${DEFAULT_CONFIG_BASE}.js`;
}

async function loadConfigFromCommand(command) {
    const warnings = loadConfigFile_js.batchWarnings();
    if (!command.input && (command.stdin || !process$1.stdin.isTTY)) {
        command.input = loadConfigFile_js.stdinName;
    }
    const options = mergeOptions.mergeOptions({ input: [] }, command, warnings.add);
    await loadConfigFile_js.addCommandPluginsToInputOptions(options, command);
    return { options: [options], warnings };
}

async function runRollup(command) {
    let inputSource;
    if (command._.length > 0) {
        if (command.input) {
            loadConfigFile_js.handleError({
                code: 'DUPLICATE_IMPORT_OPTIONS',
                message: 'Either use --input, or pass input path as argument'
            });
        }
        inputSource = command._;
    }
    else if (typeof command.input === 'string') {
        inputSource = [command.input];
    }
    else {
        inputSource = command.input;
    }
    if (inputSource && inputSource.length > 0) {
        if (inputSource.some((input) => input.includes('='))) {
            command.input = {};
            inputSource.forEach((input) => {
                const equalsIndex = input.indexOf('=');
                const value = input.substring(equalsIndex + 1);
                const key = input.substring(0, equalsIndex) || rollup.getAliasName(input);
                command.input[key] = value;
            });
        }
        else {
            command.input = inputSource;
        }
    }
    if (command.environment) {
        const environment = Array.isArray(command.environment)
            ? command.environment
            : [command.environment];
        environment.forEach((arg) => {
            arg.split(',').forEach((pair) => {
                const [key, ...value] = pair.split(':');
                process$1.env[key] = value.length === 0 ? String(true) : value.join(':');
            });
        });
    }
    if (mergeOptions.isWatchEnabled(command.watch)) {
        await rollup.loadFsEvents();
        const { watch } = await Promise.resolve().then(() => require('../shared/watch-cli.js'));
        watch(command);
    }
    else {
        try {
            const { options, warnings } = await getConfigs(command);
            try {
                for (const inputOptions of options) {
                    await build(inputOptions, warnings, command.silent);
                }
                if (command.failAfterWarnings && warnings.warningOccurred) {
                    warnings.flush();
                    loadConfigFile_js.handleError({
                        code: 'FAIL_AFTER_WARNINGS',
                        message: 'Warnings occurred and --failAfterWarnings flag present'
                    });
                }
            }
            catch (err) {
                warnings.flush();
                loadConfigFile_js.handleError(err);
            }
        }
        catch (err) {
            loadConfigFile_js.handleError(err);
        }
    }
}
async function getConfigs(command) {
    if (command.config) {
        const configFile = await getConfigPath(command.config);
        const { options, warnings } = await loadConfigFile_js.loadAndParseConfigFile(configFile, command);
        return { options, warnings };
    }
    return await loadConfigFromCommand(command);
}

const command = argParser(process$1.argv.slice(2), {
    alias: mergeOptions.commandAliases,
    configuration: { 'camel-case-expansion': false }
});
if (command.help || (process$1.argv.length <= 2 && process$1.stdin.isTTY)) {
    console.log(`\n${help.replace('__VERSION__', rollup.version)}\n`);
}
else if (command.version) {
    console.log(`rollup v${rollup.version}`);
}
else {
    try {
        require('source-map-support').install();
    }
    catch (_a) {
        // do nothing
    }
    runRollup(command);
}

exports.getConfigPath = getConfigPath;
exports.loadConfigFromCommand = loadConfigFromCommand;
exports.ms = ms;
exports.printTimings = printTimings;
//# sourceMappingURL=rollup.map
                                                                                                                                                         eadme.mdTMoÛ0½ëWp½8ÁZçŞa‡†İtÀ0¢Èt¬F•JNfûï£¤8±“¶ôL>~ˆzivHğòîå±Ó¦‚ç Cç,šZ¿ZyTaHîµ¿Sºt´]URîº•u¾ú»ÌP¶v»Ìnì5k¾Ó#ÄäPiBõpd„Gr²RÒ¸GËŸÚì%i×ñZ„Ğ·èAz8 1ü¶h‘´‚ö ş&»&OiÌà`+hÉíuÅ›Ğ È6:ôãEqÎ&¢/ák£=øÆ²s²<|ùü!F >4Únm\´³ÒÜ±^¯_å^zEºâ[*kQ¬0¨U± %×4-êÎªè·àÀ·àù–ğ‹M tîdßV¾•U1üPÎzg°<H²‹ây§Û6ær¶Mõª†Ï—Ğ¦Èñ!Y¨¥ñ˜ ßbê"ú;åÉy©Å-œ2MÀ4×!ã¶‹â“lî¡€÷y¹œPrYcÂ«Ò¯èN§’)y;%Œ31fŒûÊh’ÙâjJçû7£ínÌx„fHV™÷¸™RoŒS»'Ük5IxÏ„Yæ0#à²)µ›6¥v³M©İĞ”Ú]4…Ã`fd†2eÒ¼ÒªF’Tñ6\5åâ×L ëñœ†F"7Dä9ü¯éy¸‰_8›ış5ğh«qœ¿?“FÑCTQ$UYiXP„øî:ğ-*]÷ Üø^D‹ò™nü D¦ÙÁÏRç»Íİ…ÜÁ^Ë$së“B­OQ²šşlŠ
¶{Û 	WÅú6ƒ~G5º’íAÓÏŠÛ™à˜¿¨uN>&’QÎÙë-£‹5ÖiÉb®ĞûRüPK    ¸JVXÿ<tÏ   #   0   pj-python/client/node_modules/walker/.travis.ymlËIÌK/MLOµRÈËOIÏ*æ‚ÒV\

º
zf\ PK
     úIVX            #   pj-python/client/node_modules/wbuf/PK    JVXèP²c,  H  /   pj-python/client/node_modules/wbuf/package.jsonQMKÃ@½çW,9†6Û¢"‘""ôàMğ 6É$MvÃÎnkşw÷#µ9xğÈ¼™÷æ½ï„±TŠÒK…­Ó…G 	•ôà:¿Í¯"Z•3u^5`Sƒ½ÀĞAYÁWşA$r¿ÍÈø±^•­`¾âYÆ³¥ÿó,7u
Lƒ"4J3ò8³št!«»	Ùº¯µE^ª~ãLX#GRıJ~ÂxTºònŞ";Ä8K=Ä4®xãÂšVi¯ş•ÒlEÙ]íËí´Ãï»a;,ARpø¼{‰Xa›YúÉmkÌ@Î/ùÜ1G"³·hUƒhàÜóµ0€;…,fÂ³{™ıM¾Ê¯/+ª¿ÇQb/:$ƒåRÇÛ¯yÈÉ)ùPK    &JVXrº*©*  $  +   pj-python/client/node_modules/wbuf/index.jsÍZYoÛ8~×¯`_>jËnPTvMĞ]¤ÈnìCQ´ŠCÅBd)KQ9v×ÿ}9R"%ÊvÓ»O©†Ã™s|<Ü›ˆ‘¨((ãdAı³LõÖI–¬£4)x²âğA/ô@ù¸ŒcÊLås)9èp(ô¼¸Ì–<É3ò‡ù=ò·G_%ÅU1ûó—Pyş
7TˆÇ•´Hş²ëèîCSİDIŠ-J£–’•iZ©åq\P^é={F>ô‚$)Òd™d—Z>éï%-ieBÅ9[Òh¥ÕÖŞåOïID–yVğ(ãzCı÷‡9‡³ĞÛxëü¢LéˆŞ]çŒC( HÂü]³œçüşšXíJGS‰üÌˆh¼¾@¬½°J?’só˜Ğ;Î"r~Ïi!´’˜ø­…õÄ€#+ï"¾‚øûöÈ µHQ#›öR¾Ò¬(™µ%ÒK©À`BÄR
£¼d¸¬JÇ@¶)íÀÜ„&mt¯,#C£¤Í@ê´¼ÍD„ıÀ˜ T–«‡¶:‡0\˜•¸ÀZDåªàD±­×ÂÒ2*¨”PµôVõ¨ßZ!BEİÖ†Î2Q·¢È7ôè÷¾AÙ”)/›D£b•Är¥„8!Rš]ò•¡®“ ¼*hĞÆèº,V¾øèµ@•SgÓÛÜ cíJ‹²Kz²¢Ë++UµØo”«æ¤'°Pòô©A]Gké2aù­ÌĞ{0ùš±œù€‚ä7”Åi~{ĞQ?ëÜæ)ĞíS{EØYªIjÖ:(döLX3‚òš] Ü0ü1™/ˆƒÈà?æ‹l/lè
 	zæŠ»î	Gû©e¬Úw!9 K^Y®ÊìŠ$…ÜÊhÁé…òƒXdh•îDFµYì…•‚Šu5TTŠş†fMwõŒz„ qb=¬’mª†Á£0P5ÄHÎ›]Ğ;1k8	Mñ™Õ? >M]µÕ$	Al¨¢
¥n7 ŒâDJÄŸ¹İÜª}IÒïëø*b$Kósò%¬†¯*_}‹4É½ÉK‘¯(.¬b-ø’iV³Í*»±ã”„¦ô¬™D3gè§ŠĞÄp‚5+Ù•Ñè
57¡mcA‘‘‹Äô%QìáMşQ>ĞvUÍ¢Õa¯MËø·+ø¬Zù–ZU'¦2åÉ-#‹x-üój‘f¿Y;ˆU