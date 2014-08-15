@ECHO OFF

SET git_path=.
SET src_path=%git_path%\src\web
SET node_path=%git_path%\src\node
SET compiler_path=%git_path%\compiler
SET test_path=%git_path%\tests\web
SET deployment_path=%git_path%\bin
SET deployment_path_web=%deployment_path%\web
SET deployment_path_node=%deployment_path%\nodejs

SET compiler_file=%compiler_path%\compiler.jar
SET min_file=%deployment_path_web%\zutil.min.js
SET source_map_file=%deployment_path_web%\zutil.min.js.map
SET debug_file=%deployment_path_web%\zutil.debug.js
SET source_map_format=V3
SET license_file=%git_path%\license.txt
SET unit_test_file=%test_path%\unitTests.js

ECHO Combining javascript files
IF NOT EXIST %deployment_path% MKDIR %deployment_path%
IF NOT EXIST %deployment_path_node% MKDIR %deployment_path_node%
IF NOT EXIST %deployment_path_web% MKDIR %deployment_path_web%
(
    TYPE %src_path%\base.js

    TYPE %src_path%\arrays.js
    TYPE %src_path%\assert.js
    TYPE %src_path%\cache.js
    TYPE %src_path%\check.js
    TYPE %src_path%\convert.js
    TYPE %src_path%\events.js
    TYPE %src_path%\functions.js
    TYPE %src_path%\location.js
    TYPE %src_path%\log.js
    TYPE %src_path%\numbers.js
    TYPE %src_path%\objects.js
    TYPE %src_path%\stopwatch.js

) > %debug_file%
ECHO Minifying combined javascript file
java -jar %compiler_file% --language_in=ECMASCRIPT5 --js %debug_file% --create_source_map %source_map_file% --source_map_format %source_map_format% --js_output_file %min_file%
ECHO Attempting to deploy standard code and licensing to %deployment_path_web%
IF EXIST %deployment_path_web% (
    FOR %%f IN (
        %license_file%
        %unit_test_file%
    ) DO (
        XCOPY %%f %deployment_path_web% /y > nul
    )
)
ECHO Attempting to deploy nodejs code and licensing to %deployment_path_node%
IF EXIST %deployment_path_node% (
    FOR /R %src_path% %%f IN (*.js) DO XCOPY %%f %deployment_path_node% /y > nul
    FOR /R %node_path% %%f IN (*.js) DO XCOPY %%f %deployment_path_node% /y > nul
)
PAUSE