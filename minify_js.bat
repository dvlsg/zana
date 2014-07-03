@ECHO OFF

SET git_path=.
SET src_path=%git_path%\src\web
SET compiler_path=%git_path%\compiler
SET test_path=%git_path%\tests\web
SET deployment_path=%git_path%\bin

SET compiler_file=%compiler_path%\compiler.jar
SET min_file=%deployment_path%\zutil.min.js
SET debug_file=%deployment_path%\zutil.debug.js
SET license_file=%git_path%\license.txt
SET unit_test_file=%test_path%\unitTests.js

ECHO Combining javascript files
IF NOT EXIST %deployment_path% MKDIR %deployment_path%
(
    TYPE %src_path%\base.js

    TYPE %src_path%\arrays.js
    TYPE %src_path%\assert.js
    TYPE %src_path%\check.js
    TYPE %src_path%\db.js
    TYPE %src_path%\events.js
    TYPE %src_path%\location.js
    TYPE %src_path%\log.js
    TYPE %src_path%\match.js
    TYPE %src_path%\objects.js
    TYPE %src_path%\stopwatch.js

) > %debug_file%
ECHO Minifying temporary javascript file
java -jar %compiler_file% --js %debug_file% --js_output_file %min_file%
ECHO Removing temporary javascript file
ECHO Attempting to deploy code and licensing to %deployment_path%
IF EXIST %deployment_path% (
    FOR %%f IN (
        %build_file%
        %debug_file%
        %license_file%
        %unit_test_file%
    ) DO (
        XCOPY %%f %deployment_path% /y > nul
    )
)
PAUSE